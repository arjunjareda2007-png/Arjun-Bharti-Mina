import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { GalleryItem } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { 
  Image as ImageIcon, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  X, 
  CheckSquare,
  Square
} from 'lucide-react';

const EMPTY_GALLERY: GalleryItem = {
  id: '',
  title: '',
  imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800',
  category: 'Studio',
  description: '',
  location: 'Jaipur, Rajasthan',
  date: new Date().toISOString().split('T')[0],
  tags: ['Artist', 'Studio'],
  published: true,
  featured: false
};

export const GalleryTab: React.FC = () => {
  const { 
    gallery, 
    addGalleryItem, 
    updateGalleryItem, 
    deleteGalleryItem,
    bulkDeleteItems,
    bulkTogglePublish,
    openLightbox
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [tagInput, setTagInput] = useState('');

  const categories = ['all', 'Studio', 'Live', 'Lifestyle', 'BTS', 'Engineering', 'Creative'];

  const filteredItems = gallery.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingItem({
      ...EMPTY_GALLERY,
      id: `gallery-${Date.now()}`
    });
    setTagInput('Artist, Studio');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem({ ...item });
    setTagInput(item.tags?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title.trim()) return;

    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    const itemToSave = { ...editingItem, tags };

    const exists = gallery.some(g => g.id === itemToSave.id);
    if (exists) {
      await updateGalleryItem(itemToSave);
    } else {
      await addGalleryItem(itemToSave);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <span>Photography & Visual Gallery Manager</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Organize high-resolution artist portraits, stage shows, studio moments, and backstage shots.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Add Photo</span>
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
            placeholder="Search gallery images..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Toolbar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-amber-700 dark:text-amber-300">
            {selectedIds.length} images selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await bulkTogglePublish('gallery', selectedIds, true);
                setSelectedIds([]);
              }}
              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-medium"
            >
              Publish
            </button>
            <button
              onClick={async () => {
                await bulkDeleteItems('gallery', selectedIds);
                setSelectedIds([]);
              }}
              className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`group relative bg-white dark:bg-neutral-900 border rounded-2xl overflow-hidden shadow-sm transition-all ${
                isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => openLightbox(item)}
                />

                {/* Top overlay controls */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <button
                    onClick={() => toggleSelect(item.id)}
                    className="p-1 rounded-lg bg-black/60 text-white backdrop-blur-sm"
                  >
                    {isSelected ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4" />}
                  </button>

                  <span className="px-2 py-0.5 rounded-md bg-black/60 text-[10px] text-white font-medium backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                  {item.location} • {item.date}
                </p>

                <div className="pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => updateGalleryItem({ ...item, published: !item.published })}
                    className={`text-[10px] font-semibold flex items-center gap-1 ${
                      item.published !== false ? 'text-emerald-500' : 'text-neutral-400'
                    }`}
                  >
                    {item.published !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{item.published !== false ? 'Live' : 'Draft'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingItem && (
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
              {gallery.some(g => g.id === editingItem.id) ? 'Edit Photo' : 'Add Photo to Gallery'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingItem.imageUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                />
                {editingItem.imageUrl && (
                  <div className="mt-2 h-32 w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img src={editingItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                  >
                    {categories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Artist, Stage, Recording"
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
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Photo?"
        itemName={deleteTarget?.title || ''}
        itemType="Gallery Photo"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteGalleryItem(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
