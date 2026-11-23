import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface ChipInputProps {
  label: string;
  helperText?: string;
  chips: string[];
  onChange: (newChips: string[]) => void;
  placeholder?: string;
}

export const ChipInput: React.FC<ChipInputProps> = ({
  label,
  helperText,
  chips,
  onChange,
  placeholder = 'Type and press Enter or comma',
}) => {
  const [inputValue, setInputValue] = useState('');

  const addChip = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (!chips.includes(trimmed)) {
      onChange([...chips, trimmed]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addChip();
    }
  };

  const removeChip = (indexToRemove: number) => {
    onChange(chips.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
        {label}
      </label>

      {/* Chip list */}
      <div className="flex flex-wrap gap-1.5 min-h-[2.25rem] p-2 bg-page-alt border border-border rounded-xl">
        {chips.map((chip, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-card border border-border text-primary shadow-xs"
          >
            <span>{chip}</span>
            <button
              type="button"
              onClick={() => removeChip(idx)}
              className="text-secondary hover:text-red-600 transition-colors"
              aria-label={`Remove tag ${chip}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="flex items-center flex-1 min-w-[140px]">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addChip}
            placeholder={chips.length === 0 ? placeholder : 'Add more...'}
            className="w-full bg-transparent text-xs text-primary placeholder:text-secondary focus:outline-none px-1"
          />
        </div>
      </div>

      {helperText && <p className="text-[11px] text-secondary">{helperText}</p>}
    </div>
  );
};
