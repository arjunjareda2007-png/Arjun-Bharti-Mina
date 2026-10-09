import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SongRelatedVideo, VideoItem } from '../types';
import { formatTime } from '../utils/helpers';
import { hapticLight, hapticBeat, hapticSelection, hapticSuccess } from '../utils/haptics';
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
  Video, 
  Check, 
  Sparkles,
  Link2,
  FileText,
  Headphones,
  Volume2,
  VolumeX,
  Disc,
  Download,
  Film
} from 'lucide-react';

export const SongDetailModal: React.FC = () => {
  const { 
    selectedSongId, 
    setSelectedSongId, 
    songs, 
    playSong, 
    togglePlay,
    currentSong, 
    isPlaying, 
    playbackTime,
    duration,
    seekSong,
    openShare,
    openVideoPlayer,
    setCurrentTab,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'lyrics' | 'credits'>('overview');
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [copiedAudioUrl, setCopiedAudioUrl] = useState(false);

  if (!selectedSongId) return null;

  const song = songs.find(s => s.id === selectedSongId);
  if (!song) return null;

  const isCurrentActive = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentActive && isPlaying;
  const relatedSongs = songs.filter(s => s.id !== song.id && (s.genre === song.genre || s.year === song.year)).slice(0, 3);
  const hasVideos = song.relatedVideos && song.relatedVideos.length > 0;

  const handleCopyLyrics = () => {
    navigator.clipboard.writeText(song.lyrics);
    setCopiedLyrics(true);
    showToast('Lyrics copied to clipboard', 'success');
    setTimeout(() => setCopiedLyrics(false), 2000);
  };

  const handleCopyAudioLink = () => {
    if (!song.audioUrl) return;
    navigator.clipboard.writeText(song.audioUrl);
    setCopiedAudioUrl(true);
    showToast('Hosted audio link copied to clipboard', 'success');
    setTimeout(() => setCopiedAudioUrl(false), 2000);
  };

  const handleOpenRelatedVideo = (video: SongRelatedVideo) => {
    hapticSelection();
    const videoItem: VideoItem = {
      id: video.id || `rel-vid-${song.id}-${Date.now()}`,
      title: video.title || `${song.title} (${video.type || 'Video'})`,
      youtubeUrl: video.youtubeUrl,
      youtubeEmbedId: video.youtubeEmbedId || video.youtubeUrl.split('v=')[1]?.split('&')[0] || 'fJ9rUzIMcZQ',
      thumbnail: video.thumbnail || song.cover,
      category: (video.type as any) || 'Music Video',
      duration: video.duration || song.duration || '3:30',
      date: song.releaseDate,
      description: `Official related video for "${song.title}" by ${song.artist}.`,
      featured: song.featured,
      published: true
    };
    openVideoPlayer(videoItem);
  };

  const handleShare = () => {
    hapticLight();
    openShare({
      type: 'song',
      title: `${song.title} — Arjun Bharti Mina`,
      text: `${song.genre} (${song.year}) by ${song.artist}. Stream available directly on site.`,
      url: `${window.location.origin}/?section=music&song=${song.id}`,
      imageUrl: song.cover,
      artist: song.artist,
      genre: song.genre,
      year: song.year,
      lyricsText: song.lyrics,
      streamingLinks: song.streamingLinks
    });
  };

  return (
    <div 
      id="song-detail-backdrop"
      className="fixed inset-0 z-[6000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={() => setSelectedSongId(null)}
    >
      <div 
        id="song-detail-card"
        className="w-full max-w-4xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-950/90">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-bold border border-amber-500/20">
              Track Release
            </span>
            {song.featured && (
              <span className="text-[11px] font-mono uppercase bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Featured Anthem</span>
              </span>
            )}
            {hasVideos && (
              <span className="text-[11px] font-mono uppercase bg-red-500/10 text-red-500 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Film className="w-3 h-3" />
                <span>{song.relatedVideos!.length} Videos</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Share Track"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedSongId(null)}
              className="p-2 rounded-full text-neutral-500 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          
          {/* Track Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Album Cover Art */}
            <div className="md:col-span-5 relative group rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 aspect-square bg-neutral-950">
              <img 
                src={song.cover} 
                alt={song.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Spinning Disc Effect */}
              {isCurrentlyPlaying && (
                <div className="absolute top-3 right-3 w-14 h-14 rounded-full bg-neutral-950/90 border border-amber-500/50 flex items-center justify-center animate-spin">
                  <Disc className="w-9 h-9 text-amber-400" />
                </div>
              )}

              {/* Play / Pause Overlay Button */}
              <button
                type="button"
                onClick={() => {
                  hapticBeat();
                  if (isCurrentActive) {
                    togglePlay();
                  } else {
                    playSong(song);
                  }
                }}
                className="absolute inset-0 bg-black/40 group-hover:bg-black/55 flex items-center justify-center transition-colors cursor-pointer"
                title={isCurrentlyPlaying ? 'Pause Audio' : 'Play Hosted Track'}
              >
                <div className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 active:scale-95 transition-all">
                  {isCurrentlyPlaying ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-1" />
                  )}
                </div>
              </button>
            </div>

            {/* Track Info & Hosted Audio Controls */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase border border-amber-500/20">
                    {song.genre}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    Released {song.releaseDate}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-display font-black text-neutral-900 dark:text-white tracking-tight">
                  {song.title}
                </h2>
                <p className="text-base font-medium text-neutral-600 dark:text-neutral-300 mt-1">
                  By {song.artist}
                </p>
              </div>

              {/* Story / Description */}
              {song.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {song.description}
                </p>
              )}

              {/* Hosted Audio Player Control Bar */}
              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                    <Headphones className="w-4 h-4" />
                    <span>{isCurrentActive ? formatTime(playbackTime) : '0:00'}</span>
                  </div>
                  <span>{song.duration}</span>
                </div>

                <input 
                  type="range"
                  min={0}
                  max={isCurrentActive ? (duration || 200) : 200}
                  value={isCurrentActive ? playbackTime : 0}
                  onChange={(e) => seekSong(parseFloat(e.target.value))}
                  disabled={!isCurrentActive}
                  className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-neutral-500 truncate max-w-[200px]">
                    <Link2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-mono truncate">{song.audioFileName || (song.audioUrl ? 'Hosted Audio Link' : 'Synth Audio')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {song.audioUrl && (
                      <button
                        type="button"
                        onClick={handleCopyAudioLink}
                        className="text-amber-500 hover:text-amber-400 font-mono flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy direct audio URL"
                      >
                        {copiedAudioUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAudioUrl ? 'Copied' : 'Copy Audio URL'}</span>
                      </button>
                    )}

                    {song.audioUrl && (
                      <a
                        href={song.audioUrl}
                        target="_blank"
                        rel="noreferrer"
                        download={song.audioFileName || `${song.slug}.mp3`}
                        className="text-neutral-600 dark:text-neutral-300 hover:text-amber-500 font-mono flex items-center gap-1 transition-colors"
                        title="Download audio file"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    hapticBeat();
                    if (isCurrentActive) {
                      togglePlay();
                    } else {
                      playSong(song);
                    }
                  }}
                  className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {isCurrentlyPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Track</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Play Track</span>
                    </>
                  )}
                </button>

                {hasVideos && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('videos')}
                    className="px-4 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Watch Videos ({song.relatedVideos!.length})</span>
                  </button>
                )}

                {song.lyrics && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('lyrics')}
                    className="px-4 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                    <span>View Lyrics</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Tab Navigation for Extended Details */}
          <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-neutral-950 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Overview &amp; Credits
            </button>

            {hasVideos && (
              <button
                type="button"
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'videos'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-red-500'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Related Videos ({song.relatedVideos!.length})</span>
              </button>
            )}

            {song.lyrics && (
              <button
                type="button"
                onClick={() => setActiveTab('lyrics')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'lyrics'
                    ? 'bg-amber-500 text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lyrics</span>
              </button>
            )}
          </div>

          {/* TAB 1: OVERVIEW & CREDITS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Production Credits Card */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                  Track Credits &amp; Production
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="block text-neutral-500 dark:text-neutral-400 text-[10px] font-mono">Lead Artist</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{song.credits.artist}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-500 dark:text-neutral-400 text-[10px] font-mono">Lyrics By</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{song.credits.lyrics}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-500 dark:text-neutral-400 text-[10px] font-mono">Music &amp; Beat</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{song.credits.music}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-500 dark:text-neutral-400 text-[10px] font-mono">Audio Production</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{song.credits.production}</span>
                  </div>
                  {song.credits.mixMaster && (
                    <div>
                      <span className="block text-neutral-500 dark:text-neutral-400 text-[10px] font-mono">Mix &amp; Master</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{song.credits.mixMaster}</span>
                    </div>
                  )}
                  {song.credits.label && (
                    <div>
                      <span className="block text-neutral-500 dark:text-neutral-400 text-[10px] font-mono">Record Label</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{song.credits.label}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* External Streaming Links */}
              {song.streamingLinks && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold">
                    Also Available On
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {song.streamingLinks.spotify && (
                      <a
                        href={song.streamingLinks.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-[#1DB954] hover:text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <span>Spotify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {song.streamingLinks.youtube && (
                      <a
                        href={song.streamingLinks.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-[#FF0000] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <span>YouTube Music</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {song.streamingLinks.appleMusic && (
                      <a
                        href={song.streamingLinks.appleMusic}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <span>Apple Music</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {song.streamingLinks.jiosaavn && (
                      <a
                        href={song.streamingLinks.jiosaavn}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <span>JioSaavn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: RELATED VIDEOS (CORE USER FEATURE) */}
          {activeTab === 'videos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Related Videos for "{song.title}"
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Official music video, lyrical breakdown, and studio making videos.
                  </p>
                </div>
                <span className="text-xs font-mono text-neutral-400">
                  {song.relatedVideos?.length || 0} Videos
                </span>
              </div>

              {hasVideos ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {song.relatedVideos!.map((vid, vidIdx) => (
                    <div
                      key={vid.id || vidIdx}
                      onClick={() => handleOpenRelatedVideo(vid)}
                      className="group rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 hover:border-red-500/50 cursor-pointer transition-all hover:scale-[1.02] shadow-md"
                    >
                      <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden">
                        <img 
                          src={vid.thumbnail || song.cover} 
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
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-red-500 transition-colors line-clamp-2">
                          {vid.title}
                        </h4>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          Click to play in theatre mode
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-400 text-xs">
                  No related videos added for this track yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LYRICS */}
          {activeTab === 'lyrics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <span className="text-xs font-mono uppercase text-neutral-400 font-bold">
                  Official Lyrics
                </span>
                <button
                  type="button"
                  onClick={handleCopyLyrics}
                  className="text-xs text-amber-500 font-semibold flex items-center gap-1 hover:text-amber-400 cursor-pointer"
                >
                  {copiedLyrics ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLyrics ? 'Copied' : 'Copy Full Lyrics'}</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 max-h-[50vh] overflow-y-auto">
                <pre className="font-sans text-sm sm:text-base leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                  {song.lyrics || 'Lyrics are being transcribed for this track.'}
                </pre>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
