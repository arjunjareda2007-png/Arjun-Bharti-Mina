import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatTime } from '../utils/helpers';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  FileText, 
  Share2, 
  ExternalLink, 
  X, 
  Maximize2,
  Minimize2,
  Radio
} from 'lucide-react';

export const GlobalAudioPlayer: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    playbackTime, 
    duration, 
    volume, 
    isMuted, 
    togglePlay, 
    seekSong, 
    nextSong, 
    prevSong, 
    changeVolume, 
    toggleMute,
    openShare,
    setCurrentTab,
    setSelectedSongId,
    setSelectedLyricId
  } = useStore();

  const [showLyricsDrawer, setShowLyricsDrawer] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showStreamingMenu, setShowStreamingMenu] = useState(false);

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (playbackTime / duration) * 100 : 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekSong((val / 100) * duration);
  };

  const handleShareCurrentSong = () => {
    openShare({
      title: `${currentSong.title} — Arjun Bharti Mina`,
      text: `Listen to "${currentSong.title}" by Arjun Bharti Mina on his official archive.`,
      url: window.location.href
    });
  };

  return (
    <>
      {/* Floating Mini Player / Bar */}
      <div 
        id="global-audio-player"
        className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
          isMinimized ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
        }`}
      >
        {/* Minimize / Expand tab */}
        <div className="flex justify-end max-w-7xl mx-auto px-4">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 px-3 py-1 text-[10px] font-mono font-medium rounded-t-md border-t border-x border-neutral-700 dark:border-neutral-300 flex items-center gap-1 shadow-lg hover:bg-amber-600 transition-colors"
          >
            {isMinimized ? (
              <>
                <Maximize2 className="w-3 h-3" />
                <span>EXPAND PLAYER ({currentSong.title})</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3 h-3" />
                <span>MINIMIZE</span>
              </>
            )}
          </button>
        </div>

        {/* Player Container */}
        <div className="bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 shadow-2xl px-4 py-2.5 sm:px-6">
          
          {/* Top Scrubber Bar */}
          <div className="relative group mb-2 -mt-1 cursor-pointer">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progressPercent || 0}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:h-2 transition-all"
            />
          </div>

          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
            
            {/* Left: Track Info & Artwork */}
            <div className="flex items-center gap-3 min-w-0 max-w-[40%] sm:max-w-xs">
              <div className="relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800 shadow-sm bg-neutral-900 group">
                <img 
                  src={currentSong.cover} 
                  alt={currentSong.title} 
                  className="w-full h-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-end justify-center gap-0.5 pb-1">
                    <span className="w-0.5 bg-amber-400 animate-wave-1 rounded-full"></span>
                    <span className="w-0.5 bg-amber-400 animate-wave-2 rounded-full"></span>
                    <span className="w-0.5 bg-amber-400 animate-wave-3 rounded-full"></span>
                    <span className="w-0.5 bg-amber-400 animate-wave-4 rounded-full"></span>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 
                    onClick={() => {
                      setCurrentTab('music');
                      setSelectedSongId(currentSong.id);
                    }}
                    className="text-xs sm:text-sm font-semibold truncate cursor-pointer hover:text-amber-500 transition-colors text-neutral-900 dark:text-neutral-100"
                  >
                    {currentSong.title}
                  </h4>
                  <span className="hidden md:inline-block px-1.5 py-0.2 text-[9px] font-mono uppercase bg-neutral-100 dark:bg-neutral-900 text-neutral-500 rounded border border-neutral-200 dark:border-neutral-800">
                    {currentSong.year}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {currentSong.artist} • <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400">{currentSong.genre.split('/')[0]}</span>
                </p>
              </div>
            </div>

            {/* Center: Controls & Time */}
            <div className="flex flex-col items-center gap-1 flex-1 max-w-sm">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={prevSong}
                  className="p-1.5 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  title="Previous Song"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={nextSong}
                  className="p-1.5 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  title="Next Song"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                <span>{formatTime(playbackTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right: Actions, Lyrics, Volume, Streaming links */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Lyrics Drawer Toggle */}
              <button
                onClick={() => setShowLyricsDrawer(!showLyricsDrawer)}
                className={`p-2 rounded-full transition-colors flex items-center gap-1 text-xs ${
                  showLyricsDrawer 
                    ? 'bg-amber-500 text-neutral-950 font-semibold' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
                title="View Lyrics"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden lg:inline text-[11px]">Lyrics</span>
              </button>

              {/* Streaming Links Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStreamingMenu(!showStreamingMenu)}
                  className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                  title="Streaming Platforms"
                >
                  <Radio className="w-4 h-4" />
                </button>

                {showStreamingMenu && (
                  <div className="absolute bottom-12 right-0 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-[10px] font-mono uppercase text-neutral-400 px-2 py-1">Listen On</p>
                    {currentSong.streamingLinks.spotify && (
                      <a 
                        href={currentSong.streamingLinks.spotify} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                      >
                        <span>Spotify</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400" />
                      </a>
                    )}
                    {currentSong.streamingLinks.youtube && (
                      <a 
                        href={currentSong.streamingLinks.youtube} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                      >
                        <span>YouTube Music</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400" />
                      </a>
                    )}
                    {currentSong.streamingLinks.jiosaavn && (
                      <a 
                        href={currentSong.streamingLinks.jiosaavn} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                      >
                        <span>JioSaavn</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Share */}
              <button
                onClick={handleShareCurrentSong}
                className="hidden sm:block p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                title="Share Song"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={toggleMute}
                  className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none accent-amber-500 cursor-pointer"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Floating Synced Lyrics Drawer */}
      {showLyricsDrawer && (
        <div 
          id="lyrics-quick-drawer"
          className="fixed bottom-20 right-4 sm:right-8 z-50 w-full max-w-sm sm:max-w-md bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-5 max-h-[70vh] flex flex-col animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 mb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-500 font-semibold tracking-wider block">Official Lyrics</span>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{currentSong.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentTab('lyrics');
                  setSelectedLyricId(`lyric-${currentSong.slug}`);
                  setShowLyricsDrawer(false);
                }}
                className="text-xs text-neutral-500 hover:text-amber-500 transition-colors font-medium underline"
              >
                Full View
              </button>
              <button 
                onClick={() => setShowLyricsDrawer(false)}
                className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto space-y-3 pr-2 text-xs sm:text-sm font-sans leading-relaxed text-neutral-700 dark:text-neutral-300 select-text">
            {currentSong.lyrics.split('\n\n').map((verse, idx) => (
              <p key={idx} className="whitespace-pre-line py-1.5 border-b border-neutral-100 dark:border-neutral-900/60 last:border-0">
                {verse}
              </p>
            ))}
          </div>

          <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Credits: {currentSong.credits.lyrics}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentSong.lyrics);
                alert('Lyrics copied to clipboard!');
              }}
              className="text-amber-500 hover:underline"
            >
              Copy All Lyrics
            </button>
          </div>
        </div>
      )}
    </>
  );
};
