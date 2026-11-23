import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionLabel } from './SectionLabel';
import { useContent } from '../context/ContentContext';
import { FadeIn } from './motion/FadeIn';
import { Stagger, StaggerItem } from './motion/Stagger';

export const Experience: React.FC = () => {
  const { content } = useContent();
  const shouldReduceMotion = useReducedMotion();
  const experience = content.experience || {};
  const items = experience.items || [];

  const animationsEnabled = content.site?.animations?.enabled !== false && !shouldReduceMotion;

  const scrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="experience"
      className="min-h-[100svh] min-h-screen w-full bg-page flex flex-col justify-center py-20 lg:py-24 border-b border-border overflow-x-clip"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12 w-full">
        {/* Top Header Row: Label + Heading fade up first */}
        <FadeIn direction="up" delay={0}>
          <div className="mb-10 sm:mb-12">
            {experience.sectionLabel && (
              <SectionLabel label={experience.sectionLabel} className="mb-4" />
            )}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              {experience.heading && (
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tightest text-primary leading-[1.1] max-w-xl">
                  {experience.heading}
                </h2>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-8 max-w-md">
                {experience.paragraph && (
                  <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                    {experience.paragraph}
                  </p>
                )}
                {experience.ctaText && (
                  <button
                    type="button"
                    onClick={() => scrollTo(experience.ctaTargetId || 'contact')}
                    className="shrink-0 inline-flex items-center text-sm font-semibold text-primary hover:opacity-75 transition-opacity underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded py-1"
                  >
                    {experience.ctaText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Divider line that grows from left to right */}
        {animationsEnabled ? (
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-[1px] w-full bg-border origin-left"
          />
        ) : (
          <div className="h-[1px] w-full bg-border" />
        )}

        {/* Staggered Experience Rows */}
        {items.length > 0 ? (
          <Stagger staggerDelay={0.15} delay={0.1} className="divide-y divide-border">
            {items.map((item, index) => (
              <StaggerItem key={item.id || index} direction="up">
                <div className="py-6 sm:py-8 px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-card-sm hover:bg-page-alt/60 hover:-translate-y-1 transition-all duration-200 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                  {/* Column 1: Job title, Company, Location, Date with dot */}
                  <div className="md:col-span-4 space-y-1">
                    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-primary">
                      {item.title}
                    </h3>
                    <div className="text-sm font-medium text-primary/90">
                      {item.company}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-secondary">
                      {item.location && <span>{item.location}</span>}
                      {item.location && item.period && <span className="text-border">•</span>}
                      {item.period && <span>{item.period}</span>}
                    </div>
                  </div>

                  {/* Column 2: Short description */}
                  <div className="md:col-span-5">
                    <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Column 3: Pill tags aligned right */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="md:col-span-3 flex flex-wrap md:justify-end gap-1.5">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-normal border border-border text-secondary bg-transparent hover:border-primary/50 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="py-12 text-center text-sm text-secondary border border-dashed border-border rounded-xl mt-4">
            No experience entries added yet.
          </div>
        )}

        {/* Bottom divider line */}
        {animationsEnabled ? (
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-[1px] w-full bg-border origin-left"
          />
        ) : (
          <div className="h-[1px] w-full bg-border" />
        )}
      </div>
    </section>
  );
};
