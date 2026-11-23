import React from 'react';

interface SectionLabelProps {
  label: string;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ label, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 text-xs font-medium text-secondary uppercase tracking-widest ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};
