import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
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
            <h1 className="text-2xl font-black tracking-tight text-white">
              Creator Dashboard
            </h1>
            <p className="text-xs text-neutral-400">
              Personal control panel for <span className="text-amber-400 font-semibold">{profile.name}</span>
            </p>
          </div>

          {/* Account check banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] text-amber-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Official Portal Verification • Authorized Creator Only</span>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-2xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {isResetMode ? (
            // Password reset view
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await resetPassword(loginEmail);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Creator Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="creator@arjunbhartimina.com"
                  className="w-full px-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="w-full text-center text-xs text-neutral-400 hover:text-white"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            // Standard login view
            <div className="space-y-4">
              {/* Google Button */}
              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-100 font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-[0.98] disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                  <span className="bg-neutral-900 px-3 text-neutral-500 font-mono">or email password</span>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await loginWithEmail(loginEmail, loginPassword);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="creator@arjunbhartimina.com"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-neutral-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsResetMode(true)}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Creator Dashboard</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Return to website */}
          <div className="pt-2 text-center border-t border-neutral-800">
            <button
              onClick={() => setCurrentTab('home')}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
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
