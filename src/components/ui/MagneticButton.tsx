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
    const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
    const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
    setOffset({ x: dx, y: dy });
  };

  const resetOffset = () => setOffset({ x: 0, y: 0 });

  const styles =
    variant === 'primary'
      ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] font-semibold shadow-[0_6px_18px_rgba(37,99,235,0.22)]'
      : variant === 'secondary'
      ? 'bg-white text-[#0F172A] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] font-medium shadow-xs'
      : variant === 'danger'
      ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] hover:bg-[#FEE2E2] font-medium'
      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] font-medium';

  return (
    <button
      ref={btnRef}
      disabled={disabled || loading}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetOffset}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-xl transition-all duration-150 ease-out whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed ${styles} ${className}`}
      {...rest}
    >
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
