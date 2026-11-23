import React from 'react';
import { useContent } from '../context/ContentContext';

export const Footer: React.FC = () => {
  const { content } = useContent();

  return (
    <footer className="w-full py-8 border-t border-border bg-page">
      <div className="max-w-content mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary gap-2">
        <span>{content.footer?.copyrightText || '© 2026 Portfolio. All rights reserved.'}</span>
        <span className="text-[11px] uppercase tracking-wider">
          {content.personal?.title || 'IT Infrastructure Governance & Planning'}
        </span>
      </div>
    </footer>
  );
};
