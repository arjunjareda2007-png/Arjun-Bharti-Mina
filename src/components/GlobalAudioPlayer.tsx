import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { getYouTubeIdForSong, getYouTubeEmbedUrl } from '../utils/youtubeUtils';
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
  Radio
} from 'lucide-react';

export const GlobalAudioPlayer: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    nextSong, 
    prevSong, 
    closePlayer, 
    openFullScreenPlayer,
    isFullScreenPlayerOpen,
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
  
  // YouTube background embed url
  const backgroundEmbedUrl = getYouTubeEmbedUrl(youtubeId, {
    autoplay: isPlaying,
    controls: false,
    mute: isMuted || volume === 0
  });

  return (
    <>
      {/* Background YouTube Audio Streamer iframe (hidden or tiny container to maintain site playback) */}
      <div className="fixed -top-96 -left-96 w-10 h-10 opacity-0 pointer-events-none overflow-hidden">
        <iframe
          id="youtube-audio-stream-frame"
          key={`${currentSong.id}-${isPlaying ? 'play' : 'pause'}`}
          src={backgroundEmbedUrl}
          title={`YouTube Stream - ${currentSong.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={() => setIsIframeLoaded(true)}
        />
      </div>

      {/* Tiny Floating YouTube Music Player Bar (Like Spotify Mini Bar) */}
      {!isFullScreenPlayerOpen && (
        <div 
          id="global-youtube-tiny-player"
          className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 max-w-5xl mx-auto z-40 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-neutral-950/95 text-white border border-neutral-800 shadow-2xl backdrop-blur-xl hover:border-neutral-700 transition-all">
            
            {/* Left: Thumbnail (Click opens Full Screen Player) & Song Details */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
              <button
                id="tiny-player-thumbnail-btn"
                onClick={openFullScreenPlayer}
                className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800 group focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md hover:scale-105 transition-transform"
                title="Click thumbnail to open Full Screen Player with advance features"
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
                  <div className="absolute bottom-1 right-1 flex items-end gap-0.5 bg-black/60 px-1 py-0.5 rounded">
                    <span className="w-0.5 h-2 bg-amber-400 animate-pulse" />
                    <span className="w-0.5 h-3 bg-red-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-1.5 bg-amber-400 animate-pulse delay-150" />
                  </div>
                )}
              </button>

              <div 
                className="min-w-0 cursor-pointer group"
                onClick={openFullScreenPlayer}
                title="Open Fullscreen Player"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                  <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-wider hidden xs:inline">
                    YT Music
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono hidden md:inline">• {currentSong.duration}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate max-w-[140px] sm:max-w-[220px]">
                  {currentSong.title}
                </h4>
                <p className="text-[11px] text-neutral-400 truncate max-w-[130px] sm:max-w-[180px]">
                  {currentSong.artist}
                </p>
              </div>
            </div>

            {/* Center: Previous, Play / Pause, Next */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                id="tiny-player-prev-btn"
                onClick={prevSong}
                className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              <button
                id="tiny-player-play-btn"
                onClick={togglePlay}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? "Pause Song" : "Play Song"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                id="tiny-player-next-btn"
                onClick={nextSong}
                className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Right: Fullscreen Expand, Volume, YouTube Link & Exit Button */}
            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Volume Button for Quick Toggle */}
              <button
                onClick={toggleMute}
                className="hidden lg:flex p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Fullscreen Player Mode Button */}
              <button
                id="tiny-player-fullscreen-btn"
                onClick={openFullScreenPlayer}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all hover:scale-105 shadow-sm"
                title="Open Full Screen Player with visualizer, lyrics & advanced features"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Expand</span>
              </button>

              {/* Direct YouTube Link */}
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Open on YouTube"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Exit Player Button */}
              <button
                id="tiny-player-exit-btn"
                onClick={closePlayer}
                className="p-2 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Exit Player (Esc)"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
