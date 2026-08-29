import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  BookOpen, 
  ExternalLink, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Search, 
  Sparkles,
  Eye,
  Download,
  Star,
  RefreshCw,
  Maximize2,
  Minimize2,
  AlertCircle,
  HelpCircle,
  Link as LinkIcon,
  BookMarked
} from 'lucide-react';
import { 
  extractGoogleBooksId, 
  getGoogleBooksEmbedUrl, 
  getGooglePlayStoreUrl, 
  getGooglePlayReaderUrl,
  fetchGoogleBookDetails,
  GoogleBookParsedData,
  DEFAULT_FALLBACK_VOLUME_ID
} from '../../utils/googleBooksUtils';
import { BookItem } from '../../types';

export const BooksView: React.FC = () => {
  const { books, openShare, setSelectedBookId, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Embedded Reader State
  const [activeEmbedBookId, setActiveEmbedBookId] = useState<string>(() => {
    return books[0]?.id || 'book-1';
  });
  const [embedError, setEmbedError] = useState<boolean>(false);
  const [isEmbedExpanded, setIsEmbedExpanded] = useState<boolean>(false);
  const [isFetchingFresh, setIsFetchingFresh] = useState<boolean>(false);

  // Live Google Play Books Inspector / Custom URL Fetcher
  const [showLiveInspector, setShowLiveInspector] = useState<boolean>(false);
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [fetchedCustomBook, setFetchedCustomBook] = useState<GoogleBookParsedData | null>(null);
  const [customFetchLoading, setCustomFetchLoading] = useState<boolean>(false);
  const [customFetchError, setCustomFetchError] = useState<string | null>(null);

  const categories = ['All', 'Music & Lyricism', 'Engineering & Tech', 'Creative Writing'];

  const activeBook = books.find(b => b.id === activeEmbedBookId) || books[0];
  const activeVolumeId = activeBook 
    ? (activeBook.googleBooksVolumeId || extractGoogleBooksId(activeBook.playStoreUrl || activeBook.googlePlayUrl) || DEFAULT_FALLBACK_VOLUME_ID)
    : DEFAULT_FALLBACK_VOLUME_ID;
  
  const embedSrc = getGoogleBooksEmbedUrl(activeVolumeId);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.subtitle && book.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchTerm));

    const matchesCategory = 
      selectedCategory === 'All' || 
      (selectedCategory === 'Music & Lyricism' && (book.category?.toLowerCase().includes('music') || book.title.toLowerCase().includes('lyric'))) ||
      (selectedCategory === 'Engineering & Tech' && (book.category?.toLowerCase().includes('engineering') || book.title.toLowerCase().includes('civil') || book.title.toLowerCase().includes('mechanics'))) ||
      (selectedCategory === 'Creative Writing' && (book.category?.toLowerCase().includes('creative') || book.category?.toLowerCase().includes('writing')));

    return matchesSearch && matchesCategory;
  });

  const handleCustomFetch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customInputUrl.trim()) return;

    setCustomFetchLoading(true);
    setCustomFetchError(null);
    setFetchedCustomBook(null);

    const result = await fetchGoogleBookDetails(customInputUrl);
    setCustomFetchLoading(false);

    if (result.success && result.data) {
      setFetchedCustomBook(result.data);
      showToast(`Fetched details for "${result.data.title}" from Google Play Books!`, 'success');
    } else {
      setCustomFetchError(result.error || 'Failed to fetch details from Google Play Books.');
      showToast('Could not retrieve book from Google Play Books link', 'error');
    }
  };

  const handleRefreshActiveBookMetadata = async () => {
    if (!activeBook) return;
    setIsFetchingFresh(true);
    const query = activeBook.googleBooksVolumeId || activeBook.playStoreUrl || activeBook.googlePlayUrl || activeBook.title;
    const result = await fetchGoogleBookDetails(query);
    setIsFetchingFresh(false);

    if (result.success && result.data) {
      showToast(`Verified live data for "${activeBook.title}" on Google Books!`, 'success');
    } else {
      showToast('Using verified local cached metadata for preview.', 'info');
    }
  };

  return (
    <div id="books-view" className="space-y-10 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Literature & Publications</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a2.38 2.38 0 0 1-.61-.755L3 21.43V2.57l.001-.001c.14-.306.353-.574.608-.755zm1.536-1.537l9.36 5.405-2.713 2.713-6.647-8.118zm0 23.446l6.647-8.118 2.713 2.713-9.36 5.405zm14.887-10.74l-4.134 2.387-2.92-2.92 2.92-2.92 4.134 2.387c.808.467.808 1.599 0 2.066z"/>
            </svg>
            <span>Google Play Books Connected</span>
          </span>
          <span className="text-xs font-mono text-neutral-500 ml-auto">
            {books.length} Published Works
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Authored Books & Guides
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mt-1">
              Read embedded previews, inspect verified Google Play Books catalog data, and explore literature authored by Arjun Bharti Mina.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowLiveInspector(!showLiveInspector)}
            className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 transition-colors shadow-sm cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>{showLiveInspector ? 'Hide Link Fetcher' : 'Fetch from Google Play Link'}</span>
          </button>
        </div>
      </div>

      {/* Live Google Play Books Inspector / Link Fetcher Drawer */}
      {showLiveInspector && (
        <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/90 border border-amber-500/30 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                  Google Play Books Link & Details Fetcher
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Paste any Google Play Books store link, Google Books URL, ISBN, or title to fetch official metadata & live embedded preview.
              </p>
            </div>
          </div>

          <form onSubmit={handleCustomFetch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. https://play.google.com/store/books/details?id=M71vDwAAQBAJ or ISBN: 9789388302198"
                value={customInputUrl}
                onChange={(e) => setCustomInputUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={customFetchLoading || !customInputUrl.trim()}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md cursor-pointer"
            >
              {customFetchLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Fetch Book Details</span>
                </>
              )}
            </button>
          </form>

          {/* Quick preset buttons for instant test */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-neutral-500">
            <span>Try sample works:</span>
            <button
              type="button"
              onClick={() => {
                setCustomInputUrl('https://play.google.com/store/books/details?id=M71vDwAAQBAJ');
                handleCustomFetch();
              }}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 transition-colors"
            >
              The Lyricist's Blueprint (Google Play)
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomInputUrl('https://play.google.com/store/books/details?id=3u7eDwAAQBAJ');
                handleCustomFetch();
              }}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 transition-colors"
            >
              Civil Mechanics Primer (Google Play)
            </button>
          </div>

          {/* Error display */}
          {customFetchError && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{customFetchError}</span>
            </div>
          )}

          {/* Fetched result card */}
          {fetchedCustomBook && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={fetchedCustomBook.coverImage || fetchedCustomBook.thumbnail}
                  alt={fetchedCustomBook.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-28 object-cover rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 flex-shrink-0"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase font-mono">
                      {fetchedCustomBook.mainCategory || 'Book'}
                    </span>
                    {fetchedCustomBook.averageRating && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold flex items-center gap-1 font-mono">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{fetchedCustomBook.averageRating} ({fetchedCustomBook.ratingsCount || 0})</span>
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-neutral-400">
                      ID: {fetchedCustomBook.volumeId}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                    {fetchedCustomBook.title}
                  </h4>
                  {fetchedCustomBook.subtitle && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {fetchedCustomBook.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                    {fetchedCustomBook.description}
                  </p>
                  <div className="text-[11px] font-mono text-neutral-500 flex flex-wrap gap-3 pt-1">
                    <span>✍️ {fetchedCustomBook.authors?.join(', ')}</span>
                    <span>🏢 {fetchedCustomBook.publisher}</span>
                    <span>📄 {fetchedCustomBook.pageCount} Pages</span>
                    <span>📅 {fetchedCustomBook.publicationYear}</span>
                    {fetchedCustomBook.isbn13 && <span>🏷️ ISBN: {fetchedCustomBook.isbn13}</span>}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <a
                  href={fetchedCustomBook.googlePlayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Open on Google Play</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {fetchedCustomBook.webReaderLink && (
                  <a
                    href={fetchedCustomBook.webReaderLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Open Google Play Web Reader</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Featured Google Play Books Embedded Preview Deck */}
      {activeBook && (
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl relative overflow-hidden space-y-6">
          {/* Top Bar inside Embed Deck */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    Live Google Play Books Reader Embed
                  </span>
                  {activeBook.rating && (
                    <span className="text-[10px] font-mono text-yellow-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{activeBook.rating}</span>
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {activeBook.title}
                </h2>
              </div>
            </div>

            {/* Quick action buttons on reader deck */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefreshActiveBookMetadata}
                disabled={isFetchingFresh}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Verify live details on Google Books"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingFresh ? 'animate-spin text-amber-400' : ''}`} />
                <span className="hidden sm:inline">Sync Live</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEmbedExpanded(!isEmbedExpanded)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title={isEmbedExpanded ? 'Compact Reader' : 'Expand Reader'}
              >
                {isEmbedExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isEmbedExpanded ? 'Compact' : 'Expand'}</span>
              </button>

              {(activeBook.playStoreUrl || activeBook.googlePlayUrl) && (
                <a
                  href={activeBook.playStoreUrl || activeBook.googlePlayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <span>Google Play</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Book Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase mr-1">Switch Volume:</span>
            {books.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setActiveEmbedBookId(b.id);
                  setEmbedError(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeEmbedBookId === b.id
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-lg'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800 border border-neutral-700/50'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span className="truncate max-w-[180px]">{b.title}</span>
              </button>
            ))}
          </div>

          {/* Embedded Google Books Preview Iframe */}
          <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-inner">
            <iframe
              id="google-play-books-iframe"
              key={activeVolumeId}
              src={embedSrc}
              title={`Google Play Books Embed: ${activeBook.title}`}
              className={`w-full transition-all duration-300 border-0 ${
                isEmbedExpanded ? 'h-[650px] sm:h-[750px]' : 'h-[400px] sm:h-[480px]'
              }`}
              loading="lazy"
              onError={() => setEmbedError(true)}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            />

            {/* Error or Sandbox Fallback Banner */}
            {embedError && (
              <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Browser Security Notice</h4>
                <p className="text-xs text-neutral-400 max-w-md">
                  Google Play Books preview requires opening directly due to strict iframe third-party cookie policies in sandboxed environments.
                </p>
                <div className="flex gap-2">
                  <a
                    href={getGooglePlayReaderUrl(activeVolumeId)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Launch Google Play Web Reader</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Quick Details footer under embed */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-neutral-400 font-mono pt-2 border-t border-neutral-800/80">
            <div>
              <span className="text-neutral-500 block text-[10px]">AUTHOR</span>
              <span className="text-white font-semibold">{activeBook.author || 'Arjun Bharti Mina'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">PAGES & FORMAT</span>
              <span className="text-white font-semibold">{activeBook.pages} Pages • Digital & Print</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">PUBLISHER</span>
              <span className="text-white font-semibold">{activeBook.publisher || 'ABM Media Press'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">ISBN / CODE</span>
              <span className="text-amber-400 font-semibold">{activeBook.isbn || '978-93-88302-19-8'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search books, ISBN, topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-amber-500 dark:text-neutral-950 font-bold shadow-md'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books List Grid */}
      <div className="space-y-8">
        {filteredBooks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">No books found</h3>
            <p className="text-xs text-neutral-500 mt-1">Try searching with a different term or clearing category filter.</p>
          </div>
        ) : (
          filteredBooks.map((book) => {
            const chaptersList = book.chaptersSummary && book.chaptersSummary.length > 0
              ? book.chaptersSummary
              : book.chapters || [];

            const bookVolumeId = book.googleBooksVolumeId || extractGoogleBooksId(book.playStoreUrl || book.googlePlayUrl) || DEFAULT_FALLBACK_VOLUME_ID;

            return (
              <div
                key={book.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md hover:shadow-2xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-8 items-start group"
              >
                {/* Book Cover Artwork */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <div 
                    onClick={() => setSelectedBookId(book.id)}
                    className="w-48 sm:w-56 rounded-2xl overflow-hidden shadow-2xl border border-neutral-300 dark:border-neutral-800 transform group-hover:scale-105 transition-transform duration-300 bg-neutral-950 cursor-pointer relative"
                  >
                    <img 
                      src={book.cover} 
                      alt={book.title} 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop';
                      }}
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full bg-black/80 text-amber-400 text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Interactive Details</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-center space-y-1">
                    <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block">
                      {book.pages} Pages • {book.language || 'English'}
                    </span>
                    {book.isbn && (
                      <span className="text-[10px] font-mono text-neutral-400 block">
                        ISBN: {book.isbn}
                      </span>
                    )}
                  </div>
                </div>

                {/* Book Details */}
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {book.category || 'Literature'}
                      </span>
                      {book.rating && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center gap-1 border border-yellow-500/20">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{book.rating} ({book.ratingsCount || 100}+ reviews)</span>
                        </span>
                      )}
                      <span className="text-xs font-mono text-neutral-500">
                        Published: {book.publicationYear}
                      </span>
                    </div>

                    <h2 
                      onClick={() => setSelectedBookId(book.id)}
                      className="text-2xl sm:text-3xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 hover:text-amber-500 transition-colors cursor-pointer"
                    >
                      {book.title}
                    </h2>
                    {book.subtitle && (
                      <p className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400 mt-1">
                        {book.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {book.description || book.longSynopsis}
                  </p>

                  {/* Chapter Highlights */}
                  {chaptersList.length > 0 && (
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold block">
                          Featured Chapters & Outline
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedBookId(book.id)}
                          className="text-[11px] font-mono text-amber-500 hover:underline font-semibold cursor-pointer"
                        >
                          View all {chaptersList.length} chapters →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                        {chaptersList.slice(0, 4).map((chap, idx) => (
                          <div key={idx} className="flex items-center gap-2 truncate">
                            <Bookmark className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            <span className="truncate">{chap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Purchase, Preview & Share Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveEmbedBookId(book.id);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="px-4 py-2.5 rounded-full bg-neutral-900 text-white dark:bg-amber-500 dark:text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Stream in Google Reader</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedBookId(book.id)}
                      className="px-4 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold text-xs flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-500" />
                      <span>Book Details & Chapters</span>
                    </button>

                    {(book.playStoreUrl || book.googlePlayUrl) && (
                      <a
                        href={book.playStoreUrl || book.googlePlayUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <span>Google Play Books</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {book.amazonUrl && (
                      <a
                        href={book.amazonUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <span>Amazon</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => openShare({
                        type: 'book',
                        title: `${book.title} by Arjun Bharti Mina`,
                        text: book.description,
                        url: book.playStoreUrl || book.googlePlayUrl || window.location.href,
                        imageUrl: book.cover
                      })}
                      className="p-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Share Book"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
