import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ExternalLink, Share2, Calendar, Clock, Eye } from 'lucide-react';

export const VideoPlayerModal: React.FC = () => {
  const { activeVideo, closeVideoPlayer, openShare } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeVideoPlayer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeVideoPlayer]);

  if (!activeVideo) return null;

  const handleShare = () => {
    openShare({
      title: `${activeVideo.title} — Arjun Bharti Mina`,
      text: activeVideo.description,
      url: activeVideo.youtubeUrl
    });
  };

  return (
    <div 
      id="video-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={closeVideoPlayer}
    >
      <div 
        id="video-modal-card"
        className="w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-red-600/20 text-red-400 border border-red-500/30 rounded">
              {activeVideo.category}
            </span>
            <h3 className="text-sm font-semibold text-white truncate">{activeVideo.title}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
              title="Share Video"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <a
              href={activeVideo.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
              title="Open in YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={closeVideoPlayer}
              className="p-1.5 rounded-full text-neutral-400 hover:text-red-400 hover:bg-neutral-800"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Embed */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeEmbedId}?autoplay=1&rel=0`}
            title={activeVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Metadata & Description */}
        <div className="p-5 space-y-3 bg-neutral-950 text-neutral-300">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-neutral-800/80 pb-3">
            <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {activeVideo.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeVideo.duration}
              </span>
              {activeVideo.viewsCount && (
                <span className="flex items-center gap-1 text-amber-400">
                  <Eye className="w-3.5 h-3.5" />
                  {activeVideo.viewsCount} Views
                </span>
              )}
            </div>

            <a
              href="https://youtube.com/@arjunbhartimina?sub_confirmation=1"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              Subscribe on YouTube
            </a>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {activeVideo.description}
          </p>
        </div>
      </div>
    </div>
  );
};
