import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  SignIn, 
  SignInButton, 
  UserButton 
} from '@clerk/clerk-react';
import { isClerkKeyConfigured, CLERK_APP_ID } from '../clerkConfig';
import { 
  LayoutDashboard, 
  User, 
  Sparkles, 
  Layout, 
  Music, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Code, 
  BookOpen, 
  Share2, 
  Mail, 
  Layers, 
  Palette, 
  Search, 
  Youtube, 
  Menu, 
  Settings, 
  TrendingUp, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  Lock,
  ArrowLeft,
  LogIn,
  KeyRound,
  AlertCircle,
  Loader2
} from 'lucide-react';

import { OverviewTab } from './dashboard/OverviewTab';
import { ProfileTab } from './dashboard/ProfileTab';
import { BrandingTab } from './dashboard/BrandingTab';
import { HomepageTab } from './dashboard/HomepageTab';
import { MusicTab } from './dashboard/MusicTab';
import { LyricsTab } from './dashboard/LyricsTab';
import { GalleryTab } from './dashboard/GalleryTab';
import { VideosTab } from './dashboard/VideosTab';
import { ProjectsTab } from './dashboard/ProjectsTab';
import { BooksTab } from './dashboard/BooksTab';
import { SocialTab } from './dashboard/SocialTab';
import { MessagesTab } from './dashboard/MessagesTab';
import { MediaLibraryTab } from './dashboard/MediaLibraryTab';
import { AppearanceTab } from './dashboard/AppearanceTab';
import { SEOTab } from './dashboard/SEOTab';
import { YouTubeTab } from './dashboard/YouTubeTab';
import { NavigationTab } from './dashboard/NavigationTab';
import { AnalyticsTab } from './dashboard/AnalyticsTab';
import { SettingsTab } from './dashboard/SettingsTab';

export const AdminDashboard: React.FC = () => {
  const { 
    authUser, 
    isOwner, 
    authLoading, 
    authError, 
    loginWithGoogle, 
    loginWithEmail, 
    resetPassword, 
    logout, 
    setCurrentTab,
    profile 
  } = useStore();

  const [activeSection, setActiveSection] = useState<string>('overview');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  // If user is not authenticated as the owner, render the Creator Login View
  if (!authUser || !isOwner) {
    const isClerkConfigured = isClerkKeyConfigured();

    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 animate-fadeIn">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white font-display">
              Creator Dashboard
            </h1>
            <p className="text-xs text-neutral-400">
              Administrative portal for <span className="text-amber-400 font-semibold">{profile.name}</span>
            </p>
          </div>

          {/* Account check banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] text-amber-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Clerk Authentication • Authorized Creator Only</span>
          </div>

          {authUser && !isOwner && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-xs text-amber-300 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Signed in as <strong className="text-white">{authUser.email || authUser.fullName}</strong></span>
              </div>
              <p className="text-[11px] text-neutral-400">
                This account does not have owner administrative permissions. Please sign in with the creator account.
              </p>
              <button
                type="button"
                onClick={logout}
                className="w-full py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold"
              >
                Sign Out & Switch Account
              </button>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-2xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {isClerkConfigured ? (
            <div className="space-y-4">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Clerk</span>
                </button>
              </SignInButton>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={loginWithGoogle}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Unlock Creator Dashboard</span>
              </button>
              
              <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-[11px] text-neutral-400 space-y-1">
                <div className="text-neutral-300 font-semibold flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Clerk App: {CLERK_APP_ID.slice(0, 14)}...</span>
                </div>
                <p>Provide <code className="text-amber-300 font-mono">VITE_CLERK_PUBLISHABLE_KEY</code> in environment variables to link your live Clerk production instance.</p>
              </div>
            </div>
          )}

          {/* Return to website */}
          <div className="pt-2 text-center border-t border-neutral-800">
            <button
              onClick={() => setCurrentTab('home')}
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

  // Navigation items for the Dashboard
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Bio', icon: User },
    { id: 'branding', label: 'Site Branding', icon: Sparkles },
    { id: 'homepage', label: 'Homepage Layout', icon: Layout },
    { id: 'music', label: 'Music & Songs', icon: Music },
    { id: 'lyrics', label: 'Lyrics Archive', icon: FileText },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
    { id: 'videos', label: 'Video Releases', icon: Video },
    { id: 'projects', label: 'Digital Projects', icon: Code },
    { id: 'books', label: 'Books & Literature', icon: BookOpen },
    { id: 'social', label: 'Social & Links', icon: Share2 },
    { id: 'messages', label: 'Inquiries Inbox', icon: Mail },
    { id: 'media', label: 'Media Library', icon: Layers },
    { id: 'appearance', label: 'Appearance & Theme', icon: Palette },
    { id: 'seo', label: 'SEO & Social Cards', icon: Search },
    { id: 'youtube', label: 'YouTube Channel', icon: Youtube },
    { id: 'navigation', label: 'Menu Navigation', icon: Menu },
    { id: 'analytics', label: 'Traffic Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings & Backup', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col md:flex-row animate-fadeIn">
      {/* Sidebar on Desktop / Header on Mobile */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shrink-0 shadow-sm z-30">
        <div className="p-4 sm:p-5 space-y-4">
          {/* Dashboard Header Moniker */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center shadow-md">
                ABM
              </div>
              <div>
                <h1 className="text-xs font-black tracking-tight text-neutral-900 dark:text-white">
                  Creator Hub CMS
                </h1>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                  v2.0 • Live Sync
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentTab('home')}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="View Public Website"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto max-h-[60vh] pb-2 md:pb-0 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Profile & Logout */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                {profile.name}
              </p>
              <p className="text-[10px] text-neutral-400 font-mono truncate">
                {authUser.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Stage */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeSection === 'overview' && <OverviewTab onNavigateTab={(tab) => setActiveSection(tab)} />}
          {activeSection === 'profile' && <ProfileTab />}
          {activeSection === 'branding' && <BrandingTab />}
          {activeSection === 'homepage' && <HomepageTab />}
          {activeSection === 'music' && <MusicTab />}
          {activeSection === 'lyrics' && <LyricsTab />}
          {activeSection === 'gallery' && <GalleryTab />}
          {activeSection === 'videos' && <VideosTab />}
          {activeSection === 'projects' && <ProjectsTab />}
          {activeSection === 'books' && <BooksTab />}
          {activeSection === 'social' && <SocialTab />}
          {activeSection === 'messages' && <MessagesTab />}
          {activeSection === 'media' && <MediaLibraryTab />}
          {activeSection === 'appearance' && <AppearanceTab />}
          {activeSection === 'seo' && <SEOTab />}
          {activeSection === 'youtube' && <YouTubeTab />}
          {activeSection === 'navigation' && <NavigationTab />}
          {activeSection === 'analytics' && <AnalyticsTab />}
          {activeSection === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
};
