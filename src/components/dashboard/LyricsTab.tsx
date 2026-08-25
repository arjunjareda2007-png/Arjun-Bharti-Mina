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
  Copy
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
  const { lyrics, songs, addLyric, updateLyric, deleteLyric, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLyric, setEditingLyric] = useState<LyricItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LyricItem | null>(null);

  const filteredLyrics = lyrics.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.genre && l.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingLyric({
      ...EMPTY_LYRIC,
      id: `lyric-${Date.now()}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lyric: LyricItem) => {
    setEditingLyric({ ...lyric });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLyric || !editingLyric.title.trim()) return;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLyrics.map((lyric) => (
          <div
            key={lyric.id}
            className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {lyric.title}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {lyric.genre} • {lyric.year}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(lyric.lyrics)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Copy lyrics"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenEdit(lyric)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Edit lyrics"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(lyric)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl max-h-32 overflow-y-auto text-xs font-mono text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
              {lyric.lyrics}
            </div>

            {lyric.meaning && (
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 italic">
                "{lyric.meaning}"
              </p>
            )}
          </div>
        ))}
      </div>

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
                    Connect to Audio Track (Optional)
                  </label>
                  <select
                    value={editingLyric.songId || ''}
                    onChange={(e) => setEditingLyric({ ...editingLyric, songId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
                  >
                    <option value="">No audio link</option>
                    {songs.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
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
