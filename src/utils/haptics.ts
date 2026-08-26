/**
 * Web Haptic Feedback Utility
 * Provides multi-tier vibration feedback for touch and click interactions on supported devices.
 */

export type HapticPattern = 
  | 'selection'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'beat'
  | 'double';

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  selection: 8,
  light: 15,
  medium: 30,
  heavy: 55,
  success: [12, 40, 20],
  warning: [25, 50, 25],
  error: [40, 50, 40, 50, 40],
  beat: [18, 30, 24],
  double: [15, 60, 15]
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

export const hapticSelection = () => triggerHaptic('selection');
export const hapticLight = () => triggerHaptic('light');
export const hapticMedium = () => triggerHaptic('medium');
export const hapticHeavy = () => triggerHaptic('heavy');
export const hapticSuccess = () => triggerHaptic('success');
export const hapticBeat = () => triggerHaptic('beat');
export const hapticError = () => triggerHaptic('error');
