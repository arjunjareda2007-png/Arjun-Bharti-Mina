import React from 'react';
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
  Share2
} from 'lucide-react';
import { calculateAge } from '../../utils/helpers';

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
    { label: 'Original Songs', count: songs.length, icon: <Music2 className="w-4 h-4 text-amber-500" />, tab: 'music' },
    { label: 'Digital Projects', count: projects.length, icon: <Globe className="w-4 h-4 text-emerald-500" />, tab: 'projects' },
    { label: 'Videos & BTS', count: videos.length, icon: <Video className="w-4 h-4 text-red-500" />, tab: 'videos' },
    { label: 'Authored Books', count: books.length, icon: <BookOpen className="w-4 h-4 text-amber-600" />, tab: 'books' },
    { label: 'Photo Archive', count: gallery.length, icon: <Image className="w-4 h-4 text-purple-500" />, tab: 'gallery' },
    { label: 'Lyrics Vault', count: lyrics.length, icon: <FileText className="w-4 h-4 text-blue-500" />, tab: 'lyrics' },
  ];

  return (
    <div id="home-view" className="space-y-16 sm:space-y-24">
      
      {/* 1. EDITORIAL HERO SECTION */}
      <section id="hero-section" className="relative pt-6 sm:pt-12 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text & Bio */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                {profile.subTagline}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.08]">
                {profile.name}
              </h1>
              <p className="text-sm sm:text-base font-mono text-amber-600 dark:text-amber-400 font-medium tracking-tight">
                {profile.tagline}
              </p>
            </div>

            {/* Short Introduction */}
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
              {profile.bio} Graduating in Civil Engineering from SKIT Jaipur (2022–2026), balancing engineering calculations by day with underground Desi Hip-Hop beats and creative web ecosystems by night.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-work-btn"
                onClick={() => setCurrentTab('music')}
                className="px-6 py-3 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span>Explore Music & Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-about-me-btn"
                onClick={() => setCurrentTab('about')}
                className="px-5 py-3 rounded-full border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium text-xs sm:text-sm bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm transition-all"
              >
                About Arjun
              </button>
            </div>

            {/* Quick Profile Meta */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500 border-t border-neutral-200 dark:border-neutral-800/80">
              <span>📍 {profile.location}</span>
              <span>🎓 SKIT Jaipur ({profile.education.period})</span>
              <span>🎂 Age {calculateAge(profile.dob)}</span>
            </div>

          </div>

          {/* Right Portrait & Latest Release Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-900 group">
              <img 
                src={profile.profileImage} 
                alt={profile.name} 
                className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"></div>

              {/* Floating Badge on Portrait */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block">
                    Latest Anthem
                  </span>
                  <h4 className="text-sm font-bold truncate">RUTBA (2026)</h4>
                  <p className="text-[11px] text-neutral-400">Street Rap Anthem • ABM Studio’s</p>
                </div>
                
                <button
                  onClick={() => {
                    const rutba = songs.find(s => s.slug === 'rutba') || songs[0];
                    if (rutba) {
                      if (currentSong?.id === rutba.id && isPlaying) {
                        togglePlay();
                      } else {
                        playSong(rutba);
                      }
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-110 active:scale-95 transition-all"
                  title="Play Anthem"
                >
                  {currentSong?.slug === 'rutba' && isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. DYNAMIC CREATIVE STATISTICS */}
      <section id="creative-statistics" className="border-y border-neutral-200 dark:border-neutral-800/80 py-6 sm:py-8 bg-neutral-50/50 dark:bg-neutral-950/40">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentTab(stat.tab as any)}
              className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-amber-500/50 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </span>
                <span className="text-xl sm:text-2xl font-display font-extrabold text-neutral-900 dark:text-neutral-100">
                  {stat.count < 10 ? `0${stat.count}` : stat.count}
                </span>
              </div>
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-amber-500 transition-colors">
                {stat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FEATURED WORK (CURATED HIGHLIGHTS) */}
      <section id="featured-work-section" className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
              Curated Highlights
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
              Featured Work
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('music')}
            className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-amber-500 flex items-center gap-1 transition-colors"
          >
            <span>View All Releases</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: RUTBA Featured Song */}
          {featuredSongs[0] && (
            <div 
              className="md:col-span-2 group relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 min-h-[320px] flex flex-col justify-end p-6 sm:p-8 cursor-pointer shadow-lg"
              onClick={() => {
                setSelectedSongId(featuredSongs[0].id);
                setCurrentTab('music');
              }}
            >
              <img 
                src={featuredSongs[0].cover} 
                alt={featuredSongs[0].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>

              <div className="relative z-10 space-y-3 text-white">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-amber-500 text-neutral-950">
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(featuredSongs[0]);
                    }}
                    className="px-4 py-2 rounded-full bg-white text-neutral-950 hover:bg-amber-400 font-semibold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Audio Preview</span>
                  </button>
                  <span className="text-xs text-neutral-400 font-mono">
                    {featuredSongs[0].genre}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Aether Gallery Digital Project */}
          {featuredProjects[0] && (
            <div 
              className="group relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 min-h-[320px] flex flex-col justify-end p-6 cursor-pointer shadow-lg"
              onClick={() => {
                setSelectedProjectId(featuredProjects[0].id);
                setCurrentTab('projects');
              }}
            >
              <img 
                src={featuredProjects[0].thumbnail} 
                alt={featuredProjects[0].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent"></div>

              <div className="relative z-10 space-y-2 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Digital Project
                </span>
                <h3 className="text-lg font-bold">
                  {featuredProjects[0].title}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-2">
                  {featuredProjects[0].shortDescription}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs text-amber-400 font-mono">
                  <span>Explore Project</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 4. MUSIC LIBRARY SPOTLIGHT */}
      <section id="music-spotlight" className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
              Discography & Tracks
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
              Recent Releases
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('music')}
            className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-amber-500 flex items-center gap-1 transition-colors"
          >
            <span>All Songs ({songs.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {songs.slice(0, 3).map((song) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;
            return (
              <div
                key={song.id}
                onClick={() => {
                  setSelectedSongId(song.id);
                  setCurrentTab('music');
                }}
                className="group p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-amber-500/50 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-neutral-950">
                    <img 
                      src={song.cover} 
                      alt={song.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isThisPlaying) togglePlay();
                        else playSong(song);
                      }}
                      className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                    >
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                      <span>{song.genre}</span>
                      <span>{song.year}</span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                      {song.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-mono">{song.duration}</span>
                  <span className="text-amber-500 font-medium group-hover:underline flex items-center gap-1">
                    Details & Lyrics <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. YOUTUBE & VISUAL STORIES */}
      {featuredVideos[0] && (
        <section id="youtube-spotlight" className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-red-500 font-semibold block">
                YouTube Channel Spotlight
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold">
                Visual Stories & Studio BTS
              </h2>
            </div>
            <a
              href="https://youtube.com/@arjunbhartimina"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-2 self-start transition-colors"
            >
              <span>Visit YouTube Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div 
              className="lg:col-span-7 relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-xl bg-neutral-900 border border-neutral-800"
              onClick={() => openVideoPlayer(featuredVideos[0])}
            >
              <img 
                src={featuredVideos[0].thumbnail} 
                alt={featuredVideos[0].title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white">
                {featuredVideos[0].duration}
              </span>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-mono uppercase text-neutral-400">
                {featuredVideos[0].category} • {featuredVideos[0].date}
              </span>
              <h3 className="text-xl font-bold">{featuredVideos[0].title}</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {featuredVideos[0].description}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => openVideoPlayer(featuredVideos[0])}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
                >
                  Watch in Player
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. BOOKS & PUBLICATIONS PREVIEW */}
      {books.length > 0 && (
        <section id="books-preview-section" className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
                Publications & Literature
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                Books by Arjun Bharti Mina
              </h2>
            </div>
            <button
              onClick={() => setCurrentTab('books')}
              className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-amber-500 flex items-center gap-1 transition-colors"
            >
              <span>Explore Books</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {books.slice(0, 2).map((book) => (
              <div
                key={book.id}
                onClick={() => setCurrentTab('books')}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/40 cursor-pointer shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start"
              >
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-24 sm:w-28 rounded-lg object-cover shadow-md flex-shrink-0"
                />
                <div className="space-y-2 min-w-0">
                  <span className="text-[10px] font-mono uppercase text-amber-500 font-semibold">
                    {book.publicationYear} • {book.pages} Pages
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {book.description}
                  </p>
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-1">
                    <span>Read Synopsis & Play Store</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. CONNECT BANNER */}
      <section id="connect-banner" className="p-8 sm:p-12 rounded-3xl bg-neutral-900 dark:bg-neutral-900/90 text-white border border-neutral-800 text-center space-y-4">
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold">
          Let’s Collaborate & Create
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Whether you’re looking to collaborate on an Indian hip-hop record, discuss civil engineering calculations, or explore creative digital media — reach out directly.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setCurrentTab('contact')}
            className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs sm:text-sm transition-colors shadow-lg"
          >
            Send a Message
          </button>
          <button
            onClick={() => setCurrentTab('social')}
            className="px-6 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs sm:text-sm transition-colors"
          >
            Find Me Online
          </button>
        </div>
      </section>

    </div>
  );
};
