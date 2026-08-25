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
  X
} from 'lucide-react';

const EMPTY_VIDEO: VideoItem = {
  id: '',
  title: '',
  youtubeEmbedId: 'dQw4w9WgXcQ',
  youtubeUrl: 'https://youtube.com',
  thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800',
  category: 'Music Video',
  duration: '3:30',
  description: '',
  viewsCount: '12K',
  date: new Date().toISOString().split('T')[0],
  featured: false,
  published: true
};

export const VideosTab: React.FC = () => {
  const { videos, addVideo, updateVideo, deleteVideo, openVideoPlayer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VideoItem | null>(null);

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingVideo({
      ...EMPTY_VIDEO,
      id: `vid-${Date.now()}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: VideoItem) => {
    setEditingVideo({ ...v });
    setIsModalOpen(true);
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
          placeholder="Search videos..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm"
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
                <div className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </button>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                {video.duration}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                  {video.category}
                </span>
                <span>{video.date}</span>
              </div>

              <h3 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">
                {video.title}
              </h3>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => updateVideo({ ...video, published: video.published === false ? true : false })}
                  className={`text-[10px] font-semibold flex items-center gap-1 ${
                    video.published !== false ? 'text-emerald-500' : 'text-neutral-400'
                  }`}
                >
                  {video.published !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{video.published !== false ? 'Live' : 'Draft'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(video)}
                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(video)}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
          <div className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-y-auto space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {videos.some(v => v.id === editingVideo.id) ? 'Edit Video Release' : 'Add Video Release'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">YouTube Embed ID (or URL)</label>
                  <input
                    type="text"
                    required
                    value={editingVideo.youtubeEmbedId}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val.includes('v=')) {
                        val = val.split('v=')[1]?.split('&')[0] || val;
                      } else if (val.includes('youtu.be/')) {
                        val = val.split('youtu.be/')[1]?.split('?')[0] || val;
                      }
                      setEditingVideo({ ...editingVideo, youtubeEmbedId: val, youtubeUrl: `https://youtube.com/watch?v=${val}` });
                    }}
                    placeholder="e.g. dQw4w9WgXcQ"
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
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
                  <label className="block text-xs font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingVideo.duration}
                    onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Release Date</label>
                  <input
                    type="date"
                    value={editingVideo.date}
                    onChange={(e) => setEditingVideo({ ...editingVideo, date: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Custom Thumbnail URL</label>
                <input
                  type="url"
                  value={editingVideo.thumbnail}
                  onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingVideo.description}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-neutral-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl"
                >
                  Save Video
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
