/**
 * Utilities for extracting YouTube IDs, fetching video metadata (title, thumbnail, author)
 * via YouTube oEmbed API without requiring API keys.
 */

export interface YouTubeMetadata {
  id: string;
  title: string;
  authorName: string;
  thumbnailUrl: string;
  thumbnail: string;
  embedUrl: string;
}

/**
 * Extract YouTube Video ID from various link formats:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 */
export function extractYouTubeId(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const str = url.trim();

  // Pattern 1: standard v= parameter
  const vMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (vMatch) return vMatch[1];

  // Pattern 2: youtu.be/ID
  const shortMatch = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Pattern 3: embed/ID or shorts/ID
  const pathMatch = str.match(/youtube\.com\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]{11})/);
  if (pathMatch) return pathMatch[1];

  // Pattern 4: Raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  return null;
}

/**
 * Get YouTube Embed URL
 */
export function getYouTubeEmbedUrl(videoIdOrUrl: string): string {
  const id = extractYouTubeId(videoIdOrUrl) || videoIdOrUrl;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`;
}

/**
 * Get high resolution thumbnail URL for a YouTube Video
 */
export function getYouTubeThumbnail(videoIdOrUrl: string, quality: 'max' | 'maxres' | 'hq' | 'mq' = 'max'): string {
  const id = extractYouTubeId(videoIdOrUrl) || videoIdOrUrl;
  if (!id) return '';
  if (quality === 'max' || quality === 'maxres') return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  if (quality === 'hq') return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

/**
 * Fetch YouTube Video Title, Author, and Thumbnail using YouTube's free oEmbed API
 */
export async function fetchYouTubeMetadata(urlOrId: string): Promise<YouTubeMetadata | null> {
  const id = extractYouTubeId(urlOrId);
  if (!id) return null;

  const standardUrl = `https://www.youtube.com/watch?v=${id}`;
  const defaultThumb = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  try {
    const oembedEndpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(standardUrl)}&format=json`;
    const res = await fetch(oembedEndpoint);
    
    if (res.ok) {
      const data = await res.json();
      const thumb = data.thumbnail_url || defaultThumb;
      return {
        id,
        title: data.title || 'YouTube Video',
        authorName: data.author_name || 'Arjun Bharti Mina',
        thumbnailUrl: thumb,
        thumbnail: thumb,
        embedUrl: getYouTubeEmbedUrl(id)
      };
    }
  } catch (err) {
    console.warn('oEmbed fetch error, using direct metadata fallback:', err);
  }

  // Fallback if oEmbed is network restricted or offline
  return {
    id,
    title: 'Music Video',
    authorName: 'Arjun Bharti Mina',
    thumbnailUrl: defaultThumb,
    thumbnail: defaultThumb,
    embedUrl: getYouTubeEmbedUrl(id)
  };
}
