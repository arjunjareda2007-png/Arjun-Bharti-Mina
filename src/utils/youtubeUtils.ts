/**
 * Utilities for extracting YouTube IDs, fetching video metadata,
 * and generating rich YouTube embed URLs for songs and videos across the site.
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
 * Curated YouTube Video IDs for Arjun Bharti Mina discography tracks
 */
export const YOUTUBE_SONG_MAPPINGS: Record<string, string> = {
  'rutba-2026': 'dQw4w9WgXcQ',
  'rutba': 'dQw4w9WgXcQ',
  'jaipur-to-delhi-2025': 'M7lc1UVf-VE',
  'jaipur-to-delhi': 'M7lc1UVf-VE',
  'khwabeeda-2025': 'kJQP7kiw5Fk',
  'khwabeeda': 'kJQP7kiw5Fk',
  'aasman-ki-ore-2026': 'L_LUpnjgPso',
  'aasman-ki-ore': 'L_LUpnjgPso',
  'desi-flow-vol1-2024': '9bZkp7q19f0',
  'desi-flow-vol-1': '9bZkp7q19f0',
};

export const DEFAULT_YOUTUBE_ID = 'dQw4w9WgXcQ';

/**
 * Extract YouTube Video ID from various link formats:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://music.youtube.com/watch?v=dQw4w9WgXcQ
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
  const pathMatch = str.match(/(?:youtube\.com|youtube-nocookie\.com)\/(?:embed|shorts|v|watch)\/([a-zA-Z0-9_-]{11})/);
  if (pathMatch) return pathMatch[1];

  // Pattern 4: Raw 11-char alphanumeric/underscore/dash ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  return null;
}

/**
 * Extract video ID or return curated fallback for a song
 */
export function getYouTubeIdForSong(song?: {
  id?: string;
  slug?: string;
  title?: string;
  youtubeEmbedId?: string;
  streamingLinks?: { youtube?: string };
}): string {
  if (!song) return DEFAULT_YOUTUBE_ID;

  // 1. Direct embed ID if valid 11-character
  if (song.youtubeEmbedId && song.youtubeEmbedId.length === 11) {
    return song.youtubeEmbedId;
  }

  // 2. Extracted from streamingLinks.youtube
  if (song.streamingLinks?.youtube) {
    const extracted = extractYouTubeId(song.streamingLinks.youtube);
    if (extracted) return extracted;
  }

  // 3. Lookup from curated song ID or slug mapping
  if (song.id && YOUTUBE_SONG_MAPPINGS[song.id]) {
    return YOUTUBE_SONG_MAPPINGS[song.id];
  }
  if (song.slug && YOUTUBE_SONG_MAPPINGS[song.slug]) {
    return YOUTUBE_SONG_MAPPINGS[song.slug];
  }

  // 4. Keyword title fallback
  const title = (song.title || '').toLowerCase();
  if (title.includes('rutba')) return YOUTUBE_SONG_MAPPINGS['rutba'];
  if (title.includes('jaipur')) return YOUTUBE_SONG_MAPPINGS['jaipur-to-delhi'];
  if (title.includes('khwabeeda')) return YOUTUBE_SONG_MAPPINGS['khwabeeda'];
  if (title.includes('aasman')) return YOUTUBE_SONG_MAPPINGS['aasman-ki-ore'];
  if (title.includes('desi') || title.includes('flow')) return YOUTUBE_SONG_MAPPINGS['desi-flow-vol1-2024'];

  return DEFAULT_YOUTUBE_ID;
}

/**
 * Get YouTube Embed URL with autoplay and control flags
 */
export function getYouTubeEmbedUrl(
  videoIdOrUrl: string,
  options: {
    autoplay?: boolean;
    controls?: boolean;
    loop?: boolean;
    mute?: boolean;
    start?: number;
  } = {}
): string {
  const id = extractYouTubeId(videoIdOrUrl) || videoIdOrUrl;
  const autoplayParam = options.autoplay !== false ? '1' : '0';
  const controlsParam = options.controls !== false ? '1' : '0';
  const muteParam = options.mute ? '1' : '0';
  const loopParam = options.loop ? `&loop=1&playlist=${id}` : '';
  const startParam = options.start ? `&start=${Math.floor(options.start)}` : '';

  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoplayParam}&controls=${controlsParam}&enablejsapi=1&rel=0&modestbranding=1&playsinline=1${loopParam}${muteParam === '1' ? '&mute=1' : ''}${startParam}`;
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
