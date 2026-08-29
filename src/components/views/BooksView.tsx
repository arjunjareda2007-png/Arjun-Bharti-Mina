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
  BookMarked,
  SlidersHorizontal,
  ChevronRight,
  ShoppingBag,
  FileText,
  Copy,
  Check,
  Award,
  Globe,
  Tag,
  Grid,
  ListFilter
} from 'lucide-react';
import { 
  extractGoogleBooksId, 
  getGoogleBooksEmbedUrl, 
  getGooglePlayStoreUrl, 
  getGooglePlayReaderUrl, 
  fetchGoogleBookDetails,
  applyGoogleBookDataToBook,
  GoogleBookParsedData, 
  DEFAULT_FALLBACK_VOLUME_ID 
} from '../../utils/googleBooksUtils';
import { BookItem } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { CINEMATIC_EASE, sectionReveal } from '../../utils/motion';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';

export const BooksView: React.FC = () => {
  const { books, openShare, setSelectedBookId, showToast, updateBook } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'showcase' | 'grid'>('showcase');
  
  // Embedded Reader State
  const [activeEmbedBookId, setActiveEmbedBookId] = useState<string>(() => {
    return books[0]?.id || 'book-1';
  });
  const [embedError, setEmbedError] = useState<boolean>(false);
  const [isEmbedExpanded, setIsEmbedExpanded] = useState<boolean>(false);
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);

  // Live Google Play Books Inspector / Custom URL Fetcher
  const [showLiveInspector, setShowLiveInspector] = useState<boolean>(false);
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [fetchedCustomBook, setFetchedCustomBook] = useState<GoogleBookParsedData | null>(null);
  const [customFetchLoading, setCustomFetchLoading] = useState<boolean>(false);
  const [customFetchError, setCustomFetchError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Featured book spotlight
  const [activeSpotlightTab, setActiveSpotlightTab] = useState<'overview' | 'chapters' | 'specs'>('overview');

  const categories = ['All', 'Music & Lyricism', 'Engineering & Tech', 'Literature & Creative'];

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
      (book.isbn && book.isbn.includes(searchTerm)) ||
      (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' || 
      (selectedCategory === 'Music & Lyricism' && (book.category?.toLowerCase().includes('music') || book.title.toLowerCase().includes('lyric') || book.genre?.toLowerCase().includes('music'))) ||
      (selectedCategory === 'Engineering & Tech' && (book.category?.toLowerCase().includes('engineering') || book.title.toLowerCase().includes('civil') || book.title.toLowerCase().includes('mechanics'))) ||
      (selectedCategory === 'Literature & Creative' && (book.category?.toLowerCase().includes('literature') || book.category?.toLowerCase().includes('creative') || book.category?.toLowerCase().includes('writing')));

    return matchesSearch && matchesCategory;
  });

  const handleCustomFetch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customInputUrl.trim()) return;

    hapticLight();
    setCustomFetchLoading(true);
    setCustomFetchError(null);
    setFetchedCustomBook(null);

    const result = await fetchGoogleBookDetails(customInputUrl);
    setCustomFetchLoading(false);

    if (result.success && result.data) {
      hapticSuccess();
      setFetchedCustomBook(result.data);
      showToast(`Fetched "${result.data.title}" from Google Play Books!`, 'success');
    } else {
      setCustomFetchError(result.error || 'Failed to fetch details from Google Play Books.');
      showToast('Could not retrieve book from Google Play Books link', 'error');
    }
  };

  const handleSyncAllFromGoogleBooks = async () => {
    hapticLight();
    setIsSyncingAll(true);
    showToast('Connecting to Google Play Books to refresh catalog metadata...', 'info');

    let updatedCount = 0;
    for (const b of books) {
      const query = b.googleBooksVolumeId || b.playStoreUrl || b.googlePlayUrl || b.isbn || b.title;
      try {
        const res = await fetchGoogleBookDetails(query);
        if (res.success && res.data) {
          const updated = applyGoogleBookDataToBook(b, res.data);
          await updateBook(updated);
          updatedCount++;
        }
      } catch (e) {
        console.warn('Sync failed for book:', b.title, e);
      }
    }

    setIsSyncingAll(false);
    hapticSuccess();
    showToast(`Successfully synced ${updatedCount} books with live Google Play Books data!`, 'success');
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadSample = (book: BookItem) => {
    hapticLight();
    showToast(`Generating sample preview for "${book.title}"...`, 'info');
    const chapters = book.chaptersSummary || book.chapters || [
      'Chapter 1: Foundations & Core Principles',
      'Chapter 2: Techniques, Cadences & Formulas',
      'Chapter 3: Real-World Case Studies & Creative Workflows'
    ];
    const storeUrl = book.playStoreUrl || book.googlePlayUrl || getGooglePlayStoreUrl(book.googleBooksVolumeId || '');
    const sampleText = `=========================================================\n${book.title.toUpperCase()}\nSubtitle: ${book.subtitle || 'N/A'}\nAuthor: ${book.author || 'Arjun Bharti Mina'}\nPublisher: ${book.publisher || 'ABM Media & Literary Press'}\nPublication Year: ${book.publicationYear}\nISBN: ${book.isbn || 'N/A'}\nPages: ${book.pages}\nLanguage: ${book.language || 'English / Hindi'}\n=========================================================\n\nSYNOPSIS:\n${book.longSynopsis || book.description}\n\nCHAPTER HIGHLIGHTS:\n${chapters.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nRead more or purchase the complete volume on Google Play Books:\n${storeUrl}\n\n© ${book.publicationYear} Arjun Bharti Mina. All rights reserved.`;
    
    const blob = new Blob([sampleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_preview.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    hapticSuccess();
    showToast('Book sample downloaded successfully!', 'success');
  };

  return (
    <div id="books-view" className="space-y-10 max-w-6xl mx-auto pb-12">
      
      {/* 1. HERO & EDITORIAL HEADER */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={sectionReveal}
        className="space-y-4 border-b border-neutral-200 dark:border-neutral-800 pb-8"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Literature & Publications</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a2.38 2.38 0 0 1-.61-.755L3 21.43V2.57l.001-.001c.14-.306.353-.574.608-.755zm1.536-1.537l9.36 5.405-2.713 2.713-6.647-8.118zm0 23.446l6.647-8.118 2.713 2.713-9.36 5.405zm14.887-10.74l-4.134 2.387-2.92-2.92 2.92-2.92 4.134 2.387c.808.467.808 1.599 0 2.066z"/>
            </svg>
            <span>Google Play Books Catalog</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs">
            <Globe className="w-3.5 h-3.5" />
            <span>Direct Reader Embeds</span>
          </span>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 ml-auto hidden sm:inline-block">
            {books.length} Published Titles
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-neutral-950 dark:text-white tracking-tight leading-[1.1]">
              Literary Works & Primers
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Explore authored guidebooks, technical primers, and poetic blueprints by Arjun Bharti Mina — complete with live Google Play Books reader embeds, ISBN catalog specs, and chapter excerpts.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleSyncAllFromGoogleBooks}
              disabled={isSyncingAll}
              className="px-3.5 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              title="Sync live metadata and ratings for all books via Google Books API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin text-amber-500' : ''}`} />
              <span>{isSyncingAll ? 'Syncing...' : 'Sync with Google Books'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => {
                hapticLight();
                setShowLiveInspector(!showLiveInspector);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all shadow-sm cursor-pointer ${
                showLiveInspector
                  ? 'bg-amber-500 text-neutral-950 border-amber-500 font-extrabold'
                  : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:border-amber-500'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>{showLiveInspector ? 'Hide Link Fetcher' : 'Fetch from Google Play Link'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 2. GOOGLE PLAY BOOKS LINK & DETAILS FETCHER DRAWER */}
      <AnimatePresence>
        {showLiveInspector && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.35, ease: CINEMATIC_EASE }}
            className="overflow-hidden"
          >
            <div className="p-6 sm:p-7 rounded-3xl bg-neutral-50 dark:bg-neutral-900/90 border-2 border-amber-500/30 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-neutral-950 dark:text-white">
                      Google Play Books Link & Details Fetcher
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Paste any Google Play Books URL, Google Books link, ISBN (e.g. 9789388302198), or volume ID to fetch verified metadata.
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full w-fit">
                  Live Google Books API v1
                </span>
              </div>

              <form onSubmit={handleCustomFetch} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. https://play.google.com/store/books/details?id=M71vDwAAQBAJ or ISBN: 9789388302198"
                    value={customInputUrl}
                    onChange={(e) => setCustomInputUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={customFetchLoading || !customInputUrl.trim()}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md cursor-pointer shrink-0"
                >
                  {customFetchLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Fetching Details...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Fetch All Details</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sample Quick-Picks */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span className="font-semibold">Quick Sample Links:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomInputUrl('https://play.google.com/store/books/details?id=M71vDwAAQBAJ');
                    handleCustomFetch();
                  }}
                  className="px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 transition-colors cursor-pointer text-xs"
                >
                  The Lyricist's Blueprint (ID: M71vDwAAQBAJ)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomInputUrl('https://play.google.com/store/books/details?id=3u7eDwAAQBAJ');
                    handleCustomFetch();
                  }}
                  className="px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 transition-colors cursor-pointer text-xs"
                >
                  Civil Mechanics Primer (ID: 3u7eDwAAQBAJ)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomInputUrl('9789388302198');
                    handleCustomFetch();
                  }}
                  className="px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 transition-colors cursor-pointer text-xs font-mono"
                >
                  Search by ISBN: 9789388302198
                </button>
              </div>

              {/* Error Box */}
              {customFetchError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{customFetchError}</span>
                </div>
              )}

              {/* Fetched Book Card */}
              {fetchedCustomBook && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <div className="w-28 sm:w-32 rounded-xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-700 shrink-0 bg-neutral-950">
                      <img
                        src={fetchedCustomBook.coverImage || fetchedCustomBook.thumbnail}
                        alt={fetchedCustomBook.title}
                        referrerPolicy="no-referrer"
                        className="w-full aspect-[2/3] object-cover"
                      />
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold uppercase">
                          {fetchedCustomBook.mainCategory || 'Literature'}
                        </span>
                        {fetchedCustomBook.averageRating && (
                          <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold flex items-center gap-1 font-mono">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{fetchedCustomBook.averageRating} ({fetchedCustomBook.ratingsCount || 0} reviews)</span>
                          </span>
                        )}
                        {fetchedCustomBook.price && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                            {fetchedCustomBook.price}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-neutral-400 ml-auto">
                          ID: {fetchedCustomBook.volumeId}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-neutral-950 dark:text-white">
                        {fetchedCustomBook.title}
                      </h4>
                      {fetchedCustomBook.subtitle && (
                        <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                          {fetchedCustomBook.subtitle}
                        </p>
                      )}

                      <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                        {fetchedCustomBook.description}
                      </p>

                      {/* Detailed Specs Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl">
                        <div>
                          <span className="text-neutral-400 block text-[9px] uppercase">Author</span>
                          <span className="font-semibold text-neutral-900 dark:text-neutral-200 truncate block">
                            {fetchedCustomBook.authors?.join(', ') || 'Arjun Bharti Mina'}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[9px] uppercase">Publisher</span>
                          <span className="font-semibold text-neutral-900 dark:text-neutral-200 truncate block">
                            {fetchedCustomBook.publisher || 'ABM Press'}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[9px] uppercase">Pages & Year</span>
                          <span className="font-semibold text-neutral-900 dark:text-neutral-200 block">
                            {fetchedCustomBook.pageCount} Pages • {fetchedCustomBook.publicationYear}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[9px] uppercase">ISBN-13</span>
                          <span className="font-semibold text-amber-500 font-mono block truncate">
                            {fetchedCustomBook.isbn13 || fetchedCustomBook.isbn10 || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions on fetched result */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex flex-wrap items-center gap-2">
                      {fetchedCustomBook.googlePlayUrl && (
                        <a
                          href={fetchedCustomBook.googlePlayUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Google Play Books Store</span>
                        </a>
                      )}

                      {fetchedCustomBook.webReaderLink && (
                        <a
                          href={fetchedCustomBook.webReaderLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Google Play Web Reader</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(fetchedCustomBook.isbn13 || fetchedCustomBook.volumeId, 'ISBN/ID')}
                        className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedField === 'ISBN/ID' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'ISBN/ID' ? 'Copied' : 'Copy ID'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. FEATURED SPOTLIGHT & LIVE READER EMBED DECK */}
      {activeBook && (
        <motion.section 
          id="featured-book-spotlight"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={sectionReveal}
          className="rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl overflow-hidden relative"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar of Reader Deck */}
          <div className="p-6 sm:p-8 border-b border-neutral-800/90 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shadow-inner shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    Live Google Play Reader Embed
                  </span>
                  {activeBook.rating && (
                    <span className="text-[10px] font-mono text-yellow-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{activeBook.rating} ({activeBook.ratingsCount || 100}+ reviews)</span>
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-neutral-400">
                    Volume: {activeVolumeId}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-1">
                  {activeBook.title}
                </h2>
              </div>
            </div>

            {/* Deck Controls */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  setIsEmbedExpanded(!isEmbedExpanded);
                }}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title={isEmbedExpanded ? 'Switch to Compact Height' : 'Expand Height'}
              >
                {isEmbedExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isEmbedExpanded ? 'Compact View' : 'Expand View'}</span>
              </button>

              {(activeBook.playStoreUrl || activeBook.googlePlayUrl) && (
                <a
                  href={activeBook.playStoreUrl || activeBook.googlePlayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <span>Google Play</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Book Switcher Tabs */}
          <div className="px-6 sm:px-8 py-3 bg-neutral-900/90 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto relative z-10">
            <span className="text-[11px] font-mono text-neutral-400 uppercase mr-1 shrink-0">Switch Book:</span>
            {books.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  hapticSelection();
                  setActiveEmbedBookId(b.id);
                  setEmbedError(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  activeEmbedBookId === b.id
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-lg'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-700/50'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{b.title}</span>
              </button>
            ))}
          </div>

          {/* Embedded Google Books Iframe Frame */}
          <div className="p-6 sm:p-8 space-y-6 relative z-10">
            <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl">
              <iframe
                id="google-play-books-main-iframe"
                key={activeVolumeId}
                src={embedSrc}
                title={`Google Play Books Embed: ${activeBook.title}`}
                className={`w-full transition-all duration-300 border-0 ${
                  isEmbedExpanded ? 'h-[650px] sm:h-[750px]' : 'h-[420px] sm:h-[500px]'
                }`}
                loading="lazy"
                onError={() => setEmbedError(true)}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
              />

              {/* Browser Security Fallback Notice if third-party cookies block iframe */}
              {embedError && (
                <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Browser Security Notice</h4>
                  <p className="text-xs text-neutral-400 max-w-md">
                    Google Play Books interactive reader can also be launched directly in Google Play Web Reader for full-screen reading.
                  </p>
                  <a
                    href={getGooglePlayReaderUrl(activeVolumeId)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Launch Google Play Web Reader</span>
                  </a>
                </div>
              )}
            </div>

            {/* Publication Specs Strip under Embed */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs font-mono">
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Author & Creator</span>
                <span className="text-white font-bold">{activeBook.author || 'Arjun Bharti Mina'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Pages & Format</span>
                <span className="text-white font-bold">{activeBook.pages} Pages • Digital & Print</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Publisher</span>
                <span className="text-white font-bold">{activeBook.publisher || 'ABM Media Press'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">ISBN Code</span>
                <span className="text-amber-400 font-bold">{activeBook.isbn || '978-93-88302-19-8'}</span>
              </div>
            </div>

            {/* Actions Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedBookId(activeBook.id)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full Book Overview & Chapters</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadSample(activeBook)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Sample (.txt)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => openShare({
                  type: 'book',
                  title: `${activeBook.title} by Arjun Bharti Mina`,
                  text: activeBook.description,
                  url: activeBook.playStoreUrl || activeBook.googlePlayUrl || window.location.href,
                  imageUrl: activeBook.cover
                })}
                className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Book</span>
              </button>
            </div>

          </div>
        </motion.section>
      )}

      {/* 4. SEARCH & CATEGORY FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search books, ISBN, topics, genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors shadow-xs"
          />
        </div>

        {/* Category Pills & View Switcher */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  hapticLight();
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white dark:bg-amber-500 dark:text-neutral-950 font-bold shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('showcase')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'showcase' ? 'bg-white dark:bg-neutral-900 text-amber-500 shadow-xs' : 'text-neutral-400'
              }`}
              title="Showcase View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white dark:bg-neutral-900 text-amber-500 shadow-xs' : 'text-neutral-400'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. BOOKS CATALOG LIST / GRID */}
      <div className="space-y-6">
        {filteredBooks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <BookOpen className="w-12 h-12 text-neutral-400 mx-auto opacity-40" />
            <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">No books found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              We couldn't find any books matching "{searchTerm}". Try clearing your search query or selecting a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'showcase' ? (
          /* SHOWCASE EDITORIAL LIST */
          <div className="space-y-6">
            {filteredBooks.map((book) => {
              const chaptersList = book.chaptersSummary && book.chaptersSummary.length > 0
                ? book.chaptersSummary
                : book.chapters || [];

              const bookVolumeId = book.googleBooksVolumeId || extractGoogleBooksId(book.playStoreUrl || book.googlePlayUrl) || DEFAULT_FALLBACK_VOLUME_ID;

              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: CINEMATIC_EASE }}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-8 items-start group"
                >
                  {/* Left: 3D-Style Cover with Sheen */}
                  <div className="md:col-span-4 flex flex-col items-center">
                    <div 
                      onClick={() => {
                        hapticSelection();
                        setSelectedBookId(book.id);
                      }}
                      className="w-48 sm:w-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-200 dark:border-neutral-800 transform group-hover:scale-105 transition-transform duration-300 bg-neutral-950 cursor-pointer relative"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                        <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Book</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 text-center space-y-1">
                      <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 block font-semibold">
                        {book.pages} Pages • {book.language || 'English / Hindi'}
                      </span>
                      {book.isbn && (
                        <span className="text-[10px] font-mono text-neutral-400 block">
                          ISBN: {book.isbn}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Book Metadata & Chapters */}
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
                        onClick={() => {
                          hapticSelection();
                          setSelectedBookId(book.id);
                        }}
                        className="text-2xl sm:text-3xl font-display font-extrabold text-neutral-950 dark:text-white hover:text-amber-500 transition-colors cursor-pointer leading-tight"
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

                    {/* Chapter Outline Preview Box */}
                    {chaptersList.length > 0 && (
                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold block">
                            Key Chapters & Excerpts
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              hapticSelection();
                              setSelectedBookId(book.id);
                            }}
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

                    {/* Actions */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          hapticLight();
                          setActiveEmbedBookId(book.id);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                        className="px-4 py-2.5 rounded-full bg-neutral-950 text-white dark:bg-amber-500 dark:text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Stream in Google Reader</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          hapticSelection();
                          setSelectedBookId(book.id);
                        }}
                        className="px-4 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold text-xs flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-500" />
                        <span>Details & Specs</span>
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

                      <button
                        type="button"
                        onClick={() => handleDownloadSample(book)}
                        className="p-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Download Sample"
                      >
                        <Download className="w-4 h-4 text-amber-500" />
                      </button>

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
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* COMPACT 3-COLUMN GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div 
                    onClick={() => {
                      hapticSelection();
                      setSelectedBookId(book.id);
                    }}
                    className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative cursor-pointer"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-amber-400 text-[10px] font-mono font-bold border border-amber-400/20">
                        {book.category || 'Literature'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 
                      onClick={() => {
                        hapticSelection();
                        setSelectedBookId(book.id);
                      }}
                      className="text-base font-bold text-neutral-950 dark:text-white line-clamp-1 hover:text-amber-500 cursor-pointer"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                      {book.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">
                    {book.pages} Pages • {book.publicationYear}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        hapticLight();
                        setActiveEmbedBookId(book.id);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="p-2 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-neutral-950 transition-colors cursor-pointer"
                      title="Read in Google Reader"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                    {(book.playStoreUrl || book.googlePlayUrl) && (
                      <a
                        href={book.playStoreUrl || book.googlePlayUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors"
                        title="Google Play Store"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
