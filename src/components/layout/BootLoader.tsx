import React from 'react';
import { OxinvoLogo } from '../ui/OxinvoLogo';

interface BootLoaderProps {
  visible: boolean;
  label?: string;
}

export const BootLoader: React.FC<BootLoaderProps> = ({ visible, label = 'OXINVO' }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F6F8FC] dark:bg-[#060B16]"
      role="status"
      aria-label="Loading OXINVO"
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#2563EB]/20 to-[#60A5FA]/25 blur-xl" />
          <div className="absolute inset-1 rounded-full border-2 border-[#E2E8F0] dark:border-[#1B2942]" />
          <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-[#2563EB] dark:border-t-[#60A5FA] border-r-[#60A5FA] animate-spin" />
          <OxinvoLogo size={38} showWordmark={false} />
        </div>
        <div className="text-center">
          <p className="font-display font-bold tracking-[0.2em] text-sm text-[#0A1428] dark:text-[#F1F5F9]">OXINVO</p>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
};
