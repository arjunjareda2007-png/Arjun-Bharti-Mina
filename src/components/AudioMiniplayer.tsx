import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { Play, Pause, SkipBack, SkipForward, X, Music } from 'lucide-react';
import { formatTime } from '../utils/helpers';
import { hapticLight, hapticMedium } from '../utils/haptics';

export const AudioMiniplayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    prevSong,
    nextSong,
    closePlayer,
    playbackTime,
    duration,
    seekSong
  } = useStore();

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? Math.min(100, (playbackTime / duration) * 100) : 0;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekSong(ratio * (duration || 200));
  };

  return (
    <AnimatePresence>
      <motion.aside
        id="owner-audio-miniplayer"
        aria-label="Audio Miniplayer"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-50 sm:w-[420px] max-w-[calc(100vw-24px)] bg-neutral-950/95 text-white border border-neutral-800/90 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden ring-1 ring-white/10"
      >
        {/* Subtle Interactive Progress Timeline */}
        <div
          onClick={handleProgressBarClick}
          className="relative w-full h-1.5 bg-neutral-800/80 hover:h-2 cursor-pointer transition-all group"
          title={`Seek: ${formatTime(playbackTime)} / ${formatTime(duration)}`}
        >
          <div
            className="h-full bg-amber-500 transition-[width] duration-150 relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="p-2.5 sm:p-3 flex items-center justify-between gap-3">
          {/* Track Artwork & Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/10 shadow-sm">
              {currentSong.cover ? (
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-500">
                  <Music className="w-5 h-5" />
                </div>
              )}

              {/* Playing Equalizer Indicator */}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-end justify-center gap-0.5 pb-1 px-1">
                  <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2.5" />
                  <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.15s] h-4" />
                  <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.3s] h-2" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate tracking-tight">
                {currentSong.title}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 truncate">
                <span className="truncate">{currentSong.artist}</span>
                {currentSong.audioFileName && (
                  <>
                    <span>•</span>
                    <span className="text-[10px] font-mono text-amber-400/90 truncate max-w-[110px]" title={currentSong.audioFileName}>
                      {currentSong.audioFileName}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controls: Play/Pause, Previous, Next, and Tiny Cross to Exit */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Previous */}
            <button
              type="button"
              onClick={() => {
                hapticLight();
                prevSong();
              }}
              title="Previous Track"
              className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause */}
            <button
              type="button"
              onClick={() => {
                hapticMedium();
                togglePlay();
              }}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 active:scale-90 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={() => {
                hapticLight();
                nextSong();
              }}
              title="Next Track"
              className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Tiny Cross Icon to Exit Miniplayer */}
            <button
              type="button"
              onClick={() => {
                hapticLight();
                closePlayer();
              }}
              title="Exit Miniplayer"
              className="p-1 sm:p-1.5 rounded-full text-neutral-500 hover:text-white hover:bg-red-500/20 active:scale-90 transition-all ml-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
