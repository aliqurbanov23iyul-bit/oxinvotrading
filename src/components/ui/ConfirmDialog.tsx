import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { CustomModal } from './CustomModal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}) => {
  const btnStyle =
    variant === 'danger'
      ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'
      : variant === 'warning'
      ? 'bg-[#D97706] hover:bg-[#B45309] text-white'
      : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white';

  return (
    <CustomModal open={open} onClose={onClose} title={title} maxWidthClass="max-w-md">
      <div className="flex items-start gap-3.5">
        <div
          className={`p-2.5 rounded-xl shrink-0 ${
            variant === 'danger'
              ? 'bg-[#FEF2F2] text-[#DC2626]'
              : variant === 'warning'
              ? 'bg-[#FFFBEB] text-[#D97706]'
              : 'bg-[#EFF6FF] text-[#2563EB]'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-[#475569] leading-relaxed">{description}</p>
      </div>
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium rounded-xl border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors whitespace-nowrap shrink-0"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${btnStyle}`}
        >
          {confirmLabel}
        </button>
      </div>
    </CustomModal>
  );
};
