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
  Check,
  Globe
} from 'lucide-react';

export const SocialHubView: React.FC = () => {
  const { profile, socialLinks, openShare } = useStore();
  const [copiedLink, setCopiedLink] = React.useState<string | null>(null);

  const getIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('spotify')) return <Radio className="w-6 h-6 text-[#1DB954]" />;
    if (p.includes('youtube')) return <Video className="w-6 h-6 text-red-500" />;
    if (p.includes('instagram')) return <Instagram className="w-6 h-6 text-pink-500" />;
    if (p.includes('linkedin')) return <Linkedin className="w-6 h-6 text-blue-500" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-6 h-6 text-sky-400" />;
    if (p.includes('whatsapp')) return <MessageCircle className="w-6 h-6 text-emerald-400" />;
    if (p.includes('saavn') || p.includes('gaana') || p.includes('apple') || p.includes('music')) return <Music2 className="w-6 h-6 text-amber-500" />;
    return <Globe className="w-6 h-6 text-amber-500" />;
  };

  const copyChannelUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(name);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div id="social-hub-view" className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
          Digital Presence & Social Matrix
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Find Me Everywhere
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Connect across streaming portals, creative visual channels, engineering networks, and direct communication hubs.
        </p>
      </div>

      {/* Grid of Verified Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialLinks.map((link) => (
          <div
            key={link.id}
            id={`channel-card-${link.id}`}
            className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60">
                    {getIcon(link.platform)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors">
                      {link.platform}
                    </h3>
                    <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      {link.username}
                    </p>
                  </div>
                </div>

                {link.badge && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                    {link.badge}
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {link.description}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span>Visit {link.platform}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => copyChannelUrl(link.url, link.platform)}
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                title="Copy Link"
              >
                {copiedLink === link.platform ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => openShare({
                  title: `${link.platform} | ${profile.displayName || profile.name}`,
                  text: `Connect with ${profile.displayName || profile.name} on ${link.platform}: ${link.username}`,
                  url: link.url
                })}
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                title="Share Channel"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
