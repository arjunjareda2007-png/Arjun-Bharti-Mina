import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ActiveTab } from '../types';
import { THEME_PRESETS } from '../utils/themePresets';
import { hapticSelection, hapticLight } from '../utils/haptics';
import { ClerkDrawerAuthCard } from './ClerkAuthControls';
import { 
  Sparkles, 
  User, 
  Music2, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Globe, 
  BookOpen, 
  Share2, 
  Mail, 
  Palette,
  ChevronDown,
  X, 
  Search
} from 'lucide-react';

export const MenuDrawer: React.FC = () => {
  const { 
    isMenuOpen, 
    closeMenu, 
    currentTab, 
    setCurrentTab, 
    theme, 
    setTheme, 
    showToast, 
    openSearch 
  } = useStore();

  const [showThemePicker, setShowThemePicker] = useState(false);

  // Close drawer on Escape key
  React.useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  // Lock body scroll when drawer menu is open
  React.useEffect(() => {
    if (!isMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  if (!isMenuOpen) {
    return null;
  }

  const allSections: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <User className="w-4 h-4" /> },
    { id: 'music', label: 'Music', icon: <Music2 className="w-4 h-4" /> },
    { id: 'lyrics', label: 'Lyrics', icon: <FileText className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'videos', label: 'Videos', icon: <Video className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Globe className="w-4 h-4" /> },
    { id: 'books', label: 'Books', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Share2 className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div 
      id="master-menu-backdrop"
      className="fixed inset-0 z-[8000] bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200"
      onClick={() => {
        hapticLight();
        closeMenu();
      }}
    >
      <aside 
        id="master-menu-drawer"
        className="w-full max-w-sm sm:max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl h-full flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250 z-[8010]"
        onClick={(e) => e.stopPropagation()}
        aria-label="Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-950/70 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
              Menu
            </h2>
          </div>
          <button 
            type="button"
            id="menu-drawer-close-btn"
            onClick={() => {
              hapticLight();
              closeMenu();
            }}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Close Menu (ESC)"
            aria-label="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* Quick Search Trigger */}
          <button
            type="button"
            id="drawer-search-trigger"
            onClick={() => {
              hapticLight();
              closeMenu();
              openSearch();
            }}
            className="w-full p-2.5 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all text-xs font-medium cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" style={{ color: 'var(--color-accent-primary, #f59e0b)' }} />
              <span>Search...</span>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-500">⌘K</kbd>
          </button>

          {/* Primary Sections Directory - Arranged in a Line */}
          <div className="space-y-1.5" role="list">
            {allSections.map((sec) => {
              const isActive = currentTab === sec.id;
              return (
                <button
                  key={sec.id}
                  id={`menu-section-btn-${sec.id}`}
                  type="button"
                  onClick={() => {
                    hapticSelection();
                    setCurrentTab(sec.id);
                    closeMenu();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 px-3 rounded-xl text-left transition-all active:scale-[0.99] cursor-pointer border ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs font-semibold'
                      : 'bg-neutral-50 dark:bg-neutral-950/70 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 border-neutral-200/70 dark:border-neutral-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className={`p-2 rounded-lg shrink-0 transition-colors ${
                        isActive 
                          ? 'text-neutral-950 dark:text-neutral-950' 
                          : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                      style={isActive ? { backgroundColor: 'var(--color-accent-primary, #f59e0b)' } : undefined}
                    >
                      {sec.icon}
                    </div>
                    <span className="text-xs font-medium tracking-tight truncate">
                      {sec.label}
                    </span>
                  </div>

                  {isActive && (
                    <span 
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: 'var(--color-accent-glow, rgba(245,158,11,0.2))',
                        color: 'var(--color-accent-primary, #f59e0b)'
                      }}
                    >
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Member & Creator Authentication Card */}
          <ClerkDrawerAuthCard />

          {/* Appearance Aesthetic Theme Switcher */}
          <div className="space-y-2 pt-1 border-t border-neutral-200/80 dark:border-neutral-800/80">
            <div className="rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all">
              <button
                id="menu-theme-toggle-btn"
                type="button"
                onClick={() => {
                  hapticLight();
                  setShowThemePicker(!showThemePicker);
                }}
                className="w-full p-2.5 px-3 flex items-center justify-between group text-left cursor-pointer hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-neutral-900 dark:text-white">
                    Theme
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 capitalize">
                    {THEME_PRESETS.find(p => p.id === theme)?.name || theme}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${showThemePicker ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {showThemePicker && (
                <div className="p-2 pt-1 border-t border-neutral-200/80 dark:border-neutral-800/80 grid grid-cols-2 gap-1.5 animate-fadeIn">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = theme === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          hapticLight();
                          setTheme(preset.id);
                          showToast(`Switched to ${preset.name}`, 'info');
                        }}
                        className={`p-2 rounded-lg text-left border transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'border-amber-500 bg-white dark:bg-neutral-900 shadow-xs'
                            : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-200/50 dark:bg-neutral-800/50'
                        }`}
                      >
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: preset.accentHex }} 
                        />
                        <span className="text-[11px] font-medium text-neutral-900 dark:text-white truncate">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 text-center shrink-0">
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Arjun Bharti Mina
          </p>
        </div>
      </aside>
    </div>
  );
};
