import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Radio, 
  Video, 
  Instagram, 
  Linkedin, 
  Twitter, 
  ExternalLink, 
  Sparkles, 
  MessageCircle, 
  Music2, 
  Share2,
  Copy,
  Check
} from 'lucide-react';

export const SocialHubView: React.FC = () => {
  const { profile, openShare } = useStore();
  const [copiedLink, setCopiedLink] = React.useState<string | null>(null);

  const channels = [
    {
      name: 'Spotify Artist Profile',
      handle: 'Arjun Bharti Mina',
      description: 'Stream all official discography singles, albums and curated playlists.',
      url: profile.socialLinks.spotify,
      icon: <Radio className="w-6 h-6 text-[#1DB954]" />,
      bgColor: 'bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border-[#1DB954]/30',
      badge: 'Official Artist'
    },
    {
      name: 'YouTube Channel',
      handle: '@arjunbhartimina',
      description: 'Official music videos, studio recordings, cyphers, and engineering vlogs.',
      url: profile.socialLinks.youtube,
      icon: <Video className="w-6 h-6 text-red-500" />,
      bgColor: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30',
      badge: `${profile.stats.youtubeSubs} Subscribers`
    },
    {
      name: 'Instagram',
      handle: '@arjunbhartimina',
      description: 'Daily life, behind-the-scenes stories, aesthetic reels, and artwork drops.',
      url: profile.socialLinks.instagram,
      icon: <Instagram className="w-6 h-6 text-pink-500" />,
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30',
      badge: 'Visual Journal'
    },
    {
      name: 'LinkedIn',
      handle: 'in/arjunbhartimina',
      description: 'Civil engineering portfolio, academic research, and tech collaborations.',
      url: profile.socialLinks.linkedin,
      icon: <Linkedin className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30',
      badge: 'SKIT Jaipur 2026'
    },
    {
      name: 'X (Twitter)',
      handle: '@arjunbhartimina',
      description: 'Thoughts on Indian music, engineering innovation, and philosophy.',
      url: profile.socialLinks.twitter,
      icon: <Twitter className="w-6 h-6 text-sky-400" />,
      bgColor: 'bg-sky-400/10 hover:bg-sky-400/20 border-sky-400/30',
      badge: 'Thoughts & Threads'
    },
    {
      name: 'JioSaavn',
      handle: 'Arjun Bharti Mina',
      description: 'Listen to Desi Hip-Hop singles and high-res audio tracks.',
      url: profile.socialLinks.jiosaavn,
      icon: <Music2 className="w-6 h-6 text-emerald-500" />,
      bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30',
      badge: 'Indian Music'
    },
    {
      name: 'Gaana',
      handle: 'Arjun Bharti Mina',
      description: 'Stream verified Hindi rap tracks on India’s classic audio service.',
      url: profile.socialLinks.gaana,
      icon: <Radio className="w-6 h-6 text-rose-500" />,
      bgColor: 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30',
      badge: 'Streaming'
    },
    {
      name: 'WhatsApp Community & Direct',
      handle: '+91 80009 54060',
      description: 'Official WhatsApp contact for music bookings and instant updates.',
      url: 'https://wa.me/918000954060?text=Hi%20Arjun,%20reaching%20out%20via%20your%20website',
      icon: <MessageCircle className="w-6 h-6 text-emerald-400" />,
      bgColor: 'bg-emerald-400/10 hover:bg-emerald-400/20 border-emerald-400/30',
      badge: 'Instant Connect'
    }
  ];

  const copyChannelUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(name);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div id="social-hub-view" className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
          Digital Presence & Social Matrix
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Find Me Online
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Follow, stream, subscribe, and connect across all official online channels and streaming networks.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {channels.map((ch) => (
          <div
            key={ch.name}
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${ch.bgColor} group`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm">
                  {ch.icon}
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase bg-neutral-900/10 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
                  {ch.badge}
                </span>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {ch.name}
                </h2>
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 block">
                  {ch.handle}
                </span>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
                  {ch.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-900/10 dark:border-white/10 flex items-center justify-between">
              <a
                href={ch.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 hover:underline"
              >
                <span>Visit Platform</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => copyChannelUrl(ch.url, ch.name)}
                className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1"
                title="Copy Link"
              >
                {copiedLink === ch.name ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono">
                    <Check className="w-3.5 h-3.5" /> Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-mono">
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
