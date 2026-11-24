import React from 'react';

interface OxinvoLogoProps {
  size?: number;
  showWordmark?: boolean;
  compact?: boolean;
  tone?: 'auto' | 'dark' | 'light';
}

export const OxinvoLogo: React.FC<OxinvoLogoProps> = ({
  size = 32,
  showWordmark = true,
  compact = false,
  tone = 'auto',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const wordmarkColor =
    tone === 'light'
      ? 'text-white'
      : tone === 'dark'
      ? 'text-[#0A1428]'
      : 'text-[#0A1428] dark:text-[#F8FAFC]';

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
          <linearGradient id={`oxv-bg-${uid}`} x1="3" y1="3" x2="37" y2="37" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="55%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id={`oxv-rim-${uid}`} x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id={`oxv-beam-${uid}`} x1="12" y1="10" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="10" fill={`url(#oxv-bg-${uid})`} stroke={`url(#oxv-rim-${uid})`} strokeWidth="1.25" />
        {/* Precision outer octagonal frame */}
        <circle cx="20" cy="20" r="10.2" stroke={`url(#oxv-beam-${uid})`} strokeWidth="1.8" strokeOpacity="0.9" />
        {/* Precision geometric diamond & directional candlestick axis */}
        <path
          d="M20 11.4L27.2 20L20 28.6L12.8 20L20 11.4Z"
          fill="rgba(59,130,246,0.22)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line x1="20" y1="14.2" x2="20" y2="25.8" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2.2" fill="#FFFFFF" />
      </svg>
      {showWordmark && (
        <span
          className={`font-display font-bold tracking-[0.14em] ${wordmarkColor} whitespace-nowrap shrink-0 ${
            compact ? 'text-[15px]' : 'text-[17px]'
          }`}
        >
          OXINVO
        </span>
      )}
    </div>
  );
};
