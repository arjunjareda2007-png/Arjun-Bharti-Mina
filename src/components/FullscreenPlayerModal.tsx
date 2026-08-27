import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getYouTubeIdForSong, getYouTubeEmbedUrl } from '../utils/youtubeUtils';
import { hapticBeat, hapticLight, hapticSelection, hapticMedium } from '../utils/haptics';
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
  Minimize2, 
  Share2, 
  FileText, 
  ListMusic, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Video, 
  Disc,
  Copy,
  Check,
  Radio,
  Tv
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
    activePlayerView,
    setActivePlayerView,
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
    lyrics,
    openShare,
    showToast,
    closePlayer
  } = useStore();

  const [showSleepTimerMenu, setShowSleepTimerMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [lyricsFontSize, setLyricsFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keyboard controls for full screen player
  useEffect(() => {
    if (!isFullScreenPlayerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullScreenPlayer();
      } else if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        hapticBeat();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        hapticSelection();
        nextSong();
      } else if (e.key === 'ArrowLeft') {
        hapticSelection();
        prevSong();
      } else if (e.key === 'm' || e.key === 'M') {
        hapticLight();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenPlayerOpen, closeFullScreenPlayer, togglePlay, nextSong, prevSong, toggleMute]);

  // Animated Visualizer Canvas
  useEffect(() => {
    if (!isFullScreenPlayerOpen || activePlayerView !== 'art') return;
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
      const barCount = 44;
      const barWidth = width / barCount - 3;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 3);
        const freq = isPlaying ? Math.sin(phase + i * 0.28) * 0.5 + 0.5 : 0.08;
        const barHeight = isPlaying 
          ? (Math.sin(phase * 2 + i * 0.4) * 0.4 + 0.6) * (height * 0.72) * (freq + 0.2)
          : 6;

        const gradient = ctx.createLinearGradient(x, centerY - barHeight / 2, x, centerY + barHeight / 2);
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.95)'); // amber-500
        gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.85)'); // red-500
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.95)'); // purple-500

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, centerY - barHeight / 2, barWidth, Math.max(barHeight, 4), [4]);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.06 * (playbackSpeed || 1);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isFullScreenPlayerOpen, activePlayerView, isPlaying, playbackSpeed]);

  if (!isFullScreenPlayerOpen || !currentSong) return null;

  const youtubeId = getYouTubeIdForSong(currentSong);
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

  // Video embed url initialized at exact synchronized playback timestamp
  const videoEmbedUrl = getYouTubeEmbedUrl(youtubeId, { 
    autoplay: isPlaying, 
    controls: true, 
    start: Math.max(0, Math.floor(playbackTime)) 
  });

  // Resolve lyrics from currentSong or lyrics library
  const resolvedLyrics = currentSong.lyrics || 
    lyrics.find(l => l.songId === currentSong.id)?.lyrics || 
    lyrics.find(l => l.title.toLowerCase().includes(currentSong.title.toLowerCase()))?.lyrics || 
    `[Official Lyrics by ${currentSong.artist}]\n\nLyrics currently available in the Lyrics Vault tab.\nEnjoy the rhythm and flow by Arjun Bharti Mina.`;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleShareSong = () => {
    hapticMedium();
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

  const handleCopyLyrics = () => {
    hapticLight();
    navigator.clipboard.writeText(resolvedLyrics);
    setCopiedLyrics(true);
    showToast('Lyrics copied to clipboard!', 'success');
    setTimeout(() => setCopiedLyrics(false), 2200);
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
      className="fixed inset-0 z-[60] bg-neutral-950/95 text-white backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          hapticLight();
          closeFullScreenPlayer();
        }
      }}
    >
      {/* Background Ambient Cover Art Glow */}
      <div 
        className="absolute inset-0 pointer-events-none filter blur-3xl bg-cover bg-center transition-all duration-700 opacity-20 scale-125"
        style={{ backgroundImage: `url(${currentSong.cover})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/70 to-neutral-950/95 pointer-events-none" />

      {/* Top Header Controls Bar */}
      <header className="relative z-10 w-full px-3 sm:px-8 py-2.5 sm:py-4 flex items-center justify-between border-b border-white/10 bg-neutral-950/50 backdrop-blur-md gap-2">
        
        {/* Left: Branding & Minimize */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            id="fullscreen-player-minimize-btn"
            type="button"
            onClick={() => {
              hapticLight();
              closeFullScreenPlayer();
            }}
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm shrink-0"
            title="Minimize to floating bottom bar"
          >
            <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-red-500 uppercase">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-ping"></span>
                ABM Player
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono hidden xs:inline">
                Synced Audio & Video
              </span>
            </div>
            <h2 className="text-xs sm:text-sm text-neutral-400 font-medium truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs">
              Playing: <span className="text-white font-bold">{currentSong.title}</span>
            </h2>
          </div>
        </div>

        {/* Center: View Switcher Tabs */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => {
              hapticSelection();
              setActivePlayerView('art');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              activePlayerView === 'art' ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Visualizer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              hapticSelection();
              setActivePlayerView('video');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              activePlayerView === 'video' ? 'bg-red-500 text-white font-bold shadow-md' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Music Video</span>
          </button>

          <button
            type="button"
            onClick={() => {
              hapticSelection();
              setActivePlayerView('lyrics');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              activePlayerView === 'lyrics' ? 'bg-blue-500 text-white font-bold shadow-md' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lyrics Vault</span>
          </button>

          <button
            type="button"
            onClick={() => {
              hapticSelection();
              setActivePlayerView('queue');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              activePlayerView === 'queue' ? 'bg-purple-500 text-white font-bold shadow-md' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>Playlist</span>
          </button>
        </div>

        {/* Right: Actions (Share, External YouTube, Exit Player) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShareSong}
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Share Song"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => hapticLight()}
            className="p-2 sm:p-2.5 rounded-full bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-200 border border-red-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Open on YouTube"
          >
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>

          <button
            id="fullscreen-player-exit-btn"
            type="button"
            onClick={() => {
              hapticLight();
              closeFullScreenPlayer();
              closePlayer();
            }}
            className="p-2 sm:p-2.5 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            title="Stop & Close Player"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </header>

      {/* Mobile View Toggle Bar */}
      <div className="md:hidden relative z-10 flex items-center justify-around px-3 py-2 bg-neutral-900/60 border-b border-white/5">
        <button
          type="button"
          onClick={() => {
            hapticSelection();
            setActivePlayerView('art');
          }}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${activePlayerView === 'art' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400'}`}
        >
          Visualizer
        </button>
        <button
          type="button"
          onClick={() => {
            hapticSelection();
            setActivePlayerView('video');
          }}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${activePlayerView === 'video' ? 'bg-red-500 text-white font-bold' : 'text-neutral-400'}`}
        >
          Video
        </button>
        <button
          type="button"
          onClick={() => {
            hapticSelection();
            setActivePlayerView('lyrics');
          }}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${activePlayerView === 'lyrics' ? 'bg-blue-500 text-white font-bold' : 'text-neutral-400'}`}
        >
          Lyrics
        </button>
        <button
          type="button"
          onClick={() => {
            hapticSelection();
            setActivePlayerView('queue');
          }}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${activePlayerView === 'queue' ? 'bg-purple-500 text-white font-bold' : 'text-neutral-400'}`}
        >
          Playlist
        </button>
      </div>

      {/* Center Stage Body Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto max-w-5xl mx-auto w-full">
        
        {/* VIEW 1: ARTWORK + VINYL SPIN + GLOWING FREQUENCY VISUALIZER + LIVE LYRICS CARD */}
        {activePlayerView === 'art' && (
          <div className="flex flex-col items-center justify-center w-full max-w-lg space-y-4 text-center animate-in fade-in duration-200">
            
            {/* Spinning Vinyl Album Artwork Disc */}
            <div className="relative group">
              <div 
                className={`w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-neutral-800 bg-neutral-900 relative flex items-center justify-center p-3 ${
                  isPlaying ? 'animate-[spin_16s_linear_infinite]' : ''
                }`}
              >
                {/* Vinyl Grooves & Cover Ring */}
                <div className="w-full h-full rounded-full overflow-hidden relative border border-white/20">
                  <img 
                    src={currentSong.cover} 
                    alt={currentSong.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60" />
                </div>

                {/* Center Spindle Hole */}
                <div className="w-10 h-10 rounded-full bg-neutral-950 border-2 border-amber-500/80 absolute z-20 flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-mono text-[10px] font-bold tracking-wider uppercase shadow-xl flex items-center gap-1.5 whitespace-nowrap z-20">
                <Sparkles className="w-3 h-3" />
                <span>Original Master • {currentSong.year}</span>
              </div>
            </div>

            {/* Visualizer Waveform Canvas */}
            <div className="w-full h-14 sm:h-16 bg-white/5 rounded-2xl p-2 border border-white/10 backdrop-blur-sm overflow-hidden flex items-center justify-center">
              <canvas 
                ref={canvasRef} 
                width={440} 
                height={60} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Song Meta Information */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                {currentSong.genre} • {currentSong.language || 'Hindi'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white drop-shadow-md">
                {currentSong.title}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 font-medium">
                By {currentSong.artist} • <span className="text-neutral-400">{currentSong.credits?.label || 'ABM Records'}</span>
              </p>
            </div>

            {/* Interactive Live Lyrics Preview Card */}
            <div 
              onClick={() => {
                hapticSelection();
                setActivePlayerView('lyrics');
              }}
              className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md cursor-pointer transition-all hover:scale-[1.01] group text-left flex items-center justify-between gap-3 shadow-lg"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-blue-400 uppercase font-bold">Lyrics Preview</div>
                  <p className="text-xs text-neutral-200 truncate italic">
                    "{resolvedLyrics.split('\n').filter(l => l.trim() && !l.startsWith('[')).slice(0, 2).join(' / ') || 'Tap to view full rhymes and lyrics'}"
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 text-[11px] font-semibold shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                Full Lyrics →
              </span>
            </div>
          </div>
        )}

        {/* VIEW 2: FULL HD YOUTUBE EMBED PLAYER (SYNCED AT EXACT CURRENT TIMESTAMP) */}
        {activePlayerView === 'video' && (
          <div className="w-full max-w-3xl space-y-3 animate-in zoom-in-95 duration-200">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black relative">
              <iframe
                src={videoEmbedUrl}
                title={`YouTube Video - ${currentSong.title}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="flex items-center justify-between px-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-red-400">
                <Tv className="w-3.5 h-3.5" />
                <span>Synced Playback • Timestamp: {formatTime(playbackTime)}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  setActivePlayerView('art');
                }}
                className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline underline-offset-2"
              >
                Switch to Audio Visualizer
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: FULL SYNCED / INTERACTIVE LYRICS VAULT */}
        {activePlayerView === 'lyrics' && (
          <div className="w-full max-w-2xl bg-neutral-900/90 border border-white/10 rounded-3xl p-5 sm:p-7 backdrop-blur-md max-h-[55vh] sm:max-h-[58vh] overflow-y-auto space-y-4 animate-in fade-in duration-200 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Official Lyrics Sheet
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">{currentSong.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Copy Lyrics Button */}
                <button
                  type="button"
                  onClick={handleCopyLyrics}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer transition-all"
                  title="Copy lyrics to clipboard"
                >
                  {copiedLyrics ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {/* Font Sizer */}
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      hapticLight();
                      setLyricsFontSize('sm');
                    }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${lyricsFontSize === 'sm' ? 'bg-blue-500 text-white font-bold' : 'text-neutral-400'}`}
                  >
                    S
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      hapticLight();
                      setLyricsFontSize('base');
                    }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${lyricsFontSize === 'base' ? 'bg-blue-500 text-white font-bold' : 'text-neutral-400'}`}
                  >
                    M
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      hapticLight();
                      setLyricsFontSize('lg');
                    }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${lyricsFontSize === 'lg' ? 'bg-blue-500 text-white font-bold' : 'text-neutral-400'}`}
                  >
                    L
                  </button>
                </div>
              </div>
            </div>

            {/* Formatted Lyrics Verses */}
            <div className={`whitespace-pre-line leading-relaxed font-sans text-neutral-200 text-left ${
              lyricsFontSize === 'sm' ? 'text-xs' : lyricsFontSize === 'lg' ? 'text-lg font-medium' : 'text-sm'
            }`}>
              {resolvedLyrics.split('\n\n').map((verse, vIdx) => {
                const lines = verse.split('\n');
                const headerMatch = lines[0].match(/^\[(.*)\]$/);
                return (
                  <div key={vIdx} className="mb-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
                    {headerMatch && (
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold uppercase mb-2">
                        {headerMatch[1]}
                      </span>
                    )}
                    <p className="space-y-1">
                      {headerMatch ? lines.slice(1).join('\n') : verse}
                    </p>
                  </div>
                );
              })}
            </div>

            {currentSong.credits && (
              <div className="pt-3 border-t border-white/10 text-xs font-mono text-neutral-400 space-y-1 text-left">
                <p>✍️ <strong className="text-neutral-200">Written by:</strong> {currentSong.credits.lyrics}</p>
                <p>🎹 <strong className="text-neutral-200">Music & Beat:</strong> {currentSong.credits.music}</p>
                <p>🎛️ <strong className="text-neutral-200">Production:</strong> {currentSong.credits.production}</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: DISCOGRAPHY PLAYLIST QUEUE */}
        {activePlayerView === 'queue' && (
          <div className="w-full max-w-2xl bg-neutral-900/90 border border-white/10 rounded-3xl p-5 backdrop-blur-md max-h-[55vh] overflow-y-auto space-y-3 animate-in fade-in duration-200 shadow-2xl">
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
                    onClick={() => {
                      hapticSelection();
                      playSong(song);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98] ${
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
                      <div className="min-w-0 text-left">
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
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-8 py-2.5 sm:py-4 space-y-2.5 sm:space-y-3.5 bg-neutral-950/60 backdrop-blur-md rounded-t-3xl border-t border-white/10">
        
        {/* Scrubber Progress Bar & Timestamps */}
        <div className="space-y-1">
          <div className="relative group flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 198}
              value={playbackTime}
              onChange={(e) => seekSong(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
            />
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="font-semibold text-white">{formatTime(playbackTime)}</span>
            <span className="text-amber-400 font-semibold">{currentSong.duration || formatTime(duration)}</span>
          </div>
        </div>

        {/* Core Media Buttons & Sub-Controls */}
        <div className="flex items-center justify-between gap-1 sm:gap-6">
          
          {/* Left Sub-Controls: Shuffle, Loop, Speed, Quick View */}
          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                hapticLight();
                setIsShuffle(!isShuffle);
                showToast(isShuffle ? 'Shuffle disabled' : 'Shuffle enabled', 'info');
              }}
              className={`p-2 sm:p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isShuffle ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
              title="Shuffle Discography"
            >
              <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                hapticLight();
                setIsLoop(!isLoop);
                showToast(isLoop ? 'Loop disabled' : 'Looping track', 'info');
              }}
              className={`p-2 sm:p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isLoop ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
              title="Repeat Track"
            >
              <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Speed Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  setShowSpeedMenu(!showSpeedMenu);
                }}
                className={`px-2 sm:px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono transition-all hover:scale-105 active:scale-95 cursor-pointer ${
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
                      type="button"
                      onClick={() => {
                        hapticSelection();
                        setPlaybackSpeed(spd);
                        setShowSpeedMenu(false);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-mono text-left cursor-pointer ${
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
          <div className="flex items-center gap-2 sm:gap-5 shrink-0">
            <button
              type="button"
              onClick={() => {
                hapticSelection();
                prevSong();
              }}
              className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white hover:scale-110 active:scale-90 transition-all shadow-md cursor-pointer"
              title="Previous Song"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            <button
              id="fullscreen-player-play-btn"
              type="button"
              onClick={() => {
                hapticBeat();
                togglePlay();
              }}
              className="w-11 h-11 sm:w-15 sm:h-15 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-2xl hover:scale-108 active:scale-92 transition-all cursor-pointer font-bold"
              title={isPlaying ? "Pause Track" : "Play Track"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 sm:w-7 sm:h-7 fill-current" />
              ) : (
                <Play className="w-5 h-5 sm:w-7 sm:h-7 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                hapticSelection();
                nextSong();
              }}
              className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white hover:scale-110 active:scale-90 transition-all shadow-md cursor-pointer"
              title="Next Song"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>
          </div>

          {/* Right Sub-Controls: Sleep Timer & Volume Slider */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Sleep Timer */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  setShowSleepTimerMenu(!showSleepTimerMenu);
                }}
                className={`p-2 sm:p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  sleepTimerMinutes ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                title={sleepTimerMinutes ? `Sleep timer: ${sleepTimerMinutes}m` : "Set Sleep Timer"}
              >
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {showSleepTimerMenu && (
                <div className="absolute bottom-full right-0 mb-2 p-1.5 rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col gap-1 z-30 min-w-[120px]">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase text-neutral-400 border-b border-white/5">
                    Sleep Timer
                  </div>
                  {sleepOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        hapticSelection();
                        setSleepTimerMinutes(opt.value);
                        setShowSleepTimerMenu(false);
                        if (opt.value) {
                          showToast(`Sleep timer set for ${opt.value} minutes`, 'info');
                        } else {
                          showToast('Sleep timer turned off', 'info');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono text-left flex items-center justify-between cursor-pointer ${
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
                type="button"
                onClick={() => {
                  hapticLight();
                  toggleMute();
                }}
                className="p-2 text-neutral-400 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
