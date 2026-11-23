import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ANIMATION_CONFIG } from '../../config/animation';
import { useContent } from '../../context/ContentContext';

export interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
  amount?: number;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  staggerDelay = ANIMATION_CONFIG.scroll.staggerDelay,
  delay = 0,
  className = '',
  amount = ANIMATION_CONFIG.scroll.viewportAmount,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { content } = useContent();

  const animationsEnabled = content.site?.animations?.enabled !== false && !shouldReduceMotion;

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export interface StaggerItemProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  direction = 'up',
  duration = ANIMATION_CONFIG.scroll.defaultDuration,
  className = '',
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

  const itemVariants: Variants = {
    hidden: getInitialPosition(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className} style={{ willChange: 'opacity, transform' }}>
      {children}
    </motion.div>
  );
};
