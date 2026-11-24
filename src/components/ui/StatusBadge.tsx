import React from 'react';

interface StatusBadgeProps {
  tone: 'emerald' | 'blue' | 'amber' | 'red' | 'slate';
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ tone, label }) => {
  const colorMap: Record<StatusBadgeProps['tone'], string> = {
    emerald: 'text-[#15803D] bg-[#DCFCE7] border-[#BBF7D0]',
    blue: 'text-[#1D4ED8] bg-[#EFF6FF] border-[#BFDBFE]',
    amber: 'text-[#B45309] bg-[#FEF3C7] border-[#FDE68A]',
    red: 'text-[#B91C1C] bg-[#FEE2E2] border-[#FECACA]',
    slate: 'text-[#475569] bg-[#F1F5F9] border-[#E2E8F0]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-[11px] font-semibold whitespace-nowrap shrink-0 ${colorMap[tone]}`}
    >
      {label}
    </span>
  );
};
