import React from 'react';
import { SectionLabel } from './SectionLabel';

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  title,
  subtitle,
  rightElement,
  className = '',
}) => {
  return (
    <div className={`mb-10 sm:mb-12 ${className}`}>
      {label && <SectionLabel label={label} className="mb-3" />}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tightest text-primary leading-[1.1]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-base sm:text-lg text-secondary max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {rightElement && (
          <div className="shrink-0 lg:ml-6 mt-2 lg:mt-0">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};
