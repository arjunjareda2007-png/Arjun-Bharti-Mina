import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { VideoItem } from '../../types';
import { Video, Play, ExternalLink, Calendar, Clock, Eye } from 'lucide-react';

export const VideosView: React.FC = () => {
  const { videos, openVideoPlayer, profile } = useStore();
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = ['All', 'Music Video', 'Shorts', 'BTS', 'Live Performance', 'Creative'];

  const filteredVideos = videos.filter(v => 
    selectedCat === 'All' || v.category === selectedCat
  );

  return (
    <div id="videos-view" className="space-y-10 max-w-7xl mx-auto">
      
      {/* YouTube Channel Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-red-600 flex-shrink-0">
            <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-display">{profile.name}</h2>
              <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-mono">
                Official YouTube
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Music Videos • Studio Sessions • Desi Cyphers • Civil Engineering Vlogs
            </p>
            <span className="text-xs font-mono text-amber-400 mt-1 block">
              {profile.stats.youtubeSubs} Subscribers
            </span>
          </div>
        </div>

        <a
          href="https://youtube.com/@arjunbhartimina?sub_confirmation=1"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg self-start md:self-center flex-shrink-0"
        >
          <Video className="w-4 h-4" />
          <span>Visit YouTube Channel</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCat === cat
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => openVideoPlayer(video)}
            className="group rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                {video.duration}
              </span>
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white">
                {video.category}
              </span>
            </div>

            {/* Video Metadata */}
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                  {video.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>{video.date}</span>
                {video.viewsCount && (
                  <span className="text-amber-500 font-semibold">{video.viewsCount} views</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
