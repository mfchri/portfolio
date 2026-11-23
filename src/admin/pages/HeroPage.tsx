import React from 'react';
import { useAdmin } from '../AdminContext';
import { ImageUploader } from '../components/ImageUploader';
import { ChipInput } from '../components/ChipInput';

export const HeroPage: React.FC = () => {
  const { draft, updateDraft } = useAdmin();
  const personal = draft.personal || {};
  const hero = draft.hero || { stats: [], roles: [] };
  const stats = hero.stats || [];
  const roles = hero.roles || [];

  const handlePersonalChange = (field: string, value: unknown) => {
    updateDraft((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  const handleStatChange = (index: number, field: 'value' | 'label', val: string) => {
    updateDraft((prev) => {
      const nextStats = [...(prev.hero?.stats || [])];
      if (nextStats[index]) {
        nextStats[index] = { ...nextStats[index], [field]: val };
      }
      return {
        ...prev,
        hero: {
          ...prev.hero,
          stats: nextStats,
        },
      };
    });
  };

  const handleRolesChange = (newRoles: string[]) => {
    updateDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        roles: newRoles,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
          Hero Section Editor
        </h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Customize the monumental display greeting, portrait photo cutout, rotating roles, top-left metrics, and vertical metadata.
        </p>
      </div>

      <div className="bg-card rounded-card-lg border border-border p-6 sm:p-8 space-y-6">
        
        {/* Name and Professional Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Full Name
            </label>
            <input
              type="text"
              value={personal.name || ''}
              onChange={(e) => handlePersonalChange('name', e.target.value)}
              placeholder="Alex Morgan"
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Professional Title (Fallback)
            </label>
            <input
              type="text"
              value={personal.title || ''}
              onChange={(e) => handlePersonalChange('title', e.target.value)}
              placeholder="IT Infrastructure Governance & Planning"
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Rotating Roles (Typewriter Effect) */}
        <div className="pt-2 border-t border-border">
          <ChipInput
            label="Rotating Roles (Typewriter Effect)"
            helperText="Roles shown one by one in the typewriter effect. Leave empty to show only the title."
            chips={roles}
            onChange={handleRolesChange}
            placeholder="Type role title and press Enter or comma"
          />
        </div>

        {/* Greeting Headline & Tagline Dash */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Giant Greeting Headline
            </label>
            <input
              type="text"
              value={personal.heroGreeting || ''}
              onChange={(e) => handlePersonalChange('heroGreeting', e.target.value)}
              placeholder="Hello"
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[11px] text-secondary">
              Types out letter by letter on page load (e.g., "Hello" or "Greetings").
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Sub-Greeting Bio Statement (Under headline)
            </label>
            <textarea
              rows={2}
              value={personal.heroBioDash || ''}
              onChange={(e) => handlePersonalChange('heroBioDash', e.target.value)}
              placeholder="— I'm Alex Morgan, an IT Infrastructure Governance & Planning professional..."
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* 2 Top-Left Highlight Metrics */}
        <div className="pt-4 border-t border-border space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
            Top-Left Metric Counters (2 Items)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.slice(0, 2).map((st, i) => (
              <div key={i} className="p-4 rounded-xl bg-page-alt border border-border space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-secondary uppercase">
                    Stat #{i + 1} Number / Value
                  </span>
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => handleStatChange(i, 'value', e.target.value)}
                    placeholder="10+"
                    className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm font-semibold text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-secondary uppercase">
                    Stat #{i + 1} Label
                  </span>
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => handleStatChange(i, 'label', e.target.value)}
                    placeholder="Years Experience"
                    className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portrait Cutout Photo Upload */}
        <div className="pt-4 border-t border-border">
          <ImageUploader
            label="Hero Portrait Cutout Photo"
            helperText="Anchored to bottom-right of the hero section. For best editorial look, use a transparent PNG cutout. The system applies black-and-white high contrast automatically."
            currentUrl={personal.profilePhoto?.src || ''}
            onUploadSuccess={(url) => {
              handlePersonalChange('profilePhoto', {
                ...personal.profilePhoto,
                src: url,
              });
            }}
            aspectHint="Cutout / Portrait orientation"
          />

          <div className="mt-3 space-y-1">
            <label className="block text-xs font-medium text-secondary">
              Image Alt Description (Accessibility)
            </label>
            <input
              type="text"
              value={personal.profilePhoto?.alt || ''}
              onChange={(e) =>
                handlePersonalChange('profilePhoto', {
                  ...personal.profilePhoto,
                  alt: e.target.value,
                })
              }
              placeholder="Portrait of Alex Morgan"
              className="w-full px-3 py-2 rounded-lg bg-page-alt border border-border text-xs text-primary"
            />
          </div>
        </div>

        {/* Vertical Labels & Scroll Indicator */}
        <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Vertical Label (Top)
            </label>
            <input
              type="text"
              value={personal.heroVerticalTop || ''}
              onChange={(e) => handlePersonalChange('heroVerticalTop', e.target.value)}
              placeholder="IT Infrastructure Governance & Planning"
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Vertical Label (Bottom)
            </label>
            <input
              type="text"
              value={personal.heroVerticalBottom || ''}
              onChange={(e) => handlePersonalChange('heroVerticalBottom', e.target.value)}
              placeholder="2026"
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Scroll Link Text
            </label>
            <input
              type="text"
              value={personal.scrollDownText || ''}
              onChange={(e) => handlePersonalChange('scrollDownText', e.target.value)}
              placeholder="Scroll down ↓"
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
