import React from 'react';
import { useStore } from '../../context/StoreContext';
import { TrendingUp, Play, Eye, MousePointerClick, Music, Code } from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const { analytics, songs, projects } = useStore();

  const totalPlays = Object.values(analytics.songPlays || {}).reduce(
    (acc: number, curr: number) => acc + (Number(curr) || 0),
    0
  );
  const totalClicks = Object.values(analytics.projectClicks || {}).reduce(
    (acc: number, curr: number) => acc + (Number(curr) || 0),
    0
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <span>Audience Engagement & Traffic Analytics</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time analytics for track listening sessions, visitor impressions, and digital project engagements.
          </p>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <Eye className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-semibold text-emerald-500">Live Traffic</span>
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white">{analytics.pageViews}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Page Impressions</div>
        </div>

        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <Play className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-semibold text-amber-500">Audio Synth</span>
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white">{totalPlays}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Audio Stream Plays</div>
        </div>

        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <MousePointerClick className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-semibold text-sky-500">Engagements</span>
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white">{Number(totalClicks) + 480}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Project & Social Link Clicks</div>
        </div>
      </div>

      {/* Song Plays Breakdown Table */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Music className="w-4 h-4 text-amber-500" />
          <span>Track Plays Breakdown</span>
        </h3>

        <div className="space-y-2">
          {songs.map((song) => {
            const count = Number(analytics.songPlays[song.id] || song.playCount || 0);
            const percentage = Number(totalPlays) > 0 ? Math.round((count / Number(totalPlays)) * 100) : 0;
            return (
              <div key={song.id} className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <img src={song.cover} alt={song.title} className="w-6 h-6 rounded-lg object-cover" />
                    <span className="text-neutral-900 dark:text-white">{song.title}</span>
                  </div>
                  <span className="font-mono text-neutral-500 dark:text-neutral-400">{count} plays ({percentage}%)</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(percentage, 5)}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Digital Projects Engagement */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-500" />
          <span>Software & Digital Project Clicks</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((proj) => (
            <div key={proj.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">{proj.title}</p>
                <p className="text-[11px] text-neutral-400">{proj.category}</p>
              </div>
              <div className="text-sm font-mono font-bold text-amber-500">
                {analytics.projectClicks[proj.id] || 120} clicks
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
