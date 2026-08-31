import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { FeaturedIcon } from '../types';
import { 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Edit3, 
  Globe, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Play
} from 'lucide-react';
import { hapticMedium, hapticLight } from '../utils/haptics';
import { AddEditFeaturedIconModal } from './AddEditFeaturedIconModal';

export const FeaturedIconsStrip: React.FC = () => {
  const { 
    featuredIcons, 
    isOwner, 
    recordInteraction,
    setCurrentTab
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIconForEdit, setSelectedIconForEdit] = useState<FeaturedIcon | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Filter only visible icons and sort by displayOrder
  const visibleIcons = (featuredIcons || [])
    .filter(icon => icon.visible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const shouldAutoScroll = visibleIcons.length > 4;

  const handleIconClick = (icon: FeaturedIcon, e: React.MouseEvent) => {
    // If owner clicked the edit button specifically, don't open link
    if ((e.target as HTMLElement).closest('.edit-action-btn')) {
      return;
    }

    hapticMedium();
    recordInteraction('featured_icon_click', icon.title);

    if (icon.redirectUrl) {
      window.open(icon.redirectUrl, icon.openInNewTab !== false ? '_blank' : '_self', 'noopener,noreferrer');
    }
  };

  const handleOpenAddModal = () => {
    hapticLight();
    setSelectedIconForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (icon: FeaturedIcon, e: React.MouseEvent) => {
    e.stopPropagation();
    hapticLight();
    setSelectedIconForEdit(icon);
    setIsModalOpen(true);
  };

  if (visibleIcons.length === 0 && !isOwner) {
    return null;
  }

  // Duplicate items for seamless continuous looping marquee when > 4 items
  const marqueeItems = shouldAutoScroll 
    ? [...visibleIcons, ...visibleIcons, ...visibleIcons] 
    : visibleIcons;

  return (
    <>
      <motion.section
        id="featured-portals-strip"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full mt-6 mb-2 rounded-3xl bg-neutral-900/60 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/90 backdrop-blur-xl p-4 sm:p-6 shadow-xl relative overflow-hidden transition-colors"
      >
        {/* Subtle Ambient Background Glow */}
        <div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-24 rounded-full blur-3xl pointer-events-none opacity-20 dark:opacity-30" 
          style={{ background: 'var(--color-accent-primary, #f59e0b)' }}
        />

        {/* Strip Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-200/60 dark:border-neutral-800/80 relative z-10">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs text-white"
              style={{ backgroundColor: 'var(--color-accent-primary, #f59e0b)' }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider font-display text-neutral-900 dark:text-white">
                  Featured Platforms & Streaming Portals
                </h3>
                {shouldAutoScroll && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    <span>Auto-scrolling</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Click any icon to jump directly into official music channels, stores, and repositories
              </p>
            </div>
          </div>

          {/* Owner Management Shortcuts */}
          {isOwner && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Icon</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  hapticLight();
                  setCurrentTab('admin');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-200/80 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="Manage in Admin"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline">Admin Hub</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty State when no icons configured */}
        {visibleIcons.length === 0 && (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-neutral-400">No featured platform icons added yet.</p>
            {isOwner && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Your First Platform Icon</span>
              </button>
            )}
          </div>
        )}

        {/* ICONS CONTAINER */}
        {visibleIcons.length > 0 && (
          <div 
            className="relative w-full overflow-hidden py-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Left & Right Edge Gradient Fade Overlays for Infinite Loop illusion */}
            {shouldAutoScroll && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-neutral-900/90 dark:from-neutral-900/95 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-neutral-900/90 dark:from-neutral-900/95 to-transparent z-10 pointer-events-none" />
              </>
            )}

            {/* Scrolling / Grid Track */}
            <div
              className={`flex items-center gap-3.5 ${
                shouldAutoScroll 
                  ? 'marquee-track' 
                  : 'flex-wrap justify-center sm:justify-start'
              }`}
              style={{
                width: shouldAutoScroll ? 'max-content' : '100%',
                animationPlayState: isHovered ? 'paused' : 'running'
              }}
            >
              {marqueeItems.map((icon, index) => {
                const uniqueKey = `${icon.id}-${index}`;
                return (
                  <div
                    key={uniqueKey}
                    onClick={(e) => handleIconClick(icon, e)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleIconClick(icon, e as any);
                      }
                    }}
                    className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-neutral-950/80 border border-neutral-200/80 dark:border-neutral-800/90 hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer shrink-0 select-none min-w-[170px] sm:min-w-[190px]"
                  >
                    {/* Icon Graphic */}
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                      {icon.iconImage ? (
                        <img
                          src={icon.iconImage}
                          alt={icon.title}
                          className="w-full h-full object-contain filter drop-shadow-xs"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Globe className="w-5 h-5 text-amber-500" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                          {icon.title}
                        </span>
                        {icon.badge && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/20 shrink-0 font-semibold">
                            {icon.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {icon.subtitle || 'Open Link'}
                      </p>
                    </div>

                    {/* External Arrow Indicator */}
                    <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 flex items-center justify-center transition-colors shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>

                    {/* Owner Quick Edit Pencil Button */}
                    {isOwner && (
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditModal(icon, e)}
                        className="edit-action-btn absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-neutral-900 border border-amber-500/60 text-amber-400 hover:bg-amber-500 hover:text-neutral-950 transition-all shadow-md z-20"
                        title="Edit this icon"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.section>

      {/* Add / Edit Icon Modal */}
      {isModalOpen && (
        <AddEditFeaturedIconModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedIconForEdit(null);
          }}
          iconToEdit={selectedIconForEdit}
        />
      )}

      {/* Custom CSS for seamless continuous horizontal marquee animation */}
      <style>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }
        .marquee-track {
          display: flex;
          animation: marqueeScroll 24s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
};
