import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { NavigationItem } from '../../types';
import { Menu, Save, CheckCircle2, Eye, EyeOff, MoveVertical } from 'lucide-react';

export const NavigationTab: React.FC = () => {
  const { navigation, updateNavigation } = useStore();
  const [navItems, setNavItems] = useState<NavigationItem[]>(navigation);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLabelChange = (id: string, label: string) => {
    setNavItems(prev => prev.map(item => item.id === id ? { ...item, label } : item));
  };

  const handleVisibilityToggle = (id: string) => {
    setNavItems(prev => prev.map(item => item.id === id ? { ...item, visible: !item.visible } : item));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...navItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    newItems.forEach((item, idx) => item.order = idx + 1);
    setNavItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateNavigation(navItems);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Menu className="w-5 h-5 text-amber-500" />
            <span>Site Navigation & Menu Customizer</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Rename navigation links, reorder menu tabs, or hide specific pages from public visitors.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Navigation'}</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {navItems.map((item, idx) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
              item.visible
                ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm'
                : 'bg-neutral-100/50 dark:bg-neutral-900/40 border-neutral-200/50 dark:border-neutral-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                {idx + 1}
              </span>

              <input
                type="text"
                value={item.label}
                onChange={(e) => handleLabelChange(item.id, e.target.value)}
                className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-900 dark:text-white max-w-xs"
              />

              <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                ID: {item.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, 'up')}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-20"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={idx === navItems.length - 1}
                  onClick={() => moveItem(idx, 'down')}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-20"
                >
                  ▼
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleVisibilityToggle(item.id)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                  item.visible
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-neutral-200 dark:bg-neutral-800 border-transparent text-neutral-400'
                }`}
              >
                {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{item.visible ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
