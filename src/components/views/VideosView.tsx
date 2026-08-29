import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { VideoItem } from '../../types';
import { YouTubeVideoShowcase } from '../YouTubeVideoShowcase';
import { 
  Video, 
  Play, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Eye, 
  Share2, 
  Search, 
  Tv, 
  Sparkles,
  Youtube
} from 'lucide-react';
import { extractYouTubeId, getYouTubeThumbnail } from '../../utils/youtubeUtils';
import { hapticBeat, hapticLight } from '../../utils/haptics';

export const VideosView: React.FC = () => {
  const { videos, openVideoPlayer, profile, youtube, openShare } = useStore();
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeShowcaseVideoId, setActiveShowcaseVideoId] = useState<string | undefined>(undefined);

  const categories = ['All', 'Music Video', 'Shorts', 'BTS', 'Live Performance', 'Creative'];

  const filteredVideos = videos.filter(v => {
    const matchesCat = selectedCat === 'All' || v.category === selectedCat;
    const matchesSearch = searchTerm.trim() === '' || 
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const channelUrl = youtube?.channelUrl || 'https://youtube.com/@arjunbhartimina';
  const subCount = youtube?.subscribersCount || profile?.stats?.youtubeSubs || '12.8K+';

  const handlePlayOnSite = (video: VideoItem) => {
    hapticBeat();
    setActiveShowcaseVideoId(video.id);
    const element = document.getElementById('videos-page-showcase');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="videos-view" className="space-y-10 max-w-7xl mx-auto">
      
      {/* 1. Flagship Embedded YouTube Video Showcase */}
      <YouTubeVideoShowcase 
        id="videos-page-showcase"
        initialVideoId={activeShowcaseVideoId}
        title="Official Music Videos & Studio Cyphers"
        subtitle="Experience high-definition visuals, 808 breakdowns, and acoustic sessions directly on site"
        showPlaylist={true}
        autoPlayOnSelect={true}
      />

      {/* 2. YouTube Channel Banner & Stats */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-red-600 flex-shrink-0 bg-neutral-900 shadow-md">
            <img 
              src={youtube?.channelLogo || profile.profileImage} 
              alt={profile.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-display">{youtube?.channelName || profile.name}</h2>
              <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold">
                Official YouTube
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {youtube?.description || 'Music Videos • Studio Sessions • Desi Cyphers • Civil Engineering Vlogs'}
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-amber-400 mt-1.5 font-semibold">
              <span>{subCount} Subscribers</span>
              {youtube?.totalViews && <span>• {youtube.totalViews}</span>}
              {youtube?.totalVideos && <span>• {youtube.totalVideos}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center flex-shrink-0">
          <a
            href={`${channelUrl}?sub_confirmation=1`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Youtube className="w-4 h-4 fill-current" />
            <span>Visit YouTube Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 3. Filter Bar & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                hapticLight();
                setSelectedCat(cat);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === cat
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search visual releases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      {/* 4. Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <Video className="w-8 h-8 text-neutral-400 mx-auto" />
          <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">No videos found</h4>
          <p className="text-xs text-neutral-500">Try changing your search term or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const vidId = video.youtubeEmbedId || extractYouTubeId(video.youtubeUrl) || 'fJ9rUzIMcZQ';
            const thumb = video.thumbnail || getYouTubeThumbnail(vidId, 'maxres');

            return (
              <div
                key={video.id}
                className="group rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-500/50 shadow-sm hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Video Thumbnail */}
                <div 
                  className="relative aspect-video w-full bg-neutral-950 overflow-hidden cursor-pointer"
                  onClick={() => handlePlayOnSite(video)}
                >
                  <img 
                    src={thumb} 
                    alt={video.title} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getYouTubeThumbnail(vidId, 'hq');
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                    {video.duration}
                  </span>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white">
                    {video.category}
                  </span>
                  {video.featured && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-500 text-neutral-950 text-[9px] font-mono font-bold uppercase">
                      Featured
                    </span>
                  )}
                </div>

                {/* Video Metadata & Actions */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => handlePlayOnSite(video)}
                      className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-red-500 transition-colors line-clamp-2 cursor-pointer"
                    >
                      {video.title}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                      <span>{video.date}</span>
                      {video.viewsCount && (
                        <span className="text-amber-500 font-semibold">{video.viewsCount} views</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlayOnSite(video)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Embed on Site</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openVideoPlayer(video)}
                        className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                        title="Watch in Popup Modal"
                      >
                        <Tv className="w-4 h-4 text-blue-500" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openShare({
                            type: 'video',
                            title: `${video.title} — Arjun Bharti Mina`,
                            text: `${video.description} Category: ${video.category}.`,
                            url: video.youtubeUrl || `https://www.youtube.com/watch?v=${vidId}`,
                            imageUrl: thumb,
                            downloadFilename: `${video.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_thumb.jpg`
                          });
                        }}
                        className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                        title="Share Video"
                      >
                        <Share2 className="w-4 h-4 text-amber-500" />
                      </button>

                      <a
                        href={video.youtubeUrl || `https://www.youtube.com/watch?v=${vidId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                        title="Open in YouTube"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

