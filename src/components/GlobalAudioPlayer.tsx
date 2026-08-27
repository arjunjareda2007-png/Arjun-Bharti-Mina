import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { getYouTubeIdForSong, getYouTubeEmbedUrl } from '../utils/youtubeUtils';
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
  Video
} from 'lucide-react';

export const GlobalAudioPlayer: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    playbackTime,
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

  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Close player with Esc if not in fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isFullScreenPlayerOpen && currentSong) {
        closePlayer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenPlayerOpen, currentSong, closePlayer]);

  // Reset iframe status on song change
  useEffect(() => {
    setIsIframeLoaded(false);
  }, [currentSong?.id]);

  if (!currentSong) return null;

  const youtubeId = getYouTubeIdForSong(currentSong);
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
  
  // Background audio is active only when playing AND not currently watching video tab in fullscreen or standalone video modal
  const isBackgroundAudioActive = isPlaying && (!isFullScreenPlayerOpen || activePlayerView !== 'video') && !activeVideo;

  // YouTube background embed url with synchronized timestamp
  const backgroundEmbedUrl = getYouTubeEmbedUrl(youtubeId, {
    autoplay: isBackgroundAudioActive,
    controls: false,
    mute: isMuted || volume === 0,
    start: Math.max(0, Math.floor(playbackTime))
  });

  return (
    <>
      {/* Background YouTube Audio Streamer iframe - only plays when video mode is inactive */}
      {isBackgroundAudioActive && (
        <div className="fixed -top-96 -left-96 w-10 h-10 opacity-0 pointer-events-none overflow-hidden">
          <iframe
            id="youtube-audio-stream-frame"
            key={`${currentSong.id}-${isBackgroundAudioActive ? 'active' : 'inactive'}`}
            src={backgroundEmbedUrl}
            title={`YouTube Stream - ${currentSong.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setIsIframeLoaded(true)}
          />
        </div>
      )}

      {/* Tiny Floating YouTube Music Player Bar (With Motion & Haptic Feedback) */}
      <AnimatePresence>
        {!isFullScreenPlayerOpen && (
          <motion.div 
            id="global-youtube-tiny-player"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-16 sm:bottom-4 left-2 right-2 sm:left-6 sm:right-6 max-w-5xl mx-auto z-40 pointer-events-auto"
          >
            <div className="flex items-center justify-between gap-1.5 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-2xl bg-neutral-950/95 text-white border border-neutral-800 shadow-2xl backdrop-blur-xl hover:border-neutral-700 transition-all overflow-hidden">
              
              {/* Left: Thumbnail & Song Details with Motion */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <motion.button
                  id="tiny-player-thumbnail-btn"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    hapticMedium();
                    openFullScreenPlayer('art');
                  }}
                  className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800 group focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md cursor-pointer"
                  title="Click thumbnail to open Full Screen Player with visualizer & lyrics"
                >
                  <img 
                    src={currentSong.cover} 
                    alt={currentSong.title} 
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                  
                  {/* Floating expand overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Maximize2 className="w-4 h-4 text-white drop-shadow" />
                  </div>

                  {/* Animated Sound Wave Bars when Playing */}
                  {isPlaying && (
                    <div className="absolute bottom-1 right-1 flex items-end gap-0.5 bg-black/70 px-1 py-0.5 rounded">
                      <motion.span 
                        animate={{ height: ['4px', '12px', '4px'] }} 
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-0.5 bg-amber-400 rounded-full" 
                      />
                      <motion.span 
                        animate={{ height: ['8px', '14px', '6px'] }} 
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                        className="w-0.5 bg-red-400 rounded-full" 
                      />
                      <motion.span 
                        animate={{ height: ['5px', '11px', '3px'] }} 
                        transition={{ duration: 0.45, repeat: Infinity, delay: 0.2 }}
                        className="w-0.5 bg-amber-400 rounded-full" 
                      />
                    </div>
                  )}
                </motion.button>

                <div 
                  className="min-w-0 cursor-pointer group flex-1"
                  onClick={() => {
                    hapticMedium();
                    openFullScreenPlayer('art');
                  }}
                  title="Open Fullscreen Player"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-wider hidden xs:inline">
                      ABM Player
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono hidden md:inline">• {currentSong.duration}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate max-w-[110px] xs:max-w-[150px] sm:max-w-[220px]">
                    {currentSong.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 truncate max-w-[100px] xs:max-w-[140px] sm:max-w-[180px]">
                    {currentSong.artist}
                  </p>
                </div>
              </div>

              {/* Center: Controls with Haptics & Springs */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <motion.button
                  id="tiny-player-prev-btn"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => {
                    hapticSelection();
                    prevSong();
                  }}
                  className="p-1.5 sm:p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </motion.button>

                <motion.button
                  id="tiny-player-play-btn"
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => {
                    hapticBeat();
                    togglePlay();
                  }}
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg transition-all font-bold cursor-pointer shrink-0"
                  title={isPlaying ? "Pause Song" : "Play Song"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                  )}
                </motion.button>

                <motion.button
                  id="tiny-player-next-btn"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => {
                    hapticSelection();
                    nextSong();
                  }}
                  className="p-1.5 sm:p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </motion.button>
              </div>

              {/* Right: Quick Lyrics, Video, Fullscreen Expand & Exit */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                
                {/* Lyrics Quick Action */}
                <motion.button
                  id="tiny-player-lyrics-btn"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    hapticSelection();
                    openFullScreenPlayer('lyrics');
                  }}
                  className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-neutral-300 hover:text-amber-400 hover:bg-white/10 transition-colors cursor-pointer items-center gap-1"
                  title="View Synced Lyrics"
                >
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[11px] font-semibold hidden md:inline">Lyrics</span>
                </motion.button>

                {/* Video Quick Action */}
                <motion.button
                  id="tiny-player-video-btn"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    hapticSelection();
                    openFullScreenPlayer('video');
                  }}
                  className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-neutral-300 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer items-center gap-1"
                  title="Watch Official Video"
                >
                  <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[11px] font-semibold hidden md:inline">Video</span>
                </motion.button>

                {/* Volume Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    hapticLight();
                    toggleMute();
                  }}
                  className="hidden lg:flex p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </motion.button>

                {/* Fullscreen Expand Button */}
                <motion.button
                  id="tiny-player-fullscreen-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    hapticMedium();
                    openFullScreenPlayer('art');
                  }}
                  className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer shrink-0"
                  title="Open Full Screen Player with visualizer & lyrics"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs">Expand</span>
                </motion.button>

                {/* Direct YouTube Link (on medium+ screens) */}
                <motion.a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => hapticLight()}
                  className="hidden md:flex p-2 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Open on YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </motion.a>

                {/* Exit Player Button */}
                <motion.button
                  id="tiny-player-exit-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    hapticLight();
                    closePlayer();
                  }}
                  className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                  title="Exit Player (Esc)"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.button>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
