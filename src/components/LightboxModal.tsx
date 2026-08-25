import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ChevronLeft, ChevronRight, Share2, ZoomIn, ZoomOut, MapPin, Calendar, Tag, Download } from 'lucide-react';
import { downloadImage } from '../utils/shareUtils';

export const LightboxModal: React.FC = () => {
  const { lightboxItem, closeLightbox, nextLightbox, prevLightbox, openShare, showToast } = useStore();
  const [isZoomed, setIsZoomed] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox, nextLightbox, prevLightbox]);

  if (!lightboxItem) return null;

  const handleShare = () => {
    openShare({
      type: 'image',
      title: `${lightboxItem.title} — Photography by Arjun Bharti Mina`,
      text: `${lightboxItem.description} Location: ${lightboxItem.location || 'India'} (${lightboxItem.date}).`,
      url: `${window.location.origin}/#gallery?id=${lightboxItem.id}`,
      imageUrl: lightboxItem.imageUrl,
      downloadFilename: `${lightboxItem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`
    });
  };

  const handleDownload = async () => {
    setDownloading(true);
    const filename = `${lightboxItem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`;
    await downloadImage(lightboxItem.imageUrl, filename);
    setDownloading(false);
    showToast('Photo downloaded successfully!', 'success');
  };

  return (
    <div 
      id="lightbox-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in select-none"
      onClick={closeLightbox}
    >
      {/* Top Controls Bar */}
      <div 
        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-black/80 to-transparent z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <span className="text-amber-400 text-xs font-mono tracking-wider uppercase block">{lightboxItem.category}</span>
          <h3 className="text-white text-sm sm:text-base font-bold">{lightboxItem.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Download Full Resolution JPG"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={isZoomed ? "Zoom Out" : "Zoom In"}
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Share Photo & App Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={closeLightbox}
            className="p-2 rounded-full bg-white/10 hover:bg-red-500/80 text-white transition-colors"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div 
        className="relative flex-1 flex items-center justify-center p-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={prevLightbox}
          className="absolute left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-amber-500 hover:text-black text-white backdrop-blur-sm transition-all shadow-lg"
          title="Previous Photo (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img 
          src={lightboxItem.imageUrl} 
          alt={lightboxItem.title} 
          className={`max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-200 ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        <button
          onClick={nextLightbox}
          className="absolute right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-amber-500 hover:text-black text-white backdrop-blur-sm transition-all shadow-lg"
          title="Next Photo (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Metadata Bar */}
      <div 
        className="w-full px-6 py-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-neutral-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="max-w-xl text-center sm:text-left text-neutral-300">
          {lightboxItem.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-neutral-400 font-mono text-[11px]">
          {lightboxItem.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {lightboxItem.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            {lightboxItem.date}
          </span>
          {lightboxItem.tags && lightboxItem.tags.length > 0 && (
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              {lightboxItem.tags.slice(0, 3).join(', ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
