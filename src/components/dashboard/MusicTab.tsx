import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Song, SongRelatedVideo } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { 
  Music, 
  Plus, 
  Search, 
  Star, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Play, 
  Pause,
  Sparkles,
  Save,
  X,
  CheckSquare,
  Square,
  Video,
  FileAudio,
  Volume2,
  VolumeX,
  Link2,
  Check,
  Copy,
  Film,
  ExternalLink,
  UploadCloud,
  FileText,
  Clock,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { 
  extractYouTubeId, 
  getYouTubeThumbnail 
} from '../../utils/youtubeUtils';
import { hapticLight, hapticMedium, hapticSuccess, hapticBeat } from '../../utils/haptics';

const EMPTY_SONG: Song = {
  id: '',
  title: '',
  slug: '',
  artist: 'Arjun Bharti Mina',
  genre: 'Desi Hip-Hop',
  language: 'Hindi',
  releaseDate: new Date().toISOString().split('T')[0],
  year: 2026,
  duration: '3:15',
  cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800',
  description: '',
  lyrics: '',
  featured: false,
  published: true,
  playCount: 0,
  audioUrl: '',
  audioFileName: '',
  audioFileSize: '',
  audioHostType: 'hosted_link',
  audioToneSequence: [261.63, 329.63, 392.00, 523.25, 493.88, 440.00, 392.00, 329.63],
  relatedVideos: [],
  streamingLinks: {
    spotify: 'https://open.spotify.com',
    youtube: 'https://youtube.com',
    jiosaavn: 'https://jiosaavn.com',
    gaana: 'https://gaana.com',
    appleMusic: 'https://music.apple.com'
  },
  credits: {
    artist: 'Arjun Bharti Mina',
    lyrics: 'Arjun Bharti Mina',
    music: 'Arjun Bharti Mina',
    production: "ABM Studio's"
  }
};

const GENRE_SUGGESTIONS = [
  'Desi Hip-Hop',
  'Drill',
  'Melodic Rap / Lo-Fi',
  'Pop Rap',
  'Acoustic / Session',
  'Trap',
  'Folk Fusion',
  'Cypher Freestyle'
];

const VIDEO_TYPES = [
  'Official Music Video',
  'Lyrical Video',
  'Behind The Scenes',
  'Live Performance',
  'Acoustic / Session',
  'Teaser / Promo'
];

export const MusicTab: React.FC = () => {
  const { 
    songs, 
    addSong, 
    updateSong, 
    deleteSong, 
    toggleFeaturedSong, 
    toggleSongPublish,
    playSong,
    bulkDeleteItems,
    bulkTogglePublish,
    bulkToggleFeatured,
    showToast
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'published' | 'draft' | 'featured' | 'with_audio' | 'with_videos'>('all');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'essentials' | 'audio' | 'videos' | 'lyrics_credits' | 'streaming'>('essentials');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Song | null>(null);
  
  // Audio link tester inside modal
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [audioTestStatus, setAudioTestStatus] = useState<'idle' | 'loading' | 'verified' | 'failed'>('idle');
  const [audioTestError, setAudioTestError] = useState('');
  const testAudioRef = useRef<HTMLAudioElement | null>(null);

  // Table row test audio player
  const [tablePlayingId, setTablePlayingId] = useState<string | null>(null);
  const tableAudioRef = useRef<HTMLAudioElement | null>(null);

  // Related video form states (inside song edit modal)
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoType, setNewVideoType] = useState('Official Music Video');
  const [newVideoDuration, setNewVideoDuration] = useState('3:30');
  const [videoPreviewEmbedId, setVideoPreviewEmbedId] = useState<string | null>(null);

  // Clean up audio preview players on unmount
  useEffect(() => {
    return () => {
      if (testAudioRef.current) {
        testAudioRef.current.pause();
        testAudioRef.current = null;
      }
      if (tableAudioRef.current) {
        tableAudioRef.current.pause();
        tableAudioRef.current = null;
      }
    };
  }, []);

  // Filtered songs
  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || 
        song.title.toLowerCase().includes(q) || 
        song.artist.toLowerCase().includes(q) ||
        song.genre.toLowerCase().includes(q) ||
        (song.relatedVideos && song.relatedVideos.some(v => v.title.toLowerCase().includes(q)));

      if (!matchesSearch) return false;

      if (filterMode === 'published') return song.published !== false;
      if (filterMode === 'draft') return song.published === false;
      if (filterMode === 'featured') return Boolean(song.featured);
      if (filterMode === 'with_audio') return Boolean(song.audioUrl && song.audioUrl.trim().length > 0);
      if (filterMode === 'with_videos') return Boolean(song.relatedVideos && song.relatedVideos.length > 0);
      return true;
    });
  }, [songs, searchTerm, filterMode]);

  // Open modal for new song
  const handleAddNewSong = () => {
    hapticMedium();
    const newId = `song-${Date.now()}`;
    setEditingSong({
      ...EMPTY_SONG,
      id: newId,
      slug: `new-track-${Date.now().toString().slice(-4)}`,
      releaseDate: new Date().toISOString().split('T')[0],
      relatedVideos: []
    });
    setModalTab('essentials');
    setAudioTestStatus('idle');
    setNewVideoTitle('');
    setNewVideoUrl('');
    setVideoPreviewEmbedId(null);
    setIsModalOpen(true);
  };

  // Open modal for editing song
  const handleEditSong = (song: Song) => {
    hapticLight();
    setEditingSong({
      ...song,
      relatedVideos: song.relatedVideos ? [...song.relatedVideos] : []
    });
    setModalTab('essentials');
    setAudioTestStatus('idle');
    setNewVideoTitle('');
    setNewVideoUrl('');
    setVideoPreviewEmbedId(null);
    setIsModalOpen(true);
  };

  // Save song handler
  const handleSaveSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong || !editingSong.title.trim()) {
      showToast('Track title is required', 'error');
      return;
    }

    // Stop test audio if playing
    if (testAudioRef.current) {
      testAudioRef.current.pause();
    }

    hapticSuccess();
    const exists = songs.some(s => s.id === editingSong.id);
    if (exists) {
      await updateSong(editingSong);
    } else {
      await addSong(editingSong);
    }

    setIsModalOpen(false);
    setEditingSong(null);
  };

  // Audio link verification tester inside modal
  const handleTestAudioLink = () => {
    if (!editingSong?.audioUrl || !editingSong.audioUrl.trim()) {
      showToast('Please enter an audio URL first', 'error');
      return;
    }

    hapticLight();
    const url = editingSong.audioUrl.trim();

    if (isTestingAudio) {
      if (testAudioRef.current) {
        testAudioRef.current.pause();
      }
      setIsTestingAudio(false);
      return;
    }

    setAudioTestStatus('loading');
    setAudioTestError('');

    try {
      if (!testAudioRef.current) {
        testAudioRef.current = new Audio();
      }
      const audio = testAudioRef.current;
      audio.src = url;

      audio.oncanplay = () => {
        setAudioTestStatus('verified');
        // Extract real duration if possible
        if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
          const totalSecs = Math.round(audio.duration);
          const mins = Math.floor(totalSecs / 60);
          const secs = totalSecs % 60;
          const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
          setEditingSong(prev => prev ? { ...prev, duration: formatted } : null);
        }
      };

      audio.onerror = () => {
        setAudioTestStatus('failed');
        setAudioTestError('Could not load audio. Check that the link is accessible and allows direct streaming.');
        setIsTestingAudio(false);
      };

      audio.play().then(() => {
        setIsTestingAudio(true);
      }).catch((err) => {
        setAudioTestStatus('failed');
        setAudioTestError(err.message || 'Playback blocked or URL unreachable');
        setIsTestingAudio(false);
      });
    } catch (err: any) {
      setAudioTestStatus('failed');
      setAudioTestError(err.message || 'Invalid audio URL format');
    }
  };

  // Table row quick audio tester
  const handleToggleTableAudio = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    hapticLight();

    if (tablePlayingId === song.id) {
      if (tableAudioRef.current) tableAudioRef.current.pause();
      setTablePlayingId(null);
      return;
    }

    if (!song.audioUrl) {
      // Play through main player if synth
      playSong(song);
      return;
    }

    try {
      if (!tableAudioRef.current) {
        tableAudioRef.current = new Audio();
      }
      tableAudioRef.current.src = song.audioUrl;
      tableAudioRef.current.onended = () => setTablePlayingId(null);
      tableAudioRef.current.onerror = () => {
        setTablePlayingId(null);
        showToast('Could not play audio link directly', 'error');
      };
      tableAudioRef.current.play();
      setTablePlayingId(song.id);
    } catch {
      setTablePlayingId(null);
    }
  };

  // Add related video to song
  const handleAddRelatedVideo = () => {
    if (!newVideoTitle.trim() || !newVideoUrl.trim() || !editingSong) {
      showToast('Please provide both video title and URL', 'error');
      return;
    }

    const embedId = extractYouTubeId(newVideoUrl) || 'fJ9rUzIMcZQ';
    const thumb = getYouTubeThumbnail(embedId);

    const videoObj: SongRelatedVideo = {
      id: `vid-${Date.now()}`,
      title: newVideoTitle.trim(),
      youtubeUrl: newVideoUrl.trim(),
      youtubeEmbedId: embedId,
      type: newVideoType,
      thumbnail: thumb,
      duration: newVideoDuration.trim() || '3:30'
    };

    setEditingSong(prev => prev ? {
      ...prev,
      relatedVideos: [...(prev.relatedVideos || []), videoObj]
    } : null);

    setNewVideoTitle('');
    setNewVideoUrl('');
    setVideoPreviewEmbedId(null);
    hapticSuccess();
    showToast(`Added related video "${videoObj.title}"`, 'success');
  };

  // Remove related video from song
  const handleRemoveRelatedVideo = (vidId: string) => {
    hapticLight();
    setEditingSong(prev => prev ? {
      ...prev,
      relatedVideos: (prev.relatedVideos || []).filter(v => v.id !== vidId)
    } : null);
    showToast('Video removed from track', 'info');
  };

  // Handle local file upload
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingSong) return;

    if (file.size > 50 * 1024 * 1024) {
      showToast('Audio file size exceeds 50MB limit', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      setEditingSong(prev => prev ? {
        ...prev,
        audioUrl: dataUrl,
        audioFileName: file.name,
        audioFileSize: sizeStr,
        audioHostType: 'uploaded_file'
      } : null);

      showToast(`Audio file "${file.name}" attached successfully!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} selected track(s)?`)) {
      await bulkDeleteItems('songs', selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkPublish = async (status: boolean) => {
    if (selectedIds.length === 0) return;
    await bulkTogglePublish('songs', selectedIds, status);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Overview Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-5 sm:p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-bold uppercase border border-amber-500/20">
              Discography Hub
            </span>
            <span className="text-xs font-mono text-neutral-400">Audio Vault &amp; Video Links</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
            Songs &amp; Audio Vault Manager
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage hosted audio links, streaming metadata, and link multiple related videos (Music Videos, Lyricals, BTS) to each track.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNewSong}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Song</span>
        </button>
      </div>

      {/* 2. Quick Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">Total Songs</span>
          <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">{songs.length} Tracks</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono uppercase text-emerald-500 block">Hosted Audio Links</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-500">
            {songs.filter(s => Boolean(s.audioUrl && s.audioUrl.trim())).length} Active
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono uppercase text-red-500 block">Linked Videos</span>
          <span className="text-xl sm:text-2xl font-black text-red-500">
            {songs.reduce((acc, s) => acc + (s.relatedVideos?.length || 0), 0)} Videos
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono uppercase text-amber-500 block">Featured Anthems</span>
          <span className="text-xl sm:text-2xl font-black text-amber-500">
            {songs.filter(s => s.featured).length} Featured
          </span>
        </div>
      </div>

      {/* 3. Toolbar: Search, Filter Tabs & Bulk Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 sm:p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text"
            placeholder="Search songs or linked videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-amber-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['all', 'published', 'draft', 'featured', 'with_audio', 'with_videos'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer shrink-0 ${
                filterMode === mode
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-white'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-mono text-neutral-400 font-bold">{selectedIds.length} Selected:</span>
            <button
              type="button"
              onClick={() => handleBulkPublish(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs font-semibold cursor-pointer"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => handleBulkPublish(false)}
              className="px-2.5 py-1 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Draft
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-semibold cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* 4. Songs Table */}
      <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/50 text-neutral-400 uppercase font-mono text-[10px] tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredSongs.length && filteredSongs.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(filteredSongs.map(s => s.id));
                      else setSelectedIds([]);
                    }}
                    className="rounded accent-amber-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4">Genre &amp; Year</th>
                <th className="py-3 px-4">Hosted Audio Status</th>
                <th className="py-3 px-4">Related Videos</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredSongs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    No songs found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSongs.map((song) => {
                  const isSelected = selectedIds.includes(song.id);
                  const isTablePlaying = tablePlayingId === song.id;
                  const hasVideos = song.relatedVideos && song.relatedVideos.length > 0;

                  return (
                    <tr 
                      key={song.id}
                      className={`hover:bg-neutral-50 dark:hover:bg-neutral-850/50 transition-colors ${
                        isSelected ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds(prev => [...prev, song.id]);
                            else setSelectedIds(prev => prev.filter(id => id !== song.id));
                          }}
                          className="rounded accent-amber-500 cursor-pointer"
                        />
                      </td>

                      {/* Track Info & Artwork */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-200 dark:border-neutral-800">
                            <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={(e) => handleToggleTableAudio(song, e)}
                              className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
                              title="Preview Track Audio"
                            >
                              {isTablePlaying ? (
                                <Pause className="w-4 h-4 text-amber-400 fill-current" />
                              ) : (
                                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                              )}
                            </button>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-neutral-900 dark:text-white truncate max-w-[180px]">
                              {song.title}
                            </h4>
                            <p className="text-[11px] text-neutral-400 truncate">
                              {song.artist} • <span className="font-mono">{song.duration}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Genre & Year */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-neutral-800 dark:text-neutral-200 block truncate max-w-[120px]">
                          {song.genre}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          {song.year} ({song.releaseDate})
                        </span>
                      </td>

                      {/* Hosted Audio Link Status & Quick Test */}
                      <td className="py-3 px-4">
                        {song.audioUrl ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-semibold">
                              <Link2 className="w-3 h-3" />
                              <span className="truncate max-w-[140px]">{song.audioFileName || 'Hosted Audio Link'}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => handleToggleTableAudio(song, e)}
                                className="text-[10px] font-mono text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                {isTablePlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                                <span>{isTablePlaying ? 'Stop' : 'Test Link'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(song.audioUrl!);
                                  showToast('Audio URL copied to clipboard', 'success');
                                }}
                                className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                              >
                                <Copy className="w-2.5 h-2.5" /> Copy
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono text-neutral-400 italic">
                            No hosted link (Synth)
                          </span>
                        )}
                      </td>

                      {/* Related Videos Column */}
                      <td className="py-3 px-4">
                        {hasVideos ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 font-mono text-[11px] font-bold">
                              <Film className="w-3 h-3" />
                              <span>{song.relatedVideos!.length} Videos</span>
                            </span>
                            <div className="text-[10px] text-neutral-400 truncate max-w-[130px]" title={song.relatedVideos![0].title}>
                              {song.relatedVideos![0].title}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono text-neutral-400">
                            0 Videos
                          </span>
                        )}
                      </td>

                      {/* Featured */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFeaturedSong(song.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            song.featured 
                              ? 'text-amber-500 hover:text-amber-400' 
                              : 'text-neutral-400 hover:text-neutral-300'
                          }`}
                          title={song.featured ? "Unfeature Song" : "Feature Song"}
                        >
                          <Star className={`w-4 h-4 ${song.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      {/* Published Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSongPublish(song.id)}
                          className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold cursor-pointer transition-colors ${
                            song.published !== false
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                          }`}
                        >
                          {song.published !== false ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditSong(song)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Edit Track, Audio &amp; Videos"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(song)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Delete Track"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. ADD / EDIT SONG MODAL (WELL-ARRANGED INTO 5 CLEAR TABS) */}
      {isModalOpen && editingSong && (
        <div 
          className="fixed inset-0 z-[6000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
          onClick={() => {
            if (testAudioRef.current) testAudioRef.current.pause();
            setIsModalOpen(false);
          }}
        >
          <div 
            className="w-full max-w-4xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {songs.some(s => s.id === editingSong.id) ? `Edit: ${editingSong.title}` : 'Add New Song'}
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Host audio via link, attach videos &amp; manage metadata
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (testAudioRef.current) testAudioRef.current.pause();
                  setIsModalOpen(false);
                }}
                className="p-2 rounded-full text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Selector */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setModalTab('essentials')}
                className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer shrink-0 ${
                  modalTab === 'essentials'
                    ? 'bg-white dark:bg-neutral-900 text-amber-500 border-t border-x border-neutral-200 dark:border-neutral-800'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                1. Essentials
              </button>

              <button
                type="button"
                onClick={() => setModalTab('audio')}
                className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  modalTab === 'audio'
                    ? 'bg-white dark:bg-neutral-900 text-emerald-500 border-t border-x border-neutral-200 dark:border-neutral-800'
                    : 'text-neutral-500 hover:text-emerald-400'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>2. Hosted Audio Link</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('videos')}
                className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  modalTab === 'videos'
                    ? 'bg-white dark:bg-neutral-900 text-red-500 border-t border-x border-neutral-200 dark:border-neutral-800'
                    : 'text-neutral-500 hover:text-red-400'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>3. Related Videos ({editingSong.relatedVideos?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('lyrics_credits')}
                className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  modalTab === 'lyrics_credits'
                    ? 'bg-white dark:bg-neutral-900 text-amber-500 border-t border-x border-neutral-200 dark:border-neutral-800'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>4. Lyrics &amp; Credits</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('streaming')}
                className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer shrink-0 ${
                  modalTab === 'streaming'
                    ? 'bg-white dark:bg-neutral-900 text-amber-500 border-t border-x border-neutral-200 dark:border-neutral-800'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                5. Links &amp; Visibility
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveSong} className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* TAB 1: ESSENTIALS */}
              {modalTab === 'essentials' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Track Title *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={editingSong.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingSong(prev => prev ? {
                            ...prev, 
                            title: val,
                            slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                          } : null);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                        placeholder="e.g. RUTBA"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        URL Slug
                      </label>
                      <input 
                        type="text" 
                        value={editingSong.slug}
                        onChange={(e) => setEditingSong(prev => prev ? { ...prev, slug: e.target.value } : null)}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Artist Name
                      </label>
                      <input 
                        type="text" 
                        value={editingSong.artist}
                        onChange={(e) => setEditingSong(prev => prev ? { ...prev, artist: e.target.value } : null)}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Genre
                      </label>
                      <input 
                        type="text" 
                        value={editingSong.genre}
                        onChange={(e) => setEditingSong(prev => prev ? { ...prev, genre: e.target.value } : null)}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                        placeholder="e.g. Desi Hip-Hop"
                      />
                      {/* Genre quick suggestions */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {GENRE_SUGGESTIONS.slice(0, 4).map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setEditingSong(prev => prev ? { ...prev, genre: g } : null)}
                            className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono transition-colors"
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Language
                      </label>
                      <input 
                        type="text" 
                        value={editingSong.language}
                        onChange={(e) => setEditingSong(prev => prev ? { ...prev, language: e.target.value } : null)}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                        placeholder="Hindi / Marwari"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Release Date
                      </label>
                      <input 
                        type="date" 
                        value={editingSong.releaseDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          const yr = parseInt(val.split('-')[0]) || 2026;
                          setEditingSong(prev => prev ? { ...prev, releaseDate: val, year: yr } : null);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Year
                      </label>
                      <input 
                        type="number" 
                        value={editingSong.year}
                        onChange={(e) => setEditingSong(prev => prev ? { ...prev, year: parseInt(e.target.value) || 2026 } : null)}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Duration (mm:ss)
                      </label>
                      <input 
                        type="text" 
                        value={editingSong.duration}
                        onChange={(e) => setEditingSong(prev => prev ? { ...prev, duration: e.target.value } : null)}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white font-mono"
                        placeholder="3:24"
                      />
                    </div>
                  </div>

                  {/* Album Cover Art URL + Preview */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Cover Art Image URL
                    </label>
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-700">
                        <img src={editingSong.cover} alt="Cover preview" className="w-full h-full object-cover" />
                      </div>
                      <input 
                        type="url" 
                        value={editingSong.cover}
                        onChange={(e) => setEditingSong(prev => prev ? { ...prev, cover: e.target.value } : null)}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Story &amp; Description
                    </label>
                    <textarea 
                      rows={2}
                      value={editingSong.description}
                      onChange={(e) => setEditingSong(prev => prev ? { ...prev, description: e.target.value } : null)}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white resize-none"
                      placeholder="Story behind the song, theme, inspiration..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: HOSTED AUDIO FILE LINK (CORE USER REQUIREMENT) */}
              {modalTab === 'audio' && (
                <div className="space-y-6">
                  
                  {/* Hosted Audio Link Card */}
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-emerald-500" />
                      <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        Hosted Audio File URL
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Enter the direct URL where your audio track is hosted (e.g. on your domain, CDN, cloud bucket, or file server). Supported formats: <span className="font-mono text-emerald-400">MP3, M4A, WAV, OGG, AAC</span>.
                    </p>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Audio File URL (Direct Link) *
                      </label>
                      <input 
                        type="url"
                        value={editingSong.audioUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAudioTestStatus('idle');
                          setEditingSong(prev => prev ? { 
                            ...prev, 
                            audioUrl: val,
                            audioHostType: 'hosted_link'
                          } : null);
                        }}
                        placeholder="https://yourdomain.com/music/my-song.mp3"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-mono text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    {/* Test Audio Link Verifier Button */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleTestAudioLink}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        {isTestingAudio ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Stop Test Audio</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            <span>Test &amp; Verify Audio Link</span>
                          </>
                        )}
                      </button>

                      {audioTestStatus === 'verified' && (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold font-mono">
                          <Check className="w-4 h-4" />
                          <span>Link verified &amp; ready to stream!</span>
                        </span>
                      )}

                      {audioTestStatus === 'loading' && (
                        <span className="text-xs text-amber-500 font-mono animate-pulse">
                          Connecting and buffering audio...
                        </span>
                      )}

                      {audioTestStatus === 'failed' && (
                        <span className="text-xs text-red-500 font-mono">
                          {audioTestError || 'Failed to stream audio URL.'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Optional File Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Audio File Display Name (Optional)
                      </label>
                      <input 
                        type="text" 
                        value={editingSong.audioFileName || ''}
                        onChange={(e) => setEditingSong(prev => prev ? { ...prev, audioFileName: e.target.value } : null)}
                        placeholder="e.g. rutba_master_24bit.mp3"
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                        Audio File Size (Optional)
                      </label>
                      <input 
                        type="text" 
                        value={editingSong.audioFileSize || ''}
                        onChange={(e) => setEditingSong(prev => prev ? { ...prev, audioFileSize: e.target.value } : null)}
                        placeholder="e.g. 4.6 MB"
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Optional Local File Attachment */}
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        Alternative: Attach Local Audio File
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      If you haven't uploaded your audio to a server yet, you can upload an audio file directly from your computer.
                    </p>
                    <input 
                      type="file"
                      accept="audio/*"
                      onChange={handleLocalFileUpload}
                      className="text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-200 dark:file:bg-neutral-700 file:text-neutral-800 dark:file:text-white hover:file:bg-amber-500 hover:file:text-neutral-950 file:cursor-pointer"
                    />
                  </div>

                </div>
              )}

              {/* TAB 3: RELATED VIDEOS (CORE USER REQUIREMENT) */}
              {modalTab === 'videos' && (
                <div className="space-y-6">
                  
                  {/* New Related Video Form */}
                  <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-red-500" />
                        <h4 className="text-sm font-bold text-red-600 dark:text-red-400">
                          Add Related Video for This Song
                        </h4>
                      </div>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        Supports YouTube Videos, Lyricals, BTS &amp; Live Performances
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          Video Title *
                        </label>
                        <input 
                          type="text"
                          value={newVideoTitle}
                          onChange={(e) => setNewVideoTitle(e.target.value)}
                          placeholder="e.g. RUTBA — Official Music Video [4K]"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          YouTube / Video URL *
                        </label>
                        <input 
                          type="url"
                          value={newVideoUrl}
                          onChange={(e) => {
                            const url = e.target.value;
                            setNewVideoUrl(url);
                            const id = extractYouTubeId(url);
                            setVideoPreviewEmbedId(id);
                          }}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          Video Category / Type
                        </label>
                        <select
                          value={newVideoType}
                          onChange={(e) => setNewVideoType(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                        >
                          {VIDEO_TYPES.map(vt => (
                            <option key={vt} value={vt}>{vt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          Video Duration
                        </label>
                        <input 
                          type="text"
                          value={newVideoDuration}
                          onChange={(e) => setNewVideoDuration(e.target.value)}
                          placeholder="3:30"
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Preview embed if available */}
                    {videoPreviewEmbedId && (
                      <div className="rounded-xl overflow-hidden aspect-video max-w-sm bg-neutral-950 border border-neutral-800">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${videoPreviewEmbedId}`}
                          title="Preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddRelatedVideo}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Video to "{editingSong.title || 'Track'}"</span>
                    </button>
                  </div>

                  {/* List of Attached Videos */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Attached Videos ({editingSong.relatedVideos?.length || 0})
                    </h4>

                    {(!editingSong.relatedVideos || editingSong.relatedVideos.length === 0) ? (
                      <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 text-xs text-neutral-400">
                        No videos attached yet. Add official music videos, lyric videos, or BTS above!
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {editingSong.relatedVideos.map((vid, idx) => (
                          <div 
                            key={vid.id || idx}
                            className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-16 h-11 rounded-lg overflow-hidden bg-neutral-950 shrink-0 border border-neutral-700">
                                <img src={vid.thumbnail || editingSong.cover} alt={vid.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-500 text-[10px] font-mono font-bold uppercase">
                                    {vid.type || 'Video'}
                                  </span>
                                  <span className="font-mono text-[10px] text-neutral-400">{vid.duration}</span>
                                </div>
                                <h5 className="text-xs font-bold text-neutral-900 dark:text-white truncate max-w-sm mt-0.5">
                                  {vid.title}
                                </h5>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveRelatedVideo(vid.id)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                              title="Remove Video"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 4: LYRICS & CREDITS */}
              {modalTab === 'lyrics_credits' && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        Track Lyrics
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const sample = `[Intro]\nMic check, ABM in the session...\n\n[Chorus]\nOriginal anthem, born from the hustle\nWords with weight and beats with muscle!\n\n[Verse 1]\nWrite lines by night, build dreams by day...`;
                          setEditingSong(prev => prev ? { ...prev, lyrics: sample } : null);
                        }}
                        className="text-[10px] text-amber-500 hover:underline font-mono"
                      >
                        Insert Stanza Template
                      </button>
                    </div>
                    <textarea 
                      rows={8}
                      value={editingSong.lyrics}
                      onChange={(e) => setEditingSong(prev => prev ? { ...prev, lyrics: e.target.value } : null)}
                      className="w-full p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white leading-relaxed resize-y"
                      placeholder="Paste formatted lyrics here with verse and chorus markers..."
                    />
                  </div>

                  {/* Production Credits Form */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold">
                      Song Production Credits
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">Lyrics Written By</label>
                        <input 
                          type="text"
                          value={editingSong.credits?.lyrics || ''}
                          onChange={(e) => setEditingSong(prev => prev ? {
                            ...prev,
                            credits: { ...prev.credits, lyrics: e.target.value }
                          } : null)}
                          className="w-full px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">Music / Beat By</label>
                        <input 
                          type="text"
                          value={editingSong.credits?.music || ''}
                          onChange={(e) => setEditingSong(prev => prev ? {
                            ...prev,
                            credits: { ...prev.credits, music: e.target.value }
                          } : null)}
                          className="w-full px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">Production Studio</label>
                        <input 
                          type="text"
                          value={editingSong.credits?.production || ''}
                          onChange={(e) => setEditingSong(prev => prev ? {
                            ...prev,
                            credits: { ...prev.credits, production: e.target.value }
                          } : null)}
                          className="w-full px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">Mix &amp; Master</label>
                        <input 
                          type="text"
                          value={editingSong.credits?.mixMaster || ''}
                          onChange={(e) => setEditingSong(prev => prev ? {
                            ...prev,
                            credits: { ...prev.credits, mixMaster: e.target.value }
                          } : null)}
                          className="w-full px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: STREAMING LINKS & VISIBILITY */}
              {modalTab === 'streaming' && (
                <div className="space-y-6">
                  
                  {/* Visibility Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={editingSong.published !== false}
                        onChange={(e) => setEditingSong(prev => prev ? { ...prev, published: e.target.checked } : null)}
                        className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 dark:text-white block">Published on Website</span>
                        <span className="text-[11px] text-neutral-500">Visible to all visitors in discography</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={Boolean(editingSong.featured)}
                        onChange={(e) => setEditingSong(prev => prev ? { ...prev, featured: e.target.checked } : null)}
                        className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 dark:text-white block">Featured Anthem</span>
                        <span className="text-[11px] text-neutral-500">Showcase in hero deck and homepage</span>
                      </div>
                    </label>
                  </div>

                  {/* External Streaming Platform Links */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold">
                      External Streaming Links
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">Spotify URL</label>
                        <input 
                          type="url"
                          value={editingSong.streamingLinks?.spotify || ''}
                          onChange={(e) => setEditingSong(prev => prev ? {
                            ...prev,
                            streamingLinks: { ...prev.streamingLinks, spotify: e.target.value }
                          } : null)}
                          className="w-full px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                          placeholder="https://open.spotify.com/track/..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">YouTube Music URL</label>
                        <input 
                          type="url"
                          value={editingSong.streamingLinks?.youtube || ''}
                          onChange={(e) => setEditingSong(prev => prev ? {
                            ...prev,
                            streamingLinks: { ...prev.streamingLinks, youtube: e.target.value }
                          } : null)}
                          className="w-full px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                          placeholder="https://youtube.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">Apple Music URL</label>
                        <input 
                          type="url"
                          value={editingSong.streamingLinks?.appleMusic || ''}
                          onChange={(e) => setEditingSong(prev => prev ? {
                            ...prev,
                            streamingLinks: { ...prev.streamingLinks, appleMusic: e.target.value }
                          } : null)}
                          className="w-full px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                          placeholder="https://music.apple.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">JioSaavn URL</label>
                        <input 
                          type="url"
                          value={editingSong.streamingLinks?.jiosaavn || ''}
                          onChange={(e) => setEditingSong(prev => prev ? {
                            ...prev,
                            streamingLinks: { ...prev.streamingLinks, jiosaavn: e.target.value }
                          } : null)}
                          className="w-full px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                          placeholder="https://jiosaavn.com/..."
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Modal Footer with Save / Cancel */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    if (testAudioRef.current) testAudioRef.current.pause();
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Track &amp; Videos</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={Boolean(deleteTarget)}
          title={`Delete "${deleteTarget.title}"?`}
          itemName={deleteTarget.title}
          itemType="song"
          onConfirm={async () => {
            await deleteSong(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

    </div>
  );
};
