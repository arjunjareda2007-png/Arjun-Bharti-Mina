import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { VideoItem } from '../types';
import { 
  X, 
  ExternalLink, 
  Share2, 
  Calendar, 
  Clock, 
  Eye, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Youtube,
  Sparkles 
} from 'lucide-react';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from '../utils/youtubeUtils';
import { hapticBeat, hapticLight, hapticSuccess } from '../utils/haptics';

export const VideoPlayerModal: React.FC = () => {
  const { activeVideo, openVideoPlayer, closeVideoPlayer, openShare, showToast, videos } = useStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeVideoPlayer();
      if (e.key === 'ArrowLeft' && videos.length > 1) handlePrev();
      if (e.key === 'ArrowRight' && videos.length > 1) handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeVideoPlayer, activeVideo, videos]);

  if (!activeVideo) return null;

  const videoId = activeVideo.youtubeEmbedId || extractYouTubeId(activeVideo.youtubeUrl) || 'fJ9rUzIMcZQ';
  const watchUrl = activeVideo.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = getYouTubeEmbedUrl(videoId, { autoplay: true });

  const currentIndex = videos.findIndex(v => v.id === activeVideo.id);

  const handlePrev = () => {
    if (videos.length <= 1) return;
    hapticLight();
    const prevIdx = (currentIndex - 1 + videos.length) % videos.length;
    openVideoPlayer(videos[prevIdx]);
  };

  const handleNext = () => {
    if (videos.length <= 1) return;
    hapticLight();
    const nextIdx = (currentIndex + 1) % videos.length;
    openVideoPlayer(videos[nextIdx]);
  };

  const handleCopyLink = () => {
    hapticSuccess();
    navigator.clipboard.writeText(watchUrl);
    setCopied(true);
    showToast(`Copied YouTube link for "${activeVideo.title}"`, 'success');
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShare = () => {
    hapticBeat();
    openShare({
      type: 'video',
      title: `${activeVideo.title} — Arjun Bharti Mina`,
      text: `${activeVideo.description} Watch official visual stream!`,
      url: watchUrl,
      imageUrl: activeVideo.thumbnail || getYouTubeThumbnail(videoId, 'maxres'),
      downloadFilename: `${activeVideo.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_thumb.jpg`
    });
  };

  return (
    <div 
      id="video-modal-backdrop"
      className="fixed inset-0 z-[8000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={closeVideoPlayer}
    >
      <div 
        id="video-modal-card"
        className="w-full max-w-5xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900/90 border-b border-neutral-800 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-2.5 truncate">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg">
              {activeVideo.category}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white truncate">{activeVideo.title}</h3>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {videos.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 mr-2 bg-neutral-950 border border-neutral-800 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Previous Video (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono text-neutral-400 px-1">
                  {currentIndex + 1}/{videos.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Next Video (→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Copy YouTube Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Share Video"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
            </button>

            <a
              href={watchUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Open in YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={closeVideoPlayer}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer ml-1"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Embed Screen */}
        <div className="relative aspect-video w-full bg-black flex-shrink-0">
          <iframe
            key={videoId}
            src={embedUrl}
            title={activeVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Metadata & Related Videos Section */}
        <div className="p-5 sm:p-6 space-y-5 bg-neutral-950 text-neutral-300 overflow-y-auto flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-neutral-400 font-mono text-xs">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                {activeVideo.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                {activeVideo.duration}
              </span>
              {activeVideo.viewsCount && (
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Eye className="w-3.5 h-3.5" />
                  {activeVideo.viewsCount} Views
                </span>
              )}
            </div>

            <a
              href="https://youtube.com/@arjunbhartimina?sub_confirmation=1"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Youtube className="w-3.5 h-3.5 fill-current" />
              <span>Subscribe on YouTube</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {activeVideo.description}
          </p>

          {/* Related Videos Strip */}
          {videos.length > 1 && (
            <div className="pt-4 border-t border-neutral-800/80 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                More Visual Releases & Studio Cyphers
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {videos
                  .filter(v => v.id !== activeVideo.id)
                  .slice(0, 4)
                  .map(vid => {
                    const vidThumb = vid.thumbnail || getYouTubeThumbnail(vid.youtubeEmbedId || 'fJ9rUzIMcZQ', 'hq');
                    return (
                      <div
                        key={vid.id}
                        onClick={() => openVideoPlayer(vid)}
                        className="group p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-red-500/40 cursor-pointer transition-all space-y-1.5"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-950">
                          <img 
                            src={vidThumb} 
                            alt={vid.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                            <Play className="w-4 h-4 fill-current text-white" />
                          </div>
                          <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[8px] font-mono text-white">
                            {vid.duration}
                          </span>
                        </div>
                        <h4 className="text-[11px] font-bold text-neutral-200 group-hover:text-amber-400 line-clamp-1">
                          {vid.title}
                        </h4>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

