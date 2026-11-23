import React from 'react';
import { ShieldCheck, Workflow, Server, Database } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { useContent } from '../context/ContentContext';
import { FadeIn } from './motion/FadeIn';
import { Stagger, StaggerItem } from './motion/Stagger';

export const Profile: React.FC = () => {
  const { content } = useContent();
  const profile = content.profile || {};
  const personal = content.personal || {};

  const getStatementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Workflow':
        return <Workflow className="w-4 h-4" aria-hidden="true" />;
      case 'Database':
        return <Database className="w-4 h-4" aria-hidden="true" />;
      case 'Server':
        return <Server className="w-4 h-4" aria-hidden="true" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-4 h-4" aria-hidden="true" />;
    }
  };

  const photoSecondary = personal.profilePhotoSecondary?.src || personal.profilePhoto?.src || '/images/profile-placeholder-2.jpg';
  const photoAlt = personal.profilePhotoSecondary?.alt || personal.name || 'Portrait';

  return (
    <section
      id="profile"
      className="min-h-[100svh] min-h-screen w-full bg-page-alt flex flex-col justify-center py-20 lg:py-24 border-b border-border overflow-x-clip"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12 w-full">
        {/* Section Label */}
        {profile.sectionLabel && (
          <FadeIn direction="up" delay={0}>
            <div className="mb-8 sm:mb-10">
              <SectionLabel label={profile.sectionLabel} />
            </div>
          </FadeIn>
        )}

        {/* 3-Column Editorial Grid: Left (direction: left), Middle (direction: up), Right (direction: right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* ================= COLUMN 1: Heading, Paragraph, Decorative Arrow (From Left) ================= */}
          <FadeIn direction="left" delay={0} className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {profile.heading && (
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tightest text-primary leading-[1.1]">
                  {profile.heading}
                </h2>
              )}
              {profile.paragraph && (
                <p className="mt-6 text-sm sm:text-base text-secondary leading-relaxed">
                  {profile.paragraph}
                </p>
              )}
            </div>

            {/* Decorative Thin Curved Arrow (Inline SVG) */}
            <div className="hidden lg:block pt-8" aria-hidden="true">
              <svg
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
                className="text-primary/70 stroke-current"
              >
                <path
                  d="M16 16 C 16 42, 32 54, 52 54 M 44 46 L 52 54 L 44 62"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </FadeIn>

          {/* ================= COLUMN 2: White Highlight Card (From Below, delay: 0.15s) ================= */}
          {profile.highlightCard && (
            <FadeIn direction="up" delay={0.15} className="lg:col-span-4 flex flex-col">
              <div className="h-full bg-card rounded-card-lg p-6 sm:p-8 border border-border flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-transform duration-300 group">
                <div>
                  {/* Small dark circular icon button at top */}
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                    <Server className="w-4 h-4" aria-hidden="true" />
                  </div>

                  {/* Big Stat */}
                  <div className="text-5xl sm:text-6xl font-normal tracking-tight text-primary">
                    {profile.highlightCard.stat}
                  </div>

                  {/* Caption */}
                  <p className="mt-3 text-xs sm:text-sm text-secondary leading-relaxed">
                    {profile.highlightCard.caption}
                  </p>
                </div>

                {/* Smaller rounded photo at bottom of the card */}
                {photoSecondary && (
                  <div className="mt-8 rounded-card overflow-hidden h-40 sm:h-44 w-full bg-panel border border-border/50">
                    <img
                      src={photoSecondary}
                      alt={photoAlt}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                      style={{ filter: 'grayscale(1) contrast(1.05)' }}
                      loading="lazy"
                      width="400"
                      height="220"
                    />
                  </div>
                )}
              </div>
            </FadeIn>
          )}

          {/* ================= COLUMN 3: Secondary Photo + Statement Rows (From Right, delay: 0.30s) ================= */}
          <FadeIn direction="right" delay={0.3} className="lg:col-span-4 flex flex-col justify-between space-y-6 lg:space-y-0">
            {/* Small rounded-square black-and-white photo at the top */}
            {photoSecondary && (
              <div className="rounded-card-lg overflow-hidden h-44 sm:h-52 w-full bg-panel border border-border hover:-translate-y-1 transition-transform duration-300">
                <img
                  src={photoSecondary}
                  alt={photoAlt}
                  className="w-full h-full object-cover object-center"
                  style={{ filter: 'grayscale(1) contrast(1.05)' }}
                  loading="lazy"
                  width="400"
                  height="260"
                />
              </div>
            )}

            {/* Below it: Statements staggered one after another */}
            {profile.statements && profile.statements.length > 0 && (
              <Stagger staggerDelay={0.15} delay={0.35} className="space-y-4 pt-4 lg:pt-0">
                {profile.statements.map((stmt, idx) => (
                  <StaggerItem key={idx} direction="up">
                    <div className="p-4 sm:p-5 rounded-card bg-panel/80 border border-border/70 flex items-start gap-4 hover:-translate-y-0.5 transition-transform duration-200 group">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-200">
                        {getStatementIcon(stmt.icon)}
                      </div>
                      <p className="text-xs sm:text-sm text-primary font-normal leading-relaxed">
                        {stmt.text}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </FadeIn>

        </div>
      </div>
    </section>
  );
};
