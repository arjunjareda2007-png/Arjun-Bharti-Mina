import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { VideoItem } from '../types';
import { 
  Play, 
  Pause, 
  ExternalLink, 
  Share2, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  Youtube, 
  Film, 
  Sparkles, 
  Tv, 
  Eye, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Volume2,
  RefreshCw
} from 'lucide-react';
import { 
  extractYouTubeId, 
  getYouTubeEmbedUrl, 
  getYouTubeThumbnail,
  getYouTubeWatchUrl 
} from '../utils/youtubeUtils';
import { hapticBeat, hapticLight, hapticMedium, hapticSuccess } from '../utils/haptics';

interface YouTubeVideoShowcaseProps {
  id?: string;
  initialVideoId?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  showPlaylist?: boolean;
  autoPlayOnSelect?: boolean;
  className?: string;
}

export const YouTubeVideoShowcase: React.FC<YouTubeVideoShowcaseProps> = ({
  id = 'youtube-showcase',
  initialVideoId,
  title = 'Official Visuals & YouTube Showcase',
  subtitle = 'Watch music videos, live cyphers, and studio breakdowns embedded directly on site',
  compact = false,
  showPlaylist = true,
  autoPlayOnSelect = true,
  className = ''
}) => {
  const { 
    videos, 
    youtube, 
    profile, 
    openVideoPlayer, 
    openShare, 
    showToast,
    isPlaying: isAudioPlaying,
    togglePlay: toggleAudioPlay
  } = useStore();

  const showcaseVideos = videos.length > 0 ? videos : [];
  
  // Find initial selected video
  const defaultVideo = showcaseVideos.find(v => v.id === initialVideoId || v.youtubeEmbedId === initialVideoId) 
    || showcaseVideos.find(v => v.featured) 
    || showcaseVideos[0];

  const [selectedVideo, setSelectedVideo] = useState<VideoItem | undefined>(defaultVideo);
  const [isEmbeddedPlaying, setIsEmbeddedPlaying] = useState<boolean>(false);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const showcaseContainerRef = useRef<HTMLDivElement>(null);

  // Sync selected video if initialVideoId prop updates
  useEffect(() => {
    if (initialVideoId) {
      const match = showcaseVideos.find(v => v.id === initialVideoId || v.youtubeEmbedId === initialVideoId);
      if (match) {
        setSelectedVideo(match);
      }
    }
  }, [initialVideoId, showcaseVideos]);

  // Fallback if selectedVideo is not yet set
  const activeVideo = selectedVideo || defaultVideo || {
    id: 'default-vid',
    title: 'RUTBA — Official Music Video',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    youtubeEmbedId: 'fJ9rUzIMcZQ',
    category: 'Music Video',
    duration: '3:45',
    date: '2026',
    description: 'Official music video by Arjun Bharti Mina.',
    featured: true,
    viewsCount: '124K'
  };

  const videoId = activeVideo.youtubeEmbedId || extractYouTubeId(activeVideo.youtubeUrl) || 'fJ9rUzIMcZQ';
  const embedUrl = getYouTubeEmbedUrl(videoId, { autoplay: isEmbeddedPlaying });
  const watchUrl = activeVideo.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`;
  const channelUrl = youtube?.channelUrl || 'https://youtube.com/@arjunbhartimina';
  const subCount = youtube?.subscribersCount || profile?.stats?.youtubeSubs || '12.8K+';

  const handleStartPlay = () => {
    hapticBeat();
    // If background music is playing, pause it so sounds don't overlap
    if (isAudioPlaying) {
      toggleAudioPlay();
      showToast('Audio paused for video playback', 'info');
    }
    setIsEmbeddedPlaying(true);
    setIframeLoaded(false);
  };

  const handleSelectVideo = (vid: VideoItem) => {
    hapticLight();
    setSelectedVideo(vid);
    if (autoPlayOnSelect) {
      if (isAudioPlaying) {
        toggleAudioPlay();
      }
      setIsEmbeddedPlaying(true);
      setIframeLoaded(false);
    }
    // Scroll showcase into view smoothly if out of viewport
    if (showcaseContainerRef.current) {
      const rect = showcaseContainerRef.current.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        showcaseContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleCopyLink = () => {
    hapticSuccess();
    navigator.clipboard.writeText(watchUrl);
    setCopied(true);
    showToast(`Copied YouTube link for "${activeVideo.title}"`, 'success');
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShareVideo = () => {
    hapticMedium();
    openShare({
      type: 'video',
      title: `${activeVideo.title} — Arjun Bharti Mina`,
      text: `${activeVideo.description} Watch embedded on official portfolio or YouTube!`,
      url: watchUrl,
      imageUrl: activeVideo.thumbnail || getYouTubeThumbnail(videoId, 'maxres'),
      downloadFilename: `${activeVideo.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_showcase.jpg`
    });
  };

  const handleOpenModal = () => {
    hapticMedium();
    openVideoPlayer(activeVideo);
  };

  // Find index for next / prev navigation
  const currentIndex = showcaseVideos.findIndex(v => v.id === activeVideo.id);
  const handlePrevVideo = () => {
    if (showcaseVideos.length <= 1) return;
    const prevIdx = (currentIndex - 1 + showcaseVideos.length) % showcaseVideos.length;
    handleSelectVideo(showcaseVideos[prevIdx]);
  };
  const handleNextVideo = () => {
    if (showcaseVideos.length <= 1) return;
    const nextIdx = (currentIndex + 1) % showcaseVideos.length;
    handleSelectVideo(showcaseVideos[nextIdx]);
  };

  return (
    <div 
      id={id}
      ref={showcaseContainerRef}
      className={`rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 flex-shrink-0 shadow-inner">
            <Youtube className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-500 font-bold">
                YouTube Video Showcase
              </span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                1080p Embed
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isTheaterMode ? 'Switch to Standard Layout' : 'Expand Theater Mode'}
          >
            {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isTheaterMode ? 'Standard' : 'Theater Mode'}</span>
          </button>

          <a
            href={`${channelUrl}?sub_confirmation=1`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md flex-shrink-0"
          >
            <Youtube className="w-3.5 h-3.5 fill-current" />
            <span>Subscribe ({subCount})</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Main Showcase Layout */}
      <div className={`p-4 sm:p-6 lg:p-8 ${isTheaterMode ? 'space-y-6' : 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start'}`}>
        
        {/* Left / Top: Embedded YouTube Video Screen */}
        <div className={isTheaterMode ? 'w-full' : 'lg:col-span-8'}>
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl group">
            
            {/* When not playing: High Resolution Poster / Splash with Quick Play */}
            {!isEmbeddedPlaying ? (
              <div 
                className="relative w-full h-full cursor-pointer group"
                onClick={handleStartPlay}
              >
                <img 
                  src={activeVideo.thumbnail || getYouTubeThumbnail(videoId, 'maxres')} 
                  alt={activeVideo.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getYouTubeThumbnail(videoId, 'hq');
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                {/* Badges on Poster */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10 uppercase tracking-wider">
                    {activeVideo.category}
                  </span>
                  {activeVideo.featured && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Featured Video</span>
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-mono text-white border border-white/10 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>{activeVideo.duration}</span>
                </div>

                {/* Big Center Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <motion.div 
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.6)] group-hover:shadow-[0_0_60px_rgba(220,38,38,0.85)] transition-all"
                  >
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                  </motion.div>
                  <p className="mt-3 text-xs sm:text-sm font-bold text-white tracking-wide drop-shadow-md bg-neutral-950/70 px-4 py-1.5 rounded-full border border-white/10">
                    Click to Play Embedded on Site
                  </p>
                </div>

                {/* Bottom Overlay Title on Poster */}
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                  <h4 className="text-base sm:text-lg font-bold text-white drop-shadow-md line-clamp-1">
                    {activeVideo.title}
                  </h4>
                  <p className="text-xs text-neutral-300 drop-shadow line-clamp-1 mt-0.5">
                    {activeVideo.description}
                  </p>
                </div>
              </div>
            ) : (
              /* Live Embedded YouTube Iframe */
              <div className="relative w-full h-full">
                <iframe
                  key={videoId}
                  src={embedUrl}
                  title={`YouTube Video: ${activeVideo.title}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={() => setIframeLoaded(true)}
                />
              </div>
            )}

            {/* Quick Prev / Next Overlay controls */}
            {showcaseVideos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevVideo();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  title="Previous Video"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextVideo();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  title="Next Video"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Under-Player Metadata & Toolbar */}
          <div className="mt-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-600/20 text-red-400 border border-red-500/30">
                  {activeVideo.category}
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  Release: {activeVideo.date}
                </span>
                {activeVideo.viewsCount && (
                  <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1 font-semibold">
                    <Eye className="w-3 h-3" />
                    <span>{activeVideo.viewsCount} views</span>
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {activeVideo.title}
              </h3>
            </div>

            {/* Toolbar Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy YouTube Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareVideo}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Share Video"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={handleOpenModal}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Watch in Video Modal"
              >
                <Tv className="w-3.5 h-3.5 text-blue-400" />
                <span>Popup View</span>
              </button>

              <a
                href={watchUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
              >
                <span>YouTube App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-3 px-2">
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {activeVideo.description}
            </p>
          </div>
        </div>

        {/* Right: Showcase Playlist / Related Videos Selector */}
        {showPlaylist && showcaseVideos.length > 0 && (
          <div className={isTheaterMode ? 'w-full' : 'lg:col-span-4'}>
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 font-mono">
                    Video Showcase Playlist
                  </span>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {showcaseVideos.length} Tracks
                </span>
              </div>

              {/* Playlist Items */}
              <div className={`space-y-2 overflow-y-auto pr-1 ${isTheaterMode ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 space-y-0 max-h-none' : 'max-h-[380px]'}`}>
                {showcaseVideos.map((vid, idx) => {
                  const isCurrent = vid.id === activeVideo.id;
                  const vidId = vid.youtubeEmbedId || extractYouTubeId(vid.youtubeUrl) || 'fJ9rUzIMcZQ';
                  const thumb = vid.thumbnail || getYouTubeThumbnail(vidId, 'hq');

                  return (
                    <div
                      key={vid.id}
                      onClick={() => handleSelectVideo(vid)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex gap-3 items-center group ${
                        isCurrent
                          ? 'bg-neutral-800 border-red-500/50 shadow-md ring-1 ring-red-500/30'
                          : 'bg-neutral-950/60 border-neutral-800/60 hover:bg-neutral-800/60 hover:border-neutral-700'
                      }`}
                    >
                      {/* Video Micro Thumbnail */}
                      <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-neutral-950 flex-shrink-0 border border-neutral-800">
                        <img 
                          src={thumb} 
                          alt={vid.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isCurrent ? 'bg-red-600/30 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}>
                          <Play className="w-3.5 h-3.5 fill-current text-white ml-0.5" />
                        </div>
                        <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[8px] font-mono text-white">
                          {vid.duration}
                        </span>
                      </div>

                      {/* Video Info */}
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[9px] font-mono font-bold uppercase ${isCurrent ? 'text-red-400' : 'text-neutral-400'}`}>
                            {vid.category}
                          </span>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-[9px] font-mono text-red-400 font-bold animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                              NOW EMBEDDED
                            </span>
                          )}
                        </div>
                        <h4 className={`text-xs font-bold line-clamp-1 transition-colors ${isCurrent ? 'text-white' : 'text-neutral-300 group-hover:text-amber-400'}`}>
                          {vid.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                          <span>{vid.date}</span>
                          {vid.viewsCount && <span>• {vid.viewsCount}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Channel Links */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Official YouTube</span>
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>youtube.com/@arjunbhartimina</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
