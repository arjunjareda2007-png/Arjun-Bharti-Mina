import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BookOpen, ExternalLink, Calendar, Layers, CheckCircle2, Bookmark } from 'lucide-react';

export const BooksView: React.FC = () => {
  const { books, openShare } = useStore();

  return (
    <div id="books-view" className="space-y-10 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
          Published Literature & E-Books
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Books
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Authored books, technical manuals, poetry collections, and creative guides published by Arjun Bharti Mina.
        </p>
      </div>

      {/* Books List */}
      <div className="space-y-8">
        {books.map((book) => (
          <div
            key={book.id}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Book Cover Artwork */}
            <div className="md:col-span-4 relative group flex justify-center">
              <div className="w-48 sm:w-56 rounded-2xl overflow-hidden shadow-2xl border border-neutral-300 dark:border-neutral-800 transform group-hover:-rotate-1 group-hover:scale-105 transition-transform duration-300 bg-neutral-950">
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>
            </div>

            {/* Book Details */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {book.category}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    Published: {book.publicationYear} • {book.pages} Pages
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                  {book.title}
                </h2>
                <p className="text-xs sm:text-sm font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                  {book.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {book.description}
              </p>

              {/* Chapter Highlights */}
              {book.chapters.length > 0 && (
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                    Featured Topics & Chapters
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                    {book.chapters.map((chap, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Bookmark className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span>{chap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Purchase / Read Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {book.googlePlayUrl && (
                  <a
                    href={book.googlePlayUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity"
                  >
                    <span>Read on Google Play Books</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  onClick={() => openShare({
                    title: `${book.title} by Arjun Bharti Mina`,
                    text: book.description,
                    url: book.googlePlayUrl || window.location.href
                  })}
                  className="px-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Share Book
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
