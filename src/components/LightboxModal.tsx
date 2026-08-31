import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2,
  Minimize2,
  MapPin, 
  Calendar, 
  Tag, 
  Download,
  Info
} from 'lucide-react';
import { downloadImage } from '../utils/shareUtils';

export const LightboxModal: React.FC = () => {
  const { lightboxItem, closeLightbox, nextLightbox, prevLightbox, openShare, showToast, gallery } = useStore();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showMeta, setShowMeta] = useState(false); // Collapsed by default on mobile for clean viewing
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch gesture tracking for mobile swiping
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Reset zoom & meta whenever image changes
  useEffect(() => {
    setZoomLevel(1);
  }, [lightboxItem?.id]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  }, []);

  // Keyboard navigation & zoom shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomLevel > 1) {
          setZoomLevel(1);
        } else {
          closeLightbox();
        }
      }
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-' || e.key === '_') handleZoomOut();
      if (e.key === '0') setZoomLevel(1);
      if (e.key === 'i' || e.key === 'I') setShowMeta(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox, nextLightbox, prevLightbox, zoomLevel, handleZoomIn, handleZoomOut]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!lightboxItem) return null;

  const currentIndex = gallery.findIndex(g => g.id === lightboxItem.id);
  const totalCount = gallery.length;

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen();
        } else {
          await document.documentElement.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch {
      showToast('Fullscreen mode toggled', 'info');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    openShare({
      type: 'image',
      title: `${lightboxItem.title} — Photography by Arjun Bharti Mina`,
      text: `${lightboxItem.description} Location: ${lightboxItem.location || 'India'} (${lightboxItem.date}).`,
      url: `${window.location.origin}/#gallery?id=${lightboxItem.id}`,
      imageUrl: lightboxItem.imageUrl,
      downloadFilename: `${lightboxItem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`
    });
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    const filename = `${lightboxItem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`;
    await downloadImage(lightboxItem.imageUrl, filename);
    setDownloading(false);
    showToast('Photo downloaded', 'success');
  };

  // Touch handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe (prev/next) if not zoomed in
    if (zoomLevel === 1 && Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        prevLightbox();
      } else {
        nextLightbox();
      }
    } else if (zoomLevel === 1 && deltaY > 100 && Math.abs(deltaY) > Math.abs(deltaX)) {
      // Swipe down to close
      closeLightbox();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div 
      ref={containerRef}
      id="lightbox-modal-backdrop"
      className="fixed inset-0 z-[9990] bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none overflow-hidden h-[100dvh] w-screen animate-in fade-in duration-200"
      onClick={closeLightbox}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Controls Bar - strictly constrained & responsive */}
      <header 
        className="w-full flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/60 z-40 shrink-0 gap-2 sm:gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image Info & Counter */}
        <div className="min-w-0 flex-1 flex items-center gap-2 sm:gap-3">
          {currentIndex >= 0 && totalCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono text-[10px] sm:text-xs font-semibold shrink-0">
              {currentIndex + 1} / {totalCount}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-white text-xs sm:text-sm font-bold tracking-tight truncate">
              {lightboxItem.title}
            </h3>
            <span className="text-amber-400/90 text-[10px] font-mono tracking-wider uppercase truncate block">
              {lightboxItem.category || 'Photo'}
            </span>
          </div>
        </div>

        {/* Right: Action Buttons Group (Always visible, properly sized, never overflow) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-white/10 rounded-full p-0.5 border border-white/10">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 rounded-full hover:bg-white/20 text-white disabled:opacity-30 transition-colors cursor-pointer"
              title="Zoom Out (-)"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono font-bold text-amber-400 min-w-[36px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-1.5 rounded-full hover:bg-white/20 text-white disabled:opacity-30 transition-colors cursor-pointer"
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-full hover:bg-amber-500 hover:text-black text-amber-400 transition-colors cursor-pointer"
                title="Reset Zoom"
                aria-label="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Info / Metadata Toggle */}
          <button
            type="button"
            onClick={() => setShowMeta(!showMeta)}
            className={`p-2 rounded-full text-white transition-colors cursor-pointer ${
              showMeta ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-white/10 hover:bg-white/20'
            }`}
            title={showMeta ? "Hide Details" : "Show Details"}
            aria-label="Toggle Details"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Fullscreen Mode (hidden on small mobile where browser is full viewport) */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden sm:inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Share Photo"
            aria-label="Share Photo"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Download Full Res Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 transition-colors cursor-pointer"
            title="Download Photo"
            aria-label="Download Photo"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Close Lightbox Button (Always visible, prominent, rightmost) */}
          <button
            type="button"
            onClick={closeLightbox}
            className="p-2 rounded-full bg-neutral-800 hover:bg-red-600 text-white transition-colors cursor-pointer border border-neutral-700 ml-1"
            title="Close (ESC)"
            aria-label="Close Viewer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Image Stage */}
      <main 
        className="relative flex-1 min-h-0 flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none"
        onClick={closeLightbox}
      >
        {/* Previous Photo Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevLightbox();
          }}
          className="absolute left-2 sm:left-5 z-30 p-2 sm:p-3 rounded-full bg-black/70 hover:bg-amber-500 hover:text-black text-white backdrop-blur-md transition-all shadow-xl border border-white/15 cursor-pointer active:scale-95"
          title="Previous Photo (Left Arrow)"
          aria-label="Previous Photo"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Image Display with Zoom Pan Support */}
        <div 
          className="relative max-h-full max-w-full flex items-center justify-center overflow-auto p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            src={lightboxItem.imageUrl} 
            alt={lightboxItem.title} 
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop';
            }}
            style={{
              transform: `scale(${zoomLevel})`,
              transition: zoomLevel === 1 ? 'transform 0.25s ease-out' : 'none'
            }}
            className={`max-h-[75dvh] sm:max-h-[80dvh] max-w-[calc(100vw-24px)] sm:max-w-[calc(100vw-120px)] object-contain rounded-xl sm:rounded-2xl shadow-2xl ${
              zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
            }`}
            onClick={() => {
              if (zoomLevel === 1) {
                setZoomLevel(1.8);
              } else {
                setZoomLevel(1);
              }
            }}
          />
        </div>

        {/* Next Photo Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextLightbox();
          }}
          className="absolute right-2 sm:right-5 z-30 p-2 sm:p-3 rounded-full bg-black/70 hover:bg-amber-500 hover:text-black text-white backdrop-blur-md transition-all shadow-xl border border-white/15 cursor-pointer active:scale-95"
          title="Next Photo (Right Arrow)"
          aria-label="Next Photo"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </main>

      {/* Bottom Metadata & Caption Bar (Collapsible or Compact) */}
      {showMeta && (
        <footer 
          className="w-full px-4 sm:px-6 py-3 bg-neutral-950/90 backdrop-blur-md border-t border-neutral-800/80 text-neutral-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 z-40 shrink-0 max-h-36 overflow-y-auto animate-in slide-in-from-bottom-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-neutral-200 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
            {lightboxItem.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-neutral-400 font-mono text-[11px] shrink-0">
            {lightboxItem.location && (
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-white">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{lightboxItem.location}</span>
              </span>
            )}
            {lightboxItem.date && (
              <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full">
                <Calendar className="w-3 h-3 text-neutral-400" />
                <span>{lightboxItem.date}</span>
              </span>
            )}
            {lightboxItem.tags && lightboxItem.tags.length > 0 && (
              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">
                <Tag className="w-3 h-3" />
                <span>{lightboxItem.tags.slice(0, 2).join(', ')}</span>
              </span>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};


