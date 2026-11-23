import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ANIMATION_CONFIG } from '../../config/animation';
import { useContent } from '../../context/ContentContext';

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
  amount?: number;
  once?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  direction = 'up',
  duration = ANIMATION_CONFIG.scroll.defaultDuration,
  className = '',
  amount = ANIMATION_CONFIG.scroll.viewportAmount,
  once = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { content } = useContent();

  const animationsEnabled = content.site?.animations?.enabled !== false && !shouldReduceMotion;

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  const { yOffset, xOffset } = ANIMATION_CONFIG.scroll;

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: yOffset, x: 0 };
      case 'down':
        return { opacity: 0, y: -yOffset, x: 0 };
      case 'left':
        return { opacity: 0, x: -xOffset, y: 0 };
      case 'right':
        return { opacity: 0, x: xOffset, y: 0 };
      case 'none':
      default:
        return { opacity: 0, x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
};
