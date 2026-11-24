import React from 'react';
import { MagneticButton } from './MagneticButton';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-[#CBD5E1] dark:border-[#1B2942] bg-[#F8FAFC]/80 dark:bg-[#0B1324]/60 ${
        compact ? 'px-5 py-8' : 'px-6 py-12'
      }`}
    >
      <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#111C33] border border-[#E2E8F0] dark:border-[#273A5C] text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shadow-xs mb-3.5">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-sm text-[#0A1428] dark:text-[#F1F5F9]">{title}</h3>
      {description && (
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-md mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <div className="mt-4">
          <MagneticButton variant="secondary" onClick={onAction} className="text-xs px-3.5 py-2">
            {actionLabel}
          </MagneticButton>
        </div>
      )}
    </div>
  );
};
