/**
 * Google Play Books & Google Books API Utility Library
 * Provides volume ID extraction, embedded preview URLs, and live metadata fetching.
 */

import { BookItem } from '../types';

export interface GoogleBookParsedData {
  volumeId: string;
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  publicationYear?: number;
  description?: string;
  pageCount?: number;
  categories?: string[];
  mainCategory?: string;
  language?: string;
  coverImage?: string;
  thumbnail?: string;
  isbn10?: string;
  isbn13?: string;
  averageRating?: number;
  ratingsCount?: number;
  googlePlayUrl?: string;
  previewEmbedUrl?: string;
  webReaderLink?: string;
  buyLink?: string;
  isEbook?: boolean;
}

/**
 * Curated mappings for Arjun Bharti Mina's books to ensure working live Google Books preview embeds
 */
export const CURATED_GOOGLE_BOOKS_MAPPINGS: Record<string, string> = {
  'book-1': 'M71vDwAAQBAJ', // Indian Rap & Poetry Blueprint
  'arjun_bharti_mina_lyricists_blueprint': 'M71vDwAAQBAJ',
  'book-2': '3u7eDwAAQBAJ', // Civil Engineering Mechanics & Structural Primer
  'arjun_mina_civil_mechanics_primer': '3u7eDwAAQBAJ',
  'the-lyricists-blueprint': 'M71vDwAAQBAJ',
  'foundations-of-modern-civil-mechanics': '3u7eDwAAQBAJ'
};

export const DEFAULT_FALLBACK_VOLUME_ID = 'M71vDwAAQBAJ';

/**
 * Extract Google Books Volume ID from any Google Play Books URL, Google Books URL, or raw ID.
 */
export function extractGoogleBooksId(urlOrId?: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const input = urlOrId.trim();

  // Pattern 1: play.google.com/store/books/details?id=VOLUME_ID or details/TITLE?id=VOLUME_ID
  const playMatch = input.match(/play\.google\.com\/store\/books\/details(?:\/[^?#]+)?\?(?:[^#]*&)?id=([a-zA-Z0-9_\-]+)/i);
  if (playMatch && playMatch[1]) {
    const rawId = playMatch[1];
    return CURATED_GOOGLE_BOOKS_MAPPINGS[rawId] || rawId;
  }

  // Pattern 2: play.google.com/books/reader?id=VOLUME_ID
  const readerMatch = input.match(/play\.google\.com\/books\/reader\?(?:[^#]*&)?id=([a-zA-Z0-9_\-]+)/i);
  if (readerMatch && readerMatch[1]) {
    const rawId = readerMatch[1];
    return CURATED_GOOGLE_BOOKS_MAPPINGS[rawId] || rawId;
  }

  // Pattern 3: books.google.com/books?id=VOLUME_ID or books.google.co.in/books?id=VOLUME_ID
  const booksMatch = input.match(/books\.google\.[a-z.]+\/books\?(?:[^#]*&)?id=([a-zA-Z0-9_\-]+)/i);
  if (booksMatch && booksMatch[1]) {
    const rawId = booksMatch[1];
    return CURATED_GOOGLE_BOOKS_MAPPINGS[rawId] || rawId;
  }

  // Pattern 4: Check curated dictionary direct ID or slug match
  if (CURATED_GOOGLE_BOOKS_MAPPINGS[input]) {
    return CURATED_GOOGLE_BOOKS_MAPPINGS[input];
  }

  // Pattern 5: Alphanumeric 10 to 14 character Volume ID (standard Google Books ID)
  if (/^[a-zA-Z0-9_\-]{8,20}$/.test(input)) {
    return input;
  }

  return null;
}

/**
 * Generates an official Google Books embedded reader preview URL.
 */
export function getGoogleBooksEmbedUrl(volumeId: string): string {
  const cleanId = extractGoogleBooksId(volumeId) || volumeId || DEFAULT_FALLBACK_VOLUME_ID;
  return `https://books.google.com/books?id=${cleanId}&printsec=frontcover&output=embed`;
}

/**
 * Generates the direct Google Play Books store link.
 */
export function getGooglePlayStoreUrl(volumeIdOrUrl: string): string {
  const id = extractGoogleBooksId(volumeIdOrUrl);
  if (id) {
    return `https://play.google.com/store/books/details?id=${id}`;
  }
  if (volumeIdOrUrl.startsWith('http')) return volumeIdOrUrl;
  return `https://play.google.com/store/books/details?id=${volumeIdOrUrl}`;
}

/**
 * Generates the Google Books web reader URL.
 */
export function getGooglePlayReaderUrl(volumeId: string): string {
  const cleanId = extractGoogleBooksId(volumeId) || volumeId || DEFAULT_FALLBACK_VOLUME_ID;
  return `https://play.google.com/books/reader?id=${cleanId}&hl=en`;
}

/**
 * Helper to strip HTML tags from Google Books API descriptions.
 */
function stripHtml(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<p\s*[\/]?>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Fetch book details from the official Google Books API.
 * Supports:
 * - Direct Google Books Volume ID
 * - Google Play Books store URL
 * - ISBN-10 / ISBN-13
 * - Book title / author query
 */
export async function fetchGoogleBookDetails(input: string): Promise<{
  success: boolean;
  data?: GoogleBookParsedData;
  error?: string;
}> {
  if (!input || !input.trim()) {
    return { success: false, error: 'Please provide a valid Google Play Books link, Volume ID, or Book title.' };
  }

  const trimmed = input.trim();
  const volumeId = extractGoogleBooksId(trimmed);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    let endpoint = '';
    if (volumeId) {
      endpoint = `https://www.googleapis.com/books/v1/volumes/${volumeId}`;
    } else if (/^(97[89])?\d{9}[\dX]$/i.test(trimmed.replace(/[-\s]/g, ''))) {
      const isbn = trimmed.replace(/[-\s]/g, '');
      endpoint = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    } else {
      endpoint = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(trimmed)}&maxResults=1`;
    }

    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      // If 404 on direct volume ID, try fallback search query
      if (response.status === 404 && volumeId) {
        const fallbackSearch = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(trimmed)}&maxResults=1`
        );
        if (fallbackSearch.ok) {
          const searchJson = await fallbackSearch.json();
          if (searchJson.items && searchJson.items.length > 0) {
            return {
              success: true,
              data: parseVolumeItem(searchJson.items[0])
            };
          }
        }
      }
      return { 
        success: false, 
        error: `Google Books API responded with status ${response.status}: ${response.statusText}` 
      };
    }

    const json = await response.json();

    // Single volume item endpoint returns the volume object directly
    if (json.id && json.volumeInfo) {
      return {
        success: true,
        data: parseVolumeItem(json)
      };
    }

    // Search query endpoint returns { items: [...] }
    if (json.items && json.items.length > 0) {
      return {
        success: true,
        data: parseVolumeItem(json.items[0])
      };
    }

    return { 
      success: false, 
      error: 'No matching book found on Google Play Books for this link or query.' 
    };

  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return { success: false, error: 'Request timed out while connecting to Google Play Books.' };
    }
    return { 
      success: false, 
      error: err.message || 'Unable to connect to Google Books API. Please check internet connection.' 
    };
  }
}

/**
 * Parse a raw Google Books API Volume item into structured GoogleBookParsedData
 */
function parseVolumeItem(item: any): GoogleBookParsedData {
  const vol = item.volumeInfo || {};
  const access = item.accessInfo || {};
  const sale = item.saleInfo || {};

  // Extract high-res image
  let coverImage = '';
  if (vol.imageLinks) {
    coverImage = 
      vol.imageLinks.extraLarge ||
      vol.imageLinks.large ||
      vol.imageLinks.medium ||
      vol.imageLinks.small ||
      vol.imageLinks.thumbnail ||
      vol.imageLinks.smallThumbnail ||
      '';
    // Upgrade to https and adjust zoom
    if (coverImage.startsWith('http://')) {
      coverImage = coverImage.replace('http://', 'https://');
    }
  }

  // Extract ISBN
  let isbn10 = '';
  let isbn13 = '';
  if (Array.isArray(vol.industryIdentifiers)) {
    for (const id of vol.industryIdentifiers) {
      if (id.type === 'ISBN_10') isbn10 = id.identifier;
      if (id.type === 'ISBN_13') isbn13 = id.identifier;
    }
  }

  // Extract year
  let publicationYear = 2026;
  if (vol.publishedDate) {
    const yearMatch = vol.publishedDate.match(/^(\d{4})/);
    if (yearMatch) {
      publicationYear = parseInt(yearMatch[1], 10);
    }
  }

  const volumeId = item.id || '';

  return {
    volumeId,
    title: vol.title || 'Untitled Book',
    subtitle: vol.subtitle || '',
    authors: vol.authors || ['Arjun Bharti Mina'],
    publisher: vol.publisher || 'Google Play Books Edition',
    publishedDate: vol.publishedDate || '',
    publicationYear,
    description: stripHtml(vol.description),
    pageCount: vol.pageCount || 150,
    categories: vol.categories || ['Literature & Arts'],
    mainCategory: vol.categories && vol.categories.length > 0 ? vol.categories[0] : 'Literature',
    language: (vol.language || 'en').toUpperCase(),
    coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800',
    thumbnail: coverImage || '',
    isbn10,
    isbn13,
    averageRating: vol.averageRating || undefined,
    ratingsCount: vol.ratingsCount || undefined,
    googlePlayUrl: `https://play.google.com/store/books/details?id=${volumeId}`,
    previewEmbedUrl: `https://books.google.com/books?id=${volumeId}&printsec=frontcover&output=embed`,
    webReaderLink: access.webReaderLink || `https://play.google.com/books/reader?id=${volumeId}&hl=en`,
    buyLink: sale.buyLink || `https://play.google.com/store/books/details?id=${volumeId}`,
    isEbook: sale.isEbook || false
  };
}

/**
 * Merges fetched Google Book data with an existing BookItem
 */
export function applyGoogleBookDataToBook(book: BookItem, googleData: GoogleBookParsedData): BookItem {
  return {
    ...book,
    title: googleData.title || book.title,
    subtitle: googleData.subtitle || book.subtitle,
    author: (googleData.authors && googleData.authors.join(', ')) || book.author || 'Arjun Bharti Mina',
    publisher: googleData.publisher || book.publisher,
    publicationYear: googleData.publicationYear || book.publicationYear,
    publicationDate: googleData.publishedDate || book.publicationDate,
    description: googleData.description || book.description,
    longSynopsis: googleData.description || book.longSynopsis || book.description,
    pages: googleData.pageCount || book.pages,
    language: googleData.language || book.language,
    cover: googleData.coverImage || book.cover,
    isbn: googleData.isbn13 || googleData.isbn10 || book.isbn,
    category: googleData.mainCategory || book.category,
    googlePlayUrl: googleData.googlePlayUrl || book.googlePlayUrl,
    playStoreUrl: googleData.googlePlayUrl || book.playStoreUrl,
    googleBooksVolumeId: googleData.volumeId || book.googleBooksVolumeId,
    previewEmbedUrl: googleData.previewEmbedUrl || book.previewEmbedUrl,
    webReaderLink: googleData.webReaderLink || book.webReaderLink,
    buyLink: googleData.buyLink || book.buyLink,
    rating: googleData.averageRating || book.rating,
    ratingsCount: googleData.ratingsCount || book.ratingsCount
  };
}
