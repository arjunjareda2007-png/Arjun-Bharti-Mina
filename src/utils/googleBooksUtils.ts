/**
 * Google Play Books & Google Books API Utility Library
 * Ultra-resilient URL extraction, multi-tier fallback querying,
 * and live metadata normalization for Google Play Books.
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
 * Curated high-fidelity book mappings for instant offline fallback
 */
export const CURATED_FALLBACK_BOOKS: Record<string, GoogleBookParsedData> = {
  'M71vDwAAQBAJ': {
    volumeId: 'M71vDwAAQBAJ',
    title: "The Lyricist's Blueprint: Rhyme, Rhythm & Indian Hip-Hop",
    subtitle: 'A Modern Guide to Crafting Authentic Verses, Metaphors, and Cadences',
    authors: ['Arjun Bharti Mina'],
    author: 'Arjun Bharti Mina',
    publisher: 'ABM Media & Literary Press',
    publishedDate: '2025-04-15',
    publicationYear: 2025,
    description: 'A comprehensive handbook exploring the art and mechanics of Desi Hip-Hop songwriting, multisyllabic rhyming, flow switches, and cultural storytelling.',
    longSynopsis: 'In "The Lyricist’s Blueprint", independent music artist Arjun Bharti Mina (ABM) deconstructs the architecture of modern Indian rap. From understanding syllable stress and meter synchronization to weaving regional dialect into universal hooks, this book is an invaluable companion for aspiring songwriters, rappers, and poetic creators.',
    pageCount: 184,
    pages: 184,
    categories: ['Music & Lyricism', 'Performing Arts / Rap & Hip-Hop'],
    mainCategory: 'Music & Lyricism',
    category: 'Music & Lyricism',
    genre: 'Music & Lyricism',
    language: 'English / Hindi',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    isbn10: '9388302198',
    isbn13: '9789388302198',
    isbn: '9789388302198',
    averageRating: 4.8,
    ratingsCount: 142,
    rating: 4.8,
    googlePlayUrl: 'https://play.google.com/store/books/details?id=M71vDwAAQBAJ',
    playStoreUrl: 'https://play.google.com/store/books/details?id=M71vDwAAQBAJ',
    previewEmbedUrl: 'https://books.google.com/books?id=M71vDwAAQBAJ&printsec=frontcover&output=embed',
    webReaderLink: 'https://play.google.com/books/reader?id=M71vDwAAQBAJ&hl=en',
    buyLink: 'https://play.google.com/store/books/details?id=M71vDwAAQBAJ',
    sampleUrl: 'https://play.google.com/books/reader?id=M71vDwAAQBAJ&hl=en',
    infoLink: 'https://books.google.com/books?id=M71vDwAAQBAJ',
    canonicalVolumeLink: 'https://books.google.com/books/about/?id=M71vDwAAQBAJ',
    isEbook: true,
    pdfAvailable: true,
    epubAvailable: true,
    price: '₹299',
    currencyCode: 'INR',
    maturityRating: 'NOT_MATURE',
    printType: 'BOOK',
    syncedAt: new Date().toISOString()
  },
  '3u7eDwAAQBAJ': {
    volumeId: '3u7eDwAAQBAJ',
    title: 'Foundations of Modern Civil Mechanics: An Undergraduate Primer',
    subtitle: 'Practical Concepts, Structural Analysis & Site Applications',
    authors: ['Arjun Bharti Mina'],
    author: 'Arjun Bharti Mina',
    publisher: 'SKIT Academic Publications',
    publishedDate: '2026-02-10',
    publicationYear: 2026,
    description: 'A simplified, visually structured reference guide compiling key civil engineering formulas, structural matrix methods, and concrete technology fundamentals.',
    longSynopsis: 'Penned during his final year B.Tech coursework at SKIT Jaipur, this textbook summary provides clear graphical explanations and computational shortcuts for civil engineering students mastering RCC beam calculations, soil mechanics, and survey triangulations.',
    pageCount: 220,
    pages: 220,
    categories: ['Engineering & Tech', 'Technology & Engineering / Civil'],
    mainCategory: 'Engineering & Tech',
    category: 'Engineering & Tech',
    genre: 'Engineering & Tech',
    language: 'English',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=800&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=800&auto=format&fit=crop',
    isbn10: '0134460581',
    isbn13: '9780134460581',
    isbn: '9780134460581',
    averageRating: 4.9,
    ratingsCount: 89,
    rating: 4.9,
    googlePlayUrl: 'https://play.google.com/store/books/details?id=3u7eDwAAQBAJ',
    playStoreUrl: 'https://play.google.com/store/books/details?id=3u7eDwAAQBAJ',
    previewEmbedUrl: 'https://books.google.com/books?id=3u7eDwAAQBAJ&printsec=frontcover&output=embed',
    webReaderLink: 'https://play.google.com/books/reader?id=3u7eDwAAQBAJ&hl=en',
    buyLink: 'https://play.google.com/store/books/details?id=3u7eDwAAQBAJ',
    sampleUrl: 'https://play.google.com/books/reader?id=3u7eDwAAQBAJ&hl=en',
    infoLink: 'https://books.google.com/books?id=3u7eDwAAQBAJ',
    canonicalVolumeLink: 'https://books.google.com/books/about/?id=3u7eDwAAQBAJ',
    isEbook: true,
    pdfAvailable: true,
    epubAvailable: true,
    price: '₹449',
    currencyCode: 'INR',
    maturityRating: 'NOT_MATURE',
    printType: 'BOOK',
    syncedAt: new Date().toISOString()
  }
};

export const CURATED_GOOGLE_BOOKS_MAPPINGS: Record<string, string> = {
  'book-1': 'M71vDwAAQBAJ',
  'arjun_bharti_mina_lyricists_blueprint': 'M71vDwAAQBAJ',
  'the-lyricists-blueprint': 'M71vDwAAQBAJ',
  'the_lyricist_s_blueprint': 'M71vDwAAQBAJ',
  'lyricist': 'M71vDwAAQBAJ',
  'book-2': '3u7eDwAAQBAJ',
  'arjun_mina_civil_mechanics_primer': '3u7eDwAAQBAJ',
  'foundations-of-modern-civil-mechanics': '3u7eDwAAQBAJ',
  'foundations_of_modern_civil_mechanics': '3u7eDwAAQBAJ',
  'civil': '3u7eDwAAQBAJ'
};

export const DEFAULT_FALLBACK_VOLUME_ID = 'M71vDwAAQBAJ';

/**
 * Robustly extract Google Books Volume ID from any link, URL, slug, or ID string.
 */
export function extractGoogleBooksId(urlOrId?: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  let input = urlOrId.trim();

  try {
    input = decodeURIComponent(input);
  } catch {
    // Keep input as is
  }

  // Strip wrapping quotes or brackets
  input = input.replace(/^["'<(\[]+|[>"')\]]+$/g, '').trim();

  // Pattern 1: URL with ?id=VOLUME_ID or &id=VOLUME_ID
  const idParamMatch = input.match(/[?&]id=([a-zA-Z0-9_\-]+)/i);
  if (idParamMatch && idParamMatch[1]) {
    const rawId = idParamMatch[1];
    return CURATED_GOOGLE_BOOKS_MAPPINGS[rawId] || rawId;
  }

  // Pattern 2: books.google.com/books/edition/_/VOLUME_ID or books/edition/TITLE/VOLUME_ID
  const editionMatch = input.match(/\/books\/edition\/[^/]+\/([a-zA-Z0-9_\-]+)/i);
  if (editionMatch && editionMatch[1]) {
    return editionMatch[1];
  }

  // Pattern 3: books.google.com/books/about/.../VOLUME_ID
  const aboutMatch = input.match(/\/books\/about\/[^?#]+\.html\?id=([a-zA-Z0-9_\-]+)/i);
  if (aboutMatch && aboutMatch[1]) {
    return aboutMatch[1];
  }

  // Pattern 4: play.google.com/books/reader?id=VOLUME_ID
  const readerMatch = input.match(/play\.google\.com\/books\/reader\?(?:[^#]*&)?id=([a-zA-Z0-9_\-]+)/i);
  if (readerMatch && readerMatch[1]) {
    return readerMatch[1];
  }

  // Pattern 5: Direct slug mapping
  const normalizedSlug = input.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  if (CURATED_GOOGLE_BOOKS_MAPPINGS[normalizedSlug]) {
    return CURATED_GOOGLE_BOOKS_MAPPINGS[normalizedSlug];
  }
  if (CURATED_GOOGLE_BOOKS_MAPPINGS[input]) {
    return CURATED_GOOGLE_BOOKS_MAPPINGS[input];
  }

  // Pattern 6: Direct alphanumeric volume ID (standard Google Books Volume ID: 10-14 chars)
  if (/^[a-zA-Z0-9_\-]{8,20}$/.test(input) && !input.startsWith('http') && !/^\d{10,13}$/.test(input)) {
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
  if (!code) return 'English / Hindi';
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
 * Extracts searchable text keywords if input is a long title or URL
 */
function extractSearchQueryFromInput(input: string): string {
  let cleaned = input.trim();
  
  // If it is a URL with details/Slug_Title
  const detailsSlug = cleaned.match(/\/details\/([^?#]+)/i);
  if (detailsSlug && detailsSlug[1]) {
    return detailsSlug[1].replace(/[-_]/g, ' ').replace(/\b(and|or|the|in|of)\b/gi, ' ').trim();
  }

  // If contains ISBN
  const isbnMatch = cleaned.match(/(?:isbn[:\s]*)?((?:97[89][-\s]*)?\d{9}[\dX])/i);
  if (isbnMatch && isbnMatch[1]) {
    return `isbn:${isbnMatch[1].replace(/[-\s]/g, '')}`;
  }

  return cleaned;
}

/**
 * Fetch all details about books from Google Play Books / Google Books API.
 * Uses 4-stage cascaded fallback strategy:
 * 1. Direct Volume ID lookup (`/volumes/{volumeId}`)
 * 2. ISBN query search (`/volumes?q=isbn:{isbn}`)
 * 3. Text & Title query search (`/volumes?q={query}`)
 * 4. High-Fidelity Curated Offline Data fallback (guaranteed never to leave user stuck)
 */
export async function fetchGoogleBookDetails(input: string): Promise<{
  success: boolean;
  data?: GoogleBookParsedData;
  error?: string;
}> {
  if (!input || !input.trim()) {
    return { 
      success: false, 
      error: 'Please enter a valid Google Play Books link, Volume ID, ISBN, or Book Title.' 
    };
  }

  const trimmed = input.trim();
  const extractedId = extractGoogleBooksId(trimmed);

  // Check curated dataset first if exact volume ID matches
  if (extractedId && CURATED_FALLBACK_BOOKS[extractedId]) {
    // Attempt live fetch first to get most up-to-date rating/price, but keep fallback ready
  }

  const cleanIsbnMatch = trimmed.replace(/[-\s]/g, '').match(/^(97[89])?\d{9}[\dX]$/i);
  const cleanIsbn = cleanIsbnMatch ? cleanIsbnMatch[0] : null;

  // Build ordered list of endpoints to try
  const endpointsToTry: string[] = [];

  if (extractedId) {
    endpointsToTry.push(`https://www.googleapis.com/books/v1/volumes/${extractedId}`);
    endpointsToTry.push(`https://www.googleapis.com/books/v1/volumes?q=id:${extractedId}&maxResults=1`);
  }

  if (cleanIsbn) {
    endpointsToTry.push(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}&maxResults=1`);
  }

  const searchQuery = extractSearchQueryFromInput(trimmed);
  if (searchQuery) {
    endpointsToTry.push(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=1`);
  }

  // Execute fallback cascade
  for (const endpoint of endpointsToTry) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      
      const response = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const json = await response.json();
        
        // Volume endpoint returns single object
        if (json.id && json.volumeInfo) {
          return {
            success: true,
            data: parseVolumeItem(json)
          };
        }

        // Search endpoint returns items array
        if (Array.isArray(json.items) && json.items.length > 0) {
          return {
            success: true,
            data: parseVolumeItem(json.items[0])
          };
        }
      }
    } catch {
      // Continue to next endpoint in cascade
    }
  }

  // If network queries failed (e.g. CORS or network restrictions or offline), check curated fallback
  if (extractedId && CURATED_FALLBACK_BOOKS[extractedId]) {
    return {
      success: true,
      data: CURATED_FALLBACK_BOOKS[extractedId]
    };
  }

  // Check title fuzzy match in curated books
  const lower = trimmed.toLowerCase();
  for (const book of Object.values(CURATED_FALLBACK_BOOKS)) {
    if (
      lower.includes(book.volumeId.toLowerCase()) ||
      lower.includes(book.title.toLowerCase()) ||
      (book.isbn && lower.includes(book.isbn)) ||
      (lower.includes('lyricist') && book.volumeId === 'M71vDwAAQBAJ') ||
      (lower.includes('civil') && book.volumeId === '3u7eDwAAQBAJ')
    ) {
      return {
        success: true,
        data: book
      };
    }
  }

  return {
    success: false,
    error: 'Could not find matching book on Google Play Books. Please check the URL, Volume ID, or ISBN.'
  };
}

/**
 * Parse a raw Google Books API Volume item into structured GoogleBookParsedData
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

/**
 * Universal Book Link Detector & Extractor
 * Automatically recognizes:
 * - Google Play Books Links
 * - Google Books Volume URLs
 * - Direct PDF Links (.pdf)
 * - Google Drive File / PDF URLs
 * - OpenLibrary / Archive.org URLs
 * - ISBN Numbers
 * - Title / Author Search strings
 */
export type BookLinkType = 
  | 'google_play' 
  | 'google_books' 
  | 'pdf_direct' 
  | 'google_drive' 
  | 'openlibrary' 
  | 'internet_archive' 
  | 'isbn' 
  | 'web_url' 
  | 'title_query';

export function detectBookLinkType(input: string): BookLinkType {
  if (!input) return 'title_query';
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  if (lower.includes('play.google.com/store/books')) return 'google_play';
  if (lower.includes('books.google.')) return 'google_books';
  if (lower.includes('drive.google.com')) return 'google_drive';
  if (lower.includes('openlibrary.org')) return 'openlibrary';
  if (lower.includes('archive.org/details')) return 'internet_archive';
  if (lower.endsWith('.pdf') || lower.includes('.pdf?') || lower.includes('/pdf/')) return 'pdf_direct';
  if (/^(97[89])?\d{9}[\dX]$/i.test(trimmed.replace(/[-\s]/g, ''))) return 'isbn';
  if (lower.startsWith('http://') || lower.startsWith('https://')) return 'web_url';
  return 'title_query';
}

/**
 * Extract Google Drive File ID and generate embed preview link
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/i) || 
                url.match(/id=([a-zA-Z0-9_-]+)/i) ||
                url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

/**
 * Clean up title from filename or URL slug
 */
export function formatTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').filter(Boolean).pop() || '';
    const cleanName = filename
      .replace(/\.(pdf|epub|txt|html|htm)$/i, '')
      .replace(/[-_+]/g, ' ')
      .replace(/%20/g, ' ')
      .trim();

    if (cleanName.length > 2) {
      return cleanName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  } catch {
    // Ignore URL parse error
  }
  return 'Untitled Manuscript';
}

/**
 * Universal Multi-Source Book Metadata Fetcher
 * Automatically queries Google Books, OpenLibrary, or extracts PDF/Drive metadata.
 */
export async function fetchUniversalBookDetails(input: string): Promise<{
  success: boolean;
  data?: Partial<BookItem>;
  sourceType: BookLinkType;
  message?: string;
  error?: string;
}> {
  if (!input || !input.trim()) {
    return {
      success: false,
      sourceType: 'title_query',
      error: 'Please provide a valid link, ISBN, or book title.'
    };
  }

  const trimmed = input.trim();
  const linkType = detectBookLinkType(trimmed);

  // 1. DIRECT PDF LINK
  if (linkType === 'pdf_direct') {
    const title = formatTitleFromUrl(trimmed);
    const pdfData: Partial<BookItem> = {
      title: title || 'Digital Book Manuscript (PDF)',
      subtitle: 'Complete PDF Document & Reading Edition',
      author: 'Arjun Bharti Mina',
      publisher: 'ABM Media Press & Digital Editions',
      publicationYear: new Date().getFullYear(),
      genre: 'Digital PDF / Literature',
      category: 'Digital PDF / Literature',
      description: `Official digital reading edition and PDF manuscript for "${title}". Includes complete uncut chapters, structural notes, and author commentary.`,
      longSynopsis: `Access the verified PDF publication for "${title}". Optimized for seamless high-resolution viewing across mobile devices and desktop reading environments.`,
      pages: 150,
      language: 'English / Hindi',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      pdfUrl: trimmed,
      pdfPreviewUrl: trimmed,
      previewEmbedUrl: `https://docs.google.com/viewer?url=${encodeURIComponent(trimmed)}&embedded=true`,
      webReaderLink: trimmed,
      sourceType: 'pdf',
      pdfAvailable: true,
      isEbook: true,
      chapters: [
        'Front Cover & Title Declaration',
        'Section I: Theoretical Foundations & Principles',
        'Section II: Methods, Metrics & Applied Cases',
        'Section III: Comprehensive Manuscript Text',
        'Section IV: Conclusions, Appendices & References'
      ]
    };
    return {
      success: true,
      data: pdfData,
      sourceType: 'pdf_direct',
      message: `Detected PDF Link: Generated metadata and PDF viewer configuration for "${title}"!`
    };
  }

  // 2. GOOGLE DRIVE LINK
  if (linkType === 'google_drive') {
    const driveId = extractGoogleDriveId(trimmed);
    const title = formatTitleFromUrl(trimmed) || 'Google Drive Cloud Manuscript';
    const driveEmbed = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : trimmed;
    const driveView = driveId ? `https://drive.google.com/file/d/${driveId}/view` : trimmed;

    const driveData: Partial<BookItem> = {
      title: title.includes('Untitled') ? 'Cloud Stored Manuscript' : title,
      subtitle: 'Google Drive Cloud Edition',
      author: 'Arjun Bharti Mina',
      publisher: 'ABM Cloud Archival Press',
      publicationYear: new Date().getFullYear(),
      genre: 'Academic & Reference',
      category: 'Academic & Reference',
      description: `Secure Google Drive manuscript edition for "${title}". Direct cloud storage access with interactive in-app page viewer.`,
      longSynopsis: `Interactive cloud manuscript powered by Google Drive. Read in full resolution with zoom, pagination, and multi-page preview controls.`,
      pages: 160,
      language: 'English / Hindi',
      cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=800&auto=format&fit=crop',
      driveUrl: driveView,
      pdfUrl: driveView,
      pdfPreviewUrl: driveView,
      previewEmbedUrl: driveEmbed,
      webReaderLink: driveView,
      sourceType: 'drive',
      pdfAvailable: true,
      isEbook: true,
      chapters: [
        'Cloud Document Cover Page',
        'Chapter 1: Foundational Frameworks',
        'Chapter 2: Applied Analysis & Formulae',
        'Chapter 3: Real-World Case Blueprints',
        'Chapter 4: Final Summary & Takeaways'
      ]
    };
    return {
      success: true,
      data: driveData,
      sourceType: 'google_drive',
      message: `Detected Google Drive Document: Configured cloud reader for "${driveData.title}"!`
    };
  }

  // 3. OPENLIBRARY OR ISBN LOOKUP
  if (linkType === 'openlibrary' || linkType === 'isbn') {
    const isbnMatch = trimmed.replace(/[-\s]/g, '').match(/(?:97[89])?\d{9}[\dX]/i);
    const cleanIsbn = isbnMatch ? isbnMatch[0] : '';

    if (cleanIsbn) {
      try {
        const olRes = await fetch(`https://openlibrary.org/isbn/${cleanIsbn}.json`);
        if (olRes.ok) {
          const olData = await olRes.json();
          const title = olData.title || 'Published Volume';
          const pubDate = olData.publish_date || '2026';
          const year = parseInt(pubDate.match(/\d{4}/)?.[0] || '2026', 10);
          const coverId = olData.covers?.[0];
          const coverUrl = coverId 
            ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
            : `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;

          const bookData: Partial<BookItem> = {
            title,
            subtitle: olData.subtitle || 'OpenLibrary Indexed Edition',
            author: 'Arjun Bharti Mina',
            publisher: Array.isArray(olData.publishers) ? olData.publishers[0] : 'ABM Media & Literary Press',
            publicationYear: year,
            publicationDate: pubDate,
            pages: olData.number_of_pages || 175,
            isbn: cleanIsbn,
            isbn13: cleanIsbn.length === 13 ? cleanIsbn : undefined,
            isbn10: cleanIsbn.length === 10 ? cleanIsbn : undefined,
            cover: coverUrl,
            genre: Array.isArray(olData.subjects) ? olData.subjects[0] : 'Literature & Poetry',
            category: Array.isArray(olData.subjects) ? olData.subjects[0] : 'Literature & Poetry',
            description: typeof olData.description === 'string' ? olData.description : (olData.description?.value || `Official literary publication: "${title}".`),
            longSynopsis: typeof olData.description === 'string' ? olData.description : (olData.description?.value || `Complete published manuscript indexed under ISBN ${cleanIsbn}.`),
            sourceType: 'openlibrary',
            googlePlayUrl: `https://play.google.com/store/books/details?id=M71vDwAAQBAJ`,
            playStoreUrl: `https://play.google.com/store/books/details?id=M71vDwAAQBAJ`,
            previewEmbedUrl: `https://books.google.com/books?vid=ISBN${cleanIsbn}&printsec=frontcover&output=embed`,
            webReaderLink: `https://openlibrary.org/isbn/${cleanIsbn}`
          };

          return {
            success: true,
            data: bookData,
            sourceType: 'openlibrary',
            message: `Fetched metadata from OpenLibrary for ISBN: ${cleanIsbn} ("${title}")!`
          };
        }
      } catch {
        // Fall back to Google Books query
      }
    }
  }

  // 4. GOOGLE PLAY BOOKS / GOOGLE BOOKS API (Primary Full-Rich Engine)
  const gResult = await fetchGoogleBookDetails(trimmed);
  if (gResult.success && gResult.data) {
    const d = gResult.data;
    const convertedBook: Partial<BookItem> = {
      title: d.title,
      subtitle: d.subtitle || '',
      author: d.author || 'Arjun Bharti Mina',
      authors: d.authors || ['Arjun Bharti Mina'],
      publisher: d.publisher || 'ABM Media & Literary Press',
      publicationYear: d.publicationYear || 2026,
      publicationDate: d.publishedDate,
      description: d.description || '',
      longSynopsis: d.longSynopsis || d.description || '',
      pages: d.pages || 160,
      language: d.language || 'English / Hindi',
      cover: d.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      isbn: d.isbn || d.isbn13 || d.isbn10,
      isbn10: d.isbn10,
      isbn13: d.isbn13,
      genre: d.genre || d.mainCategory || 'Music & Lyricism',
      category: d.category || d.mainCategory || 'Music & Lyricism',
      categories: d.categories,
      googlePlayUrl: d.googlePlayUrl,
      playStoreUrl: d.playStoreUrl,
      googleBooksVolumeId: d.volumeId,
      previewEmbedUrl: d.previewEmbedUrl,
      webReaderLink: d.webReaderLink,
      buyLink: d.buyLink,
      rating: d.rating,
      ratingsCount: d.ratingsCount,
      price: d.price,
      currencyCode: d.currencyCode,
      isEbook: d.isEbook,
      pdfAvailable: d.pdfAvailable,
      epubAvailable: d.epubAvailable,
      sourceType: 'google_play',
      chapters: [
        'Chapter 1: Foundational Frameworks & Theoretical Architecture',
        'Chapter 2: Techniques, Creative Cadences & Formulas',
        'Chapter 3: Real-World Case Studies & Analytical Blueprints',
        'Chapter 4: Advanced Architectures & Cultural Perspectives',
        'Chapter 5: Summary, Key Takeaways & Action Blueprint'
      ]
    };

    return {
      success: true,
      data: convertedBook,
      sourceType: 'google_play',
      message: `Successfully fetched Google Play Books metadata for "${d.title}"!`
    };
  }

  // 5. GENERAL WEB LINK FALLBACK
  if (linkType === 'web_url') {
    const title = formatTitleFromUrl(trimmed);
    return {
      success: true,
      data: {
        title: title || 'Web Publication',
        subtitle: 'Digital Web Edition',
        author: 'Arjun Bharti Mina',
        publisher: 'ABM Digital Editions',
        publicationYear: new Date().getFullYear(),
        genre: 'Literature & Articles',
        category: 'Literature & Articles',
        description: `Digital publication referenced from ${trimmed}.`,
        longSynopsis: `Digital edition and reading reference. View source link or read in clean manuscript mode.`,
        pages: 120,
        language: 'English / Hindi',
        cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop',
        externalLink: trimmed,
        webReaderLink: trimmed,
        sourceType: 'custom',
        isEbook: true
      },
      sourceType: 'web_url',
      message: `Configured web link publication for "${title}"!`
    };
  }

  return {
    success: false,
    sourceType: linkType,
    error: gResult.error || 'Could not auto-fetch book details from the provided input. You can enter the details manually.'
  };
}

