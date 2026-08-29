import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  SignInButton,
  UserButton 
} from '@clerk/clerk-react';
import { 
  isClerkKeyConfigured, 
  getClerkPublishableKey, 
  setClerkPublishableKey, 
  CLERK_APP_ID 
} from '../clerkConfig';
import { 
  LayoutDashboard, 
  User, 
  Sparkles, 
  Music, 
  FileText, 
  Video, 
  Camera, 
  FolderGit2, 
  BookOpen, 
  Youtube, 
  BarChart3, 
  Palette, 
  Layout, 
  FolderOpen, 
  Compass, 
  Search, 
  Share2, 
  Mail, 
  Settings, 
  LogOut, 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle, 
  LogIn, 
  KeyRound, 
  Check, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { OverviewTab } from './dashboard/OverviewTab';
import { ProfileTab } from './dashboard/ProfileTab';
import { MusicTab } from './dashboard/MusicTab';
import { LyricsTab } from './dashboard/LyricsTab';
import { VideosTab } from './dashboard/VideosTab';
import { GalleryTab } from './dashboard/GalleryTab';
import { ProjectsTab } from './dashboard/ProjectsTab';
import { BooksTab } from './dashboard/BooksTab';
import { YouTubeTab } from './dashboard/YouTubeTab';
import { AnalyticsTab } from './dashboard/AnalyticsTab';
import { AppearanceTab } from './dashboard/AppearanceTab';
import { BrandingTab } from './dashboard/BrandingTab';
import { HomepageTab } from './dashboard/HomepageTab';
import { MediaLibraryTab } from './dashboard/MediaLibraryTab';
import { NavigationTab } from './dashboard/NavigationTab';
import { SEOTab } from './dashboard/SEOTab';
import { SocialTab } from './dashboard/SocialTab';
import { MessagesTab } from './dashboard/MessagesTab';
import { SettingsTab } from './dashboard/SettingsTab';
import { hapticSelection, hapticLight, hapticMedium } from '../utils/haptics';

export const AdminDashboard: React.FC = () => {
  const { 
    authUser, 
    isOwner, 
    authLoading, 
    authError, 
    logout, 
    setCurrentTab,
    profile 
  } = useStore();

  const [activeSection, setActiveSection] = useState<string>('overview');
  const [showKeySetup, setShowKeySetup] = useState(false);
  const [clerkKeyInput, setClerkKeyInput] = useState(getClerkPublishableKey());
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setClerkPublishableKey(clerkKeyInput.trim());
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowKeySetup(false);
    }, 1500);
  };

  // Pure Clerk Authentication Gate
  if (!authUser || !isOwner) {
    const isClerkConfigured = isClerkKeyConfigured();

    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              {authUser && !isOwner ? <ShieldAlert className="w-7 h-7 text-amber-400" /> : <Lock className="w-7 h-7" />}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white font-display">
              Creator Dashboard
            </h1>
            <p className="text-xs text-neutral-400">
              Administrative portal for <span className="text-amber-400 font-semibold">{profile.name}</span>
            </p>
          </div>

          {/* Clerk Info Pill */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Clerk Authentication Engine</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">{CLERK_APP_ID.slice(0, 10)}...</span>
          </div>

          {/* If signed in as non-owner */}
          {authUser && !isOwner && (
            <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-xs text-amber-300 space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Non-Creator Account Detected</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Currently signed in with Clerk as <strong className="text-white font-mono">{authUser.email || authUser.fullName}</strong>.
                Only authorized creator accounts (<span className="text-amber-400 font-mono font-bold">arjunjareda1355@gmail.com</span> or <span className="text-amber-400 font-mono font-bold">arjunjareda2007@gmail.com</span>) are permitted to modify discography, gallery, and site configuration.
              </p>
              <button
                type="button"
                onClick={logout}
                className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out & Switch Account</span>
              </button>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-2xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Key Setup Form */}
          {showKeySetup ? (
            <form onSubmit={handleSaveKey} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Clerk Publishable Key
                </label>
                <input
                  type="text"
                  required
                  value={clerkKeyInput}
                  onChange={(e) => setClerkKeyInput(e.target.value)}
                  placeholder="pk_test_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Connected to Clerk App: <strong className="text-neutral-200">{CLERK_APP_ID}</strong>
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {keySaved ? (
                    <>
                      <Check className="w-4 h-4 text-neutral-950" />
                      <span>Key Saved & Clerk Active!</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Save & Activate Clerk</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowKeySetup(false)}
                  className="py-2.5 px-3 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : isClerkConfigured ? (
            // Clerk Configured: Direct Clerk Modal Sign In
            <div className="space-y-4 pt-1">
              <SignInButton mode="modal">
                <button
                  type="button"
                  onClick={() => hapticMedium()}
                  className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs rounded-2xl transition-all shadow-lg hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Clerk as Creator</span>
                </button>
              </SignInButton>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    setShowKeySetup(true);
                  }}
                  className="text-[11px] text-neutral-400 hover:text-amber-400 inline-flex items-center gap-1 transition-colors"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Clerk Publishable Key Settings</span>
                </button>
              </div>
            </div>
          ) : (
            // Clerk Key Missing: Prompt to activate
            <div className="space-y-4 text-center pt-2">
              <p className="text-xs text-neutral-400">
                Please enter your Clerk Publishable Key to connect this portal to your Clerk Application.
              </p>
              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  setShowKeySetup(true);
                }}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Enter Clerk Publishable Key</span>
              </button>
            </div>
          )}

          {/* Return to website */}
          <div className="pt-3 text-center border-t border-neutral-800">
            <button
              onClick={() => {
                hapticLight();
                setCurrentTab('home');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Biography', icon: User },
    { id: 'music', label: 'Discography & Audio', icon: Music },
    { id: 'lyrics', label: 'Song Lyrics', icon: FileText },
    { id: 'videos', label: 'Videos & Teasers', icon: Video },
    { id: 'gallery', label: 'Photo Gallery', icon: Camera },
    { id: 'projects', label: 'Projects & Ventures', icon: FolderGit2 },
    { id: 'books', label: 'Publications & Books', icon: BookOpen },
    { id: 'youtube', label: 'YouTube Studio', icon: Youtube },
    { id: 'analytics', label: 'Audience Analytics', icon: BarChart3 },
    { id: 'appearance', label: 'Appearance & Layout', icon: Palette },
    { id: 'branding', label: 'Brand & Themes', icon: Sparkles },
    { id: 'homepage', label: 'Homepage Builder', icon: Layout },
    { id: 'media', label: 'Media Library', icon: FolderOpen },
    { id: 'navigation', label: 'Navigation Menu', icon: Compass },
    { id: 'seo', label: 'SEO & Metadata', icon: Search },
    { id: 'social', label: 'Social Feeds', icon: Share2 },
    { id: 'messages', label: 'Fan Messages', icon: Mail },
    { id: 'settings', label: 'Settings & Backups', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col md:flex-row pb-20 md:pb-0 transition-colors">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-4 shrink-0 flex flex-col justify-between max-h-screen md:sticky md:top-0 overflow-y-auto">
        <div className="space-y-6">
          {/* Logo & Portal Status */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-sm shadow-md">
                ABM
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight font-display">
                  Creator Hub
                </h2>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Owner Admin</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentTab('home')}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    hapticSelection();
                    setActiveSection(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-[11px] text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate font-mono">{authUser?.email || authUser?.fullName || 'Arjun Bharti Mina'}</span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
              Control Panel
            </span>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white font-display">
              {navItems.find((i) => i.id === activeSection)?.label}
            </h1>
          </div>

          <button
            onClick={() => setCurrentTab('home')}
            className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:border-amber-500/40 text-neutral-700 dark:text-neutral-300 hover:text-amber-500 transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </button>
        </div>

        {/* Tab Components */}
        {activeSection === 'overview' && <OverviewTab onNavigateTab={setActiveSection} />}
        {activeSection === 'profile' && <ProfileTab />}
        {activeSection === 'music' && <MusicTab />}
        {activeSection === 'lyrics' && <LyricsTab />}
        {activeSection === 'videos' && <VideosTab />}
        {activeSection === 'gallery' && <GalleryTab />}
        {activeSection === 'projects' && <ProjectsTab />}
        {activeSection === 'books' && <BooksTab />}
        {activeSection === 'youtube' && <YouTubeTab />}
        {activeSection === 'analytics' && <AnalyticsTab />}
        {activeSection === 'appearance' && <AppearanceTab />}
        {activeSection === 'branding' && <BrandingTab />}
        {activeSection === 'homepage' && <HomepageTab />}
        {activeSection === 'media' && <MediaLibraryTab />}
        {activeSection === 'navigation' && <NavigationTab />}
        {activeSection === 'seo' && <SEOTab />}
        {activeSection === 'social' && <SocialTab />}
        {activeSection === 'messages' && <MessagesTab />}
        {activeSection === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};
