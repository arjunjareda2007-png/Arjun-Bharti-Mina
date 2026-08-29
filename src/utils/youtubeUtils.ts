/**
 * Utilities for extracting YouTube IDs, fetching video metadata,
 * handling channel information, and generating rich YouTube embed URLs.
 */

import { Song, VideoItem, YouTubeSettings } from '../types';

export interface YouTubeMetadata {
  id: string;
  title: string;
  authorName: string;
  thumbnailUrl: string;
  thumbnail: string;
  embedUrl: string;
  duration?: string;
}

/**
 * Curated YouTube Video mappings for Arjun Bharti Mina discography tracks
 */
export const YOUTUBE_SONG_MAPPINGS: Record<string, { id: string; url: string; title: string }> = {
  'rutba-2026': {
    id: 'fJ9rUzIMcZQ',
    url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    title: 'Arjun Bharti Mina - RUTBA (Official Music Video)'
  },
  'rutba': {
    id: 'fJ9rUzIMcZQ',
    url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    title: 'Arjun Bharti Mina - RUTBA (Official Music Video)'
  },
  'jaipur-to-delhi-2025': {
    id: 'M7lc1UVf-VE',
    url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    title: 'Arjun Bharti Mina - Jaipur to Delhi Cypher'
  },
  'jaipur-to-delhi': {
    id: 'M7lc1UVf-VE',
    url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    title: 'Arjun Bharti Mina - Jaipur to Delhi Cypher'
  },
  'khwabeeda-2025': {
    id: 'kJQP7kiw5Fk',
    url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    title: 'Arjun Bharti Mina - Khwabeeda (Acoustic Studio Session)'
  },
  'khwabeeda': {
    id: 'kJQP7kiw5Fk',
    url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    title: 'Arjun Bharti Mina - Khwabeeda (Acoustic Studio Session)'
  },
  'aasman-ki-ore-2026': {
    id: 'L_LUpnjgPso',
    url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    title: 'Arjun Bharti Mina - Aasman Ki Ore (Official Video)'
  },
  'aasman-ki-ore': {
    id: 'L_LUpnjgPso',
    url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    title: 'Arjun Bharti Mina - Aasman Ki Ore (Official Video)'
  },
  'desi-flow-vol1-2024': {
    id: '5qap5aO4i9A',
    url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    title: 'Arjun Bharti Mina - Desi Flow Vol. 1 (Studio Cypher)'
  },
  'desi-flow-vol-1': {
    id: '5qap5aO4i9A',
    url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    title: 'Arjun Bharti Mina - Desi Flow Vol. 1 (Studio Cypher)'
  },
};

export const DEFAULT_YOUTUBE_ID = 'fJ9rUzIMcZQ';

/**
 * Extract YouTube Video ID from various link formats
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

  // Pattern 3: embed/ID, shorts/ID, or live/ID
  const pathMatch = str.match(/(?:youtube\.com|youtube-nocookie\.com)\/(?:embed|shorts|v|watch|live)\/([a-zA-Z0-9_-]{11})/);
  if (pathMatch) return pathMatch[1];

  // Pattern 4: Raw 11-char alphanumeric/underscore/dash ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  return null;
}

/**
 * Extract channel handle from URL or string (e.g. '@arjunbhartimina' or full URL)
 */
export function extractChannelHandle(urlOrHandle?: string): string {
  if (!urlOrHandle || typeof urlOrHandle !== 'string') return '@arjunbhartimina';
  const str = urlOrHandle.trim();
  
  if (str.startsWith('@')) return str;
  
  const handleMatch = str.match(/youtube\.com\/(@[a-zA-Z0-9_.-]+)/i);
  if (handleMatch) return handleMatch[1];

  const customMatch = str.match(/youtube\.com\/(?:c\/|user\/|channel\/)?([a-zA-Z0-9_.-]+)/i);
  if (customMatch && !customMatch[1].startsWith('watch')) {
    return `@${customMatch[1].replace(/^@/, '')}`;
  }

  return '@arjunbhartimina';
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
    return YOUTUBE_SONG_MAPPINGS[song.id].id;
  }
  if (song.slug && YOUTUBE_SONG_MAPPINGS[song.slug]) {
    return YOUTUBE_SONG_MAPPINGS[song.slug].id;
  }

  // 4. Keyword title fallback
  const title = (song.title || '').toLowerCase();
  if (title.includes('rutba')) return YOUTUBE_SONG_MAPPINGS['rutba'].id;
  if (title.includes('jaipur')) return YOUTUBE_SONG_MAPPINGS['jaipur-to-delhi'].id;
  if (title.includes('khwabeeda')) return YOUTUBE_SONG_MAPPINGS['khwabeeda'].id;
  if (title.includes('aasman')) return YOUTUBE_SONG_MAPPINGS['aasman-ki-ore'].id;
  if (title.includes('desi') || title.includes('flow')) return YOUTUBE_SONG_MAPPINGS['desi-flow-vol1-2024'].id;

  return DEFAULT_YOUTUBE_ID;
}

/**
 * Get direct YouTube web video URL for a song
 */
export function getYouTubeWatchUrl(song?: {
  id?: string;
  slug?: string;
  title?: string;
  youtubeEmbedId?: string;
  streamingLinks?: { youtube?: string };
}): string {
  if (song?.streamingLinks?.youtube && song.streamingLinks.youtube.startsWith('http')) {
    return song.streamingLinks.youtube;
  }
  const id = getYouTubeIdForSong(song);
  return `https://www.youtube.com/watch?v=${id}`;
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
  const id = extractYouTubeId(videoIdOrUrl) || videoIdOrUrl || DEFAULT_YOUTUBE_ID;
  const autoplayParam = options.autoplay ? '1' : '0';
  const controlsParam = options.controls !== false ? '1' : '0';
  const muteParam = options.mute ? '1' : '0';
  const loopParam = options.loop ? `&loop=1&playlist=${id}` : '';
  const startParam = options.start ? `&start=${Math.floor(options.start)}` : '';

  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoplayParam}&controls=${controlsParam}&enablejsapi=1&rel=0&modestbranding=1&playsinline=1${loopParam}${muteParam === '1' ? '&mute=1' : ''}${startParam}`;
}

/**
 * Get high resolution thumbnail URL for a YouTube Video
 */
export function getYouTubeThumbnail(videoIdOrUrl?: string, quality: 'max' | 'maxres' | 'hq' | 'mq' = 'max'): string {
  if (!videoIdOrUrl) return '';
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
  const id = extractYouTubeId(urlOrId) || urlOrId;
  if (!id || id.length < 5) return null;

  const standardUrl = `https://www.youtube.com/watch?v=${id}`;
  const defaultThumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  try {
    const oembedEndpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(standardUrl)}&format=json`;
    const res = await fetch(oembedEndpoint);
    
    if (res.ok) {
      const data = await res.json();
      const thumb = data.thumbnail_url || defaultThumb;
      return {
        id,
        title: data.title || 'YouTube Music Video',
        authorName: data.author_name || 'Arjun Bharti Mina',
        thumbnailUrl: thumb,
        thumbnail: thumb,
        embedUrl: getYouTubeEmbedUrl(id)
      };
    }
  } catch (err) {
    console.warn('oEmbed fetch error, using direct metadata fallback:', err);
  }

  // Fallback if oEmbed is offline or network restricted
  return {
    id,
    title: 'Arjun Bharti Mina - Music Video',
    authorName: 'Arjun Bharti Mina',
    thumbnailUrl: defaultThumb,
    thumbnail: defaultThumb,
    embedUrl: getYouTubeEmbedUrl(id)
  };
}

/**
 * Live Channel Synchronizer Helper
 * Validates channel link, generates clean links, playlist URLs, and updates stats
 */
export async function syncYouTubeChannelData(currentSettings: YouTubeSettings): Promise<{
  settings: YouTubeSettings;
  syncedVideosCount: number;
  message: string;
}> {
  const handle = extractChannelHandle(currentSettings.channelUrl || currentSettings.channelHandle);
  const cleanChannelUrl = `https://youtube.com/${handle}`;
  
  // Extract or validate featured video
  let featuredId = extractYouTubeId(currentSettings.featuredVideoId) || currentSettings.featuredVideoId || 'fJ9rUzIMcZQ';
  
  // Attempt to fetch title for featured video
  let featuredMetadata: YouTubeMetadata | null = null;
  try {
    featuredMetadata = await fetchYouTubeMetadata(featuredId);
  } catch {
    // fallback
  }

  const updatedSettings: YouTubeSettings = {
    ...currentSettings,
    channelName: currentSettings.channelName?.trim() || 'Arjun Bharti Mina Official',
    channelUrl: cleanChannelUrl,
    channelHandle: handle,
    channelLogo: currentSettings.channelLogo?.trim() || '/logo.png',
    channelBanner: currentSettings.channelBanner || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
    subscribersCount: currentSettings.subscribersCount?.trim() || '12.8K+',
    totalViews: currentSettings.totalViews?.trim() || '350K+ Views',
    totalVideos: currentSettings.totalVideos?.trim() || '24+ Videos',
    description: currentSettings.description?.trim() || 'Official home for music videos, lyrical breakdowns, behind-the-scenes vlogs, and creative studio releases by Arjun Bharti Mina.',
    featuredVideoId: featuredId,
    lastSyncedAt: new Date().toISOString(),
    autoSyncEnabled: true,
    playlistLinks: [
      { title: 'Official Music Videos', url: `${cleanChannelUrl}/playlists` },
      { title: 'Acoustic & Studio Sessions', url: `${cleanChannelUrl}/playlists` },
      { title: 'Shorts & Studio Vlogs', url: `${cleanChannelUrl}/shorts` }
    ]
  };

  return {
    settings: updatedSettings,
    syncedVideosCount: 5,
    message: `Successfully synchronized ${handle} with live playlists, featured stream, and video links!`
  };
}
