import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Search, 
  ExternalLink, 
  Sparkles,
  Layers
} from 'lucide-react';

interface MediaAsset {
  id: string;
  url: string;
  title: string;
  source: 'Profile' | 'Song Cover' | 'Gallery' | 'Project' | 'Book' | 'Video';
}

export const MediaLibraryTab: React.FC = () => {
  const { profile, songs, gallery, projects, books, videos, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Aggregate all media assets
  const assets: MediaAsset[] = [
    {
      id: 'media-prof-1',
      url: profile.profileImage,
      title: 'Profile Avatar',
      source: 'Profile'
    },
    {
      id: 'media-prof-2',
      url: profile.heroImage,
      title: 'Hero Banner Image',
      source: 'Profile'
    },
    ...songs.map((s, idx) => ({
      id: `media-song-${idx}`,
      url: s.cover,
      title: `Song Cover: ${s.title}`,
      source: 'Song Cover' as const
    })),
    ...gallery.map((g, idx) => ({
      id: `media-gal-${idx}`,
      url: g.url,
      title: `Gallery: ${g.title}`,
      source: 'Gallery' as const
    })),
    ...projects.map((p, idx) => ({
      id: `media-proj-${idx}`,
      url: p.image,
      title: `Project: ${p.title}`,
      source: 'Project' as const
    })),
    ...books.map((b, idx) => ({
      id: `media-book-${idx}`,
      url: b.cover,
      title: `Book Cover: ${b.title}`,
      source: 'Book' as const
    })),
    ...videos.map((v, idx) => ({
      id: `media-vid-${idx}`,
      url: v.thumbnail,
      title: `Video Thumbnail: ${v.title}`,
      source: 'Video' as const
    }))
  ];

  const filteredAssets = assets.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Asset URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <span>Central Media & Image Library</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Inspect all images, artworks, poster graphics, and book jackets currently linked in your website.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-mono font-semibold">
          {assets.length} Assets Cataloged
        </span>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search media by title or source..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="aspect-square relative overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <img
                src={asset.url}
                alt={asset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-white font-medium backdrop-blur-sm">
                {asset.source}
              </span>
            </div>

            <div className="p-3 space-y-2">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                {asset.title}
              </h4>
              <p className="text-[10px] font-mono text-neutral-400 truncate">
                {asset.url}
              </p>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(asset.id, asset.url)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-neutral-500" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-neutral-400 hover:text-amber-500"
                  title="Open full size"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
