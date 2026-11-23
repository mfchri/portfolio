import React from 'react';
import { ShieldCheck, Workflow, Database, Server, Shield, Cpu, Network } from 'lucide-react';

interface IconPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { id: string; label: string }[];
}

export const IconPicker: React.FC<IconPickerProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  const renderIcon = (id: string) => {
    switch (id) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4" />;
      case 'Workflow':
        return <Workflow className="w-4 h-4" />;
      case 'Database':
        return <Database className="w-4 h-4" />;
      case 'Server':
        return <Server className="w-4 h-4" />;
      case 'Shield':
        return <Shield className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'Network':
        return <Network className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-primary">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-page-alt border-border text-primary hover:border-primary/40'
              }`}
            >
              {renderIcon(opt.id)}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
