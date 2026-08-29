export type ContentCategory = 
  | 'music' 
  | 'lyrics' 
  | 'gallery' 
  | 'videos' 
  | 'websites' 
  | 'projects' 
  | 'books' 
  | 'about' 
  | 'social' 
  | 'contact';

export interface UserProfilePrivacy {
  showDOB: boolean;
  showBirthplace: boolean;
  showLocation: boolean;
  showEmail: boolean;
  showWhatsapp: boolean;
  showEducation: boolean;
}

export interface UserProfile {
  name: string;
  shortName: string;
  displayName?: string;
  username?: string;
  brandName: string;
  tagline: string;
  subTagline: string;
  bio: string;
  extendedBio: string[];
  dob: string; // YYYY-MM-DD
  birthplace: string;
  location: string;
  nationality: string;
  education: {
    degree: string;
    field: string;
    college: string;
    period: string;
    status: string;
  };
  creativeRoles: string[];
  interests: string[];
  profileImage: string;
  heroImage: string;
  creatorLogo?: string;
  isVerified?: boolean;
  email: string;
  website?: string;
  whatsappNumber: string;
  featuredQuote: string;
  privacy?: UserProfilePrivacy;
  stats: {
    monthlyListeners?: string;
    totalStreams?: string;
    youtubeSubs?: string;
  };
}

export interface StreamingLinks {
  spotify?: string;
  youtube?: string;
  gaana?: string;
  jiosaavn?: string;
  appleMusic?: string;
  wynk?: string;
  amazonMusic?: string;
}

export interface SongCredits {
  artist: string;
  lyrics: string;
  music: string;
  production: string;
  mixMaster?: string;
  label?: string;
  featuredArtists?: string;
}

export interface Song {
  id: string;
  title: string;
  slug: string;
  cover: string;
  duration: string; // e.g. "3:24"
  releaseDate: string; // e.g. "2026-03-15"
  year: number;
  genre: string;
  language: string;
  artist: string;
  description: string;
  lyrics: string;
  credits: SongCredits;
  streamingLinks: StreamingLinks;
  youtubeEmbedId?: string;
  audioPreviewUrl?: string; // Web audio synth or sample URL
  audioToneSequence?: number[]; // Frequencies for browser audio synthesis
  featured: boolean;
  published?: boolean;
  playCount: number;
  tags?: string[];
  displayOrder?: number;
}

export interface LyricItem {
  id: string;
  songId?: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  language: string;
  cover?: string;
  lyrics: string;
  meaning?: string;
  featured?: boolean;
  published?: boolean;
  songwriterCredits?: string;
  tags?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: 'Personal' | 'Music & Stage' | 'Photography' | 'Events' | 'Behind The Scenes' | 'Artwork' | 'Covers' | 'Travel' | 'Other' | string;
  date: string;
  description: string;
  location?: string;
  tags: string[];
  featured: boolean;
  published?: boolean;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  displayOrder?: number;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  youtubeUrl: string;
  youtubeEmbedId: string;
  category: 'Music Video' | 'Shorts' | 'BTS' | 'Live Performance' | 'Creative' | string;
  duration: string;
  date: string;
  description: string;
  featured: boolean;
  published?: boolean;
  viewsCount?: string;
  tags?: string[];
  displayOrder?: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  thumbnail: string;
  logo?: string;
  shortDescription: string;
  longDescription: string;
  problemSolved?: string;
  features: string[];
  technologies: string[];
  year: number;
  status: 'Completed' | 'Active' | 'In Development' | 'Live' | 'Experimental' | string;
  liveUrl?: string;
  githubUrl?: string;
  screenshots?: string[];
  featured: boolean;
  published?: boolean;
  category: 'Web Application' | 'Creative Tech' | 'Engineering Tool' | 'AI & Media' | string;
  tags?: string[];
  displayOrder?: number;
}

export interface BookItem {
  id: string;
  title: string;
  subtitle?: string;
  cover: string;
  author?: string;
  category?: string;
  genre?: string;
  publisher?: string;
  isbn?: string;
  description: string;
  longSynopsis?: string;
  publicationYear: number;
  publicationDate?: string;
  pages: number;
  language?: string;
  googlePlayUrl?: string;
  playStoreUrl?: string;
  amazonUrl?: string;
  pdfPreviewUrl?: string;
  chapters?: string[];
  chaptersSummary?: string[];
  featured?: boolean;
  published?: boolean;
  displayOrder?: number;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  category: 'Life' | 'Education' | 'Music' | 'Tech' | 'Milestone' | string;
  description: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  category: 'Music Platform' | 'Social Network' | 'Professional' | 'Community' | string;
  description: string;
  iconName: string;
  badge?: string;
  order?: number;
  visible?: boolean;
  featured?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  replied: boolean;
  archived?: boolean;
}

export interface SiteAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  tabViews: Record<string, number>;
  songPlays: Record<string, number>;
  projectClicks: Record<string, number>;
  searches: { query: string; timestamp: string }[];
  dailyActivity: { date: string; views: number; plays: number }[];
  devices: { mobile: number; desktop: number; tablet: number };
  browsers: Record<string, number>;
  interactionEvents: { type: string; label: string; timestamp: string }[];
  lastActiveTimestamp?: string;
}

export interface SiteBranding {
  siteName: string;
  shortName: string;
  logoUrl: string;
  faviconUrl: string;
  siteDescription: string;
  tagline: string;
  browserTitle: string;
  footerText: string;
  copyrightText: string;
}

export interface HomepageSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export interface HomepageConfig {
  heroHeading: string;
  heroSubtitle: string;
  heroIntro: string;
  heroProfileImage: string;
  heroBackgroundImage: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  sections: HomepageSectionConfig[];
  showFeaturedAnthem?: boolean;
  featuredAnthemSongId?: string;
  featuredAnthemTitle?: string;
  featuredAnthemSubtitle?: string;
  featuredAnthemBadge?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  tab: ActiveTab;
  icon: string;
  order: number;
  visible: boolean;
  isCustom?: boolean;
  customUrl?: string;
}

export interface YouTubeSettings {
  channelName: string;
  channelUrl: string;
  channelHandle?: string;
  channelLogo: string;
  channelBanner: string;
  subscribersCount: string;
  totalViews?: string;
  totalVideos?: string;
  description: string;
  featuredVideoId: string;
  lastSyncedAt?: string;
  autoSyncEnabled?: boolean;
  playlistLinks: { title: string; url: string }[];
}

export type ThemeMode = 
  | 'dark'
  | 'light'
  | 'midnight'
  | 'emerald'
  | 'amber'
  | 'nordic'
  | 'cyber'
  | 'sunset'
  | 'cherry'
  | 'blossom'
  | 'system';

export interface AppearanceConfig {
  themeMode: ThemeMode;
  accentColor: 'neutral' | 'slate' | 'amber' | 'emerald' | 'sky' | 'rose' | 'violet' | 'orange';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  cardStyle: 'glass' | 'solid' | 'minimal';
  animationIntensity: 'subtle' | 'normal' | 'expressive';
}

export interface SEOConfig {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  ogImageUrl: string;
  twitterHandle: string;
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  type: 'image' | 'video' | 'cover' | 'poster' | 'screenshot' | 'avatar' | 'banner';
  usedIn: { type: string; title: string; id: string }[];
  dateAdded: string;
  source?: string;
}

export type ActiveTab = 
  | 'home'
  | 'about'
  | 'music'
  | 'lyrics'
  | 'gallery'
  | 'videos'
  | 'projects'
  | 'books'
  | 'social'
  | 'contact'
  | 'admin';

export interface ShareData {
  title: string;
  text: string;
  url: string;
  type?: 'song' | 'image' | 'lyrics' | 'video' | 'project' | 'book' | 'profile' | 'general';
  imageUrl?: string;
  artist?: string;
  genre?: string;
  year?: number;
  lyricsText?: string;
  meaning?: string;
  streamingLinks?: StreamingLinks;
  downloadFilename?: string;
  itemData?: any;
}

export interface AuthUser {
  id: string;
  email: string | null;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  username?: string | null;
}

