import React from 'react';
import { useAdmin } from '../AdminContext';
import { ImageUploader } from '../components/ImageUploader';
import { IconPicker } from '../components/IconPicker';

export const ProfilePage: React.FC = () => {
  const { draft, updateDraft } = useAdmin();
  const profile = draft.profile || {};
  const personal = draft.personal || {};

  const statementIconOptions = [
    { id: 'ShieldCheck', label: 'Shield / Security' },
    { id: 'Workflow', label: 'Workflow / Roadmap' },
    { id: 'Database', label: 'Database / Storage' },
    { id: 'Server', label: 'Server / Infrastructure' },
  ];

  const handleProfileChange = (field: string, value: unknown) => {
    updateDraft((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  const handleCardChange = (field: 'stat' | 'caption', val: string) => {
    updateDraft((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        highlightCard: {
          ...prev.profile.highlightCard,
          [field]: val,
        },
      },
    }));
  };

  const handleStatementChange = (index: number, field: 'icon' | 'text', val: string) => {
    updateDraft((prev) => {
      const nextStatements = [...(prev.profile.statements || [])];
      if (nextStatements[index]) {
        nextStatements[index] = {
          ...nextStatements[index],
          [field]: val,
        };
      }
      return {
        ...prev,
        profile: {
          ...prev.profile,
          statements: nextStatements,
        },
      };
    });
  };

  const handleSecondaryPhotoChange = (url: string) => {
    updateDraft((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        profilePhotoSecondary: {
          ...prev.personal.profilePhotoSecondary,
          src: url,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
          Profile &amp; About Me Editor
        </h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Edit the 3-column editorial composition: main bio, highlight card stat, and governance competency statements.
        </p>
      </div>

      <div className="bg-card rounded-card-lg border border-border p-6 sm:p-8 space-y-6">
        
        {/* Section Label & Main Heading */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Section Label
            </label>
            <input
              type="text"
              value={profile.sectionLabel || ''}
              onChange={(e) => handleProfileChange('sectionLabel', e.target.value)}
              placeholder="About Me"
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Main Display Heading
            </label>
            <input
              type="text"
              value={profile.heading || ''}
              onChange={(e) => handleProfileChange('heading', e.target.value)}
              placeholder="Bridging strategy and enterprise resilience."
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Bio Paragraph */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
            Profile Bio Paragraph
          </label>
          <textarea
            rows={4}
            value={profile.paragraph || ''}
            onChange={(e) => handleProfileChange('paragraph', e.target.value)}
            placeholder="I oversee enterprise technology foundations, orchestrating compliant..."
            className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
          />
        </div>

        {/* White Highlight Card (Center Column) */}
        <div className="pt-4 border-t border-border space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Center Highlight Card (Uptime / Key Metric)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs text-secondary font-medium">
                Metric Value / Stat
              </label>
              <input
                type="text"
                value={profile.highlightCard?.stat || ''}
                onChange={(e) => handleCardChange('stat', e.target.value)}
                placeholder="99.9%"
                className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm font-semibold text-primary"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs text-secondary font-medium">
                Metric Caption
              </label>
              <input
                type="text"
                value={profile.highlightCard?.caption || ''}
                onChange={(e) => handleCardChange('caption', e.target.value)}
                placeholder="Average infrastructure uptime across managed environments..."
                className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary"
              />
            </div>
          </div>
        </div>

        {/* 2 Governance Statements (Right Column) */}
        <div className="pt-4 border-t border-border space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Competency Statements (2 Cards in Right Column)
          </h3>
          <div className="space-y-4">
            {(profile.statements || []).map((stmt, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-page-alt border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary uppercase">
                    Statement #{idx + 1}
                  </span>
                </div>

                <IconPicker
                  label="Select Icon"
                  value={stmt.icon}
                  onChange={(iconId) => handleStatementChange(idx, 'icon', iconId)}
                  options={statementIconOptions}
                />

                <div className="space-y-1">
                  <label className="block text-xs text-secondary font-medium">
                    Statement Description
                  </label>
                  <input
                    type="text"
                    value={stmt.text}
                    onChange={(e) => handleStatementChange(idx, 'text', e.target.value)}
                    placeholder="Leading enterprise risk governance and Architecture Review Boards."
                    className="w-full px-3 py-2 rounded-lg bg-card border border-border text-xs sm:text-sm text-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Portrait Photo Upload (Used in Center and Right Column) */}
        <div className="pt-4 border-t border-border">
          <ImageUploader
            label="Secondary Portrait Photo (About Section)"
            helperText="Used in the middle white highlight card and the right column. B&W filter is applied automatically."
            currentUrl={personal.profilePhotoSecondary?.src || ''}
            onUploadSuccess={handleSecondaryPhotoChange}
            aspectHint="Square / Landscape (400x300 recommended)"
          />
        </div>

      </div>
    </div>
  );
};
