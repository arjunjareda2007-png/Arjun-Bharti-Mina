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
  Youtube, 
  ListMusic, 
  Sparkles,
  Tv,
  Music,
  Radio,
  Disc3
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
    showToast
  } = useStore();

  // Mode: 'bar' (compact bottom player) | 'theater' (expanded floating video screen)
  const [playerLayout, setPlayerLayout] = useState<'bar' | 'theater'>('bar');
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [showPlaylistDrawer, setShowPlaylistDrawer] = useState<boolean>(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName) || target?.isContentEditable) {
        return;
      }

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

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (playbackTime / duration) * 100)) : 0;

  // Handle Seek from pointer / touch
  const handleSeekFromEvent = (clientX: number) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const ratio = clickX / rect.width;
    const targetSeconds = ratio * duration;
    seekSong(targetSeconds);
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    hapticSelection();
    handleSeekFromEvent(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    if (e.touches.length > 0) {
      handleSeekFromEvent(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isScrubbing && e.touches.length > 0) {
      handleSeekFromEvent(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsScrubbing(false);
  };

  // Launch audio from floating launcher if idle
  const handleLaunchFirstSong = () => {
    hapticSuccess();
    if (songs && songs.length > 0) {
      const featured = songs.find(s => s.featured) || songs[0];
      playSong(featured);
      showToast(`Playing "${featured.title}"`, 'success');
    }
  };

  // If no song is active, show the quick-access floating audio launcher dock
  if (!currentSong) {
    if (!songs || songs.length === 0) return null;
    return (
      <div 
        id="miniplayer-quick-launcher-container"
        className="fixed z-40 bottom-20 lg:bottom-6 right-4 sm:right-6 pointer-events-auto"
      >
        <motion.button
          id="miniplayer-quick-launcher-btn"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleLaunchFirstSong}
          className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-neutral-900/95 hover:bg-neutral-900 text-white border border-amber-500/40 shadow-xl shadow-amber-500/10 backdrop-blur-md cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          aria-label="Open Music Miniplayer"
          title="Play Arjun's Music (Miniplayer)"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 flex items-center justify-center shadow-md">
            <Disc3 className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="flex flex-col text-left pr-1 hidden sm:flex">
            <span className="text-[11px] font-bold text-white leading-tight flex items-center gap-1">
              Music Miniplayer
              <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
            <span className="text-[10px] text-neutral-400 leading-tight truncate max-w-[120px]">
              {songs[0]?.title || 'Play tracks'}
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-colors">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        </motion.button>
      </div>
    );
  }

  const youtubeId = getYouTubeIdForSong(currentSong);
  const youtubeWatchUrl = getYouTubeWatchUrl(currentSong);
  const youtubeThumbnail = getYouTubeThumbnail(youtubeId, 'hq') || currentSong.cover;

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
        role="region"
        aria-label="YouTube Song Audio Miniplayer"
        className={`fixed z-50 inset-x-0 pointer-events-none transition-all duration-300 ${
          playerLayout === 'theater' 
            ? 'bottom-16 lg:bottom-4' 
            : 'bottom-16 sm:bottom-16 lg:bottom-2'
        }`}
      >
        {/* ======================================================== */}
        {/* 1. EXPANDED THEATER / FLOATING VIDEO MODE               */}
        {/* ======================================================== */}
        {playerLayout === 'theater' && (
          <div className="pointer-events-auto p-2 sm:p-4 flex justify-center items-end max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="w-full max-w-2xl bg-neutral-950/98 text-white border border-neutral-800 rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-2xl space-y-3 relative overflow-hidden ring-1 ring-white/10"
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
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Minimize to Bottom Bar"
                    aria-label="Minimize to Bottom Bar"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      hapticLight();
                      closePlayer();
                    }}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-colors cursor-pointer"
                    title="Close Player"
                    aria-label="Close Player"
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
                    className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                    title="Previous Video Track"
                    aria-label="Previous Video Track"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      hapticBeat();
                      togglePlay();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all min-h-[40px]"
                    aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={() => {
                      hapticLight();
                      nextSong();
                    }}
                    className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                    title="Next Video Track"
                    aria-label="Next Video Track"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowPlaylistDrawer(!showPlaylistDrawer)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px] ${
                      showPlaylistDrawer ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
                    }`}
                    aria-label="Toggle Playlist"
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
                    className="px-3 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[40px]"
                  >
                    <Youtube className="w-3.5 h-3.5 fill-current" />
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => {
                      hapticLight();
                      openFullScreenPlayer();
                    }}
                    className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                    title="Full Screen Theater"
                    aria-label="Full Screen Theater"
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
                        className={`w-full py-2 px-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
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
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="pointer-events-auto w-full max-w-5xl mx-auto px-2 sm:px-4"
          >
            <div className="relative bg-neutral-950/95 text-white border border-neutral-800/90 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-2xl overflow-hidden ring-1 ring-white/10">
              
              {/* Scrubbable Top Progress Bar with touch & click support */}
              <div 
                ref={progressBarRef}
                onClick={handleSeekClick}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="absolute top-0 inset-x-0 h-1.5 sm:h-2 bg-neutral-900 hover:h-2.5 transition-all cursor-pointer group"
                title="Click or drag to seek video"
                role="progressbar"
                aria-valuenow={Math.round(progressPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 sm:gap-4 mt-1">
                
                {/* Left: Embedded Mini Video Screen & Song Details */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  {/* Interactive Mini Video Screen */}
                  <button 
                    type="button"
                    onClick={() => {
                      hapticBeat();
                      setPlayerLayout('theater');
                    }}
                    className="relative w-12 h-10 sm:w-20 sm:h-12 rounded-xl overflow-hidden bg-black border border-neutral-800 shrink-0 cursor-pointer group shadow-md text-left focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    title="Click to expand YouTube video theater"
                    aria-label="Expand YouTube Video Theater"
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
                    <span className="absolute bottom-0.5 right-1 text-[8px] font-mono px-1 rounded bg-black/80 text-amber-400 font-bold">
                      YT
                    </span>
                  </button>

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
                    className="p-2 sm:p-2.5 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
                    title="Previous Song"
                    aria-label="Previous Song"
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
                    aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
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
                    className="p-2 sm:p-2.5 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
                    title="Next Song"
                    aria-label="Next Song"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Actions & Expand Controls */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  
                  {/* Direct YouTube Link Badge */}
                  <a
                    href={youtubeWatchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors min-h-[36px]"
                    title="Open in YouTube"
                    aria-label="Open in YouTube"
                  >
                    <Youtube className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[11px]">YouTube</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>

                  {/* Volume Button & Flyout */}
                  <div className="relative hidden sm:block">
                    <button
                      onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                      className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title="Volume Control"
                      aria-label="Volume Control"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    {showVolumeSlider && (
                      <div className="absolute bottom-full right-0 mb-2 p-3 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex items-center gap-2 w-36 z-50">
                        <button onClick={toggleMute} className="text-neutral-400 hover:text-white" aria-label="Toggle Mute">
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
                          aria-label="Volume Slider"
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
                    className="p-2 sm:p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                    title="Expand Video Theater"
                    aria-label="Expand Video Theater"
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
                    className="p-2 sm:p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer hidden xs:flex min-w-[36px] min-h-[36px] items-center justify-center"
                    title="Fullscreen Player Modal"
                    aria-label="Fullscreen Player Modal"
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
                    className="p-2 sm:p-2.5 rounded-xl hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer ml-0.5 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    title="Close Song Player"
                    aria-label="Close Song Player"
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
