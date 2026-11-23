import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { ChipInput } from '../components/ChipInput';
import { IconPicker } from '../components/IconPicker';
import { SkillCategory } from '../../../shared/types';

export const SkillsPage: React.FC = () => {
  const { draft, updateDraft } = useAdmin();
  const skills = draft.skills || {};
  const categories = skills.categories || [];

  const iconOptions = [
    { id: 'Shield', label: 'Shield (Governance / Compliance)' },
    { id: 'Cpu', label: 'CPU (Planning / Architecture)' },
    { id: 'Network', label: 'Network (Technical & Tools)' },
  ];

  const updateCategory = (index: number, updated: SkillCategory) => {
    updateDraft((prev) => {
      const nextCats = [...(prev.skills?.categories || [])];
      nextCats[index] = updated;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          categories: nextCats,
        },
      };
    });
  };

  const deleteCategory = (index: number) => {
    const target = categories[index];
    if (window.confirm(`Delete skill group "${target.title}"?`)) {
      updateDraft((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          categories: (prev.skills?.categories || []).filter((_, i) => i !== index),
        },
      }));
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const nextCats = [...categories];
    const [moved] = nextCats.splice(index, 1);
    nextCats.splice(targetIndex, 0, moved);
    updateDraft((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        categories: nextCats,
      },
    }));
  };

  const addCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      title: 'New Competency Group',
      icon: 'Shield',
      description: 'Key frameworks, tools, and technical competencies.',
      skills: ['Sample Skill 1', 'Sample Skill 2'],
    };
    updateDraft((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        categories: [...(prev.skills?.categories || []), newCat],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            Skills &amp; Competencies Editor
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Manage your grouped skill cards and proficiency chips displayed on the public site.
          </p>
        </div>

        <button
          type="button"
          onClick={addCategory}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill Group</span>
        </button>
      </div>

      {/* Section Heading */}
      <div className="p-6 rounded-card-lg bg-card border border-border space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase text-primary">
            Section Display Heading
          </label>
          <input
            type="text"
            value={skills.heading || ''}
            onChange={(e) =>
              updateDraft((prev) => ({
                ...prev,
                skills: { ...prev.skills, heading: e.target.value },
              }))
            }
            placeholder="Tools & Expertise"
            className="w-full px-3 py-2 rounded-xl bg-page-alt border border-border text-sm text-primary"
          />
        </div>
      </div>

      {/* Category Cards */}
      <div className="space-y-6">
        {categories.map((cat, idx) => (
          <div
            key={cat.id || idx}
            className="p-6 rounded-card-lg bg-card border border-border space-y-5 shadow-xs"
          >
            {/* Header / Reorder bar */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Group #{idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveCategory(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-page-alt disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCategory(idx, 'down')}
                  disabled={idx === categories.length - 1}
                  className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-page-alt disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(idx)}
                  className="p-1.5 rounded-lg text-secondary hover:text-red-600 hover:bg-red-50 ml-2"
                  title="Delete Group"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-primary">
                  Group Category Title
                </label>
                <input
                  type="text"
                  value={cat.title}
                  onChange={(e) => updateCategory(idx, { ...cat, title: e.target.value })}
                  placeholder="Governance & Compliance"
                  className="w-full px-3 py-2 rounded-xl bg-page-alt border border-border text-sm font-semibold text-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-primary">
                  Short Description
                </label>
                <input
                  type="text"
                  value={cat.description}
                  onChange={(e) => updateCategory(idx, { ...cat, description: e.target.value })}
                  placeholder="Frameworks, risk models, and regulatory alignment..."
                  className="w-full px-3 py-2 rounded-xl bg-page-alt border border-border text-sm text-primary"
                />
              </div>
            </div>

            {/* Icon Picker */}
            <IconPicker
              label="Select Card Icon"
              value={cat.icon}
              onChange={(newIcon) =>
                updateCategory(idx, { ...cat, icon: newIcon as SkillCategory['icon'] })
              }
              options={iconOptions}
            />

            {/* Skills Chip Input */}
            <ChipInput
              label="Skill Tags / Badges"
              chips={cat.skills || []}
              onChange={(newSkills) => updateCategory(idx, { ...cat, skills: newSkills })}
              placeholder="Type skill name and press Enter"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
