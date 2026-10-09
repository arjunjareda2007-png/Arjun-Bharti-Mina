import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SongRelatedVideo, VideoItem } from '../types';
import { formatTime } from '../utils/helpers';
import { hapticBeat, hapticLight, hapticSelection, hapticSuccess } from '../utils/haptics';
import { 
  X, 
  Share2, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  Gauge,
  Film,
  Disc,
  Link2,
  ListMusic,
  Headphones,
  Download
} from 'lucide-react';

export const FullscreenPlayerModal: React.FC = () => {
  const {
    currentSong,
    isFullScreenPlayerOpen,
    closeFullScreenPlayer,
    songs,
    isPlaying,
    isBuffering,
    togglePlay,
    playSong,
    pauseSong,
    nextSong,
    prevSong,
    playbackTime,
    duration,
    seekSong,
    volume,
    changeVolume,
    isMuted,
    toggleMute,
    isLoop,
    toggleLoop,
    isShuffle,
    setIsShuffle,
    playbackSpeed,
    setPlaybackSpeed,
    openVideoPlayer,
    openShare,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'player' | 'videos' | 'lyrics' | 'queue'>('player');
  const [copiedAudioUrl, setCopiedAudioUrl] = useState(false);
  const [copiedLyrics, setCopiedLyrics] = useState(false);

  // Keyboard controls
  useEffect(() => {
    if (!isFullScreenPlayerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullScreenPlayer();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        seekSong(playbackTime + 5);
      } else if (e.key === 'ArrowLeft') {
        seekSong(playbackTime - 5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenPlayerOpen, closeFullScreenPlayer, togglePlay, playbackTime, seekSong]);

  if (!isFullScreenPlayerOpen || !currentSong) return null;

  const hasVideos = currentSong.relatedVideos && currentSong.relatedVideos.length > 0;
  const progressPercent = duration > 0 ? Math.min(100, (playbackTime / duration) * 100) : 0;

  const handleCopyAudioLink = () => {
    if (!currentSong.audioUrl) return;
    navigator.clipboard.writeText(currentSong.audioUrl);
    setCopiedAudioUrl(true);
    showToast(`Copied hosted audio link for ${currentSong.title}`, 'success');
    setTimeout(() => setCopiedAudioUrl(false), 2000);
  };

  const handleCopyLyrics = () => {
    navigator.clipboard.writeText(currentSong.lyrics);
    setCopiedLyrics(true);
    showToast('Lyrics copied to clipboard!', 'success');
    setTimeout(() => setCopiedLyrics(false), 2000);
  };

  const handleOpenRelatedVideo = (video: SongRelatedVideo) => {
    hapticSelection();
    const videoItem: VideoItem = {
      id: video.id || `rel-vid-${currentSong.id}-${Date.now()}`,
      title: video.title || `${currentSong.title} (${video.type || 'Video'})`,
      youtubeUrl: video.youtubeUrl,
      youtubeEmbedId: video.youtubeEmbedId || video.youtubeUrl.split('v=')[1]?.split('&')[0] || 'fJ9rUzIMcZQ',
      thumbnail: video.thumbnail || currentSong.cover,
      category: (video.type as any) || 'Music Video',
      duration: video.duration || currentSong.duration || '3:30',
      date: currentSong.releaseDate,
      description: `Official related video for "${currentSong.title}" by ${currentSong.artist}.`,
      featured: currentSong.featured,
      published: true
    };
    openVideoPlayer(videoItem);
  };

  const handleShare = () => {
    openShare({
      type: 'song',
      title: `${currentSong.title} — Arjun Bharti Mina`,
      text: `Listening to "${currentSong.title}" (${currentSong.genre}) on ABM Official Site!`,
      url: `${window.location.origin}/?section=music&song=${currentSong.id}`,
      imageUrl: currentSong.cover,
      artist: currentSong.artist,
      genre: currentSong.genre,
      year: currentSong.year,
      lyricsText: currentSong.lyrics,
      streamingLinks: currentSong.streamingLinks
    });
  };

  return (
    <div 
      id="fullscreen-player-backdrop"
      className="fixed inset-0 z-[6000] bg-neutral-950/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={closeFullScreenPlayer}
    >
      <div 
        id="fullscreen-player-modal"
        className="w-full max-w-4xl bg-neutral-950 border border-neutral-800 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                Studio Player • Hosted Stream
              </span>
              <h2 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                {currentSong.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Tabs */}
            <div className="hidden sm:flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('player')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'player' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Now Playing
              </button>
              
              {hasVideos && (
                <button
                  type="button"
                  onClick={() => setActiveTab('videos')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === 'videos' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-red-400'
                  }`}
                >
                  <Film className="w-3 h-3" />
                  <span>Videos ({currentSong.relatedVideos!.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('lyrics')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'lyrics' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Lyrics
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('queue')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'queue' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Discography ({songs.length})
              </button>
            </div>

            {currentSong.audioUrl && (
              <button
                type="button"
                onClick={handleCopyAudioLink}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Hosted Audio URL"
              >
                {copiedAudioUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Share Track"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={closeFullScreenPlayer}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer ml-1"
              title="Close Player (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: PLAYER & VISUALIZER */}
          {activeTab === 'player' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              
              {/* Giant Artwork & Spinning Disc Effect */}
              <div className="relative group w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900">
                <img 
                  src={currentSong.cover} 
                  alt={currentSong.title}
                  className="w-full h-full object-cover" 
                />
                
                {isPlaying && (
                  <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-neutral-950/90 border-2 border-amber-500/50 flex items-center justify-center animate-spin">
                    <Disc className="w-12 h-12 text-amber-400" />
                  </div>
                )}
              </div>

              {/* Title & Artist */}
              <div className="text-center space-y-1">
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                  {currentSong.title}
                </h3>
                <p className="text-sm font-medium text-neutral-400">
                  {currentSong.artist} • <span className="text-amber-400 font-mono">{currentSong.genre}</span> ({currentSong.year})
                </p>
              </div>

              {/* Scrubber Timeline */}
              <div className="space-y-2">
                <input 
                  type="range"
                  min={0}
                  max={duration || 200}
                  value={playbackTime}
                  onChange={(e) => seekSong(parseFloat(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />

                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <span>{formatTime(playbackTime)}</span>
                    {isBuffering && <span className="text-[10px] animate-pulse text-amber-500">(Buffering...)</span>}
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Full Controls: Shuffle, Prev, Play/Pause, Next, Loop */}
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                    isShuffle 
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                  title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    prevSong();
                  }}
                  className="p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 transition-colors cursor-pointer active:scale-95"
                  title="Previous Song"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    hapticBeat();
                    togglePlay();
                  }}
                  className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-xl shadow-amber-500/20 transform active:scale-95 transition-all cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-1" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    nextSong();
                  }}
                  className="p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 transition-colors cursor-pointer active:scale-95"
                  title="Next Song"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    toggleLoop();
                  }}
                  className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                    isLoop 
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                  title={isLoop ? 'Loop Enabled' : 'Enable Loop'}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Secondary Controls Bar: Speed, Volume, Audio Link */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-400 font-mono text-[11px]">Speed:</span>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-0.5 text-amber-400 font-mono text-xs cursor-pointer focus:outline-hidden"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1.0}>1.0x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input 
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {currentSong.audioUrl && (
                  <button
                    type="button"
                    onClick={handleCopyAudioLink}
                    className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-mono text-[11px] cursor-pointer"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Copy Audio Link</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: RELATED VIDEOS (CORE USER FEATURE) */}
          {activeTab === 'videos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-300 font-bold flex items-center gap-2">
                  <Film className="w-4 h-4 text-red-500" />
                  <span>Related Videos for "{currentSong.title}"</span>
                </h3>
                <span className="text-xs font-mono text-neutral-400">
                  {currentSong.relatedVideos?.length || 0} Videos
                </span>
              </div>

              {hasVideos ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentSong.relatedVideos!.map((vid, vidIdx) => (
                    <div
                      key={vid.id || vidIdx}
                      onClick={() => handleOpenRelatedVideo(vid)}
                      className="group rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-red-500/60 cursor-pointer transition-all hover:scale-[1.02] shadow-xl"
                    >
                      <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden">
                        <img 
                          src={vid.thumbnail || currentSong.cover} 
                          alt={vid.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-red-950/40 flex items-center justify-center transition-colors">
                          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                        {vid.duration && (
                          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-mono text-white font-bold">
                            {vid.duration}
                          </span>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] font-mono text-red-400 border border-red-500/30 uppercase font-bold">
                          {vid.type || 'Video'}
                        </span>
                      </div>
                      
                      <div className="p-3.5 space-y-1">
                        <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                          {vid.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          Click to play in theater mode
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-neutral-900/60 rounded-2xl border border-neutral-800 text-neutral-400 text-xs">
                  No related videos added for this track yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LYRICS */}
          {activeTab === 'lyrics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-400">
                  Lyrics: {currentSong.title}
                </h3>
                <button
                  type="button"
                  onClick={handleCopyLyrics}
                  className="text-xs text-amber-400 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedLyrics ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLyrics ? 'Copied' : 'Copy Full Lyrics'}</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 max-h-[50vh] overflow-y-auto">
                <pre className="font-sans text-sm sm:text-base leading-relaxed text-neutral-200 whitespace-pre-wrap">
                  {currentSong.lyrics || "Lyrics for this track are being transcribed."}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: QUEUE / DISCOGRAPHY */}
          {activeTab === 'queue' && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Complete Discography
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {songs.map((song) => {
                  const isCurrent = song.id === currentSong.id;
                  return (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => {
                        hapticBeat();
                        playSong(song);
                        setActiveTab('player');
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-amber-500/15 border-amber-500 text-white' 
                          : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      <img src={song.cover} alt={song.title} className="w-11 h-11 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold truncate">{song.title}</h4>
                        <p className="text-[11px] text-neutral-400 font-mono">{song.genre} • {song.duration}</p>
                      </div>
                      {isCurrent && (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
