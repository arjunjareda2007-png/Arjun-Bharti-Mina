import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Share2, 
  ExternalLink, 
  BookOpen, 
  Bookmark, 
  Calendar, 
  Layers, 
  FileText, 
  Download, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  BookMarked
} from 'lucide-react';

export const BookDetailModal: React.FC = () => {
  const { books, selectedBookId, setSelectedBookId, openShare, showToast } = useStore();
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [readingMode, setReadingMode] = useState<boolean>(false);

  const book = books.find((b) => b.id === selectedBookId);

  useEffect(() => {
    setActiveChapterIndex(0);
    setReadingMode(false);
  }, [selectedBookId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBookId(null);
      }
    };
    if (selectedBookId) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBookId, setSelectedBookId]);

  if (!book) return null;

  const chapters = book.chaptersSummary && book.chaptersSummary.length > 0 
    ? book.chaptersSummary 
    : book.chapters && book.chapters.length > 0 
    ? book.chapters 
    : [
        'Chapter 1: Foundations & Core Principles',
        'Chapter 2: Techniques, Cadences & Formulas',
        'Chapter 3: Real-World Case Studies & Creative Workflows',
        'Chapter 4: Advanced Architectures & Cultural Perspectives',
        'Chapter 5: Summary, Key Takeaways & Action Blueprint'
      ];

  const handleShare = () => {
    openShare({
      type: 'book',
      title: `${book.title} — Authored by ${book.author || 'Arjun Bharti Mina'}`,
      text: book.description || book.longSynopsis || 'Read published books by Arjun Bharti Mina.',
      url: book.playStoreUrl || book.googlePlayUrl || book.amazonUrl || window.location.href,
      imageUrl: book.cover
    });
  };

  const handleDownloadSample = () => {
    showToast(`Downloading free sample preview for "${book.title}"...`, 'info');
    // Simulated instant preview download or redirect
    const dummyText = `BOOK PREVIEW: ${book.title}\nAuthor: ${book.author || 'Arjun Bharti Mina'}\nYear: ${book.publicationYear}\n\nSYNOPSIS:\n${book.longSynopsis || book.description}\n\nCHAPTERS:\n${chapters.join('\n')}\n\nPublished by ABM Media Press (2026).`;
    const blob = new Blob([dummyText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_preview.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Book sample downloaded successfully!', 'success');
  };

  return (
    <div 
      id="book-detail-backdrop"
      className="fixed inset-0 z-[6000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={() => setSelectedBookId(null)}
    >
      <div 
        id="book-detail-modal-card"
        className="w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold block">
                {book.category || 'Published Literature'} • {book.publicationYear}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-sm sm:max-w-md">
                {book.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
              title="Share Book"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedBookId(null)}
              className="p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 text-neutral-400 transition-colors"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Main Book Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Cover Stage */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-48 sm:w-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/20 bg-neutral-950 group relative">
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop';
                  }}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-40" />
              </div>

              {/* Quick stats under cover */}
              <div className="mt-4 w-full text-center space-y-1">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                  By {book.author || 'Arjun Bharti Mina'}
                </p>
                <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  <span>📄 {book.pages} Pages</span>
                  <span>🌐 {book.language || 'English / Hindi'}</span>
                </div>
              </div>
            </div>

            {/* Right Book Details */}
            <div className="md:col-span-8 space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {book.category || 'Educational / Non-Fiction'}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    Year: {book.publicationYear}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-neutral-950 dark:text-white leading-tight">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mt-1">
                    {book.subtitle}
                  </p>
                )}
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-bold">
                  Book Synopsis & Overview
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {book.longSynopsis || book.description}
                </p>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {(book.playStoreUrl || book.googlePlayUrl) && (
                  <a
                    href={book.playStoreUrl || book.googlePlayUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-neutral-950 text-white dark:bg-amber-500 dark:text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
                  >
                    <span>Read on Google Play</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {book.amazonUrl && (
                  <a
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                  >
                    <span>View on Amazon</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  onClick={handleDownloadSample}
                  className="px-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  <span>Free Sample Preview</span>
                </button>
              </div>

            </div>

          </div>

          {/* Table of Contents & Chapter Excerpts */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>Table of Contents & Topics</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Select a chapter below to preview outline highlights
                </p>
              </div>

              <span className="text-xs font-mono text-amber-500 font-semibold">
                {chapters.length} Chapters
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Chapters List */}
              <div className="md:col-span-5 space-y-2">
                {chapters.map((chap, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`w-full text-left p-3 rounded-2xl text-xs font-medium transition-all flex items-center justify-between ${
                      activeChapterIndex === idx
                        ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold shadow-sm'
                        : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border border-neutral-200/70 dark:border-neutral-800/70 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span className="truncate pr-2">{chap}</span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                  </button>
                ))}
              </div>

              {/* Active Chapter Details / Excerpt Box */}
              <div className="md:col-span-7 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-amber-500">
                    Chapter {activeChapterIndex + 1} Spotlight
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    ABM Literature Archive
                  </span>
                </div>

                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {chapters[activeChapterIndex]}
                </h4>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {activeChapterIndex === 0 && (
                    'Establishes the philosophical and mechanical fundamentals. Investigates the importance of cadence, structural rhythm, and finding authentic voice before committing lines to paper.'
                  )}
                  {activeChapterIndex === 1 && (
                    'Dives deep into rhyming mechanics, multisyllabic sound patterns in Hindi, Urdu, and regional dialects, paired with computational meter counter methodologies.'
                  )}
                  {activeChapterIndex === 2 && (
                    'Focuses on real-world storytelling techniques, drawing inspiration from daily life, campus hustles, engineering calculations, and urban youth ambition.'
                  )}
                  {activeChapterIndex === 3 && (
                    'Explores technical harmony: how bass frequencies, kick positioning, and bar structures correlate with civil structural load distributions and modern architectural symmetry.'
                  )}
                  {activeChapterIndex >= 4 && (
                    'Provides an actionable step-by-step roadmap for self-publishing, independent distribution, mastering digital media, and building a loyal audience.'
                  )}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={handleDownloadSample}
                    className="px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Chapter Excerpt</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
