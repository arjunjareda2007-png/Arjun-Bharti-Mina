import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Play, 
  Pause, 
  ExternalLink, 
  Share2, 
  Calendar, 
  Clock, 
  Music2, 
  Copy, 
  Radio, 
  Video, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const SongDetailModal: React.FC = () => {
  const { 
    selectedSongId, 
    setSelectedSongId, 
    songs, 
    playSong, 
    currentSong, 
    isPlaying, 
    togglePlay, 
    openShare,
    openVideoPlayer,
    videos,
    setCurrentTab,
    setSelectedLyricId
  } = useStore();

  const [copied, setCopied] = React.useState(false);

  if (!selectedSongId) return null;

  const song = songs.find(s => s.id === selectedSongId);
  if (!song) return null;

  const isCurrentActive = currentSong?.id === song.id;
  const relatedSongs = songs.filter(s => s.id !== song.id && (s.genre === song.genre || s.year === song.year)).slice(0, 3);
  
  const matchedVideo = videos.find(v => v.title.toLowerCase().includes(song.title.toLowerCase())) || 
    (song.youtubeEmbedId || (song.streamingLinks?.youtube && song.streamingLinks.youtube.includes('watch')) ? {
      id: `song-vid-${song.id}`,
      title: `${song.title} (Official Visualizer)`,
      youtubeEmbedId: song.youtubeEmbedId || (song.streamingLinks?.youtube?.split('v=')[1]?.split('&')[0] || 'dQw4w9WgXcQ'),
      youtubeUrl: song.streamingLinks?.youtube || `https://youtube.com/watch?v=${song.youtubeEmbedId}`,
      thumbnail: song.cover,
      category: 'Music Video' as const,
      duration: song.duration,
      description: `Official music video for "${song.title}" by ${song.artist}.`,
      viewsCount: 'Official',
      date: song.releaseDate,
      featured: song.featured,
      published: true
    } : null);

  const handleCopyLyrics = () => {
    navigator.clipboard.writeText(song.lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    openShare({
      type: 'song',
      title: `${song.title} — Arjun Bharti Mina`,
      text: `${song.genre} (${song.year}) by ${song.artist}. Official stream available.`,
      url: `${window.location.origin}/#music?song=${song.id}`,
      imageUrl: song.cover,
      artist: song.artist,
      genre: song.genre,
      year: song.year,
      lyricsText: song.lyrics,
      streamingLinks: song.streamingLinks,
      downloadFilename: `${song.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poster.jpg`
    });
  };

  return (
    <div 
      id="song-detail-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={() => setSelectedSongId(null)}
    >
      <div 
        id="song-detail-card"
        className="w-full max-w-4xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-semibold">
              Official Track Release
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              title="Share Track"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedSongId(null)}
              className="p-2 rounded-full text-neutral-500 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Album Cover Art */}
            <div className="md:col-span-5 relative group rounded-2xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 aspect-square bg-neutral-950">
              <img 
                src={song.cover} 
                alt={song.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => isCurrentActive ? togglePlay() : playSong(song)}
                className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                title={isCurrentActive && isPlaying ? "Pause Track" : "Play Track"}
              >
                {isCurrentActive && isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-1" />
                )}
              </button>
            </div>

            {/* Song Meta Information */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold block">
                  {song.genre}
                </span>
                <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight mt-1">
                  {song.title}
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  By <span className="font-semibold text-neutral-900 dark:text-neutral-200">{song.artist}</span>
                </p>
              </div>

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 font-mono">
                <span className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                  <Calendar className="w-3.5 h-3.5" />
                  {song.releaseDate}
                </span>
                <span className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5" />
                  {song.duration}
                </span>
                <span className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                  <Music2 className="w-3.5 h-3.5 text-amber-500" />
                  {song.language}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {song.description}
              </p>

              {/* Quick Play & Action Button Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => isCurrentActive ? togglePlay() : playSong(song)}
                  className="px-6 py-2.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs flex items-center gap-2 shadow-md hover:opacity-90 transition-all"
                >
                  {isCurrentActive && isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Preview</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play Track Preview</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyLyrics}
                  className="px-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Lyrics'}</span>
                </button>
              </div>

              {/* Streaming Platforms Hub */}
              {song.streamingLinks && Object.values(song.streamingLinks).some(Boolean) && (
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2">
                    Stream On
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {song.streamingLinks.spotify && (
                      <a
                        href={song.streamingLinks.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-[#1DB954] text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>Spotify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {song.streamingLinks.youtube && (
                      <a
                        href={song.streamingLinks.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {song.streamingLinks.jiosaavn && (
                      <a
                        href={song.streamingLinks.jiosaavn}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <span>JioSaavn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {song.streamingLinks.gaana && (
                      <a
                        href={song.streamingLinks.gaana}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <span>Gaana</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Credits Matrix */}
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-4 font-semibold">
              Production & Songwriting Credits
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block text-[11px]">Lead Artist</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{song.credits?.artist || song.artist || 'Arjun Bharti Mina'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Lyrics & Songwriting</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{song.credits?.lyrics || 'Arjun Bharti Mina'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Music & Arrangement</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{song.credits?.music || 'Studio Beats'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Studio Production</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{song.credits?.production || 'ABM Records'}</span>
              </div>
              {song.credits?.mixMaster && (
                <div>
                  <span className="text-neutral-500 block text-[11px]">Mix & Mastering</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{song.credits.mixMaster}</span>
                </div>
              )}
              {song.credits?.label && (
                <div>
                  <span className="text-neutral-500 block text-[11px]">Record Label</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{song.credits.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Video Section if available */}
          {matchedVideo && (
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-red-500">Official Visualizer</span>
                  <h3 className="text-base font-bold">{matchedVideo.title}</h3>
                </div>
                <button
                  onClick={() => openVideoPlayer(matchedVideo)}
                  className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Video</span>
                </button>
              </div>
            </div>
          )}

          {/* Full Lyrics View */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                Official Lyrics
              </h3>
              <button
                onClick={handleCopyLyrics}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy All'}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 font-sans whitespace-pre-line select-text">
              {song.lyrics}
            </div>
          </div>

          {/* Related Songs */}
          {relatedSongs.length > 0 && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                More Music by Arjun Bharti Mina
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedSongs.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedSongId(rel.id);
                      playSong(rel);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 cursor-pointer transition-all group"
                  >
                    <img src={rel.cover} alt={rel.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors truncate">
                        {rel.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 truncate">{rel.genre}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
