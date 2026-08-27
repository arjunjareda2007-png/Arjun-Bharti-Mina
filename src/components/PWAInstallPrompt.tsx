import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Download, X, CheckCircle2, Sparkles, Smartphone, Laptop } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const { showToast } = useStore();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    return localStorage.getItem('abm_pwa_dismissed') === 'true';
  });

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      (window as any).deferredPwaPrompt = e;
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      (window as any).deferredPwaPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        showToast('App installed successfully!', 'success');
      }
      setDeferredPrompt(null);
    } else {
      // Fallback message for Chrome desktop/mobile if prompt already fired or in standalone
      showToast('To install: Click Chrome menu (⋮) -> "Install App" or "Add to Home screen"', 'info');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('abm_pwa_dismissed', 'true');
  };

  if (isInstalled || dismissed) return null;

  return (
    <div 
      id="pwa-install-banner"
      className="fixed bottom-24 right-4 z-40 max-w-sm w-[calc(100vw-32px)] sm:w-auto bg-neutral-900/95 dark:bg-neutral-900/95 border border-amber-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 text-white"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md">
          ABM
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Install Web App</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-400 rounded">PWA</span>
            </h4>
            <button
              onClick={handleDismiss}
              className="text-neutral-400 hover:text-white p-0.5"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-neutral-300 mt-1 leading-snug">
            Install ABM Hub on your phone or desktop for instant offline access and native player controls.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Directly</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
