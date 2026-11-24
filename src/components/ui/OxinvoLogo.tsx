import React from 'react';

interface OxinvoLogoProps {
  size?: number;
  showWordmark?: boolean;
  compact?: boolean;
  tone?: 'dark' | 'light';
}

export const OxinvoLogo: React.FC<OxinvoLogoProps> = ({
  size = 32,
  showWordmark = true,
  compact = false,
  tone = 'dark',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const wordmarkColor = tone === 'light' ? 'text-white' : 'text-[#0F172A]';

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={`oxv-bg-${uid}`} x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
          <linearGradient id={`oxv-shine-${uid}`} x1="10" y1="8" x2="30" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="11" fill={`url(#oxv-bg-${uid})`} />
        <circle cx="20" cy="20" r="10.5" stroke={`url(#oxv-shine-${uid})`} strokeWidth="2.1" />
        <path
          d="M20 12.2L26.2 20L20 27.8L13.8 20L20 12.2Z"
          fill="rgba(255,255,255,0.22)"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="2.4" fill="#FFFFFF" />
      </svg>
      {showWordmark && (
        <span
          className={`font-display font-bold tracking-[0.12em] ${wordmarkColor} whitespace-nowrap shrink-0 ${
            compact ? 'text-base' : 'text-lg'
          }`}
        >
          OXINVO
        </span>
      )}
    </div>
  );
};
