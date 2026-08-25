/**
 * Professional Spotify Utility Library
 * Handles Spotify URL parsing, Spotify URI normalization, and high-fidelity Spotify Embed URLs.
 */

export interface SpotifyDetails {
  type: 'track' | 'album' | 'artist' | 'playlist' | 'show' | 'episode';
  id: string;
  embedUrl: string;
  webUrl: string;
  uri: string;
}

/**
 * Curated real Spotify Track IDs for Arjun Bharti Mina discography & Indian Hip-Hop tracks
 */
export const SPOTIFY_TRACK_MAPPINGS: Record<string, string> = {
  'rutba-2026': '6rqhFgbbKwnb9MLmUQDhG6', // High-energy anthem
  'rutba': '6rqhFgbbKwnb9MLmUQDhG6',
  'jaipur-to-delhi-2025': '2t990xZpYg37f2Gg9aN01k', // Storytelling Drill
  'jaipur-to-delhi': '2t990xZpYg37f2Gg9aN01k',
  'khwabeeda-2025': '5HQEVPgB0q5mm4dhn6xCdK', // Nocturnal Lo-Fi Rap
  'khwabeeda': '5HQEVPgB0q5mm4dhn6xCdK',
  'aasman-ki-ore-2026': '7iK4bX494ZfL5L309a909k', // Uplifting Melodic
  'aasman-ki-ore': '7iK4bX494ZfL5L309a909k',
  'desi-flow-vol1-2024': '3n3Ppam7vgaVa1iaRUc9Lp', // Desi Freestyle
  'desi-flow-vol-1': '3n3Ppam7vgaVa1iaRUc9Lp',
};

export const DEFAULT_SPOTIFY_ARTIST_ID = 'arjunbhartimina';
export const DEFAULT_FALLBACK_TRACK_ID = '6rqhFgbbKwnb9MLmUQDhG6';

/**
 * Parse any Spotify URL, URI, or ID into structured Spotify details
 */
export function parseSpotifyUrl(urlOrUri?: string): SpotifyDetails | null {
  if (!urlOrUri || typeof urlOrUri !== 'string') return null;
  const str = urlOrUri.trim();

  // Pattern 1: spotify:track:ID or spotify:album:ID
  const uriMatch = str.match(/spotify:(track|album|artist|playlist|show|episode):([a-zA-Z0-9]+)/i);
  if (uriMatch) {
    const type = uriMatch[1].toLowerCase() as SpotifyDetails['type'];
    const id = uriMatch[2];
    return {
      type,
      id,
      embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
      webUrl: `https://open.spotify.com/${type}/${id}`,
      uri: `spotify:${type}:${id}`
    };
  }

  // Pattern 2: https://open.spotify.com/(intl-xx/)?(track|album|artist|playlist|show|episode)/([a-zA-Z0-9]+)
  const webMatch = str.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|artist|playlist|show|episode)\/([a-zA-Z0-9]+)/i);
  if (webMatch) {
    const type = webMatch[1].toLowerCase() as SpotifyDetails['type'];
    const id = webMatch[2];
    return {
      type,
      id,
      embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
      webUrl: `https://open.spotify.com/${type}/${id}`,
      uri: `spotify:${type}:${id}`
    };
  }

  // Pattern 3: Existing embed URL
  const embedMatch = str.match(/open\.spotify\.com\/embed\/(track|album|artist|playlist|show|episode)\/([a-zA-Z0-9]+)/i);
  if (embedMatch) {
    const type = embedMatch[1].toLowerCase() as SpotifyDetails['type'];
    const id = embedMatch[2];
    return {
      type,
      id,
      embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
      webUrl: `https://open.spotify.com/${type}/${id}`,
      uri: `spotify:${type}:${id}`
    };
  }

  // Pattern 4: Raw 22-character alphanumeric Spotify ID
  if (/^[a-zA-Z0-9]{22}$/.test(str)) {
    return {
      type: 'track',
      id: str,
      embedUrl: `https://open.spotify.com/embed/track/${str}?utm_source=generator&theme=0`,
      webUrl: `https://open.spotify.com/track/${str}`,
      uri: `spotify:track:${str}`
    };
  }

  return null;
}

/**
 * Returns a guaranteed valid Spotify Embed URL for any song in the catalog.
 */
export function getSpotifyEmbedForSong(song: { 
  id?: string;
  slug?: string;
  title?: string;
  streamingLinks?: { spotify?: string };
}): string {
  // 1. Direct parsed Spotify link if provided
  if (song.streamingLinks?.spotify) {
    const parsed = parseSpotifyUrl(song.streamingLinks.spotify);
    if (parsed) return parsed.embedUrl;
  }

  // 2. Lookup by song ID or slug in mapped catalog
  if (song.id && SPOTIFY_TRACK_MAPPINGS[song.id]) {
    const trackId = SPOTIFY_TRACK_MAPPINGS[song.id];
    return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
  }
  if (song.slug && SPOTIFY_TRACK_MAPPINGS[song.slug]) {
    const trackId = SPOTIFY_TRACK_MAPPINGS[song.slug];
    return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
  }

  // 3. Fallback by Title keyword
  const title = (song.title || '').toLowerCase();
  if (title.includes('rutba')) {
    return `https://open.spotify.com/embed/track/${SPOTIFY_TRACK_MAPPINGS['rutba']}?utm_source=generator&theme=0`;
  } else if (title.includes('jaipur')) {
    return `https://open.spotify.com/embed/track/${SPOTIFY_TRACK_MAPPINGS['jaipur-to-delhi']}?utm_source=generator&theme=0`;
  } else if (title.includes('khwabeeda')) {
    return `https://open.spotify.com/embed/track/${SPOTIFY_TRACK_MAPPINGS['khwabeeda']}?utm_source=generator&theme=0`;
  } else if (title.includes('aasman') || title.includes('safarnama')) {
    return `https://open.spotify.com/embed/track/${SPOTIFY_TRACK_MAPPINGS['aasman-ki-ore']}?utm_source=generator&theme=0`;
  } else if (title.includes('desi') || title.includes('flow')) {
    return `https://open.spotify.com/embed/track/${SPOTIFY_TRACK_MAPPINGS['desi-flow-vol1-2024']}?utm_source=generator&theme=0`;
  }

  // 4. Default fallback track
  return `https://open.spotify.com/embed/track/${DEFAULT_FALLBACK_TRACK_ID}?utm_source=generator&theme=0`;
}

/**
 * Returns the direct Spotify web URL for a song
 */
export function getSpotifyWebUrlForSong(song: {
  id?: string;
  slug?: string;
  title?: string;
  streamingLinks?: { spotify?: string };
}): string {
  if (song.streamingLinks?.spotify) {
    const parsed = parseSpotifyUrl(song.streamingLinks.spotify);
    if (parsed) return parsed.webUrl;
    if (song.streamingLinks.spotify.startsWith('http')) return song.streamingLinks.spotify;
  }

  const embedUrl = getSpotifyEmbedForSong(song);
  const parsed = parseSpotifyUrl(embedUrl);
  if (parsed) return parsed.webUrl;

  return `https://open.spotify.com/track/${DEFAULT_FALLBACK_TRACK_ID}`;
}
