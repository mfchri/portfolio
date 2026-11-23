import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, ArrowUp, ArrowDown, Briefcase } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { ChipInput } from '../components/ChipInput';
import { ExperienceItem } from '../../../shared/types';

interface SortableItemProps {
  item: ExperienceItem;
  index: number;
  total: number;
  onUpdate: (updated: ExperienceItem) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SortableExperienceCard: React.FC<SortableItemProps> = ({
  item,
  index,
  total,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const isPresent = item.period.toLowerCase().includes('present');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-5 sm:p-6 rounded-card bg-card border transition-all ${
        isDragging
          ? 'border-primary shadow-lg opacity-90'
          : 'border-border shadow-xs hover:border-primary/30'
      }`}
    >
      {/* Top Card Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-5">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1.5 text-secondary hover:text-primary hover:bg-page-alt rounded-lg cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Position #{index + 1}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Fallback Up / Down Reorder Buttons */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-page-alt disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-page-alt disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg ml-2 transition-colors"
            title="Delete Position"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-primary">Job Title</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => onUpdate({ ...item, title: e.target.value })}
              placeholder="IT Infrastructure Governance Manager"
              className="w-full px-3 py-2 rounded-xl bg-page-alt border border-border text-xs sm:text-sm text-primary font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-primary">Company / Organization</label>
            <input
              type="text"
              value={item.company}
              onChange={(e) => onUpdate({ ...item, company: e.target.value })}
              placeholder="Apex Enterprise Solutions"
              className="w-full px-3 py-2 rounded-xl bg-page-alt border border-border text-xs sm:text-sm text-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-primary">Location</label>
            <input
              type="text"
              value={item.location}
              onChange={(e) => onUpdate({ ...item, location: e.target.value })}
              placeholder="New York, NY"
              className="w-full px-3 py-2 rounded-xl bg-page-alt border border-border text-xs sm:text-sm text-primary"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-primary">Date Period</label>
              <button
                type="button"
                onClick={() => {
                  if (isPresent) {
                    onUpdate({ ...item, period: 'Jan 2020 — Dec 2022' });
                  } else {
                    const start = item.period.split('—')[0]?.trim() || 'Feb 2022';
                    onUpdate({ ...item, period: `${start} — Present` });
                  }
                }}
                className="text-[11px] text-secondary hover:text-primary underline"
              >
                {isPresent ? 'Set End Date' : 'Set as Present'}
              </button>
            </div>
            <input
              type="text"
              value={item.period}
              onChange={(e) => onUpdate({ ...item, period: e.target.value })}
              placeholder="Feb 2022 — Present"
              className="w-full px-3 py-2 rounded-xl bg-page-alt border border-border text-xs sm:text-sm text-primary"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-primary">Role Summary / Description</label>
          <textarea
            rows={2}
            value={item.description}
            onChange={(e) => onUpdate({ ...item, description: e.target.value })}
            placeholder="Direct enterprise infrastructure policies and chaired the CAB/ARB across 14 global business units..."
            className="w-full px-3 py-2 rounded-xl bg-page-alt border border-border text-xs sm:text-sm text-primary leading-relaxed"
          />
        </div>

        {/* Skill / Competency Tags */}
        <ChipInput
          label="Competency / Framework Tags"
          chips={item.tags || []}
          onChange={(newTags) => onUpdate({ ...item, tags: newTags })}
          placeholder="Add tags (e.g. ITIL, COBIT, TOGAF) and press Enter"
        />
      </div>
    </div>
  );
};

export const ExperiencePage: React.FC = () => {
  const { draft, updateDraft } = useAdmin();
  const experience = draft.experience || {};
  const items = experience.items || [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((it) => it.id === active.id);
      const newIndex = items.findIndex((it) => it.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(items, oldIndex, newIndex);
        updateDraft((prev) => ({
          ...prev,
          experience: {
            ...prev.experience,
            items: reordered,
          },
        }));
      }
    }
  };

  const updateItem = (index: number, updated: ExperienceItem) => {
    updateDraft((prev) => {
      const nextItems = [...(prev.experience?.items || [])];
      nextItems[index] = updated;
      return {
        ...prev,
        experience: {
          ...prev.experience,
          items: nextItems,
        },
      };
    });
  };

  const deleteItem = (index: number) => {
    const target = items[index];
    if (window.confirm(`Are you sure you want to delete position "${target.title} at ${target.company}"?`)) {
      updateDraft((prev) => ({
        ...prev,
        experience: {
          ...prev.experience,
          items: (prev.experience?.items || []).filter((_, i) => i !== index),
        },
      }));
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const reordered = arrayMove(items, index, targetIndex);
    updateDraft((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: reordered,
      },
    }));
  };

  const addNewPosition = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: 'Senior Infrastructure Specialist',
      company: 'Enterprise Technology Corp',
      period: '2023 — Present',
      location: 'Remote',
      description: 'Led cloud infrastructure governance, cost optimization, and automated compliance frameworks.',
      tags: ['Governance', 'Cloud', 'Architecture'],
    };
    updateDraft((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: [newItem, ...(prev.experience?.items || [])],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            Career Experience Editor
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Manage your professional journey timeline. Drag cards to reorder or use the arrow buttons.
          </p>
        </div>

        <button
          type="button"
          onClick={addNewPosition}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Header text settings */}
      <div className="p-6 rounded-card-lg bg-card border border-border space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-primary">Section Heading</label>
            <input
              type="text"
              value={experience.heading || ''}
              onChange={(e) =>
                updateDraft((prev) => ({
                  ...prev,
                  experience: { ...prev.experience, heading: e.target.value },
                }))
              }
              placeholder="Explore My Professional Journey"
              className="w-full px-3 py-2 rounded-xl bg-page-alt border border-border text-sm text-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase text-primary">CTA Text Link</label>
            <input
              type="text"
              value={experience.ctaText || ''}
              onChange={(e) =>
                updateDraft((prev) => ({
                  ...prev,
                  experience: { ...prev.experience, ctaText: e.target.value },
                }))
              }
              placeholder="Get in Touch ↗"
              className="w-full px-3 py-2 rounded-xl bg-page-alt border border-border text-sm text-primary"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase text-primary">Section Paragraph</label>
          <input
            type="text"
            value={experience.paragraph || ''}
            onChange={(e) =>
              updateDraft((prev) => ({
                ...prev,
                experience: { ...prev.experience, paragraph: e.target.value },
              }))
            }
            placeholder="A decade of leading multi-cloud governance and enterprise compliance..."
            className="w-full px-3 py-2 rounded-xl bg-page-alt border border-border text-sm text-primary"
          />
        </div>
      </div>

      {/* Reorderable List */}
      <div className="space-y-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((it) => it.id)} strategy={verticalListSortingStrategy}>
            {items.map((item, index) => (
              <SortableExperienceCard
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                onUpdate={(up) => updateItem(index, up)}
                onDelete={() => deleteItem(index)}
                onMoveUp={() => moveItem(index, 'up')}
                onMoveDown={() => moveItem(index, 'down')}
              />
            ))}
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <div className="p-12 text-center rounded-card-lg border border-dashed border-border bg-card">
            <Briefcase className="w-8 h-8 text-secondary mx-auto mb-3" />
            <p className="text-sm font-medium text-primary">No positions in your timeline</p>
            <p className="text-xs text-secondary mt-1">Click "Add Position" above to add your first job entry.</p>
          </div>
        )}
      </div>
    </div>
  );
};
