import { useEffect, useRef } from 'react';
import { triggerHaptic } from './haptics';

/**
 * Velocity-Adaptive Silky Scroll Haptics Engine
 * Provides smooth, realistic mechanical detent feedback during scrolling.
 * Dynamically adjusts tick frequency, pulse strength, and interval spacing based on scroll velocity.
 */
export const useScrollHaptics = (enabled: boolean = true) => {
  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(0);
  const accumulatedDistance = useRef(0);
  const lastHapticTime = useRef(0);
  const atTopBoundary = useRef(true);
  const atBottomBoundary = useRef(false);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Respect accessibility reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    lastScrollY.current = window.scrollY;
    lastTimestamp.current = performance.now();
    atTopBoundary.current = window.scrollY <= 4;

    const onScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollY.current;
      const absDelta = Math.abs(deltaY);
      const timeDelta = Math.max(1, now - lastTimestamp.current);

      // Calculate instantaneous scroll velocity in pixels per millisecond
      const velocity = absDelta / timeDelta;

      lastScrollY.current = currentY;
      lastTimestamp.current = now;

      // 1. Boundary detent feedback (Top edge)
      if (currentY <= 2) {
        if (!atTopBoundary.current && now - lastHapticTime.current > 250) {
          triggerHaptic('boundary');
          lastHapticTime.current = now;
        }
        atTopBoundary.current = true;
      } else {
        atTopBoundary.current = false;
      }

      // 2. Boundary detent feedback (Bottom edge)
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (maxScroll > 100 && currentY >= maxScroll - 4) {
        if (!atBottomBoundary.current && now - lastHapticTime.current > 250) {
          triggerHaptic('boundary');
          lastHapticTime.current = now;
        }
        atBottomBoundary.current = true;
      } else {
        atBottomBoundary.current = false;
      }

      // 3. Dynamic detent distance & throttling scaled by scroll speed
      // - Slow browsing (< 0.4 px/ms): ~90px step, crisp 4ms micro-tick (luxurious watch crown feel)
      // - Normal scrolling (0.4 - 1.2 px/ms): ~150px-220px step
      // - Fast fling (> 1.2 px/ms): ~320px step, throttled to prevent motor fatigue
      let dynamicThreshold = 95;
      let minIntervalMs = 80;
      let hapticType: 'micro' | 'tick' | 'detent' = 'micro';

      if (velocity < 0.35) {
        dynamicThreshold = 85;
        minIntervalMs = 75;
        hapticType = 'tick';
      } else if (velocity < 0.9) {
        dynamicThreshold = 140;
        minIntervalMs = 100;
        hapticType = 'micro';
      } else {
        dynamicThreshold = 280;
        minIntervalMs = 140;
        hapticType = 'micro';
      }

      accumulatedDistance.current += absDelta;

      if (
        accumulatedDistance.current >= dynamicThreshold &&
        now - lastHapticTime.current >= minIntervalMs
      ) {
        triggerHaptic(hapticType);
        lastHapticTime.current = now;
        accumulatedDistance.current = 0;
      }

      // Clear accumulated momentum when scrolling pauses
      isScrolling.current = true;
      if (scrollTimeout.current !== null) {
        window.clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = window.setTimeout(() => {
        isScrolling.current = false;
        accumulatedDistance.current = 0;
      }, 150);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimeout.current !== null) {
        window.clearTimeout(scrollTimeout.current);
      }
    };
  }, [enabled]);
};
