import React, { useState } from 'react';

interface CustomTooltipProps {
  content: string;
  children: React.ReactNode;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 px-2.5 py-1.5 rounded-lg bg-[#0F172A] text-[11px] text-white whitespace-nowrap shadow-md"
        >
          {content}
        </span>
      )}
    </span>
  );
};
