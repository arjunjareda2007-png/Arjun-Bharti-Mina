import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SocialLink } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { 
  Share2, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  X
} from 'lucide-react';

const EMPTY_SOCIAL: SocialLink = {
  id: '',
  platform: 'Instagram',
  url: 'https://instagram.com',
  username: '@arjunbhartimina',
  iconName: 'instagram',
  category: 'Social Network',
  description: 'Official Instagram profile'
};

export const SocialTab: React.FC = () => {
  const { socialLinks, addSocialLink, updateSocialLink, deleteSocialLink } = useStore();
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);

  const handleOpenAdd = () => {
    setEditingLink({
      ...EMPTY_SOCIAL,
      id: `soc-${Date.now()}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: SocialLink) => {
    setEditingLink({ ...s });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink || !editingLink.platform.trim()) return;

    const exists = socialLinks.some(s => s.id === editingLink.id);
    if (exists) {
      await updateSocialLink(editingLink);
    } else {
      await addSocialLink(editingLink);
    }
    setIsModalOpen(false);
    setEditingLink(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-500" />
            <span>Social Links & Creator Handles</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your social handles, streaming channels, developer profiles, and direct contact buttons.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Link</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialLinks.map((link) => (
          <div
            key={link.id}
            className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-amber-500 shrink-0 font-bold text-xs">
                {link.platform.substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                  {link.platform}
                </p>
                <p className="text-[11px] text-neutral-400 font-mono truncate">
                  {link.username || link.url}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-neutral-400 hover:text-amber-500"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleOpenEdit(link)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteTarget(link)}
                className="p-1.5 text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingLink && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {socialLinks.some(s => s.id === editingLink.id) ? 'Edit Social Link' : 'Add Social Link'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Platform Name *</label>
                <input
                  type="text"
                  required
                  value={editingLink.platform}
                  onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Handle / Username</label>
                <input
                  type="text"
                  value={editingLink.username}
                  onChange={(e) => setEditingLink({ ...editingLink, username: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Full URL *</label>
                <input
                  type="url"
                  required
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <input
                  type="text"
                  value={editingLink.category}
                  onChange={(e) => setEditingLink({ ...editingLink, category: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Icon Style / Name</label>
                <input
                  type="text"
                  value={editingLink.iconName}
                  onChange={(e) => setEditingLink({ ...editingLink, iconName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono"
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
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Social Link?"
        itemName={deleteTarget?.platform || ''}
        itemType="Social Link"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteSocialLink(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
