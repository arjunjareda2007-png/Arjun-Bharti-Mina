import React, { useState } from 'react';
import { BookItem } from '../../types';
import { 
  BookOpen, 
  ExternalLink, 
  Star, 
  Maximize2, 
  Minimize2, 
  AlertCircle, 
  Download, 
  Eye, 
  Share2, 
  Check, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  extractGoogleBooksId, 
  getGoogleBooksEmbedUrl, 
  getGooglePlayStoreUrl, 
  getGooglePlayReaderUrl,
  DEFAULT_FALLBACK_VOLUME_ID 
} from '../../utils/googleBooksUtils';
import { motion } from 'motion/react';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';

interface GooglePlayReaderDeckProps {
  books: BookItem[];
  activeBookId: string;
  onSelectBook: (bookId: string) => void;
  onInspectBook: (bookId: string) => void;
  onReadFullMode?: (bookId: string) => void;
  onDownloadSample: (book: BookItem) => void;
  onShareBook: (book: BookItem) => void;
}

export const GooglePlayReaderDeck: React.FC<GooglePlayReaderDeckProps> = ({
  books,
  activeBookId,
  onSelectBook,
  onInspectBook,
  onReadFullMode,
  onDownloadSample,
  onShareBook
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [embedError, setEmbedError] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const activeBook = books.find(b => b.id === activeBookId) || books[0];
  if (!activeBook) return null;

  const volumeId = activeBook.googleBooksVolumeId || 
    extractGoogleBooksId(activeBook.playStoreUrl || activeBook.googlePlayUrl) || 
    DEFAULT_FALLBACK_VOLUME_ID;

  const embedSrc = getGoogleBooksEmbedUrl(volumeId);
  const storeUrl = activeBook.playStoreUrl || activeBook.googlePlayUrl || getGooglePlayStoreUrl(volumeId);
  const readerUrl = activeBook.webReaderLink || getGooglePlayReaderUrl(volumeId);

  const handleCopyLink = () => {
    hapticLight();
    navigator.clipboard.writeText(storeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section 
      id="google-play-reader-deck"
      className="rounded-3xl bg-neutral-950 text-white border border-neutral-800/90 shadow-2xl overflow-hidden relative"
    >
      {/* Ambient Lighting Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-neutral-800/80 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/50 backdrop-blur-sm">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold shadow-inner shrink-0">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {activeBook.rating && (
                <span className="text-[10px] font-mono text-yellow-400 flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{activeBook.rating} ({activeBook.ratingsCount || 100}+ reviews)</span>
                </span>
              )}
              <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
                ID: {volumeId}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-display font-extrabold text-white mt-0.5">
              {activeBook.title}
            </h2>
            {activeBook.subtitle && (
              <p className="text-xs text-amber-300/80 font-medium line-clamp-1 mt-0.5">
                {activeBook.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Deck Primary Actions */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              hapticLight();
              setIsExpanded(!isExpanded);
            }}
            className="px-3.5 py-2 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700/60"
            title={isExpanded ? 'Collapse reader height' : 'Expand reader height'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isExpanded ? 'Compact View' : 'Expand Height'}</span>
          </button>

          <a
            href={storeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-blue-500/20 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a2.38 2.38 0 0 1-.61-.755L3 21.43V2.57l.001-.001c.14-.306.353-.574.608-.755zm1.536-1.537l9.36 5.405-2.713 2.713-6.647-8.118zm0 23.446l6.647-8.118 2.713 2.713-9.36 5.405zm14.887-10.74l-4.134 2.387-2.92-2.92 2.92-2.92 4.134 2.387c.808.467.808 1.599 0 2.066z"/>
            </svg>
            <span>Google Play Store</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Book Switcher Tabs */}
      <div className="px-5 sm:px-7 py-2.5 bg-neutral-900/95 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto relative z-10 scrollbar-none">
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider shrink-0 font-semibold mr-1">
          Select Book:
        </span>
        {books.map((b) => {
          const isSelected = b.id === activeBook.id;
          return (
            <button
              key={b.id}
              onClick={() => {
                hapticSelection();
                onSelectBook(b.id);
                setEmbedError(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-neutral-800/70 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-700/40'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span className="truncate max-w-[180px] sm:max-w-[240px]">{b.title}</span>
            </button>
          );
        })}
      </div>

      {/* Live Embedded Iframe Screen */}
      <div className="p-4 sm:p-7 space-y-5 relative z-10">
        <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-inner">
          <iframe
            id="google-play-books-embed-screen"
            key={volumeId}
            src={embedSrc}
            title={`Google Play Books Embed: ${activeBook.title}`}
            className={`w-full transition-all duration-300 border-0 ${
              isExpanded ? 'h-[620px] sm:h-[750px]' : 'h-[440px] sm:h-[520px]'
            }`}
            loading="lazy"
            onError={() => setEmbedError(true)}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          />

          {/* Browser Cookie Fallback View if iframe is restricted */}
          {embedError && (
            <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4 z-10 backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="text-base font-bold text-white">Full-Screen Google Play Web Reader</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your browser preferences or sandboxing may require opening the official Google Play Books interactive reader in a dedicated window.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={readerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Launch Google Play Web Reader</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setEmbedError(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Retry Embed
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Specs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 text-xs font-mono">
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase font-bold tracking-wider">Author</span>
            <span className="text-white font-bold truncate block">{activeBook.author || 'Arjun Bharti Mina'}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase font-bold tracking-wider">Pages & Language</span>
            <span className="text-white font-bold truncate block">{activeBook.pages} Pages • {activeBook.language || 'English / Hindi'}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase font-bold tracking-wider">Publisher</span>
            <span className="text-white font-bold truncate block">{activeBook.publisher || 'ABM Media Press'}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase font-bold tracking-wider">ISBN-13 Code</span>
            <span className="text-amber-400 font-bold truncate block">{activeBook.isbn || '978-93-88302-19-8'}</span>
          </div>
        </div>

        {/* Reader Deck Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2.5">
            {onReadFullMode && (
              <button
                type="button"
                onClick={() => {
                  hapticSelection();
                  onReadFullMode(activeBook.id);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read in Full Mode</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                hapticSelection();
                onInspectBook(activeBook.id);
              }}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors border border-neutral-700/60"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Synopsis & Chapters</span>
            </button>

            <button
              type="button"
              onClick={() => onDownloadSample(activeBook)}
              className="px-4 py-2.5 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors border border-neutral-700/60"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Sample Excerpt (.txt)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700/50"
              title="Copy Google Play Store Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              onClick={() => onShareBook(activeBook)}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700/50"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
