import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
}

export const CustomPasswordInput: React.FC<CustomPasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder = '••••••••',
  label,
  autoComplete,
  disabled = false,
  readOnly = false,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-[#475569] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          readOnly={readOnly}
          className="w-full pl-3.5 pr-11 py-2.5 text-sm font-mono rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 disabled:opacity-50 transition-all"
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#F1F5F9] transition-colors"
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
