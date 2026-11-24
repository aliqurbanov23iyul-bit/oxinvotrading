import React from 'react';
import { Search, X } from 'lucide-react';

interface CustomSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

export const CustomSearchInput: React.FC<CustomSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  ariaLabel = 'Search',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
