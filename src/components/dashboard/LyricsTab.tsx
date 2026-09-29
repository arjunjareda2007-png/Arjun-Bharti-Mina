import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { LyricItem } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  Copy,
  Play,
  Pause,
  Music,
  FileAudio,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Volume2
} from 'lucide-react';

const EMPTY_LYRIC: LyricItem = {
  id: '',
  title: '',
  artist: 'Arjun Bharti Mina',
  year: 2026,
  genre: 'Desi Hip-Hop',
  language: 'Hindi / Urdu / Punjabi',
  lyrics: '',
  meaning: '',
  songId: ''
};

export const LyricsTab: React.FC = () => {
  const { 
    lyrics, 
    songs, 
    addLyric, 
    updateLyric, 
    deleteLyric, 
    playSong, 
    pauseSong, 
    isPlaying, 
    currentSong, 
    showToast 
  } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLyric, setEditingLyric] = useState<LyricItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNoSongsAlert, setShowNoSongsAlert] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LyricItem | null>(null);

  const filteredLyrics = lyrics.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.genre && l.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    // If no songs exist in the catalog, prompt the owner to add a song with its audio file first!
    if (!songs || songs.length === 0) {
      setShowNoSongsAlert(true);
      return;
    }

    const defaultSong = songs[0];
    setEditingLyric({
      ...EMPTY_LYRIC,
      id: `lyric-${Date.now()}`,
      songId: defaultSong.id,
      title: `${defaultSong.title} — Lyrics`,
      artist: defaultSong.artist || 'Arjun Bharti Mina',
      genre: defaultSong.genre || 'Desi Hip-Hop',
      year: new Date(defaultSong.releaseDate || '2026').getFullYear() || 2026
    });
    setIsModalOpen(true);
  };

  const handleSelectSong = (songId: string) => {
    if (!editingLyric) return;
    const selected = songs.find(s => s.id === songId);
    if (!selected) {
      setEditingLyric({ ...editingLyric, songId: '' });
      return;
    }

    setEditingLyric({
      ...editingLyric,
      songId: selected.id,
      title: editingLyric.title && !editingLyric.title.includes('— Lyrics') ? editingLyric.title : `${selected.title} — Lyrics`,
      genre: selected.genre || editingLyric.genre,
      artist: selected.artist || editingLyric.artist,
      year: new Date(selected.releaseDate || '2026').getFullYear() || editingLyric.year
    });
  };

  const handleOpenEdit = (lyric: LyricItem) => {
    setEditingLyric({ ...lyric });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLyric || !editingLyric.title.trim()) return;

    if (!editingLyric.songId) {
      showToast('Please select the song (audio track) linked with these lyrics', 'error');
      return;
    }

    const exists = lyrics.some(l => l.id === editingLyric.id);
    if (exists) {
      await updateLyric(editingLyric);
    } else {
      await addLyric(editingLyric);
    }
    setIsModalOpen(false);
    setEditingLyric(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Lyrics copied to clipboard');
  };

  const handlePlaySongToggle = (song: any) => {
    if (currentSong?.id === song.id && isPlaying) {
      pauseSong();
    } else {
      playSong(song);
    }
  };

  const selectedSongInModal = songs.find(s => s.id === editingLyric?.songId);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span>Lyrics & Poetic Archives</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Document your official song lyrics, poetry verses, rhyming breakdowns, and meanings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lyrics</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search lyrical archives..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Lyrics Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLyrics.map((lyric) => {
          const linkedSong = songs.find(s => s.id === lyric.songId || s.title.toLowerCase() === lyric.title.split('—')[0].trim().toLowerCase());
          const isThisPlaying = isPlaying && currentSong?.id === linkedSong?.id;

          return (
            <div
              key={lyric.id}
              className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                      {lyric.title}
                    </h3>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      {lyric.genre} • {lyric.year} • {lyric.language}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(lyric.lyrics)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Copy lyrics"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(lyric)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Edit lyrics"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(lyric)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Linked Song Audio Deck */}
                {linkedSong ? (
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={linkedSong.cover}
                        alt={linkedSong.title}
                        className="w-10 h-10 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">
                            Linked Song
                          </span>
                          {linkedSong.audioUrl && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                              Audio File
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {linkedSong.title}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-mono truncate">
                          {linkedSong.audioFileName ? linkedSong.audioFileName : `${linkedSong.duration} • Synth Fallback`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlaySongToggle(linkedSong)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs ${
                        isThisPlaying
                          ? 'bg-amber-500 text-neutral-950'
                          : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90'
                      }`}
                      title={isThisPlaying ? 'Pause song' : 'Play audio file in miniplayer'}
                    >
                      {isThisPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Playing</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Audio</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>No song linked. Edit lyrics to link an audio track.</span>
                  </div>
                )}

                {/* Lyrics Preview snippet */}
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl max-h-32 overflow-y-auto text-xs font-mono text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                  {lyric.lyrics}
                </div>
              </div>

              {lyric.meaning && (
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 italic pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  "{lyric.meaning}"
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Alert Modal: Ask user to add song first */}
      {showNoSongsAlert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <FileAudio className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Add a Song First
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Lyrics must be directly linked with a song and its audio file. There are currently no songs in your music library. Please add a song with its audio file before adding lyrics.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNoSongsAlert(false)}
                className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNoSongsAlert(false);
                  const musicNav = document.querySelector('[data-tab="music"]') as HTMLElement;
                  if (musicNav) musicNav.click();
                  showToast('Navigate to Songs to upload your audio track first', 'info');
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Go to Songs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && editingLyric && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>{lyrics.some(l => l.id === editingLyric.id) ? 'Edit Lyrics' : 'Add New Song Lyrics'}</span>
              </h3>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Mandatory Linked Song with Audio Track */}
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <FileAudio className="w-4 h-4 text-amber-500" />
                    <span>Select Song (Audio File Linked) *</span>
                  </label>
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold uppercase">
                    Required
                  </span>
                </div>

                <select
                  required
                  value={editingLyric.songId || ''}
                  onChange={(e) => handleSelectSong(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500 shadow-2xs"
                >
                  <option value="" disabled>-- Select linked song with audio track --</option>
                  {songs.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.genre}) {s.audioUrl ? '🎵 [Audio File Uploaded]' : '🎹 [Synth Audio]'}
                    </option>
                  ))}
                </select>

                {/* Selected Song Preview Card */}
                {selectedSongInModal && (
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={selectedSongInModal.cover}
                        alt={selectedSongInModal.title}
                        className="w-11 h-11 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {selectedSongInModal.title}
                        </p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                          {selectedSongInModal.artist} • {selectedSongInModal.genre}
                        </p>
                        {selectedSongInModal.audioUrl ? (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium mt-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Audio Attached: {selectedSongInModal.audioFileName || 'Master File'}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                            <Music className="w-3 h-3" />
                            <span>Synthesizer Audio (Upload audio file in Songs tab anytime)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlaySongToggle(selectedSongInModal)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
                    >
                      {isPlaying && currentSong?.id === selectedSongInModal.id ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Song / Poem Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLyric.title}
                    onChange={(e) => setEditingLyric({ ...editingLyric, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Genre / Theme
                  </label>
                  <input
                    type="text"
                    value={editingLyric.genre}
                    onChange={(e) => setEditingLyric({ ...editingLyric, genre: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Year of Writing
                  </label>
                  <input
                    type="number"
                    value={editingLyric.year}
                    onChange={(e) => setEditingLyric({ ...editingLyric, year: Number(e.target.value) || 2026 })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Language / Dialect
                  </label>
                  <input
                    type="text"
                    value={editingLyric.language || 'Hindi / Urdu / Punjabi'}
                    onChange={(e) => setEditingLyric({ ...editingLyric, language: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Lyric Stanzas & Verses *
                </label>
                <textarea
                  rows={8}
                  required
                  value={editingLyric.lyrics}
                  onChange={(e) => setEditingLyric({ ...editingLyric, lyrics: e.target.value })}
                  placeholder="Enter Hindi/Urdu/Punjabi verses with line breaks..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Poetic Meaning & Interpretation
                </label>
                <textarea
                  rows={2}
                  value={editingLyric.meaning || ''}
                  onChange={(e) => setEditingLyric({ ...editingLyric, meaning: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md"
                >
                  Save Lyrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Lyrics?"
        itemName={deleteTarget?.title || ''}
        itemType="Lyrics"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteLyric(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
