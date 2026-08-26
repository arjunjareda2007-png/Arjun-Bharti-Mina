import React, { useState } from 'react';
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
  Download
} from 'lucide-react';

export const BooksView: React.FC = () => {
  const { books, openShare, setSelectedBookId } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Music & Lyricism', 'Engineering & Tech', 'Creative Writing'];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.subtitle && book.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'All' || 
      (selectedCategory === 'Music & Lyricism' && (book.category?.toLowerCase().includes('music') || book.title.toLowerCase().includes('lyric'))) ||
      (selectedCategory === 'Engineering & Tech' && (book.category?.toLowerCase().includes('engineering') || book.title.toLowerCase().includes('civil') || book.title.toLowerCase().includes('mechanics'))) ||
      (selectedCategory === 'Creative Writing' && (book.category?.toLowerCase().includes('creative') || book.category?.toLowerCase().includes('writing')));

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="books-view" className="space-y-10 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-mono font-bold uppercase tracking-wider">
            Literature & Publications
          </span>
          <span className="text-xs font-mono text-neutral-500">
            {books.length} Published Works
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Authored Books & Guides
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Published literature, technical engineering primers, poetic breakdowns, and creative songwriting guides authored by Arjun Bharti Mina.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search books, chapters, topics..."
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
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
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
                        <span>Preview Book</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <span className="text-[11px] font-mono text-neutral-400">
                      {book.pages} Pages • {book.language || 'English'}
                    </span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {book.category || 'Literature'}
                      </span>
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
                          onClick={() => setSelectedBookId(book.id)}
                          className="text-[11px] font-mono text-amber-500 hover:underline font-semibold"
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
                      onClick={() => setSelectedBookId(book.id)}
                      className="px-5 py-2.5 rounded-full bg-neutral-950 text-white dark:bg-amber-500 dark:text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Preview Chapters & Read</span>
                    </button>

                    {(book.playStoreUrl || book.googlePlayUrl) && (
                      <a
                        href={book.playStoreUrl || book.googlePlayUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
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
                      onClick={() => openShare({
                        type: 'book',
                        title: `${book.title} by Arjun Bharti Mina`,
                        text: book.description,
                        url: book.playStoreUrl || book.googlePlayUrl || window.location.href,
                        imageUrl: book.cover
                      })}
                      className="p-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
