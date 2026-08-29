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
  SiteBranding,
  HomepageConfig,
  NavigationItem,
  AppearanceConfig,
  SEOConfig,
  YouTubeSettings,
  SiteAnalytics
} from '../types';

export const initialProfile: UserProfile = {
  name: 'Arjun Bharti Mina',
  shortName: 'Arjun Mina',
  displayName: 'Arjun Bharti Mina',
  username: 'arjunbhartimina',
  brandName: 'ABM',
  tagline: 'Independent Music Artist • Rapper • Singer • Lyricist • Composer • Digital Creator • Creative Technologist',
  subTagline: 'Independent Artist • Creator • Storyteller',
  bio: 'An independent Indian artist and multidisciplinary creator exploring music, visual storytelling, technology, and digital creativity.',
  extendedBio: [
    'Arjun Bharti Mina (widely known as ABM) is an independent Indian rapper, singer-songwriter, lyricist, composer, and creative technologist based in Rajasthan and Jaipur.',
    'Blending the grit of underground Desi Hip-Hop with soulful Indian melodic cadence and high-octane lyricism, Arjun writes, composes, and produces records that reflect raw ambition, youth hustle, and authentic cultural storytelling.',
    'A Civil Engineering graduate from the prestigious Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT Jaipur, 2022–2026), Arjun fuses analytical engineering precision with relentless digital creativity — designing interactive web ecosystems, authoring books, and pushing boundary lines in independent music.'
  ],
  dob: '2007-05-13', // Stored YYYY-MM-DD for dynamic real-time age calculation
  birthplace: 'Rajasthan, India',
  location: 'Jaipur, Rajasthan, India',
  nationality: 'Indian',
  education: {
    degree: 'Bachelor of Technology (B.Tech)',
    field: 'Civil Engineering',
    college: 'Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT), Jaipur',
    period: '2022 – 2026',
    status: 'Graduated / Final Year'
  },
  creativeRoles: [
    'Music Artist & Rapper',
    'Singer & Vocalist',
    'Lyricist & Songwriter',
    'Music Composer & Beat Arranger',
    'Creative Technologist & Web Builder',
    'Digital Media Creator & Visual Storyteller',
    'Civil Engineering Graduate'
  ],
  interests: [
    'Desi Hip-Hop & Melodic Rap',
    'Audio Synthesis & Production',
    'Modern Web Development & UI Architecture',
    'Creative Writing & Poetry',
    'Structural Civil Engineering & CAD',
    'Visual Arts & Urban Photography',
    'AI Tools & Digital Media Innovation'
  ],
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
  heroImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
  email: 'contact@arjunbhartimina.com',
  website: 'https://arjunbhartimina.com',
  whatsappNumber: '+91 98000 00000',
  featuredQuote: 'Art is the blueprint of the soul, and rhythm is its foundation.',
  isVerified: true,
  privacy: {
    showDOB: true,
    showBirthplace: true,
    showLocation: true,
    showEmail: true,
    showWhatsapp: true,
    showEducation: true
  },
  stats: {
    monthlyListeners: '25.4K+',
    totalStreams: '380K+',
    youtubeSubs: '12.8K+'
  }
};

export const initialSongs: Song[] = [
  {
    id: 'rutba-2026',
    title: 'RUTBA',
    slug: 'rutba',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    duration: '3:18',
    releaseDate: '2026-02-14',
    year: 2026,
    genre: 'Desi Hip-Hop / Street Anthem',
    language: 'Hindi / Marwari Slang',
    artist: 'Arjun Bharti Mina',
    description: 'A thunderous street rap anthem exploring self-made hustle, relentless determination, and earning your respect through sheer perseverance.',
    lyrics: `[Intro: ABM]
Sunn le gaur se, yeh kahani kisi shehar ki nahi
Yeh cheekh hai uss aag ki jo seene mein jali...
ABM on the mic, let's go!

[Chorus]
Mera rutba meri mehnat se bana hai
Kisi ke reham-o-karam pe main khada nahi
Raaste kathin the par irada tha chattan
Jo chaha dil ne, wahi haasil kar liya yahan!
Mera rutba, mera rutba, mera rutba
Kisi ke jhukane se yeh sar jhuka nahi!

[Verse 1]
Jaipur ki galliyon se uthi yeh aawaz hai
Kalam mein barood, dimaag mein raaz hai
Subah college ki drawing, raat ko studio ka sound
808 baja toh kaanpe pura underground!
Log kehte the yeh music se kya paayega?
Dekh aaj har ek speaker pe mera naam aayega
Civil ki calculation, beats ka precision
Dono mein ek hi baat — razor-sharp vision!

[Hook]
Mera rutba meri mehnat se bana hai
Kisi ke reham-o-karam pe main khada nahi!

[Verse 2]
Ruka nahi, thaka nahi, har haar ko seekh banaya
Andhero ke beech maine apna noor chamkaya
Na koi godfather, na koi backup plan
Kalam aur mic tha, banaya apna clan!
Rajasthan ki mitti ka yeh tevar hai nirala
Khwaabon ko sach karke duniya ko dikha dala!

[Outro]
Arjun Bharti Mina.
ABM Studio's. 2026.
Still rising.`,
    credits: {
      artist: 'Arjun Bharti Mina',
      lyrics: 'Arjun Bharti Mina',
      music: 'ABM Beats',
      production: "ABM Studio's",
      mixMaster: 'Jaipur Audio Labs',
      label: 'ABM Records Independent'
    },
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6',
      youtube: 'https://youtube.com/@arjunbhartimina',
      gaana: 'https://gaana.com/artist/arjun-bharti-mina',
      jiosaavn: 'https://jiosaavn.com/artist/arjun-bharti-mina',
      appleMusic: 'https://music.apple.com/artist/arjun-bharti-mina',
      wynk: 'https://wynk.in/u/arjunbhartimina'
    },
    youtubeEmbedId: 'dQw4w9WgXcQ',
    audioToneSequence: [261.63, 329.63, 392.00, 523.25, 493.88, 440.00, 392.00, 329.63],
    featured: true,
    playCount: 14250
  },
  {
    id: 'jaipur-to-delhi-2025',
    title: 'JAIPUR TO DELHI',
    slug: 'jaipur-to-delhi',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    duration: '2:54',
    releaseDate: '2025-11-20',
    year: 2025,
    genre: 'Drill / Storytelling',
    language: 'Hindi',
    artist: 'Arjun Bharti Mina',
    description: 'A gritty storytelling track tracing late-night highway travels, college hostel dreams, and stepping into the capital music circuit.',
    lyrics: `[Intro]
Highway 48, 2 AM.
Engine roaring, beats churning.
Jaipur to Delhi.

[Verse 1]
Hostel ke kamre mein likhi thi jo line
Aaj wahi line pe stage pe lights shine
Jaipur se nikle the leke sapne hazaar
Delhi ki hawa mein baatein thodi dhaar
Lekin hum bhi the padosi aravalli ke pathhar
Jitna ghisoge, utna chamkega yeh akshar!

[Chorus]
NH 48 pe daude meri gaadi
Khwaabon ke peeche yeh saari aabadi
Dilli ke cypher mein Rajasthan ka flow
Dekh kaise sabhi sar hilaate in a row!

[Verse 2]
Coding aur CAD ke beech rap ka junoon
Dopamine rush jaise seene mein sukoon
Har meter cube concrete ka wazan jaante hain
Har syllable ka punchline yahan maante hain!

[Outro]
Connected circuits, connected rhymes.
ABM.`,
    credits: {
      artist: 'Arjun Bharti Mina',
      lyrics: 'Arjun Bharti Mina',
      music: 'ABM Beats & D-Town Wave',
      production: "ABM Studio's",
      mixMaster: 'ABM Soundworks',
      label: 'Independent'
    },
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/2t990xZpYg37f2Gg9aN01k',
      youtube: 'https://youtube.com/@arjunbhartimina',
      jiosaavn: 'https://jiosaavn.com/artist/arjun-bharti-mina',
      appleMusic: 'https://music.apple.com/artist/arjun-bharti-mina'
    },
    youtubeEmbedId: 'M7lc1UVf-VE',
    audioToneSequence: [220.00, 246.94, 261.63, 293.66, 329.63, 293.66, 261.63, 220.00],
    featured: true,
    playCount: 9820
  },
  {
    id: 'khwabeeda-2025',
    title: 'KHWABEEDA',
    slug: 'khwabeeda',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    duration: '3:45',
    releaseDate: '2025-08-10',
    year: 2025,
    genre: 'Melodic Rap / Lo-Fi',
    language: 'Hindi / Urdu Touch',
    artist: 'Arjun Bharti Mina',
    description: 'An introspective, atmospheric nocturnal track reflecting on solitude, creative vulnerability, and stargazing from a hostel balcony.',
    lyrics: `[Intro: Soft Guitar & Vinyl Crackle]
Khwabon ki dastaan hai...
Sitaron se aage ek aasmaan hai...

[Verse 1]
Khwabeeda aankhon mein neend kahan aati hai
Jab yeh aadhi raat dher saari baatein batati hai
Kitabein khuli hain structural analysis ki
Par dimaag mein melody chalti hai lyrics ki
Main dono zindagiyan saath leke chalta hoon
Subah concrete, shaam ko jazbaat gholta hoon.

[Chorus]
Hum khwabeeda musafir hain
Raaton ke shayar, shabnam ke tajir hain
Jo dil mein hai wahi zubaan pe laate hain
Geeton se hum toota aasmaan sajate hain...

[Verse 2]
Koi samjhe na samjhe, hume khud par aitbaar hai
Kyunki har ek asafal lamhe mein ek naya aavishkaar hai
Thoda sa thehar ke jab piche dekhta hoon
Kitne pahaad paar kiye, soch ke muskurata hoon.`,
    credits: {
      artist: 'Arjun Bharti Mina',
      lyrics: 'Arjun Bharti Mina',
      music: 'ABM Melodies',
      production: "ABM Studio's",
      mixMaster: 'Nocturnal Echoes',
      label: 'Independent'
    },
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/5HQEVPgB0q5mm4dhn6xCdK',
      youtube: 'https://youtube.com/@arjunbhartimina',
      gaana: 'https://gaana.com/artist/arjun-bharti-mina',
      jiosaavn: 'https://jiosaavn.com/artist/arjun-bharti-mina'
    },
    youtubeEmbedId: '5qap5aO4i9A',
    audioToneSequence: [329.63, 392.00, 440.00, 493.88, 523.25, 493.88, 440.00, 392.00],
    featured: true,
    playCount: 16800
  },
  {
    id: 'aasman-ki-ore-2026',
    title: 'AASMAN KI ORE',
    slug: 'aasman-ki-ore',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop',
    duration: '3:05',
    releaseDate: '2026-01-01',
    year: 2026,
    genre: 'Uplifting Pop Rap / Acoustic',
    language: 'Hindi',
    artist: 'Arjun Bharti Mina',
    description: 'A motivating New Year anthem celebrating graduation, breaking societal expectations, and aiming for limitless horizons.',
    lyrics: `[Chorus]
Aasman ki ore parwaaz meri jaari hai
Rukne ka waqt nahi, ab meri baari hai!
Duniya chahe jo bhi kahe unke bol pe dhyan na de
Tujhme jo chupi aag hai usko thanda hone na de!

[Verse]
SKIT ke corridors se leke duniya ke manch tak
Saath rahegi mitti meri aakhiri saans tak
Engineers build structures, but artists build souls
Dono ko jodd diya, set my ultimate goals!`,
    credits: {
      artist: 'Arjun Bharti Mina',
      lyrics: 'Arjun Bharti Mina',
      music: 'ABM Beats & Strings',
      production: "ABM Studio's",
      mixMaster: 'Studio 26',
      label: 'Independent'
    },
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/7iK4bX494ZfL5L309a909k',
      youtube: 'https://youtube.com/@arjunbhartimina',
      appleMusic: 'https://music.apple.com/artist/arjun-bharti-mina'
    },
    youtubeEmbedId: 'L_LUpnjgPso',
    audioToneSequence: [392.00, 440.00, 493.88, 587.33, 523.25, 493.88, 440.00, 392.00],
    featured: false,
    playCount: 7420
  },
  {
    id: 'desi-flow-vol1-2024',
    title: 'DESI FLOW VOL. 1',
    slug: 'desi-flow-vol-1',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    duration: '2:38',
    releaseDate: '2024-09-15',
    year: 2024,
    genre: 'Desi Rap / Cypher Freestyle',
    language: 'Hindi',
    artist: 'Arjun Bharti Mina',
    description: 'Fast-paced rhythmic freestyle showcasing raw multisyllabic rhyme schemes and traditional Indian percussive instrumentation.',
    lyrics: `[Freestyle Drop]
Mic check ek do, sunn flow yeh kaisa hai
Jo sach bole bina dare, shayar yeh waisa hai
Na darr kisi ke kehne ka, na parwaah kisi shor ki
Kalam chalegi aisi jaise bijli ho ghanghor si!
ABM on the verse!`,
    credits: {
      artist: 'Arjun Bharti Mina',
      lyrics: 'Arjun Bharti Mina',
      music: 'ABM Beats',
      production: "ABM Studio's",
      mixMaster: 'Raw Cut Records',
      label: 'Independent'
    },
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp',
      youtube: 'https://youtube.com/@arjunbhartimina'
    },
    youtubeEmbedId: 'kJQP7kiw5Fk',
    audioToneSequence: [196.00, 220.00, 246.94, 293.66, 261.63, 246.94, 220.00, 196.00],
    featured: false,
    playCount: 11200
  }
];

export const initialLyrics: LyricItem[] = [
  {
    id: 'lyric-rutba',
    songId: 'rutba-2026',
    title: 'RUTBA — Full Lyrics & Rhyme Breakdown',
    artist: 'Arjun Bharti Mina',
    year: 2026,
    genre: 'Desi Hip-Hop',
    language: 'Hindi / Marwari',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    lyrics: `[Intro: ABM]
Sunn le gaur se, yeh kahani kisi shehar ki nahi
Yeh cheekh hai uss aag ki jo seene mein jali...
ABM on the mic, let's go!

[Chorus]
Mera rutba meri mehnat se bana hai
Kisi ke reham-o-karam pe main khada nahi
Raaste kathin the par irada tha chattan
Jo chaha dil ne, wahi haasil kar liya yahan!
Mera rutba, mera rutba, mera rutba
Kisi ke jhukane se yeh sar jhuka nahi!

[Verse 1]
Jaipur ki galliyon se uthi yeh aawaz hai
Kalam mein barood, dimaag mein raaz hai
Subah college ki drawing, raat ko studio ka sound
808 baja toh kaanpe pura underground!
Log kehte the yeh music se kya paayega?
Dekh aaj har ek speaker pe mera naam aayega
Civil ki calculation, beats ka precision
Dono mein ek hi baat — razor-sharp vision!

[Hook]
Mera rutba meri mehnat se bana hai
Kisi ke reham-o-karam pe main khada nahi!

[Verse 2]
Ruka nahi, thaka nahi, har haar ko seekh banaya
Andhero ke beech maine apna noor chamkaya
Na koi godfather, na koi backup plan
Kalam aur mic tha, banaya apna clan!
Rajasthan ki mitti ka yeh tevar hai nirala
Khwaabon ko sach karke duniya ko dikha dala!

[Outro]
Arjun Bharti Mina.
ABM Studio's. 2026.
Still rising.`,
    meaning: 'Explores self-determination, hard work across engineering college and night studio sessions, and building an authentic identity through music without compromise.',
    featured: true
  },
  {
    id: 'lyric-jaipur-delhi',
    songId: 'jaipur-to-delhi-2025',
    title: 'JAIPUR TO DELHI — Complete Bars',
    artist: 'Arjun Bharti Mina',
    year: 2025,
    genre: 'Drill Storytelling',
    language: 'Hindi',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    lyrics: `[Intro]
Highway 48, 2 AM.
Engine roaring, beats churning.
Jaipur to Delhi.

[Verse 1]
Hostel ke kamre mein likhi thi jo line
Aaj wahi line pe stage pe lights shine
Jaipur se nikle the leke sapne hazaar
Delhi ki hawa mein baatein thodi dhaar
Lekin hum bhi the padosi aravalli ke pathhar
Jitna ghisoge, utna chamkega yeh akshar!

[Chorus]
NH 48 pe daude meri gaadi
Khwaabon ke peeche yeh saari aabadi
Dilli ke cypher mein Rajasthan ka flow
Dekh kaise sabhi sar hilaate in a row!

[Verse 2]
Coding aur CAD ke beech rap ka junoon
Dopamine rush jaise seene mein sukoon
Har meter cube concrete ka wazan jaante hain
Har syllable ka punchline yahan maante hain!

[Outro]
Connected circuits, connected rhymes.
ABM.`,
    meaning: 'Autobiographical reflection of commuting between Jaipur engineering campus and Delhi music hubs, balancing CAD drawings with cyphers.',
    featured: true
  },
  {
    id: 'lyric-khwabeeda',
    songId: 'khwabeeda-2025',
    title: 'KHWABEEDA — Poetic Verse & Metaphors',
    artist: 'Arjun Bharti Mina',
    year: 2025,
    genre: 'Melodic Rap',
    language: 'Hindi / Urdu',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    lyrics: `[Intro: Soft Guitar & Vinyl Crackle]
Khwabon ki dastaan hai...
Sitaron se aage ek aasmaan hai...

[Verse 1]
Khwabeeda aankhon mein neend kahan aati hai
Jab yeh aadhi raat dher saari baatein batati hai
Kitabein khuli hain structural analysis ki
Par dimaag mein melody chalti hai lyrics ki
Main dono zindagiyan saath leke chalta hoon
Subah concrete, shaam ko jazbaat gholta hoon.

[Chorus]
Hum khwabeeda musafir hain
Raaton ke shayar, shabnam ke tajir hain
Jo dil mein hai wahi zubaan pe laate hain
Geeton se hum toota aasmaan sajate hain...

[Verse 2]
Koi samjhe na samjhe, hume khud par aitbaar hai
Kyunki har ek asafal lamhe mein ek naya aavishkaar hai
Thoda sa thehar ke jab piche dekhta hoon
Kitne pahaad paar kiye, soch ke muskurata hoon.`,
    meaning: 'Deep introspective poem on sleepless nights, staying true to your authentic passion, and turning internal struggles into musical poetry.',
    featured: true
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Studio Night Session: RUTBA Production',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    category: 'Behind The Scenes',
    date: '2026-01-28',
    description: 'Late night mixing session at ABM Studio’s refining vocal stems and 808 sub-bass for RUTBA.',
    location: 'ABM Studio’s, Jaipur',
    tags: ['Music', 'Studio', 'Audio Production', 'Microphone', 'ABM'],
    featured: true,
    aspectRatio: 'landscape'
  },
  {
    id: 'gal-2',
    title: 'Live Stage Cypher & Mic Check',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    category: 'Music & Stage',
    date: '2025-12-14',
    description: 'Performing headline bars at college fest in front of 2,000+ energised listeners.',
    location: 'SKIT Amphitheatre, Jaipur',
    tags: ['Stage', 'Live Rap', 'Performance', 'Crowd', 'Concert'],
    featured: true,
    aspectRatio: 'portrait'
  },
  {
    id: 'gal-3',
    title: 'Aravalli Hills Creative Retreat',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    category: 'Travel',
    date: '2025-10-04',
    description: 'Seeking lyric inspiration amidst the ancient rocky slopes and quiet sunsets of Rajasthan.',
    location: 'Aravalli Range, Rajasthan',
    tags: ['Nature', 'Inspiration', 'Travel', 'Rajasthan', 'Sunset'],
    featured: false,
    aspectRatio: 'landscape'
  },
  {
    id: 'gal-4',
    title: 'ABM Official Monogram & Brand Artwork',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    category: 'Posters & Artwork',
    date: '2026-02-01',
    description: 'Vector-engineered visual identity reflecting architectural geometry and rhythmic frequency.',
    location: 'Digital Canvas',
    tags: ['Design', 'Artwork', 'Brand Identity', 'Minimalism', 'Typography'],
    featured: true,
    aspectRatio: 'square'
  },
  {
    id: 'gal-5',
    title: 'Civil Engineering Project Site Inspection',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1200&auto=format&fit=crop',
    category: 'Personal',
    date: '2025-09-18',
    description: 'Structural inspection and concrete testing during B.Tech field training in Jaipur.',
    location: 'SKIT Campus Construction Wing',
    tags: ['Civil Engineering', 'SKIT Jaipur', 'Education', 'Field Work'],
    featured: false,
    aspectRatio: 'portrait'
  },
  {
    id: 'gal-6',
    title: 'Vintage Synthesizers & Analog Beats',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop',
    category: 'Behind The Scenes',
    date: '2025-07-22',
    description: 'Sound designing analog synth leads for melodic lo-fi release KHWABEEDA.',
    location: 'Jaipur Sound Laboratory',
    tags: ['Synthesizer', 'Keys', 'Production', 'Lo-Fi', 'Creative Art'],
    featured: true,
    aspectRatio: 'landscape'
  }
];

export const initialVideos: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'RUTBA — Official Music Video (Street Anthem)',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeEmbedId: 'dQw4w9WgXcQ',
    category: 'Music Video',
    duration: '3:45',
    date: '2026-02-16',
    description: 'Official cinematic music video for RUTBA shot across the heritage streets, rooftops, and neon alleys of Jaipur.',
    featured: true,
    viewsCount: '124K'
  },
  {
    id: 'vid-2',
    title: 'Inside ABM Studio’s: Making of RUTBA Beats & Bars',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    youtubeUrl: 'https://youtube.com/watch?v=M7lc1UVf-VE',
    youtubeEmbedId: 'M7lc1UVf-VE',
    category: 'BTS',
    duration: '8:20',
    date: '2026-02-18',
    description: 'Step-by-step breakdown of how the 808 slide, vocal harmonies, and Marwari slang punchlines were recorded.',
    featured: true,
    viewsCount: '48K'
  },
  {
    id: 'vid-3',
    title: 'JAIPUR TO DELHI — Live Hostel Room Cypher',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
    youtubeUrl: 'https://youtube.com/watch?v=5qap5aO4i9A',
    youtubeEmbedId: '5qap5aO4i9A',
    category: 'Live Performance',
    duration: '2:50',
    date: '2025-11-22',
    description: 'Raw one-take freestyle recording in SKIT hostel room with acoustic guitar accompaniment.',
    featured: false,
    viewsCount: '62K'
  },
  {
    id: 'vid-4',
    title: 'Day in the Life: Civil Engineer by Day, Music Artist by Night',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
    youtubeUrl: 'https://youtube.com/watch?v=L_LUpnjgPso',
    youtubeEmbedId: 'L_LUpnjgPso',
    category: 'Creative',
    duration: '6:15',
    date: '2025-08-30',
    description: 'Vlog detailing balancing B.Tech final year lab submissions, web dev coding sprints, and vocal rehearsals.',
    featured: true,
    viewsCount: '89K'
  },
  {
    id: 'vid-5',
    title: '1 Minute Freestyle: Desi Rhyme Speed Test #Shorts',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    youtubeUrl: 'https://youtube.com/watch?v=kJQP7kiw5Fk',
    youtubeEmbedId: 'kJQP7kiw5Fk',
    category: 'Shorts',
    duration: '0:58',
    date: '2026-01-05',
    description: 'Fast tongue-twister Hindi rhymes delivered without a single breath pause.',
    featured: false,
    viewsCount: '210K'
  }
];

export const initialProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Aether Gallery — Interactive 3D Visual Archive',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'A high-performance modern digital exhibition space showcasing photographs, album covers, and digital media in virtual space.',
    longDescription: 'Aether Gallery is a creative technology project engineered by Arjun Bharti Mina to display high-resolution visual artwork with WebGL and spatial lighting. It allows artists and photographers to host immersive digital exhibitions with smooth camera transitions and real-time audio ambient integration.',
    problemSolved: 'Traditional flat 2D image grids lack the spatial drama of physical art galleries. Aether bridges the gap with browser-native WebGL rendering.',
    features: [
      'Interactive spatial 3D gallery navigation',
      'Ambient audio synthesizer synced with lighting mood',
      'EXIF & artistic metadata inspection panel',
      'Optimized texture streaming for ultra-fast load times'
    ],
    technologies: ['React', 'TypeScript', 'Three.js / WebGL', 'Tailwind CSS', 'Web Audio API'],
    year: 2026,
    status: 'Active',
    liveUrl: 'https://aether-gallery.demo.app',
    githubUrl: 'https://github.com/arjunbhartimina/aether-gallery',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop'
    ],
    featured: true,
    category: 'Creative Tech'
  },
  {
    id: 'proj-2',
    title: 'CineVerse — Curated Indie Film & Story Platform',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'A discovery hub for independent Indian cinema, visual music videos, documentaries, and community reviews.',
    longDescription: 'CineVerse is a bespoke web application designed for independent filmmakers, music video directors, and storytellers. Built with modern React and fast search indexing, it empowers creators to spotlight their visual narratives outside algorithm-dominated feeds.',
    problemSolved: 'Independent creators struggle to present high-production music videos and short films in a premium cinema-grade layout.',
    features: [
      'Ultra-clean dark cinema interface',
      'Director & crew credit matrix',
      'Interactive timeline timestamps & chapter markers',
      'Zero-buffering responsive media embeds'
    ],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Express', 'Node.js'],
    year: 2025,
    status: 'Completed',
    liveUrl: 'https://cineverse-abm.demo.app',
    githubUrl: 'https://github.com/arjunbhartimina/cineverse-hub',
    screenshots: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop'
    ],
    featured: true,
    category: 'Web Application'
  },
  {
    id: 'proj-3',
    title: 'StructureMatrix — Civil Engineering RCC Beam Calculator',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'A structural engineering computational suite for rapid moment distribution, shear force analysis, and reinforcement sizing.',
    longDescription: 'Created as part of Arjun’s B.Tech Civil Engineering capstone project at SKIT Jaipur, StructureMatrix automates limit state design calculations per Indian Standard IS 456:2000 with real-time dynamic SVG bending moment diagrams.',
    problemSolved: 'Manual structural design calculations are time-consuming and error-prone during site inspections and laboratory trials.',
    features: [
      'Instant bending moment & shear force diagram generation',
      'Reinforcement bar schedule (BBS) auto-compiler',
      'Compliance check against IS 456:2000 codes',
      'One-click PDF structural report generator'
    ],
    technologies: ['TypeScript', 'Math.js', 'D3.js / SVG', 'Tailwind CSS', 'Vite'],
    year: 2025,
    status: 'Completed',
    liveUrl: 'https://structurematrix-skit.demo.app',
    githubUrl: 'https://github.com/arjunbhartimina/structure-matrix',
    screenshots: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop'
    ],
    featured: true,
    category: 'Engineering Tool'
  },
  {
    id: 'proj-4',
    title: 'ABM LyricStudio & Syllable Meter Analyzer',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    shortDescription: 'A smart web notepad for rap lyricists and songwriters with rhyming dictionaries, meter counters, and audio playback syncing.',
    longDescription: 'An intuitive workspace built for rappers and lyricists to jot down verses, calculate syllable cadences per bar, test internal rhyme matching, and rehearse against a built-in metronome and beat loop player.',
    features: [
      'Real-time Hindi & English phonetic rhyme helper',
      'Bar syllable counter and stress pattern visualizer',
      'Integrated metronome with tempo tap',
      'Local-first encrypted draft autosave'
    ],
    technologies: ['React', 'TypeScript', 'Web Audio API', 'IndexedDB', 'Tailwind CSS'],
    year: 2026,
    status: 'Active',
    liveUrl: 'https://lyricstudio.abm.demo',
    githubUrl: 'https://github.com/arjunbhartimina/lyric-studio',
    screenshots: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop'
    ],
    featured: false,
    category: 'AI & Media'
  }
];

export const initialBooks: BookItem[] = [
  {
    id: 'book-1',
    title: "The Lyricist's Blueprint: Rhyme, Rhythm & Indian Hip-Hop",
    subtitle: 'A Modern Guide to Crafting Authentic Verses, Metaphors, and Cadences',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    author: 'Arjun Bharti Mina',
    description: 'A comprehensive handbook exploring the art and mechanics of Desi Hip-Hop songwriting, multisyllabic rhyming, flow switches, and cultural storytelling.',
    longSynopsis: 'In "The Lyricist’s Blueprint", independent music artist Arjun Bharti Mina (ABM) deconstructs the architecture of modern Indian rap. From understanding syllable stress and meter synchronization to weaving regional dialect into universal hooks, this book is an invaluable companion for aspiring songwriters, rappers, and poetic creators.',
    publicationYear: 2025,
    pages: 184,
    language: 'English / Hindi References',
    playStoreUrl: 'https://play.google.com/store/books/details?id=arjun_bharti_mina_lyricists_blueprint',
    amazonUrl: 'https://amazon.in/dp/B0EXAMP123',
    pdfPreviewUrl: '#',
    chaptersSummary: [
      'Chapter 1: The Anatomy of a Verse — Syllables, Accents & Cadence',
      'Chapter 2: Multisyllabic Rhyming & Internal Assonance in Hindi/Urdu',
      'Chapter 3: The Storyteller’s Lens — Drawing from Rajasthan’s Soil',
      'Chapter 4: Beats & Bars — Engineering Precision in 808 Placement',
      'Chapter 5: Building Independence as a Modern 21st-Century Artist'
    ],
    featured: true
  },
  {
    id: 'book-2',
    title: 'Foundations of Modern Civil Mechanics: An Undergraduate Primer',
    subtitle: 'Practical Concepts, Structural Analysis & Site Applications',
    cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=800&auto=format&fit=crop',
    author: 'Arjun Bharti Mina',
    description: 'A simplified, visually structured reference guide compiling key civil engineering formulas, structural matrix methods, and concrete technology fundamentals.',
    longSynopsis: 'Penned during his final year B.Tech coursework at SKIT Jaipur, this textbook summary provides clear graphical explanations and computational shortcuts for civil engineering students mastering RCC beam calculations, soil mechanics, and survey triangulations.',
    publicationYear: 2026,
    pages: 220,
    language: 'English',
    playStoreUrl: 'https://play.google.com/store/books/details?id=arjun_mina_civil_mechanics_primer',
    amazonUrl: 'https://amazon.in/dp/B0CIVIL456',
    pdfPreviewUrl: '#',
    chaptersSummary: [
      'Section I: Stress, Strain, and Elastic Constants',
      'Section II: Shear Force & Bending Moment Diagrams in Continuous Beams',
      'Section III: Limit State Design Philosophy per IS 456',
      'Section IV: Soil Mechanics & Foundation Stability',
      'Section V: Digital Tools & CAD Integration in Modern Construction'
    ],
    featured: true
  }
];

export const initialTimeline: TimelineItem[] = [
  {
    id: 'tl-2007',
    year: '2007',
    title: 'Born in Rajasthan, India',
    subtitle: 'The Roots',
    category: 'Life',
    description: 'Born in the culturally rich land of Rajasthan, developing a deep love for folk rhythms, poetry, and storytelling from early childhood.'
  },
  {
    id: 'tl-2022',
    year: '2022',
    title: 'Commenced B.Tech in Civil Engineering at SKIT Jaipur',
    subtitle: 'Academic Foundations',
    category: 'Education',
    description: 'Joined Swami Keshvanand Institute of Technology (SKIT), Jaipur. Began exploring the intersection of structural engineering and digital systems.'
  },
  {
    id: 'tl-2023',
    year: '2023',
    title: 'ABM Studio’s Established & First Independent Demos',
    subtitle: 'Music Era Genesis',
    category: 'Music',
    description: 'Set up an independent home studio setup. Started writing original Hindi rap tracks and experimenting with audio synthesis & beat production.'
  },
  {
    id: 'tl-2024',
    year: '2024',
    title: 'Release of "DESI FLOW VOL. 1" & Digital Projects',
    subtitle: 'Creative Momentum',
    category: 'Music',
    description: 'Dropped inaugural breakout cyphers and published digital web products like Aether Gallery and CineVerse for the indie creative community.'
  },
  {
    id: 'tl-2025',
    year: '2025',
    title: 'Published "The Lyricist’s Blueprint" & Singles ("JAIPUR TO DELHI", "KHWABEEDA")',
    subtitle: 'Author & Performer',
    category: 'Milestone',
    description: 'Published first book on Google Play Books; headlined college music festivals and gained dedicated followers across Spotify and YouTube.'
  },
  {
    id: 'tl-2026',
    year: '2026',
    title: 'Civil Engineering Graduation & Anthem Release "RUTBA"',
    subtitle: 'The Next Era',
    category: 'Milestone',
    description: 'Completing B.Tech at SKIT Jaipur while launching the signature street anthem "RUTBA" and this unified Personal Creator Hub & Digital Archive.'
  }
];

export const initialSocialLinks: SocialLink[] = [
  {
    id: 'soc-spotify',
    platform: 'Spotify',
    username: 'Arjun Bharti Mina',
    url: 'https://open.spotify.com/artist/arjunbhartimina',
    category: 'Music Platform',
    description: 'Stream all official singles, albums, and curated playlists.',
    iconName: 'Music',
    badge: '25K+ Monthly'
  },
  {
    id: 'soc-youtube',
    platform: 'YouTube',
    username: '@ArjunBhartiMina',
    url: 'https://youtube.com/@arjunbhartimina',
    category: 'Music Platform',
    description: 'Official music videos, studio BTS, live cyphers & YouTube Shorts.',
    iconName: 'Youtube',
    badge: '12.8K Subs'
  },
  {
    id: 'soc-instagram',
    platform: 'Instagram',
    username: '@arjunbhartimina',
    url: 'https://instagram.com/arjunbhartimina',
    category: 'Social Network',
    description: 'Daily life, studio clips, creative teasers & photography drops.',
    iconName: 'Instagram',
    badge: 'Official'
  },
  {
    id: 'soc-linkedin',
    platform: 'LinkedIn',
    username: 'Arjun Bharti Mina',
    url: 'https://linkedin.com/in/arjunbhartimina',
    category: 'Professional',
    description: 'Civil engineering background, tech projects & professional collaborations.',
    iconName: 'Linkedin',
    badge: 'SKIT Alumni'
  },
  {
    id: 'soc-x',
    platform: 'X (Twitter)',
    username: '@ArjunMinaABM',
    url: 'https://x.com/ArjunMinaABM',
    category: 'Social Network',
    description: 'Thoughts on music, engineering, creative coding & cultural philosophy.',
    iconName: 'Twitter',
    badge: 'Active'
  },
  {
    id: 'soc-jiosaavn',
    platform: 'JioSaavn',
    username: 'Arjun Bharti Mina',
    url: 'https://jiosaavn.com/artist/arjun-bharti-mina',
    category: 'Music Platform',
    description: 'Listen to lossless audio streams on India’s premier music hub.',
    iconName: 'Radio',
    badge: 'Verified'
  },
  {
    id: 'soc-gaana',
    platform: 'Gaana',
    username: 'Arjun Bharti Mina',
    url: 'https://gaana.com/artist/arjun-bharti-mina',
    category: 'Music Platform',
    description: 'Stream hit releases, remixes, and lyrical tracks.',
    iconName: 'Disc',
    badge: 'Artist'
  },
  {
    id: 'soc-whatsapp',
    platform: 'WhatsApp Channel',
    username: 'ABM Music Official',
    url: 'https://whatsapp.com/channel/arjunbhartimina',
    category: 'Community',
    description: 'Exclusive first-listen snippets, early ticket drops & updates directly on WhatsApp.',
    iconName: 'MessageSquare',
    badge: 'Direct Updates'
  }
];

export const initialBranding: SiteBranding = {
  siteName: 'Arjun Bharti Mina',
  shortName: 'Arjun Bharti Mina',
  logoUrl: '',
  faviconUrl: '/logo.png',
  siteDescription: 'Official digital universe, music library, lyrical vault, and multidisciplinary portfolio of independent artist Arjun Bharti Mina (ABM).',
  tagline: 'Music Artist • Civil Engineer • Lyricist • Creator',
  browserTitle: 'Arjun Bharti Mina',
  footerText: 'Designed & Curated by Arjun Bharti Mina. Blending sound, engineering, and digital art.',
  copyrightText: '© 2026 Arjun Bharti Mina (ABM). All rights reserved.'
};

export const initialHomepage: HomepageConfig = {
  heroHeading: 'ARJUN BHARTI MINA',
  heroSubtitle: 'Rapper • Lyricist • Singer • Civil Engineer • Creative Technologist',
  heroIntro: 'Crafting raw street-rooted Desi Hip-Hop, engineering digital systems, and archiving lyrical worlds from Jaipur to the globe.',
  heroProfileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
  heroBackgroundImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
  ctaPrimaryText: 'Listen to Latest Anthem',
  ctaPrimaryLink: 'music',
  ctaSecondaryText: 'Explore Projects & Tech',
  ctaSecondaryLink: 'projects',
  showFeaturedAnthem: true,
  featuredAnthemSongId: 'rutba-2026',
  featuredAnthemTitle: 'RUTBA (2026)',
  featuredAnthemSubtitle: 'Street Rap Anthem • ABM Studio’s',
  featuredAnthemBadge: 'Featured Anthem',
  sections: [
    { id: 'spotlight', name: 'Profile Spotlight & Stats', enabled: true, order: 1 },
    { id: 'music', name: 'Featured Music Releases', enabled: true, order: 2 },
    { id: 'videos', name: 'Latest Visuals & YouTube', enabled: true, order: 3 },
    { id: 'projects', name: 'Websites & Engineering Apps', enabled: true, order: 4 },
    { id: 'books', name: 'Published Books & Literature', enabled: true, order: 5 },
    { id: 'gallery', name: 'Photography & Behind The Scenes', enabled: true, order: 6 },
    { id: 'lyrics', name: 'Lyrical Highlights', enabled: true, order: 7 },
    { id: 'quote', name: 'Artist Philosophy & Quote', enabled: true, order: 8 }
  ]
};

export const initialNavigation: NavigationItem[] = [
  { id: 'nav-home', label: 'Home', tab: 'home', icon: 'Home', order: 1, visible: true },
  { id: 'nav-about', label: 'About', tab: 'about', icon: 'User', order: 2, visible: true },
  { id: 'nav-music', label: 'Music', tab: 'music', icon: 'Music', order: 3, visible: true },
  { id: 'nav-lyrics', label: 'Lyrics', tab: 'lyrics', icon: 'FileText', order: 4, visible: true },
  { id: 'nav-gallery', label: 'Gallery', tab: 'gallery', icon: 'Image', order: 5, visible: true },
  { id: 'nav-videos', label: 'Videos', tab: 'videos', icon: 'Video', order: 6, visible: true },
  { id: 'nav-projects', label: 'Projects', tab: 'projects', icon: 'Code', order: 7, visible: true },
  { id: 'nav-books', label: 'Books', tab: 'books', icon: 'BookOpen', order: 8, visible: true },
  { id: 'nav-social', label: 'Connect', tab: 'social', icon: 'Globe', order: 9, visible: true },
  { id: 'nav-contact', label: 'Contact', tab: 'contact', icon: 'Mail', order: 10, visible: true }
];

export const initialAppearance: AppearanceConfig = {
  themeMode: 'light',
  accentColor: 'neutral',
  borderRadius: 'md',
  cardStyle: 'minimal',
  animationIntensity: 'normal'
};

export const initialSEO: SEOConfig = {
  siteTitle: 'Arjun Bharti Mina',
  metaDescription: 'Discover the music, lyrics, digital tools, books, and artistic journey of Arjun Bharti Mina (ABM) — Indian rapper, lyricist, civil engineer and creator.',
  keywords: 'Arjun Bharti Mina, ABM, Desi Hip Hop, Indian Rapper, SKIT Jaipur, Rutba, Hindi Rap, Civil Engineering, Lyrics, Jaipur Artist',
  ogImageUrl: '/logo.png',
  twitterHandle: '@ArjunMinaABM'
};

export const initialYouTube: YouTubeSettings = {
  channelName: 'Arjun Bharti Mina Official',
  channelUrl: 'https://youtube.com/@arjunbhartimina',
  channelLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  channelBanner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
  subscribersCount: '12.8K+',
  description: 'Official home for music videos, lyrical breakdowns, behind-the-scenes vlogs, and creative acoustic sessions.',
  featuredVideoId: 'fJ9rUzIMcZQ',
  playlistLinks: [
    { title: 'Official Music Videos', url: 'https://youtube.com/@arjunbhartimina/playlists' },
    { title: 'Acoustic & Studio Sessions', url: 'https://youtube.com/@arjunbhartimina/playlists' },
    { title: 'Shorts & Studio Vlogs', url: 'https://youtube.com/@arjunbhartimina/shorts' }
  ]
};

export const initialAnalytics: SiteAnalytics = {
  pageViews: 1,
  uniqueVisitors: 1,
  tabViews: {
    home: 1,
    about: 0,
    music: 0,
    lyrics: 0,
    gallery: 0,
    videos: 0,
    projects: 0,
    books: 0,
    social: 0,
    contact: 0,
  },
  songPlays: {},
  projectClicks: {},
  searches: [],
  dailyActivity: [{ date: new Date().toISOString().split('T')[0], views: 1, plays: 0 }],
  devices: { mobile: 0, desktop: 1, tablet: 0 },
  browsers: { Chrome: 1 },
  interactionEvents: []
};

