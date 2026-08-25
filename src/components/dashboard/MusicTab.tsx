import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Song } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { 
  Music, 
  Plus, 
  Search, 
  Star, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Play, 
  Sparkles,
  ExternalLink,
  Save,
  X,
  CheckSquare,
  Square,
  RefreshCw,
  CheckCircle2,
  Video
} from 'lucide-react';
import { 
  extractYouTubeId, 
  getYouTubeThumbnail, 
  fetchYouTubeMetadata 
} from '../../utils/youtubeUtils';

const EMPTY_SONG: Song = {
  id: '',
  title: '',
  slug: '',
  artist: 'Arjun Bharti Mina',
  genre: 'Desi Hip-Hop',
  language: 'Hindi',
  releaseDate: new Date().toISOString().split('T')[0],
  year: 2026,
  duration: '3:15',
  cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800',
  description: '',
  lyrics: '',
  featured: false,
  published: true,
  playCount: 0,
  audioToneSequence: [261.63, 329.63, 392.00, 523.25],
  streamingLinks: {
    spotify: 'https://open.spotify.com',
    youtube: 'https://youtube.com',
    jiosaavn: 'https://jiosaavn.com',
    gaana: 'https://gaana.com',
    appleMusic: 'https://music.apple.com'
  },
  credits: {
    artist: 'Arjun Bharti Mina',
    lyrics: 'Arjun Bharti Mina',
    music: 'Arjun Bharti Mina',
    production: 'Arjun Bharti Mina'
  }
};

export const MusicTab: React.FC = () => {
  const { 
    songs, 
    addSong, 
    updateSong, 
    deleteSong, 
    toggleFeaturedSong, 
    toggleSongPublish,
    playSong,
    bulkDeleteItems,
    bulkTogglePublish,
    bulkToggleFeatured
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'published' | 'draft' | 'featured'>('all');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Song | null>(null);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [fetchedSuccess, setFetchedSuccess] = useState(false);

  // Filtered list
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          song.genre.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'published') return song.published !== false;
    if (filterMode === 'draft') return song.published === false;
    if (filterMode === 'featured') return song.featured;
    return true;
  });

  const handleFetchSongYouTube = async (urlOrId?: string) => {
    if (!editingSong) return;
    const target = urlOrId || editingSong.streamingLinks?.youtube || '';
    if (!target || !target.trim()) return;

    setFetchingMeta(true);
    try {
      const extractedId = extractYouTubeId(target);
      if (!extractedId) {
        setFetchingMeta(false);
        return;
      }

      const meta = await fetchYouTubeMetadata(target);
      const thumb = meta?.thumbnail || getYouTubeThumbnail(extractedId, 'maxres');

      setEditingSong(prev => {
        if (!prev) return null;
        let title = prev.title;
        // Clean up common YouTube title patterns if song title is generic or empty
        if ((!title || title.trim() === '' || title === 'Untitled Track') && meta?.title) {
          title = meta.title
            .replace(/official\s*(music\s*)?video/gi, '')
            .replace(/official\s*audio/gi, '')
            .replace(/\[.*?\]|\(.*?\)/g, '')
            .replace(/^.*?[-–—]/, '')
            .trim() || meta.title;
        }

        return {
          ...prev,
          cover: thumb,
          title: title || prev.title,
          youtubeEmbedId: extractedId,
          streamingLinks: {
            ...prev.streamingLinks,
            youtube: `https://www.youtube.com/watch?v=${extractedId}`
          }
        };
      });

      setFetchedSuccess(true);
      setTimeout(() => setFetchedSuccess(false), 3000);
    } catch (e) {
      console.warn('YouTube song fetch error:', e);
      const extractedId = extractYouTubeId(target);
      if (extractedId) {
        setEditingSong(prev => prev ? {
          ...prev,
          cover: getYouTubeThumbnail(extractedId, 'maxres'),
          youtubeEmbedId: extractedId
        } : null);
      }
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSong({
      ...EMPTY_SONG,
      id: `song-${Date.now()}`,
      releaseDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (song: Song) => {
    setEditingSong({ ...song });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong || !editingSong.title.trim()) return;

    const exists = songs.some(s => s.id === editingSong.id);
    if (exists) {
      await updateSong(editingSong);
    } else {
      await addSong(editingSong);
    }
    setIsModalOpen(false);
    setEditingSong(null);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredSongs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSongs.map(s => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-amber-500" />
            <span>Music & Discography Manager</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your official song catalog, streaming links, release dates, and featured anthems.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Track</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracks by title, genre..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'published', 'draft', 'featured'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                filterMode === mode
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Operations Toolbar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-amber-700 dark:text-amber-300">
            {selectedIds.length} tracks selected
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await bulkTogglePublish('songs', selectedIds, true);
                setSelectedIds([]);
              }}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
            >
              Publish Selected
            </button>
            <button
              onClick={async () => {
                await bulkTogglePublish('songs', selectedIds, false);
                setSelectedIds([]);
              }}
              className="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium"
            >
              Set Draft
            </button>
            <button
              onClick={async () => {
                await bulkDeleteItems('songs', selectedIds);
                setSelectedIds([]);
              }}
              className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Songs Table / Card List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <button onClick={handleSelectAll} className="p-1">
                    {selectedIds.length > 0 && selectedIds.length === filteredSongs.length ? (
                      <CheckSquare className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5">Track Details</th>
                <th className="p-3.5">Release / Dur.</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredSongs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400">
                    No songs found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSongs.map((song) => {
                  const isSelected = selectedIds.includes(song.id);
                  const isPublished = song.published !== false;
                  return (
                    <tr 
                      key={song.id} 
                      className={`hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors ${
                        isSelected ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <button onClick={() => toggleSelect(song.id)} className="p-1">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-amber-500" />
                          ) : (
                            <Square className="w-4 h-4 text-neutral-400" />
                          )}
                        </button>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative group shrink-0">
                            <img
                              src={song.cover}
                              alt={song.title}
                              className="w-10 h-10 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                            />
                            <button
                              onClick={() => playSong(song)}
                              className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Play className="w-4 h-4 fill-white" />
                            </button>
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-neutral-900 dark:text-white truncate">
                              {song.title}
                            </p>
                            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate">
                              {song.genre} • {song.artist}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-neutral-600 dark:text-neutral-400">
                        <div>{song.releaseDate}</div>
                        <div className="text-[11px] text-neutral-400">{song.duration}</div>
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => toggleSongPublish(song.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                            isPublished
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => toggleFeaturedSong(song.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            song.featured
                              ? 'text-amber-500 bg-amber-500/10'
                              : 'text-neutral-400 hover:text-neutral-600'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${song.featured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </td>

                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(song)}
                          className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Edit Track"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(song)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete Track"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Song Modal */}
      {isModalOpen && editingSong && (
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
                <Music className="w-5 h-5 text-amber-500" />
                <span>{songs.some(s => s.id === editingSong.id) ? 'Edit Song Record' : 'Add New Song Release'}</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Fill in track metadata, streaming endpoints, and cover poster.
              </p>
            </div>

            {/* Smart YouTube Auto-Fetch Bar */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <label className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Fetch Song Thumbnail & Details from YouTube</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube or YouTube Music link (e.g. https://youtube.com/watch?v=...)"
                  value={editingSong.streamingLinks?.youtube || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const id = extractYouTubeId(val);
                    setEditingSong({
                      ...editingSong,
                      streamingLinks: { ...editingSong.streamingLinks, youtube: val },
                      cover: id ? getYouTubeThumbnail(id, 'maxres') : editingSong.cover,
                      youtubeEmbedId: id || editingSong.youtubeEmbedId
                    });
                  }}
                  className="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleFetchSongYouTube()}
                  disabled={fetchingMeta}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${fetchingMeta ? 'animate-spin' : ''}`} />
                  <span>{fetchingMeta ? 'Fetching...' : 'Fetch Cover'}</span>
                </button>
              </div>
              {fetchedSuccess && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cover artwork & YouTube links fetched successfully!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Song Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSong.title}
                    onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Genre / Style
                  </label>
                  <input
                    type="text"
                    value={editingSong.genre}
                    onChange={(e) => setEditingSong({ ...editingSong, genre: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={editingSong.releaseDate}
                    onChange={(e) => setEditingSong({ ...editingSong, releaseDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Track Duration (e.g. 3:24)
                  </label>
                  <input
                    type="text"
                    value={editingSong.duration}
                    onChange={(e) => setEditingSong({ ...editingSong, duration: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Cover / Poster Image URL
                  </label>
                  <input
                    type="url"
                    value={editingSong.cover}
                    onChange={(e) => setEditingSong({ ...editingSong, cover: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                  />
                  {editingSong.cover && (
                    <div className="mt-2 flex items-center gap-3">
                      <img src={editingSong.cover} alt="Preview" className="w-12 h-12 rounded-xl object-cover" />
                      <span className="text-[11px] text-neutral-400">Cover preview</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Song Story / Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingSong.description}
                    onChange={(e) => setEditingSong({ ...editingSong, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Streaming Platform URLs */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Streaming Platform URLs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-0.5">Spotify URL</label>
                    <input
                      type="url"
                      value={editingSong.streamingLinks?.spotify || ''}
                      onChange={(e) => setEditingSong({
                        ...editingSong,
                        streamingLinks: { ...editingSong.streamingLinks, spotify: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-0.5">YouTube Music URL</label>
                    <input
                      type="url"
                      value={editingSong.streamingLinks?.youtube || ''}
                      onChange={(e) => setEditingSong({
                        ...editingSong,
                        streamingLinks: { ...editingSong.streamingLinks, youtube: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-0.5">JioSaavn URL</label>
                    <input
                      type="url"
                      value={editingSong.streamingLinks?.jiosaavn || ''}
                      onChange={(e) => setEditingSong({
                        ...editingSong,
                        streamingLinks: { ...editingSong.streamingLinks, jiosaavn: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-0.5">Gaana URL</label>
                    <input
                      type="url"
                      value={editingSong.streamingLinks?.gaana || ''}
                      onChange={(e) => setEditingSong({
                        ...editingSong,
                        streamingLinks: { ...editingSong.streamingLinks, gaana: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-0.5">Apple Music URL</label>
                    <input
                      type="url"
                      value={editingSong.streamingLinks?.appleMusic || ''}
                      onChange={(e) => setEditingSong({
                        ...editingSong,
                        streamingLinks: { ...editingSong.streamingLinks, appleMusic: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSong.published !== false}
                    onChange={(e) => setEditingSong({ ...editingSong, published: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>Published (Visible to visitors)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSong.featured || false}
                    onChange={(e) => setEditingSong({ ...editingSong, featured: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>Featured Anthem</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md"
                >
                  Save Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Song Track?"
        itemName={deleteTarget?.title || ''}
        itemType="Song"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteSong(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
