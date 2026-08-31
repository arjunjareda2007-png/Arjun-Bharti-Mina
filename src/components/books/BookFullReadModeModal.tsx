import React, { useState, useEffect, useRef } from 'react';
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
  Share2,
  Type,
  List,
  AlertCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Eye,
  Search,
  BookMarked
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

  const book = books.find(b => b.id === activeReadingBookId);

  // Mode Selection: 'manuscript' (fastest & cleanest), 'cloud_embed' (Google Play/Drive/PDF Embed)
  const isPdfOrDrive = Boolean(book?.pdfUrl || book?.driveUrl || (book?.sourceType === 'pdf' || book?.sourceType === 'drive'));
  const [readingMode, setReadingMode] = useState<'manuscript' | 'cloud_embed'>('manuscript');
  const [readingTheme, setReadingTheme] = useState<'dark' | 'sepia' | 'light' | 'oled' | 'emerald'>('dark');
  const [fontSize, setFontSize] = useState<number>(18);
  const [lineHeight, setLineHeight] = useState<'normal' | 'relaxed' | 'loose'>('relaxed');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [embedError, setEmbedError] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [tocSearch, setTocSearch] = useState<string>('');

  // Audio Read-Aloud / TTS State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const manuscriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeReadingBookId) {
      setActiveChapterIndex(0);
      setEmbedError(false);
      // Auto-set mode depending on source type
      if (isPdfOrDrive) {
        setReadingMode('cloud_embed');
      } else {
        setReadingMode('manuscript');
      }
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeReadingBookId, isPdfOrDrive]);

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeReadingBookId) return;

      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          stopAudioReader();
          closeBookReader();
        }
      } else if (e.key === 'ArrowRight' && readingMode === 'manuscript') {
        nextChapter();
      } else if (e.key === 'ArrowLeft' && readingMode === 'manuscript') {
        prevChapter();
      } else if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== 'INPUT') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReadingBookId, readingMode, activeChapterIndex, closeBookReader]);

  if (!book) return null;

  const volumeId = book.googleBooksVolumeId || 
    extractGoogleBooksId(book.playStoreUrl || book.googlePlayUrl) || 
    DEFAULT_FALLBACK_VOLUME_ID;

  // Determine Embed Source
  let embedSrc = '';
  if (book.driveUrl && book.previewEmbedUrl?.includes('drive.google.com')) {
    embedSrc = book.previewEmbedUrl;
  } else if (book.pdfUrl) {
    embedSrc = book.previewEmbedUrl || `https://docs.google.com/viewer?url=${encodeURIComponent(book.pdfUrl)}&embedded=true`;
  } else {
    embedSrc = getGoogleBooksEmbedUrl(volumeId);
  }

  const storeUrl = book.playStoreUrl || book.googlePlayUrl || getGooglePlayStoreUrl(volumeId);
  const readerUrl = book.webReaderLink || book.pdfUrl || book.driveUrl || getGooglePlayReaderUrl(volumeId);

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

  const filteredChapters = chapters.filter(c => 
    c.toLowerCase().includes(tocSearch.toLowerCase())
  );

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
      title: `${book.title} by ${book.author || 'Arjun Bharti Mina'}`,
      text: book.description || 'Read published books and poetry manuscripts on Google Play Books.',
      url: storeUrl || readerUrl || window.location.href,
      imageUrl: book.cover
    });
  };

  // Text-To-Speech (TTS) Reader implementation
  const getChapterContentText = (index: number): string => {
    let text = `${chapters[index]}. `;
    if (index === 0) {
      text += `Literature and creative thought are built on foundational cadences. When words are assembled with mathematical symmetry, emotional sincerity, and structural load balance, they resonate across disciplines—from structural civil calculations to poignant musical bars. In this opening chapter, we investigate the philosophy of genuine creative expression. True art does not imitate fleeting trends; it builds an enduring sanctuary for thought, observation, and rhythm. Every line written is a beam placed in the architecture of the mind. Build it with integrity, calculate its weight, and let the truth stand uncompromised. Whether analyzing civil mechanics or rhyming schemes across Hindi, Urdu, and English, the underlying discipline remains constant: relentless precision paired with untamed soul.`;
    } else if (index === 1) {
      text += `Cadence is the heartbeat of language. This chapter deconstructs the multi-syllabic rhyming structures, internal assonances, and rhythmic displacements that empower timeless spoken-word and literature. We explore how acoustic stress patterns correspond with human memory retention. By balancing phonetic symmetry with unexpected thematic pivots, the writer commands attention and instills lasting resonance.`;
    } else if (index === 2) {
      text += `Real-world blueprints require grounding in lived experience. From university halls to late-night studio sessions and infrastructure project sites across Rajasthan, every chapter of life provides raw data for literary synthesis. Here, we examine narrative frameworks that translate raw hustle, structural engineering precision, and creative ambition into compelling written stories that inspire and instruct.`;
    } else if (index === 3) {
      text += `Structure and symmetry govern both physical edifices and literary works. In this chapter, we discover the structural mechanics linking reinforced concrete engineering with multisyllabic stanza structures. Load paths, stress distributions, harmonic frequencies, and cultural heritage form a unified tapestry of creative innovation.`;
    } else {
      text += `The concluding roadmap provides actionable strategies for independent publishing, digital distribution on Google Play Books, preserving author rights, and cultivating an authentic community of readers. Every author must possess both artistic mastery and tactical clarity to navigate the modern digital ecosystem with independence and authority.`;
    }
    return text;
  };

  const startAudioReader = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-Speech is not supported in your browser.', 'error');
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = getChapterContentText(activeChapterIndex);
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      showToast(`Narrating Chapter ${activeChapterIndex + 1}...`, 'info');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      // Auto-advance if not at the end
      if (activeChapterIndex < chapters.length - 1) {
        nextChapter();
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const togglePauseAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopAudioReader = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const nextChapter = () => {
    hapticSelection();
    if (activeChapterIndex < chapters.length - 1) {
      setActiveChapterIndex(prev => prev + 1);
      if (manuscriptContainerRef.current) {
        manuscriptContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const prevChapter = () => {
    hapticSelection();
    if (activeChapterIndex > 0) {
      setActiveChapterIndex(prev => prev - 1);
      if (manuscriptContainerRef.current) {
        manuscriptContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Theme Styling Map
  const themeClasses = {
    dark: 'bg-neutral-900 text-neutral-100 border-neutral-800',
    oled: 'bg-black text-neutral-100 border-neutral-900',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e8d7ba]',
    light: 'bg-neutral-50 text-neutral-900 border-neutral-200',
    emerald: 'bg-[#0f1f17] text-[#d1fae5] border-[#1b3d2f]'
  };

  const paperBgClasses = {
    dark: 'bg-neutral-950 text-neutral-200 border-neutral-800',
    oled: 'bg-black text-neutral-200 border-neutral-900',
    sepia: 'bg-[#f4e4c1] text-[#362716] border-[#d8c39e]',
    light: 'bg-white text-neutral-800 border-neutral-200',
    emerald: 'bg-[#0b1711] text-[#a7f3d0] border-[#1e3a2b]'
  };

  const headerBgClasses = {
    dark: 'bg-neutral-950/95 border-neutral-800 text-white',
    oled: 'bg-black/95 border-neutral-850 text-white',
    sepia: 'bg-[#f0dfba]/95 border-[#dcc59c] text-[#3d2c19]',
    light: 'bg-white/95 border-neutral-200 text-neutral-900',
    emerald: 'bg-[#08120e]/95 border-[#152e23] text-[#d1fae5]'
  };

  const fontFamilies = {
    serif: '"Lora", "Georgia", "Merriweather", "Playfair Display", serif',
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace'
  };

  const lineHeights = {
    normal: '1.6',
    relaxed: '1.85',
    loose: '2.1'
  };

  const progressPercent = Math.round(((activeChapterIndex + 1) / chapters.length) * 100);

  return (
    <div 
      id="book-full-read-mode-modal"
      className={`fixed inset-0 z-[7000] flex flex-col ${themeClasses[readingTheme]} transition-colors duration-300 select-none overflow-hidden`}
    >
      {/* Reading Progress Line */}
      <div className="h-1 w-full bg-black/20 dark:bg-white/10 shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 1. TOP HEADER TOOLBAR */}
      <header className={`px-3 sm:px-6 py-2.5 border-b flex items-center justify-between gap-2 sm:gap-4 ${headerBgClasses[readingTheme]} backdrop-blur-md shrink-0 z-30 shadow-xs`}>
        
        {/* Left: Book Meta & TOC Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              hapticLight();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold shrink-0 ${
              isSidebarOpen 
                ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold shadow-sm' 
                : 'hover:bg-current/10 border-current/20'
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
                By {book.author || 'Arjun Bharti Mina'} • {book.pages || 160} Pages • {book.genre || book.category || 'Literature'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Mode Switcher (Manuscript vs Interactive Stream) */}
        <div className="flex items-center bg-black/10 dark:bg-white/10 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => {
              hapticSelection();
              setReadingMode('manuscript');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              readingMode === 'manuscript'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Manuscript View</span>
          </button>

          <button
            type="button"
            onClick={() => {
              hapticSelection();
              setReadingMode('cloud_embed');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              readingMode === 'cloud_embed'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            {isPdfOrDrive ? <FileText className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{isPdfOrDrive ? 'Cloud PDF Reader' : 'Google Play Stream'}</span>
          </button>
        </div>

        {/* Right: Audio Narration, Themes, Actions & Exit */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Audio Reader Controls */}
          {readingMode === 'manuscript' && (
            <div className="flex items-center bg-black/10 dark:bg-white/10 p-1 rounded-xl">
              {!isSpeaking ? (
                <button
                  type="button"
                  onClick={startAudioReader}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-current/10 cursor-pointer"
                  title="Listen to Chapter (Audio Read-Aloud)"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden lg:inline text-[11px]">Listen</span>
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={togglePauseAudio}
                    className="p-1 rounded-md bg-amber-500 text-neutral-950 font-bold"
                    title={isPaused ? 'Resume Narration' : 'Pause Narration'}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={stopAudioReader}
                    className="p-1 rounded-md hover:bg-current/10"
                    title="Stop Audio Narration"
                  >
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Typography & Theme Preferences (Desktop Bar) */}
          {readingMode === 'manuscript' && (
            <div className="hidden lg:flex items-center gap-1.5 pr-2 border-r border-current/20">
              {/* Font Family Switcher */}
              <button
                type="button"
                onClick={() => {
                  const next = fontFamily === 'serif' ? 'sans' : fontFamily === 'sans' ? 'mono' : 'serif';
                  setFontFamily(next);
                }}
                className="px-2 py-1 rounded-lg text-[11px] font-mono border border-current/20 hover:bg-current/10 cursor-pointer uppercase"
                title="Switch Font Family"
              >
                {fontFamily}
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
              <span className="text-[11px] font-mono opacity-70 w-5 text-center">{fontSize}</span>
              <button
                type="button"
                onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-current/10 cursor-pointer"
                title="Increase Font Size"
              >
                A+
              </button>

              {/* Theme Selector Palette */}
              <div className="flex items-center gap-1 ml-1">
                <button
                  type="button"
                  onClick={() => setReadingTheme('dark')}
                  className={`w-5 h-5 rounded-full bg-neutral-900 border ${readingTheme === 'dark' ? 'ring-2 ring-amber-500' : 'border-neutral-700'}`}
                  title="Dark Charcoal"
                />
                <button
                  type="button"
                  onClick={() => setReadingTheme('sepia')}
                  className={`w-5 h-5 rounded-full bg-[#fbf0d9] border ${readingTheme === 'sepia' ? 'ring-2 ring-amber-500' : 'border-[#d8c39e]'}`}
                  title="Warm Sepia"
                />
                <button
                  type="button"
                  onClick={() => setReadingTheme('light')}
                  className={`w-5 h-5 rounded-full bg-white border ${readingTheme === 'light' ? 'ring-2 ring-amber-500' : 'border-neutral-300'}`}
                  title="Light Paper"
                />
                <button
                  type="button"
                  onClick={() => setReadingTheme('emerald')}
                  className={`w-5 h-5 rounded-full bg-[#0f1f17] border ${readingTheme === 'emerald' ? 'ring-2 ring-emerald-400' : 'border-emerald-800'}`}
                  title="Forest Emerald"
                />
                <button
                  type="button"
                  onClick={() => setReadingTheme('oled')}
                  className={`w-5 h-5 rounded-full bg-black border ${readingTheme === 'oled' ? 'ring-2 ring-amber-500' : 'border-neutral-800'}`}
                  title="OLED Pure Black"
                />
              </div>
            </div>
          )}

          {/* Direct Store / Reader Link */}
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
            className="p-2 rounded-xl hover:bg-current/10 transition-colors cursor-pointer hidden sm:block"
            title="Share Book"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl hover:bg-current/10 transition-colors cursor-pointer hidden md:block"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Read Mode */}
          <button
            type="button"
            onClick={() => {
              hapticLight();
              stopAudioReader();
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
              initial={{ x: -340, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -340, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`w-80 sm:w-88 border-r ${headerBgClasses[readingTheme]} flex flex-col shrink-0 z-40 overflow-hidden shadow-2xl`}
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
                  className="p-1 rounded-lg hover:bg-current/10 cursor-pointer"
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
                    {book.pages || 160} Pages • {progressPercent}% Progress
                  </span>
                </div>
              </div>

              {/* Search Chapters in Drawer */}
              <div className="p-3 border-b border-current/10">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    value={tocSearch}
                    onChange={(e) => setTocSearch(e.target.value)}
                    placeholder="Search chapters & topics..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-current/5 border border-current/15 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Chapters List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5 select-text">
                {filteredChapters.map((chap, idx) => {
                  const actualIdx = chapters.indexOf(chap);
                  const isCurrent = activeChapterIndex === actualIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        hapticSelection();
                        setActiveChapterIndex(actualIdx);
                        if (readingMode !== 'manuscript') {
                          setReadingMode('manuscript');
                        }
                        if (window.innerWidth < 768) {
                          setIsSidebarOpen(false);
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
                        Ch. {actualIdx + 1}
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
                  disabled={isDownloadingPdf}
                  className="w-full py-2 px-3 rounded-xl bg-current/10 hover:bg-current/20 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Official PDF Preview'}</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Reader Display: MODE 1 (Distraction-Free Manuscript & Chapter Reader) */}
        {readingMode === 'manuscript' && (
          <div 
            ref={manuscriptContainerRef}
            className="flex-1 h-full overflow-y-auto p-4 sm:p-8 lg:p-12 flex justify-center select-text scroll-smooth"
          >
            <article 
              className={`w-full max-w-3xl rounded-3xl p-6 sm:p-12 border shadow-xl space-y-8 ${paperBgClasses[readingTheme]} transition-all duration-300 my-auto`}
              style={{
                fontFamily: fontFamilies[fontFamily]
              }}
            >
              {/* Chapter Header */}
              <div className="border-b border-current/15 pb-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono opacity-75">
                  <span className="px-2.5 py-0.5 rounded-full bg-current/10 font-bold">
                    CHAPTER {activeChapterIndex + 1} OF {chapters.length}
                  </span>
                  <span>{book.publicationYear || 2026} • {book.author || 'ARJUN BHARTI MINA'}</span>
                </div>
                <h1 
                  className="font-extrabold leading-tight tracking-tight"
                  style={{ fontSize: `${fontSize * 1.55}px` }}
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
                className="space-y-6"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: lineHeights[lineHeight] 
                }}
              >
                {activeChapterIndex === 0 && (
                  <>
                    <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:mr-3 first-letter:float-left first-letter:leading-none">
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
                    <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:mr-3 first-letter:float-left first-letter:leading-none">
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
                    <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                      Real-world blueprints require grounding in lived experience. From university halls to late-night studio sessions and infrastructure project sites across Rajasthan, every chapter of life provides raw data for literary synthesis.
                    </p>
                    <p>
                      Here, we examine narrative frameworks that translate raw hustle, structural engineering precision, and creative ambition into compelling written stories that inspire and instruct.
                    </p>
                  </>
                )}

                {activeChapterIndex === 3 && (
                  <>
                    <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                      Structure and symmetry govern both physical edifices and literary works. In this chapter, we discover the structural mechanics linking reinforced concrete engineering with multisyllabic stanza structures.
                    </p>
                    <p>
                      Load paths, stress distributions, harmonic frequencies, and cultural heritage form a unified tapestry of creative innovation.
                    </p>
                  </>
                )}

                {activeChapterIndex >= 4 && (
                  <>
                    <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:mr-3 first-letter:float-left first-letter:leading-none">
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
                  onClick={prevChapter}
                  className="px-4 py-2.5 rounded-xl border border-current/20 hover:bg-current/10 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Chapter</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-mono opacity-70">
                  <span>Ch. {activeChapterIndex + 1} / {chapters.length}</span>
                </div>

                <button
                  type="button"
                  disabled={activeChapterIndex === chapters.length - 1}
                  onClick={nextChapter}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-neutral-950 hover:bg-amber-400 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed shadow-md transition-all"
                >
                  <span>Next Chapter</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Complete Volume & Play Store Access Box */}
              <div className="p-6 rounded-2xl bg-current/5 border border-current/15 space-y-3 text-center">
                <h4 className="text-sm font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Enjoying this reading preview?</span>
                </h4>
                <p className="text-xs opacity-75 max-w-md mx-auto leading-relaxed">
                  Access the complete volume with full diagrams, high-resolution pages, and digital reading formats on Google Play Books or download the verified PDF preview.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
                    disabled={isDownloadingPdf}
                    className="px-4 py-2.5 rounded-full border border-current/20 hover:bg-current/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-500" />
                    <span>Download Official PDF Preview</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Reader Display: MODE 2 (Interactive Cloud Embed / PDF / Google Play) */}
        {readingMode === 'cloud_embed' && (
          <div className="flex-1 h-full w-full relative bg-neutral-950 flex flex-col">
            <iframe
              id="full-mode-book-embed-iframe"
              key={embedSrc}
              src={embedSrc}
              title={`Book Embed: ${book.title}`}
              className="w-full h-full border-0 flex-1 bg-neutral-950"
              loading="lazy"
              onError={() => setEmbedError(true)}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            />

            {/* Fallback Banner for Sandbox or Embed Restrictions */}
            {embedError && (
              <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4 z-10 backdrop-blur-md text-white">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-lg font-bold">Interactive Web Reader</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Browser sandboxing is active. You can switch to our high-resolution <strong>Manuscript View</strong> or launch the interactive reader in a dedicated window.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      hapticSelection();
                      setReadingMode('manuscript');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Type className="w-4 h-4" />
                    <span>Switch to Manuscript View</span>
                  </button>
                  {readerUrl && (
                    <a
                      href={readerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Open Direct Web Reader</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
