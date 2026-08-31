import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { Download, Sparkles, X, Smartphone, ArrowRight } from 'lucide-react';
import { hapticBeat, hapticLight, hapticSelection } from '../utils/haptics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const { showToast } = useStore();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('abm_pwa_dismissed_session') === 'true';
  });

  useEffect(() => {
    // Check if already running in standalone PWA mode
    if (
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    ) {
      setIsInstalled(true);
      return;
    }

    // Delay prompt appearance slightly on entry for smooth presentation
    const timer = setTimeout(() => {
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 1200);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      (window as any).deferredPwaPrompt = e;
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      (window as any).deferredPwaPrompt = null;
      showToast('App installed successfully!', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [dismissed, showToast]);

  const handleInstallClick = async () => {
    hapticBeat();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsVisible(false);
        showToast('Thank you for installing Arjun Bharti Mina App!', 'success');
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions for iOS Safari / Chrome Desktop
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        showToast('Tap Share (⎋) in Safari, then select "Add to Home Screen"', 'info');
      } else {
        showToast('Click browser menu (⋮) -> "Install App" or "Add to Home screen"', 'info');
      }
      setIsVisible(false);
      setDismissed(true);
      sessionStorage.setItem('abm_pwa_dismissed_session', 'true');
    }
  };

  const handleLaterClick = () => {
    hapticLight();
    setIsVisible(false);
    setDismissed(true);
    sessionStorage.setItem('abm_pwa_dismissed_session', 'true');
  };

  if (isInstalled || !isVisible || dismissed) return null;

  return (
    <AnimatePresence>
      <div 
        id="pwa-install-popup-overlay"
        className="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md pointer-events-auto"
      >
        <motion.div
          id="pwa-install-popup-card"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm sm:max-w-md bg-neutral-900/95 text-white border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden"
        >
          {/* Subtle Accent Radial Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            id="pwa-install-close-btn"
            onClick={handleLaterClick}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          {/* App Info Header */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white p-1.5 border border-neutral-700/60 shadow-lg shrink-0 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Arjun Bharti Mina App" 
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <div className="min-w-0 flex-1 pt-0.5 pr-6">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                Arjun Bharti Mina
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Add to your home screen for instantaneous access, offline discography, and reading mode.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-2">
            <button
              id="pwa-later-btn"
              type="button"
              onClick={handleLaterClick}
              className="flex-1 py-3 px-4 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-neutral-700/50 text-center"
            >
              Not Now
            </button>

            <button
              id="pwa-install-action-btn"
              type="button"
              onClick={handleInstallClick}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <Download className="w-4 h-4 stroke-[2.2]" />
              <span>Install App</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
