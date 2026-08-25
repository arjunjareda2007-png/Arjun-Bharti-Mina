import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, Music2, FileText, Image, Video, Globe, BookOpen, User, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    closeSearch, 
    songs, 
    lyrics, 
    gallery, 
    videos, 
    projects, 
    books, 
    timeline,
    setCurrentTab, 
    setSelectedSongId, 
    setSelectedProjectId, 
    setSelectedLyricId,
    openLightbox,
    openVideoPlayer,
    playSong
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isSearchOpen) closeSearch();
        else setQuery('');
      }
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Results aggregation
  const matchedSongs = q ? songs.filter(s => 
    s.title.toLowerCase().includes(q) || 
    s.genre.toLowerCase().includes(q) || 
    s.description.toLowerCase().includes(q) ||
    s.lyrics.toLowerCase().includes(q)
  ) : [];

  const matchedLyrics = q ? lyrics.filter(l => 
    l.title.toLowerCase().includes(q) || 
    l.lyrics.toLowerCase().includes(q) || 
    l.genre.toLowerCase().includes(q)
  ) : [];

  const matchedProjects = q ? projects.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.shortDescription.toLowerCase().includes(q) || 
    p.technologies.some(t => t.toLowerCase().includes(q))
  ) : [];

  const matchedVideos = q ? videos.filter(v => 
    v.title.toLowerCase().includes(q) || 
    v.category.toLowerCase().includes(q) || 
    v.description.toLowerCase().includes(q)
  ) : [];

  const matchedGallery = q ? gallery.filter(g => 
    g.title.toLowerCase().includes(q) || 
    g.category.toLowerCase().includes(q) || 
    g.tags.some(t => t.toLowerCase().includes(q))
  ) : [];

  const matchedBooks = q ? books.filter(b => 
    b.title.toLowerCase().includes(q) || 
    b.description.toLowerCase().includes(q)
  ) : [];

  const totalResults = matchedSongs.length + matchedLyrics.length + matchedProjects.length + matchedVideos.length + matchedGallery.length + matchedBooks.length;

  return (
    <div 
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto animate-in fade-in duration-150"
      onClick={closeSearch}
    >
      <div 
        id="search-modal-card"
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden mt-6 sm:mt-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800 gap-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search songs, lyrics, projects, videos, books, archives..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 text-sm sm:text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="py-8 text-center text-neutral-500 dark:text-neutral-400 space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">Quick Searches</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['RUTBA', 'Jaipur to Delhi', 'Khwabeeda', 'Aether Gallery', 'Civil Engineering', 'The Lyricist’s Blueprint'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-neutral-400 mt-1">Try searching by genre, song title, tech stack, or creative era.</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Songs */}
              {matchedSongs.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Music2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Songs ({matchedSongs.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {matchedSongs.map(song => (
                      <div 
                        key={song.id}
                        onClick={() => {
                          setCurrentTab('music');
                          setSelectedSongId(song.id);
                          playSong(song);
                          closeSearch();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={song.cover} alt={song.title} className="w-9 h-9 rounded-lg object-cover" />
                          <div>
                            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors block">
                              {song.title}
                            </span>
                            <span className="text-[11px] text-neutral-500">{song.genre} • {song.year}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-amber-500 flex items-center gap-1">
                          Play <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lyrics */}
              {matchedLyrics.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>Lyrics ({matchedLyrics.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {matchedLyrics.map(lyric => (
                      <div 
                        key={lyric.id}
                        onClick={() => {
                          setCurrentTab('lyrics');
                          setSelectedLyricId(lyric.id);
                          closeSearch();
                        }}
                        className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors group"
                      >
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors block">
                          {lyric.title}
                        </span>
                        <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5 font-serif italic">
                          &ldquo;{lyric.lyrics.slice(0, 100)}...&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {matchedProjects.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Digital Projects ({matchedProjects.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {matchedProjects.map(proj => (
                      <div 
                        key={proj.id}
                        onClick={() => {
                          setCurrentTab('projects');
                          setSelectedProjectId(proj.id);
                          closeSearch();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={proj.thumbnail} alt={proj.title} className="w-9 h-9 rounded-lg object-cover" />
                          <div>
                            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors block">
                              {proj.title}
                            </span>
                            <span className="text-[11px] text-neutral-500">{proj.category} • {proj.year}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {matchedVideos.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-rose-500" />
                    <span>Videos ({matchedVideos.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {matchedVideos.map(vid => (
                      <div 
                        key={vid.id}
                        onClick={() => {
                          setCurrentTab('videos');
                          openVideoPlayer(vid);
                          closeSearch();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={vid.thumbnail} alt={vid.title} className="w-9 h-9 rounded-lg object-cover" />
                          <div>
                            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors block">
                              {vid.title}
                            </span>
                            <span className="text-[11px] text-neutral-500">{vid.category} • {vid.duration}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Books */}
              {matchedBooks.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Books ({matchedBooks.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {matchedBooks.map(bk => (
                      <div 
                        key={bk.id}
                        onClick={() => {
                          setCurrentTab('books');
                          closeSearch();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={bk.cover} alt={bk.title} className="w-7 h-9 rounded object-cover shadow-sm" />
                          <div>
                            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors block">
                              {bk.title}
                            </span>
                            <span className="text-[11px] text-neutral-500">{bk.author} • {bk.publicationYear}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
