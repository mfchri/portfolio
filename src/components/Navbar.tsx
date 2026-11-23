import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const { content } = useContent();
  const shouldReduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const animationsEnabled = content.site?.animations?.enabled !== false && !shouldReduceMotion;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }

    setMobileMenuOpen(false);
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const links = content.navigation?.links || [];
  const logoText = content.navigation?.logoText || content.personal?.name || 'Portfolio';
  const ctaText = content.navigation?.ctaText || 'Get in Touch ↗';
  const ctaTargetId = content.navigation?.ctaTargetId || 'contact';

  return (
    <motion.header
      initial={animationsEnabled ? { opacity: 0, y: -12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-page/90 backdrop-blur-md border-b border-border py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
          : 'bg-page/80 backdrop-blur-sm py-4 sm:py-5'
      }`}
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Left: Name / Logo with minimal mark */}
          <div className="flex items-center gap-8">
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              className="flex items-center gap-2.5 text-base sm:text-lg font-semibold tracking-tight text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-primary" aria-hidden="true" />
              <span>{logoText}</span>
            </a>

            {/* Desktop Center-Left Nav Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
              {links.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? 'text-primary bg-panel font-semibold'
                        : 'text-secondary hover:text-primary hover:bg-page-alt/70'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right: CTA text-button "Get in Touch ↗" */}
          {ctaText && (
            <div className="hidden md:flex items-center">
              <button
                type="button"
                onClick={(e) => handleCtaClick(e, ctaTargetId)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-75 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
              >
                <span>{ctaText}</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-primary hover:bg-page-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open main navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Full Width) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-page px-6 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {links.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className={`px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-panel font-semibold'
                      : 'text-secondary hover:text-primary hover:bg-page-alt'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {ctaText && (
            <div className="pt-3 border-t border-border mt-3">
              <button
                type="button"
                onClick={(e) => handleCtaClick(e, ctaTargetId)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <span>{ctaText}</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.header>
  );
};
