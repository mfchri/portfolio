/**
 * =====================================================================
 * ANIMATION CONFIGURATION
 * =====================================================================
 * Centralized settings for typewriter speeds, delays, cursor blinking,
 * and scroll-triggered motion throughout the portfolio.
 */

export const ANIMATION_CONFIG = {
  typewriter: {
    // Initial delay before typing begins on page load
    initialDelay: 250,

    // Typing speed per character (in ms)
    charSpeedGreeting: 110, // for "Hello" (~550ms)
    charSpeedBio: 28,       // for the bio tagline (~2-3s)
    roleTypeSpeed: 40,      // for rotating role text
    roleDeleteSpeed: 20,    // for backspacing/deleting role text
    rolePauseTime: 2000,    // pause (in ms) before deleting the role

    // Blinking cursor settings
    cursorBlinkSpeed: '1s',
    // Milliseconds after final typing completes before cursor hides (set to 0 for infinite blink)
    cursorHideAfter: 2000,
  },

  // Multiplier applied based on user setting in Admin ("slow" | "normal" | "fast")
  speedMultipliers: {
    slow: 1.4,
    normal: 1.0,
    fast: 0.6,
  },

  // Scroll animations via framer-motion
  scroll: {
    viewportAmount: 0.25, // triggered when 25% of element is in view
    defaultDuration: 0.7, // seconds
    staggerDelay: 0.15,   // seconds between staggered children
    chipStaggerDelay: 0.04, // seconds between skills chips
    yOffset: 24,          // vertical translation offset in px
    xOffset: 32,          // horizontal translation offset in px
  },
};
