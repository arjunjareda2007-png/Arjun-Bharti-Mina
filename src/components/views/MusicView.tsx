import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Song } from '../../types';
import { 
  Play, 
  Pause, 
  Music2, 
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
  Video
} from 'lucide-react';

export const MusicView: React.FC = () => {
  const { 
    songs, 
    playSong, 
    currentSong, 
    isPlaying, 
    togglePlay, 
    setSelectedSongId, 
    setCurrentTab, 
    setSelectedLyricId,
    openShare,
    openVideoPlayer,
    videos
  } = useStore();

  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

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

  return (
    <div id="music-view" className="space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
            Official Discography
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Music
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Songs, releases, and musical projects by Arjun Bharti Mina.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span>{songs.length} Tracks in Archive</span>
          <span>•</span>
          <span className="text-amber-500 font-semibold">ABM Studio’s</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search tracks, lyrics keywords, or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Genre Chips */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
            {genres.map(g => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
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

        </div>
      </div>

      {/* Songs Grid / List */}
      {filteredSongs.length === 0 ? (
        <div className="py-16 text-center text-neutral-500 p-8 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800">
          <Disc3 className="w-10 h-10 mx-auto text-neutral-400 mb-2 animate-spin-slow" />
          <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">No tracks found</h3>
          <p className="text-xs text-neutral-400 mt-1">Try resetting your search query or genre filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;
            return (
              <div
                key={song.id}
                className="group rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/90 hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Artwork & Overlay */}
                <div 
                  className="relative aspect-square w-full bg-neutral-950 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedSongId(song.id)}
                >
                  <img 
                    src={song.cover} 
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* Play Button Overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isThisPlaying) togglePlay();
                      else playSong(song);
                    }}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-10"
                    title={isThisPlaying ? "Pause" : "Play"}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white border border-white/10">
                      {song.year}
                    </span>
                    {song.featured && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-[10px] font-mono font-bold text-neutral-950">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold block">
                      {song.genre}
                    </span>
                    <h3 
                      onClick={() => setSelectedSongId(song.id)}
                      className="text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors cursor-pointer"
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

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedSongId(song.id)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-colors"
                    >
                      Song Details
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openShare({
                          type: 'song',
                          title: `${song.title} — Arjun Bharti Mina`,
                          text: `${song.genre} (${song.year}) by ${song.artist}. Listen to official release.`,
                          url: `${window.location.origin}/#music?song=${song.id}`,
                          imageUrl: song.cover,
                          artist: song.artist,
                          genre: song.genre,
                          year: song.year,
                          lyricsText: song.lyrics,
                          streamingLinks: song.streamingLinks,
                          downloadFilename: `${song.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poster.jpg`
                        })}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Share Song & Links"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {/* Video Player Quick Button if Song has Video */}
                      {(song.youtubeEmbedId || song.streamingLinks.youtube || videos.some(v => v.title.toLowerCase().includes(song.title.toLowerCase()))) && (
                        <button
                          onClick={() => {
                            const matched = videos.find(v => v.title.toLowerCase().includes(song.title.toLowerCase()));
                            if (matched) {
                              openVideoPlayer(matched);
                            } else {
                              const ytId = song.youtubeEmbedId || (song.streamingLinks?.youtube?.includes('v=') ? song.streamingLinks.youtube.split('v=')[1]?.split('&')[0] : 'dQw4w9WgXcQ');
                              openVideoPlayer({
                                id: `song-vid-${song.id}`,
                                title: `${song.title} (Official Visualizer)`,
                                youtubeEmbedId: ytId,
                                youtubeUrl: song.streamingLinks?.youtube || `https://youtube.com/watch?v=${ytId}`,
                                thumbnail: song.cover,
                                category: 'Music Video',
                                duration: song.duration,
                                description: `Official music visualizer for "${song.title}" by ${song.artist}.`,
                                viewsCount: 'Official',
                                date: song.releaseDate,
                                featured: song.featured,
                                published: true
                              });
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Watch Official Video / Visualizer"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                      )}

                      {/* Spotify Direct Link */}
                      <a
                        href={song.streamingLinks?.spotify || `https://open.spotify.com/artist/arjunbhartimina`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-[#1DB954] hover:bg-[#1DB954]/10 transition-colors"
                        title="Open on Spotify"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.354-.677.466-1.031.251-2.822-1.724-6.374-2.114-10.558-1.159-.404.093-.807-.16-.9-.564-.093-.404.16-.807.564-.9 4.582-1.047 8.514-.606 11.674 1.341.354.215.466.677.251 1.032zm1.47-3.266c-.27.44-.848.58-1.288.31-3.23-1.985-8.154-2.559-11.974-1.4-1.498.455-.499-.33-.954-.83-.455-.499.33-.954.83-1.498 4.37-1.326 9.805-.688 13.518 1.588.44.27.58.848.31 1.288zm.126-3.414c-3.873-2.3-10.258-2.512-13.966-1.385-.594.18-1.222-.156-1.402-.75-.18-.594.156-1.222.75-1.402 4.26-1.294 11.298-1.043 15.753 1.603.534.317.708 1.01.39 1.544-.317.534-1.01.708-1.544.39z"/>
                        </svg>
                      </a>
                      <button
                        onClick={() => {
                          setCurrentTab('lyrics');
                          setSelectedLyricId(`lyric-${song.slug}`);
                        }}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="View Full Lyrics"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
