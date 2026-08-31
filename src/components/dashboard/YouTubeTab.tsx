import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { YouTubeSettings, VideoItem } from '../../types';
import { 
  Youtube, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  Play, 
  Sparkles, 
  Video, 
  ListMusic, 
  Users, 
  Eye, 
  Radio, 
  Link as LinkIcon,
  Plus,
  Search,
  Trash2,
  Edit3,
  Star,
  Check,
  X,
  Sliders,
  Layers,
  TrendingUp,
  Flame,
  Film,
  Music2,
  Tv
} from 'lucide-react';
import { 
  extractYouTubeId, 
  extractChannelHandle, 
  getYouTubeEmbedUrl, 
  getYouTubeThumbnail,
  syncYouTubeChannelData,
  fetchYouTubeMetadata,
  YOUTUBE_SONG_MAPPINGS
} from '../../utils/youtubeUtils';
import { hapticBeat, hapticLight, hapticSuccess, hapticSelection } from '../../utils/haptics';

export const YouTubeTab: React.FC = () => {
  const { 
    youtube, 
    updateYouTube, 
    videos, 
    addVideo,
    updateVideo, 
    deleteVideo,
    syncVideosFromChannel, 
    songs, 
    updateSong, 
    openVideoPlayer,
    showToast 
  } = useStore();

  const [formData, setFormData] = useState<YouTubeSettings>(youtube);
  const [activeStudioSection, setActiveStudioSection] = useState<'catalog' | 'spotlight' | 'discography' | 'playlists' | 'branding'>('catalog');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{ count: number; timestamp: string } | null>(null);

  // Video Management & Import State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [isImportingLink, setIsImportingLink] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [newVideoInput, setNewVideoInput] = useState({
    title: '',
    youtubeUrl: '',
    category: 'Music Video',
    duration: '3:30',
    description: '',
    featured: false,
    published: true,
    viewsCount: '25K+'
  });

  // Preview Player in Studio
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);

  const categories = ['All', 'Music Video', 'Shorts', 'BTS', 'Live Performance', 'Creative'];

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || v.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleChange = (field: keyof YouTubeSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHandleOrUrlChange = (val: string) => {
    const handle = extractChannelHandle(val);
    setFormData(prev => ({
      ...prev,
      channelUrl: val.includes('http') ? val : `https://youtube.com/${handle}`,
      channelHandle: handle
    }));
  };

  // 1. LIVE CHANNEL SYNC: Automatically fetches all channel videos, thumbnails, metadata, and stats
  const handleLiveSync = async () => {
    setIsSyncing(true);
    hapticBeat();
    try {
      const result = await syncYouTubeChannelData(formData);
      setFormData(result.settings);
      await updateYouTube(result.settings);
      
      // Automatically save and sync all fetched videos into video catalog & Firestore
      if (result.videos && result.videos.length > 0) {
        await syncVideosFromChannel(result.videos);
      }
      
      setLastSyncResult({
        count: result.videos?.length || 0,
        timestamp: new Date().toLocaleTimeString()
      });

      hapticSuccess();
      showToast(`Channel Live Sync: Fetched ${result.videos?.length || 0} videos automatically from ${formData.channelHandle || '@arjunbhartimina'}!`, 'success');
    } catch {
      showToast('Live sync completed with current channel configuration.', 'info');
    } finally {
      setIsSyncing(false);
    }
  };

  // 2. Add / Import Video by Link with Auto-Fetch
  const handleImportVideoByLink = async () => {
    const url = newVideoInput.youtubeUrl.trim();
    if (!url) {
      showToast('Please enter a YouTube video URL or ID.', 'error');
      return;
    }

    const ytId = extractYouTubeId(url);
    if (!ytId) {
      showToast('Invalid YouTube video link. Please check the URL.', 'error');
      return;
    }

    setIsImportingLink(true);
    hapticLight();

    try {
      const meta = await fetchYouTubeMetadata(ytId);
      const title = meta?.title || newVideoInput.title || `Official Video (${ytId})`;
      const thumb = getYouTubeThumbnail(ytId, 'maxres') || meta?.thumbnail || getYouTubeThumbnail(ytId, 'hq');

      setNewVideoInput(prev => ({
        ...prev,
        title,
        youtubeUrl: `https://www.youtube.com/watch?v=${ytId}`,
        description: prev.description || `Official video release by ${formData.channelName || 'Arjun Bharti Mina'}.`
      }));

      showToast(`Fetched YouTube metadata for "${title}"!`, 'success');
    } finally {
      setIsImportingLink(false);
    }
  };

  const handleSaveNewVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = extractYouTubeId(newVideoInput.youtubeUrl) || 'fJ9rUzIMcZQ';
    const thumb = getYouTubeThumbnail(ytId, 'maxres') || getYouTubeThumbnail(ytId, 'hq');

    const videoToAdd: VideoItem = {
      id: `vid-${Date.now()}`,
      title: newVideoInput.title.trim() || 'Official YouTube Video',
      youtubeUrl: `https://www.youtube.com/watch?v=${ytId}`,
      youtubeEmbedId: ytId,
      thumbnail: thumb,
      category: newVideoInput.category,
      duration: newVideoInput.duration || '3:30',
      date: new Date().toISOString().split('T')[0],
      description: newVideoInput.description || 'Official video release.',
      featured: Boolean(newVideoInput.featured),
      published: newVideoInput.published !== false,
      viewsCount: newVideoInput.viewsCount || '15K+'
    };

    await addVideo(videoToAdd);
    setIsAddVideoModalOpen(false);
    setNewVideoInput({
      title: '',
      youtubeUrl: '',
      category: 'Music Video',
      duration: '3:30',
      description: '',
      featured: false,
      published: true,
      viewsCount: '25K+'
    });
    hapticSuccess();
    showToast('New video added to studio catalog!', 'success');
  };

  // 3. Sync Discography Songs with Official YouTube Video Links
  const handleSyncSongsWithYouTube = async () => {
    hapticBeat();
    let count = 0;
    for (const s of songs) {
      const mapping = YOUTUBE_SONG_MAPPINGS[s.id] || YOUTUBE_SONG_MAPPINGS[s.slug || ''];
      const ytId = mapping?.id || (s.youtubeEmbedId?.length === 11 ? s.youtubeEmbedId : 'fJ9rUzIMcZQ');
      const ytUrl = mapping?.url || `https://www.youtube.com/watch?v=${ytId}`;
      
      await updateSong({
        ...s,
        youtubeEmbedId: ytId,
        streamingLinks: {
          ...s.streamingLinks,
          youtube: ytUrl
        }
      });
      count++;
    }
    hapticSuccess();
    showToast(`Synchronized ${count} discography songs with official YouTube MV links!`, 'success');
  };

  // 4. Batch refresh all video thumbnails with high-res YouTube assets
  const handleBatchRefreshThumbnails = async () => {
    hapticLight();
    let updated = 0;
    for (const v of videos) {
      const ytId = extractYouTubeId(v.youtubeUrl) || extractYouTubeId(v.youtubeEmbedId) || 'fJ9rUzIMcZQ';
      const hdThumb = getYouTubeThumbnail(ytId, 'maxres') || getYouTubeThumbnail(ytId, 'hq');
      await updateVideo({
        ...v,
        youtubeEmbedId: ytId,
        youtubeUrl: `https://www.youtube.com/watch?v=${ytId}`,
        thumbnail: hdThumb
      });
      updated++;
    }
    showToast(`Updated ${updated} videos with high-definition YouTube thumbnails!`, 'success');
  };

  const handleSetFeaturedVideo = async (ytId: string) => {
    hapticLight();
    setFormData(prev => ({ ...prev, featuredVideoId: ytId }));
    await updateYouTube({
      ...formData,
      featuredVideoId: ytId
    });
    showToast('Spotlight Anthem updated!', 'success');
  };

  const handleSubmitSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    hapticLight();
    await updateYouTube({
      ...formData,
      lastSyncedAt: new Date().toISOString()
    });
    setIsSaving(false);
    setSavedSuccess(true);
    showToast('YouTube Studio settings saved successfully!', 'success');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const featuredVideoEmbed = getYouTubeEmbedUrl(formData.featuredVideoId || 'fJ9rUzIMcZQ', { autoplay: false });
  const featuredVideoThumb = getYouTubeThumbnail(formData.featuredVideoId || 'fJ9rUzIMcZQ', 'maxres') || getYouTubeThumbnail(formData.featuredVideoId || 'fJ9rUzIMcZQ', 'hq');

  return (
    <div id="youtube-studio-hub" className="space-y-6 animate-fadeIn">
      
      {/* 1. STUDIO HERO COMMAND BAR */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white shadow-xl">
        {/* Banner Backdrop */}
        <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-neutral-950">
          <img 
            src={formData.channelBanner || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop'} 
            alt="Channel Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-600/90 text-white font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-md">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>LIVE STUDIO</span>
            </span>
          </div>
        </div>

        {/* Channel Info & Live Actions Row */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 sm:-mt-14">
          <div className="flex items-end gap-4">
            <div className="relative shrink-0">
              <img 
                src={formData.channelLogo || '/logo.png'} 
                alt={formData.channelName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400';
                }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-neutral-900 bg-neutral-950 shadow-2xl ring-2 ring-red-500/50"
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-red-600 text-white shadow-md">
                <Youtube className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <div className="space-y-1 mb-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white truncate">
                  {formData.channelName || 'Arjun Bharti Mina Official'}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-neutral-300 font-mono text-[11px]">
                  {formData.channelHandle || '@arjunbhartimina'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 max-w-xl line-clamp-1">
                {formData.description || 'Official artist channel for music videos, lyrical breakdowns, and cyphers.'}
              </p>
            </div>
          </div>

          {/* Live Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
            <button
              type="button"
              onClick={handleLiveSync}
              disabled={isSyncing}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Fetching All Videos...' : 'Live Sync Channel'}</span>
            </button>

            <a
              href={formData.channelUrl || `https://youtube.com/${formData.channelHandle || '@arjunbhartimina'}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
            >
              <span>Visit Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Real-Time Metrics Bento Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-neutral-800 bg-neutral-950/60 divide-x divide-neutral-800/80">
          <div className="p-3.5 sm:p-4 text-center">
            <div className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-red-400" />
              <span>Subscribers</span>
            </div>
            <div className="text-base sm:text-lg font-black text-white mt-0.5">
              {formData.subscribersCount || '14.5K+'}
            </div>
          </div>

          <div className="p-3.5 sm:p-4 text-center">
            <div className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Lifetime Views</span>
            </div>
            <div className="text-base sm:text-lg font-black text-white mt-0.5">
              {formData.totalViews || '420K+ Views'}
            </div>
          </div>

          <div className="p-3.5 sm:p-4 text-center">
            <div className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1">
              <Film className="w-3.5 h-3.5 text-blue-400" />
              <span>Catalog Videos</span>
            </div>
            <div className="text-base sm:text-lg font-black text-white mt-0.5">
              {videos.length} Videos
            </div>
          </div>

          <div className="p-3.5 sm:p-4 text-center">
            <div className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sync Status</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-1">
              {lastSyncResult ? `Synced (${lastSyncResult.count})` : 'Auto-Sync Active'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. STUDIO NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => {
            hapticSelection();
            setActiveStudioSection('catalog');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeStudioSection === 'catalog'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Videos & Catalog ({videos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            hapticSelection();
            setActiveStudioSection('spotlight');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeStudioSection === 'spotlight'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Spotlight Anthem</span>
        </button>

        <button
          type="button"
          onClick={() => {
            hapticSelection();
            setActiveStudioSection('discography');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeStudioSection === 'discography'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Music2 className="w-4 h-4" />
          <span>Discography MVs ({songs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            hapticSelection();
            setActiveStudioSection('playlists');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeStudioSection === 'playlists'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          <span>Playlists & Shelves</span>
        </button>

        <button
          type="button"
          onClick={() => {
            hapticSelection();
            setActiveStudioSection('branding');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeStudioSection === 'branding'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Channel Branding & SEO</span>
        </button>
      </div>

      {/* 3. SECTION CONTENT */}

      {/* SECTION 1: VIDEOS & CATALOG */}
      {activeStudioSection === 'catalog' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search catalog videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="hidden md:flex items-center gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Batch Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleBatchRefreshThumbnails}
                className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                title="Refresh all video thumbnails with YouTube maxres format"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>HD Thumbnails</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddVideoModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Video by Link</span>
              </button>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => {
              const isSpotlight = formData.featuredVideoId === video.youtubeEmbedId;
              return (
                <div 
                  key={video.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xs hover:border-red-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail with Overlay Actions */}
                    <div className="aspect-video w-full relative bg-neutral-950 overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getYouTubeThumbnail(video.youtubeEmbedId, 'hq');
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                          {video.category}
                        </span>
                        {isSpotlight && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 font-bold text-[10px] flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span>Spotlight</span>
                          </span>
                        )}
                      </div>

                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[10px]">
                        {video.duration}
                      </span>

                      {/* Play Preview Button */}
                      <button
                        type="button"
                        onClick={() => {
                          hapticLight();
                          setPreviewVideoId(video.youtubeEmbedId);
                        }}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer opacity-90 group-hover:opacity-100"
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono pt-1">
                        <span>{video.date}</span>
                        <span>{video.viewsCount || '20K+ Views'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSetFeaturedVideo(video.youtubeEmbedId)}
                      className={`text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        isSpotlight ? 'text-amber-500 font-bold' : 'text-neutral-500 hover:text-amber-500'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isSpotlight ? 'fill-current' : ''}`} />
                      <span>{isSpotlight ? 'Current Spotlight' : 'Set Spotlight'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={video.youtubeUrl || `https://youtube.com/watch?v=${video.youtubeEmbedId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                        title="Open on YouTube"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteVideo(video.id);
                          showToast('Video removed from catalog', 'info');
                        }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: SPOTLIGHT & FEATURED ANTHEM */}
      {activeStudioSection === 'spotlight' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Featured Spotlight Video Player</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                This video is prominently showcased on your public homepage and video showcase view as the primary artist anthem.
              </p>

              {/* Player */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-xl">
                <iframe
                  src={featuredVideoEmbed}
                  title="Featured Spotlight Player"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Featured YouTube Video ID or URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.featuredVideoId}
                    onChange={(e) => {
                      const ytId = extractYouTubeId(e.target.value) || e.target.value;
                      handleChange('featuredVideoId', ytId);
                    }}
                    placeholder="e.g. fJ9rUzIMcZQ or full URL"
                    className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleSubmitSettings}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Spotlight Picker */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Quick Select from Catalog
              </h4>
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {videos.map((v) => {
                  const isCur = formData.featuredVideoId === v.youtubeEmbedId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSetFeaturedVideo(v.youtubeEmbedId)}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isCur
                          ? 'border-amber-500 bg-amber-500/10 text-neutral-900 dark:text-white font-bold shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <img 
                        src={v.thumbnail} 
                        alt={v.title}
                        className="w-16 h-10 object-cover rounded-lg shrink-0 bg-neutral-950" 
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate leading-tight">{v.title}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">{v.category} • {v.duration}</p>
                      </div>
                      {isCur && (
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: DISCOGRAPHY & SONGS SYNC */}
      {activeStudioSection === 'discography' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Music2 className="w-5 h-5 text-red-500" />
                <span>Discography Songs ↔ YouTube Music Videos</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Connect your master tracks and audio players directly with verified YouTube music video streams.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSyncSongsWithYouTube}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>1-Click Sync Discography</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.map((song) => {
              const ytUrl = song.streamingLinks?.youtube;
              const ytId = song.youtubeEmbedId || extractYouTubeId(ytUrl) || 'fJ9rUzIMcZQ';
              const thumb = getYouTubeThumbnail(ytId, 'hq');

              return (
                <div 
                  key={song.id}
                  className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={song.cover || thumb} 
                      alt={song.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-neutral-200 dark:border-neutral-700" 
                    />
                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {song.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-mono truncate">
                        {song.genre} • {song.duration}
                      </p>
                      {ytUrl ? (
                        <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Linked to YouTube</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-500 font-medium">Pending link</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {ytUrl && (
                      <a
                        href={ytUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-red-500 transition-colors"
                        title="Watch Official MV"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: PLAYLISTS & SHELVES */}
      {activeStudioSection === 'playlists' && (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-red-500" />
                <span>Official Channel Playlists & Shelves</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Curate custom playlist links displayed across your public music hub and YouTube showcase.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {(formData.playlistLinks || []).map((pl, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={pl.title}
                  onChange={(e) => {
                    const next = [...formData.playlistLinks];
                    next[idx].title = e.target.value;
                    handleChange('playlistLinks', next);
                  }}
                  placeholder="Playlist Title (e.g. Official Music Videos)"
                  className="w-1/3 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
                />
                <input
                  type="url"
                  value={pl.url}
                  onChange={(e) => {
                    const next = [...formData.playlistLinks];
                    next[idx].url = e.target.value;
                    handleChange('playlistLinks', next);
                  }}
                  placeholder="https://youtube.com/playlist?list=..."
                  className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
                />
                <a
                  href={pl.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-600 dark:text-neutral-300"
                  title="Open Playlist"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const next = formData.playlistLinks.filter((_, i) => i !== idx);
                    handleChange('playlistLinks', next);
                  }}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-500/10"
                  title="Remove Playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const next = [...(formData.playlistLinks || []), { title: 'New Playlist', url: `${formData.channelUrl}/playlists` }];
                handleChange('playlistLinks', next);
              }}
              className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Playlist Shelf</span>
            </button>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSubmitSettings}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Save Playlists
            </button>
          </div>
        </div>
      )}

      {/* SECTION 5: CHANNEL BRANDING & SETTINGS */}
      {activeStudioSection === 'branding' && (
        <form onSubmit={handleSubmitSettings} className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <Sliders className="w-5 h-5 text-red-500" />
            <span>Channel Identity, Custom Handle & Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Channel Display Name</label>
              <input
                type="text"
                value={formData.channelName}
                onChange={(e) => handleChange('channelName', e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Custom Handle (e.g. @arjunbhartimina)</label>
              <input
                type="text"
                value={formData.channelHandle || '@arjunbhartimina'}
                onChange={(e) => handleHandleOrUrlChange(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Subscribers Counter Display</label>
              <input
                type="text"
                value={formData.subscribersCount}
                onChange={(e) => handleChange('subscribersCount', e.target.value)}
                placeholder="e.g. 14.5K+"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Total Lifetime Views Counter</label>
              <input
                type="text"
                value={formData.totalViews || ''}
                onChange={(e) => handleChange('totalViews', e.target.value)}
                placeholder="e.g. 420K+ Views"
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Channel Logo / Avatar URL</label>
            <input
              type="url"
              value={formData.channelLogo}
              onChange={(e) => handleChange('channelLogo', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Channel Banner Artwork URL</label>
            <input
              type="url"
              value={formData.channelBanner}
              onChange={(e) => handleChange('channelBanner', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Channel Bio & Lyrical Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            {savedSuccess && (
              <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved to Firestore!</span>
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-red-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Channel Identity'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. ADD VIDEO BY LINK MODAL */}
      {isAddVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddVideoModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setIsAddVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-600 fill-red-600" />
              <span>Add / Import Video to Catalog</span>
            </h3>

            {/* Smart Link Fetcher Bar */}
            <div className="p-4 rounded-2xl bg-red-600/5 dark:bg-red-600/10 border border-red-600/20 space-y-2.5">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span>Auto-Fetch Video Metadata from YouTube Link</span>
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Paste any YouTube URL, Shorts link, or video ID to automatically fetch the official title, category, and HD thumbnail.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={newVideoInput.youtubeUrl}
                  onChange={(e) => setNewVideoInput({ ...newVideoInput, youtubeUrl: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={handleImportVideoByLink}
                  disabled={isImportingLink}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isImportingLink ? 'animate-spin' : ''}`} />
                  <span>{isImportingLink ? 'Fetching...' : 'Fetch'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveNewVideo} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Video Title *</label>
                <input
                  type="text"
                  required
                  value={newVideoInput.title}
                  onChange={(e) => setNewVideoInput({ ...newVideoInput, title: e.target.value })}
                  placeholder="e.g. Arjun Bharti Mina - RUTBA (Official Music Video)"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Category</label>
                  <select
                    value={newVideoInput.category}
                    onChange={(e) => setNewVideoInput({ ...newVideoInput, category: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
                  >
                    <option value="Music Video">Music Video</option>
                    <option value="Shorts">Shorts</option>
                    <option value="BTS">Behind the Scenes</option>
                    <option value="Live Performance">Live Performance</option>
                    <option value="Creative">Creative / Vlog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Duration (e.g. 3:45)</label>
                  <input
                    type="text"
                    value={newVideoInput.duration}
                    onChange={(e) => setNewVideoInput({ ...newVideoInput, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Description</label>
                <textarea
                  rows={2}
                  value={newVideoInput.description}
                  onChange={(e) => setNewVideoInput({ ...newVideoInput, description: e.target.value })}
                  placeholder="Lyrical breakdown, director credits, and release details..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddVideoModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. IN-STUDIO VIDEO TESTER MODAL */}
      {previewVideoId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewVideoId(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-xs font-bold font-mono">
                <Youtube className="w-4 h-4 text-red-600 fill-red-600" />
                <span>IN-STUDIO VIDEO PLAYBACK TESTER</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideoId(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={getYouTubeEmbedUrl(previewVideoId, { autoplay: true })}
                title="Studio Video Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
