/**
 * YouTube Utility functions for extracting IDs, generating thumbnails,
 * embedding players, and fetching live video metadata.
 */

export interface YouTubeMetadata {
  videoId: string;
  title?: string;
  author?: string;
  authorUrl?: string;
  thumbnail: string;
  watchUrl: string;
  embedUrl: string;
}

/**
 * Extracts YouTube Video ID from virtually any YouTube URL format.
 */
export function extractYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If it's already an 11-char alphanumeric/dash/underscore ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle various URL formats
  try {
    // Check for standard watch?v= parameter
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) return watchMatch[1];

    // Check for youtu.be/ID
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch && shortMatch[1]) return shortMatch[1];

    // Check for /embed/ID
    const embedMatch = trimmed.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch && embedMatch[1]) return embedMatch[1];

    // Check for /shorts/ID
    const shortsMatch = trimmed.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

    // Check for /v/ID or /e/ID
    const vMatch = trimmed.match(/\/(?:v|e)\/([a-zA-Z0-9_-]{11})/);
    if (vMatch && vMatch[1]) return vMatch[1];

    // General fallback regex
    const generalMatch = trimmed.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (generalMatch && generalMatch[1]) return generalMatch[1];
  } catch (e) {
    console.warn('Error parsing YouTube URL:', e);
  }

  return null;
}

/**
 * Returns the highest quality thumbnail URL for a given YouTube Video ID or URL.
 */
export function getYouTubeThumbnail(urlOrId?: string, quality: 'maxres' | 'hq' | 'mq' | 'default' = 'maxres'): string {
  const id = extractYouTubeId(urlOrId);
  if (!id) {
    return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800';
  }
  const filename = quality === 'maxres' ? 'maxresdefault.jpg' : quality === 'hq' ? 'hqdefault.jpg' : 'mqdefault.jpg';
  return `https://img.youtube.com/vi/${id}/${filename}`;
}

/**
 * Returns the privacy-enhanced embed URL for a YouTube video.
 */
export function getYouTubeEmbedUrl(urlOrId?: string, autoplay = true): string {
  const id = extractYouTubeId(urlOrId) || 'dQw4w9WgXcQ';
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`;
}

/**
 * Returns the canonical YouTube watch URL.
 */
export function getYouTubeWatchUrl(urlOrId?: string): string {
  const id = extractYouTubeId(urlOrId) || '';
  return id ? `https://www.youtube.com/watch?v=${id}` : 'https://youtube.com';
}

/**
 * Fetches title and metadata for a YouTube link using standard oEmbed service.
 */
export async function fetchYouTubeMetadata(urlOrId: string): Promise<YouTubeMetadata | null> {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;

  const defaultMeta: YouTubeMetadata = {
    videoId,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
  };

  try {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    // Using noembed (which has full CORS enabled for browser apps)
    const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(watchUrl)}`;
    
    const response = await fetch(oembedUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.title) {
        return {
          videoId,
          title: data.title,
          author: data.author_name || 'Arjun Bharti Mina',
          authorUrl: data.author_url,
          thumbnail: data.thumbnail_url || defaultMeta.thumbnail,
          watchUrl,
          embedUrl: defaultMeta.embedUrl
        };
      }
    }
  } catch (err) {
    console.warn('Could not reach oEmbed endpoint, using fallback metadata:', err);
  }

  return defaultMeta;
}
