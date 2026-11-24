import React from 'react';

interface StatusBadgeProps {
  tone: 'emerald' | 'blue' | 'amber' | 'red' | 'slate';
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ tone, label }) => {
  const colorMap: Record<StatusBadgeProps['tone'], string> = {
    emerald: 'text-[#047857] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/45 border-[#A7F3D0] dark:border-[#065F46]',
    blue: 'text-[#1D4ED8] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#1E3A8A]/35 border-[#BFDBFE] dark:border-[#1D4ED8]/50',
    amber: 'text-[#B45309] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#78350F]/35 border-[#FDE68A] dark:border-[#92400E]/60',
    red: 'text-[#B91C1C] dark:text-[#F87171] bg-[#FEF2F2] dark:bg-[#7F1D1D]/35 border-[#FECACA] dark:border-[#991B1B]/60',
    slate: 'text-[#475569] dark:text-[#94A3B8] bg-[#F1F5F9] dark:bg-[#111C33] border-[#E2E8F0] dark:border-[#1B2942]',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-mono font-semibold whitespace-nowrap shrink-0 ${colorMap[tone]}`}
    >
      {label}
    </span>
  );
};
