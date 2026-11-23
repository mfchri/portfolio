import React from 'react';
import { Shield, Cpu, Network } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { useContent } from '../context/ContentContext';
import { FadeIn } from './motion/FadeIn';
import { Stagger, StaggerItem } from './motion/Stagger';

export const Skills: React.FC = () => {
  const { content } = useContent();
  const skills = content.skills || {};
  const categories = skills.categories || [];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="w-5 h-5" aria-hidden="true" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" aria-hidden="true" />;
      case 'Network':
      default:
        return <Network className="w-5 h-5" aria-hidden="true" />;
    }
  };

  return (
    <section
      id="skills"
      className="min-h-[100svh] min-h-screen w-full bg-page-alt flex flex-col justify-center py-20 lg:py-24 border-b border-border overflow-x-clip"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12 w-full">
        {/* Header: Label + Heading fade up */}
        <FadeIn direction="up" delay={0}>
          <div className="mb-10 sm:mb-12">
            {skills.sectionLabel && (
              <SectionLabel label={skills.sectionLabel} className="mb-3" />
            )}
            {skills.heading && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tightest text-primary leading-[1.1]">
                {skills.heading}
              </h2>
            )}
          </div>
        </FadeIn>

        {/* 
          ========================================================================
          CARDS GRID (Desktop: Grid / Mobile: Horizontal Swipe Carousel)
          3 cards fade up with a 0.15s stagger
          ========================================================================
        */}
        {categories.length > 0 ? (
          <Stagger
            staggerDelay={0.15}
            className="flex lg:grid lg:grid-cols-3 gap-6 sm:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 pb-4 lg:pb-0"
          >
            {categories.map((category, idx) => (
              <StaggerItem
                key={category.id || idx}
                direction="up"
                className="w-[85vw] sm:w-[380px] lg:w-auto shrink-0 snap-center rounded-card-lg bg-page border border-border p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] group"
              >
                <div>
                  {/* Dark circular icon button */}
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                    {getIcon(category.icon)}
                  </div>

                  {/* Category Title */}
                  <h3 className="text-xl font-semibold tracking-tight text-primary">
                    {category.title}
                  </h3>

                  {category.description && (
                    <p className="mt-2 text-xs sm:text-sm text-secondary leading-relaxed mb-6">
                      {category.description}
                    </p>
                  )}

                  {/* Skill Chips with small 0.04s stagger */}
                  <Stagger staggerDelay={0.04} delay={0.15} className="flex flex-wrap gap-2">
                    {category.skills?.map((skill, sIdx) => (
                      <StaggerItem key={sIdx} direction="none" duration={0.4}>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-normal border border-border text-primary bg-page-alt/60 hover:bg-page-alt hover:-translate-y-0.5 transition-all">
                          {skill}
                        </span>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>

                {/* Card Footer Meta */}
                <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs text-secondary">
                  <span>{category.skills?.length || 0} core competencies</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" aria-hidden="true" />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="py-12 text-center text-sm text-secondary border border-dashed border-border rounded-xl">
            No skill categories added yet.
          </div>
        )}
      </div>
    </section>
  );
};
