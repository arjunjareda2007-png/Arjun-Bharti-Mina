import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ActiveTab, ThemeMode } from '../types';
import { THEME_PRESETS } from '../utils/themePresets';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';
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
  ShieldCheck, 
  Lock, 
  Download, 
  X, 
  ChevronRight,
  Search,
  ExternalLink
} from 'lucide-react';

export const MenuDrawer: React.FC = () => {
  const { 
    isMenuOpen, 
    closeMenu, 
    currentTab, 
    setCurrentTab, 
    theme, 
    setTheme, 
    isOwner, 
    authUser, 
    showToast, 
    openSearch 
  } = useStore();

  const [showThemePicker, setShowThemePicker] = useState(false);

  const isAdminLoggedIn = isOwner || !!authUser;

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

  const handlePwaInstall = () => {
    hapticLight();
    const promptEvent = (window as any).deferredPwaPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          showToast('App installed successfully!', 'success');
        }
      });
    } else {
      showToast('Install via Chrome: Click Chrome menu (⋮) -> "Install App" or "Add to Home screen"', 'info');
    }
  };

  const toggleTheme = () => {
    hapticLight();
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} mode`, 'info');
  };

  const allSections: { id: ActiveTab; label: string; desc: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', desc: 'Featured hero, releases, milestones & updates', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'about', label: 'About & Bio', desc: 'Personal story, education, vision & stats', icon: <User className="w-5 h-5" /> },
    { id: 'music', label: 'Music & Songs', desc: 'Full discography, streaming & audio preview', icon: <Music2 className="w-5 h-5" />, badge: 'Audio' },
    { id: 'lyrics', label: 'Lyrics Vault', desc: 'Read lyrics, themes, poetry & meanings', icon: <FileText className="w-5 h-5" /> },
    { id: 'gallery', label: 'Photo Archive', desc: 'High-res pictures, portraits & milestones', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'videos', label: 'Video Showcase', desc: 'Music videos, interviews & visual releases', icon: <Video className="w-5 h-5" /> },
    { id: 'projects', label: 'Tech & Projects', desc: 'Engineering & digital creations', icon: <Globe className="w-5 h-5" /> },
    { id: 'books', label: 'Books & Literature', desc: 'Published books, sample chapters & links', icon: <BookOpen className="w-5 h-5" />, badge: 'Books' },
    { id: 'social', label: 'Find Me Online', desc: 'Social channels, Spotify, YouTube & links', icon: <Share2 className="w-5 h-5" /> },
    { id: 'contact', label: 'Direct Contact', desc: 'Inquiries, bookings & collaboration', icon: <Mail className="w-5 h-5" /> },
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
        className="w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl h-full flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250 z-[8010]"
        onClick={(e) => e.stopPropagation()}
        aria-label="Navigation Menu & Sections"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <div>
              <h2 className="text-sm font-bold font-display uppercase tracking-wider text-neutral-900 dark:text-white">
                Menu & Archive Sections
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                Explore all areas of the portfolio
              </p>
            </div>
          </div>
          <button 
            type="button"
            id="menu-drawer-close-btn"
            onClick={() => {
              hapticLight();
              closeMenu();
            }}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Close Menu (ESC)"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          
          {/* Quick Search Trigger */}
          <button
            type="button"
            id="drawer-search-trigger"
            onClick={() => {
              hapticLight();
              closeMenu();
              openSearch();
            }}
            className="w-full p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-[1.01] active:scale-[0.98] text-xs font-medium cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>Search songs, lyrics, books & archive...</span>
            </div>
            <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-500">⌘K</kbd>
          </button>

          {/* Primary Sections Directory */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                Portfolio Sections
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                10 Sections
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                    className={`flex items-start gap-3 p-3 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.97] cursor-pointer border ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-lg'
                        : 'bg-neutral-50 dark:bg-neutral-950/80 hover:bg-neutral-100 dark:hover:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 border-neutral-200/80 dark:border-neutral-800/80'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isActive 
                        ? 'bg-amber-500 text-neutral-950' 
                        : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}>
                      {sec.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate">
                          {sec.label}
                        </span>
                        {sec.badge && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                            isActive ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                          }`}>
                            {sec.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] truncate mt-0.5 ${
                        isActive ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'
                      }`}>
                        {sec.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clerk Member & Creator Authentication Card */}
          <ClerkDrawerAuthCard />

          {/* Quick Hub Utilities & Tools */}
          <div className="space-y-2 pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80">
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold block px-1">
              Utilities & Hub Preferences
            </span>

            <div className="space-y-2">
              {/* Appearance Aesthetic Theme Switcher & Palette */}
              <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all">
                <button
                  id="menu-theme-toggle-btn"
                  type="button"
                  onClick={() => {
                    hapticLight();
                    setShowThemePicker(!showThemePicker);
                  }}
                  className="w-full p-3 flex items-center justify-between group text-left cursor-pointer hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-neutral-700 text-amber-500 dark:text-amber-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <span>Aesthetic Themes</span>
                        <span className="text-[10px] font-mono font-normal text-amber-600 dark:text-amber-400">9 Modes</span>
                      </h4>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                        Active: <span className="font-bold text-neutral-800 dark:text-neutral-200 capitalize">{THEME_PRESETS.find(p => p.id === theme)?.name || theme}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                      {THEME_PRESETS.find(p => p.id === theme)?.tag || 'Theme'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${showThemePicker ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {showThemePicker && (
                  <div className="p-3 pt-1 border-t border-neutral-200/80 dark:border-neutral-800/80 grid grid-cols-3 gap-2 animate-fadeIn">
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
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-amber-500 ring-1 ring-amber-500 bg-white dark:bg-neutral-900 shadow-xs'
                              : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-200/50 dark:bg-neutral-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span 
                              className="w-2.5 h-2.5 rounded-full shrink-0" 
                              style={{ backgroundColor: preset.accentHex }} 
                            />
                            <span className="text-[10px] font-bold text-neutral-900 dark:text-white truncate">
                              {preset.name}
                            </span>
                          </div>
                          <p className="text-[9px] text-neutral-500 dark:text-neutral-400 font-mono truncate">
                            {preset.subtitle}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Owner & Admin Portal */}
              <button
                id="menu-admin-access-btn"
                type="button"
                onClick={() => {
                  hapticLight();
                  setCurrentTab('admin');
                  closeMenu();
                }}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between group transition-all hover:scale-[1.01] active:scale-[0.98] text-left cursor-pointer ${
                  isAdminLoggedIn 
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20' 
                    : 'bg-neutral-100 dark:bg-neutral-850 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0 ${
                    isAdminLoggedIn ? 'bg-emerald-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}>
                    {isAdminLoggedIn ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <span>Owner & Admin Portal</span>
                      {isAdminLoggedIn && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-mono font-bold">Logged In</span>
                      )}
                    </h4>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      {isAdminLoggedIn ? 'Manage songs, gallery, lyrics, analytics' : 'Sign in to access artist content manager'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Install App PWA Button */}
              <button
                id="menu-install-pwa-btn"
                type="button"
                onClick={() => {
                  handlePwaInstall();
                  closeMenu();
                }}
                className="w-full p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900/90 flex items-center justify-between text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-amber-500" />
                  <span>Install Web App (PWA)</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Add to Phone</span>
              </button>
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 text-center shrink-0">
          <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
            Arjun Bharti Mina • Official Portfolio Hub
          </p>
        </div>
      </aside>
    </div>
  );
};
