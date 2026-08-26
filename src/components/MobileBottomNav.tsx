import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ActiveTab } from '../types';
import { hapticSelection, hapticMedium } from '../utils/haptics';
import { Sparkles, Music2, FileText, BookOpen, LayoutGrid } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, isMenuOpen, toggleMenu, closeMenu } = useStore();

  const mainTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'music', label: 'Music', icon: <Music2 className="w-5 h-5" /> },
    { id: 'lyrics', label: 'Lyrics', icon: <FileText className="w-5 h-5" /> },
    { id: 'books', label: 'Books', icon: <BookOpen className="w-5 h-5" /> },
  ];

  const isSecondaryTabActive = !mainTabs.some(t => t.id === currentTab) && currentTab !== 'admin';

  return (
    <nav 
      id="mobile-bottom-nav" 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 border-t border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-xl transition-all duration-200 px-3 py-1.5 pb-safe shadow-lg"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {mainTabs.map((tab) => {
          const isActive = currentTab === tab.id && !isMenuOpen;
          return (
            <motion.button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                hapticSelection();
                setCurrentTab(tab.id);
                closeMenu();
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer select-none ${
                isActive 
                  ? 'text-amber-600 dark:text-amber-400 font-bold' 
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <motion.span 
                    layoutId="mobileNavActiveDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-xs shadow-amber-500" 
                  />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </motion.button>
          );
        })}

        {/* Master Menu & All Sections Button */}
        <motion.button
          id="mobile-tab-menu"
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={() => {
            hapticMedium();
            toggleMenu();
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer select-none ${
            isMenuOpen || isSecondaryTabActive
              ? 'text-amber-600 dark:text-amber-400 font-bold' 
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
          aria-label="Toggle Full Menu & Sections"
        >
          <div className="relative">
            <LayoutGrid className="w-5 h-5" />
            {(isMenuOpen || isSecondaryTabActive) && (
              <motion.span 
                layoutId="mobileNavActiveDot"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-xs shadow-amber-500" 
              />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">
            {isMenuOpen ? 'Close' : 'Menu'}
          </span>
        </motion.button>
      </div>
    </nav>
  );
};
