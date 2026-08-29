import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'view'>('default');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor follower
  const springX = useSpring(mouseX, { stiffness: 450, damping: 32 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 32 });

  useEffect(() => {
    // Only enable on desktop fine pointer devices
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check element under cursor
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, textarea, [role="button"], .cursor-pointer, [data-cursor="pointer"]');
      const imageView = target.closest('[data-cursor="view"], .image-zoom-container, .aspect-video, .aspect-\\[4\\/5\\]');

      if (imageView && !interactive) {
        setCursorType('view');
      } else if (interactive) {
        setCursorType('pointer');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Precision Core Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white fixed top-0 left-0"
      />

      {/* Smooth Trailing Minimal Ring / Pill */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: cursorType === 'pointer' ? 1.4 : cursorType === 'view' ? 1.8 : 1,
          opacity: cursorType === 'default' ? 0.45 : 0.8,
          borderColor: cursorType === 'pointer' ? 'rgba(217, 119, 6, 0.8)' : 'currentColor',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-neutral-700 dark:border-neutral-300 text-neutral-900 dark:text-white flex items-center justify-center backdrop-blur-[1px]"
      >
        {cursorType === 'view' && (
          <span className="text-[8px] font-mono uppercase tracking-widest font-bold text-neutral-900 dark:text-white">
            View
          </span>
        )}
      </motion.div>
    </div>
  );
};
