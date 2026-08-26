import React, { useEffect, useState, useRef } from 'react';
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
  const { lightboxItem, closeLightbox, nextLightbox, prevLightbox, openShare, showToast } = useStore();
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%, 1.5 = 150%, 2 = 200%, 3 = 300%
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showMeta, setShowMeta] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom whenever image changes
  useEffect(() => {
    setZoomLevel(1);
  }, [lightboxItem?.id]);

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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox, nextLightbox, prevLightbox, zoomLevel]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!lightboxItem) return null;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

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
      showToast('Fullscreen toggled', 'info');
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
    showToast('High resolution photo downloaded!', 'success');
  };

  return (
    <div 
      ref={containerRef}
      id="lightbox-modal-backdrop"
      className="fixed inset-0 z-[9000] bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none animate-in fade-in duration-200"
      onClick={closeLightbox}
    >
      {/* Top Header Controls Bar */}
      <div 
        className="w-full flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-b from-black/90 via-black/60 to-transparent z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div>
            <span className="text-amber-400 text-[11px] font-mono tracking-wider uppercase font-bold block">
              {lightboxItem.category} • Photography
            </span>
            <h3 className="text-white text-sm sm:text-base font-bold tracking-tight">
              {lightboxItem.title}
            </h3>
          </div>
        </div>

        {/* Action Controls: Zoom, Fullscreen, Share, Download, Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Zoom Level Indicator & Controls */}
          <div className="flex items-center bg-white/10 rounded-full p-0.5 border border-white/10">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-2 rounded-full hover:bg-white/20 text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-[11px] font-mono font-bold text-amber-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3.5}
              className="p-2 rounded-full hover:bg-white/20 text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={() => setZoomLevel(1)}
                className="p-2 rounded-full hover:bg-amber-500 hover:text-black text-amber-400 transition-colors"
                title="Reset Zoom (100%)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Fullscreen Mode */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Share Button (Pops ShareModal on top with z-[99999]) */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors font-bold shadow-lg"
            title="Share Photo & Links"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Download Full Res Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 transition-colors"
            title="Download Full Resolution JPG"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Close Lightbox Button */}
          <button
            onClick={closeLightbox}
            className="p-2.5 rounded-full bg-white/10 hover:bg-red-500 text-white transition-colors ml-1"
            title="Close Lightbox (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div 
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none"
        onClick={closeLightbox}
      >
        {/* Previous Photo Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevLightbox();
          }}
          className="absolute left-3 sm:left-6 z-30 p-3 rounded-full bg-neutral-950/70 hover:bg-amber-500 hover:text-black text-white backdrop-blur-md transition-all shadow-2xl border border-white/10"
          title="Previous Photo (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Image Display with Zoom Pan Support */}
        <div 
          className="relative max-h-[82vh] max-w-[92vw] flex items-center justify-center overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            src={lightboxItem.imageUrl} 
            alt={lightboxItem.title} 
            style={{
              transform: `scale(${zoomLevel})`,
              transition: zoomLevel === 1 ? 'transform 0.25s ease-out' : 'none'
            }}
            className={`max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl ${
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
          onClick={(e) => {
            e.stopPropagation();
            nextLightbox();
          }}
          className="absolute right-3 sm:right-6 z-30 p-3 rounded-full bg-neutral-950/70 hover:bg-amber-500 hover:text-black text-white backdrop-blur-md transition-all shadow-2xl border border-white/10"
          title="Next Photo (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Metadata & Caption Bar */}
      {showMeta && (
        <div 
          className="w-full px-6 py-4 bg-gradient-to-t from-black via-black/80 to-transparent text-neutral-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="max-w-2xl text-center sm:text-left text-neutral-200 text-xs sm:text-sm font-medium leading-relaxed">
            {lightboxItem.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-neutral-400 font-mono text-[11px]">
            {lightboxItem.location && (
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-white font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{lightboxItem.location}</span>
              </span>
            )}
            <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>{lightboxItem.date}</span>
            </span>
            {lightboxItem.tags && lightboxItem.tags.length > 0 && (
              <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">
                <Tag className="w-3.5 h-3.5" />
                <span>{lightboxItem.tags.slice(0, 3).join(', ')}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

