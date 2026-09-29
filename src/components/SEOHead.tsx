import React, { useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ActiveTab } from '../types';

const CANONICAL_BASE_URL = 'https://cai.foldedpage.in';

const VALID_PUBLIC_TABS: ActiveTab[] = [
  'home',
  'about',
  'music',
  'lyrics',
  'gallery',
  'videos',
  'projects',
  'books',
  'social',
  'contact',
];

const TAB_SEO_META: Record<
  string,
  { title: string; description: string; keywords: string }
> = {
  home: {
    title: 'Arjun Bharti Mina (ABM) – Music, Lyrics, Books & Portfolio',
    description:
      'Official website, music discography, lyrics archive, books, and creative portfolio of independent artist & civil engineer Arjun Bharti Mina (ABM).',
    keywords:
      'Arjun Bharti Mina, ABM, Arjun Mina, cai.foldedpage.in, Desi Hip Hop, Indian Rapper, Lyricist, Civil Engineer, SKIT Jaipur, Rutba, Jaipur Artist',
  },
  about: {
    title: 'About Arjun Bharti Mina (ABM) – Biography, Education & Journey',
    description:
      'Explore the biography, education at SKIT Jaipur (Civil Engineering), musical journey, and creative timeline of independent Indian artist Arjun Bharti Mina.',
    keywords:
      'About Arjun Bharti Mina, ABM Biography, SKIT Jaipur Civil Engineering, Arjun Mina Age, Jaipur Rapper Bio',
  },
  music: {
    title: 'Music Discography & Audio Vault – Arjun Bharti Mina (ABM)',
    description:
      'Stream original Desi Hip-Hop tracks, melodic rap anthems, and studio releases by Arjun Bharti Mina (ABM) including RUTBA and Jaipur To Delhi.',
    keywords:
      'Arjun Bharti Mina Songs, ABM Music, Rutba Song, Jaipur To Delhi, Khwabeeda, Desi Hip Hop Streaming',
  },
  lyrics: {
    title: 'Official Lyrics Vault & Breakdowns – Arjun Bharti Mina (ABM)',
    description:
      'Read verified song lyrics, poetic verses, wordplay breakdowns, and listen along to original tracks written by Arjun Bharti Mina (ABM).',
    keywords:
      'Arjun Bharti Mina Lyrics, Rutba Lyrics, ABM Song Lyrics, Hindi Rap Lyrics, Marwari Rap Verses',
  },
  gallery: {
    title: 'Photography & Visual Archive – Arjun Bharti Mina (ABM)',
    description:
      'Browse behind-the-scenes studio photography, live stage moments, cover art, and visual storytelling by Arjun Bharti Mina (ABM).',
    keywords:
      'Arjun Bharti Mina Photos, ABM Gallery, Jaipur Artist Photography, Studio BTS Photos',
  },
  videos: {
    title: 'Official Music Videos & Studio Sessions – Arjun Bharti Mina (ABM)',
    description:
      'Watch official music videos, lyrical visuals, live performances, and behind-the-scenes studio sessions by Arjun Bharti Mina (ABM).',
    keywords:
      'Arjun Bharti Mina Videos, ABM YouTube, Rutba Music Video, Desi Hip Hop Videos',
  },
  projects: {
    title: 'Engineering & Digital Tech Projects – Arjun Bharti Mina (ABM)',
    description:
      'Explore interactive web applications, civil engineering tools, and creative technology ecosystems built by Arjun Bharti Mina (ABM).',
    keywords:
      'Arjun Bharti Mina Projects, Civil Engineering Apps, Creative Technologist Portfolio, ABM Web Projects',
  },
  books: {
    title: 'Published Books & Literature – Arjun Bharti Mina (ABM)',
    description:
      'Read and explore published books, poetry collections, and digital literature authored by Arjun Bharti Mina (ABM) on Google Play Books and PDF.',
    keywords:
      'Arjun Bharti Mina Books, ABM Author, Google Play Books Arjun Bharti Mina, Poetry and Literature',
  },
  social: {
    title: 'Connect & Official Streaming Platforms – Arjun Bharti Mina (ABM)',
    description:
      'Connect with Arjun Bharti Mina (ABM) across Spotify, Apple Music, YouTube, Instagram, JioSaavn, Google Play Books, and GitHub.',
    keywords:
      'Arjun Bharti Mina Social Links, ABM Spotify, ABM Instagram, ABM YouTube, Official Artist Links',
  },
  contact: {
    title: 'Contact & Collaborations – Arjun Bharti Mina (ABM)',
    description:
      'Get in touch with Arjun Bharti Mina (ABM) for music collaborations, live bookings, engineering projects, and creative inquiries.',
    keywords:
      'Contact Arjun Bharti Mina, Book ABM, Music Collaboration Jaipur, Contact ABM Studio',
  },
};

function upsertMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, extraAttrs?: Record<string, string>) {
  if (typeof document === 'undefined') return;
  const selector = extraAttrs?.id
    ? `link#${extraAttrs.id}`
    : `link[rel="${rel}"]`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (extraAttrs) {
      Object.entries(extraAttrs).forEach(([k, v]) => el!.setAttribute(k, v));
    }
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function resolveAbsoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return `${CANONICAL_BASE_URL}/logo.png`;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  if (pathOrUrl.startsWith('data:')) {
    return `${CANONICAL_BASE_URL}/logo.png`;
  }
  return `${CANONICAL_BASE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export const SEOHead: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    selectedSongId,
    setSelectedSongId,
    selectedLyricId,
    setSelectedLyricId,
    selectedBookId,
    setSelectedBookId,
    selectedProjectId,
    setSelectedProjectId,
    profile,
    seo,
    branding,
    songs,
    lyrics,
    books,
    projects,
    videos,
    socialLinks,
  } = useStore();

  const initializedUrlRef = useRef(false);

  // 1. Hydrate initial tab / deep-link from URL query params (for Googlebot & Sitemap links)
  useEffect(() => {
    if (initializedUrlRef.current || typeof window === 'undefined') return;
    initializedUrlRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const sectionParam = (params.get('section') || params.get('tab'))?.toLowerCase() as ActiveTab | undefined;
    const songParam = params.get('song');
    const lyricParam = params.get('lyric');
    const bookParam = params.get('book');
    const projectParam = params.get('project');

    if (sectionParam && VALID_PUBLIC_TABS.includes(sectionParam)) {
      setCurrentTab(sectionParam);
    }

    if (songParam) {
      const matchedSong = songs.find(s => s.id === songParam || s.slug === songParam);
      if (matchedSong) {
        setSelectedSongId(matchedSong.id);
      }
    }

    if (lyricParam) {
      const matchedLyric = lyrics.find(l => l.id === lyricParam);
      if (matchedLyric) {
        setSelectedLyricId(matchedLyric.id);
      }
    }

    if (bookParam) {
      const matchedBook = books.find(b => b.id === bookParam);
      if (matchedBook) {
        setSelectedBookId(matchedBook.id);
      }
    }

    if (projectParam) {
      const matchedProject = projects.find(p => p.id === projectParam);
      if (matchedProject) {
        setSelectedProjectId(matchedProject.id);
      }
    }
  }, [songs, lyrics, books, projects, setCurrentTab, setSelectedSongId, setSelectedLyricId, setSelectedBookId, setSelectedProjectId]);

  // 2. Dynamically synchronize <title>, meta description, canonical URL, OpenGraph, Twitter & JSON-LD
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const isAdmin = currentTab === 'admin';
    const tabMeta = TAB_SEO_META[currentTab] || TAB_SEO_META.home;

    // Determine active item overrides (Song, Lyric, Book, Project modal)
    const activeSong = selectedSongId ? songs.find(s => s.id === selectedSongId) : null;
    const activeLyric = selectedLyricId ? lyrics.find(l => l.id === selectedLyricId) : null;
    const activeBook = selectedBookId ? books.find(b => b.id === selectedBookId) : null;
    const activeProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null;

    let pageTitle = tabMeta.title;
    let pageDescription = tabMeta.description;
    let pageKeywords = seo.keywords || tabMeta.keywords;
    let pageImage = resolveAbsoluteUrl(seo.ogImageUrl || '/og-image.jpg');
    let canonicalUrl =
      currentTab === 'home'
        ? `${CANONICAL_BASE_URL}/`
        : `${CANONICAL_BASE_URL}/?section=${currentTab}`;
    let ogType = 'website';

    if (currentTab === 'home' && seo.siteTitle && seo.siteTitle !== 'Arjun Bharti Mina') {
      pageTitle = seo.siteTitle;
    }
    if (currentTab === 'home' && seo.metaDescription) {
      pageDescription = seo.metaDescription;
    }

    if (activeSong) {
      pageTitle = `${activeSong.title} – Song & Lyrics by Arjun Bharti Mina (ABM)`;
      pageDescription = activeSong.description || `Listen to ${activeSong.title} (${activeSong.year}), a ${activeSong.genre} release by Arjun Bharti Mina (ABM).`;
      pageImage = resolveAbsoluteUrl(activeSong.cover);
      canonicalUrl = `${CANONICAL_BASE_URL}/?section=music&song=${encodeURIComponent(activeSong.slug || activeSong.id)}`;
      ogType = 'music.song';
    } else if (activeLyric) {
      pageTitle = `${activeLyric.title} Lyrics – Arjun Bharti Mina (ABM)`;
      pageDescription = activeLyric.meaning || `Read official lyrics and meaning for ${activeLyric.title} (${activeLyric.year}) by ${activeLyric.artist}.`;
      if (activeLyric.cover) pageImage = resolveAbsoluteUrl(activeLyric.cover);
      canonicalUrl = `${CANONICAL_BASE_URL}/?section=lyrics&lyric=${encodeURIComponent(activeLyric.id)}`;
      ogType = 'article';
    } else if (activeBook) {
      pageTitle = `${activeBook.title} – Book by Arjun Bharti Mina (ABM)`;
      pageDescription = activeBook.description || `Read ${activeBook.title} (${activeBook.publicationYear}) authored by Arjun Bharti Mina.`;
      if (activeBook.cover) pageImage = resolveAbsoluteUrl(activeBook.cover);
      canonicalUrl = `${CANONICAL_BASE_URL}/?section=books&book=${encodeURIComponent(activeBook.id)}`;
      ogType = 'book';
    } else if (activeProject) {
      pageTitle = `${activeProject.title} – Project by Arjun Bharti Mina (ABM)`;
      pageDescription = activeProject.shortDescription || activeProject.longDescription;
      if (activeProject.thumbnail) pageImage = resolveAbsoluteUrl(activeProject.thumbnail);
      canonicalUrl = `${CANONICAL_BASE_URL}/?section=projects&project=${encodeURIComponent(activeProject.id)}`;
    }

    // Update Document Title
    document.title = pageTitle;

    // Update Standard SEO Meta Tags
    upsertMeta('name', 'title', pageTitle);
    upsertMeta('name', 'description', pageDescription);
    upsertMeta('name', 'keywords', pageKeywords);
    upsertMeta('name', 'author', profile.name || 'Arjun Bharti Mina');

    // Update Index/Follow Robots Settings
    const robotsDirective = isAdmin
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    upsertMeta('name', 'robots', robotsDirective);
    upsertMeta('name', 'googlebot', robotsDirective);
    upsertMeta('name', 'bingbot', robotsDirective);

    // Update Canonical Link
    upsertLink('canonical', canonicalUrl, { id: 'canonical-url' });

    // Update Open Graph Metadata
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:site_name', branding.siteName || 'Arjun Bharti Mina');
    upsertMeta('property', 'og:locale', 'en_IN');
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', pageDescription);
    upsertMeta('property', 'og:image', pageImage);
    upsertMeta('property', 'og:image:secure_url', pageImage);
    upsertMeta('property', 'og:image:alt', pageTitle);

    // Update Twitter / X Card Metadata
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:url', canonicalUrl);
    upsertMeta('name', 'twitter:site', seo.twitterHandle || '@ArjunMinaABM');
    upsertMeta('name', 'twitter:creator', seo.twitterHandle || '@ArjunMinaABM');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', pageDescription);
    upsertMeta('name', 'twitter:image', pageImage);
    upsertMeta('name', 'twitter:image:alt', pageTitle);

    // Update Dynamic Schema.org JSON-LD Graph for Google Rich Snippets
    const sameAsUrls = Array.from(
      new Set([
        'https://youtube.com/@arjunbhartimina',
        'https://open.spotify.com/artist/arjunbhartimina',
        'https://music.apple.com/artist/arjun-bharti-mina',
        'https://instagram.com/arjunbhartimina',
        'https://github.com/arjunbhartimina',
        ...socialLinks.map(s => s.url).filter(Boolean),
      ])
    );

    const publishedSongs = songs.filter(s => s.published !== false);
    const publishedBooks = books.filter(b => b.published !== false);
    const publishedProjects = projects.filter(p => p.published !== false);
    const publishedVideos = videos.filter(v => v.published !== false);

    const structuredDataGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${CANONICAL_BASE_URL}/#website`,
          url: `${CANONICAL_BASE_URL}/`,
          name: branding.siteName || 'Arjun Bharti Mina',
          alternateName: ['ABM', 'Arjun Mina', 'Arjun Bharti Mina Official'],
          description: seo.metaDescription || TAB_SEO_META.home.description,
          inLanguage: 'en-IN',
          publisher: {
            '@id': `${CANONICAL_BASE_URL}/#artist`,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${CANONICAL_BASE_URL}/?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': ['Person', 'MusicGroup'],
          '@id': `${CANONICAL_BASE_URL}/#artist`,
          name: profile.name || 'Arjun Bharti Mina',
          alternateName: ['ABM', 'Arjun Mina'],
          url: `${CANONICAL_BASE_URL}/`,
          image: resolveAbsoluteUrl(profile.profileImage || '/logo.png'),
          logo: `${CANONICAL_BASE_URL}/logo.png`,
          description: profile.bio,
          birthDate: profile.dob || '2007-05-13',
          birthPlace: {
            '@type': 'Place',
            name: profile.birthplace || 'Rajasthan, India',
          },
          homeLocation: {
            '@type': 'Place',
            name: profile.location || 'Jaipur, Rajasthan, India',
          },
          nationality: {
            '@type': 'Country',
            name: profile.nationality || 'India',
          },
          alumniOf: {
            '@type': 'CollegeOrUniversity',
            name:
              profile.education?.college ||
              'Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT), Jaipur',
          },
          jobTitle: profile.creativeRoles || [
            'Music Artist',
            'Rapper',
            'Lyricist',
            'Singer',
            'Civil Engineer',
            'Creative Technologist',
          ],
          genre: ['Desi Hip-Hop', 'Indian Rap', 'Melodic Rap', 'Indie Pop'],
          sameAs: sameAsUrls,
          track: publishedSongs.slice(0, 10).map(song => ({
            '@type': 'MusicRecording',
            '@id': `${CANONICAL_BASE_URL}/?section=music&song=${encodeURIComponent(song.slug || song.id)}`,
            name: song.title,
            url: `${CANONICAL_BASE_URL}/?section=music&song=${encodeURIComponent(song.slug || song.id)}`,
            image: resolveAbsoluteUrl(song.cover),
            datePublished: song.releaseDate || `${song.year}`,
            genre: song.genre,
            inLanguage: song.language,
            byArtist: {
              '@type': 'Person',
              name: song.artist || 'Arjun Bharti Mina',
            },
          })),
        },
        {
          '@type': 'ProfilePage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: pageTitle,
          description: pageDescription,
          isPartOf: {
            '@id': `${CANONICAL_BASE_URL}/#website`,
          },
          mainEntity: {
            '@id': `${CANONICAL_BASE_URL}/#artist`,
          },
          inLanguage: 'en-IN',
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${CANONICAL_BASE_URL}/`,
            },
            ...(currentTab !== 'home' && !isAdmin
              ? [
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: currentTab.charAt(0).toUpperCase() + currentTab.slice(1),
                    item: `${CANONICAL_BASE_URL}/?section=${currentTab}`,
                  },
                ]
              : []),
          ],
        },
        ...publishedBooks.slice(0, 5).map(book => ({
          '@type': 'Book',
          '@id': `${CANONICAL_BASE_URL}/?section=books&book=${encodeURIComponent(book.id)}`,
          name: book.title,
          author: {
            '@id': `${CANONICAL_BASE_URL}/#artist`,
          },
          datePublished: `${book.publicationYear}`,
          description: book.description,
          image: resolveAbsoluteUrl(book.cover),
          url: book.googlePlayUrl || `${CANONICAL_BASE_URL}/?section=books&book=${encodeURIComponent(book.id)}`,
          numberOfPages: book.pages,
          inLanguage: book.language || 'en',
        })),
        ...publishedProjects.slice(0, 5).map(proj => ({
          '@type': 'SoftwareApplication',
          '@id': `${CANONICAL_BASE_URL}/?section=projects&project=${encodeURIComponent(proj.id)}`,
          name: proj.title,
          applicationCategory: 'WebApplication',
          operatingSystem: 'All',
          description: proj.shortDescription,
          url: proj.liveUrl || `${CANONICAL_BASE_URL}/?section=projects&project=${encodeURIComponent(proj.id)}`,
          author: {
            '@id': `${CANONICAL_BASE_URL}/#artist`,
          },
        })),
        ...publishedVideos.slice(0, 5).map(vid => ({
          '@type': 'VideoObject',
          '@id': `${CANONICAL_BASE_URL}/?section=videos&video=${encodeURIComponent(vid.id)}`,
          name: vid.title,
          description: vid.description || `${vid.title} by Arjun Bharti Mina (ABM)`,
          thumbnailUrl: [resolveAbsoluteUrl(vid.thumbnail)],
          uploadDate: vid.date ? `${vid.date}T00:00:00+05:30` : '2026-01-01T00:00:00+05:30',
          embedUrl: vid.youtubeEmbedId ? `https://www.youtube.com/embed/${vid.youtubeEmbedId}` : vid.youtubeUrl,
          contentUrl: vid.youtubeUrl,
        })),
      ],
    };

    let ldScript = document.getElementById('dynamic-schema-ld') as HTMLScriptElement | null;
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id = 'dynamic-schema-ld';
      ldScript.type = 'application/ld+json';
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(structuredDataGraph);
  }, [
    currentTab,
    selectedSongId,
    selectedLyricId,
    selectedBookId,
    selectedProjectId,
    profile,
    seo,
    branding,
    songs,
    lyrics,
    books,
    projects,
    videos,
    socialLinks,
  ]);

  return null;
};
