import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { FeaturedIcon } from '../../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  MoveUp, 
  MoveDown, 
  Globe, 
  RefreshCw,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { AddEditFeaturedIconModal, ICON_PRESETS } from '../AddEditFeaturedIconModal';
import { hapticLight, hapticMedium } from '../../utils/haptics';
import { initialFeaturedIcons } from '../../data/initialData';

export const FeaturedIconsTab: React.FC = () => {
  const { 
    featuredIcons, 
    deleteFeaturedIcon, 
    reorderFeaturedIcons, 
    toggleFeaturedIconVisibility, 
    addFeaturedIcon,
    showToast 
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<FeaturedIcon | null>(null);

  const sortedIcons = [...(featuredIcons || [])].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const handleOpenAddModal = () => {
    hapticLight();
    setSelectedIcon(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (icon: FeaturedIcon) => {
    hapticLight();
    setSelectedIcon(icon);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      hapticMedium();
      await deleteFeaturedIcon(id);
    }
  };

  const moveIcon = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedIcons.length) return;
    
    hapticLight();
    const newItems = [...sortedIcons];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    await reorderFeaturedIcons(newItems);
  };

  const handleRestoreDefaults = async () => {
    if (window.confirm('Restore default curated platform icons (Spotify, Apple Music, YouTube, etc.)?')) {
      hapticMedium();
      await reorderFeaturedIcons(initialFeaturedIcons);
      showToast('Default platform icons restored');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Featured Icons & Platforms Strip</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage icons displayed in the horizontal strip below the collaboration banner. When more than 4 icons are active, they auto-scroll in a continuous smooth loop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Restore default icons"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Featured Icon</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-neutral-700 dark:text-neutral-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold shrink-0">
            {sortedIcons.length}
          </div>
          <div>
            <span className="font-bold text-neutral-900 dark:text-white block">
              {sortedIcons.filter(i => i.visible !== false).length} Active Featured Icons
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {sortedIcons.length > 4 
                ? '✨ Auto-scroll ticker mode is active (more than 4 icons enabled).'
                : 'Static grid mode is active. Add more than 4 icons to activate the infinite marquee auto-scroll.'}
            </span>
          </div>
        </div>
      </div>

      {/* Icon List */}
      <div className="space-y-3">
        {sortedIcons.map((icon, idx) => {
          const isVisible = icon.visible !== false;
          return (
            <div
              key={icon.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isVisible
                  ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xs'
                  : 'bg-neutral-100/60 dark:bg-neutral-900/40 border-neutral-200/60 dark:border-neutral-800/60 opacity-60'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Index / Order */}
                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveIcon(idx, 'up')}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-20"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sortedIcons.length - 1}
                      onClick={() => moveIcon(idx, 'down')}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-20"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="w-6 text-center text-xs font-mono font-bold text-neutral-400">
                    {idx + 1}
                  </span>
                </div>

                {/* Logo / Graphic */}
                <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 p-2 flex items-center justify-center shrink-0">
                  {icon.iconImage ? (
                    <img
                      src={icon.iconImage}
                      alt={icon.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Globe className="w-5 h-5 text-amber-500" />
                  )}
                </div>

                {/* Text Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {icon.title}
                    </h4>
                    {icon.badge && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-300 font-semibold border border-amber-500/20 shrink-0">
                        {icon.badge}
                      </span>
                    )}
                    {icon.category && (
                      <span className="hidden sm:inline-block text-[10px] text-neutral-400 font-mono">
                        • {icon.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-xs sm:max-w-sm">
                      {icon.subtitle || icon.redirectUrl}
                    </span>
                    <a
                      href={icon.redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[11px] text-amber-600 dark:text-amber-400 hover:underline gap-0.5 shrink-0"
                    >
                      <span>Visit</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => toggleFeaturedIconVisibility(icon.id)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isVisible
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                      : 'bg-neutral-200 dark:bg-neutral-800 border-transparent text-neutral-500'
                  }`}
                  title={isVisible ? 'Hide from strip' : 'Show on strip'}
                >
                  {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span className="text-xs font-mono">{isVisible ? 'Active' : 'Hidden'}</span>
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(icon)}
                  className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                  title="Edit Icon"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(icon.id, icon.title)}
                  className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 transition-colors cursor-pointer"
                  title="Delete Icon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddEditFeaturedIconModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedIcon(null);
          }}
          iconToEdit={selectedIcon}
        />
      )}
    </div>
  );
};
