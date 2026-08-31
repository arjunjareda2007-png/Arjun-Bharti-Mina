import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  BookOpen, 
  Bookmark, 
  ExternalLink, 
  Download, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun, 
  BookMarked,
  Share2,
  Type,
  List,
  AlertCircle,
  Sparkles,
  Check
} from 'lucide-react';
import { 
  extractGoogleBooksId, 
  getGoogleBooksEmbedUrl, 
  getGooglePlayStoreUrl, 
  getGooglePlayReaderUrl,
  DEFAULT_FALLBACK_VOLUME_ID 
} from '../../utils/googleBooksUtils';
import { downloadBookPreviewPdf } from '../../utils/bookPdfGenerator';
import { motion, AnimatePresence } from 'motion/react';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';

export const BookFullReadModeModal: React.FC = () => {
  const { books, activeReadingBookId, closeBookReader, openShare, showToast } = useStore();

  const [readingMode, setReadingMode] = useState<'embed' | 'reader'>('embed');
  const [readingTheme, setReadingTheme] = useState<'dark' | 'sepia' | 'light' | 'oled'>('dark');
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [embedError, setEmbedError] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const book = books.find(b => b.id === activeReadingBookId);

  useEffect(() => {
    if (activeReadingBookId) {
      setActiveChapterIndex(0);
      setEmbedError(false);
      // Default to embed on desktop, and check responsive
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeReadingBookId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeReadingBookId) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          closeBookReader();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReadingBookId, closeBookReader]);

  if (!book) return null;

  const volumeId = book.googleBooksVolumeId || 
    extractGoogleBooksId(book.playStoreUrl || book.googlePlayUrl) || 
    DEFAULT_FALLBACK_VOLUME_ID;

  const embedSrc = getGoogleBooksEmbedUrl(volumeId);
  const storeUrl = book.playStoreUrl || book.googlePlayUrl || getGooglePlayStoreUrl(volumeId);
  const readerUrl = book.webReaderLink || getGooglePlayReaderUrl(volumeId);

  const chapters = book.chaptersSummary && book.chaptersSummary.length > 0
    ? book.chaptersSummary
    : book.chapters && book.chapters.length > 0
    ? book.chapters
    : [
        'Chapter 1: Foundational Frameworks & Theoretical Architecture',
        'Chapter 2: Techniques, Creative Cadences & Formulas',
        'Chapter 3: Real-World Case Studies & Analytical Blueprints',
        'Chapter 4: Advanced Architectures & Cultural Perspectives',
        'Chapter 5: Summary, Key Takeaways & Action Blueprint'
      ];

  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  const toggleFullscreen = () => {
    hapticLight();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleDownloadSample = async () => {
    hapticLight();
    setIsDownloadingPdf(true);
    try {
      await downloadBookPreviewPdf(book, (msg, type) => showToast(msg, type));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleShare = () => {
    hapticLight();
    openShare({
      type: 'book',
      title: `${book.title} by Arjun Bharti Mina`,
      text: book.description || 'Read published books by Arjun Bharti Mina on Google Play Books.',
      url: storeUrl,
      imageUrl: book.cover
    });
  };

  // Theme Styling Map
  const themeClasses = {
    dark: 'bg-neutral-900 text-neutral-100 border-neutral-800',
    oled: 'bg-black text-neutral-100 border-neutral-800',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e8d7ba]',
    light: 'bg-neutral-50 text-neutral-900 border-neutral-200'
  };

  const paperBgClasses = {
    dark: 'bg-neutral-950 text-neutral-200 border-neutral-800/80',
    oled: 'bg-black text-neutral-200 border-neutral-900',
    sepia: 'bg-[#f4e4c1] text-[#362716] border-[#d8c39e]',
    light: 'bg-white text-neutral-800 border-neutral-200'
  };

  const headerBgClasses = {
    dark: 'bg-neutral-950/90 border-neutral-800 text-white',
    oled: 'bg-black/95 border-neutral-850 text-white',
    sepia: 'bg-[#f0dfba]/90 border-[#dcc59c] text-[#3d2c19]',
    light: 'bg-white/95 border-neutral-200 text-neutral-900'
  };

  return (
    <div 
      id="book-full-read-mode-modal"
      className={`fixed inset-0 z-[7000] flex flex-col ${themeClasses[readingTheme]} transition-colors duration-300 select-none`}
    >
      {/* 1. TOP HEADER TOOLBAR */}
      <header className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 ${headerBgClasses[readingTheme]} backdrop-blur-md shrink-0 z-30 shadow-xs`}>
        {/* Left: Book Meta & TOC Toggle */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              hapticLight();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isSidebarOpen 
                ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold' 
                : 'hover:bg-neutral-800/20 border-current/20'
            }`}
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Contents ({chapters.length})</span>
          </button>

          <div className="flex items-center gap-2.5 truncate">
            <img 
              src={book.cover} 
              alt={book.title}
              referrerPolicy="no-referrer"
              className="w-7 h-10 object-cover rounded-md shadow-xs shrink-0 hidden sm:block border border-current/20"
            />
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold truncate leading-tight">
                {book.title}
              </h2>
              <p className="text-[11px] opacity-75 truncate hidden sm:block">
                By {book.author || 'Arjun Bharti Mina'} • {book.pages} Pages • {book.category || 'Literature'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Mode Switcher (Google Play Embed vs Clean Reader) */}
        <div className="flex items-center bg-black/10 dark:bg-white/10 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => {
              hapticSelection();
              setReadingMode('embed');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              readingMode === 'embed'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Interactive Stream</span>
          </button>

          <button
            type="button"
            onClick={() => {
              hapticSelection();
              setReadingMode('reader');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              readingMode === 'reader'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Manuscript View</span>
          </button>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Reader Preferences (Theme & Font) - shown in Manuscript mode or dropdown */}
          {readingMode === 'reader' && (
            <div className="hidden lg:flex items-center gap-1.5 pr-2 border-r border-current/20">
              {/* Font Type Toggle */}
              <button
                type="button"
                onClick={() => setFontFamily(fontFamily === 'serif' ? 'sans' : 'serif')}
                className="px-2 py-1 rounded-lg text-[11px] font-mono border border-current/20 hover:bg-current/10 cursor-pointer"
                title="Toggle Serif / Sans Font"
              >
                {fontFamily === 'serif' ? 'Serif' : 'Sans'}
              </button>

              {/* Font Size Adjusters */}
              <button
                type="button"
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-current/10 cursor-pointer"
                title="Decrease Font Size"
              >
                A-
              </button>
              <span className="text-[11px] font-mono opacity-70 w-6 text-center">{fontSize}</span>
              <button
                type="button"
                onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-current/10 cursor-pointer"
                title="Increase Font Size"
              >
                A+
              </button>

              {/* Theme Selector Buttons */}
              <div className="flex items-center gap-1 ml-1">
                <button
                  type="button"
                  onClick={() => setReadingTheme('dark')}
                  className={`w-6 h-6 rounded-full bg-neutral-900 border ${readingTheme === 'dark' ? 'ring-2 ring-amber-500' : 'border-neutral-700'}`}
                  title="Dark Charcoal Theme"
                />
                <button
                  type="button"
                  onClick={() => setReadingTheme('sepia')}
                  className={`w-6 h-6 rounded-full bg-[#fbf0d9] border ${readingTheme === 'sepia' ? 'ring-2 ring-amber-500' : 'border-[#d8c39e]'}`}
                  title="Warm Sepia Theme"
                />
                <button
                  type="button"
                  onClick={() => setReadingTheme('light')}
                  className={`w-6 h-6 rounded-full bg-white border ${readingTheme === 'light' ? 'ring-2 ring-amber-500' : 'border-neutral-300'}`}
                  title="Light Paper Theme"
                />
                <button
                  type="button"
                  onClick={() => setReadingTheme('oled')}
                  className={`w-6 h-6 rounded-full bg-black border ${readingTheme === 'oled' ? 'ring-2 ring-amber-500' : 'border-neutral-800'}`}
                  title="OLED Pure Black Theme"
                />
              </div>
            </div>
          )}

          {/* Direct Google Play Store Link */}
          {storeUrl && (
            <a
              href={storeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors hidden sm:flex cursor-pointer"
              title="Open Book on Google Play Store"
            >
              <span>Play Store</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Download sample PDF */}
          <button
            type="button"
            onClick={handleDownloadSample}
            disabled={isDownloadingPdf}
            className="p-2 rounded-xl hover:bg-current/10 transition-colors cursor-pointer disabled:opacity-50"
            title="Download Book Preview (PDF)"
          >
            <Download className={`w-4 h-4 ${isDownloadingPdf ? 'animate-bounce text-amber-500' : ''}`} />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl hover:bg-current/10 transition-colors cursor-pointer"
            title="Share Book"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl hover:bg-current/10 transition-colors cursor-pointer hidden sm:block"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Read Mode */}
          <button
            type="button"
            onClick={() => {
              hapticLight();
              closeBookReader();
            }}
            className="p-2 rounded-xl hover:bg-red-500/20 hover:text-red-500 text-neutral-400 transition-colors cursor-pointer ml-1"
            title="Exit Read Mode (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN READING CANVAS AREA */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Table of Contents Drawer / Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`w-72 sm:w-80 border-r ${headerBgClasses[readingTheme]} flex flex-col shrink-0 z-20 overflow-hidden shadow-2xl`}
            >
              <div className="p-4 border-b border-current/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                    Table of Contents
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-current/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Book Info Summary in Drawer */}
              <div className="p-4 border-b border-current/10 flex items-center gap-3">
                <img 
                  src={book.cover} 
                  alt={book.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-16 object-cover rounded-lg shadow-sm border border-current/20 shrink-0"
                />
                <div className="min-w-0 space-y-1 text-xs">
                  <p className="font-bold truncate">{book.title}</p>
                  <p className="opacity-75 text-[11px]">ISBN: {book.isbn || '978-93-88302-19-8'}</p>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold">
                    {book.pages} Pages
                  </span>
                </div>
              </div>

              {/* Chapters List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5 select-text">
                {chapters.map((chap, idx) => {
                  const isCurrent = activeChapterIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        hapticSelection();
                        setActiveChapterIndex(idx);
                        if (readingMode !== 'reader') {
                          setReadingMode('reader');
                        }
                      }}
                      className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                          : 'hover:bg-current/10 opacity-85'
                      }`}
                    >
                      <span className="line-clamp-2 leading-relaxed">{chap}</span>
                      <span className="font-mono text-[10px] opacity-75 shrink-0">
                        Ch. {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-3 border-t border-current/15 space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="w-full py-2 px-3 rounded-xl bg-current/10 hover:bg-current/20 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample Excerpt</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Reader Display: MODE 1 (Google Play Iframe Embed) */}
        {readingMode === 'embed' && (
          <div className="flex-1 h-full w-full relative bg-neutral-950 flex flex-col">
            <iframe
              id="full-mode-google-play-books-iframe"
              key={volumeId}
              src={embedSrc}
              title={`Google Play Books Embed: ${book.title}`}
              className="w-full h-full border-0 flex-1 bg-neutral-950"
              loading="lazy"
              onError={() => setEmbedError(true)}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            />

            {/* Fallback Screen if Iframe is restricted */}
            {embedError && (
              <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4 z-10 backdrop-blur-md text-white">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-lg font-bold">Interactive Google Play Web Reader</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Browser sandboxing is active. You can switch to our high-resolution <strong>Manuscript View</strong> or launch Google Play's dedicated interactive reader window.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      hapticSelection();
                      setReadingMode('reader');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Type className="w-4 h-4" />
                    <span>Switch to Manuscript View</span>
                  </button>
                  <a
                    href={readerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <span>Open Web Reader</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reader Display: MODE 2 (Distraction-Free Manuscript Reader) */}
        {readingMode === 'reader' && (
          <div className="flex-1 h-full overflow-y-auto p-4 sm:p-8 lg:p-12 flex justify-center select-text">
            <article 
              className={`w-full max-w-3xl rounded-3xl p-6 sm:p-12 border shadow-lg space-y-8 ${paperBgClasses[readingTheme]} transition-all duration-300`}
              style={{
                fontFamily: fontFamily === 'serif' ? '"Lora", "Georgia", "Merriweather", serif' : 'system-ui, -apple-system, sans-serif'
              }}
            >
              {/* Chapter Header */}
              <div className="border-b border-current/15 pb-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono opacity-75">
                  <span>CHAPTER {activeChapterIndex + 1} OF {chapters.length}</span>
                  <span>{book.publicationYear} • ARJUN BHARTI MINA</span>
                </div>
                <h1 
                  className="font-extrabold leading-tight font-display tracking-tight"
                  style={{ fontSize: `${fontSize * 1.5}px` }}
                >
                  {chapters[activeChapterIndex]}
                </h1>
                {book.subtitle && (
                  <p className="text-sm opacity-80 italic">
                    {book.subtitle}
                  </p>
                )}
              </div>

              {/* Reading Content Body */}
              <div 
                className="space-y-6 leading-relaxed"
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
              >
                {activeChapterIndex === 0 && (
                  <>
                    <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                      Literature and creative thought are built on foundational cadences. When words are assembled with mathematical symmetry, emotional sincerity, and structural load balance, they resonate across disciplines—from structural civil calculations to poignant musical bars.
                    </p>
                    <p>
                      In this opening chapter, we investigate the philosophy of genuine creative expression. True art does not imitate fleeting trends; it builds an enduring sanctuary for thought, observation, and rhythm.
                    </p>
                    <div className="p-5 rounded-2xl bg-current/5 border border-current/10 italic text-sm my-4">
                      "Every line written is a beam placed in the architecture of the mind. Build it with integrity, calculate its weight, and let the truth stand uncompromised."
                    </div>
                    <p>
                      Whether analyzing civil mechanics or rhyming schemes across Hindi, Urdu, and English, the underlying discipline remains constant: relentless precision paired with untamed soul.
                    </p>
                  </>
                )}

                {activeChapterIndex === 1 && (
                  <>
                    <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                      Cadence is the heartbeat of language. This chapter deconstructs the multi-syllabic rhyming structures, internal assonances, and rhythmic displacements that empower timeless spoken-word and literature.
                    </p>
                    <p>
                      We explore how acoustic stress patterns correspond with human memory retention. By balancing phonetic symmetry with unexpected thematic pivots, the writer commands attention and instills lasting resonance.
                    </p>
                    <p>
                      Case studies in this chapter illustrate how traditional Rajasthani folk cadences harmonize seamlessly with modern boom-bap, trap, and contemporary metric poetry.
                    </p>
                  </>
                )}

                {activeChapterIndex === 2 && (
                  <>
                    <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                      Real-world blueprints require grounding in lived experience. From university halls to late-night studio sessions and infrastructure project sites across Rajasthan, every chapter of life provides raw data for literary synthesis.
                    </p>
                    <p>
                      Here, we examine narrative frameworks that translate raw hustle, structural engineering precision, and creative ambition into compelling written stories that inspire and instruct.
                    </p>
                  </>
                )}

                {activeChapterIndex === 3 && (
                  <>
                    <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                      Structure and symmetry govern both physical edifices and literary works. In this chapter, we discover the structural mechanics linking reinforced concrete engineering with multisyllabic stanza structures.
                    </p>
                    <p>
                      Load paths, stress distributions, harmonic frequencies, and cultural heritage form a unified tapestry of creative innovation.
                    </p>
                  </>
                )}

                {activeChapterIndex >= 4 && (
                  <>
                    <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                      The concluding roadmap provides actionable strategies for independent publishing, digital distribution on Google Play Books, preserving author rights, and cultivating an authentic community of readers.
                    </p>
                    <p>
                      Every author must possess both artistic mastery and tactical clarity to navigate the modern digital ecosystem with independence and authority.
                    </p>
                  </>
                )}
              </div>

              {/* Chapter Footer Navigation */}
              <div className="border-t border-current/15 pt-8 flex items-center justify-between gap-4">
                <button
                  type="button"
                  disabled={activeChapterIndex === 0}
                  onClick={() => {
                    hapticSelection();
                    setActiveChapterIndex(prev => Math.max(0, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 rounded-xl border border-current/20 hover:bg-current/10 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Chapter</span>
                </button>

                <span className="text-xs font-mono opacity-70">
                  {activeChapterIndex + 1} / {chapters.length}
                </span>

                <button
                  type="button"
                  disabled={activeChapterIndex === chapters.length - 1}
                  onClick={() => {
                    hapticSelection();
                    setActiveChapterIndex(prev => Math.min(chapters.length - 1, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-neutral-950 hover:bg-amber-400 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed shadow-md"
                >
                  <span>Next Chapter</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Purchase and Sample Box */}
              <div className="p-6 rounded-2xl bg-current/5 border border-current/15 space-y-3 text-center">
                <h4 className="text-sm font-bold">Enjoying this reading preview?</h4>
                <p className="text-xs opacity-75 max-w-md mx-auto">
                  Access the complete, uncut volume with full diagrams, high-resolution pages, and EPUB/PDF digital formats on Google Play Books.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  {storeUrl && (
                    <a
                      href={storeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                    >
                      <span>Get Full Book on Google Play</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="px-4 py-2.5 rounded-full border border-current/20 hover:bg-current/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-500" />
                    <span>Download Text Preview</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        )}

      </div>
    </div>
  );
};
