import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 2,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const start = display;
    const diff = value - start;
    if (Math.abs(diff) < 0.0001) {
      setDisplay(value);
      return;
    }

    const duration = 420;
    const startedAt = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(start + diff * eased);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatted = display.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
