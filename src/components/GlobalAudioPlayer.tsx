import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { getYouTubeIdForSong, getYouTubeEmbedUrl, getYouTubeThumbnail } from '../utils/youtubeUtils';
import { hapticBeat, hapticLight, hapticSelection, hapticMedium } from '../utils/haptics';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  X, 
  Maximize2, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  FileText,
  Video,
  Tv,
  Disc,
  Radio,
  SlidersHorizontal,
  Minimize2
} from 'lucide-react';

export const GlobalAudioPlayer: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    playbackTime,
    duration,
    seekSong,
    togglePlay, 
    nextSong, 
    prevSong, 
    closePlayer, 
    openFullScreenPlayer,
    isFullScreenPlayerOpen,
    activePlayerView,
    activeVideo,
    volume,
    changeVolume,
    isMuted,
    toggleMute
  } = useStore();

  const [isPipMode, setIsPipMode] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Close player with Esc key if not in full-screen modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isFullScreenPlayerOpen && currentSong) {
        closePlayer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenPlayerOpen, currentSong, closePlayer]);

  // Reset loading state on song change
  useEffect(() => {
    setIsIframeLoaded(false);
  }, [currentSong?.id]);

  if (!currentSong) return null;

  const youtubeId = getYouTubeIdForSong(currentSong);
  const youtubeUrl = currentSong.streamingLinks?.youtube || `https://www.youtube.com/watch?v=${youtubeId}`;
  const highResThumb = getYouTubeThumbnail(youtubeId, 'hq') || currentSong.cover;
  
  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (playbackTime / duration) * 100)) : 0;

  // Handle seeking along progress bar
  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newRatio = clickX / rect.width;
    const newTime = newRatio * duration;
    hapticSelection();
    seekSong(newTime);
  };

  // Video embed parameters
  const isVideoActive = isPlaying && (!isFullScreenPlayerOpen || activePlayerView !== 'video') && !activeVideo;
  const embedUrl = getYouTubeEmbedUrl(youtubeId, {
    autoplay: isVideoActive,
    controls: true,
    mute: isMuted || volume === 0,
    start: Math.max(0, Math.floor(playbackTime))
  });

  return (
    <>
      {/* 1. YouTube Audio & Video Stream Engine */}
      {/* When in PiP mode: render as visible floating video window; otherwise hidden audio player */}
      <AnimatePresence>
        {isPipMode && !isFullScreenPlayerOpen && (
          <motion.div
            id="youtube-pip-window"
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-72 sm:w-80 rounded-2xl overflow-hidden shadow-2xl bg-neutral-950 border border-neutral-800 text-white"
          >
            {/* PiP Header Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-neutral-900 border-b border-neutral-800">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-bold truncate text-neutral-200">
                  {currentSong.title}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded hover:bg-neutral-800 text-red-500 hover:text-red-400 transition-colors"
                  title="Open YouTube video link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setIsPipMode(false)}
                  className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  title="Minimize Video"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Embedded YouTube Player */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                id="youtube-pip-iframe"
                src={embedUrl}
                title={`YouTube Video - ${currentSong.title}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden audio iframe stream when not in PiP mode */}
      {!isPipMode && isVideoActive && (
        <div className="fixed -top-96 -left-96 w-10 h-10 opacity-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <iframe
            id="youtube-audio-stream-frame"
            key={`${currentSong.id}-${isVideoActive ? 'active' : 'inactive'}`}
            src={embedUrl}
            title={`YouTube Stream - ${currentSong.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setIsIframeLoaded(true)}
          />
        </div>
      )}

      {/* 2. Redesigned Floating YouTube Music Miniplayer */}
      <AnimatePresence>
        {!isFullScreenPlayerOpen && (
          <motion.div 
            id="global-youtube-song-miniplayer"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            className="fixed bottom-16 sm:bottom-5 left-3 right-3 sm:left-6 sm:right-6 max-w-4xl mx-auto z-40 pointer-events-auto"
          >
            <div className="relative rounded-2xl sm:rounded-3xl bg-neutral-950/95 text-white border border-neutral-800 shadow-2xl backdrop-blur-2xl hover:border-neutral-700 transition-all overflow-hidden flex flex-col">
              
              {/* Interactive Scrubbable Progress Line across the top */}
              <div 
                ref={progressBarRef}
                onClick={handleSeekClick}
                className="w-full h-1.5 bg-neutral-800 hover:h-2.5 transition-all cursor-pointer relative group"
                title={`Seek: ${formatTime(playbackTime)} / ${formatTime(duration)}`}
              >
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500 relative transition-[width] duration-150 ease-out"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity scale-125" />
                </div>
              </div>

              {/* Main Player Row */}
              <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-3">
                
                {/* Left Column: YouTube Video Cover, Badge & Metadata */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                  {/* High-Res Thumbnail with Play State */}
                  <motion.button
                    id="miniplayer-art-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      hapticMedium();
                      openFullScreenPlayer('art');
                    }}
                    className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800 group focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md cursor-pointer"
                    title="Open Fullscreen Visualizer & Lyrics"
                  >
                    <img 
                      src={highResThumb} 
                      alt={currentSong.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Hover Expand Icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Maximize2 className="w-4 h-4 text-white drop-shadow" />
                    </div>

                    {/* Playing animated soundwave badge */}
                    {isPlaying && (
                      <div className="absolute bottom-1 right-1 flex items-end gap-0.5 bg-black/80 px-1 py-0.5 rounded">
                        <motion.span 
                          animate={{ height: ['4px', '12px', '4px'] }} 
                          transition={{ duration: 0.45, repeat: Infinity }}
                          className="w-0.5 bg-red-500 rounded-full" 
                        />
                        <motion.span 
                          animate={{ height: ['8px', '14px', '6px'] }} 
                          transition={{ duration: 0.55, repeat: Infinity, delay: 0.1 }}
                          className="w-0.5 bg-amber-400 rounded-full" 
                        />
                        <motion.span 
                          animate={{ height: ['5px', '11px', '3px'] }} 
                          transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
                          className="w-0.5 bg-red-500 rounded-full" 
                        />
                      </div>
                    )}
                  </motion.button>

                  {/* Title, Artist & YouTube Link Badge */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 hover:text-red-300 text-[10px] font-mono font-bold tracking-wider hover:bg-red-600/30 transition-colors"
                        title="Direct YouTube Video Song Link"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        <span>YouTube Video</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                      </a>
                      <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                        {formatTime(playbackTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div 
                      className="cursor-pointer group"
                      onClick={() => {
                        hapticMedium();
                        openFullScreenPlayer('art');
                      }}
                      title="Open Fullscreen Player"
                    >
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[280px] md:max-w-[340px]">
                        {currentSong.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[240px]">
                        {currentSong.artist} • {currentSong.genre}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center Column: Core Playback Controls */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <motion.button
                    id="miniplayer-prev-btn"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => {
                      hapticSelection();
                      prevSong();
                    }}
                    className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                    title="Previous Song"
                  >
                    <SkipBack className="w-4 h-4 fill-current" />
                  </motion.button>

                  <motion.button
                    id="miniplayer-play-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      hapticBeat();
                      togglePlay();
                    }}
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-900/30 transition-all font-bold cursor-pointer shrink-0"
                    title={isPlaying ? "Pause YouTube Song" : "Play YouTube Song"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                    )}
                  </motion.button>

                  <motion.button
                    id="miniplayer-next-btn"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => {
                      hapticSelection();
                      nextSong();
                    }}
                    className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                    title="Next Song"
                  >
                    <SkipForward className="w-4 h-4 fill-current" />
                  </motion.button>
                </div>

                {/* Right Column: YouTube Mode Switchers & Utility Actions */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  
                  {/* PiP Mini Video Mode Toggle */}
                  <motion.button
                    id="miniplayer-pip-toggle"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      hapticSelection();
                      setIsPipMode(!isPipMode);
                    }}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      isPipMode 
                        ? 'bg-red-600 text-white shadow' 
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800/80'
                    }`}
                    title={isPipMode ? "Hide Mini Video Window" : "Watch YouTube Video (PiP)"}
                  >
                    <Tv className="w-4 h-4" />
                    <span className="hidden md:inline text-[11px]">{isPipMode ? 'PiP Active' : 'Mini Video'}</span>
                  </motion.button>

                  {/* Synced Lyrics Button */}
                  <motion.button
                    id="miniplayer-lyrics-btn"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      hapticSelection();
                      openFullScreenPlayer('lyrics');
                    }}
                    className="hidden sm:flex p-2 rounded-xl text-neutral-300 hover:text-amber-400 hover:bg-neutral-800/80 transition-colors cursor-pointer items-center gap-1"
                    title="View Synced Lyrics"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-[11px] font-semibold hidden lg:inline">Lyrics</span>
                  </motion.button>

                  {/* Volume Control / Popup Toggle */}
                  <div className="relative hidden sm:block">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        hapticLight();
                        toggleMute();
                      }}
                      onMouseEnter={() => setShowVolumePopup(true)}
                      className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </motion.button>

                    {/* Quick Volume Slider Popover on Hover */}
                    <AnimatePresence>
                      {showVolumePopup && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          onMouseLeave={() => setShowVolumePopup(false)}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl flex items-center gap-2 z-50"
                        >
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => changeVolume(parseFloat(e.target.value))}
                            className="w-20 accent-red-500 cursor-pointer h-1.5 bg-neutral-700 rounded-lg"
                          />
                          <span className="text-[10px] font-mono text-neutral-300 w-6 text-right">
                            {Math.round((isMuted ? 0 : volume) * 100)}%
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Fullscreen Expand */}
                  <motion.button
                    id="miniplayer-expand-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      hapticMedium();
                      openFullScreenPlayer('art');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer shrink-0"
                    title="Open Fullscreen Visualizer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-xs">Expand</span>
                  </motion.button>

                  {/* Direct YouTube Video Link */}
                  <motion.a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => hapticLight()}
                    className="p-2 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                    title="Watch directly on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>

                  {/* Close / Dismiss Player */}
                  <motion.button
                    id="miniplayer-close-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      hapticLight();
                      closePlayer();
                    }}
                    className="p-2 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                    title="Close Player (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>

                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
