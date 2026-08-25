import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { VideoItem } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { 
  Video, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Play, 
  X,
  Sparkles,
  RefreshCw,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { 
  extractYouTubeId, 
  getYouTubeThumbnail, 
  fetchYouTubeMetadata 
} from '../../utils/youtubeUtils';

const EMPTY_VIDEO: VideoItem = {
  id: '',
  title: '',
  youtubeEmbedId: 'dQw4w9WgXcQ',
  youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  category: 'Music Video',
  duration: '3:30',
  description: '',
  viewsCount: '12K',
  date: new Date().toISOString().split('T')[0],
  featured: false,
  published: true
};

export const VideosTab: React.FC = () => {
  const { videos, addVideo, updateVideo, deleteVideo, openVideoPlayer, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VideoItem | null>(null);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [fetchedSuccess, setFetchedSuccess] = useState(false);

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingVideo({
      ...EMPTY_VIDEO,
      id: `vid-${Date.now()}`
    });
    setFetchedSuccess(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: VideoItem) => {
    setEditingVideo({ ...v });
    setFetchedSuccess(false);
    setIsModalOpen(true);
  };

  const handleFetchMetadata = async (urlOrId?: string) => {
    if (!editingVideo) return;
    const target = urlOrId || editingVideo.youtubeUrl || editingVideo.youtubeEmbedId;
    if (!target || !target.trim()) {
      showToast('Please enter a YouTube link or ID first', 'error');
      return;
    }

    setFetchingMeta(true);
    try {
      const extractedId = extractYouTubeId(target);
      if (!extractedId) {
        showToast('Invalid YouTube URL or ID', 'error');
        setFetchingMeta(false);
        return;
      }

      const meta = await fetchYouTubeMetadata(target);
      const thumb = meta?.thumbnail || getYouTubeThumbnail(extractedId, 'maxres');
      
      let category = editingVideo.category;
      if (meta?.title) {
        const titleLower = meta.title.toLowerCase();
        if (titleLower.includes('short') || titleLower.includes('#shorts')) {
          category = 'Shorts';
        } else if (titleLower.includes('live') || titleLower.includes('performance')) {
          category = 'Live Performance';
        } else if (titleLower.includes('bts') || titleLower.includes('behind the scene')) {
          category = 'BTS';
        } else if (titleLower.includes('music video') || titleLower.includes('official audio')) {
          category = 'Music Video';
        }
      }

      setEditingVideo(prev => prev ? {
        ...prev,
        youtubeEmbedId: extractedId,
        youtubeUrl: `https://www.youtube.com/watch?v=${extractedId}`,
        thumbnail: thumb,
        title: prev.title.trim() && prev.title !== EMPTY_VIDEO.title ? prev.title : (meta?.title || prev.title),
        category,
        description: prev.description.trim() ? prev.description : `Official video release by Arjun Bharti Mina. Watch on YouTube.`
      } : null);

      setFetchedSuccess(true);
      showToast('YouTube title & thumbnail auto-fetched!', 'success');
      setTimeout(() => setFetchedSuccess(false), 3000);
    } catch (e) {
      console.warn('Auto fetch note:', e);
      const extractedId = extractYouTubeId(target);
      if (extractedId) {
        setEditingVideo(prev => prev ? {
          ...prev,
          youtubeEmbedId: extractedId,
          youtubeUrl: `https://www.youtube.com/watch?v=${extractedId}`,
          thumbnail: getYouTubeThumbnail(extractedId, 'maxres')
        } : null);
        showToast('YouTube ID and thumbnail linked!', 'success');
      }
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo || !editingVideo.title.trim()) return;

    const exists = videos.some(v => v.id === editingVideo.id);
    if (exists) {
      await updateVideo(editingVideo);
    } else {
      await addVideo(editingVideo);
    }
    setIsModalOpen(false);
    setEditingVideo(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-500" />
            <span>Video & Visual Releases Manager</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Embed official YouTube music videos, cyphers, studio sessions, and creative tech showcases.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video Release</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search videos by title or category..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-video relative overflow-hidden bg-black">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => openVideoPlayer(video)}
                className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-90 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </button>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                {video.duration}
              </span>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white">
                {video.category}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1">
                  {video.title}
                </h4>
                <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                  {video.description}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>{video.date}</span>
                <span>{video.viewsCount || '0'} views</span>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-1">
                <button
                  onClick={() => handleOpenEdit(video)}
                  className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-amber-500 transition-colors"
                  title="Edit Video"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(video)}
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors"
                  title="Delete Video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-y-auto space-y-5">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {videos.some(v => v.id === editingVideo.id) ? 'Edit Video Release' : 'Add Video Release'}
              </h3>
              <p className="text-xs text-neutral-400">
                Paste any YouTube URL to auto-fetch title and thumbnail in 1-click.
              </p>
            </div>

            {/* Smart Auto-Fetch Box */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <label className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>YouTube Link (Auto-Fetch Metadata)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                  value={editingVideo.youtubeUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    const id = extractYouTubeId(val);
                    setEditingVideo({
                      ...editingVideo,
                      youtubeUrl: val,
                      youtubeEmbedId: id || editingVideo.youtubeEmbedId,
                      thumbnail: id ? getYouTubeThumbnail(id, 'maxres') : editingVideo.thumbnail
                    });
                  }}
                  onBlur={() => {
                    if (editingVideo.youtubeUrl && !editingVideo.title) {
                      handleFetchMetadata(editingVideo.youtubeUrl);
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleFetchMetadata(editingVideo.youtubeUrl)}
                  disabled={fetchingMeta}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${fetchingMeta ? 'animate-spin' : ''}`} />
                  <span>{fetchingMeta ? 'Fetching...' : 'Fetch Info'}</span>
                </button>
              </div>
              {fetchedSuccess && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Title, thumbnail & embed linked successfully!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  placeholder="e.g. Arjun Bharti Mina - Desi Cypher (Official Music Video)"
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Embed Video ID
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVideo.youtubeEmbedId}
                    onChange={(e) => {
                      const id = extractYouTubeId(e.target.value) || e.target.value;
                      setEditingVideo({ 
                        ...editingVideo, 
                        youtubeEmbedId: id, 
                        youtubeUrl: `https://youtube.com/watch?v=${id}`,
                        thumbnail: getYouTubeThumbnail(id, 'maxres')
                      });
                    }}
                    placeholder="11-char ID"
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Category
                  </label>
                  <select
                    value={editingVideo.category}
                    onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                  >
                    <option value="Music Video">Music Video</option>
                    <option value="Shorts">Shorts</option>
                    <option value="BTS">BTS</option>
                    <option value="Live Performance">Live Performance</option>
                    <option value="Creative">Creative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Duration (e.g. 3:45)
                  </label>
                  <input
                    type="text"
                    value={editingVideo.duration}
                    onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={editingVideo.date}
                    onChange={(e) => setEditingVideo({ ...editingVideo, date: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Thumbnail with Live Preview */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Thumbnail Image URL
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={editingVideo.thumbnail}
                    onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                  />
                </div>
                {editingVideo.thumbnail && (
                  <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                    <img 
                      src={editingVideo.thumbnail} 
                      alt="Thumbnail preview" 
                      className="w-20 aspect-video rounded-lg object-cover bg-black" 
                    />
                    <span className="text-[11px] text-neutral-400">Live thumbnail preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Description / Story
                </label>
                <textarea
                  rows={2}
                  value={editingVideo.description}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  placeholder="Tell viewers about this visual release..."
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md"
                >
                  Save Video Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Video?"
        itemName={deleteTarget?.title || ''}
        itemType="Video"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteVideo(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
