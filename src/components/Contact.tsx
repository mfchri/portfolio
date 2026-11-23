import React from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { useContent } from '../context/ContentContext';
import { FadeIn } from './motion/FadeIn';
import { Stagger, StaggerItem } from './motion/Stagger';

export const Contact: React.FC = () => {
  const { content } = useContent();
  const contact = content.contact || {};
  const footer = content.footer || {};
  const rows = contact.rows || [];

  const emailRow = rows.find((r) => r.label?.toLowerCase() === 'email');
  const mailtoHref = emailRow
    ? emailRow.href
    : `mailto:hello@example.com?subject=${encodeURIComponent(contact.emailSubject || 'Inquiry')}`;

  return (
    <section
      id="contact"
      className="min-h-[100svh] min-h-screen w-full bg-page flex flex-col justify-between pt-24 pb-8 overflow-x-clip"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12 w-full flex-1 flex flex-col justify-center">
        {/* Header Label + Giant Heading fades up */}
        <FadeIn direction="up" delay={0}>
          <div className="mb-8 sm:mb-12">
            {contact.sectionLabel && (
              <SectionLabel label={contact.sectionLabel} className="mb-4" />
            )}
            {contact.heading && (
              <h2 className="text-[clamp(3rem,8vw,7.5rem)] font-normal tracking-tightest leading-[0.92] text-primary">
                {contact.heading}
              </h2>
            )}
            {contact.invitation && (
              <p className="mt-6 text-sm sm:text-base lg:text-lg text-secondary max-w-xl leading-relaxed">
                {contact.invitation}
              </p>
            )}
          </div>
        </FadeIn>

        {/* Contact Links & Action Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Prominent Dark Pill "Send Email" Action Button (Fades up) */}
          {contact.emailButtonText && (
            <FadeIn direction="up" delay={0.2} className="lg:col-span-4 space-y-4">
              <a
                href={mailtoHref}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-primary text-white text-base font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>{contact.emailButtonText}</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <p className="text-xs text-secondary leading-relaxed">
                Typically replies within 24 business hours. Direct inquiries only.
              </p>
            </FadeIn>
          )}

          {/* Contact Rows with Thin 1px Dividers (Staggered 0.1s) */}
          {rows.length > 0 && (
            <div className="lg:col-span-8 border-y border-border">
              <Stagger staggerDelay={0.1} className="divide-y divide-border">
                {rows.map((row, idx) => {
                  const isClickable = row.href && row.href !== '#contact';

                  if (isClickable) {
                    return (
                      <StaggerItem key={idx} direction="up">
                        <a
                          href={row.href}
                          target={row.isExternal ? '_blank' : undefined}
                          rel={row.isExternal ? 'noopener noreferrer' : undefined}
                          className="py-4 sm:py-5 flex items-center justify-between group hover:bg-page-alt/50 hover:pl-1 transition-all px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-secondary">
                            {row.label}
                          </span>
                          <span className="inline-flex items-center gap-2 text-sm sm:text-base font-normal text-primary group-hover:opacity-70 transition-opacity">
                            <span>{row.value}</span>
                            <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" aria-hidden="true" />
                          </span>
                        </a>
                      </StaggerItem>
                    );
                  }

                  return (
                    <StaggerItem key={idx} direction="up">
                      <div className="py-4 sm:py-5 flex items-center justify-between px-2 sm:px-3">
                        <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-secondary">
                          {row.label}
                        </span>
                        <span className="text-sm sm:text-base font-normal text-primary">
                          {row.value}
                        </span>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          )}
        </div>
      </div>

      {/* Footer Pinned to Bottom of Contact Section (Fades up softly) */}
      <FadeIn direction="up" delay={0.3} className="w-full pt-12 pb-2">
        <div className="max-w-content mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary border-t border-border pt-6 gap-2">
          <span>{footer.copyrightText || '© 2026 Portfolio. All rights reserved.'}</span>
          <span className="text-[11px] uppercase tracking-wider">
            {content.personal?.title || 'IT Infrastructure Governance & Planning'}
          </span>
        </div>
      </FadeIn>
    </section>
  );
};
