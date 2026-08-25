/**
 * Utility functions for extracting Spotify IDs and generating Spotify Embedded Player URLs
 */

export interface SpotifyDetails {
  type: 'track' | 'album' | 'artist' | 'playlist' | 'show' | 'episode';
  id: string;
  embedUrl: string;
}

/**
 * Extracts Spotify ID and Type from a Spotify URL or URI
 * e.g. https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT?si=...
 * or spotify:track:4cOdK2wGLETKBW3PvgPWqT
 * or https://open.spotify.com/artist/arjunbhartimina
 */
export function parseSpotifyUrl(urlOrUri?: string): SpotifyDetails | null {
  if (!urlOrUri || typeof urlOrUri !== 'string') return null;
  const str = urlOrUri.trim();

  // Pattern 1: spotify:track:ID or spotify:album:ID etc.
  const uriMatch = str.match(/spotify:(track|album|artist|playlist|show|episode):([a-zA-Z0-9]+)/i);
  if (uriMatch) {
    const type = uriMatch[1].toLowerCase() as SpotifyDetails['type'];
    const id = uriMatch[2];
    return {
      type,
      id,
      embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`
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
      embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`
    };
  }

  // Pattern 3: Already an embed URL
  if (str.includes('open.spotify.com/embed/')) {
    return {
      type: 'track',
      id: 'custom',
      embedUrl: str
    };
  }

  return null;
}

/**
 * Get Spotify Embed URL for a song
 * Falls back to high-quality curated Desi Hip Hop / Indian Rap tracks if specific track not found
 */
export function getSpotifyEmbedForSong(song: { 
  streamingLinks?: { spotify?: string };
  title?: string;
  artist?: string;
}): string {
  const parsed = parseSpotifyUrl(song.streamingLinks?.spotify);
  if (parsed) {
    return parsed.embedUrl;
  }

  // Fallback curated Spotify embed links
  const title = (song.title || '').toLowerCase();
  if (title.includes('rutba')) {
    return 'https://open.spotify.com/embed/track/6rqhFgbbKwnb9MLmUQDhG6?utm_source=generator&theme=0';
  } else if (title.includes('jaipur')) {
    return 'https://open.spotify.com/embed/track/2t990xZpYg37f2Gg9aN01k?utm_source=generator&theme=0';
  } else if (title.includes('khwabeeda')) {
    return 'https://open.spotify.com/embed/track/5HQEVPgB0q5mm4dhn6xCdK?utm_source=generator&theme=0';
  } else if (title.includes('aarambh') || title.includes('safarnama')) {
    return 'https://open.spotify.com/embed/track/7iK4bX494ZfL5L309a909k?utm_source=generator&theme=0';
  }

  return 'https://open.spotify.com/embed/track/6rqhFgbbKwnb9MLmUQDhG6?utm_source=generator&theme=0';
}
