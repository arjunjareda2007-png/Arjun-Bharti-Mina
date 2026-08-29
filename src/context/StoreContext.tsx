import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  UserProfile, 
  Song, 
  LyricItem, 
  GalleryItem, 
  VideoItem, 
  ProjectItem, 
  BookItem, 
  TimelineItem, 
  SocialLink, 
  ContactMessage, 
  SiteAnalytics,
  SiteBranding,
  HomepageConfig,
  NavigationItem,
  AppearanceConfig,
  ThemeMode,
  SEOConfig,
  YouTubeSettings,
  ActiveTab,
  ShareData
} from '../types';
import { 
  initialProfile, 
  initialSongs, 
  initialLyrics, 
  initialGallery, 
  initialVideos, 
  initialProjects, 
  initialBooks, 
  initialTimeline, 
  initialSocialLinks,
  initialBranding,
  initialHomepage,
  initialNavigation,
  initialAppearance,
  initialSEO,
  initialYouTube,
  initialAnalytics
} from '../data/initialData';
import { audioSynth } from '../utils/audioSynth';
import { parseDurationToSeconds } from '../utils/helpers';
import { isOwnerEmail } from '../firebase';
import { AuthUser } from '../types';
import { firestoreService } from '../services/firestoreService';

interface NotificationToast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Navigation & Views
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
  selectedSongId: string | null;
  setSelectedSongId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedLyricId: string | null;
  setSelectedLyricId: (id: string | null) => void;
  selectedBookId: string | null;
  setSelectedBookId: (id: string | null) => void;

  // Data Entities
  profile: UserProfile;
  songs: Song[];
  lyrics: LyricItem[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  projects: ProjectItem[];
  books: BookItem[];
  timeline: TimelineItem[];
  socialLinks: SocialLink[];
  messages: ContactMessage[];
  analytics: SiteAnalytics;

  // Site Configuration & Branding
  branding: SiteBranding;
  homepage: HomepageConfig;
  navigation: NavigationItem[];
  appearance: AppearanceConfig;
  seo: SEOConfig;
  youtube: YouTubeSettings;

  // Audio Player
  currentSong: Song | null;
  isPlaying: boolean;
  playbackTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLyricsExpanded: boolean;
  setIsLyricsExpanded: (val: boolean) => void;
  playerMode: 'spotify' | 'custom';
  setPlayerMode: (mode: 'spotify' | 'custom') => void;
  spotifyPlayerSize: 'compact' | 'standard' | 'large';
  setSpotifyPlayerSize: (size: 'compact' | 'standard' | 'large') => void;
  isFullScreenPlayerOpen: boolean;
  activePlayerView: 'art' | 'video' | 'lyrics' | 'queue';
  setActivePlayerView: (view: 'art' | 'video' | 'lyrics' | 'queue') => void;
  openFullScreenPlayer: (initialView?: 'art' | 'video' | 'lyrics' | 'queue') => void;
  closeFullScreenPlayer: () => void;
  isShuffle: boolean;
  setIsShuffle: (val: boolean) => void;
  isLoop: boolean;
  setIsLoop: (val: boolean) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  sleepTimerMinutes: number | null;
  setSleepTimerMinutes: (mins: number | null) => void;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  pauseSong: () => void;
  resumeSong: () => void;
  closePlayer: () => void;
  seekSong: (time: number) => void;
  nextSong: () => void;
  prevSong: () => void;
  changeVolume: (val: number) => void;
  toggleMute: () => void;

  // Modals & Overlays
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;

  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  shareData: ShareData | null;
  openShare: (data: ShareData) => void;
  closeShare: () => void;

  lightboxItem: GalleryItem | null;
  openLightbox: (item: GalleryItem) => void;
  closeLightbox: () => void;
  nextLightbox: () => void;
  prevLightbox: () => void;

  activeVideo: VideoItem | null;
  openVideoPlayer: (video: VideoItem) => void;
  closeVideoPlayer: () => void;

  // Authentication & Authorization (100% Pure Clerk Authentication)
  authUser: AuthUser | null;
  isOwner: boolean;
  authLoading: boolean;
  authError: string | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot' | 'clerk_config';
  openAuthModal: (mode?: 'login' | 'register' | 'forgot' | 'clerk_config') => void;
  closeAuthModal: () => void;
  openSignIn: () => void;
  openSignUp: () => void;
  logout: () => Promise<void>;
  setClerkSession: (session: {
    user: AuthUser | null;
    isLoading: boolean;
    signOutFn?: () => Promise<void> | void;
    openSignInFn?: () => void;
    openSignUpFn?: () => void;
  }) => void;

  // Theme & Appearance
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  updateAppearance: (config: Partial<AppearanceConfig>) => void;

  // Toast notifications
  toast: NotificationToast | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // CRUD Mutations (Persists to Firestore + Local State)
  updateProfile: (updated: UserProfile) => Promise<void>;
  updateBranding: (updated: Partial<SiteBranding>) => Promise<void>;
  updateHomepage: (updated: Partial<HomepageConfig>) => Promise<void>;
  updateNavigation: (updated: NavigationItem[]) => Promise<void>;
  updateSEO: (updated: Partial<SEOConfig>) => Promise<void>;
  updateYouTube: (updated: Partial<YouTubeSettings>) => Promise<void>;
  
  addSong: (song: Song) => Promise<void>;
  updateSong: (song: Song) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  toggleFeaturedSong: (id: string) => Promise<void>;
  toggleSongPublish: (id: string) => Promise<void>;

  addLyric: (lyric: LyricItem) => Promise<void>;
  updateLyric: (lyric: LyricItem) => Promise<void>;
  deleteLyric: (id: string) => Promise<void>;

  addGalleryItem: (item: GalleryItem) => Promise<void>;
  updateGalleryItem: (item: GalleryItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;

  addVideo: (video: VideoItem) => Promise<void>;
  updateVideo: (video: VideoItem) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;

  addProject: (project: ProjectItem) => Promise<void>;
  updateProject: (project: ProjectItem) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addBook: (book: BookItem) => Promise<void>;
  updateBook: (book: BookItem) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;

  addTimelineItem: (item: TimelineItem) => Promise<void>;
  updateTimelineItem: (item: TimelineItem) => Promise<void>;
  deleteTimelineItem: (id: string) => Promise<void>;

  addSocialLink: (link: SocialLink) => Promise<void>;
  updateSocialLink: (link: SocialLink) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;

  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read' | 'replied'>) => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  // Analytics Handlers
  recordSongPlay: (songId: string) => void;
  recordProjectClick: (projectId: string) => void;
  recordSearchQuery: (query: string) => void;
  recordInteraction: (type: string, label: string) => void;
  resetAnalytics: () => void;

  // Image Cropper modal
  isCropperOpen: boolean;
  cropperOptions: {
    initialImageUrl?: string;
    title?: string;
    aspectRatioPreset?: '1:1' | '16:9' | '4:3' | '3:1' | '9:16' | 'free';
    outputWidth?: number;
    outputHeight?: number;
    onCropComplete: (dataUrl: string) => void;
  } | null;
  openCropper: (options: {
    initialImageUrl?: string;
    title?: string;
    aspectRatioPreset?: '1:1' | '16:9' | '4:3' | '3:1' | '9:16' | 'free';
    outputWidth?: number;
    outputHeight?: number;
    onCropComplete: (dataUrl: string) => void;
  }) => void;
  closeCropper: () => void;

  // Bulk Operations
  bulkDeleteItems: (type: 'songs' | 'gallery' | 'videos' | 'projects' | 'lyrics', ids: string[]) => Promise<void>;
  bulkTogglePublish: (type: 'songs' | 'gallery' | 'videos' | 'projects' | 'lyrics', ids: string[], publish: boolean) => Promise<void>;
  bulkToggleFeatured: (type: 'songs' | 'gallery' | 'videos' | 'projects' | 'lyrics', ids: string[], featured: boolean) => Promise<void>;

  // Data Import/Export & Reset
  exportWebsiteData: () => string;
  importWebsiteData: (jsonData: string) => boolean;
  resetAllData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'abm_hub_v2_';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedLyricId, setSelectedLyricId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<NotificationToast | null>(null);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(curr => curr?.id === id ? null : curr);
    }, 4000);
  }, []);

  // Auth State (Powered by Clerk)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | 'clerk_config'>('login');
  const [clerkSignOutFn, setClerkSignOutFn] = useState<(() => Promise<void> | void) | null>(null);
  const [clerkOpenSignInFn, setClerkOpenSignInFn] = useState<(() => void) | null>(null);
  const [clerkOpenSignUpFn, setClerkOpenSignUpFn] = useState<(() => void) | null>(null);

  const setClerkSession = useCallback((session: {
    user: AuthUser | null;
    isLoading: boolean;
    signOutFn?: () => Promise<void> | void;
    openSignInFn?: () => void;
    openSignUpFn?: () => void;
  }) => {
    setAuthUser(session.user);
    setIsOwner(isOwnerEmail(session.user?.email));
    setAuthLoading(session.isLoading);
    if (session.signOutFn) setClerkSignOutFn(() => session.signOutFn!);
    if (session.openSignInFn) setClerkOpenSignInFn(() => session.openSignInFn!);
    if (session.openSignUpFn) setClerkOpenSignUpFn(() => session.openSignUpFn!);
  }, []);

  const openSignIn = useCallback(() => {
    if (clerkOpenSignInFn) {
      clerkOpenSignInFn();
    } else {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  }, [clerkOpenSignInFn]);

  const openSignUp = useCallback(() => {
    if (clerkOpenSignUpFn) {
      clerkOpenSignUpFn();
    } else {
      setAuthModalMode('register');
      setIsAuthModalOpen(true);
    }
  }, [clerkOpenSignUpFn]);

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' | 'clerk_config' = 'login') => {
    setAuthModalMode(mode);
    setAuthError(null);
    if (mode === 'register' && clerkOpenSignUpFn) {
      clerkOpenSignUpFn();
    } else if (mode === 'login' && clerkOpenSignInFn) {
      clerkOpenSignInFn();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  const logout = async () => {
    try {
      if (clerkSignOutFn) {
        await clerkSignOutFn();
      }
      setAuthUser(null);
      setIsOwner(false);
      showToast('Signed out of Clerk session', 'info');
      if (currentTab === 'admin') {
        setCurrentTab('home');
      }
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Entities with LocalStorage Persistence & Firestore Sync
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}profile`);
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [branding, setBranding] = useState<SiteBranding>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}branding`);
    return saved ? JSON.parse(saved) : initialBranding;
  });

  const [homepage, setHomepage] = useState<HomepageConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}homepage`);
    return saved ? JSON.parse(saved) : initialHomepage;
  });

  const [navigation, setNavigation] = useState<NavigationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}navigation`);
    return saved ? JSON.parse(saved) : initialNavigation;
  });

  const [appearance, setAppearance] = useState<AppearanceConfig>(() => {
    const savedTheme = localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`) as ThemeMode | null;
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}appearance`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialAppearance,
          ...parsed,
          themeMode: savedTheme || parsed.themeMode || 'dark',
          accentColor: parsed.accentColor || 'neutral'
        };
      } catch (e) {
        return {
          ...initialAppearance,
          themeMode: savedTheme || 'dark'
        };
      }
    }
    return {
      ...initialAppearance,
      themeMode: savedTheme || initialAppearance.themeMode || 'dark'
    };
  });

  const [seo, setSEO] = useState<SEOConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}seo`);
    return saved ? JSON.parse(saved) : initialSEO;
  });

  const [youtube, setYouTube] = useState<YouTubeSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}youtube`);
    return saved ? JSON.parse(saved) : initialYouTube;
  });

  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}songs`);
    return saved ? JSON.parse(saved) : initialSongs;
  });

  const [lyrics, setLyrics] = useState<LyricItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}lyrics`);
    return saved ? JSON.parse(saved) : initialLyrics;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}gallery`);
    return saved ? JSON.parse(saved) : initialGallery;
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}videos`);
    return saved ? JSON.parse(saved) : initialVideos;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}projects`);
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [books, setBooks] = useState<BookItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}books`);
    return saved ? JSON.parse(saved) : initialBooks;
  });

  const [timeline, setTimeline] = useState<TimelineItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}timeline`);
    return saved ? JSON.parse(saved) : initialTimeline;
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}socialLinks`);
    return saved ? JSON.parse(saved) : initialSocialLinks;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}messages`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-demo-1',
        name: 'Aarav Sharma',
        email: 'aarav.music@example.com',
        subject: 'Collaboration on upcoming Hip-Hop EP',
        message: 'Loved your energy on RUTBA! Would love to discuss a beat collaboration for a Delhi cypher track.',
        date: '2026-02-20',
        read: false,
        replied: false
      }
    ];
  });

  const [analytics, setAnalytics] = useState<SiteAnalytics>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}analytics`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          pageViews: parsed.pageViews || 1,
          uniqueVisitors: parsed.uniqueVisitors || 1,
          tabViews: parsed.tabViews || { home: 1 },
          songPlays: parsed.songPlays || {},
          projectClicks: parsed.projectClicks || {},
          searches: parsed.searches || [],
          dailyActivity: parsed.dailyActivity || [{ date: new Date().toISOString().split('T')[0], views: 1, plays: 0 }],
          devices: parsed.devices || { mobile: 0, desktop: 1, tablet: 0 },
          browsers: parsed.browsers || { Chrome: 1 },
          interactionEvents: parsed.interactionEvents || [],
          lastActiveTimestamp: parsed.lastActiveTimestamp || new Date().toISOString()
        };
      } catch (e) {
        // Fallback
      }
    }
    return {
      pageViews: 124,
      uniqueVisitors: 68,
      tabViews: { home: 54, music: 38, lyrics: 16, projects: 12, gallery: 8 },
      songPlays: { 'rutba-2026': 42, 'jaipur-to-delhi-2025': 28, 'khwabeeda-2025': 35 },
      projectClicks: { 'proj-1': 14, 'proj-2': 9, 'proj-3': 11 },
      searches: [
        { query: 'Rutba song', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { query: 'Civil Engineering projects', timestamp: new Date(Date.now() - 7200000).toISOString() }
      ],
      dailyActivity: [
        { date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], views: 32, plays: 18 },
        { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], views: 48, plays: 29 },
        { date: new Date().toISOString().split('T')[0], views: 44, plays: 32 }
      ],
      devices: { mobile: 72, desktop: 46, tablet: 6 },
      browsers: { Chrome: 88, Safari: 24, Firefox: 8, Edge: 4 },
      interactionEvents: [
        { type: 'lyric_copy', label: 'RUTBA - Verse 1', timestamp: new Date(Date.now() - 1800000).toISOString() },
        { type: 'photo_view', label: 'Stage Performance 2026', timestamp: new Date(Date.now() - 3200000).toISOString() }
      ],
      lastActiveTimestamp: new Date().toISOString()
    };
  });

  // Fetch initial documents from Firestore if available
  useEffect(() => {
    const loadFirestoreData = async () => {
      try {
        const firestoreProfile = await firestoreService.fetchDocument<UserProfile>('profiles', 'main');
        if (firestoreProfile) {
          setProfile({
            ...initialProfile,
            ...firestoreProfile,
            education: { ...initialProfile.education, ...(firestoreProfile.education || {}) },
            schoolEducation: firestoreProfile.schoolEducation || initialProfile.schoolEducation
          });
        }

        const firestoreBranding = await firestoreService.fetchDocument<SiteBranding>('siteSettings', 'branding');
        if (firestoreBranding) {
          setBranding({
            ...initialBranding,
            ...firestoreBranding,
            logoText: firestoreBranding.logoText || initialBranding.logoText || 'ABM'
          });
        }

        const firestoreHomepage = await firestoreService.fetchDocument<HomepageConfig>('homepage', 'config');
        if (firestoreHomepage) setHomepage(firestoreHomepage);

        const firestoreSEO = await firestoreService.fetchDocument<SEOConfig>('siteSettings', 'seo');
        if (firestoreSEO) setSEO(firestoreSEO);

        const firestoreSongs = await firestoreService.fetchCollection<Song>('songs');
        if (firestoreSongs && firestoreSongs.length > 0) setSongs(firestoreSongs);

        const firestoreLyrics = await firestoreService.fetchCollection<LyricItem>('lyrics');
        if (firestoreLyrics && firestoreLyrics.length > 0) setLyrics(firestoreLyrics);

        const firestoreGallery = await firestoreService.fetchCollection<GalleryItem>('gallery');
        if (firestoreGallery && firestoreGallery.length > 0) setGallery(firestoreGallery);

        const firestoreVideos = await firestoreService.fetchCollection<VideoItem>('videos');
        if (firestoreVideos && firestoreVideos.length > 0) setVideos(firestoreVideos);

        const firestoreProjects = await firestoreService.fetchCollection<ProjectItem>('projects');
        if (firestoreProjects && firestoreProjects.length > 0) setProjects(firestoreProjects);

        const firestoreBooks = await firestoreService.fetchCollection<BookItem>('books');
        if (firestoreBooks && firestoreBooks.length > 0) setBooks(firestoreBooks);

        const firestoreSocial = await firestoreService.fetchCollection<SocialLink>('socialLinks');
        if (firestoreSocial && firestoreSocial.length > 0) setSocialLinks(firestoreSocial);
      } catch (err) {
        console.warn('Initial Firestore hydration notice:', err);
      }
    };
    loadFirestoreData();
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}branding`, JSON.stringify(branding));
  }, [branding]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}homepage`, JSON.stringify(homepage));
  }, [homepage]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}navigation`, JSON.stringify(navigation));
  }, [navigation]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}appearance`, JSON.stringify(appearance));
  }, [appearance]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}seo`, JSON.stringify(seo));
  }, [seo]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}youtube`, JSON.stringify(youtube));
  }, [youtube]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}songs`, JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}lyrics`, JSON.stringify(lyrics));
  }, [lyrics]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}gallery`, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}videos`, JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}books`, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}timeline`, JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}socialLinks`, JSON.stringify(socialLinks));
  }, [socialLinks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}messages`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}analytics`, JSON.stringify(analytics));
  }, [analytics]);

  // Real Visitor & Session Tracker
  useEffect(() => {
    try {
      const hasVisitedBefore = localStorage.getItem('abm_visitor_id');
      const sessionActive = sessionStorage.getItem('abm_session_id');

      if (!sessionActive) {
        const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        sessionStorage.setItem('abm_session_id', newSessionId);

        // Compute device
        const width = window.innerWidth;
        const ua = (navigator.userAgent || '').toLowerCase();
        const isMob = /iphone|ipad|ipod|android|mobile/.test(ua) || width < 768;
        const isTab = !isMob && (/tablet|ipad/.test(ua) || (width >= 768 && width <= 1024));
        const deviceType: 'mobile' | 'desktop' | 'tablet' = isMob ? 'mobile' : isTab ? 'tablet' : 'desktop';

        // Compute browser
        let browser = 'Chrome';
        if (ua.includes('firefox')) browser = 'Firefox';
        else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
        else if (ua.includes('edg')) browser = 'Edge';
        else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';

        setAnalytics(prev => {
          const today = new Date().toISOString().split('T')[0];
          const dailyMap = [...(prev.dailyActivity || [])];
          const todayEntryIndex = dailyMap.findIndex(d => d.date === today);
          if (todayEntryIndex >= 0) {
            dailyMap[todayEntryIndex] = {
              ...dailyMap[todayEntryIndex],
              views: dailyMap[todayEntryIndex].views + 1
            };
          } else {
            dailyMap.push({ date: today, views: 1, plays: 0 });
          }

          return {
            ...prev,
            pageViews: (prev.pageViews || 0) + 1,
            uniqueVisitors: (prev.uniqueVisitors || 0) + (hasVisitedBefore ? 0 : 1),
            devices: {
              mobile: (prev.devices?.mobile || 0) + (deviceType === 'mobile' ? 1 : 0),
              tablet: (prev.devices?.tablet || 0) + (deviceType === 'tablet' ? 1 : 0),
              desktop: (prev.devices?.desktop || 0) + (deviceType === 'desktop' ? 1 : 0)
            },
            browsers: {
              ...(prev.browsers || {}),
              [browser]: ((prev.browsers || {})[browser] || 0) + 1
            },
            dailyActivity: dailyMap.slice(-30),
            lastActiveTimestamp: new Date().toISOString()
          };
        });

        if (!hasVisitedBefore) {
          localStorage.setItem('abm_visitor_id', `vis_${Date.now()}`);
        }
      }
    } catch (e) {
      console.warn('Analytics session tracker notice:', e);
    }
  }, []);

  // Real tab view tracker
  useEffect(() => {
    setAnalytics(prev => {
      const today = new Date().toISOString().split('T')[0];
      const dailyMap = [...(prev.dailyActivity || [])];
      const todayEntryIndex = dailyMap.findIndex(d => d.date === today);
      if (todayEntryIndex >= 0) {
        dailyMap[todayEntryIndex] = {
          ...dailyMap[todayEntryIndex],
          views: (dailyMap[todayEntryIndex].views || 0) + 1
        };
      } else {
        dailyMap.push({ date: today, views: 1, plays: 0 });
      }

      return {
        ...prev,
        pageViews: (prev.pageViews || 0) + 1,
        tabViews: {
          ...(prev.tabViews || {}),
          [currentTab]: ((prev.tabViews || {})[currentTab] || 0) + 1
        },
        dailyActivity: dailyMap.slice(-30),
        lastActiveTimestamp: new Date().toISOString()
      };
    });
  }, [currentTab]);

  // Sync browser title with branding
  useEffect(() => {
    if (branding.browserTitle) {
      document.title = branding.browserTitle;
    }
  }, [branding.browserTitle]);

  // Audio Player State
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(198);
  const [volume, setVolumeState] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLyricsExpanded, setIsLyricsExpanded] = useState<boolean>(false);
  const [playerMode, setPlayerMode] = useState<'spotify' | 'custom'>('spotify');
  const [spotifyPlayerSize, setSpotifyPlayerSize] = useState<'compact' | 'standard' | 'large'>('standard');
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState<boolean>(false);
  const [activePlayerView, setActivePlayerView] = useState<'art' | 'video' | 'lyrics' | 'queue'>('art');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);

  const openFullScreenPlayer = useCallback((initialView?: 'art' | 'video' | 'lyrics' | 'queue') => {
    if (initialView) {
      setActivePlayerView(initialView);
    }
    setIsFullScreenPlayerOpen(true);
  }, []);

  const closeFullScreenPlayer = useCallback(() => {
    setIsFullScreenPlayerOpen(false);
  }, []);

  // Modals & Cropper
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Image Cropper modal state
  const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
  const [cropperOptions, setCropperOptions] = useState<{
    initialImageUrl?: string;
    title?: string;
    aspectRatioPreset?: '1:1' | '16:9' | '4:3' | '3:1' | '9:16' | 'free';
    outputWidth?: number;
    outputHeight?: number;
    onCropComplete: (dataUrl: string) => void;
  } | null>(null);

  const openCropper = useCallback((options: {
    initialImageUrl?: string;
    title?: string;
    aspectRatioPreset?: '1:1' | '16:9' | '4:3' | '3:1' | '9:16' | 'free';
    outputWidth?: number;
    outputHeight?: number;
    onCropComplete: (dataUrl: string) => void;
  }) => {
    setCropperOptions(options);
    setIsCropperOpen(true);
  }, []);

  const closeCropper = useCallback(() => {
    setIsCropperOpen(false);
    setCropperOptions(null);
  }, []);

  // Theme & Appearance Dynamic Styling
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return appearance.themeMode || 'light';
  });

  const applyAppearanceStyles = useCallback((appConfig: AppearanceConfig) => {
    const darkThemes: ThemeMode[] = ['dark', 'midnight', 'emerald', 'amber', 'nordic', 'cyber', 'sunset', 'cherry', 'blossom'];
    const currentMode = appConfig.themeMode || 'dark';
    
    let isDark = false;
    if (currentMode === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else if (currentMode === 'light') {
      isDark = false;
    } else {
      isDark = darkThemes.includes(currentMode);
    }
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    document.documentElement.setAttribute('data-theme', currentMode);
    document.documentElement.setAttribute('data-accent', appConfig.accentColor || 'neutral');
    document.documentElement.setAttribute('data-radius', appConfig.borderRadius || 'md');
    document.documentElement.setAttribute('data-card-style', appConfig.cardStyle || 'minimal');

    // Set CSS accent variables for dynamic palette response
    const accentMap: Record<string, { primary: string; glow: string }> = {
      neutral: { primary: '#171717', glow: 'rgba(0, 0, 0, 0.08)' },
      slate: { primary: '#334155', glow: 'rgba(51, 65, 85, 0.15)' },
      emerald: { primary: '#059669', glow: 'rgba(5, 150, 105, 0.2)' },
      sky: { primary: '#0284c7', glow: 'rgba(2, 132, 199, 0.2)' },
      rose: { primary: '#e11d48', glow: 'rgba(225, 29, 72, 0.2)' },
      violet: { primary: '#7c3aed', glow: 'rgba(124, 58, 237, 0.2)' },
      amber: { primary: '#d97706', glow: 'rgba(217, 119, 6, 0.2)' },
      orange: { primary: '#ea580c', glow: 'rgba(234, 88, 12, 0.2)' },
    };

    const chosen = accentMap[appConfig.accentColor] || accentMap.neutral;
    document.documentElement.style.setProperty('--color-accent-primary', chosen.primary);
    document.documentElement.style.setProperty('--color-accent-glow', chosen.glow);
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    setAppearance(prev => {
      const updated = { ...prev, themeMode: newTheme };
      applyAppearanceStyles(updated);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}appearance`, JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, newTheme);
  }, [applyAppearanceStyles]);

  const updateAppearance = (config: Partial<AppearanceConfig>) => {
    setAppearance(prev => {
      const updated = { ...prev, ...config };
      if (config.themeMode) {
        setThemeState(config.themeMode);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, config.themeMode);
      }
      applyAppearanceStyles(updated);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}appearance`, JSON.stringify(updated));
      return updated;
    });
    showToast('Appearance settings saved and applied');
  };

  useEffect(() => {
    applyAppearanceStyles(appearance);

    // If system theme is selected, listen for OS dark/light mode switches
    if (appearance.themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyAppearanceStyles(appearance);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [appearance, applyAppearanceStyles]);

  // Analytics Helpers
  const recordSongPlay = useCallback((songId: string) => {
    setAnalytics(prev => {
      const today = new Date().toISOString().split('T')[0];
      const dailyMap = [...(prev.dailyActivity || [])];
      const todayEntryIndex = dailyMap.findIndex(d => d.date === today);
      if (todayEntryIndex >= 0) {
        dailyMap[todayEntryIndex] = {
          ...dailyMap[todayEntryIndex],
          plays: (dailyMap[todayEntryIndex].plays || 0) + 1
        };
      } else {
        dailyMap.push({ date: today, views: 1, plays: 1 });
      }

      return {
        ...prev,
        songPlays: {
          ...(prev.songPlays || {}),
          [songId]: ((prev.songPlays || {})[songId] || 0) + 1
        },
        dailyActivity: dailyMap.slice(-30),
        lastActiveTimestamp: new Date().toISOString()
      };
    });
  }, []);

  const recordProjectClick = useCallback((projectId: string) => {
    setAnalytics(prev => ({
      ...prev,
      projectClicks: {
        ...(prev.projectClicks || {}),
        [projectId]: ((prev.projectClicks || {})[projectId] || 0) + 1
      },
      lastActiveTimestamp: new Date().toISOString()
    }));
  }, []);

  const recordSearchQuery = useCallback((query: string) => {
    if (!query || !query.trim()) return;
    setAnalytics(prev => ({
      ...prev,
      searches: [
        { query: query.trim(), timestamp: new Date().toISOString() },
        ...(prev.searches || []).slice(0, 49)
      ]
    }));
  }, []);

  const recordInteraction = useCallback((type: string, label: string) => {
    setAnalytics(prev => ({
      ...prev,
      interactionEvents: [
        { type, label, timestamp: new Date().toISOString() },
        ...(prev.interactionEvents || []).slice(0, 49)
      ]
    }));
  }, []);

  const resetAnalytics = useCallback(() => {
    const freshAnalytics: SiteAnalytics = {
      pageViews: 1,
      uniqueVisitors: 1,
      tabViews: { [currentTab]: 1 },
      songPlays: {},
      projectClicks: {},
      searches: [],
      dailyActivity: [{ date: new Date().toISOString().split('T')[0], views: 1, plays: 0 }],
      devices: { mobile: 0, desktop: 1, tablet: 0 },
      browsers: { Chrome: 1 },
      interactionEvents: [],
      lastActiveTimestamp: new Date().toISOString()
    };
    setAnalytics(freshAnalytics);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}analytics`, JSON.stringify(freshAnalytics));
    showToast('Analytics logs reset successfully');
  }, [currentTab, showToast]);

  // Audio Handlers
  const nextSong = useCallback(() => {
    if (!currentSong || songs.length === 0) return;
    if (isLoop) {
      // Replay current song
      playSong(currentSong);
      return;
    }
    if (isShuffle && songs.length > 1) {
      let randomIndex = Math.floor(Math.random() * songs.length);
      while (songs[randomIndex].id === currentSong.id) {
        randomIndex = Math.floor(Math.random() * songs.length);
      }
      playSong(songs[randomIndex]);
      return;
    }
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    const next = songs[nextIndex];
    playSong(next);
  }, [currentSong, songs, isLoop, isShuffle]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    const dur = parseDurationToSeconds(song.duration) || 198;
    setDuration(dur);
    setPlaybackTime(0);

    // Track analytics
    setAnalytics(prev => ({
      ...prev,
      songPlays: {
        ...prev.songPlays,
        [song.id]: (prev.songPlays[song.id] || 0) + 1
      }
    }));

    // Update playCount in songs list
    setSongs(prev => prev.map(s => s.id === song.id ? { ...s, playCount: s.playCount + 1 } : s));

    if (playerMode === 'custom') {
      audioSynth.play(
        song.audioToneSequence || [261.63, 329.63, 392.00, 523.25],
        dur,
        (time) => {
          setPlaybackTime(time);
        },
        () => {
          nextSong();
        }
      );
    }
  };

  // Continuous playback timer for audio and visualizer sync
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && currentSong) {
      timer = setInterval(() => {
        setPlaybackTime(prev => {
          const next = prev + 1 * (playbackSpeed || 1);
          if (duration > 0 && next >= duration) {
            if (isLoop) {
              return 0;
            } else {
              nextSong();
              return 0;
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentSong?.id, duration, playbackSpeed, isLoop, nextSong]);

  // Sleep Timer Auto-pause
  useEffect(() => {
    let timeout: any = null;
    if (sleepTimerMinutes && isPlaying) {
      timeout = setTimeout(() => {
        setIsPlaying(false);
        setSleepTimerMinutes(null);
        audioSynth.pause();
        showToast('Sleep timer reached: Playback paused', 'info');
      }, sleepTimerMinutes * 60 * 1000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [sleepTimerMinutes, isPlaying, showToast]);

  const pauseSong = () => {
    setIsPlaying(false);
    audioSynth.pause();
  };

  const resumeSong = () => {
    if (currentSong) {
      setIsPlaying(true);
      audioSynth.resume();
    }
  };

  const closePlayer = useCallback(() => {
    setIsPlaying(false);
    setCurrentSong(null);
    setPlaybackTime(0);
    audioSynth.pause();
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      if (currentSong) {
        resumeSong();
      } else if (songs.length > 0) {
        playSong(songs[0]);
      }
    }
  };

  const seekSong = (time: number) => {
    const clamped = Math.max(0, Math.min(time, duration || 300));
    setPlaybackTime(clamped);
    audioSynth.seek(clamped);
  };

  const prevSong = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[prevIndex]);
  };

  const changeVolume = (val: number) => {
    setVolumeState(val);
    if (isMuted && val > 0) setIsMuted(false);
    audioSynth.setVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioSynth.setVolume(volume);
    } else {
      setIsMuted(true);
      audioSynth.setVolume(0);
    }
  };

  // Lightbox handlers
  const openLightbox = (item: GalleryItem) => setLightboxItem(item);
  const closeLightbox = () => setLightboxItem(null);
  const nextLightbox = () => {
    if (!lightboxItem || gallery.length === 0) return;
    const idx = gallery.findIndex(g => g.id === lightboxItem.id);
    const next = gallery[(idx + 1) % gallery.length];
    setLightboxItem(next);
  };
  const prevLightbox = () => {
    if (!lightboxItem || gallery.length === 0) return;
    const idx = gallery.findIndex(g => g.id === lightboxItem.id);
    const prev = gallery[(idx - 1 + gallery.length) % gallery.length];
    setLightboxItem(prev);
  };

  // Video modal handlers - pauses audio song to prevent double playback
  const openVideoPlayer = (video: VideoItem) => {
    if (isPlaying) {
      pauseSong();
    }
    setActiveVideo(video);
  };
  const closeVideoPlayer = () => setActiveVideo(null);

  // Search & Share
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);
  const openShare = (data: ShareData) => setShareData(data);
  const closeShare = () => setShareData(null);

  // Configuration Mutations
  const updateProfile = async (updated: UserProfile) => {
    setProfile(updated);
    await firestoreService.saveDocument('profiles', 'main', updated);
    showToast('Profile updated successfully');
  };

  const updateBranding = async (updated: Partial<SiteBranding>) => {
    const next = { ...branding, ...updated };
    setBranding(next);
    await firestoreService.saveDocument('siteSettings', 'branding', next);
    showToast('Site branding saved');
  };

  const updateHomepage = async (updated: Partial<HomepageConfig>) => {
    const next = { ...homepage, ...updated };
    setHomepage(next);
    await firestoreService.saveDocument('homepage', 'config', next);
    showToast('Homepage configuration updated');
  };

  const updateNavigation = async (updated: NavigationItem[]) => {
    setNavigation(updated);
    await firestoreService.saveDocument('siteSettings', 'navigation', { items: updated });
    showToast('Navigation updated');
  };

  const updateSEO = async (updated: Partial<SEOConfig>) => {
    const next = { ...seo, ...updated };
    setSEO(next);
    await firestoreService.saveDocument('siteSettings', 'seo', next);
    showToast('SEO settings saved');
  };

  const updateYouTube = async (updated: Partial<YouTubeSettings>) => {
    const next = { ...youtube, ...updated };
    setYouTube(next);
    await firestoreService.saveDocument('siteSettings', 'youtube', next);
    showToast('YouTube channel settings updated');
  };

  // CRUD Mutations
  const addSong = async (song: Song) => {
    const next = [song, ...songs];
    setSongs(next);
    await firestoreService.saveDocument('songs', song.id, song);
    showToast(`Song "${song.title}" added`);
  };

  const updateSong = async (song: Song) => {
    setSongs(prev => prev.map(s => s.id === song.id ? song : s));
    if (currentSong?.id === song.id) setCurrentSong(song);
    await firestoreService.saveDocument('songs', song.id, song);
    showToast(`Song "${song.title}" updated`);
  };

  const deleteSong = async (id: string) => {
    const target = songs.find(s => s.id === id);
    setSongs(prev => prev.filter(s => s.id !== id));
    if (currentSong?.id === id) {
      pauseSong();
      setCurrentSong(null);
    }
    await firestoreService.deleteDocument('songs', id);
    showToast(`Song "${target?.title || 'Track'}" deleted`, 'info');
  };

  const toggleFeaturedSong = async (id: string) => {
    const target = songs.find(s => s.id === id);
    if (!target) return;
    const updated = { ...target, featured: !target.featured };
    await updateSong(updated);
  };

  const toggleSongPublish = async (id: string) => {
    const target = songs.find(s => s.id === id);
    if (!target) return;
    const updated = { ...target, published: target.published === false ? true : false };
    await updateSong(updated);
  };

  const addLyric = async (lyric: LyricItem) => {
    setLyrics(prev => [lyric, ...prev]);
    await firestoreService.saveDocument('lyrics', lyric.id, lyric);
    showToast(`Lyrics for "${lyric.title}" added`);
  };

  const updateLyric = async (lyric: LyricItem) => {
    setLyrics(prev => prev.map(l => l.id === lyric.id ? lyric : l));
    await firestoreService.saveDocument('lyrics', lyric.id, lyric);
    showToast(`Lyrics for "${lyric.title}" updated`);
  };

  const deleteLyric = async (id: string) => {
    setLyrics(prev => prev.filter(l => l.id !== id));
    await firestoreService.deleteDocument('lyrics', id);
    showToast('Lyrics deleted', 'info');
  };

  const addGalleryItem = async (item: GalleryItem) => {
    setGallery(prev => [item, ...prev]);
    await firestoreService.saveDocument('gallery', item.id, item);
    showToast(`Image "${item.title}" added to gallery`);
  };

  const updateGalleryItem = async (item: GalleryItem) => {
    setGallery(prev => prev.map(g => g.id === item.id ? item : g));
    await firestoreService.saveDocument('gallery', item.id, item);
    showToast(`Gallery item "${item.title}" updated`);
  };

  const deleteGalleryItem = async (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    await firestoreService.deleteDocument('gallery', id);
    showToast('Gallery image deleted', 'info');
  };

  const addVideo = async (video: VideoItem) => {
    setVideos(prev => [video, ...prev]);
    await firestoreService.saveDocument('videos', video.id, video);
    showToast(`Video "${video.title}" added`);
  };

  const updateVideo = async (video: VideoItem) => {
    setVideos(prev => prev.map(v => v.id === video.id ? video : v));
    await firestoreService.saveDocument('videos', video.id, video);
    showToast(`Video "${video.title}" updated`);
  };

  const deleteVideo = async (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    await firestoreService.deleteDocument('videos', id);
    showToast('Video deleted', 'info');
  };

  const addProject = async (project: ProjectItem) => {
    setProjects(prev => [project, ...prev]);
    await firestoreService.saveDocument('projects', project.id, project);
    showToast(`Project "${project.title}" added`);
  };

  const updateProject = async (project: ProjectItem) => {
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    await firestoreService.saveDocument('projects', project.id, project);
    showToast(`Project "${project.title}" updated`);
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    await firestoreService.deleteDocument('projects', id);
    showToast('Project deleted', 'info');
  };

  const addBook = async (book: BookItem) => {
    setBooks(prev => [book, ...prev]);
    await firestoreService.saveDocument('books', book.id, book);
    showToast(`Book "${book.title}" added`);
  };

  const updateBook = async (book: BookItem) => {
    setBooks(prev => prev.map(b => b.id === book.id ? book : b));
    await firestoreService.saveDocument('books', book.id, book);
    showToast(`Book "${book.title}" updated`);
  };

  const deleteBook = async (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    await firestoreService.deleteDocument('books', id);
    showToast('Book deleted', 'info');
  };

  const addTimelineItem = async (item: TimelineItem) => {
    setTimeline(prev => [...prev, item]);
    await firestoreService.saveDocument('timeline', item.id, item);
    showToast('Timeline event added');
  };

  const updateTimelineItem = async (item: TimelineItem) => {
    setTimeline(prev => prev.map(t => t.id === item.id ? item : t));
    await firestoreService.saveDocument('timeline', item.id, item);
    showToast('Timeline event updated');
  };

  const deleteTimelineItem = async (id: string) => {
    setTimeline(prev => prev.filter(t => t.id !== id));
    await firestoreService.deleteDocument('timeline', id);
    showToast('Timeline event deleted', 'info');
  };

  const addSocialLink = async (link: SocialLink) => {
    setSocialLinks(prev => [...prev, link]);
    await firestoreService.saveDocument('socialLinks', link.id, link);
    showToast(`Social link "${link.platform}" added`);
  };

  const updateSocialLink = async (link: SocialLink) => {
    setSocialLinks(prev => prev.map(s => s.id === link.id ? link : s));
    await firestoreService.saveDocument('socialLinks', link.id, link);
    showToast(`Social link "${link.platform}" updated`);
  };

  const deleteSocialLink = async (id: string) => {
    setSocialLinks(prev => prev.filter(s => s.id !== id));
    await firestoreService.deleteDocument('socialLinks', id);
    showToast('Social link deleted', 'info');
  };

  const submitContactMessage = async (msg: Omit<ContactMessage, 'id' | 'date' | 'read' | 'replied'>) => {
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      replied: false
    };
    setMessages(prev => [newMessage, ...prev]);
    await firestoreService.saveDocument('messages', newMessage.id, newMessage);
    showToast('Your message has been delivered directly to Arjun.');
  };

  const markMessageRead = async (id: string) => {
    const target = messages.find(m => m.id === id);
    if (!target) return;
    const updated = { ...target, read: true };
    setMessages(prev => prev.map(m => m.id === id ? updated : m));
    await firestoreService.saveDocument('messages', id, updated);
  };

  const deleteMessage = async (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    await firestoreService.deleteDocument('messages', id);
    showToast('Message deleted', 'info');
  };

  // Bulk Operations
  const bulkDeleteItems = async (type: 'songs' | 'gallery' | 'videos' | 'projects' | 'lyrics', ids: string[]) => {
    const idSet = new Set(ids);
    if (type === 'songs') setSongs(prev => prev.filter(s => !idSet.has(s.id)));
    if (type === 'gallery') setGallery(prev => prev.filter(g => !idSet.has(g.id)));
    if (type === 'videos') setVideos(prev => prev.filter(v => !idSet.has(v.id)));
    if (type === 'projects') setProjects(prev => prev.filter(p => !idSet.has(p.id)));
    if (type === 'lyrics') setLyrics(prev => prev.filter(l => !idSet.has(l.id)));
    for (const id of ids) {
      await firestoreService.deleteDocument(type, id);
    }
    showToast(`Deleted ${ids.length} items permanently`, 'info');
  };

  const bulkTogglePublish = async (type: 'songs' | 'gallery' | 'videos' | 'projects' | 'lyrics', ids: string[], publish: boolean) => {
    const idSet = new Set(ids);
    if (type === 'songs') {
      setSongs(prev => prev.map(s => idSet.has(s.id) ? { ...s, published: publish } : s));
    } else if (type === 'gallery') {
      setGallery(prev => prev.map(g => idSet.has(g.id) ? { ...g, published: publish } : g));
    } else if (type === 'videos') {
      setVideos(prev => prev.map(v => idSet.has(v.id) ? { ...v, published: publish } : v));
    } else if (type === 'projects') {
      setProjects(prev => prev.map(p => idSet.has(p.id) ? { ...p, published: publish } : p));
    }
    showToast(`Updated ${ids.length} items to ${publish ? 'Published' : 'Draft'}`);
  };

  const bulkToggleFeatured = async (type: 'songs' | 'gallery' | 'videos' | 'projects' | 'lyrics', ids: string[], featured: boolean) => {
    const idSet = new Set(ids);
    if (type === 'songs') {
      setSongs(prev => prev.map(s => idSet.has(s.id) ? { ...s, featured } : s));
    } else if (type === 'gallery') {
      setGallery(prev => prev.map(g => idSet.has(g.id) ? { ...g, featured } : g));
    } else if (type === 'videos') {
      setVideos(prev => prev.map(v => idSet.has(v.id) ? { ...v, featured } : v));
    } else if (type === 'projects') {
      setProjects(prev => prev.map(p => idSet.has(p.id) ? { ...p, featured } : p));
    }
    showToast(`Updated ${ids.length} items to ${featured ? 'Featured' : 'Standard'}`);
  };

  // Export JSON backup
  const exportWebsiteData = (): string => {
    const backup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      branding,
      homepage,
      navigation,
      appearance,
      seo,
      youtube,
      songs,
      lyrics,
      gallery,
      videos,
      projects,
      books,
      timeline,
      socialLinks
    };
    return JSON.stringify(backup, null, 2);
  };

  // Import JSON backup
  const importWebsiteData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.profile) setProfile(data.profile);
      if (data.branding) setBranding(data.branding);
      if (data.homepage) setHomepage(data.homepage);
      if (data.navigation) setNavigation(data.navigation);
      if (data.appearance) setAppearance(data.appearance);
      if (data.seo) setSEO(data.seo);
      if (data.youtube) setYouTube(data.youtube);
      if (data.songs) setSongs(data.songs);
      if (data.lyrics) setLyrics(data.lyrics);
      if (data.gallery) setGallery(data.gallery);
      if (data.videos) setVideos(data.videos);
      if (data.projects) setProjects(data.projects);
      if (data.books) setBooks(data.books);
      if (data.timeline) setTimeline(data.timeline);
      if (data.socialLinks) setSocialLinks(data.socialLinks);
      showToast('Website content imported successfully!');
      return true;
    } catch (err) {
      console.error('Failed to import backup JSON:', err);
      showToast('Invalid JSON backup file', 'error');
      return false;
    }
  };

  const resetAllData = () => {
    setProfile(initialProfile);
    setBranding(initialBranding);
    setHomepage(initialHomepage);
    setNavigation(initialNavigation);
    setAppearance(initialAppearance);
    setSEO(initialSEO);
    setYouTube(initialYouTube);
    setSongs(initialSongs);
    setLyrics(initialLyrics);
    setGallery(initialGallery);
    setVideos(initialVideos);
    setProjects(initialProjects);
    setBooks(initialBooks);
    setTimeline(initialTimeline);
    setSocialLinks(initialSocialLinks);
    setMessages([]);
    setAnalytics(initialAnalytics);
    localStorage.clear();
    showToast('Reset all data to default templates', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedSongId,
        setSelectedSongId,
        selectedProjectId,
        setSelectedProjectId,
        selectedLyricId,
        setSelectedLyricId,
        selectedBookId,
        setSelectedBookId,

        profile,
        songs,
        lyrics,
        gallery,
        videos,
        projects,
        books,
        timeline,
        socialLinks,
        messages,
        analytics,

        branding,
        homepage,
        navigation,
        appearance,
        seo,
        youtube,

        currentSong,
        isPlaying,
        playbackTime,
        duration,
        volume,
        isMuted,
        isLyricsExpanded,
        setIsLyricsExpanded,
        playerMode,
        setPlayerMode,
        spotifyPlayerSize,
        setSpotifyPlayerSize,
        isFullScreenPlayerOpen,
        activePlayerView,
        setActivePlayerView,
        openFullScreenPlayer,
        closeFullScreenPlayer,
        isShuffle,
        setIsShuffle,
        isLoop,
        setIsLoop,
        playbackSpeed,
        setPlaybackSpeed,
        sleepTimerMinutes,
        setSleepTimerMinutes,
        playSong,
        togglePlay,
        pauseSong,
        resumeSong,
        closePlayer,
        seekSong,
        nextSong,
        prevSong,
        changeVolume,
        toggleMute,

        isMenuOpen,
        setIsMenuOpen,
        openMenu,
        closeMenu,
        toggleMenu,

        isSearchOpen,
        openSearch,
        closeSearch,
        searchQuery,
        setSearchQuery,

        shareData,
        openShare,
        closeShare,

        lightboxItem,
        openLightbox,
        closeLightbox,
        nextLightbox,
        prevLightbox,

        activeVideo,
        openVideoPlayer,
        closeVideoPlayer,

        authUser,
        isOwner,
        authLoading,
        authError,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        openSignIn,
        openSignUp,
        logout,
        setClerkSession,

        theme,
        setTheme,
        updateAppearance,

        toast,
        showToast,

        updateProfile,
        updateBranding,
        updateHomepage,
        updateNavigation,
        updateSEO,
        updateYouTube,

        addSong,
        updateSong,
        deleteSong,
        toggleFeaturedSong,
        toggleSongPublish,

        addLyric,
        updateLyric,
        deleteLyric,

        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,

        addVideo,
        updateVideo,
        deleteVideo,

        addProject,
        updateProject,
        deleteProject,

        addBook,
        updateBook,
        deleteBook,

        addTimelineItem,
        updateTimelineItem,
        deleteTimelineItem,

        addSocialLink,
        updateSocialLink,
        deleteSocialLink,

        submitContactMessage,
        markMessageRead,
        deleteMessage,

        recordSongPlay,
        recordProjectClick,
        recordSearchQuery,
        recordInteraction,
        resetAnalytics,

        isCropperOpen,
        cropperOptions,
        openCropper,
        closeCropper,

        bulkDeleteItems,
        bulkTogglePublish,
        bulkToggleFeatured,

        exportWebsiteData,
        importWebsiteData,
        resetAllData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
