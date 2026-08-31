import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  RefreshCw, 
  Link as LinkIcon, 
  BookMarked,
  Globe,
  Grid,
  ListFilter,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  fetchGoogleBookDetails,
  applyGoogleBookDataToBook,
  GoogleBookParsedData,
  getGooglePlayStoreUrl
} from '../../utils/googleBooksUtils';
import { BookItem } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { CINEMATIC_EASE, sectionReveal } from '../../utils/motion';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';
import { GooglePlayReaderDeck } from '../books/GooglePlayReaderDeck';
import { GooglePlayLinkFetcher } from '../books/GooglePlayLinkFetcher';
import { BookEditorialCard } from '../books/BookEditorialCard';
import { BookGridCard } from '../books/BookGridCard';

export const BooksView: React.FC = () => {
  const { isOwner, authUser, books, openShare, setSelectedBookId, showToast, updateBook, addBook } = useStore();
  const canManage = isOwner || !!authUser;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'showcase' | 'grid'>('showcase');
  
  // Embedded Reader State
  const [activeEmbedBookId, setActiveEmbedBookId] = useState<string>(() => {
    return books[0]?.id || 'book-1';
  });
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);
  const [showLiveInspector, setShowLiveInspector] = useState<boolean>(false);

  const categories = ['All', 'Music & Lyricism', 'Engineering & Tech', 'Literature & Writing'];

  const filteredBooks = books.filter((book) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query || 
      book.title.toLowerCase().includes(query) ||
      (book.subtitle && book.subtitle.toLowerCase().includes(query)) ||
      (book.description && book.description.toLowerCase().includes(query)) ||
      (book.isbn && book.isbn.includes(query)) ||
      (book.author && book.author.toLowerCase().includes(query));

    const matchesCategory = 
      selectedCategory === 'All' || 
      (selectedCategory === 'Music & Lyricism' && (book.category?.toLowerCase().includes('music') || book.title.toLowerCase().includes('lyric') || book.genre?.toLowerCase().includes('music'))) ||
      (selectedCategory === 'Engineering & Tech' && (book.category?.toLowerCase().includes('engineering') || book.title.toLowerCase().includes('civil') || book.title.toLowerCase().includes('mechanics'))) ||
      (selectedCategory === 'Literature & Writing' && (book.category?.toLowerCase().includes('literature') || book.category?.toLowerCase().includes('writing') || book.category?.toLowerCase().includes('creative')));

    return matchesSearch && matchesCategory;
  });

  const handleSaveFetchedToCatalog = async (fetched: GoogleBookParsedData) => {
    hapticLight();
    const existingIndex = books.findIndex(
      b => b.googleBooksVolumeId === fetched.volumeId || 
           (fetched.isbn && b.isbn === fetched.isbn) || 
           b.title.toLowerCase() === fetched.title.toLowerCase()
    );

    if (existingIndex >= 0) {
      const existing = books[existingIndex];
      const updated = applyGoogleBookDataToBook(existing, fetched);
      await updateBook(updated);
      setActiveEmbedBookId(updated.id);
      showToast(`Updated "${updated.title}" in your catalog!`, 'success');
    } else {
      const newBook: BookItem = {
        id: `book-${Date.now()}`,
        title: fetched.title,
        subtitle: fetched.subtitle,
        author: fetched.author || 'Arjun Bharti Mina',
        authors: fetched.authors || ['Arjun Bharti Mina'],
        publisher: fetched.publisher || 'ABM Media & Literary Press',
        publicationYear: fetched.publicationYear || 2026,
        publicationDate: fetched.publishedDate,
        description: fetched.description || '',
        longSynopsis: fetched.longSynopsis || fetched.description || '',
        cover: fetched.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800',
        isbn: fetched.isbn13 || fetched.isbn10 || '',
        isbn10: fetched.isbn10,
        isbn13: fetched.isbn13,
        pages: fetched.pages || 160,
        language: fetched.language || 'English / Hindi',
        category: fetched.mainCategory || 'Literature',
        categories: fetched.categories || ['Literature'],
        genre: fetched.genre || 'Literature',
        googlePlayUrl: fetched.googlePlayUrl,
        playStoreUrl: fetched.playStoreUrl,
        googleBooksVolumeId: fetched.volumeId,
        previewEmbedUrl: fetched.previewEmbedUrl,
        webReaderLink: fetched.webReaderLink,
        buyLink: fetched.buyLink,
        sampleUrl: fetched.sampleUrl,
        price: fetched.price,
        rating: fetched.rating || 4.8,
        ratingsCount: fetched.ratingsCount || 50,
        featured: true,
        published: true,
        chaptersSummary: [
          'Chapter 1: Foundational Frameworks & Theoretical Architecture',
          'Chapter 2: Techniques, Creative Cadences & Formulas',
          'Chapter 3: Real-World Case Studies & Analytical Blueprints'
        ]
      };
      await addBook(newBook);
      setActiveEmbedBookId(newBook.id);
      showToast(`Added "${newBook.title}" to your published books!`, 'success');
    }
    hapticSuccess();
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
    showToast(`Successfully refreshed ${updatedCount} book(s) with live Google Play metadata!`, 'success');
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

  const handleShare = (book: BookItem) => {
    openShare({
      type: 'book',
      title: `${book.title} by Arjun Bharti Mina`,
      text: book.description,
      url: book.playStoreUrl || book.googlePlayUrl || window.location.href,
      imageUrl: book.cover
    });
  };

  return (
    <div id="books-view" className="space-y-10 max-w-6xl mx-auto pb-16 px-4 sm:px-6">
      
      {/* 1. HERO & HEADER */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={sectionReveal}
        className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-950 dark:text-white tracking-tight">
              Books
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Authored works, guidebooks, and blueprints by Arjun Bharti Mina with interactive reading mode and sample previews.
            </p>
          </div>

          {/* Owner-Only Management Actions */}
          {canManage && (
            <div className="flex flex-wrap items-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleSyncAllFromGoogleBooks}
                disabled={isSyncingAll}
                className="px-3.5 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                title="Sync live metadata from Google Play Books"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin text-amber-500' : ''}`} />
                <span>{isSyncingAll ? 'Syncing...' : 'Sync Catalog'}</span>
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
                <span>{showLiveInspector ? 'Close Link Tool' : 'Fetch from Google Play Link'}</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* 2. GOOGLE PLAY BOOKS LINK & DETAILS FETCHER DRAWER (OWNER ONLY) */}
      <AnimatePresence>
        {canManage && showLiveInspector && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.35, ease: CINEMATIC_EASE }}
            className="overflow-hidden"
          >
            <GooglePlayLinkFetcher 
              onSaveToCatalog={handleSaveFetchedToCatalog}
              showToast={showToast}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. FEATURED SPOTLIGHT & LIVE GOOGLE PLAY READER EMBED DECK */}
      <GooglePlayReaderDeck
        books={books}
        activeBookId={activeEmbedBookId}
        onSelectBook={(id) => setActiveEmbedBookId(id)}
        onInspectBook={(id) => setSelectedBookId(id)}
        onDownloadSample={handleDownloadSample}
        onShareBook={handleShare}
      />

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
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
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
              className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'showcase' ? (
          /* SHOWCASE EDITORIAL LIST */
          <div className="space-y-6">
            {filteredBooks.map((book) => (
              <BookEditorialCard
                key={book.id}
                book={book}
                onSelectForReader={(id) => {
                  setActiveEmbedBookId(id);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                onInspect={(id) => setSelectedBookId(id)}
                onDownloadSample={handleDownloadSample}
                onShare={handleShare}
              />
            ))}
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookGridCard
                key={book.id}
                book={book}
                onSelectForReader={(id) => {
                  setActiveEmbedBookId(id);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                onInspect={(id) => setSelectedBookId(id)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
