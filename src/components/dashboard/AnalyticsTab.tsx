import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  TrendingUp, 
  Play, 
  Eye, 
  MousePointerClick, 
  Music, 
  Code, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Search, 
  Clock, 
  RotateCcw, 
  Download, 
  Users,
  Compass,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const { analytics, songs, projects, resetAnalytics, showToast } = useStore();
  const [activeRange, setActiveRange] = useState<'all' | '7d' | 'today'>('all');

  const totalPlays = (Object.values(analytics.songPlays || {}) as number[]).reduce(
    (acc, curr) => acc + (Number(curr) || 0),
    0
  );

  const totalClicks = (Object.values(analytics.projectClicks || {}) as number[]).reduce(
    (acc, curr) => acc + (Number(curr) || 0),
    0
  );

  const totalTabViews = (Object.values(analytics.tabViews || {}) as number[]).reduce(
    (acc, curr) => acc + (Number(curr) || 0),
    0
  );

  const totalDevices = (analytics.devices?.mobile || 0) + (analytics.devices?.desktop || 0) + (analytics.devices?.tablet || 0) || 1;
  const mobilePct = Math.round(((analytics.devices?.mobile || 0) / totalDevices) * 100);
  const desktopPct = Math.round(((analytics.devices?.desktop || 0) / totalDevices) * 100);
  const tabletPct = Math.max(0, 100 - mobilePct - desktopPct);

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analytics, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `abm_analytics_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Analytics dataset exported successfully');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <span>Audience Engagement & Live Traffic Analytics</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            100% accurate real-time telemetry of visitor sessions, track playback counts, and interaction events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportData}
            className="px-3.5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all analytics data? This cannot be undone.')) {
                resetAnalytics();
              }
            }}
            className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl border border-red-500/20 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Logs</span>
          </button>
        </div>
      </div>

      {/* Top 4 Real Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <Eye className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">Live</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {analytics.pageViews.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Page Impressions</div>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <Users className="w-5 h-5 text-sky-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-md">Unique</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {analytics.uniqueVisitors.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Unique Visitor Sessions</div>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <Play className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">Synth Stream</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {totalPlays.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Audio Stream Plays</div>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <MousePointerClick className="w-5 h-5 text-purple-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-md">Interactions</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {totalClicks.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Project Demo Visits</div>
        </div>
      </div>

      {/* Two Columns: Section Traffic & Device Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section Impressions */}
        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Traffic by Section / View Tab</span>
          </h3>

          <div className="space-y-3">
            {[
              { key: 'home', label: 'Home Page' },
              { key: 'music', label: 'Music Vault' },
              { key: 'lyrics', label: 'Lyrics Archive' },
              { key: 'projects', label: 'Engineering & Tech Apps' },
              { key: 'gallery', label: 'Photo Gallery' },
              { key: 'videos', label: 'Video Showcase' },
              { key: 'books', label: 'Books & Literature' },
              { key: 'about', label: 'About & Bio' },
              { key: 'contact', label: 'Contact & Booking' },
            ].map(({ key, label }) => {
              const views = analytics.tabViews?.[key] || 0;
              const pct = totalTabViews > 0 ? Math.round((views / totalTabViews) * 100) : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{label}</span>
                    <span className="font-mono text-neutral-500 dark:text-neutral-400 text-[11px]">{views} views ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, views > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device & Browser Demographics */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-500" />
              <span>Visitor Device Split</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center space-y-1">
                <Smartphone className="w-5 h-5 mx-auto text-amber-500" />
                <p className="text-base font-bold font-mono text-neutral-900 dark:text-white">{mobilePct}%</p>
                <p className="text-[11px] text-neutral-400">Mobile ({analytics.devices?.mobile || 0})</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center space-y-1">
                <Laptop className="w-5 h-5 mx-auto text-sky-500" />
                <p className="text-base font-bold font-mono text-neutral-900 dark:text-white">{desktopPct}%</p>
                <p className="text-[11px] text-neutral-400">Desktop ({analytics.devices?.desktop || 0})</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center space-y-1">
                <Tablet className="w-5 h-5 mx-auto text-purple-500" />
                <p className="text-base font-bold font-mono text-neutral-900 dark:text-white">{tabletPct}%</p>
                <p className="text-[11px] text-neutral-400">Tablet ({analytics.devices?.tablet || 0})</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Browser Distribution</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {Object.entries(analytics.browsers || { Chrome: 1 }).map(([browser, count]) => (
                <div key={browser} className="px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 flex items-center gap-2 text-xs">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{browser}:</span>
                  <span className="font-mono font-bold text-amber-500">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Song Stream Leaderboard */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Music className="w-4 h-4 text-amber-500" />
          <span>Real Track Streams Leaderboard</span>
        </h3>

        <div className="space-y-2.5">
          {songs.map((song) => {
            const count = Number(analytics.songPlays?.[song.id] || 0);
            const percentage = totalPlays > 0 ? Math.round((count / totalPlays) * 100) : 0;
            return (
              <div key={song.id} className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2.5">
                    <img src={song.cover} alt={song.title} className="w-7 h-7 rounded-lg object-cover shadow" />
                    <div>
                      <span className="text-neutral-900 dark:text-white font-bold">{song.title}</span>
                      <span className="text-[11px] text-neutral-400 ml-2">({song.genre})</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-amber-500">{count} plays ({percentage}%)</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Digital Project Clicks */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-500" />
          <span>Software & Engineering Project Visits</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {projects.map((proj) => (
            <div key={proj.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">{proj.title}</p>
                <p className="text-[11px] text-neutral-400">{proj.category}</p>
              </div>
              <div className="text-sm font-mono font-bold text-amber-500">
                {analytics.projectClicks?.[proj.id] || 0} visits
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Searches & User Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Search Queries */}
        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <Search className="w-4 h-4 text-sky-500" />
            <span>Recent Search Inquiries</span>
          </h3>

          {(!analytics.searches || analytics.searches.length === 0) ? (
            <p className="text-xs text-neutral-400 italic py-3">No search queries logged yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {analytics.searches.slice(0, 8).map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-900 dark:text-white">"{s.query}"</span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Interaction Events */}
        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500" />
            <span>Interactive Engagement Log</span>
          </h3>

          {(!analytics.interactionEvents || analytics.interactionEvents.length === 0) ? (
            <p className="text-xs text-neutral-400 italic py-3">No recent interaction events logged yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {analytics.interactionEvents.slice(0, 8).map((evt, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                      {evt.type}
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-white">{evt.label}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
