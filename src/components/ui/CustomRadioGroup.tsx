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
                ? 'bg-[#EFF6FF] border-[#2563EB] text-[#0F172A]'
                : 'bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]'
            }`}
          >
            <span
              className={`mt-0.5 flex items-center justify-center w-4 h-4 rounded-full border shrink-0 transition-colors ${
                active ? 'border-[#2563EB]' : 'border-[#CBD5E1]'
              }`}
            >
              {active && <span className="w-2 h-2 rounded-full bg-[#2563EB]" />}
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium text-[#0F172A]">{opt.label}</span>
              {opt.description && <span className="text-xs text-[#64748B] mt-0.5">{opt.description}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
