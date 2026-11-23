import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { useTypewriter } from '../hooks/useTypewriter';
import { TypewriterGreeting, TypewriterBio } from './Typewriter';

export const Hero: React.FC = () => {
  const { content, isLoading } = useContent();
  const shouldReduceMotion = useReducedMotion();

  const personal = content.personal || {};
  const hero = content.hero || { stats: [] };
  const stats = hero.stats || [];
  const roles = hero.roles || [];
  const photoSrc = personal.profilePhoto?.src || '/images/profile-placeholder.png';
  const photoAlt = personal.profilePhoto?.alt || personal.name || 'Profile photo';

  const animationsEnabled = content.site?.animations?.enabled !== false && !shouldReduceMotion;
  const speed = content.site?.animations?.typingSpeed || 'normal';

  // Typewriter Hook
  const {
    typedGreeting,
    typedBioPrefix,
    typedRole,
    typedBioSuffix,
    fullBioPrefix,
    fullBioSuffix,
    isGreetingComplete,
    isInitialComplete,
    showGreetingCursor,
    showBioCursor,
    hasRoleRotation,
  } = useTypewriter({
    greetingText: personal.heroGreeting || 'Hello',
    bioText: personal.heroBioDash || `— I'm ${personal.name || 'Your Name'}, ${personal.title || 'IT Infrastructure Governance & Planning professional'}`,
    roles,
    enabled: animationsEnabled,
    speed,
    isReady: !isLoading,
  });

  const scrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find longest role for zero layout shift in ghost reservation
  const longestRole = roles.length > 0 ? [...roles].sort((a, b) => b.length - a.length)[0] : '';

  return (
    <section
      id="home"
      className="relative min-h-[100svh] min-h-screen w-full bg-page flex flex-col justify-between pt-24 pb-8 overflow-hidden"
    >
      {/* 
        ========================================================================
        LEFT EDGE VERTICAL LABELS (Desktop only, xl+)
        Fade in after typing finishes
        ========================================================================
      */}
      {(personal.heroVerticalTop || personal.heroVerticalBottom) && (
        <motion.div
          initial={animationsEnabled ? { opacity: 0 } : false}
          animate={{ opacity: isInitialComplete || !animationsEnabled ? 1 : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col justify-between h-[65vh] pointer-events-none z-30 select-none text-[11px] font-medium uppercase tracking-[0.2em] text-secondary"
          aria-hidden="true"
        >
          {personal.heroVerticalTop && (
            <span className="[writing-mode:vertical-rl] rotate-180 origin-center opacity-60">
              {personal.heroVerticalTop}
            </span>
          )}
          {personal.heroVerticalBottom && (
            <span className="[writing-mode:vertical-rl] rotate-180 origin-center opacity-60">
              {personal.heroVerticalBottom}
            </span>
          )}
        </motion.div>
      )}

      <div className="max-w-content mx-auto px-6 lg:px-12 w-full flex-1 flex flex-col justify-between relative z-10">
        
        {/* Top: Highlight Stats (Fade in after typing finishes) */}
        {stats.length > 0 && (
          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: -10 } : false}
            animate={{
              opacity: isInitialComplete || !animationsEnabled ? 1 : 0,
              y: isInitialComplete || !animationsEnabled ? 0 : -10,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pt-2 sm:pt-4"
          >
            <div className="flex items-center gap-8 sm:gap-14">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-secondary">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Center / Middle Content: Giant "Hello" + Under-title Bio */}
        <div className="my-auto py-8 sm:py-12 relative z-10 max-w-4xl">
          {/* Semantic Single H1 with Accessible Full Text */}
          <h1
            className="text-[clamp(5.5rem,22vw,20rem)] font-normal tracking-tightest leading-[0.85] text-primary select-none"
            aria-label={personal.heroGreeting || 'Hello'}
          >
            <TypewriterGreeting
              fullText={personal.heroGreeting || 'Hello'}
              typedText={typedGreeting}
              showCursor={showGreetingCursor}
              isComplete={isGreetingComplete || !animationsEnabled}
            />
          </h1>

          {/* Under-headline Bio Statement with zero layout shift */}
          <div className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg lg:text-xl font-normal text-secondary leading-relaxed">
            <TypewriterBio
              fullPrefix={fullBioPrefix}
              typedPrefix={typedBioPrefix}
              currentRole={typedRole}
              longestRole={longestRole}
              fullSuffix={fullBioSuffix}
              typedSuffix={typedBioSuffix}
              showCursor={showBioCursor}
              fullAriaLabel={personal.heroBioDash || ''}
              isComplete={isInitialComplete || !animationsEnabled}
              hasRoleRotation={hasRoleRotation}
            />
          </div>
        </div>

        {/* Bottom Bar: "Scroll down ↓" Link (Fades in after typing) */}
        {personal.scrollDownText && (
          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 10 } : false}
            animate={{
              opacity: isInitialComplete || !animationsEnabled ? 1 : 0,
              y: isInitialComplete || !animationsEnabled ? 0 : 10,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pt-4 flex items-center justify-between relative z-20"
          >
            <button
              type="button"
              onClick={() => scrollTo('profile')}
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-0.5"
            >
              <span>{personal.scrollDownText}</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* 
        ========================================================================
        EDITORIAL BLACK-AND-WHITE PORTRAIT (Bleeding to bottom right edge)
        Fades in smoothly from the start in parallel
        ========================================================================
      */}
      {photoSrc && (
        <motion.div
          initial={animationsEnabled ? { opacity: 0, scale: 0.98 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="absolute right-0 bottom-0 z-10 pointer-events-none flex items-end justify-end w-full lg:w-1/2 h-[45vh] sm:h-[55vh] lg:h-[68vh] max-h-[820px] overflow-hidden"
        >
          <img
            src={photoSrc}
            alt={photoAlt}
            className="h-full w-auto max-w-full object-contain object-bottom select-none transition-transform duration-500"
            style={{
              filter: 'grayscale(1) contrast(1.05)',
              mixBlendMode: 'multiply',
            }}
            loading="eager"
            width="750"
            height="950"
          />
        </motion.div>
      )}
    </section>
  );
};
