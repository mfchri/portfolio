import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { ImageUploader } from '../components/ImageUploader';

export const SitePage: React.FC = () => {
  const { draft, updateDraft } = useAdmin();
  const site = draft.site || {
    name: '',
    title: '',
    description: '',
    keywords: '',
    ogImage: '',
    favicon: '',
    animations: {
      enabled: true,
      typingSpeed: 'normal',
    },
  };

  const handleChange = (field: keyof typeof site, value: unknown) => {
    updateDraft((prev) => ({
      ...prev,
      site: {
        ...prev.site,
        [field]: value,
      },
    }));
  };

  const handleAnimationChange = (field: 'enabled' | 'typingSpeed', val: unknown) => {
    updateDraft((prev) => ({
      ...prev,
      site: {
        ...prev.site,
        animations: {
          enabled: prev.site?.animations?.enabled !== false,
          typingSpeed: prev.site?.animations?.typingSpeed || 'normal',
          [field]: val,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
          Site, SEO &amp; Animation Configuration
        </h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Configure search engine optimization metadata, social cards, and site-wide animation preferences.
        </p>
      </div>

      <div className="bg-card rounded-card-lg border border-border p-6 sm:p-8 space-y-6">
        {/* Site Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
            Site Name / Navbar Brand
          </label>
          <input
            type="text"
            value={site.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Alex Morgan Portfolio"
            className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-[11px] text-secondary">
            Used as the brand identifier in titles and RSS/OG meta.
          </p>
        </div>

        {/* Page Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
            Browser Tab Title (&lt;title&gt;)
          </label>
          <input
            type="text"
            value={site.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Alex Morgan | IT Infrastructure Governance & Planning"
            className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-[11px] text-secondary">
            Optimal length: 50–60 characters. Displayed on browser tabs and Google search results.
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
            Search Engine Description (meta description)
          </label>
          <textarea
            rows={3}
            value={site.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Portfolio of an IT Infrastructure Governance & Planning professional..."
            className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-[11px] text-secondary">
            Recommended length: 140–160 characters. Summarizes the page for search engines.
          </p>
        </div>

        {/* Meta Keywords */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
            SEO Keywords
          </label>
          <input
            type="text"
            value={site.keywords}
            onChange={(e) => handleChange('keywords', e.target.value)}
            placeholder="IT Infrastructure, Governance, COBIT, TOGAF, ITIL"
            className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-[11px] text-secondary">Comma-separated key competencies and topics.</p>
        </div>

        {/* Animation Settings Group */}
        <div className="pt-6 border-t border-border space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
              Website Animations &amp; Motion Controls
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Enable animations toggle */}
            <div className="p-4 rounded-xl bg-page-alt border border-border flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-primary">Enable Animations</label>
                <p className="text-[11px] text-secondary mt-0.5">
                  Controls typewriter and scroll fade-in effects across public site.
                </p>
              </div>
              <input
                type="checkbox"
                checked={site.animations?.enabled !== false}
                onChange={(e) => handleAnimationChange('enabled', e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            {/* Typing speed selector */}
            <div className="p-4 rounded-xl bg-page-alt border border-border space-y-2">
              <label className="block text-xs font-semibold text-primary">Typing Speed</label>
              <div className="flex gap-2">
                {(['slow', 'normal', 'fast'] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => handleAnimationChange('typingSpeed', spd)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium capitalize border transition-colors ${
                      (site.animations?.typingSpeed || 'normal') === spd
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-card border-border text-secondary hover:text-primary'
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OG Image Upload */}
          <ImageUploader
            label="Open Graph / Social Share Image"
            helperText="Image displayed when your portfolio URL is shared on LinkedIn, Twitter, or Slack (1200x630 recommended)."
            currentUrl={site.ogImage}
            onUploadSuccess={(url) => handleChange('ogImage', url)}
          />

          {/* Favicon */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
                Favicon URL / SVG Path
              </label>
              <input
                type="text"
                value={site.favicon}
                onChange={(e) => handleChange('favicon', e.target.value)}
                placeholder="/favicon.svg"
                className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-[11px] text-secondary">
                Default: /favicon.svg (monochrome server emblem)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
