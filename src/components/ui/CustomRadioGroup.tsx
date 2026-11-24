import React from 'react';

export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

interface CustomRadioGroupProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  name: string;
  columns?: 1 | 2;
}

export function CustomRadioGroup<T extends string = string>({
  value,
  onChange,
  options,
  name,
  columns = 1,
}: CustomRadioGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={`grid gap-2.5 ${columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45 ${
              active
                ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/25 border-[#2563EB] dark:border-[#3B82F6] text-[#0A1428] dark:text-[#F1F5F9]'
                : 'bg-white dark:bg-[#070D19] border-[#E2E8F0] dark:border-[#1B2942] text-[#475569] dark:text-[#94A3B8] hover:border-[#CBD5E1] dark:hover:border-[#273A5C]'
            }`}
          >
            <span
              className={`mt-0.5 flex items-center justify-center w-4 h-4 rounded-full border shrink-0 transition-colors ${
                active ? 'border-[#2563EB] dark:border-[#60A5FA]' : 'border-[#CBD5E1] dark:border-[#273A5C]'
              }`}
            >
              {active && <span className="w-2 h-2 rounded-full bg-[#2563EB] dark:bg-[#60A5FA]" />}
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium text-[#0A1428] dark:text-[#F1F5F9]">{opt.label}</span>
              {opt.description && <span className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{opt.description}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
