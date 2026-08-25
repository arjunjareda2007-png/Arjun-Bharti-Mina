import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ActiveTab } from '../types';
import { 
  Search, 
  Sun, 
  Moon, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  Music2, 
  FileText, 
  Image, 
  Video, 
  Globe, 
  BookOpen, 
  User, 
  Mail, 
  Share2,
  Lock,
  Download
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    openSearch, 
    theme, 
    setTheme, 
    profile, 
    discoverRandomWork,
    isOwner,
    authUser,
    showToast
  } = useStore();

  const isAdminLoggedIn = isOwner || !!authUser;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [discoveryToast, setDiscoveryToast] = useState<string | null>(null);

  const handlePwaInstall = () => {
    // If beforeinstallprompt deferred prompt exists on window
    const promptEvent = (window as any).deferredPwaPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          showToast('App installed successfully!', 'success');
        }
      });
    } else {
      showToast('Install via Chrome: Click Chrome menu (⋮) -> "Install Arjun Bharti Mina Hub" / "Add to Home screen"', 'info');
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <User className="w-4 h-4" /> },
    { id: 'music', label: 'Music', icon: <Music2 className="w-4 h-4" /> },
    { id: 'lyrics', label: 'Lyrics', icon: <FileText className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <Image className="w-4 h-4" /> },
    { id: 'videos', label: 'Videos', icon: <Video className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Globe className="w-4 h-4" /> },
    { id: 'books', label: 'Books', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'social', label: 'Find Me', icon: <Share2 className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  const handleDiscover = () => {
    const item = discoverRandomWork();
    if (item) {
      setDiscoveryToast(`Discovered ${item.type}: "${item.title}"`);
      item.action();
      setTimeout(() => setDiscoveryToast(null), 3500);
    }
  };

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <>
      <header id="main-header" className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              id="brand-logo-btn"
              onClick={() => { setCurrentTab('home'); }}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-display font-extrabold flex items-center justify-center text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform">
                ABM
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-semibold tracking-tight block text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {profile.name}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono tracking-wide uppercase block">
                  Artist & Creator Hub
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-navigation" className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-sm font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Global Search Button */}
            <button
              id="search-trigger-btn"
              onClick={openSearch}
              title="Search Archive (⌘K)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 font-mono bg-neutral-200 dark:bg-neutral-800 rounded text-neutral-500">⌘K</kbd>
            </button>

            {/* Install App Button */}
            <button
              id="install-pwa-nav-btn"
              onClick={handlePwaInstall}
              title="Install App directly from Chrome"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-colors font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>

            {/* Discover Random Work */}
            <button
              id="discover-random-btn"
              onClick={handleDiscover}
              title="Discover Something Random"
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Theme: ${theme}`}
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* Admin CMS Access */}
            <button
              id="admin-nav-btn"
              onClick={() => setCurrentTab('admin')}
              title={isAdminLoggedIn ? "Admin Dashboard (Logged In)" : "Owner Portal"}
              className={`p-2 rounded-full transition-colors ${
                currentTab === 'admin'
                  ? 'bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/40'
                  : isAdminLoggedIn
                  ? 'text-emerald-500 hover:bg-emerald-500/10'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {isAdminLoggedIn ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu-drawer" className="lg:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-1 animate-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Discovery Toast notification */}
      {discoveryToast && (
        <div className="fixed top-20 right-4 z-50 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 px-4 py-2.5 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 border border-neutral-700 dark:border-neutral-300 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{discoveryToast}</span>
        </div>
      )}
    </>
  );
};
