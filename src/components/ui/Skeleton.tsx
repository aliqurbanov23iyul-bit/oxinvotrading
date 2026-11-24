import React from 'react';

export const SkeletonBlock: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`rounded-lg bg-[#E2E8F0]/70 animate-pulse ${className}`} aria-hidden="true" />;
};
