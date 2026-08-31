import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  RefreshCw, 
  Link as LinkIcon, 
  AlertCircle, 
  Star, 
  PlusCircle, 
  ExternalLink, 
  BookOpen, 
  Check, 
  Copy,
  BookMarked
} from 'lucide-react';
import { 
  fetchGoogleBookDetails, 
  GoogleBookParsedData 
} from '../../utils/googleBooksUtils';
import { motion, AnimatePresence } from 'motion/react';
import { hapticLight, hapticSuccess } from '../../utils/haptics';

interface GooglePlayLinkFetcherProps {
  onSaveToCatalog: (bookData: GoogleBookParsedData) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const GooglePlayLinkFetcher: React.FC<GooglePlayLinkFetcherProps> = ({
  onSaveToCatalog,
  showToast
}) => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedBook, setFetchedBook] = useState<GoogleBookParsedData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleFetch = async (queryToUse?: string) => {
    const query = (queryToUse || inputUrl).trim();
    if (!query) {
      setError('Please provide a Google Play Books link, Volume ID, or ISBN.');
      return;
    }

    hapticLight();
    setLoading(true);
    setError(null);
    setFetchedBook(null);

    const res = await fetchGoogleBookDetails(query);
    setLoading(false);

    if (res.success && res.data) {
      hapticSuccess();
      setFetchedBook(res.data);
      showToast(`Found "${res.data.title}" on Google Play Books!`, 'success');
    } else {
      setError(res.error || 'Could not find book on Google Play Books. Please verify the URL or ID.');
      showToast('Google Play Books lookup failed', 'error');
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`Copied ${label} to clipboard`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-neutral-50 dark:bg-neutral-900/90 border-2 border-amber-500/30 shadow-xl space-y-5">
      {/* Top Title Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-neutral-950 dark:text-white">
              Google Play Books Live Link Inspector
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Enter any Google Play Books link, ISBN (e.g. 9789388302198), or Volume ID to query Google Play metadata.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full w-fit">
          Google Books API v1
        </span>
      </div>

      {/* Input Search Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleFetch();
        }} 
        className="flex flex-col sm:flex-row gap-2.5"
      >
        <div className="relative flex-1">
          <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Paste link: https://play.google.com/store/books/details?id=M71vDwAAQBAJ or ISBN: 9789388302198"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors shadow-xs"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !inputUrl.trim()}
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md cursor-pointer shrink-0"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Fetch Metadata</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Sample Links */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        <span className="font-semibold">Test Sample Links:</span>
        <button
          type="button"
          onClick={() => {
            const val = 'https://play.google.com/store/books/details?id=M71vDwAAQBAJ';
            setInputUrl(val);
            handleFetch(val);
          }}
          className="px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 transition-colors cursor-pointer text-xs"
        >
          The Lyricist's Blueprint (ID: M71vDwAAQBAJ)
        </button>
        <button
          type="button"
          onClick={() => {
            const val = 'https://play.google.com/store/books/details?id=3u7eDwAAQBAJ';
            setInputUrl(val);
            handleFetch(val);
          }}
          className="px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 transition-colors cursor-pointer text-xs"
        >
          Civil Mechanics Primer (ID: 3u7eDwAAQBAJ)
        </button>
        <button
          type="button"
          onClick={() => {
            const val = '9789388302198';
            setInputUrl(val);
            handleFetch(val);
          }}
          className="px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 transition-colors cursor-pointer text-xs font-mono"
        >
          ISBN: 9789388302198
        </button>
      </div>

      {/* Error View */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Fetched Book Preview Result Card */}
      {fetchedBook && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-28 sm:w-32 rounded-xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-700 shrink-0 bg-neutral-950">
              <img
                src={fetchedBook.coverImage || fetchedBook.thumbnail}
                alt={fetchedBook.title}
                referrerPolicy="no-referrer"
                className="w-full aspect-[2/3] object-cover"
              />
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold uppercase">
                  {fetchedBook.mainCategory || 'Literature'}
                </span>
                {fetchedBook.averageRating && (
                  <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold flex items-center gap-1 font-mono">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{fetchedBook.averageRating} ({fetchedBook.ratingsCount || 0} reviews)</span>
                  </span>
                )}
                {fetchedBook.price && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                    {fetchedBook.price}
                  </span>
                )}
                <span className="text-[11px] font-mono text-neutral-400 ml-auto">
                  Volume ID: {fetchedBook.volumeId}
                </span>
              </div>

              <h4 className="text-lg font-bold text-neutral-950 dark:text-white">
                {fetchedBook.title}
              </h4>
              {fetchedBook.subtitle && (
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  {fetchedBook.subtitle}
                </p>
              )}

              <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                {fetchedBook.description}
              </p>

              {/* Specs Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl">
                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold">Author</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200 truncate block">
                    {fetchedBook.authors?.join(', ') || 'Arjun Bharti Mina'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold">Publisher</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200 truncate block">
                    {fetchedBook.publisher || 'ABM Press'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold">Pages & Year</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200 block">
                    {fetchedBook.pageCount} Pages • {fetchedBook.publicationYear}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold">ISBN</span>
                  <span className="font-semibold text-amber-500 font-mono block truncate">
                    {fetchedBook.isbn13 || fetchedBook.isbn10 || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onSaveToCatalog(fetchedBook)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Save to Catalog & Stream</span>
              </button>

              {fetchedBook.googlePlayUrl && (
                <a
                  href={fetchedBook.googlePlayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Play Books Store</span>
                </a>
              )}

              {fetchedBook.webReaderLink && (
                <a
                  href={fetchedBook.webReaderLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Google Web Reader</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(fetchedBook.isbn13 || fetchedBook.volumeId, 'ISBN/ID')}
                className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedKey === 'ISBN/ID' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'ISBN/ID' ? 'Copied' : 'Copy Volume ID'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
