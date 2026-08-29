import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt degrees (e.g. 5)
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  id?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 5,
  onClick,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [canTilt, setCanTilt] = useState(false);

  // Smooth springs for rotation
  const rotateX = useSpring(0, { stiffness: 260, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 24 });

  useEffect(() => {
    // Only enable on desktop pointer with no reduced-motion preference
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCanTilt(isFinePointer && !prefersReducedMotion);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates between -0.5 and +0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // RotateX is driven by mouseY (inverting sign so tilting toward mouse feels natural)
    rotateX.set(-mouseY * maxTilt);
    rotateY.set(mouseX * maxTilt);
  };

  const handleMouseLeave = () => {
    if (!canTilt) return;
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      id={id}
      style={canTilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};
