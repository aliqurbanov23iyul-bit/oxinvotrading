import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomPasswordInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  autoComplete?: string;
  disabled?: boolean;
  readOnly?: boolean;
  showLeadingIcon?: boolean;
}

export const CustomPasswordInput: React.FC<CustomPasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder = '••••••••••••',
  label,
  autoComplete,
  disabled = false,
  readOnly = false,
  showLeadingIcon = true,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative group">
        {showLeadingIcon && (
          <Lock className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[#2563EB] dark:group-focus-within:text-[#60A5FA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
        )}
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full ${
            showLeadingIcon ? 'pl-10' : 'pl-3.5'
          } pr-11 py-2.5 text-sm font-mono rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] dark:placeholder:text-[#475569] focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:ring-3 focus:ring-[#2563EB]/15 dark:focus:ring-[#3B82F6]/20 disabled:opacity-50 transition-all`}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-[#F1F5F9] dark:hover:bg-[#111C33] transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={visible ? 'hide' : 'show'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.12 }}
              className="block"
            >
              {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};
