import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Play, 
  Pause, 
  Music2, 
  FileAudio, 
  FileText, 
  FileCode, 
  Sparkles,
  Volume2 
} from 'lucide-react';
import { generateLyricsPDF, generateLyricsWordDoc } from '../utils/shareUtils';

export const LyricDetailModal: React.FC = () => {
  const { 
    selectedLyricId, 
    setSelectedLyricId, 
    lyrics, 
    songs, 
    playSong, 
    pauseSong, 
    isPlaying, 
    currentSong, 
    openShare, 
    setCurrentTab, 
    setSelectedSongId, 
    showToast 
  } = useStore();
  const [copied, setCopied] = useState(false);

  if (!selectedLyricId) return null;
  const lyricItem = lyrics.find(l => l.id === selectedLyricId);
  if (!lyricItem) return null;

  const matchedSong = songs.find(s => s.id === lyricItem.songId || s.title.toLowerCase() === lyricItem.title.split('—')[0].trim().toLowerCase());
  const isThisPlaying = isPlaying && currentSong?.id === matchedSong?.id;

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

  const handleToggleSongPlayback = () => {
    if (!matchedSong) return;
    if (isThisPlaying) {
      pauseSong();
    } else {
      playSong(matchedSong);
    }
  };

  return (
    <div 
      id="lyric-detail-backdrop"
      className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
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
                  onClick={handleToggleSongPlayback}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer ${
                    isThisPlaying
                      ? 'bg-amber-500 text-neutral-950'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950'
                  }`}
                >
                  {isThisPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Song</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Linked Song Audio Deck Banner */}
          {matchedSong && (
            <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={matchedSong.cover}
                  alt={matchedSong.title}
                  className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 dark:border-neutral-700 shrink-0 shadow-xs"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-500">
                      Linked Song Audio
                    </span>
                    {matchedSong.audioUrl ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                        Master Audio File
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-mono font-medium">
                        Synth Audio
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {matchedSong.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono truncate">
                    {matchedSong.audioFileName ? matchedSong.audioFileName : `${matchedSong.artist} • ${matchedSong.duration}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleSongPlayback}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                    isThisPlaying
                      ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-400/50'
                      : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90'
                  }`}
                  title={isThisPlaying ? 'Pause audio' : 'Play audio in miniplayer while reading lyrics'}
                >
                  {isThisPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Listen Along</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

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
