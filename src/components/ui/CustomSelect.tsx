import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  hint?: string;
}

interface CustomSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CustomSelect<T extends string = string>({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select',
  disabled = false,
  className = '',
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && <span className="block text-xs font-medium text-[#64748B] mb-1.5">{label}</span>}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm rounded-xl border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/35 ${
          disabled
            ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
            : open
            ? 'bg-white border-[#2563EB] text-[#0F172A] shadow-xs'
            : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#CBD5E1]'
        }`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180 text-[#2563EB]' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-1.5 w-full min-w-[180px] max-h-60 overflow-y-auto rounded-xl bg-white border border-[#E2E8F0] shadow-[0_12px_32px_rgba(15,23,42,0.12)] py-1"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 text-left text-sm transition-colors ${
                  isSelected
                    ? 'bg-[#EFF6FF] text-[#2563EB] font-medium'
                    : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <span className="flex flex-col truncate">
                  <span className="truncate">{opt.label}</span>
                  {opt.hint && <span className="text-[11px] text-[#64748B] truncate">{opt.hint}</span>}
                </span>
                {isSelected && <Check className="w-4 h-4 text-[#2563EB] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
