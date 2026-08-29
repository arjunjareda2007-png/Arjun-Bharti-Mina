import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Song } from '../../types';
import { 
  getSpotifyEmbedForSong, 
  getSpotifyWebUrlForSong, 
  getSpotifyTrackId,
  DEFAULT_SPOTIFY_ARTIST_ID 
} from '../../utils/spotifyUtils';
import { hapticLight, hapticBeat, hapticSelection, hapticSuccess } from '../../utils/haptics';
import { 
  Search, 
  Filter, 
  FileText, 
  Radio, 
  ExternalLink, 
  Clock, 
  Calendar, 
  ArrowRight,
  Disc3,
  SlidersHorizontal,
  Share2,
  Video,
  Sparkles,
  Maximize2,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List
} from 'lucide-react';

export const MusicView: React.FC = () => {
  const { 
    songs, 
    currentSong, 
    playSong, 
    setSelectedSongId, 
    setCurrentTab, 
    setSelectedLyricId,
    openShare,
    openFullScreenPlayer,
    showToast
  } = useStore();

  // Active track for the main Spotify streaming deck
  const [activeDeckSong, setActiveDeckSong] = useState<Song>(
    currentSong || songs.find(s => s.featured) || songs[0]
  );

  // Spotify Player Size in main deck: 'standard' (152px compact) | 'expanded' (352px full album art player)
  const [deckSize, setDeckSize] = useState<'standard' | 'expanded'>('standard');

  // Inline expanded Spotify players for individual cards (key: song.id -> boolean)
  const [inlineEmbeds, setInlineEmbeds] = useState<Record<string, boolean>>({});

  // Filter state
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const deckRef = useRef<HTMLDivElement>(null);

  const genres = ['All', ...Array.from(new Set(songs.map(s => s.genre.split('/')[0].trim())))];
  const years = ['All', ...Array.from(new Set(songs.map(s => s.year.toString())))].sort((a: string, b: string) => b.localeCompare(a));

  const filteredSongs = songs.filter(song => {
    const matchesGenre = selectedGenre === 'All' || song.genre.includes(selectedGenre);
    const matchesYear = selectedYear === 'All' || song.year.toString() === selectedYear;
    const matchesSearch = !searchQuery || 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesYear && matchesSearch;
  });

  const handleSelectDeckSong = (song: Song, scroll: boolean = false) => {
    hapticBeat();
    setActiveDeckSong(song);
    playSong(song);
    if (scroll && deckRef.current) {
      deckRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleInlineEmbed = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    hapticSelection();
    setInlineEmbeds(prev => ({
      ...prev,
      [songId]: !prev[songId]
    }));
  };

  const copySpotifyLink = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    hapticSuccess();
    const url = getSpotifyWebUrlForSong(song);
    navigator.clipboard.writeText(url);
    setCopiedLink(song.id);
    showToast(`Copied Spotify link for "${song.title}"`, 'success');
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const spotifyEmbedUrl = activeDeckSong ? getSpotifyEmbedForSong(activeDeckSong) : '';
  const spotifyWebUrl = activeDeckSong ? getSpotifyWebUrlForSong(activeDeckSong) : '';

  return (
    <div id="music-view" className="space-y-10 max-w-7xl mx-auto">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1DB954]/15 border border-[#1DB954]/30 text-[#1DB954] text-[11px] font-mono font-bold uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
              Spotify Official Streaming
            </span>
            <span className="text-xs font-mono text-neutral-400">ABM Records</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Music Discography
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            Stream official original tracks, singles, and collaborative hip-hop releases by Arjun Bharti Mina directly via Spotify Embedded Player.
          </p>
        </div>

        {/* Action badges */}
        <div className="flex items-center gap-2">
          <a
            href="https://open.spotify.com/artist/arjunbhartimina"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-neutral-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#1DB954]/20 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.354-.677.466-1.031.251-2.822-1.724-6.374-2.114-10.558-1.159-.404.093-.807-.16-.9-.564-.093-.404.16-.807.564-.9 4.582-1.047 8.514-.606 11.674 1.341.354.215.466.677.251 1.032zm1.47-3.266c-.27.44-.848.58-1.288.31-3.23-1.985-8.154-2.559-11.974-1.4-1.498.455-.499-.33-.954-.83-.455-.499.33-.954.83-1.498 4.37-1.326 9.805-.688 13.518 1.588.44.27.58.848.31 1.288zm.126-3.414c-3.873-2.3-10.258-2.512-13.966-1.385-.594.18-1.222-.156-1.402-.75-.18-.594.156-1.222.75-1.402 4.26-1.294 11.298-1.043 15.753 1.603.534.317.708 1.01.39 1.544-.317.534-1.01.708-1.544.39z"/>
            </svg>
            <span>Follow on Spotify</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 2. MAIN SPOTIFY EMBEDDED STREAMING DECK */}
      {activeDeckSong && (
        <div 
          ref={deckRef}
          id="spotify-hero-deck"
          className="relative rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl p-4 sm:p-6 overflow-hidden ring-1 ring-white/10"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1DB954]/10 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

          {/* Top Deck Info Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1DB954] text-neutral-950 flex items-center justify-center font-bold shadow-md shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.354-.677.466-1.031.251-2.822-1.724-6.374-2.114-10.558-1.159-.404.093-.807-.16-.9-.564-.093-.404.16-.807.564-.9 4.582-1.047 8.514-.606 11.674 1.341.354.215.466.677.251 1.032zm1.47-3.266c-.27.44-.848.58-1.288.31-3.23-1.985-8.154-2.559-11.974-1.4-1.498.455-.499-.33-.954-.83-.455-.499.33-.954.83-1.498 4.37-1.326 9.805-.688 13.518 1.588.44.27.58.848.31 1.288zm.126-3.414c-3.873-2.3-10.258-2.512-13.966-1.385-.594.18-1.222-.156-1.402-.75-.18-.594.156-1.222.75-1.402 4.26-1.294 11.298-1.043 15.753 1.603.534.317.708 1.01.39 1.544-.317.534-1.01.708-1.544.39z"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase font-bold text-[#1DB954]">
                    Now Playing in Spotify Embed
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                    {activeDeckSong.year}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {activeDeckSong.title}
                </h2>
              </div>
            </div>

            {/* Deck Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setDeckSize(deckSize === 'standard' ? 'expanded' : 'standard')}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title={deckSize === 'standard' ? "Switch to Expanded Player" : "Switch to Compact Player"}
              >
                {deckSize === 'standard' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                <span>{deckSize === 'standard' ? 'Expand View' : 'Compact View'}</span>
              </button>

              <button
                onClick={(e) => copySpotifyLink(activeDeckSong, e)}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Spotify Link"
              >
                {copiedLink === activeDeckSong.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <a
                href={spotifyWebUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>Open in App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Embedded Spotify IFrame */}
          <div className="relative z-10 my-4 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-inner">
            <iframe
              key={`deck-${activeDeckSong.id}-${deckSize}`}
              src={spotifyEmbedUrl}
              width="100%"
              height={deckSize === 'expanded' ? "352" : "152"}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`Spotify Embed - ${activeDeckSong.title}`}
              className="w-full transition-all duration-300 block"
            />
          </div>

          {/* Quick Discography Strip to switch tracks in Spotify embed */}
          <div className="relative z-10 pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Select Track to Embed in Spotify Deck ({songs.length} Tracks):
              </span>
              <span className="text-[11px] font-mono text-[#1DB954]">
                Click track to stream
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {songs.map((song) => {
                const isActive = activeDeckSong.id === song.id;
                return (
                  <button
                    key={`strip-${song.id}`}
                    onClick={() => handleSelectDeckSong(song)}
                    className={`p-2 rounded-xl flex items-center gap-2.5 text-left transition-all cursor-pointer border ${
                      isActive 
                        ? 'bg-[#1DB954]/15 border-[#1DB954] text-white shadow-md' 
                        : 'bg-neutral-900/80 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-neutral-950">
                      <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                      {isActive && (
                        <div className="absolute inset-0 bg-[#1DB954]/40 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold truncate leading-tight">{song.title}</h4>
                      <p className="text-[10px] text-neutral-400 font-mono truncate">{song.duration} • {song.year}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search tracks, lyrics keywords, or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#1DB954]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Genre Chips */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
            {genres.map(g => (
              <button
                key={g}
                onClick={() => {
                  hapticLight();
                  setSelectedGenre(g);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedGenre === g
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            {years.map(y => (
              <option key={y} value={y}>Year: {y}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-neutral-900 text-white dark:bg-neutral-700' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-neutral-900 text-white dark:bg-neutral-700' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* 4. Songs Grid / List with Spotify Embedded Playback */}
      {filteredSongs.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 p-8 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800">
          <Disc3 className="w-10 h-10 mx-auto text-neutral-400 mb-2 animate-spin-slow" />
          <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">No tracks found</h3>
          <p className="text-xs text-neutral-400 mt-1">Try resetting your search query or genre filter.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => {
            const isDeckActive = activeDeckSong?.id === song.id;
            const isInlineOpen = !!inlineEmbeds[song.id];
            const songSpotifyEmbed = getSpotifyEmbedForSong(song);
            const songSpotifyUrl = getSpotifyWebUrlForSong(song);

            return (
              <div
                key={song.id}
                className={`group rounded-3xl bg-white dark:bg-neutral-900 border transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl ${
                  isDeckActive
                    ? 'border-[#1DB954] ring-1 ring-[#1DB954]/50'
                    : 'border-neutral-200 dark:border-neutral-800/90 hover:border-neutral-400 dark:hover:border-neutral-700'
                }`}
              >
                {/* Artwork & Play Action */}
                <div 
                  className="relative aspect-square w-full bg-neutral-950 cursor-pointer overflow-hidden"
                  onClick={() => handleSelectDeckSong(song, true)}
                >
                  <img 
                    src={song.cover} 
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* Play on Spotify Overlay Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectDeckSong(song, true);
                    }}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-neutral-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer"
                    title={`Play ${song.title} in Spotify Embed`}
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.354-.677.466-1.031.251-2.822-1.724-6.374-2.114-10.558-1.159-.404.093-.807-.16-.9-.564-.093-.404.16-.807.564-.9 4.582-1.047 8.514-.606 11.674 1.341.354.215.466.677.251 1.032zm1.47-3.266c-.27.44-.848.58-1.288.31-3.23-1.985-8.154-2.559-11.974-1.4-1.498.455-.499-.33-.954-.83-.455-.499.33-.954.83-1.498 4.37-1.326 9.805-.688 13.518 1.588.44.27.58.848.31 1.288zm.126-3.414c-3.873-2.3-10.258-2.512-13.966-1.385-.594.18-1.222-.156-1.402-.75-.18-.594.156-1.222.75-1.402 4.26-1.294 11.298-1.043 15.753 1.603.534.317.708 1.01.39 1.544-.317.534-1.01.708-1.544.39z"/>
                    </svg>
                  </button>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10">
                      {song.year}
                    </span>
                    {song.featured && (
                      <span className="px-2 py-0.5 rounded-md bg-[#1DB954] text-[10px] font-mono font-bold text-neutral-950">
                        Featured
                      </span>
                    )}
                    {isDeckActive && (
                      <span className="px-2 py-0.5 rounded-md bg-white text-neutral-950 text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-ping" />
                        In Deck
                      </span>
                    )}
                  </div>
                </div>

                {/* Content & Action Bar */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold block">
                      {song.genre}
                    </span>
                    <h3 
                      onClick={() => handleSelectDeckSong(song, true)}
                      className="text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-[#1DB954] transition-colors cursor-pointer"
                    >
                      {song.title}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2">
                      {song.description}
                    </p>
                  </div>

                  {/* Meta Bar */}
                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80">
                    <span>Duration: {song.duration}</span>
                    <span>{song.playCount.toLocaleString()} plays</span>
                  </div>

                  {/* Inline Spotify Iframe Embed if toggled */}
                  {isInlineOpen && (
                    <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-md my-2">
                      <iframe
                        src={songSpotifyEmbed}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title={`Spotify Embed - ${song.title}`}
                        className="w-full block"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSelectDeckSong(song, true)}
                        className="px-3 py-1.5 rounded-lg bg-[#1DB954]/15 hover:bg-[#1DB954] text-[#1DB954] hover:text-neutral-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Stream in main Spotify Deck"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.354-.677.466-1.031.251-2.822-1.724-6.374-2.114-10.558-1.159-.404.093-.807-.16-.9-.564-.093-.404.16-.807.564-.9 4.582-1.047 8.514-.606 11.674 1.341.354.215.466.677.251 1.032zm1.47-3.266c-.27.44-.848.58-1.288.31-3.23-1.985-8.154-2.559-11.974-1.4-1.498.455-.499-.33-.954-.83-.455-.499.33-.954.83-1.498 4.37-1.326 9.805-.688 13.518 1.588.44.27.58.848.31 1.288zm.126-3.414c-3.873-2.3-10.258-2.512-13.966-1.385-.594.18-1.222-.156-1.402-.75-.18-.594.156-1.222.75-1.402 4.26-1.294 11.298-1.043 15.753 1.603.534.317.708 1.01.39 1.544-.317.534-1.01.708-1.544.39z"/>
                        </svg>
                        <span>Stream Deck</span>
                      </button>

                      <button
                        onClick={(e) => toggleInlineEmbed(song.id, e)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                          isInlineOpen 
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-transparent' 
                            : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                        title={isInlineOpen ? "Hide inline Spotify player" : "Embed Spotify player inline"}
                      >
                        <Disc3 className={`w-4 h-4 ${isInlineOpen ? 'animate-spin' : ''}`} />
                      </button>

                      <button
                        onClick={() => setSelectedSongId(song.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-colors"
                      >
                        Details
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Direct Spotify App Link */}
                      <a
                        href={songSpotifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-[#1DB954] hover:bg-[#1DB954]/10 transition-colors"
                        title="Open on Spotify Web / App"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {/* Lyrics View */}
                      <button
                        onClick={() => {
                          setCurrentTab('lyrics');
                          setSelectedLyricId(`lyric-${song.slug}`);
                        }}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="View Full Lyrics"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => openShare({
                          type: 'song',
                          title: `${song.title} — Arjun Bharti Mina`,
                          text: `${song.genre} (${song.year}) by ${song.artist}. Stream on Spotify.`,
                          url: songSpotifyUrl,
                          imageUrl: song.cover,
                          artist: song.artist,
                          genre: song.genre,
                          year: song.year,
                          lyricsText: song.lyrics,
                          streamingLinks: song.streamingLinks,
                          downloadFilename: `${song.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poster.jpg`
                        })}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Share Song & Links"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden shadow-sm">
          {filteredSongs.map((song, idx) => {
            const isDeckActive = activeDeckSong?.id === song.id;
            const songSpotifyUrl = getSpotifyWebUrlForSong(song);

            return (
              <div
                key={song.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isDeckActive ? 'bg-[#1DB954]/5 dark:bg-[#1DB954]/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-neutral-400 w-5 text-center">
                    {idx + 1}
                  </span>
                  
                  <div 
                    onClick={() => handleSelectDeckSong(song, true)}
                    className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 shrink-0 cursor-pointer group"
                  >
                    <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-[#1DB954] fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.354-.677.466-1.031.251-2.822-1.724-6.374-2.114-10.558-1.159-.404.093-.807-.16-.9-.564-.093-.404.16-.807.564-.9 4.582-1.047 8.514-.606 11.674 1.341.354.215.466.677.251 1.032zm1.47-3.266c-.27.44-.848.58-1.288.31-3.23-1.985-8.154-2.559-11.974-1.4-1.498.455-.499-.33-.954-.83-.455-.499.33-.954.83-1.498 4.37-1.326 9.805-.688 13.518 1.588.44.27.58.848.31 1.288zm.126-3.414c-3.873-2.3-10.258-2.512-13.966-1.385-.594.18-1.222-.156-1.402-.75-.18-.594.156-1.222.75-1.402 4.26-1.294 11.298-1.043 15.753 1.603.534.317.708 1.01.39 1.544-.317.534-1.01.708-1.544.39z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 
                        onClick={() => handleSelectDeckSong(song, true)}
                        className="text-sm font-bold text-neutral-900 dark:text-white hover:text-[#1DB954] cursor-pointer truncate"
                      >
                        {song.title}
                      </h4>
                      {song.featured && (
                        <span className="px-1.5 py-0.2 rounded bg-[#1DB954]/20 text-[#1DB954] text-[9px] font-mono font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 font-mono">
                      {song.genre} • {song.duration} • {song.year}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleSelectDeckSong(song, true)}
                    className="px-3 py-1.5 rounded-lg bg-[#1DB954] text-neutral-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Play on Deck</span>
                  </button>

                  <a
                    href={songSpotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#1DB954] transition-colors"
                    title="Open on Spotify"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setSelectedSongId(song.id)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. SPOTIFY ARTIST PROFILE CALLOUT BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-[#1DB954] text-neutral-950 flex items-center justify-center shadow-xl shrink-0">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.354-.677.466-1.031.251-2.822-1.724-6.374-2.114-10.558-1.159-.404.093-.807-.16-.9-.564-.093-.404.16-.807.564-.9 4.582-1.047 8.514-.606 11.674 1.341.354.215.466.677.251 1.032zm1.47-3.266c-.27.44-.848.58-1.288.31-3.23-1.985-8.154-2.559-11.974-1.4-1.498.455-.499-.33-.954-.83-.455-.499.33-.954.83-1.498 4.37-1.326 9.805-.688 13.518 1.588.44.27.58.848.31 1.288zm.126-3.414c-3.873-2.3-10.258-2.512-13.966-1.385-.594.18-1.222-.156-1.402-.75-.18-.594.156-1.222.75-1.402 4.26-1.294 11.298-1.043 15.753 1.603.534.317.708 1.01.39 1.544-.317.534-1.01.708-1.544.39z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#1DB954] font-bold">
                Verified Artist on Spotify
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Arjun Bharti Mina Official Channel
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Listen on your Spotify desktop app, mobile device, or smart speakers.
            </p>
          </div>
        </div>

        <a
          href="https://open.spotify.com/artist/arjunbhartimina"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-neutral-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#1DB954]/20 transition-transform hover:scale-105 active:scale-95 shrink-0"
        >
          <span>Open Artist Profile</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};
