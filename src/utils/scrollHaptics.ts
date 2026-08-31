import { useEffect, useRef } from 'react';
import { triggerHaptic } from './haptics';

/**
 * Global smooth scrolling haptics utility and hook.
 * Generates tactile mechanical scroll detents during page scroll on vibration-capable devices.
 */
export const useScrollHaptics = (enabled: boolean = true) => {
  const lastScrollY = useRef(0);
  const lastHapticTime = useRef(0);
  const accumulatedDistance = useRef(0);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Respect accessibility settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastScrollY.current);
      lastScrollY.current = currentY;

      // Accumulate smooth scroll distance
      accumulatedDistance.current += delta;

      const now = performance.now();
      // Trigger subtle haptic every 160px of continuous scrolling, throttled to max 1 tick per 90ms
      if (accumulatedDistance.current >= 160 && now - lastHapticTime.current >= 90) {
        triggerHaptic('selection');
        lastHapticTime.current = now;
        accumulatedDistance.current = 0;
      }
    };

    // Also trigger gentle haptic when touching scrollable containers
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled]);
};
