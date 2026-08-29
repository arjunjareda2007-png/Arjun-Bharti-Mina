import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { 
  getYouTubeIdForSong, 
  getYouTubeEmbedUrl, 
  getYouTubeThumbnail, 
  getYouTubeWatchUrl 
} from '../utils/youtubeUtils';
import { hapticBeat, hapticLight, hapticSelection, hapticSuccess } from '../utils/haptics';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  X, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Video, 
  Youtube, 
  ListMusic, 
  Sparkles,
  Tv,
  Share2
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
    activeVideo,
    songs,
    playSong,
    volume,
    changeVolume,
    isMuted,
    toggleMute,
    showToast,
    openShare
  } = useStore();

  // Mode: 'bar' (compact bottom player) | 'theater' (expanded floating video screen)
  const [playerLayout, setPlayerLayout] = useState<'bar' | 'theater'>('bar');
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [showPlaylistDrawer, setShowPlaylistDrawer] = useState<boolean>(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Close player or collapse on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isFullScreenPlayerOpen && currentSong) {
        if (playerLayout === 'theater') {
          setPlayerLayout('bar');
        } else {
          closePlayer();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenPlayerOpen, currentSong, playerLayout, closePlayer]);

  if (!currentSong) return null;

  const youtubeId = getYouTubeIdForSong(currentSong);
  const youtubeWatchUrl = getYouTubeWatchUrl(currentSong);
  const youtubeThumbnail = getYouTubeThumbnail(youtubeId, 'hq') || currentSong.cover;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (playbackTime / duration) * 100)) : 0;

  // Progress Bar Seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = clickX / rect.width;
    const targetSeconds = ratio * duration;
    hapticSelection();
    seekSong(targetSeconds);
  };

  // Build YouTube Embed URL - automatically plays video when song is selected
  const shouldAutoplay = isPlaying && !activeVideo && !isFullScreenPlayerOpen;
  const embedSrc = getYouTubeEmbedUrl(youtubeId, {
    autoplay: shouldAutoplay,
    controls: true,
    mute: isMuted || volume === 0,
    start: Math.max(0, Math.floor(playbackTime))
  });

  return (
    <AnimatePresence>
      <div 
        id="youtube-song-miniplayer" 
        className="fixed z-40 inset-x-0 bottom-0 pointer-events-none"
      >
        {/* ======================================================== */}
        {/* 1. EXPANDED THEATER / FLOATING VIDEO MODE               */}
        {/* ======================================================== */}
        {playerLayout === 'theater' && (
          <div className="pointer-events-auto p-3 sm:p-4 flex justify-center items-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="w-full max-w-2xl bg-neutral-950/95 text-white border border-neutral-800 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl space-y-3 relative overflow-hidden"
            >
              {/* Header with Title & Collapse */}
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-neutral-800/80">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="px-2 py-0.5 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold uppercase flex items-center gap-1 shrink-0">
                    <Youtube className="w-3 h-3 fill-current" />
                    <span>YouTube Video</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {currentSong.title}
                  </h3>
                  <span className="text-xs text-neutral-400 truncate hidden sm:inline">
                    • {currentSong.artist}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      hapticLight();
                      setPlayerLayout('bar');
                    }}
                    className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Minimize to Bottom Bar"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      hapticLight();
                      closePlayer();
                    }}
                    className="p-1.5 rounded-xl bg-neutral-900 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-colors cursor-pointer"
                    title="Close Player"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* High-Definition Embedded YouTube Video Frame */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-xl">
                <iframe
                  key={`theater-${youtubeId}`}
                  src={embedSrc}
                  title={`${currentSong.title} - YouTube Music Video`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Theater Controls & Playlist Switcher */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      hapticLight();
                      prevSong();
                    }}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors cursor-pointer"
                    title="Previous Video Track"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      hapticBeat();
                      togglePlay();
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={() => {
                      hapticLight();
                      nextSong();
                    }}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors cursor-pointer"
                    title="Next Video Track"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowPlaylistDrawer(!showPlaylistDrawer)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      showPlaylistDrawer ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <ListMusic className="w-3.5 h-3.5" />
                    <span>Songs ({songs.length})</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <a
                    href={youtubeWatchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => {
                      hapticLight();
                      openFullScreenPlayer();
                    }}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Full Screen Theater"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fast Song Selector Drawer in Theater Mode */}
              {showPlaylistDrawer && (
                <div className="pt-2 max-h-40 overflow-y-auto space-y-1 divide-y divide-neutral-900">
                  {songs.map((s, idx) => {
                    const isSelected = s.id === currentSong.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          hapticLight();
                          playSong(s);
                        }}
                        className={`w-full py-1.5 px-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                          isSelected ? 'bg-amber-500/15 text-amber-300 font-bold' : 'hover:bg-neutral-900 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[11px] font-mono text-neutral-500">#{idx + 1}</span>
                          <span className="text-xs truncate">{s.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                          <span>{s.duration}</span>
                          {isSelected && <Sparkles className="w-3 h-3 text-amber-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. COMPACT FLOATING BOTTOM MINIPLAYER BAR (DEFAULT)     */}
        {/* ======================================================== */}
        {playerLayout === 'bar' && (
          <motion.div
            id="youtube-song-miniplayer-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="pointer-events-auto w-full max-w-5xl mx-auto px-2 sm:px-4 pb-2 sm:pb-3"
          >
            <div className="relative bg-neutral-950/95 text-white border border-neutral-800/90 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-2xl overflow-hidden">
              
              {/* Scrubbable Top Progress Bar */}
              <div 
                ref={progressBarRef}
                onClick={handleSeek}
                className="absolute top-0 inset-x-0 h-1.5 bg-neutral-900 hover:h-2 transition-all cursor-pointer group"
                title="Click to seek song video"
              >
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 sm:gap-4 mt-0.5">
                
                {/* Left: Embedded Mini Video Screen & Song Details */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  {/* Interactive Mini Video Screen */}
                  <div 
                    onClick={() => {
                      hapticBeat();
                      setPlayerLayout('theater');
                    }}
                    className="relative w-14 h-10 sm:w-20 sm:h-12 rounded-xl overflow-hidden bg-black border border-neutral-800 shrink-0 cursor-pointer group shadow-md"
                    title="Click to expand YouTube video theater"
                  >
                    <img 
                      src={youtubeThumbnail} 
                      alt={currentSong.title} 
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300 opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                        {isPlaying ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        ) : (
                          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                        )}
                      </div>
                    </div>
                    <span className="absolute bottom-0.5 right-1 text-[8px] font-mono px-1 rounded bg-black/80 text-amber-400">
                      YT
                    </span>
                  </div>

                  {/* Title & Artist & Live Tag */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-red-600/20 border border-red-500/30 text-red-400 font-mono text-[9px] font-bold uppercase inline-flex items-center gap-0.5">
                        <Youtube className="w-2.5 h-2.5 fill-current" />
                        <span>Song Video</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
                        {formatTime(playbackTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <h4 
                      onClick={() => setPlayerLayout('theater')}
                      className="text-xs sm:text-sm font-bold text-white hover:text-amber-400 transition-colors truncate cursor-pointer"
                    >
                      {currentSong.title}
                    </h4>

                    <p className="text-[11px] text-neutral-400 truncate">
                      {currentSong.artist} {currentSong.year ? `• ${currentSong.year}` : ''}
                    </p>
                  </div>
                </div>

                {/* Center & Playback Controls */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <button
                    id="miniplayer-prev-btn"
                    onClick={() => {
                      hapticLight();
                      prevSong();
                    }}
                    className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Previous Song"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    id="miniplayer-play-toggle-btn"
                    onClick={() => {
                      hapticBeat();
                      togglePlay();
                    }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-neutral-950 flex items-center justify-center shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                    title={isPlaying ? 'Pause Video' : 'Play Video'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    id="miniplayer-next-btn"
                    onClick={() => {
                      hapticLight();
                      nextSong();
                    }}
                    className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Next Song"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Actions & Expand Controls */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  
                  {/* Direct YouTube Link Badge */}
                  <a
                    href={youtubeWatchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors"
                    title="Open in YouTube"
                  >
                    <Youtube className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[11px]">YouTube</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>

                  {/* Volume Button & Flyout */}
                  <div className="relative hidden sm:block">
                    <button
                      onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                      className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      title="Volume"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    {showVolumeSlider && (
                      <div className="absolute bottom-full right-0 mb-2 p-3 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center gap-2 w-36">
                        <button onClick={toggleMute} className="text-neutral-400 hover:text-white">
                          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => changeVolume(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Theater Mode Expand Button */}
                  <button
                    id="miniplayer-theater-btn"
                    onClick={() => {
                      hapticLight();
                      setPlayerLayout('theater');
                    }}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Expand Video Theater"
                  >
                    <Tv className="w-4 h-4 text-amber-400" />
                  </button>

                  {/* Fullscreen Modal View */}
                  <button
                    id="miniplayer-fullscreen-btn"
                    onClick={() => {
                      hapticLight();
                      openFullScreenPlayer();
                    }}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer hidden xs:block"
                    title="Fullscreen Player Modal"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Close Miniplayer Button */}
                  <button
                    id="miniplayer-close-btn"
                    onClick={() => {
                      hapticLight();
                      closePlayer();
                    }}
                    className="p-2 rounded-xl hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer ml-0.5"
                    title="Close Song Player"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
