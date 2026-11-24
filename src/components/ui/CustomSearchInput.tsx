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
    <div className={`relative group ${className}`}>
      <Search className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] group-focus-within:text-[#2563EB] dark:group-focus-within:text-[#60A5FA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] dark:placeholder:text-[#475569] focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:ring-3 focus:ring-[#2563EB]/15 transition-all"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#111C33] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
