import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { getYouTubeIdForSong, getYouTubeEmbedUrl, getYouTubeThumbnail } from '../utils/youtubeUtils';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Share2, 
  FileText, 
  ListMusic, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Sliders, 
  Video, 
  Disc,
  Music2,
  Info
} from 'lucide-react';

export const FullscreenPlayerModal: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playSong,
    nextSong,
    prevSong,
    isFullScreenPlayerOpen,
    closeFullScreenPlayer,
    isShuffle,
    setIsShuffle,
    isLoop,
    setIsLoop,
    playbackSpeed,
    setPlaybackSpeed,
    sleepTimerMinutes,
    setSleepTimerMinutes,
    volume,
    changeVolume,
    isMuted,
    toggleMute,
    playbackTime,
    duration,
    seekSong,
    songs,
    openShare,
    showToast,
    closePlayer
  } = useStore();

  const [activeView, setActiveView] = useState<'art' | 'video' | 'lyrics' | 'queue'>('art');
  const [showSleepTimerMenu, setShowSleepTimerMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [lyricsFontSize, setLyricsFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keyboard controls for full screen player
  useEffect(() => {
    if (!isFullScreenPlayerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullScreenPlayer();
      } else if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        nextSong();
      } else if (e.key === 'ArrowLeft') {
        prevSong();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenPlayerOpen, closeFullScreenPlayer, togglePlay, nextSong, prevSong, toggleMute]);

  // Animated Visualizer Canvas
  useEffect(() => {
    if (!isFullScreenPlayerOpen || activeView !== 'art') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw dynamic visualizer wave bars
      const barCount = 48;
      const barWidth = width / barCount - 3;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 3);
        const freq = isPlaying ? Math.sin(phase + i * 0.25) * 0.5 + 0.5 : 0.08;
        const barHeight = isPlaying 
          ? (Math.sin(phase * 2 + i * 0.4) * 0.4 + 0.6) * (height * 0.7) * (freq + 0.2)
          : 6;

        const gradient = ctx.createLinearGradient(x, centerY - barHeight / 2, x, centerY + barHeight / 2);
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.9)'); // amber-500
        gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.8)'); // red-500
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.9)'); // purple-500

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, centerY - barHeight / 2, barWidth, Math.max(barHeight, 4), [4]);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.06 * playbackSpeed;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isFullScreenPlayerOpen, activeView, isPlaying, playbackSpeed]);

  if (!isFullScreenPlayerOpen || !currentSong) return null;

  const youtubeId = getYouTubeIdForSong(currentSong);
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
  const videoEmbedUrl = getYouTubeEmbedUrl(youtubeId, { autoplay: isPlaying, controls: true });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleShareSong = () => {
    openShare({
      type: 'song',
      title: `${currentSong.title} — Arjun Bharti Mina`,
      artist: currentSong.artist,
      genre: currentSong.genre,
      year: currentSong.year,
      text: `Listen to "${currentSong.title}" by ${currentSong.artist} directly on the official YouTube Music Player.`,
      imageUrl: currentSong.cover,
      streamingLinks: currentSong.streamingLinks,
      url: window.location.href
    });
  };

  const speeds = [0.75, 1, 1.25, 1.5, 2];
  const sleepOptions = [
    { label: 'Off', value: null },
    { label: '15 Min', value: 15 },
    { label: '30 Min', value: 30 },
    { label: '45 Min', value: 45 },
    { label: '60 Min', value: 60 },
  ];

  return (
    <div 
      id="fullscreen-youtube-player-backdrop"
      className="fixed inset-0 z-[60] bg-neutral-950/95 text-white backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-in fade-in duration-300"
      onClick={(e) => {
        // Tapping the empty backdrop closes the fullscreen view to return to bottom screen
        if (e.target === e.currentTarget) {
          closeFullScreenPlayer();
        }
      }}
    >
      {/* Background Ambient Cover Art Glow */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none filter blur-3xl scale-125 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${currentSong.cover})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/70 to-neutral-950/95 pointer-events-none" />

      {/* Top Header Controls Bar */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between border-b border-white/10 bg-neutral-950/40">
        
        {/* Left: Branding & Minimize */}
        <div className="flex items-center gap-3">
          <button
            id="fullscreen-player-minimize-btn"
            onClick={closeFullScreenPlayer}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-transform hover:scale-105 active:scale-95"
            title="Minimize to tiny bottom bar"
          >
            <Minimize2 className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold tracking-wider text-red-500 uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                YouTube Music Player
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
                HD Audio
              </span>
            </div>
            <h2 className="text-xs text-neutral-400 font-medium truncate max-w-[200px] sm:max-w-xs">
              Playing from: <span className="text-white font-bold">{currentSong.title}</span>
            </h2>
          </div>
        </div>

        {/* Center: View Switcher Tabs (Artwork & Visualizer / Video Canvas / Lyrics / Up Next Queue) */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveView('art')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              activeView === 'art' ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Visualizer</span>
          </button>

          <button
            onClick={() => setActiveView('video')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              activeView === 'video' ? 'bg-red-500 text-white font-bold shadow-md' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Music Video</span>
          </button>

          <button
            onClick={() => setActiveView('lyrics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              activeView === 'lyrics' ? 'bg-blue-500 text-white font-bold shadow-md' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lyrics Vault</span>
          </button>

          <button
            onClick={() => setActiveView('queue')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              activeView === 'queue' ? 'bg-purple-500 text-white font-bold shadow-md' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>Discography Queue</span>
          </button>
        </div>

        {/* Right: Actions (Share, External YouTube, Exit Player) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareSong}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Share Song Card"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full bg-red-600/30 hover:bg-red-600/50 text-red-400 hover:text-red-200 border border-red-500/30 transition-colors"
            title="Open on official YouTube"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            id="fullscreen-player-exit-btn"
            onClick={() => {
              closeFullScreenPlayer();
              closePlayer();
            }}
            className="p-2.5 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all shadow-md"
            title="Exit Player completely"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile View Toggle Bar */}
      <div className="md:hidden relative z-10 flex items-center justify-around px-3 py-2 bg-neutral-900/60 border-b border-white/5">
        <button
          onClick={() => setActiveView('art')}
          className={`px-3 py-1 rounded-xl text-xs font-medium ${activeView === 'art' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400'}`}
        >
          Art
        </button>
        <button
          onClick={() => setActiveView('video')}
          className={`px-3 py-1 rounded-xl text-xs font-medium ${activeView === 'video' ? 'bg-red-500 text-white font-bold' : 'text-neutral-400'}`}
        >
          Video
        </button>
        <button
          onClick={() => setActiveView('lyrics')}
          className={`px-3 py-1 rounded-xl text-xs font-medium ${activeView === 'lyrics' ? 'bg-blue-500 text-white font-bold' : 'text-neutral-400'}`}
        >
          Lyrics
        </button>
        <button
          onClick={() => setActiveView('queue')}
          className={`px-3 py-1 rounded-xl text-xs font-medium ${activeView === 'queue' ? 'bg-purple-500 text-white font-bold' : 'text-neutral-400'}`}
        >
          Queue
        </button>
      </div>

      {/* Main Center Stage */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-center overflow-y-auto">
        
        {/* VIEW 1: ARTWORK + GLOWING FREQUENCY VISUALIZER */}
        {activeView === 'art' && (
          <div className="flex flex-col items-center justify-center w-full max-w-lg space-y-6 text-center animate-in zoom-in-95 duration-300">
            
            {/* Spinning/Glow Album Artwork */}
            <div className="relative group">
              <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-neutral-900 relative">
                <img 
                  src={currentSong.cover} 
                  alt={currentSong.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60" />
              </div>

              {/* Verified Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-amber-500 text-neutral-950 font-mono text-[10px] font-bold tracking-wider uppercase shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                <Sparkles className="w-3 h-3" />
                <span>Original Master • {currentSong.year}</span>
              </div>
            </div>

            {/* Visualizer Waveform Canvas */}
            <div className="w-full h-16 sm:h-20 bg-white/5 rounded-2xl p-2 border border-white/10 backdrop-blur-sm overflow-hidden flex items-center justify-center">
              <canvas 
                ref={canvasRef} 
                width={460} 
                height={70} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Song Meta Information */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                {currentSong.genre} • {currentSong.language || 'Hindi'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-white drop-shadow-md">
                {currentSong.title}
              </h1>
              <p className="text-sm text-neutral-300 font-medium">
                By {currentSong.artist} • <span className="text-neutral-400">{currentSong.credits?.label || 'ABM Records'}</span>
              </p>
            </div>
          </div>
        )}

        {/* VIEW 2: FULL HD YOUTUBE EMBED PLAYER */}
        {activeView === 'video' && (
          <div className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black relative animate-in zoom-in-95 duration-300">
            <iframe
              src={videoEmbedUrl}
              title={`YouTube Video - ${currentSong.title}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {/* VIEW 3: FULL SYNCED / INTERACTIVE LYRICS VAULT */}
        {activeView === 'lyrics' && (
          <div className="w-full max-w-2xl bg-neutral-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md max-h-[55vh] sm:max-h-[60vh] overflow-y-auto space-y-4 text-center animate-in zoom-in-95 duration-300">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">Official Lyrics</span>
                <h3 className="text-sm font-bold text-white">{currentSong.title}</h3>
              </div>
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setLyricsFontSize('sm')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono ${lyricsFontSize === 'sm' ? 'bg-blue-500 text-white font-bold' : 'text-neutral-400'}`}
                >
                  S
                </button>
                <button
                  onClick={() => setLyricsFontSize('base')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono ${lyricsFontSize === 'base' ? 'bg-blue-500 text-white font-bold' : 'text-neutral-400'}`}
                >
                  M
                </button>
                <button
                  onClick={() => setLyricsFontSize('lg')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono ${lyricsFontSize === 'lg' ? 'bg-blue-500 text-white font-bold' : 'text-neutral-400'}`}
                >
                  L
                </button>
              </div>
            </div>

            <div className={`whitespace-pre-line leading-relaxed font-sans text-neutral-200 ${
              lyricsFontSize === 'sm' ? 'text-xs' : lyricsFontSize === 'lg' ? 'text-lg font-medium' : 'text-sm'
            }`}>
              {currentSong.lyrics || 'Official lyrics sheet coming soon to Arjun Bharti Mina Hub.'}
            </div>

            {currentSong.credits && (
              <div className="pt-4 border-t border-white/10 text-xs font-mono text-neutral-400 space-y-1 text-left">
                <p>✍️ <strong className="text-neutral-200">Written by:</strong> {currentSong.credits.lyrics}</p>
                <p>🎹 <strong className="text-neutral-200">Music & Beat:</strong> {currentSong.credits.music}</p>
                <p>🎛️ <strong className="text-neutral-200">Production:</strong> {currentSong.credits.production}</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: DISCOGRAPHY QUEUE */}
        {activeView === 'queue' && (
          <div className="w-full max-w-2xl bg-neutral-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md max-h-[55vh] overflow-y-auto space-y-3 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-purple-400" />
                <span>Discography Playlist ({songs.length} Tracks)</span>
              </h3>
              <span className="text-xs font-mono text-neutral-400">Tap track to play</span>
            </div>

            <div className="space-y-2">
              {songs.map((song, idx) => {
                const isSelected = song.id === currentSong.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => playSong(song)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-purple-500/20 border border-purple-500/50 text-white shadow-lg' 
                        : 'bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 shrink-0 relative">
                        <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                        {isSelected && isPlaying && (
                          <div className="absolute inset-0 bg-purple-600/70 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold truncate">{song.title}</h4>
                        <p className="text-[11px] text-neutral-400 truncate">{song.genre} • {song.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <span className="px-2.5 py-1 rounded-full bg-purple-500 text-white font-mono text-[10px] font-bold">
                          Now Playing
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-neutral-500">#{idx + 1}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Bottom Master Playback Control Deck */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-4">
        
        {/* Scrubber Progress Bar */}
        <div className="space-y-1.5">
          <div className="relative group flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 200}
              value={playbackTime}
              onChange={(e) => seekSong(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
            />
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>{formatTime(playbackTime)}</span>
            <span className="text-amber-400 font-semibold">{currentSong.duration || formatTime(duration)}</span>
          </div>
        </div>

        {/* Core Media Buttons & Toggles */}
        <div className="flex items-center justify-between gap-2 sm:gap-6">
          
          {/* Left Sub-Controls: Shuffle, Loop, Speed */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                setIsShuffle(!isShuffle);
                showToast(isShuffle ? 'Shuffle disabled' : 'Shuffle enabled', 'info');
              }}
              className={`p-2.5 rounded-xl transition-colors ${
                isShuffle ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
              title="Shuffle Discography"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsLoop(!isLoop);
                showToast(isLoop ? 'Loop disabled' : 'Looping track', 'info');
              }}
              className={`p-2.5 rounded-xl transition-colors ${
                isLoop ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
              title="Repeat Single Track"
            >
              <Repeat className="w-4 h-4" />
            </button>

            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                  playbackSpeed !== 1 ? 'bg-white text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full left-0 mb-2 p-1 rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col gap-1 z-30">
                  {speeds.map((spd) => (
                    <button
                      key={spd}
                      onClick={() => {
                        setPlaybackSpeed(spd);
                        setShowSpeedMenu(false);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-mono text-left ${
                        playbackSpeed === spd ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:bg-white/10'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Primary Transport Controls (Prev, Big Play/Pause, Next) */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={prevSong}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-transform hover:scale-105 active:scale-95 shadow-md"
              title="Previous Song"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              id="fullscreen-player-play-btn"
              onClick={togglePlay}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
              title={isPlaying ? "Pause Track" : "Play Track"}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={nextSong}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-transform hover:scale-105 active:scale-95 shadow-md"
              title="Next Song"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Right Sub-Controls: Volume Slider & Sleep Timer */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sleep Timer */}
            <div className="relative">
              <button
                onClick={() => setShowSleepTimerMenu(!showSleepTimerMenu)}
                className={`p-2.5 rounded-xl transition-colors ${
                  sleepTimerMinutes ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title={sleepTimerMinutes ? `Sleep timer: ${sleepTimerMinutes}m` : "Set Sleep Timer"}
              >
                <Clock className="w-4 h-4" />
              </button>

              {showSleepTimerMenu && (
                <div className="absolute bottom-full right-0 mb-2 p-1.5 rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col gap-1 z-30 min-w-[120px]">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase text-neutral-400 border-b border-white/5">
                    Sleep Timer
                  </div>
                  {sleepOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setSleepTimerMinutes(opt.value);
                        setShowSleepTimerMenu(false);
                        if (opt.value) {
                          showToast(`Sleep timer set for ${opt.value} minutes`, 'info');
                        } else {
                          showToast('Sleep timer turned off', 'info');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono text-left flex items-center justify-between ${
                        sleepTimerMinutes === opt.value ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sleepTimerMinutes === opt.value && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="w-20 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

        </div>

      </footer>
    </div>
  );
};
