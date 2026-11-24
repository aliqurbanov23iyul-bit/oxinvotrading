import React from 'react';

interface CoinIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

function normalizeCoinCode(symbol: string): string {
  const base = symbol.split('/')[0]?.split('-')[0]?.trim().toUpperCase() || 'COIN';
  return base;
}

export const CoinIcon: React.FC<CoinIconProps> = ({ symbol, size = 28, className = '' }) => {
  const code = normalizeCoinCode(symbol);

  if (code === 'BTC') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#F7931A" />
        <circle cx="16" cy="16" r="13.5" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1" fill="none" />
        <path
          d="M19.8 14.5c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.6-.4-.7 2.6-1.3-.3.7-2.6-1.6-.4-.7 2.7-1-.2-2.2-.6-.4 1.7s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.2-.1 3.7c-.1.3-.3.7-.9.5l-1.2-.3-.8 1.9 2.1.5 1 .3-.7 2.8 1.6.4.7-2.7 1.3.3-.7 2.7 1.6.4.7-2.8c2.7.5 4.8.3 5.7-2.2.7-2-.1-3.1-1.5-3.9 1.1-.2 1.9-.9 2.1-2.5Zm-3.7 5.2c-.5 2-3.9.9-5 .6l.9-3.5c1.1.3 4.6.8 4.1 2.9Zm.5-5.2c-.5 1.8-3.3.9-4.2.7l.8-3.2c.9.2 3.9.6 3.4 2.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  if (code === 'ETH') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#627EEA" />
        <circle cx="16" cy="16" r="13.5" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1" fill="none" />
        <path d="M16.2 6v7.4l6.2 2.8L16.2 6Z" fill="#FFFFFF" fillOpacity="0.72" />
        <path d="M16.2 6 10 16.2l6.2-2.8V6Z" fill="#FFFFFF" />
        <path d="M16.2 21v5l6.2-8.6-6.2 3.6Z" fill="#FFFFFF" fillOpacity="0.72" />
        <path d="M16.2 26v-5L10 17.4 16.2 26Z" fill="#FFFFFF" />
        <path d="M16.2 19.7 22.4 16.2l-6.2-2.8v6.3Z" fill="#FFFFFF" fillOpacity="0.55" />
        <path d="M10 16.2l6.2 3.5v-6.3L10 16.2Z" fill="#FFFFFF" fillOpacity="0.88" />
      </svg>
    );
  }

  if (code === 'SOL') {
    const uid = React.useId().replace(/:/g, '');
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true">
        <defs>
          <linearGradient id={`sol-${uid}`} x1="5" y1="27" x2="27" y2="5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9945FF" />
            <stop offset="100%" stopColor="#14F195" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="15" fill="#0F172A" />
        <circle cx="16" cy="16" r="14" stroke={`url(#sol-${uid})`} strokeOpacity="0.45" strokeWidth="1" fill="none" />
        <path d="M10.2 19.8h10.8l1.6-1.9H11.8l-1.6 1.9Z" fill={`url(#sol-${uid})`} />
        <path d="M10.2 12.1h10.8l1.6 1.9H11.8l-1.6-1.9Z" fill={`url(#sol-${uid})`} />
        <path d="M22.6 16H11.8l-1.6 1.9H21l1.6-1.9Z" fill={`url(#sol-${uid})`} />
      </svg>
    );
  }

  if (code === 'BNB') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#F0B90B" />
        <path
          d="M12.1 14.3 16 10.4l3.9 3.9 2.3-2.3L16 5.8 9.8 12l2.3 2.3ZM5.8 16l2.3-2.3L10.4 16l-2.3 2.3L5.8 16Zm6.3 1.7L16 21.6l3.9-3.9 2.3 2.3L16 26.2 9.8 20l2.3-2.3Zm11.8-4L26.2 16l-2.3 2.3L21.6 16l2.3-2.3ZM16 13.7l2.3 2.3L16 18.3 13.7 16 16 13.7Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  if (code === 'XRP') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#111827" />
        <circle cx="16" cy="16" r="13.5" stroke="#94A3B8" strokeOpacity="0.35" strokeWidth="1" fill="none" />
        <path
          d="M22.7 9.5h2.4l-5.7 5.6a4.8 4.8 0 0 1-6.8 0L6.9 9.5h2.4l4.5 4.4a3.1 3.1 0 0 0 4.4 0l4.5-4.4Zm-13.4 13H6.9l5.7-5.6a4.8 4.8 0 0 1 6.8 0l5.7 5.6h-2.4l-4.5-4.4a3.1 3.1 0 0 0-4.4 0l-4.5 4.4Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  if (code === 'USDT') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#26A17B" />
        <path
          d="M17.6 17.1v-.1c-.1 0-.8 0-1.7 0-.8 0-1.5 0-1.7 0v.1c-3.1-.1-5.4-.7-5.4-1.4 0-.7 2.3-1.2 5.4-1.4v2.2c.2 0 .9 0 1.7 0 .9 0 1.5 0 1.7 0v-2.2c3.1.1 5.4.7 5.4 1.4 0 .7-2.3 1.2-5.4 1.4Zm0-3V12h4.6V9.2H9.8V12h4.6v2.1c-3.5.2-6.1.9-6.1 1.7 0 .8 2.6 1.5 6.1 1.7v6.1h3.2v-6.1c3.5-.2 6.1-.9 6.1-1.7 0-.8-2.6-1.5-6.1-1.7Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  if (code === 'AVAX') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#E84142" />
        <path
          d="m19.5 17.8 2.9 4.9c.3.5-.1 1.1-.7 1.1h-4c-.4 0-.7-.2-.9-.5l-1.5-2.6c-.2-.4-.2-.8 0-1.2l2.9-5c.3-.5 1-.5 1.3 0v3.3Zm-5.1-8.5 2.4 4.2c.2.4.2.9 0 1.3L11.9 23c-.2.5-.7.8-1.2.8H9.2c-.6 0-1-.6-.7-1.1l5.1-13.4c.2-.5 1-.5.8 0Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  if (code === 'ADA') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={`shrink-0 ${className}`} aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#0033AD" />
        <circle cx="16" cy="16" r="2.2" fill="#FFFFFF" />
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return <circle key={deg} cx={16 + Math.cos(rad) * 5.6} cy={16 + Math.sin(rad) * 5.6} r="1.25" fill="#FFFFFF" />;
        })}
        {[30, 90, 150, 210, 270, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return <circle key={deg} cx={16 + Math.cos(rad) * 9.5} cy={16 + Math.sin(rad) * 9.5} r="0.9" fill="#93C5FD" />;
        })}
      </svg>
    );
  }

  // Deterministic sleek fallback token emblem
  const initials = code.slice(0, 3);
  return (
    <span
      style={{ width: size, height: size }}
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white font-mono font-bold text-[10px] tracking-tight shrink-0 ring-1 ring-[#60A5FA]/40 ${className}`}
    >
      {initials}
    </span>
  );
};
