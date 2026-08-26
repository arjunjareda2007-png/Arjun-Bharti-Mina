import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { GalleryItem } from '../../types';
import { Image, MapPin, Calendar, Tag, Maximize2, Share2 } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { gallery, openLightbox, openShare } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Music & Stage',
    'Behind The Scenes',
    'Creative Art',
    'Personal',
    'Travel',
    'Posters & Artwork'
  ];

  const filteredGallery = gallery.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );

  const handleQuickShare = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    openShare({
      type: 'image',
      title: `${item.title} — Photography by Arjun Bharti Mina`,
      text: `${item.description} Location: ${item.location || 'India'} (${item.date}).`,
      url: `${window.location.origin}/#gallery?id=${item.id}`,
      imageUrl: item.imageUrl,
      downloadFilename: `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`
    });
  };

  return (
    <div id="gallery-view" className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold block">
            Visual Portfolio & Media
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Photo Archive & Gallery
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Studio sessions, stage cyphers, structural engineering moments, Rajasthan landscapes, and digital artwork.
          </p>
        </div>

        <span className="text-xs font-mono text-neutral-500">
          {gallery.length} Archival Photographs
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => openLightbox(item)}
            className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-2xl cursor-pointer transition-all duration-300"
          >
            <img 
              src={item.imageUrl} 
              alt={item.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop';
              }}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Hover Info Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 sm:p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500 text-neutral-950 font-bold">
                  {item.category}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleQuickShare(e, item)}
                    className="p-1.5 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black backdrop-blur-sm text-white transition-colors"
                    title="Share Photo"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold">{item.title}</h3>
                <p className="text-[11px] text-neutral-300 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-3 pt-1 text-[10px] font-mono text-neutral-400">
                  {item.location && <span>📍 {item.location}</span>}
                  <span>📅 {item.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
