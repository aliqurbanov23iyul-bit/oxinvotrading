import React from 'react';
import { motion } from 'motion/react';

interface BrandIconButtonProps {
  href?: string;
  label: string;
  onFallbackClick?: () => void;
  size?: 'sm' | 'md';
}

export const WhatsAppBrandButton: React.FC<BrandIconButtonProps> = ({
  href,
  label,
  onFallbackClick,
  size = 'md',
}) => {
  const dim = size === 'sm' ? 'w-10 h-10' : 'w-11 h-11';
  const iconDim = size === 'sm' ? 'w-5 h-5' : 'w-[22px] h-[22px]';
  const commonClass = `${dim} rounded-2xl inline-flex items-center justify-center bg-[#25D366] text-white shadow-[0_8px_22px_rgba(37,211,102,0.28)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.44)] transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#060B16]`;

  const svg = (
    <svg viewBox="0 0 32 32" fill="none" className={iconDim} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 3C8.82 3 3 8.75 3 15.84c0 2.52.74 4.87 2.02 6.85L3.65 28.9l6.43-1.66A13.1 13.1 0 0 0 16 28.68c7.18 0 13-5.75 13-12.84C29 8.75 23.18 3 16 3Zm0 23.38c-2.06 0-3.98-.58-5.6-1.58l-.4-.24-3.82.99 1.02-3.68-.26-.41a10.42 10.42 0 0 1-1.64-5.62c0-5.79 4.8-10.5 10.7-10.5 5.9 0 10.7 4.71 10.7 10.5 0 5.8-4.8 10.54-10.7 10.54Zm5.87-7.86c-.32-.16-1.9-.93-2.2-1.03-.3-.11-.51-.16-.72.16-.22.32-.83 1.03-1.02 1.25-.19.21-.37.24-.7.08-.32-.16-1.36-.5-2.59-1.58-.95-.84-1.6-1.88-1.78-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.22-.32.32-.53.11-.21.06-.4-.02-.56-.08-.16-.72-1.73-.99-2.37-.26-.62-.53-.54-.72-.55h-.62c-.21 0-.56.08-.85.4-.3.32-1.12 1.09-1.12 2.66 0 1.56 1.15 3.08 1.31 3.29.16.21 2.26 3.43 5.47 4.81.76.33 1.36.52 1.82.67.76.24 1.46.21 2.01.13.61-.09 1.9-.77 2.17-1.51.27-.75.27-1.39.19-1.52-.08-.13-.3-.21-.62-.37Z"
        fill="currentColor"
      />
    </svg>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={commonClass}
      >
        {svg}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onFallbackClick}
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={commonClass}
    >
      {svg}
    </motion.button>
  );
};

export const TelegramBrandButton: React.FC<BrandIconButtonProps> = ({
  href,
  label,
  onFallbackClick,
  size = 'md',
}) => {
  const dim = size === 'sm' ? 'w-10 h-10' : 'w-11 h-11';
  const iconDim = size === 'sm' ? 'w-5 h-5' : 'w-[22px] h-[22px]';
  const commonClass = `${dim} rounded-2xl inline-flex items-center justify-center bg-[#229ED9] text-white shadow-[0_8px_22px_rgba(34,158,217,0.28)] hover:shadow-[0_12px_28px_rgba(34,158,217,0.44)] transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#229ED9] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#060B16]`;

  const svg = (
    <svg viewBox="0 0 32 32" fill="none" className={iconDim} aria-hidden="true">
      <path
        d="M27.6 5.6 4.2 14.6c-1.6.6-1.58 1.54-.29 1.94l6 1.87 2.31 7.06c.28.78.14 1.09.96 1.09.63 0 .91-.29 1.26-.63l3.01-2.93 6.26 4.62c1.15.64 1.98.31 2.27-1.06l4.08-19.2c.41-1.69-.64-2.45-2.46-1.76Zm-4.96 4.44-9.52 8.58-.38 4.02-1.85-5.86 11.75-6.74Z"
        fill="currentColor"
      />
    </svg>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={commonClass}
      >
        {svg}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onFallbackClick}
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={commonClass}
    >
      {svg}
    </motion.button>
  );
};
