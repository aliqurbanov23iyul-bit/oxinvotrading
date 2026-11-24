import React from 'react';

export const SkeletonBlock: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`rounded-lg ox-shimmer ${className}`} aria-hidden="true" />;
};

export const SkeletonTableRows: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="space-y-3 py-2" aria-hidden="true">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="grid gap-3 items-center" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: cols }).map((__, cIdx) => (
            <SkeletonBlock key={cIdx} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
};
