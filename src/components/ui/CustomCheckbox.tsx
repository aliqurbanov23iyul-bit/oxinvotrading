import React from 'react';
import { motion } from 'motion/react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}) => {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`group inline-flex items-center gap-2.5 text-left select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45 rounded-md transition-opacity ${
        disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <span
        className={`relative flex items-center justify-center w-5 h-5 rounded-md border transition-all duration-150 ${
          checked
            ? 'bg-[#2563EB] border-[#2563EB] shadow-[0_2px_8px_rgba(37,99,235,0.3)]'
            : 'bg-white dark:bg-[#070D19] border-[#CBD5E1] dark:border-[#273A5C] group-hover:border-[#2563EB]/70'
        }`}
      >
        <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 fill-none">
          <motion.path
            d="M2.5 7.2L5.5 10.2L11.5 3.8"
            stroke="#FFFFFF"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          />
        </svg>
      </span>
      {label && (
        <span className="text-sm text-[#475569] dark:text-[#94A3B8] group-hover:text-[#0A1428] dark:group-hover:text-white transition-colors">
          {label}
        </span>
      )}
    </button>
  );
};
