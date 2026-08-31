import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ActiveTab } from '../types';
import { hapticSelection, hapticMedium } from '../utils/haptics';
import { SMOOTH_EASE } from '../utils/motion';
import { getThemePreset } from '../utils/themePresets';
import { Sparkles, Music2, FileText, BookOpen, LayoutGrid } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, isMenuOpen, toggleMenu, closeMenu, theme } = useStore();

  const activePreset = getThemePreset(theme);
  const themeAccentHex = activePreset?.accentHex || '#f59e0b';

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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 border-t border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-xl transition-colors duration-200 px-3 py-1.5 pb-safe shadow-lg"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {mainTabs.map((tab) => {
          const isActive = currentTab === tab.id && !isMenuOpen;
          return (
            <motion.button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              type="button"
              whileTap={{ scale: 0.9 }}
              animate={{ y: isActive ? -2 : 0 }}
              transition={{ duration: 0.25, ease: SMOOTH_EASE }}
              onClick={() => {
                hapticSelection();
                setCurrentTab(tab.id);
                closeMenu();
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors duration-200 cursor-pointer select-none ${
                isActive 
                  ? 'font-bold' 
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              style={{
                color: isActive ? themeAccentHex : undefined
              }}
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.icon}
                </motion.div>
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 transition-all ${isActive ? 'font-bold scale-105' : 'font-medium'}`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}

        {/* Master Menu & All Sections Button */}
        <motion.button
          id="mobile-tab-menu"
          type="button"
          whileTap={{ scale: 0.9 }}
          animate={{ y: isMenuOpen || isSecondaryTabActive ? -2 : 0 }}
          transition={{ duration: 0.25, ease: SMOOTH_EASE }}
          onClick={() => {
            hapticMedium();
            toggleMenu();
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors duration-200 cursor-pointer select-none ${
            isMenuOpen || isSecondaryTabActive
              ? 'font-bold' 
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
          style={{
            color: (isMenuOpen || isSecondaryTabActive) ? themeAccentHex : undefined
          }}
          aria-label="Toggle Full Menu & Sections"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: isMenuOpen || isSecondaryTabActive ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <LayoutGrid className="w-5 h-5" />
            </motion.div>
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 transition-all ${isMenuOpen || isSecondaryTabActive ? 'font-bold scale-105' : 'font-medium'}`}>
            {isMenuOpen ? 'Close' : 'Menu'}
          </span>
        </motion.button>
      </div>
    </nav>
  );
};

