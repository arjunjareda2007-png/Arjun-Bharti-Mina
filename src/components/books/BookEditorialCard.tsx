import React from 'react';
import { BookItem } from '../../types';
import { 
  BookOpen, 
  Eye, 
  ExternalLink, 
  Download, 
  Share2, 
  Star, 
  Bookmark, 
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { CINEMATIC_EASE } from '../../utils/motion';
import { hapticSelection, hapticLight } from '../../utils/haptics';

interface BookEditorialCardProps {
  book: BookItem;
  onSelectForReader: (bookId: string) => void;
  onInspect: (bookId: string) => void;
  onDownloadSample: (book: BookItem) => void;
  onShare: (book: BookItem) => void;
}

export const BookEditorialCard: React.FC<BookEditorialCardProps> = ({
  book,
  onSelectForReader,
  onInspect,
  onDownloadSample,
  onShare
}) => {
  const chaptersList = book.chaptersSummary && book.chaptersSummary.length > 0
    ? book.chaptersSummary
    : book.chapters || [];

  const storeUrl = book.playStoreUrl || book.googlePlayUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: CINEMATIC_EASE }}
      className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-7 sm:gap-8 items-start group relative overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Left: 3D-Style Cover with Sheen & Inspect overlay */}
      <div className="md:col-span-4 flex flex-col items-center">
        <div 
          onClick={() => {
            hapticSelection();
            onInspect(book.id);
          }}
          className="w-44 sm:w-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-200 dark:border-neutral-800 transform group-hover:scale-103 group-hover:-translate-y-1 transition-all duration-300 bg-neutral-950 cursor-pointer relative"
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
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Details</span>
            </span>
          </div>
        </div>

        {/* Cover specs badge */}
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

      {/* Right: Book Details, Chapters & Actions */}
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
              onInspect(book.id);
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

        {/* Synopsis */}
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
          {book.description || book.longSynopsis}
        </p>

        {/* Chapter Excerpts */}
        {chaptersList.length > 0 && (
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold block">
                Chapter Highlights & Outline
              </span>
              <button
                type="button"
                onClick={() => {
                  hapticSelection();
                  onInspect(book.id);
                }}
                className="text-[11px] font-mono text-amber-500 hover:underline font-semibold cursor-pointer flex items-center gap-1"
              >
                <span>View all {chaptersList.length} chapters</span>
                <ChevronRight className="w-3 h-3" />
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

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              hapticLight();
              onSelectForReader(book.id);
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
              onInspect(book.id);
            }}
            className="px-4 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold text-xs flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>Overview & Specs</span>
          </button>

          {storeUrl && (
            <a
              href={storeUrl}
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
            onClick={() => onDownloadSample(book)}
            className="p-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Download sample preview (.txt)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onShare(book)}
            className="p-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Share book"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
