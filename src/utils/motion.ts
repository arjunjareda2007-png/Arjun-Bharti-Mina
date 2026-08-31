import { Transition, Variants } from 'motion/react';

// Premium Cinematic Easings
export const CINEMATIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const SOFT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
export const BOUNCELESS_SPRING = { type: 'spring', stiffness: 380, damping: 30 };
export const POP_SPRING = { type: 'spring', stiffness: 420, damping: 24 };

// Standard UI transitions
export const uiTransition: Transition = {
  duration: 0.35,
  ease: SMOOTH_EASE,
};

export const cinematicTransition: Transition = {
  duration: 0.85,
  ease: CINEMATIC_EASE,
};

// Masked text reveals
export const maskedTextContainer: Variants = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: delay,
    },
  }),
};

export const maskedTextItem: Variants = {
  hidden: { y: '105%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: CINEMATIC_EASE,
    },
  },
};

// Directional Slide In Variants
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -35 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: CINEMATIC_EASE,
    },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 35 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: CINEMATIC_EASE,
    },
  },
};

// Pop-Up Scale Variants
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 24,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: CINEMATIC_EASE,
    },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: CINEMATIC_EASE,
    },
  },
};

// Section scroll reveals
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: CINEMATIC_EASE,
    },
  },
};

export const cardStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const cardStaggerItem: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: CINEMATIC_EASE,
    },
  },
};

// Image reveals
export const imageRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.04,
    clipPath: 'inset(12% 0% 0% 0%)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      duration: 1.1,
      ease: CINEMATIC_EASE,
    },
  },
};

// Button micro-interaction motion presets
export const buttonMotion = {
  whileHover: { 
    scale: 1.03, 
    y: -2,
    transition: { duration: 0.2, ease: SMOOTH_EASE } 
  },
  whileTap: { 
    scale: 0.95,
    y: 0,
    transition: { duration: 0.1, ease: 'easeOut' } 
  },
};

export const iconSlideMotion = {
  initial: { x: 0 },
  whileHover: { x: 4, transition: { duration: 0.2, ease: SMOOTH_EASE } },
};

