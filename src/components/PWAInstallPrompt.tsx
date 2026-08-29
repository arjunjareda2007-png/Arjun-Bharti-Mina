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
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm pointer-events-auto"
      >
        <motion.div
          id="pwa-install-popup-card"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-neutral-950/95 text-white border border-neutral-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden"
        >
          {/* Subtle Ambient Gold Glow behind logo */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-36 h-36 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button in top corner */}
          <button
            id="pwa-install-close-btn"
            onClick={handleLaterClick}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header & App Icon */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white p-1 border-2 border-neutral-700 shadow-xl shrink-0 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Arjun Bharti Mina App Icon" 
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-neutral-950 text-neutral-950">
                <Sparkles className="w-2.5 h-2.5 fill-current" />
              </div>
            </div>

            <div className="min-w-0 flex-1 pr-6">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Official Web App
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight truncate">
                Arjun Bharti Mina
              </h3>
              <p className="text-[11px] text-neutral-400 font-medium">
                Fast, offline-ready & native experience
              </p>
            </div>
          </div>

          {/* User Requested Specific Description */}
          <div className="my-3 py-2 px-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 text-neutral-200">
            <p className="text-xs sm:text-sm font-semibold leading-relaxed text-neutral-100">
              Install Arjun Bharti Mina Personal Site As App
            </p>
          </div>

          {/* Two Action Buttons: Install or Later */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              id="pwa-later-btn"
              onClick={handleLaterClick}
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-xs sm:text-sm font-bold text-neutral-300 hover:text-white transition-all cursor-pointer text-center"
            >
              Later
            </button>

            <button
              id="pwa-install-action-btn"
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs sm:text-sm font-black transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Install</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
