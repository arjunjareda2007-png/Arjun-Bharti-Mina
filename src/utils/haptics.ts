/**
 * Web Haptic Feedback Utility
 * Provides multi-tier vibration feedback for touch and click interactions on supported devices.
 */

export type HapticPattern = 
  | 'micro'
  | 'tick'
  | 'detent'
  | 'selection'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'beat'
  | 'boundary'
  | 'double';

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  micro: 3,
  tick: 4,
  detent: 5,
  selection: 6,
  light: 12,
  medium: 25,
  heavy: 45,
  boundary: 8,
  success: [8, 30, 15],
  warning: [20, 40, 20],
  error: [30, 40, 30, 40, 30],
  beat: [12, 25, 18],
  double: [10, 50, 10]
};

export const triggerHaptic = (pattern: HapticPattern = 'light') => {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      const val = HAPTIC_PATTERNS[pattern] || 15;
      navigator.vibrate(val);
    } catch {
      // Ignore vibration errors on unsupported or permission-restricted environments
    }
  }
};

export const hapticTick = () => triggerHaptic('tick');
export const hapticDetent = () => triggerHaptic('detent');
export const hapticBoundary = () => triggerHaptic('boundary');
export const hapticSelection = () => triggerHaptic('selection');
export const hapticLight = () => triggerHaptic('light');
export const hapticMedium = () => triggerHaptic('medium');
export const hapticHeavy = () => triggerHaptic('heavy');
export const hapticSuccess = () => triggerHaptic('success');
export const hapticBeat = () => triggerHaptic('beat');
export const hapticError = () => triggerHaptic('error');
