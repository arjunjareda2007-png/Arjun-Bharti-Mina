import React from 'react';
import { useStore } from '../context/StoreContext';
import { ActiveTab } from '../types';
import { hapticLight, hapticSelection, hapticMedium } from '../utils/haptics';
import { ClerkNavAuthControls } from './ClerkAuthControls';
import { 
  Search, 
  Menu, 
  X, 
  Music2, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Globe, 
  BookOpen, 
  User, 
  Mail, 
  Share2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    openSearch, 
    profile, 
    isMenuOpen,
    toggleMenu,
    closeMenu
  } = useStore();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <User className="w-4 h-4" /> },
    { id: 'music', label: 'Music', icon: <Music2 className="w-4 h-4" /> },
    { id: 'lyrics', label: 'Lyrics', icon: <FileText className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'videos', label: 'Videos', icon: <Video className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Globe className="w-4 h-4" /> },
    { id: 'books', label: 'Books', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'social', label: 'Find Me', icon: <Share2 className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <>
      <header id="main-header" className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl transition-colors duration-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* High-Definition Crisp ABM Monogram Logo & Brand */}
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            <button 
              id="brand-logo-btn"
              type="button"
              onClick={() => { 
                hapticLight();
                setCurrentTab('home'); 
                closeMenu();
              }}
              title="Arjun Bharti Mina (ABM)"
              className="flex items-center text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-2xl p-1 -ml-1 hover:scale-102 active:scale-97 transition-transform cursor-pointer"
            >
              {/* Crisp Stylized ABM Vector Monogram */}
              <div className="relative px-3.5 sm:px-4 py-1.5 h-10 sm:h-11 rounded-xl bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white border-2 border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center gap-2 group-hover:border-neutral-900 dark:group-hover:border-white group-hover:shadow-md transition-all duration-300 shrink-0">
                <div className="w-6 h-6 rounded-md bg-neutral-950 dark:bg-white flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 100 100" className="w-4 h-4">
                    <polygon points="50,8 92,50 50,92 8,50" fill="none" stroke="currentColor" className="text-white dark:text-neutral-950" strokeWidth="7" />
                    <circle cx="50" cy="50" r="15" fill="currentColor" className="text-rose-500" />
                  </svg>
                </div>
                <span className="font-display font-black tracking-widest text-sm sm:text-base text-neutral-950 dark:text-white font-mono select-none">
                  ABM
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-navigation" className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  type="button"
                  onClick={() => {
                    hapticSelection();
                    setCurrentTab(item.id);
                    closeMenu();
                  }}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions: Search, Clerk Auth & Menu Toggle Button */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Global Search Button */}
            <button
              id="search-trigger-btn"
              type="button"
              onClick={() => {
                hapticLight();
                openSearch();
              }}
              title="Search Archive (⌘K)"
              className="h-9 flex items-center gap-1.5 px-3 text-xs rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 transition-all duration-150 hover:scale-104 active:scale-95 shadow-xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-medium">Search</span>
              <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 font-mono bg-neutral-200 dark:bg-neutral-800 rounded text-neutral-500">⌘K</kbd>
            </button>

            {/* Clerk Authentication Controls (Sign In / Sign Up / User Profile) */}
            <ClerkNavAuthControls />

            {/* Menu Button (Clear, prominent and high contrast) */}
            <button
              id="three-link-menu-btn"
              type="button"
              onClick={() => {
                hapticMedium();
                toggleMenu();
              }}
              className={`h-9 flex items-center gap-1.5 px-3.5 rounded-full border transition-all duration-200 hover:scale-105 active:scale-92 shadow-xs cursor-pointer select-none ${
                isMenuOpen 
                  ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold shadow-amber-500/20' 
                  : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200'
              }`}
              title="Open Navigation Menu & All Sections"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="text-xs font-semibold">Menu</span>
            </button>

          </div>
        </div>
      </header>
    </>
  );
};
