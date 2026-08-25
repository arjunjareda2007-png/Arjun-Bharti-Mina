import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Copy, Check, Share2, Play, Music2, BookOpen, FileText, FileCode, Download, Sparkles } from 'lucide-react';
import { generateLyricsPDF, generateLyricsWordDoc, downloadTextFile } from '../utils/shareUtils';

export const LyricDetailModal: React.FC = () => {
  const { selectedLyricId, setSelectedLyricId, lyrics, songs, playSong, openShare, setCurrentTab, setSelectedSongId, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  if (!selectedLyricId) return null;
  const lyricItem = lyrics.find(l => l.id === selectedLyricId);
  if (!lyricItem) return null;

  const matchedSong = songs.find(s => s.id === lyricItem.songId || s.title.toLowerCase() === lyricItem.title.split('—')[0].trim().toLowerCase());

  const handleCopy = () => {
    const full = `${lyricItem.title}\nWritten by ${lyricItem.artist} (${lyricItem.year})\nGenre: ${lyricItem.genre}\n\n${lyricItem.lyrics}\n\nOfficial Archive: ${window.location.origin}/#lyrics?id=${lyricItem.id}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    showToast('Lyrics & details copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    openShare({
      type: 'lyrics',
      title: `${lyricItem.title} — Lyrics by ${lyricItem.artist}`,
      text: lyricItem.meaning || `Official lyrics written by ${lyricItem.artist} (${lyricItem.year}).`,
      url: `${window.location.origin}/#lyrics?id=${lyricItem.id}`,
      lyricsText: lyricItem.lyrics,
      meaning: lyricItem.meaning,
      artist: lyricItem.artist,
      genre: lyricItem.genre,
      year: lyricItem.year,
      downloadFilename: `${lyricItem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_lyrics.pdf`
    });
  };

  const handleExportPDF = () => {
    generateLyricsPDF(lyricItem);
    showToast('Lyrics PDF generated and downloaded!', 'success');
  };

  const handleExportWord = () => {
    generateLyricsWordDoc(lyricItem);
    showToast('Lyrics Word document (.doc) downloaded!', 'success');
  };

  return (
    <div 
      id="lyric-detail-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={() => setSelectedLyricId(null)}
    >
      <div 
        id="lyric-detail-card"
        className="w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-semibold">
              {lyricItem.genre}
            </span>
            <span className="text-xs text-neutral-500 font-mono">• {lyricItem.language}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-neutral-500 hover:text-amber-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              title="Share Lyrics (PDF / Word / Text)"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedLyricId(null)}
              className="p-2 rounded-full text-neutral-500 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
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

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportPDF}
                className="px-3 py-1.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
                title="Download formatted PDF document"
              >
                <FileText className="w-3.5 h-3.5 text-red-500" />
                <span>PDF</span>
              </button>

              <button
                onClick={handleExportWord}
                className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                title="Download formatted Word document (.doc)"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Word</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              {matchedSong && (
                <button
                  onClick={() => {
                    playSong(matchedSong);
                    setCurrentTab('music');
                    setSelectedSongId(matchedSong.id);
                    setSelectedLyricId(null);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
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
            {(lyricItem.lyrics || '').split('\n\n').map((block, idx) => (
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
