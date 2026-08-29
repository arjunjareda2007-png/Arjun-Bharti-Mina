import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { 
  Play, 
  Pause, 
  ArrowRight, 
  Sparkles, 
  Music2, 
  Globe, 
  Video, 
  BookOpen, 
  Image, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Disc,
  Flame,
  Radio,
  Share2,
  Headphones
} from 'lucide-react';
import { calculateAge } from '../../utils/helpers';
import { hapticLight, hapticBeat, hapticSelection, hapticMedium } from '../../utils/haptics';
import { CountUp } from '../motion/CountUp';
import { TiltCard } from '../motion/TiltCard';
import { 
  CINEMATIC_EASE, 
  SMOOTH_EASE, 
  sectionReveal, 
  cardStaggerContainer, 
  cardStaggerItem 
} from '../../utils/motion';

export const HomeView: React.FC = () => {
  const { 
    profile, 
    songs, 
    projects, 
    videos, 
    books, 
    gallery, 
    lyrics, 
    setCurrentTab, 
    setSelectedSongId, 
    setSelectedProjectId, 
    playSong, 
    currentSong, 
    isPlaying, 
    togglePlay,
    openVideoPlayer,
    openLightbox
  } = useStore();

  const featuredSongs = songs.filter(s => s.featured);
  const featuredProjects = projects.filter(p => p.featured);
  const featuredVideos = videos.filter(v => v.featured);
  const featuredPhotos = gallery.filter(g => g.featured);

  // Creative statistics
  const stats = [
    { label: 'Original Songs', count: songs.length, icon: <Music2 className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />, tab: 'music' },
    { label: 'Digital Projects', count: projects.length, icon: <Globe className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />, tab: 'projects' },
    { label: 'Videos & BTS', count: videos.length, icon: <Video className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />, tab: 'videos' },
    { label: 'Authored Books', count: books.length, icon: <BookOpen className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />, tab: 'books' },
    { label: 'Photo Archive', count: gallery.length, icon: <Image className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />, tab: 'gallery' },
    { label: 'Lyrics Vault', count: lyrics.length, icon: <FileText className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />, tab: 'lyrics' },
  ];

  return (
    <div id="home-view" className="space-y-16 sm:space-y-24">
      
      {/* 1. EDITORIAL HERO SECTION WITH CINEMATIC MOTION */}
      <section id="hero-section" className="relative pt-2 sm:pt-4 pb-8 overflow-hidden space-y-8">
        {/* Subtle Ambient Background Motion Glow */}
        <motion.div 
          animate={{ scale: [1, 1.08, 1], opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 left-1/4 w-96 h-96 bg-neutral-900 rounded-full blur-3xl pointer-events-none -z-10" 
        />
        <motion.div 
          animate={{ scale: [1, 1.12, 1], opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 right-10 w-80 h-80 bg-neutral-700 rounded-full blur-3xl pointer-events-none -z-10" 
        />

        {/* Panoramic Hero Banner Card with Staggered Entrance & Zoom */}
        <motion.div 
          id="hero-banner-container"
          initial={{ opacity: 0, y: 18, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-200/80 dark:border-neutral-800 bg-neutral-950 group"
        >
          {/* Banner Image with subtle initial zoom settlement */}
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 relative overflow-hidden">
            <motion.img 
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.3, ease: CINEMATIC_EASE }}
              src={profile.heroImage || profile.profileImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop'} 
              alt="Arjun Bharti Mina Hero Banner"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop';
              }}
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-1000"
            />
            {/* Dynamic Contrast Gradients */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/60" />
          </div>

          {/* Banner Overlaid Content with Staggered Entrance */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="space-y-1.5 max-w-xl">
              <motion.div 
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: CINEMATIC_EASE, delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <span className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                  <span>📍</span>
                  <span>Jaipur, Rajasthan</span>
                </span>
                {isPlaying && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 text-[10px] font-mono flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Now Playing
                  </span>
                )}
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: CINEMATIC_EASE, delay: 0.45 }}
                className="text-xs sm:text-sm font-medium text-neutral-200 italic line-clamp-1"
              >
                "{profile.featuredQuote || 'Art is the blueprint of the soul, and rhythm is its foundation.'}"
              </motion.p>
            </div>

            {/* Quick Live Stats & Audio Wave */}
            <div className="flex items-center gap-3">
              {/* Dynamic Animated Soundwave Pill */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700/60 text-xs font-mono"
              >
                <div className="flex items-center gap-0.5 h-3">
                  {[40, 90, 60, 100, 50, 80].map((height, i) => (
                    <motion.span 
                      key={i}
                      animate={isPlaying ? { height: ['20%', `${height}%`, '20%'] } : { height: '30%' }}
                      transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-0.5 bg-white rounded-full inline-block"
                    />
                  ))}
                </div>
                <span className="text-neutral-200">{profile.stats?.totalStreams || '380K+ Streams'}</span>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: CINEMATIC_EASE, delay: 0.65 }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  hapticLight();
                  setCurrentTab('music');
                }}
                className="button-sheen px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Explore Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Hero Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">
          
          {/* Left Text & Bio */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Charismatic Masked Main Headline & Subtitle Reveal */}
            <div className="space-y-3">
              <div>
                <div className="overflow-hidden py-1">
                  <motion.h1 
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.85, ease: CINEMATIC_EASE, delay: 0.15 }}
                    className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.06]"
                  >
                    Arjun Bharti Mina
                  </motion.h1>
                </div>
                
                <div className="overflow-hidden">
                  <motion.p 
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.75, ease: CINEMATIC_EASE, delay: 0.3 }}
                    className="text-neutral-600 dark:text-neutral-400 font-display font-semibold text-lg sm:text-xl lg:text-2xl mt-1.5 tracking-tight flex items-center gap-2"
                  >
                    <span>Independent Artist & Creative Technologist</span>
                  </motion.p>
                </div>
              </div>

              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: CINEMATIC_EASE, delay: 0.45 }}
                className="text-sm sm:text-base font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-2 pt-1"
              >
                <span className="w-5 h-[2px] bg-neutral-900 dark:bg-neutral-100 inline-block shrink-0" />
                <span>{profile.tagline || 'Rapper, Writer, Civil Engineer & Tech Architect'}</span>
              </motion.p>
            </div>

            {/* Short Introduction */}
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: CINEMATIC_EASE, delay: 0.55 }}
              className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed"
            >
              {profile.bio} Graduating in Civil Engineering from SKIT Jaipur (2022–2026), balancing engineering calculations by day with underground Desi Hip-Hop beats and creative web ecosystems by night.
            </motion.p>

            {/* Primary Action Buttons with Motion */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: CINEMATIC_EASE, delay: 0.65 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <motion.button
                id="hero-explore-work-btn"
                whileHover={{ scale: 1.025, y: -1.5 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  hapticLight();
                  setCurrentTab('music');
                }}
                className="button-sheen px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer group"
              >
                <Headphones className="w-4 h-4" />
                <span>Listen To Music Vault</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                id="hero-about-me-btn"
                whileHover={{ scale: 1.025, y: -1.5 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  hapticLight();
                  setCurrentTab('about');
                }}
                className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white text-neutral-900 dark:text-neutral-100 font-semibold text-xs sm:text-sm bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
              >
                About Arjun
              </motion.button>
            </motion.div>

            {/* Quick Profile Meta */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-600 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800"
            >
              <span className="flex items-center gap-1.5">📍 <strong className="text-neutral-900 dark:text-neutral-100">{profile.location}</strong></span>
              <span className="flex items-center gap-1.5">🎓 <strong className="text-neutral-900 dark:text-neutral-100">SKIT Jaipur ({profile.education.period})</strong></span>
              <span className="flex items-center gap-1.5">🎂 <strong className="text-neutral-900 dark:text-neutral-100">Age {calculateAge(profile.dob)}</strong></span>
            </motion.div>

          </div>

          {/* Right Portrait & Latest Release Spotlight with Motion Disc & 3D Tilt */}
          <div className="lg:col-span-5 relative">
            <TiltCard maxTilt={6} className="mx-auto max-w-sm sm:max-w-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.75, ease: CINEMATIC_EASE, delay: 0.2 }}
                className="relative rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 group"
              >
                <motion.img 
                  initial={{ scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.1, ease: CINEMATIC_EASE }}
                  src={profile.profileImage} 
                  alt={profile.name} 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop';
                  }}
                  className="w-full aspect-[4/5] object-cover group-hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>

                {/* Floating Release Card on Portrait */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-neutral-950/90 backdrop-blur-lg border border-neutral-800 text-white flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rotating Vinyl Disc */}
                    <motion.div 
                      animate={isPlaying && currentSong?.slug === 'rutba' ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shrink-0 shadow-md relative overflow-hidden"
                    >
                      <Disc className="w-8 h-8 text-neutral-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white absolute" />
                    </motion.div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[10px] font-mono uppercase text-neutral-300 font-bold tracking-wider">
                          Featured Anthem
                        </span>
                      </div>
                      <h4 className="text-sm font-black truncate mt-0.5">RUTBA (2026)</h4>
                      <p className="text-[11px] text-neutral-400 truncate">Street Rap Anthem • ABM Studio’s</p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      hapticBeat();
                      const rutba = songs.find(s => s.slug === 'rutba') || songs[0];
                      if (rutba) {
                        if (currentSong?.id === rutba.id && isPlaying) {
                          togglePlay();
                        } else {
                          playSong(rutba);
                        }
                      }
                    }}
                    className="w-11 h-11 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 flex items-center justify-center flex-shrink-0 shadow-lg font-bold cursor-pointer transition-colors"
                    title="Play Anthem"
                  >
                    {currentSong?.slug === 'rutba' && isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </TiltCard>
          </div>

        </div>
      </section>

      {/* 2. DYNAMIC CREATIVE STATISTICS WITH COUNT-UP & STAGGER */}
      <motion.section 
        id="creative-statistics"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={cardStaggerContainer}
        className="border-y border-neutral-200 dark:border-neutral-800 py-6 sm:py-8 bg-neutral-50/70 dark:bg-neutral-900/30"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <motion.button
              key={idx}
              variants={cardStaggerItem}
              whileHover={{ y: -3.5, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                hapticSelection();
                setCurrentTab(stat.tab as any);
              }}
              className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  {stat.icon}
                </span>
                <span className="text-xl sm:text-2xl font-display font-extrabold text-neutral-950 dark:text-neutral-50 font-mono">
                  <CountUp end={stat.count} padZero duration={1.2} />
                </span>
              </div>
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-amber-500 transition-colors">
                {stat.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* 3. FEATURED WORK (CURATED HIGHLIGHTS) WITH MOTION */}
      <motion.section 
        id="featured-work-section" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={sectionReveal}
        className="space-y-6"
      >
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold block">
              Curated Highlights
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-950 dark:text-white">
              Featured Work
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              hapticLight();
              setCurrentTab('music');
            }}
            className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All Releases</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: RUTBA Featured Song */}
          {featuredSongs[0] && (
            <TiltCard maxTilt={4} className="md:col-span-2">
              <motion.div 
                whileHover={{ y: -3 }}
                className="group relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 min-h-[320px] flex flex-col justify-end p-6 sm:p-8 cursor-pointer shadow-md h-full"
                onClick={() => {
                  hapticSelection();
                  setSelectedSongId(featuredSongs[0].id);
                  setCurrentTab('music');
                }}
              >
                <img 
                  src={featuredSongs[0].cover} 
                  alt={featuredSongs[0].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>

                <div className="relative z-10 space-y-3 text-white">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-white text-neutral-950">
                      Featured Anthem
                    </span>
                    <span className="text-xs font-mono text-neutral-300">{featuredSongs[0].year}</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight">
                    {featuredSongs[0].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 max-w-lg line-clamp-2">
                    {featuredSongs[0].description}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        hapticBeat();
                        playSong(featuredSongs[0]);
                      }}
                      className="button-sheen px-4 py-2 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 font-semibold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Audio Preview</span>
                    </motion.button>
                    <span className="text-xs text-neutral-400 font-mono">
                      {featuredSongs[0].genre}
                    </span>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          )}

          {/* Card 2: Aether Gallery Digital Project */}
          {featuredProjects[0] && (
            <TiltCard maxTilt={4}>
              <motion.div 
                whileHover={{ y: -3 }}
                className="group relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 min-h-[320px] flex flex-col justify-end p-6 cursor-pointer shadow-md h-full"
                onClick={() => {
                  hapticSelection();
                  setSelectedProjectId(featuredProjects[0].id);
                  setCurrentTab('projects');
                }}
              >
                <img 
                  src={featuredProjects[0].thumbnail} 
                  alt={featuredProjects[0].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent"></div>

                <div className="relative z-10 space-y-2 text-white">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-white/20 text-white border border-white/30 backdrop-blur-md">
                    Digital Project
                  </span>
                  <h3 className="text-lg font-bold">
                    {featuredProjects[0].title}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-2">
                    {featuredProjects[0].shortDescription}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-neutral-200 font-mono">
                    <span>Explore Project</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          )}

        </div>
      </motion.section>

      {/* 4. MUSIC LIBRARY SPOTLIGHT WITH ANIMATED PLAY BUTTONS */}
      <motion.section 
        id="music-spotlight" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={sectionReveal}
        className="space-y-6"
      >
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold block">
              Discography & Tracks
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-950 dark:text-white">
              Recent Releases
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              hapticLight();
              setCurrentTab('music');
            }}
            className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>All Songs ({songs.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {songs.slice(0, 3).map((song) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;
            return (
              <motion.div
                key={song.id}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  hapticSelection();
                  setSelectedSongId(song.id);
                  setCurrentTab('music');
                }}
                className="group p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-neutral-950">
                    <img 
                      src={song.cover} 
                      alt={song.title} 
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        hapticBeat();
                        if (isThisPlaying) togglePlay();
                        else playSong(song);
                      }}
                      className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                    >
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </motion.button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                      <span>{song.genre}</span>
                      <span>{song.year}</span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-950 dark:text-neutral-50 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
                      {song.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-mono">{song.duration}</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-medium group-hover:underline flex items-center gap-1">
                    Details & Lyrics <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* 5. YOUTUBE & VISUAL STORIES */}
      {featuredVideos[0] && (
        <motion.section 
          id="youtube-spotlight" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={sectionReveal}
          className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-red-500 font-semibold block">
                YouTube Channel Spotlight
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold">
                Visual Stories & Studio BTS
              </h2>
            </div>
            <motion.a
              href="https://youtube.com/@arjunbhartimina"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => hapticLight()}
              className="button-sheen px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-2 self-start transition-colors"
            >
              <span>Visit YouTube Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <motion.div 
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="lg:col-span-7 relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-xl bg-neutral-900 border border-neutral-800"
              onClick={() => {
                hapticBeat();
                openVideoPlayer(featuredVideos[0]);
              }}
            >
              <img 
                src={featuredVideos[0].thumbnail} 
                alt={featuredVideos[0].title} 
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.15 }}
                  className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl transition-transform"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </motion.div>
              </div>
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white">
                {featuredVideos[0].duration}
              </span>
            </motion.div>

            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-mono uppercase text-neutral-400">
                {featuredVideos[0].category} • {featuredVideos[0].date}
              </span>
              <h3 className="text-xl font-bold">{featuredVideos[0].title}</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {featuredVideos[0].description}
              </p>
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    hapticMedium();
                    openVideoPlayer(featuredVideos[0]);
                  }}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
                >
                  Watch in Player
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* 6. BOOKS & PUBLICATIONS PREVIEW */}
      {books.length > 0 && (
        <motion.section 
          id="books-preview-section" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={sectionReveal}
          className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-6"
        >
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold block">
                Publications & Literature
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-950 dark:text-white">
                Books by Arjun Bharti Mina
              </h2>
            </div>
            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                hapticLight();
                setCurrentTab('books');
              }}
              className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Explore Books</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {books.slice(0, 2).map((book) => (
              <motion.div
                key={book.id}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  hapticSelection();
                  setCurrentTab('books');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start"
              >
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-24 sm:w-28 rounded-lg object-cover shadow-md flex-shrink-0"
                />
                <div className="space-y-2 min-w-0">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">
                    {book.publicationYear} • {book.pages} Pages
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-950 dark:text-white line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {book.description}
                  </p>
                  <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1 pt-1">
                    <span>Read Synopsis & Play Store</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 7. CONNECT BANNER */}
      <motion.section 
        id="connect-banner" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={sectionReveal}
        className="p-8 sm:p-12 rounded-3xl bg-neutral-950 text-white border border-neutral-800 text-center space-y-4 shadow-xl"
      >
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold">
          Let’s Collaborate & Create
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Whether you’re looking to collaborate on an Indian hip-hop record, discuss civil engineering calculations, or explore creative digital media — reach out directly.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.035, y: -1.5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              hapticMedium();
              setCurrentTab('contact');
            }}
            className="button-sheen px-6 py-3 rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs sm:text-sm transition-colors shadow-md cursor-pointer"
          >
            Send a Message
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.035, y: -1.5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              hapticLight();
              setCurrentTab('social');
            }}
            className="px-6 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Find Me Online
          </motion.button>
        </div>
      </motion.section>

    </div>
  );
};
