import React, { useRef, useState } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  children: React.ReactNode;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  children,
  ...rest
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 3.5;
    const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 3.5;
    setOffset({ x: dx, y: dy });
  };

  const resetOffset = () => setOffset({ x: 0, y: 0 });

  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-b from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white font-semibold shadow-[0_6px_18px_rgba(37,99,235,0.28)] hover:shadow-[0_10px_26px_rgba(37,99,235,0.38)] ring-1 ring-inset ring-white/20'
      : variant === 'secondary'
      ? 'bg-white dark:bg-[#0B1324] text-[#0A1428] dark:text-[#F1F5F9] border border-[#E2E8F0] dark:border-[#1B2942] hover:border-[#CBD5E1] dark:hover:border-[#273A5C] hover:bg-[#F8FAFC] dark:hover:bg-[#111C33] font-medium shadow-2xs'
      : variant === 'danger'
      ? 'bg-[#FEF2F2] dark:bg-[#450A0A]/40 text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#7F1D1D] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D]/50 font-medium'
      : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#111C33] font-medium';

  return (
    <button
      ref={btnRef}
      disabled={disabled || loading}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetOffset}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      className={`group relative overflow-hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ease-out whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45 active:scale-[0.985] disabled:opacity-45 disabled:cursor-not-allowed ${styles} ${className}`}
      {...rest}
    >
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      )}
      {loading && (
        <span
          className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
};
