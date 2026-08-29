/**
 * Google Play Books & Google Books API Utility Library
 * Provides robust volume ID extraction, embedded preview URLs,
 * and live metadata fetching for all book details from Google Play Books.
 */

import { BookItem } from '../types';

export interface GoogleBookParsedData {
  volumeId: string;
  title: string;
  subtitle?: string;
  authors?: string[];
  author?: string;
  publisher?: string;
  publishedDate?: string;
  publicationYear?: number;
  description?: string;
  longSynopsis?: string;
  pageCount?: number;
  pages?: number;
  categories?: string[];
  mainCategory?: string;
  category?: string;
  genre?: string;
  language?: string;
  coverImage?: string;
  thumbnail?: string;
  smallThumbnail?: string;
  mediumCover?: string;
  largeCover?: string;
  isbn10?: string;
  isbn13?: string;
  isbn?: string;
  averageRating?: number;
  ratingsCount?: number;
  rating?: number;
  googlePlayUrl?: string;
  playStoreUrl?: string;
  previewEmbedUrl?: string;
  webReaderLink?: string;
  buyLink?: string;
  sampleUrl?: string;
  infoLink?: string;
  canonicalVolumeLink?: string;
  isEbook?: boolean;
  pdfAvailable?: boolean;
  epubAvailable?: boolean;
  price?: string;
  currencyCode?: string;
  maturityRating?: string;
  printType?: string;
  syncedAt?: string;
}

/**
 * Curated mappings for Arjun Bharti Mina's books to ensure working live Google Books preview embeds
 */
export const CURATED_GOOGLE_BOOKS_MAPPINGS: Record<string, string> = {
  'book-1': 'M71vDwAAQBAJ', // The Lyricist's Blueprint: Rhyme, Rhythm & Indian Hip-Hop
  'arjun_bharti_mina_lyricists_blueprint': 'M71vDwAAQBAJ',
  'the-lyricists-blueprint': 'M71vDwAAQBAJ',
  'book-2': '3u7eDwAAQBAJ', // Foundations of Modern Civil Mechanics
  'arjun_mina_civil_mechanics_primer': '3u7eDwAAQBAJ',
  'foundations-of-modern-civil-mechanics': '3u7eDwAAQBAJ'
};

export const DEFAULT_FALLBACK_VOLUME_ID = 'M71vDwAAQBAJ';

/**
 * Extract Google Books Volume ID from any Google Play Books URL, Google Books URL, ISBN or raw ID.
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

  // Pattern 4: books.google.com/books/about/.../VOLUME_ID or play.google.com/store/books/details/slug_VOLUME_ID
  const trailingIdMatch = input.match(/[?&]id=([a-zA-Z0-9_\-]+)/i);
  if (trailingIdMatch && trailingIdMatch[1]) {
    return CURATED_GOOGLE_BOOKS_MAPPINGS[trailingIdMatch[1]] || trailingIdMatch[1];
  }

  // Pattern 5: Check curated dictionary direct ID or slug match
  if (CURATED_GOOGLE_BOOKS_MAPPINGS[input]) {
    return CURATED_GOOGLE_BOOKS_MAPPINGS[input];
  }

  // Pattern 6: Alphanumeric 8 to 20 character Volume ID (standard Google Books ID)
  if (/^[a-zA-Z0-9_\-]{8,20}$/.test(input) && !input.startsWith('http')) {
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
  if (volumeIdOrUrl && volumeIdOrUrl.startsWith('http')) return volumeIdOrUrl;
  return `https://play.google.com/store/books/details?id=${volumeIdOrUrl || DEFAULT_FALLBACK_VOLUME_ID}`;
}

/**
 * Generates the Google Books web reader URL.
 */
export function getGooglePlayReaderUrl(volumeId: string): string {
  const cleanId = extractGoogleBooksId(volumeId) || volumeId || DEFAULT_FALLBACK_VOLUME_ID;
  return `https://play.google.com/books/reader?id=${cleanId}&hl=en`;
}

/**
 * Helper to strip HTML tags from Google Books API descriptions and clean formatting.
 */
export function cleanBookDescription(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<p\s*[\/]?>/gi, '\n\n')
    .replace(/<li\s*[\/]?>/gi, '\n• ')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Upgrade Google Books image URLs to high-resolution HTTPS
 */
export function upgradeGoogleBooksImageUrl(url?: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop';
  
  let clean = url.trim();
  if (clean.startsWith('http://')) {
    clean = clean.replace('http://', 'https://');
  }

  // Optimize zoom & remove edge curl distortion for cleaner UI rendering
  if (clean.includes('books.google.com')) {
    clean = clean.replace(/&edge=curl/g, '');
    if (clean.includes('&zoom=')) {
      clean = clean.replace(/&zoom=[0-9]/, '&zoom=1');
    }
  }

  return clean;
}

/**
 * Maps ISO language code to human-readable language
 */
export function formatLanguageName(code?: string): string {
  if (!code) return 'English';
  const map: Record<string, string> = {
    en: 'English',
    hi: 'Hindi',
    sa: 'Sanskrit',
    ur: 'Urdu',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ja: 'Japanese',
    zh: 'Chinese',
    'en/hi': 'English / Hindi',
    'hi/en': 'Hindi / English'
  };
  const lower = code.toLowerCase().trim();
  return map[lower] || code.toUpperCase();
}

/**
 * Fetch all details about books from Google Play Books / Google Books API.
 * Supports:
 * - Google Play Books store link (e.g., https://play.google.com/store/books/details?id=M71vDwAAQBAJ)
 * - Google Books URL (e.g., https://books.google.com/books?id=M71vDwAAQBAJ)
 * - Volume ID (e.g., M71vDwAAQBAJ)
 * - ISBN-10 / ISBN-13 (e.g., 9789388302198)
 * - Book title or author search query
 */
export async function fetchGoogleBookDetails(input: string): Promise<{
  success: boolean;
  data?: GoogleBookParsedData;
  error?: string;
}> {
  if (!input || !input.trim()) {
    return { 
      success: false, 
      error: 'Please provide a valid Google Play Books link, Volume ID, ISBN, or book title.' 
    };
  }

  const trimmed = input.trim();
  const volumeId = extractGoogleBooksId(trimmed);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    let endpoint = '';
    if (volumeId) {
      endpoint = `https://www.googleapis.com/books/v1/volumes/${volumeId}`;
    } else if (/^(97[89])?\d{9}[\dX]$/i.test(trimmed.replace(/[-\s]/g, ''))) {
      const isbn = trimmed.replace(/[-\s]/g, '');
      endpoint = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`;
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
        error: `Google Play Books API responded with status ${response.status}: ${response.statusText}` 
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
      return { 
        success: false, 
        error: 'Connection to Google Play Books timed out. Please retry.' 
      };
    }
    return { 
      success: false, 
      error: err.message || 'Unable to connect to Google Books API. Please check your internet connection.' 
    };
  }
}

/**
 * Parse a raw Google Books API Volume item into structured GoogleBookParsedData with all necessary details.
 */
export function parseVolumeItem(item: any): GoogleBookParsedData {
  const vol = item.volumeInfo || {};
  const access = item.accessInfo || {};
  const sale = item.saleInfo || {};

  // Extract all cover image tiers
  let coverImage = '';
  let thumbnail = '';
  let smallThumbnail = '';
  let mediumCover = '';
  let largeCover = '';

  if (vol.imageLinks) {
    smallThumbnail = upgradeGoogleBooksImageUrl(vol.imageLinks.smallThumbnail);
    thumbnail = upgradeGoogleBooksImageUrl(vol.imageLinks.thumbnail);
    mediumCover = upgradeGoogleBooksImageUrl(vol.imageLinks.medium);
    largeCover = upgradeGoogleBooksImageUrl(vol.imageLinks.large || vol.imageLinks.extraLarge);

    coverImage = largeCover || mediumCover || thumbnail || smallThumbnail;
  }

  if (!coverImage) {
    coverImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop';
  }

  // Extract ISBNs
  let isbn10 = '';
  let isbn13 = '';
  if (Array.isArray(vol.industryIdentifiers)) {
    for (const id of vol.industryIdentifiers) {
      if (id.type === 'ISBN_10') isbn10 = id.identifier;
      if (id.type === 'ISBN_13') isbn13 = id.identifier;
    }
  }

  // Extract publication year and date
  let publicationYear = 2026;
  const publishedDate = vol.publishedDate || '';
  if (publishedDate) {
    const yearMatch = publishedDate.match(/^(\d{4})/);
    if (yearMatch) {
      publicationYear = parseInt(yearMatch[1], 10);
    }
  }

  const volumeId = item.id || '';
  const cleanDesc = cleanBookDescription(vol.description);
  const authors = vol.authors && vol.authors.length > 0 ? vol.authors : ['Arjun Bharti Mina'];
  const author = authors.join(', ');
  const categories = vol.categories && vol.categories.length > 0 ? vol.categories : ['Literature & Arts'];
  const mainCategory = categories[0] || 'Literature';

  // Sale and pricing
  let priceStr = '';
  let currencyCode = '';
  if (sale.retailPrice) {
    priceStr = `${sale.retailPrice.currencyCode || 'INR'} ${sale.retailPrice.amount}`;
    currencyCode = sale.retailPrice.currencyCode;
  } else if (sale.listPrice) {
    priceStr = `${sale.listPrice.currencyCode || 'INR'} ${sale.listPrice.amount}`;
    currencyCode = sale.listPrice.currencyCode;
  } else if (sale.saleability === 'FREE') {
    priceStr = 'Free';
  }

  const isEbook = sale.isEbook !== undefined ? sale.isEbook : true;
  const pdfAvailable = access.pdf?.isAvailable || false;
  const epubAvailable = access.epub?.isAvailable || false;

  return {
    volumeId,
    title: vol.title || 'Untitled Book',
    subtitle: vol.subtitle || '',
    authors,
    author,
    publisher: vol.publisher || 'ABM Media & Literary Press',
    publishedDate,
    publicationYear,
    description: cleanDesc,
    longSynopsis: cleanDesc,
    pageCount: vol.pageCount || 160,
    pages: vol.pageCount || 160,
    categories,
    mainCategory,
    category: mainCategory,
    genre: mainCategory,
    language: formatLanguageName(vol.language),
    coverImage,
    thumbnail: thumbnail || coverImage,
    smallThumbnail,
    mediumCover,
    largeCover,
    isbn10,
    isbn13,
    isbn: isbn13 || isbn10 || (vol.industryIdentifiers?.[0]?.identifier) || '',
    averageRating: vol.averageRating || undefined,
    ratingsCount: vol.ratingsCount || undefined,
    rating: vol.averageRating || undefined,
    googlePlayUrl: `https://play.google.com/store/books/details?id=${volumeId}`,
    playStoreUrl: `https://play.google.com/store/books/details?id=${volumeId}`,
    previewEmbedUrl: `https://books.google.com/books?id=${volumeId}&printsec=frontcover&output=embed`,
    webReaderLink: access.webReaderLink || `https://play.google.com/books/reader?id=${volumeId}&hl=en`,
    buyLink: sale.buyLink || `https://play.google.com/store/books/details?id=${volumeId}`,
    sampleUrl: access.webReaderLink || `https://play.google.com/books/reader?id=${volumeId}&hl=en`,
    infoLink: vol.infoLink || `https://books.google.com/books?id=${volumeId}`,
    canonicalVolumeLink: vol.canonicalVolumeLink || `https://books.google.com/books/about/?id=${volumeId}`,
    isEbook,
    pdfAvailable,
    epubAvailable,
    price: priceStr,
    currencyCode,
    maturityRating: vol.maturityRating || 'NOT_MATURE',
    printType: vol.printType || 'BOOK',
    syncedAt: new Date().toISOString()
  };
}

/**
 * Merges fetched Google Book data with an existing BookItem
 */
export function applyGoogleBookDataToBook(book: BookItem, googleData: GoogleBookParsedData): BookItem {
  return {
    ...book,
    title: googleData.title || book.title,
    subtitle: googleData.subtitle !== undefined ? googleData.subtitle : book.subtitle,
    author: googleData.author || (googleData.authors && googleData.authors.join(', ')) || book.author || 'Arjun Bharti Mina',
    authors: googleData.authors || book.authors || ['Arjun Bharti Mina'],
    publisher: googleData.publisher || book.publisher,
    publicationYear: googleData.publicationYear || book.publicationYear,
    publicationDate: googleData.publishedDate || book.publicationDate,
    description: googleData.description || book.description,
    longSynopsis: googleData.longSynopsis || googleData.description || book.longSynopsis || book.description,
    pages: googleData.pages || googleData.pageCount || book.pages,
    language: googleData.language || book.language,
    cover: googleData.coverImage || book.cover,
    isbn: googleData.isbn13 || googleData.isbn10 || googleData.isbn || book.isbn,
    isbn10: googleData.isbn10 || book.isbn10,
    isbn13: googleData.isbn13 || book.isbn13,
    category: googleData.mainCategory || googleData.category || book.category,
    categories: googleData.categories || book.categories,
    genre: googleData.genre || book.genre || googleData.mainCategory,
    googlePlayUrl: googleData.googlePlayUrl || book.googlePlayUrl,
    playStoreUrl: googleData.playStoreUrl || googleData.googlePlayUrl || book.playStoreUrl,
    googleBooksVolumeId: googleData.volumeId || book.googleBooksVolumeId,
    previewEmbedUrl: googleData.previewEmbedUrl || book.previewEmbedUrl,
    webReaderLink: googleData.webReaderLink || book.webReaderLink,
    buyLink: googleData.buyLink || book.buyLink,
    sampleUrl: googleData.sampleUrl || book.sampleUrl,
    infoLink: googleData.infoLink || book.infoLink,
    canonicalVolumeLink: googleData.canonicalVolumeLink || book.canonicalVolumeLink,
    isEbook: googleData.isEbook !== undefined ? googleData.isEbook : book.isEbook,
    pdfAvailable: googleData.pdfAvailable !== undefined ? googleData.pdfAvailable : book.pdfAvailable,
    epubAvailable: googleData.epubAvailable !== undefined ? googleData.epubAvailable : book.epubAvailable,
    price: googleData.price || book.price,
    currencyCode: googleData.currencyCode || book.currencyCode,
    maturityRating: googleData.maturityRating || book.maturityRating,
    printType: googleData.printType || book.printType,
    rating: googleData.rating || googleData.averageRating || book.rating,
    ratingsCount: googleData.ratingsCount || book.ratingsCount,
    syncedFromGoogleBooksAt: googleData.syncedAt || new Date().toISOString()
  };
}
