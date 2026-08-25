import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, FileText, Copy, Check, Play, ArrowRight, Music2, Share2 } from 'lucide-react';

export const LyricsView: React.FC = () => {
  const { lyrics, songs, playSong, setSelectedLyricId, openShare, setCurrentTab, setSelectedSongId } = useStore();
  
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLyrics = lyrics.filter(l => 
    !search || 
    l.title.toLowerCase().includes(search.toLowerCase()) || 
    l.lyrics.toLowerCase().includes(search.toLowerCase()) ||
    l.genre.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (lyric: any, e: React.MouseEvent) => {
    e.stopPropagation();
    openShare({
      type: 'lyrics',
      title: `${lyric.title} — Lyrics by ${lyric.artist}`,
      text: lyric.meaning || `Official lyrics written by ${lyric.artist} (${lyric.year}).`,
      url: `${window.location.origin}/#lyrics?id=${lyric.id}`,
      lyricsText: lyric.lyrics,
      meaning: lyric.meaning,
      artist: lyric.artist,
      genre: lyric.genre,
      year: lyric.year,
      downloadFilename: `${lyric.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_lyrics.pdf`
    });
  };

  return (
    <div id="lyrics-view" className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
          Songwriting & Rhyme Library
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Lyrics Vault
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Browse original lyrics, rhyme breakdowns, and poetic verse written and performed by Arjun Bharti Mina.
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by lyric bars, rhymes, phrase or song title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500 shadow-sm"
        />
      </div>

      {/* Lyrics Cards List */}
      <div className="space-y-6">
        {filteredLyrics.map((item) => {
          const matchedSong = songs.find(s => s.id === item.songId || s.title.toLowerCase() === item.title.split('—')[0].trim().toLowerCase());

          return (
            <div
              key={item.id}
              onClick={() => setSelectedLyricId(item.id)}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 shadow-sm hover:shadow-lg transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-semibold">
                      {item.genre}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">{item.year} • {item.language}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors mt-1">
                    {item.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => handleCopy(item.id, item.lyrics, e)}
                    className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                    title="Copy Lyrics"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={(e) => handleShare(item, e)}
                    className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                    title="Share Lyrics"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {matchedSong && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSong(matchedSong);
                      }}
                      className="px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Song</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Preview Verse */}
              <div className="text-xs sm:text-sm font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed max-h-32 overflow-hidden relative">
                <p className="whitespace-pre-line">
                  {item.lyrics.slice(0, 240)}...
                </p>
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent"></div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-medium">
                <span>Click to expand full lyrics & meaning</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
