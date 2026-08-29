import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getSpotifyEmbedForSong, getSpotifyWebUrlForSong } from '../utils/spotifyUtils';
import { hapticBeat, hapticLight, hapticSelection, hapticSuccess } from '../utils/haptics';
import { 
  X, 
  Share2, 
  FileText, 
  ListMusic, 
  ExternalLink, 
  Sparkles, 
  Copy, 
  Check, 
  Radio, 
  Maximize2 
} from 'lucide-react';

export const FullscreenPlayerModal: React.FC = () => {
  const {
    currentSong,
    isFullScreenPlayerOpen,
    closeFullScreenPlayer,
    songs,
    playSong,
    openShare,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'queue'>('player');
  const [copied, setCopied] = useState(false);

  // Keyboard controls
  useEffect(() => {
    if (!isFullScreenPlayerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullScreenPlayer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenPlayerOpen, closeFullScreenPlayer]);

  if (!isFullScreenPlayerOpen || !currentSong) return null;

  const spotifyEmbedUrl = getSpotifyEmbedForSong(currentSong);
  const spotifyWebUrl = getSpotifyWebUrlForSong(currentSong);

  const handleCopySpotify = () => {
    hapticSuccess();
    navigator.clipboard.writeText(spotifyWebUrl);
    setCopied(true);
    showToast(`Copied Spotify link for ${currentSong.title}`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    openShare({
      type: 'song',
      title: `${currentSong.title} — Arjun Bharti Mina`,
      text: `Stream "${currentSong.title}" (${currentSong.genre}) on Spotify!`,
      url: spotifyWebUrl,
      imageUrl: currentSong.cover,
      artist: currentSong.artist,
      genre: currentSong.genre,
      year: currentSong.year,
      lyricsText: currentSong.lyrics,
      streamingLinks: currentSong.streamingLinks,
      downloadFilename: `${currentSong.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poster.jpg`
    });
  };

  return (
    <div 
      id="spotify-fullscreen-player-backdrop"
      className="fixed inset-0 z-[6000] bg-neutral-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={closeFullScreenPlayer}
    >
      <div 
        id="spotify-fullscreen-player-modal"
        className="w-full max-w-4xl bg-neutral-950 border border-neutral-800 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#1DB954] text-neutral-950 flex items-center justify-center font-bold">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.354-.677.466-1.031.251-2.822-1.724-6.374-2.114-10.558-1.159-.404.093-.807-.16-.9-.564-.093-.404.16-.807.564-.9 4.582-1.047 8.514-.606 11.674 1.341.354.215.466.677.251 1.032zm1.47-3.266c-.27.44-.848.58-1.288.31-3.23-1.985-8.154-2.559-11.974-1.4-1.498.455-.499-.33-.954-.83-.455-.499.33-.954.83-1.498 4.37-1.326 9.805-.688 13.518 1.588.44.27.58.848.31 1.288zm.126-3.414c-3.873-2.3-10.258-2.512-13.966-1.385-.594.18-1.222-.156-1.402-.75-.18-.594.156-1.222.75-1.402 4.26-1.294 11.298-1.043 15.753 1.603.534.317.708 1.01.39 1.544-.317.534-1.01.708-1.544.39z"/>
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#1DB954] font-bold uppercase tracking-wider block">
                Spotify Studio Player
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
                onClick={() => setActiveTab('player')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'player' ? 'bg-[#1DB954] text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Player
              </button>
              <button
                onClick={() => setActiveTab('lyrics')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'lyrics' ? 'bg-[#1DB954] text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Lyrics
              </button>
              <button
                onClick={() => setActiveTab('queue')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'queue' ? 'bg-[#1DB954] text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Discography ({songs.length})
              </button>
            </div>

            <button
              onClick={handleCopySpotify}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Copy Spotify URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Share Track"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
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
          {activeTab === 'player' && (
            <div className="space-y-6">
              {/* Spotify Embed Player */}
              <div className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
                <iframe
                  key={`full-${currentSong.id}`}
                  src={spotifyEmbedUrl}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`Spotify Player - ${currentSong.title}`}
                  className="w-full block"
                />
              </div>

              {/* Track Details & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center gap-3">
                  <img 
                    src={currentSong.cover} 
                    alt={currentSong.title}
                    className="w-12 h-12 rounded-xl object-cover bg-neutral-950" 
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{currentSong.title}</h3>
                    <p className="text-xs text-neutral-400 font-mono">
                      {currentSong.artist} • {currentSong.genre} ({currentSong.year})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('lyrics')}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Lyrics</span>
                  </button>

                  <a
                    href={spotifyWebUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-1.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-neutral-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open in Spotify</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lyrics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-400">
                  Lyrics: {currentSong.title}
                </h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentSong.lyrics);
                    showToast('Lyrics copied to clipboard!', 'success');
                  }}
                  className="text-xs text-[#1DB954] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full Lyrics</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 max-h-[50vh] overflow-y-auto">
                <pre className="font-sans text-sm sm:text-base leading-relaxed text-neutral-200 whitespace-pre-wrap">
                  {currentSong.lyrics || "Lyrics for this track are being formatted."}
                </pre>
              </div>
            </div>
          )}

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
                      onClick={() => {
                        hapticBeat();
                        playSong(song);
                        setActiveTab('player');
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-[#1DB954]/15 border-[#1DB954] text-white' 
                          : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      <img src={song.cover} alt={song.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold truncate">{song.title}</h4>
                        <p className="text-[11px] text-neutral-400 font-mono">{song.genre} • {song.duration}</p>
                      </div>
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping shrink-0" />
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
