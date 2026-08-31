import React, { useState, useRef } from 'react';
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
  Square,
  Upload,
  Link,
  Layers,
  FolderPlus,
  Check,
  Filter,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { hapticLight, hapticSelection, hapticSuccess } from '../../utils/haptics';

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

interface QueuedImage {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  location: string;
  tags: string[];
  date: string;
}

export const GalleryTab: React.FC = () => {
  const { 
    gallery, 
    addGalleryItem, 
    bulkAddGalleryItems,
    updateGalleryItem, 
    deleteGalleryItem,
    bulkDeleteItems,
    bulkTogglePublish,
    openLightbox,
    showToast
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Bulk Upload Modal State
  const [bulkMode, setBulkMode] = useState<'files' | 'urls'>('files');
  const [bulkUrlText, setBulkUrlText] = useState('');
  const [bulkQueue, setBulkQueue] = useState<QueuedImage[]>([]);
  const [bulkDefaultCategory, setBulkDefaultCategory] = useState('Studio');
  const [bulkDefaultLocation, setBulkDefaultLocation] = useState('Jaipur, Rajasthan');
  const [bulkDefaultTags, setBulkDefaultTags] = useState('Artist, Studio, Portfolio');
  const [bulkDefaultDate, setBulkDefaultDate] = useState(new Date().toISOString().split('T')[0]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['all', 'Studio', 'Live', 'Lifestyle', 'BTS', 'Engineering', 'Creative'];

  const filteredItems = gallery.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleOpenAdd = () => {
    hapticLight();
    setEditingItem({
      ...EMPTY_GALLERY,
      id: `gallery-${Date.now()}`
    });
    setTagInput('Artist, Studio');
    setIsModalOpen(true);
  };

  const handleOpenBulkAdd = () => {
    hapticLight();
    setBulkQueue([]);
    setBulkUrlText('');
    setIsBulkModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    hapticLight();
    setEditingItem({ ...item });
    setTagInput(item.tags?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title.trim()) return;

    hapticLight();
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
    hapticSelection();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    hapticSelection();
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(i => i.id));
    }
  };

  // Multiple File Reader Handler
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFiles(true);
    hapticLight();

    const newItems: QueuedImage[] = [];
    const readPromises: Promise<void>[] = [];

    Array.from(files).forEach((file, index) => {
      const promise = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            const cleanTitle = file.name
              .replace(/\.[^/.]+$/, '')
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, c => c.toUpperCase());

            newItems.push({
              id: `gallery-bulk-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 5)}`,
              title: cleanTitle || `Visual Archive #${bulkQueue.length + newItems.length + 1}`,
              imageUrl: result,
              category: bulkDefaultCategory,
              location: bulkDefaultLocation,
              tags: bulkDefaultTags.split(',').map(t => t.trim()).filter(Boolean),
              date: bulkDefaultDate
            });
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
      readPromises.push(promise);
    });

    await Promise.all(readPromises);
    setBulkQueue(prev => [...prev, ...newItems]);
    setIsProcessingFiles(false);
    hapticSuccess();
    showToast(`Loaded ${newItems.length} photos ready to add!`, 'success');
  };

  // Parse URLs entered in textarea
  const handleParseUrls = () => {
    if (!bulkUrlText.trim()) return;
    hapticLight();

    const urls = bulkUrlText
      .split(/[\n,]+/)
      .map(u => u.trim())
      .filter(u => u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image'));

    if (urls.length === 0) {
      showToast('No valid image URLs detected. Please enter valid http/https links.', 'error');
      return;
    }

    const newItems: QueuedImage[] = urls.map((url, idx) => ({
      id: `gallery-bulk-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
      title: `Photo ${bulkQueue.length + idx + 1}`,
      imageUrl: url,
      category: bulkDefaultCategory,
      location: bulkDefaultLocation,
      tags: bulkDefaultTags.split(',').map(t => t.trim()).filter(Boolean),
      date: bulkDefaultDate
    }));

    setBulkQueue(prev => [...prev, ...newItems]);
    setBulkUrlText('');
    hapticSuccess();
    showToast(`Added ${newItems.length} image URLs to batch queue!`, 'success');
  };

  // Remove single item from bulk queue
  const handleRemoveFromQueue = (index: number) => {
    hapticSelection();
    setBulkQueue(prev => prev.filter((_, i) => i !== index));
  };

  // Save All in Bulk Queue to Firestore
  const handleSaveBulkQueue = async () => {
    if (bulkQueue.length === 0) return;
    hapticLight();

    const formattedGalleryItems: GalleryItem[] = bulkQueue.map(item => ({
      id: item.id,
      title: item.title.trim() || 'Visual Archive Item',
      imageUrl: item.imageUrl,
      category: item.category || bulkDefaultCategory,
      description: `Photography archive from ${item.location || bulkDefaultLocation}.`,
      location: item.location || bulkDefaultLocation,
      date: item.date || bulkDefaultDate,
      tags: item.tags.length > 0 ? item.tags : bulkDefaultTags.split(',').map(t => t.trim()).filter(Boolean),
      published: true,
      featured: false
    }));

    await bulkAddGalleryItems(formattedGalleryItems);
    setIsBulkModalOpen(false);
    setBulkQueue([]);
    hapticSuccess();
  };

  // Batch delete selected items
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    hapticLight();
    await bulkDeleteItems('gallery', selectedIds);
    setSelectedIds([]);
    setIsBulkDeleting(false);
    hapticSuccess();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <span>Photography & Visual Gallery Manager</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Organize, multi-upload, batch add, and manage high-resolution portfolio images with real-time Firestore sync.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleOpenBulkAdd}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 border border-neutral-700/60 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Batch Add / Multi-Upload</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Photo</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & Multi-select Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search gallery by title, caption, location..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="button"
            onClick={selectAll}
            className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-700 shrink-0"
            title="Select all filtered images"
          >
            {selectedIds.length > 0 && selectedIds.length === filteredItems.length ? (
              <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            <span>{selectedIds.length === filteredItems.length ? 'Deselect All' : 'Select All'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                hapticLight();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Sticky Bulk Operations Toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md"
          >
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500 text-neutral-950 font-bold">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-300">
                {selectedIds.length} of {gallery.length} photos selected
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={async () => {
                  hapticLight();
                  await bulkTogglePublish('gallery', selectedIds, true);
                  showToast(`Published ${selectedIds.length} photos!`, 'success');
                  setSelectedIds([]);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Publish Selected</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  hapticLight();
                  await bulkTogglePublish('gallery', selectedIds, false);
                  showToast(`Set ${selectedIds.length} photos to draft!`, 'info');
                  setSelectedIds([]);
                }}
                className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Draft Selected</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  setIsBulkDeleting(true);
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl font-medium cursor-pointer transition-colors"
              >
                Cancel Selection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <ImageIcon className="w-12 h-12 text-neutral-400 mx-auto opacity-40" />
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">No photos in gallery</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {searchTerm ? `No images matching "${searchTerm}".` : 'Add your first high-resolution photo or use Batch Add to import multiple images at once.'}
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              type="button"
              onClick={handleOpenBulkAdd}
              className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl cursor-pointer"
            >
              Batch Add Photos
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`group relative bg-white dark:bg-neutral-900 border rounded-2xl overflow-hidden shadow-sm transition-all ${
                  isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700'
                }`}
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => openLightbox(item)}
                  />

                  {/* Top overlay controls */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleSelect(item.id)}
                      className="p-1.5 rounded-lg bg-black/70 text-white backdrop-blur-sm hover:bg-black transition-colors cursor-pointer"
                    >
                      {isSelected ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4" />}
                    </button>

                    <span className="px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-white font-semibold backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {item.location || 'Jaipur, RJ'} • {item.date}
                  </p>

                  <div className="pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => updateGalleryItem({ ...item, published: !item.published })}
                      className={`text-[10px] font-semibold flex items-center gap-1 cursor-pointer ${
                        item.published !== false ? 'text-emerald-500' : 'text-neutral-400'
                      }`}
                    >
                      {item.published !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{item.published !== false ? 'Live' : 'Draft'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Edit Photo"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Photo"
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
      )}

      {/* BATCH ADD / MULTI-UPLOAD MODAL */}
      {isBulkModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsBulkModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-y-auto space-y-6 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                    Batch Upload & Multi-Image Importer
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Add multiple photos simultaneously from your local device or paste a list of URLs.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Mode Selector */}
            <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setBulkMode('files')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  bulkMode === 'files'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-amber-500" />
                <span>Upload Multiple Files</span>
              </button>

              <button
                type="button"
                onClick={() => setBulkMode('urls')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  bulkMode === 'urls'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Link className="w-3.5 h-3.5 text-amber-500" />
                <span>Paste Multiple URLs</span>
              </button>
            </div>

            {/* Mode 1: File Uploader */}
            {bulkMode === 'files' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFilesSelected}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-neutral-50 dark:bg-neutral-950/50 group"
                >
                  <Upload className="w-8 h-8 text-neutral-400 group-hover:text-amber-500 mx-auto transition-colors mb-2" />
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Click to browse or drop multiple photos
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Select 5, 10, 20+ images (JPG, PNG, WebP) at once. Titles are auto-generated from file names.
                  </p>
                </div>
              </div>
            )}

            {/* Mode 2: Multi-URL Importer */}
            {bulkMode === 'urls' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Paste Image URLs (One URL per line or comma-separated)
                  </label>
                  <textarea
                    rows={4}
                    value={bulkUrlText}
                    onChange={(e) => setBulkUrlText(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2...&#10;https://images.unsplash.com/photo-3..."
                    className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleParseUrls}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Queue URLs for Import</span>
                  </button>
                </div>
              </div>
            )}

            {/* Batch Presets Configuration */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Batch Default Metadata (Applied to all queued images)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Category</label>
                  <select
                    value={bulkDefaultCategory}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setBulkDefaultCategory(newCat);
                      setBulkQueue(prev => prev.map(item => ({ ...item, category: newCat })));
                    }}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                  >
                    {categories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={bulkDefaultLocation}
                    onChange={(e) => {
                      const newLoc = e.target.value;
                      setBulkDefaultLocation(newLoc);
                      setBulkQueue(prev => prev.map(item => ({ ...item, location: newLoc })));
                    }}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={bulkDefaultTags}
                    onChange={(e) => {
                      const newTags = e.target.value;
                      setBulkDefaultTags(newTags);
                      const parsed = newTags.split(',').map(t => t.trim()).filter(Boolean);
                      setBulkQueue(prev => prev.map(item => ({ ...item, tags: parsed })));
                    }}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Queued Photos Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <span>Queued Photos for Import</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-mono text-[10px] font-bold">
                    {bulkQueue.length}
                  </span>
                </span>

                {bulkQueue.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setBulkQueue([])}
                    className="text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    Clear All Queued
                  </button>
                )}
              </div>

              {bulkQueue.length === 0 ? (
                <div className="p-6 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400">
                  No photos in batch queue yet. Select files or paste URLs above to populate.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                  {bulkQueue.map((item, idx) => (
                    <div key={item.id} className="relative group rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 aspect-[4/3]">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveFromQueue(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-red-400 hover:text-red-300 hover:bg-black transition-colors cursor-pointer"
                        title="Remove from queue"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 to-transparent">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            setBulkQueue(prev => prev.map((q, i) => i === idx ? { ...q, title: newTitle } : q));
                          }}
                          className="w-full px-1.5 py-0.5 bg-black/60 border border-neutral-700 rounded text-[10px] text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3">
              <span className="text-xs text-neutral-500">
                {bulkQueue.length} photo{bulkQueue.length === 1 ? '' : 's'} ready to save to database
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={bulkQueue.length === 0}
                  onClick={handleSaveBulkQueue}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Upload & Save {bulkQueue.length} Photos</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SINGLE ADD / EDIT MODAL */}
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
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {gallery.some(g => g.id === editingItem.id) ? 'Edit Photo' : 'Add Single Photo to Gallery'}
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
                  className="px-4 py-1.5 text-xs text-neutral-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget || isBulkDeleting}
        title={isBulkDeleting ? `Delete ${selectedIds.length} Selected Photos?` : 'Delete Photo?'}
        itemName={isBulkDeleting ? `${selectedIds.length} images from your gallery` : (deleteTarget?.title || '')}
        itemType={isBulkDeleting ? 'Batch of Photos' : 'Gallery Photo'}
        onConfirm={async () => {
          if (isBulkDeleting) {
            await handleConfirmBulkDelete();
          } else if (deleteTarget) {
            await deleteGalleryItem(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => {
          setDeleteTarget(null);
          setIsBulkDeleting(false);
        }}
      />
    </div>
  );
};
