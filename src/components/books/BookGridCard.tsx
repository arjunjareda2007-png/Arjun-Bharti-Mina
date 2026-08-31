import React from 'react';
import { BookItem } from '../../types';
import { 
  BookOpen, 
  Eye, 
  ExternalLink, 
  Star 
} from 'lucide-react';
import { motion } from 'motion/react';
import { CINEMATIC_EASE } from '../../utils/motion';
import { hapticSelection, hapticLight } from '../../utils/haptics';

interface BookGridCardProps {
  book: BookItem;
  onSelectForReader: (bookId: string) => void;
  onInspect: (bookId: string) => void;
}

export const BookGridCard: React.FC<BookGridCardProps> = ({
  book,
  onSelectForReader,
  onInspect
}) => {
  const storeUrl = book.playStoreUrl || book.googlePlayUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: CINEMATIC_EASE }}
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
    >
      <div className="space-y-3">
        {/* Cover with 3D feel */}
        <div 
          onClick={() => {
            hapticSelection();
            onInspect(book.id);
          }}
          className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-950 cursor-pointer group-hover:scale-[1.02] transition-transform duration-300"
        >
          <img 
            src={book.cover} 
            alt={book.title} 
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-neutral-950 text-xs font-bold flex items-center gap-1 shadow-md">
              <Eye className="w-3 h-3" />
              <span>Inspect Details</span>
            </span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-amber-500 font-bold uppercase">{book.category || 'Literature'}</span>
            {book.rating && (
              <span className="text-yellow-500 flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-current" />
                <span>{book.rating}</span>
              </span>
            )}
          </div>
          <h3 
            onClick={() => {
              hapticSelection();
              onInspect(book.id);
            }}
            className="text-base font-bold text-neutral-900 dark:text-white line-clamp-1 hover:text-amber-500 transition-colors cursor-pointer"
          >
            {book.title}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
            {book.description}
          </p>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            hapticLight();
            onSelectForReader(book.id);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <BookOpen className="w-3 h-3" />
          <span>Stream Reader</span>
        </button>

        <div className="flex items-center gap-1.5">
          {storeUrl && (
            <a
              href={storeUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors"
              title="Google Play Store"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => onInspect(book.id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Inspect Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
