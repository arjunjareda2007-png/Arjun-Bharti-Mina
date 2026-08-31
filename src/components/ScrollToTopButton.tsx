import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { hapticMedium, hapticSelection } from '../utils/haptics';
import { SMOOTH_EASE } from '../utils/motion';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    hapticMedium();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="scroll-to-top-btn"
          type="button"
          onClick={scrollToTop}
          onMouseEnter={() => hapticSelection()}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25, ease: SMOOTH_EASE }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-20 md:bottom-8 right-5 sm:right-8 z-40 p-3 rounded-full bg-neutral-900/90 dark:bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-neutral-700/60 hover:border-neutral-500 transition-colors flex items-center justify-center cursor-pointer group"
          aria-label="Scroll smoothly back to top"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5 text-amber-400 dark:text-amber-400 group-hover:text-white" style={{ color: 'var(--color-accent-primary, #f59e0b)' }} />
          
          {/* Subtle Ambient Pulse Ring */}
          <span 
            className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
            style={{ backgroundColor: 'var(--color-accent-primary, #f59e0b)' }}
            aria-hidden="true"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
