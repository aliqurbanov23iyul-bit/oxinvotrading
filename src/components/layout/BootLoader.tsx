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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F4F7FC]"
      role="status"
      aria-label="Loading OXINVO"
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#2563EB]/20 to-[#60A5FA]/25 blur-xl" />
          <div className="absolute inset-1 rounded-full border-2 border-[#E2E8F0]" />
          <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-[#2563EB] border-r-[#60A5FA] animate-spin" />
          <OxinvoLogo size={38} showWordmark={false} />
        </div>
        <div className="text-center">
          <p className="font-display font-bold tracking-[0.18em] text-sm text-[#0F172A]">OXINVO</p>
          <p className="text-xs text-[#64748B] mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
};
