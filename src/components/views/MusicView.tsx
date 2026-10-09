import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Song, SongRelatedVideo, VideoItem } from '../../types';
import { hapticLight, hapticBeat, hapticSelection, hapticSuccess } from '../../utils/haptics';
import { formatTime } from '../../utils/helpers';
import { 
  Play, 
  Pause, 
  Search, 
  Video, 
  FileText, 
  Info, 
  Share2, 
  Sparkles, 
  Clock, 
  Calendar, 
  Music, 
  ExternalLink, 
  Disc, 
  Volume2, 
  VolumeX, 
  Check, 
  Copy, 
  Link2, 
  LayoutGrid,
  List,
  Headphones,
  Repeat,
  Shuffle,
  Gauge,
  Film,
  Download,
  Flame,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

export const MusicView: React.FC = () => {
  const { 
    songs, 
    currentSong, 
    isPlaying, 
    isBuffering,
    playSong, 
    pauseSong, 
    togglePlay, 
    playbackTime, 
    duration, 
    seekSong, 
    volume, 
    changeVolume, 
    isMuted, 
    toggleMute,
    isLoop,
    toggleLoop,
    playbackSpeed,
    setPlaybackSpeed,
    setSelectedSongId, 
    setCurrentTab, 
    openVideoPlayer, 
    openShare, 
    showToast 
  } = useStore();

  // Active track in the main hero deck
  const [activeDeckSong, setActiveDeckSong] = useState<Song>(() => {
    return currentSong || songs.find(s => s.featured) || songs[0] || ({} as Song);
  });

  // Filter & Search states
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [hasVideosOnly, setHasVideosOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'duration' | 'title'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedSongId, setCopiedSongId] = useState<string | null>(null);
  const [expandedVideoSongId, setExpandedVideoSongId] = useState<string | null>(null);

  const heroDeckRef = useRef<HTMLDivElement>(null);

  // Genres & Years for filter pills
  const genres = useMemo(() => {
    const list = new Set<string>();
    songs.forEach(s => {
      const g = s.genre.split('/')[0].trim();
      if (g) list.add(g);
    });
    return ['All', ...Array.from(list)];
  }, [songs]);

  const years = useMemo(() => {
    const list = new Set<string>();
    songs.forEach(s => {
      if (s.year) list.add(s.year.toString());
    });
    return ['All', ...Array.from(list).sort((a, b) => b.localeCompare(a))];
  }, [songs]);

  // Total related videos across all tracks
  const totalRelatedVideos = useMemo(() => {
    return songs.reduce((acc, s) => acc + (s.relatedVideos?.length || 0), 0);
  }, [songs]);

  // Filtered and sorted songs
  const filteredSongs = useMemo(() => {
    return songs
      .filter(song => {
        const matchesGenre = selectedGenre === 'All' || song.genre.toLowerCase().includes(selectedGenre.toLowerCase());
        const matchesYear = selectedYear === 'All' || song.year.toString() === selectedYear;
        const matchesVideos = !hasVideosOnly || (song.relatedVideos && song.relatedVideos.length > 0);
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          song.title.toLowerCase().includes(q) ||
          song.artist.toLowerCase().includes(q) ||
          song.description.toLowerCase().includes(q) ||
          song.genre.toLowerCase().includes(q) ||
          song.lyrics.toLowerCase().includes(q) ||
          (song.relatedVideos && song.relatedVideos.some(v => v.title.toLowerCase().includes(q) || (v.type && v.type.toLowerCase().includes(q))));
        return matchesGenre && matchesYear && matchesVideos && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.releaseDate || '2026-01-01').getTime() - new Date(a.releaseDate || '2026-01-01').getTime();
        }
        if (sortBy === 'popular') {
          return (b.playCount || 0) - (a.playCount || 0);
        }
        if (sortBy === 'duration') {
          return (b.duration || '').localeCompare(a.duration || '');
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [songs, selectedGenre, selectedYear, hasVideosOnly, searchQuery, sortBy]);

  // Keep deck track synced if currentSong changes externally
  const displayedDeckSong = currentSong || activeDeckSong || songs[0];

  // Handlers
  const handlePlaySong = (song: Song) => {
    hapticBeat();
    setActiveDeckSong(song);
    playSong(song);
  };

  const handleHeroPlayToggle = () => {
    hapticLight();
    if (!displayedDeckSong) return;
    if (currentSong?.id === displayedDeckSong.id) {
      togglePlay();
    } else {
      setActiveDeckSong(displayedDeckSong);
      playSong(displayedDeckSong);
    }
  };

  const handleOpenRelatedVideo = (video: SongRelatedVideo, song: Song, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
      description: `Official linked video for "${song.title}" by ${song.artist}.`,
      featured: song.featured,
      published: true
    };

    openVideoPlayer(videoItem);
  };

  const handleCopyAudioLink = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    hapticSuccess();
    const url = song.audioUrl || window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedSongId(song.id);
    showToast(`Copied hosted audio link for "${song.title}"`, 'success');
    setTimeout(() => setCopiedSongId(null), 2500);
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seekSong(time);
  };

  const handleShufflePlay = () => {
    if (songs.length === 0) return;
    hapticBeat();
    const randomIndex = Math.floor(Math.random() * songs.length);
    const chosen = songs[randomIndex];
    setActiveDeckSong(chosen);
    playSong(chosen);
    showToast(`Shuffled and playing "${chosen.title}"`, 'info');
  };

  const isDeckActivePlaying = currentSong?.id === displayedDeckSong?.id && isPlaying;

  return (
    <div id="music-view" className="space-y-10 max-w-7xl mx-auto px-2 sm:px-4">
      
      {/* 1. Header with Discography Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800/80 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Official Music Discography
            </span>
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
              ABM Records • Hosted Audio Vault
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-neutral-900 dark:text-white tracking-tight">
            Original Songs &amp; Videos
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
            Stream original Desi Hip-Hop anthems, lo-fi tracks, and singles hosted directly on site. Each song features complete lyrics, credits, and linked official videos.
          </p>
        </div>

        {/* Live Track & Video Counters & Quick Shuffle */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={handleShufflePlay}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            title="Shuffle play all songs"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Play</span>
          </button>

          <div className="px-3.5 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-right">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500">Songs</span>
            <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white">{songs.length} Tracks</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-right">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-red-500">Videos</span>
            <span className="text-sm font-bold font-mono text-red-500">{totalRelatedVideos} Linked</span>
          </div>
        </div>
      </div>

      {/* 2. RECREATED MASTER HERO PLAYER DECK */}
      {displayedDeckSong && (
        <section 
          ref={heroDeckRef}
          aria-label="Active Featured Song Deck"
          className="relative rounded-3xl overflow-hidden bg-neutral-950 text-white border border-neutral-800/90 shadow-2xl p-5 sm:p-8 space-y-6"
        >
          {/* Ambient Motion Backlight */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left: Album Artwork with Rotating Vinyl Disc */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900 shrink-0">
                <img 
                  src={displayedDeckSong.cover} 
                  alt={displayedDeckSong.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                />
                
                {/* Vinyl Disc Animation Overlay */}
                <motion.div 
                  animate={isDeckActivePlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-neutral-950/90 border-2 border-amber-500/50 flex items-center justify-center shadow-xl backdrop-blur-md"
                >
                  <Disc className={`w-12 h-12 ${isDeckActivePlaying ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500 absolute" />
                </motion.div>

                {/* Big Center Play / Pause Button Overlay */}
                <button
                  type="button"
                  onClick={handleHeroPlayToggle}
                  className="absolute inset-0 bg-black/40 hover:bg-black/55 flex items-center justify-center transition-colors group cursor-pointer"
                  title={isDeckActivePlaying ? "Pause Audio" : "Play Audio"}
                >
                  <div className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 active:scale-95 transition-all">
                    {isBuffering && isDeckActivePlaying ? (
                      <span className="w-6 h-6 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    ) : isDeckActivePlaying ? (
                      <Pause className="w-7 h-7 fill-current" />
                    ) : (
                      <Play className="w-7 h-7 fill-current ml-1" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Right: Metadata, Controls, Audio Link Scrubber */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Badges & Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase border border-amber-500/30">
                  {displayedDeckSong.genre}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-mono border border-neutral-700">
                  {displayedDeckSong.year}
                </span>
                {displayedDeckSong.audioUrl && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30 flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    <span>Hosted Audio Link</span>
                  </span>
                )}
                {displayedDeckSong.relatedVideos && displayedDeckSong.relatedVideos.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-mono font-semibold border border-red-500/30 flex items-center gap-1">
                    <Film className="w-3 h-3" />
                    <span>{displayedDeckSong.relatedVideos.length} Related Videos</span>
                  </span>
                )}
                {displayedDeckSong.featured && (
                  <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-mono font-semibold border border-yellow-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured Anthem</span>
                  </span>
                )}
              </div>

              {/* Title & Artist */}
              <div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
                  {displayedDeckSong.title}
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 mt-1 font-medium flex flex-wrap items-center gap-2">
                  <span>By {displayedDeckSong.artist}</span>
                  <span>•</span>
                  <span>{displayedDeckSong.duration}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-mono text-xs">
                    {(displayedDeckSong.playCount || 0).toLocaleString()} streams
                  </span>
                </p>
              </div>

              {/* Description */}
              {displayedDeckSong.description && (
                <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 leading-relaxed">
                  {displayedDeckSong.description}
                </p>
              )}

              {/* Interactive Audio Player & Scrubber Deck */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5 shadow-inner">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Headphones className="w-4 h-4" />
                    <span>{currentSong?.id === displayedDeckSong.id ? formatTime(playbackTime) : '0:00'}</span>
                    {isBuffering && currentSong?.id === displayedDeckSong.id && (
                      <span className="text-[10px] text-amber-500/80 animate-pulse font-normal">(Buffering...)</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Live Equalizer Animation */}
                    {isDeckActivePlaying && (
                      <div className="flex items-center gap-0.5 h-3">
                        {[40, 85, 55, 100, 65, 45, 90].map((h, idx) => (
                          <span 
                            key={idx} 
                            style={{ height: `${h}%` }}
                            className="w-0.5 bg-amber-400 rounded-full animate-pulse" 
                          />
                        ))}
                      </div>
                    )}
                    <span>{displayedDeckSong.duration}</span>
                  </div>
                </div>

                {/* Range Slider Scrubber */}
                <input 
                  type="range"
                  min={0}
                  max={currentSong?.id === displayedDeckSong.id ? (duration || 200) : 200}
                  value={currentSong?.id === displayedDeckSong.id ? playbackTime : 0}
                  onChange={handleScrubberChange}
                  disabled={currentSong?.id !== displayedDeckSong.id}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />

                {/* Audio Source Bar: URL, Loop, Speed, Copy Link, Volume */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-neutral-400">
                  <div className="flex items-center gap-2 truncate max-w-xs sm:max-w-md">
                    <span className="font-mono text-neutral-500 shrink-0">Source:</span>
                    <span className="truncate text-neutral-300 font-mono text-[10px]" title={displayedDeckSong.audioUrl}>
                      {displayedDeckSong.audioFileName || (displayedDeckSong.audioUrl ? displayedDeckSong.audioUrl : 'Synthesizer Audio')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {/* Speed selector */}
                    <div className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded-lg border border-neutral-800">
                      <Gauge className="w-3 h-3 text-neutral-400" />
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                        className="bg-transparent text-amber-400 font-mono text-[10px] cursor-pointer focus:outline-hidden"
                        title="Playback Speed"
                      >
                        <option value={0.75} className="bg-neutral-900 text-white">0.75x</option>
                        <option value={1.0} className="bg-neutral-900 text-white">1.0x</option>
                        <option value={1.25} className="bg-neutral-900 text-white">1.25x</option>
                        <option value={1.5} className="bg-neutral-900 text-white">1.5x</option>
                      </select>
                    </div>

                    {/* Loop Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        hapticLight();
                        toggleLoop();
                      }}
                      className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                        isLoop 
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                      title={isLoop ? 'Loop Enabled' : 'Enable Loop'}
                    >
                      <Repeat className="w-3.5 h-3.5" />
                    </button>

                    {/* Volume Mute Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        hapticLight();
                        toggleMute();
                      }}
                      className="p-1 rounded-lg bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>

                    {/* Copy Audio URL */}
                    {displayedDeckSong.audioUrl && (
                      <button
                        type="button"
                        onClick={(e) => handleCopyAudioLink(displayedDeckSong, e)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                        title="Copy direct hosted audio URL"
                      >
                        {copiedSongId === displayedDeckSong.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSongId === displayedDeckSong.id ? 'Copied' : 'Copy Audio URL'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleHeroPlayToggle}
                  className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {isDeckActivePlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Play Hosted Track</span>
                    </>
                  )}
                </button>

                {displayedDeckSong.lyrics && (
                  <button
                    type="button"
                    onClick={() => {
                      hapticLight();
                      setCurrentTab('lyrics');
                    }}
                    className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Lyrics</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    setSelectedSongId(displayedDeckSong.id);
                  }}
                  className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Track Details</span>
                </button>

                {displayedDeckSong.audioUrl && (
                  <a
                    href={displayedDeckSong.audioUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={displayedDeckSong.audioFileName || `${displayedDeckSong.slug}.mp3`}
                    className="px-3.5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Open / Download Hosted Audio File"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Audio File</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    openShare({
                      type: 'song',
                      title: `${displayedDeckSong.title} — Arjun Bharti Mina`,
                      text: `Listen to "${displayedDeckSong.title}" (${displayedDeckSong.year}) by ${displayedDeckSong.artist}.`,
                      url: `${window.location.origin}/?section=music&song=${displayedDeckSong.id}`,
                      imageUrl: displayedDeckSong.cover
                    });
                  }}
                  className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
                  title="Share Track"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* 3. RELATED VIDEOS FOR ACTIVE SONG ROW (CORE USER FEATURE) */}
          {displayedDeckSong.relatedVideos && displayedDeckSong.relatedVideos.length > 0 && (
            <div className="pt-4 border-t border-neutral-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-400" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200">
                    Related Videos for "{displayedDeckSong.title}"
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-mono font-semibold border border-red-500/20">
                    {displayedDeckSong.relatedVideos.length} Videos
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 hidden sm:inline">
                  Click any video to play in theater mode
                </span>
              </div>

              {/* Related Videos Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {displayedDeckSong.relatedVideos.map((video, vIdx) => (
                  <div
                    key={video.id || `rel-vid-${vIdx}`}
                    onClick={(e) => handleOpenRelatedVideo(video, displayedDeckSong, e)}
                    className="group relative flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800/90 hover:border-red-500/50 cursor-pointer transition-all shadow-md hover:scale-[1.01]"
                  >
                    {/* Thumbnail with red play overlay */}
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                      <img 
                        src={video.thumbnail || displayedDeckSong.cover} 
                        alt={video.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-red-950/40 flex items-center justify-center transition-colors">
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                      {video.duration && (
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono font-bold text-white">
                          {video.duration}
                        </span>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[9px] font-mono font-semibold uppercase truncate">
                          {video.type || 'Video'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-neutral-200 group-hover:text-white line-clamp-1 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        Watch Official Video
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      )}

      {/* 3. DISCOVERY, FILTERING & SEARCH TOOLBAR */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search by song, lyrics, genre, or video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 text-xs sm:text-sm focus:outline-hidden focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Has Videos Only, Sort & View Mode */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Filter by has videos */}
            <button
              type="button"
              onClick={() => {
                hapticLight();
                setHasVideosOnly(!hasVideosOnly);
              }}
              className={`px-3 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasVideosOnly 
                  ? 'bg-red-500/15 text-red-500 border-red-500/40' 
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-700'
              }`}
              title="Show only songs that have linked videos"
            >
              <Film className="w-3.5 h-3.5" />
              <span>With Videos</span>
            </button>

            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="latest">Newest First</option>
              <option value="popular">Most Streamed</option>
              <option value="title">Title (A-Z)</option>
              <option value="duration">Duration</option>
            </select>

            {/* View Mode Toggle: Grid vs List */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-neutral-800 text-amber-500 shadow-xs' 
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-neutral-800 text-amber-500 shadow-xs' 
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title="Compact List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Genre & Year Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 overflow-x-auto pb-1 scrollbar-none">
          {genres.map(genre => (
            <button
              key={genre}
              type="button"
              onClick={() => {
                hapticLight();
                setSelectedGenre(genre);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 ${
                selectedGenre === genre
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {genre}
            </button>
          ))}

          <span className="text-neutral-400 mx-1">•</span>

          {years.map(year => (
            <button
              key={year}
              type="button"
              onClick={() => {
                hapticLight();
                setSelectedYear(year);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer shrink-0 ${
                selectedYear === year
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 hover:text-white border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* 4. SONGS CATALOG (GRID OR LIST) */}
      {filteredSongs.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-300 dark:border-neutral-800">
          <Music className="w-10 h-10 text-neutral-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">No tracks match your query</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, genre filter, or clearing the filter options.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedGenre('All');
              setSelectedYear('All');
              setHasVideosOnly(false);
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-full bg-amber-500 text-neutral-950 font-bold text-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW OF SONGS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSongs.map((song) => {
            const isPlayingThis = currentSong?.id === song.id && isPlaying;
            const hasVideos = song.relatedVideos && song.relatedVideos.length > 0;
            const isVideoExpanded = expandedVideoSongId === song.id;

            return (
              <div
                key={song.id}
                className="group relative rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Artwork with play trigger */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                  <img 
                    src={song.cover} 
                    alt={song.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-mono font-bold uppercase border border-amber-500/30">
                      {song.genre}
                    </span>
                    {song.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Play overlay button */}
                  <button
                    type="button"
                    onClick={() => handlePlaySong(song)}
                    className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/45 transition-colors cursor-pointer"
                    title={isPlayingThis ? "Pause" : "Play Track"}
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 active:scale-95 transition-all">
                      {isPlayingThis ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </div>
                  </button>

                  {/* Bottom track stats overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/90">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {song.duration}
                    </span>
                    <span className="text-amber-400">
                      {(song.playCount || 0).toLocaleString()} plays
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 
                      onClick={() => setSelectedSongId(song.id)}
                      className="text-lg font-bold text-neutral-900 dark:text-white hover:text-amber-500 transition-colors cursor-pointer truncate"
                      title={song.title}
                    >
                      {song.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate mt-0.5">
                      {song.artist} • {song.year}
                    </p>
                  </div>

                  {/* Hosted Audio status & Related Videos Pill */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                    {song.audioUrl && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        <Link2 className="w-3 h-3" /> Hosted Link
                      </span>
                    )}

                    {hasVideos && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedVideoSongId(isVideoExpanded ? null : song.id);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-red-600 dark:text-red-400 font-semibold bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                        title="Click to view linked videos"
                      >
                        <Video className="w-3 h-3" />
                        <span>{song.relatedVideos!.length} Videos {isVideoExpanded ? '▲' : '▼'}</span>
                      </button>
                    )}
                  </div>

                  {/* Expandable Related Videos Sub-deck inside card */}
                  {hasVideos && isVideoExpanded && (
                    <div className="pt-2 space-y-1.5 animate-in fade-in duration-200">
                      <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                        Linked Videos:
                      </div>
                      <div className="space-y-1">
                        {song.relatedVideos!.map((vid, vidIdx) => (
                          <div
                            key={vid.id || vidIdx}
                            onClick={(e) => handleOpenRelatedVideo(vid, song, e)}
                            className="flex items-center justify-between p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-500/10 text-neutral-800 dark:text-neutral-200 text-xs font-medium cursor-pointer transition-colors"
                          >
                            <span className="truncate flex items-center gap-1.5">
                              <Play className="w-3 h-3 text-red-500 shrink-0" />
                              <span className="truncate">{vid.title}</span>
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400 shrink-0 ml-1">
                              {vid.duration || 'Watch'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => handlePlaySong(song)}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {isPlayingThis ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isPlayingThis ? 'Pause' : 'Play'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {song.audioUrl && (
                        <button
                          type="button"
                          onClick={(e) => handleCopyAudioLink(song, e)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Copy Hosted Audio URL"
                        >
                          {copiedSongId === song.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedSongId(song.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="View Track Details"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          hapticLight();
                          openShare({
                            type: 'song',
                            title: `${song.title} — Arjun Bharti Mina`,
                            text: `Listen to "${song.title}" (${song.year}) by ${song.artist}.`,
                            url: `${window.location.origin}/?section=music&song=${song.id}`,
                            imageUrl: song.cover
                          });
                        }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Share Track"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* COMPACT LIST VIEW OF SONGS */
        <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800">
          {filteredSongs.map((song, idx) => {
            const isPlayingThis = currentSong?.id === song.id && isPlaying;
            const hasVideos = song.relatedVideos && song.relatedVideos.length > 0;

            return (
              <div
                key={song.id}
                onClick={() => handlePlaySong(song)}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors cursor-pointer ${
                  isPlayingThis ? 'bg-amber-500/10' : ''
                }`}
              >
                {/* Track Index / Play Icon & Artwork */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <span className="w-6 text-center font-mono text-xs text-neutral-400 shrink-0">
                    {isPlayingThis ? (
                      <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping inline-block" />
                    ) : (
                      idx + 1
                    )}
                  </span>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-200 dark:border-neutral-800">
                    <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                    {isPlayingThis && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Pause className="w-4 h-4 text-amber-400 fill-current" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {song.title}
                      </h4>
                      {song.featured && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Featured" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate mt-0.5">
                      {song.artist} • <span className="font-mono">{song.genre}</span>
                    </p>
                  </div>
                </div>

                {/* Badges, Videos Count & Actions */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  {hasVideos && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (song.relatedVideos && song.relatedVideos[0]) {
                          handleOpenRelatedVideo(song.relatedVideos[0], song, e);
                        }
                      }}
                      className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-mono font-semibold transition-colors cursor-pointer"
                      title="Watch Linked Video"
                    >
                      <Film className="w-3 h-3" />
                      <span>{song.relatedVideos!.length} Videos</span>
                    </button>
                  )}

                  <span className="hidden sm:inline font-mono text-xs text-neutral-400">
                    {song.duration}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSongId(song.id);
                    }}
                    className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Track Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. ALL LINKED VIDEOS SHOWCASE VAULT */}
      {totalRelatedVideos > 0 && (
        <section className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-red-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Official Video Showcase
              </span>
              <h2 className="text-2xl font-display font-black text-neutral-900 dark:text-white">
                All Linked Music &amp; Studio Videos
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              {totalRelatedVideos} Videos Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {songs.flatMap(s => (s.relatedVideos || []).map(vid => ({ ...vid, parentSong: s }))).map((videoItem, idx) => (
              <div
                key={`vault-vid-${idx}`}
                onClick={(e) => handleOpenRelatedVideo(videoItem, videoItem.parentSong, e)}
                className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-red-500/50 cursor-pointer shadow-md transition-all hover:scale-[1.02]"
              >
                <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden">
                  <img 
                    src={videoItem.thumbnail || videoItem.parentSong.cover} 
                    alt={videoItem.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-red-950/40 flex items-center justify-center transition-colors">
                    <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  {videoItem.duration && (
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-mono text-white font-bold">
                      {videoItem.duration}
                    </span>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] font-mono text-red-400 border border-red-500/30 uppercase font-bold">
                    {videoItem.type || 'Video'}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-bold text-white group-hover:text-red-400 line-clamp-1 transition-colors">
                    {videoItem.title}
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate">
                    Song: {videoItem.parentSong.title} ({videoItem.parentSong.year})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
