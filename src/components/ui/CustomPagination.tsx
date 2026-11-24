import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageLabel?: string;
  ofLabel?: string;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageLabel = 'Page',
  ofLabel = '/',
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.min(totalPages, page + 2)
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0] dark:border-[#1B2942]">
      <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono tabular-nums">
        {pageLabel} {page} {ofLabel} {totalPages}
        {typeof totalItems === 'number' ? ` · ${totalItems}` : ''}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          aria-label="Previous"
          onClick={() => onPageChange(page - 1)}
          className="p-2 rounded-lg border border-[#E2E8F0] dark:border-[#1B2942] bg-white dark:bg-[#0B1324] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-white hover:border-[#CBD5E1] dark:hover:border-[#273A5C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`min-w-8 h-8 px-2 rounded-lg text-xs font-mono tabular-nums transition-colors ${
              p === page
                ? 'bg-[#2563EB] text-white font-semibold'
                : 'border border-[#E2E8F0] dark:border-[#1B2942] bg-white dark:bg-[#0B1324] text-[#475569] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-white'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= totalPages}
          aria-label="Next"
          onClick={() => onPageChange(page + 1)}
          className="p-2 rounded-lg border border-[#E2E8F0] dark:border-[#1B2942] bg-white dark:bg-[#0B1324] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-white hover:border-[#CBD5E1] dark:hover:border-[#273A5C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
