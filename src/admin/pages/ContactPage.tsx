import React from 'react';
import { Plus, Trash2, ArrowUpRight } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { ContactRow } from '../../../shared/types';

export const ContactPage: React.FC = () => {
  const { draft, updateDraft } = useAdmin();
  const contact = draft.contact || {};
  const rows = contact.rows || [];

  const handleContactChange = (field: string, val: unknown) => {
    updateDraft((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: val,
      },
    }));
  };

  const updateRow = (index: number, updated: ContactRow) => {
    updateDraft((prev) => {
      const nextRows = [...(prev.contact?.rows || [])];
      nextRows[index] = updated;
      return {
        ...prev,
        contact: {
          ...prev.contact,
          rows: nextRows,
        },
      };
    });
  };

  const deleteRow = (index: number) => {
    if (window.confirm('Delete this contact row?')) {
      updateDraft((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          rows: (prev.contact?.rows || []).filter((_, i) => i !== index),
        },
      }));
    }
  };

  const addRow = () => {
    const newRow: ContactRow = {
      label: 'Twitter / X',
      value: 'twitter.com/yourhandle',
      href: 'https://twitter.com/yourhandle',
      isExternal: true,
    };
    updateDraft((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        rows: [...(prev.contact?.rows || []), newRow],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            Contact Section Editor
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Configure your call-to-action headline, email button, and divided contact channels.
          </p>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Channel</span>
        </button>
      </div>

      <div className="bg-card rounded-card-lg border border-border p-6 sm:p-8 space-y-6">
        {/* Section Label & Main Display Headline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Section Label
            </label>
            <input
              type="text"
              value={contact.sectionLabel || ''}
              onChange={(e) => handleContactChange('sectionLabel', e.target.value)}
              placeholder="Contact"
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Monumental Heading
            </label>
            <input
              type="text"
              value={contact.heading || ''}
              onChange={(e) => handleContactChange('heading', e.target.value)}
              placeholder="Let's Work Together"
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm font-semibold text-primary"
            />
          </div>
        </div>

        {/* Invitation Paragraph */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
            Introductory Invitation Statement
          </label>
          <textarea
            rows={3}
            value={contact.invitation || ''}
            onChange={(e) => handleContactChange('invitation', e.target.value)}
            placeholder="Available for leadership roles, advisory consultations, and enterprise infrastructure..."
            className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary leading-relaxed"
          />
        </div>

        {/* Prominent Action Button Settings */}
        <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Primary Action Button Label
            </label>
            <input
              type="text"
              value={contact.emailButtonText || ''}
              onChange={(e) => handleContactChange('emailButtonText', e.target.value)}
              placeholder="Send Email"
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm font-medium text-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
              Mailto Subject Line
            </label>
            <input
              type="text"
              value={contact.emailSubject || ''}
              onChange={(e) => handleContactChange('emailSubject', e.target.value)}
              placeholder="Inquiry: IT Infrastructure Governance & Planning"
              className="w-full px-4 py-2.5 rounded-xl bg-page-alt border border-border text-sm text-primary"
            />
          </div>
        </div>

        {/* Contact Channel Rows */}
        <div className="pt-4 border-t border-border space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
            Contact Channels List
          </label>

          <div className="space-y-3">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-page-alt border border-border flex flex-col md:flex-row items-start md:items-center gap-3"
              >
                <div className="w-full md:w-36 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-secondary">Label</span>
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => updateRow(idx, { ...row, label: e.target.value })}
                    placeholder="Email"
                    className="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-primary"
                  />
                </div>

                <div className="w-full md:w-64 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-secondary">Display Text</span>
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => updateRow(idx, { ...row, value: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-primary"
                  />
                </div>

                <div className="flex-1 w-full space-y-1">
                  <span className="text-[10px] uppercase font-bold text-secondary">Link / Target (href)</span>
                  <input
                    type="text"
                    value={row.href}
                    onChange={(e) => updateRow(idx, { ...row, href: e.target.value })}
                    placeholder="mailto:alex@example.com"
                    className="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-primary"
                  />
                </div>

                <div className="flex items-center gap-2 self-end md:self-center pt-2 md:pt-4">
                  <label className="flex items-center gap-1.5 text-xs text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!row.isExternal}
                      onChange={(e) => updateRow(idx, { ...row, isExternal: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>External</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => deleteRow(idx)}
                    className="p-1.5 text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg ml-2"
                    title="Delete Channel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
