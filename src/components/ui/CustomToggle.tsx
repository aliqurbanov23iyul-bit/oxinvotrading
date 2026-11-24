import React from 'react';

interface CustomToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const CustomToggle: React.FC<CustomToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  ariaLabel,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`group flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45 rounded-lg transition-opacity ${
        disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-sm font-medium text-[#0A1428] dark:text-[#F1F5F9]">{label}</span>}
          {description && <span className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{description}</span>}
        </span>
      )}
      <span
        className={`relative inline-flex shrink-0 items-center w-11 h-6 rounded-full transition-colors duration-200 ${
          checked
            ? 'bg-[#2563EB]'
            : 'bg-[#CBD5E1] dark:bg-[#1B2942] group-hover:bg-[#94A3B8] dark:group-hover:bg-[#273A5C]'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
            checked ? 'translate-x-[23px]' : 'translate-x-[4px]'
          }`}
        />
      </span>
    </button>
  );
};
