import React from 'react';
import { useStore } from '../context/StoreContext';
import { ActiveTab } from '../types';
import { ArrowUp, Heart, Sparkles, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { profile, setCurrentTab, socialLinks } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'music', label: 'Music' },
    { id: 'lyrics', label: 'Lyrics' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'videos', label: 'Videos' },
    { id: 'projects', label: 'Projects' },
    { id: 'books', label: 'Books' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <footer id="main-footer" className="w-full border-t border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-950/60 pt-12 pb-24 md:pb-16 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tier */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-200 dark:border-neutral-900">
          
          {/* Column 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-display font-black flex items-center justify-center text-xs tracking-wider shadow-xs">
                ABM
              </div>
              <span className="font-display font-bold text-neutral-900 dark:text-neutral-100 tracking-tight text-base sm:text-lg">
                {profile.name}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
              Independent Indian music artist, rapper, songwriter, civil engineer, and creative technologist. Exploring the synergy between rhythm, rhyme, structural design, and digital experiences.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-neutral-500 font-mono">
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <a href={`mailto:${profile.email}`} className="hover:text-amber-500 transition-colors underline-offset-4 hover:underline">
                {profile.email}
              </a>
            </div>
          </div>

          {/* Column 2: Archive Index */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-3 font-mono">
              Digital Archive
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setCurrentTab(link.id);
                      scrollToTop();
                    }}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social & Streaming */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-3 font-mono">
              Connect Online
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {socialLinks.slice(0, 6).map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-neutral-200/60 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-amber-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                >
                  {soc.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Back to top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-500">
          <p className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Arjun Bharti Mina (ABM). All rights reserved.</span>
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              Built with precision <Sparkles className="w-3 h-3 text-amber-500" />
            </span>
            <button
              onClick={scrollToTop}
              id="footer-back-to-top-btn"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all text-xs"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
