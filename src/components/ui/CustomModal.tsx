import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  maxWidthClass = 'max-w-lg',
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F172A]/35 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 w-full ${maxWidthClass} max-h-[90vh] flex flex-col rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden`}
          >
            <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-lg font-display font-semibold text-[#0F172A]">{title}</h2>
                {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
