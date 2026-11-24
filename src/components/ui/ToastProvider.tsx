import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (title: string, variant?: ToastVariant, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => undefined,
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, variant: ToastVariant = 'info', description?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, description, variant }]);
      window.setTimeout(() => {
        dismiss(id);
      }, 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[70] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-[0_14px_36px_rgba(15,23,42,0.12)]"
            >
              {toast.variant === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              )}
              {toast.variant === 'error' && (
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              )}
              {toast.variant === 'info' && (
                <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A]">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => dismiss(toast.id)}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#0F172A] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
