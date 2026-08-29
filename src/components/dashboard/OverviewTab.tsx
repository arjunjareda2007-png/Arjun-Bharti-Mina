import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Music, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Code, 
  BookOpen, 
  Mail, 
  Eye, 
  Play, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const OverviewTab: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { 
    songs, 
    lyrics, 
    gallery, 
    videos, 
    projects, 
    books, 
    messages, 
    analytics, 
    profile, 
    authUser 
  } = useStore();

  const publishedSongs = songs.filter(s => s.published !== false).length;
  const publishedGallery = gallery.filter(g => g.published !== false).length;
  const publishedVideos = videos.filter(v => v.published !== false).length;
  const publishedProjects = projects.filter(p => p.published !== false).length;
  const unreadMessages = messages.filter(m => !m.read).length;

  const totalPlays = Object.values(analytics.songPlays || {}).reduce((acc: number, curr: number) => acc + (Number(curr) || 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-transparent border border-amber-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Control Center • Real-Time Firebase Sync</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
              Welcome back, {profile.name.split(' ')[0]} 👋
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Manage your music discography, lyrics archive, digital projects, literature, gallery, and site branding without touching source code.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected: {authUser?.email || profile.email}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Key Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <Music className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{publishedSongs} live</span>
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-white">{songs.length}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Songs</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-semibold text-neutral-400">{lyrics.length} verses</span>
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-white">{lyrics.length}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Lyrics Records</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{publishedGallery} live</span>
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-white">{gallery.length}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Gallery Items</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <Video className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{publishedVideos} live</span>
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-white">{videos.length}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Video Releases</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <Code className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{publishedProjects} live</span>
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-white">{projects.length}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Digital Projects</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <Mail className="w-4 h-4 text-amber-500" />
            {unreadMessages > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-500 text-[10px] font-bold">
                {unreadMessages} new
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-neutral-400">All read</span>
            )}
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-white">{messages.length}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Inquiries</div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <button
            onClick={() => onNavigateTab('music')}
            className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Song</span>
          </button>

          <button
            onClick={() => onNavigateTab('lyrics')}
            className="p-3 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Add Lyrics</span>
          </button>

          <button
            onClick={() => onNavigateTab('gallery')}
            className="p-3 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <span>Add Photo</span>
          </button>

          <button
            onClick={() => onNavigateTab('videos')}
            className="p-3 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Video className="w-4 h-4 text-amber-500" />
            <span>Add Video</span>
          </button>

          <button
            onClick={() => onNavigateTab('projects')}
            className="p-3 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Code className="w-4 h-4 text-amber-500" />
            <span>Add Project</span>
          </button>

          <button
            onClick={() => onNavigateTab('books')}
            className="p-3 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Add Book</span>
          </button>

          <button
            onClick={() => onNavigateTab('branding')}
            className="p-3 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Site Branding</span>
          </button>
        </div>
      </div>

      {/* Two Column Section: Live Analytics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time Platform Analytics */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>Audience & Play Metrics</span>
            </h3>
            <button 
              onClick={() => onNavigateTab('analytics')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Detailed Logs →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Visits</div>
              <div className="text-lg font-bold text-neutral-900 dark:text-white mt-1">{analytics.pageViews}</div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Track Plays</div>
              <div className="text-lg font-bold text-neutral-900 dark:text-white mt-1">{totalPlays}</div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Monthly Est.</div>
              <div className="text-lg font-bold text-amber-500 mt-1">{profile.stats.monthlyListeners}</div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Top Streaming Anthems</h4>
            {songs.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <img src={s.cover} alt={s.title} className="w-7 h-7 rounded-lg object-cover" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-200 truncate">{s.title}</span>
                </div>
                <div className="text-neutral-500 dark:text-neutral-400 font-mono">
                  {analytics.songPlays[s.id] || s.playCount || 0} plays
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Platform Activity */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Recent Activity & Updates</span>
            </h3>
            <span className="text-xs text-neutral-400">Auto-synced</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Music className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-900 dark:text-neutral-200">Anthem Spotlight Updated</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">Latest release "{songs[0]?.title || 'RUTBA'}" highlighted on the homepage.</p>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">Recent</span>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Code className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-900 dark:text-neutral-200">Civil Engineering Tools Synced</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">{projects.length} digital apps and calculators live in the portfolio.</p>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">Live</span>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-900 dark:text-neutral-200">Dynamic Age Synchronizer</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">DOB {profile.dob} calculating exact age in real-time.</p>
              </div>
              <span className="text-[10px] text-emerald-500 font-mono">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
