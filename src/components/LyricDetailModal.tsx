import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Copy, Check, Share2, Play, Music2, BookOpen } from 'lucide-react';

export const LyricDetailModal: React.FC = () => {
  const { selectedLyricId, setSelectedLyricId, lyrics, songs, playSong, openShare, setCurrentTab, setSelectedSongId } = useStore();
  const [copied, setCopied] = useState(false);

  if (!selectedLyricId) return null;
  const lyricItem = lyrics.find(l => l.id === selectedLyricId);
  if (!lyricItem) return null;

  const matchedSong = songs.find(s => s.id === lyricItem.songId || s.title.toLowerCase() === lyricItem.title.split('—')[0].trim().toLowerCase());

  const handleCopy = () => {
    navigator.clipboard.writeText(lyricItem.lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    openShare({
      title: `${lyricItem.title} — Lyrics by Arjun Bharti Mina`,
      text: lyricItem.meaning || `Official lyrics by Arjun Bharti Mina.`,
      url: window.location.href
    });
  };

  return (
    <div 
      id="lyric-detail-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={() => setSelectedLyricId(null)}
    >
      <div 
        id="lyric-detail-card"
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-semibold">
              {lyricItem.genre}
            </span>
            <span className="text-xs text-neutral-500 font-mono">• {lyricItem.language}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedLyricId(null)}
              className="p-2 rounded-full text-neutral-500 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                {lyricItem.title}
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Written by <span className="font-semibold text-neutral-700 dark:text-neutral-300">{lyricItem.artist}</span> ({lyricItem.year})
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Lyrics'}</span>
              </button>

              {matchedSong && (
                <button
                  onClick={() => {
                    playSong(matchedSong);
                    setCurrentTab('music');
                    setSelectedSongId(matchedSong.id);
                    setSelectedLyricId(null);
                  }}
                  className="px-3.5 py-1.5 rounded-full border border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Song</span>
                </button>
              )}
            </div>
          </div>

          {/* Meaning / Context */}
          {lyricItem.meaning && (
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <span className="font-mono text-[11px] uppercase tracking-wider text-amber-500 font-semibold block mb-1">
                Songwriting Concept & Meaning
              </span>
              {lyricItem.meaning}
            </div>
          )}

          {/* Verses */}
          <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-neutral-800 dark:text-neutral-200 select-text p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-900">
            {lyricItem.lyrics.split('\n\n').map((block, idx) => (
              <div key={idx} className="pb-3 border-b border-neutral-100 dark:border-neutral-900/60 last:border-0 last:pb-0">
                <p className="whitespace-pre-line leading-loose">{block}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
