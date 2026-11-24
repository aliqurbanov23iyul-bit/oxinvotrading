import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  clearLabel?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'YYYY-MM-DD',
  disabled = false,
  clearLabel = 'Clear',
}) => {
  const [open, setOpen] = useState(false);
  const initialDate = useMemo(() => {
    const parsed = value ? new Date(`${value}T00:00:00`) : new Date();
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [value]);

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOffset = new Date(viewYear, viewMonth, 1).getDay();

  const handleSelectDay = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <div ref={containerRef} className="relative">
      {label && <span className="block text-xs font-medium text-[#64748B] mb-1.5">{label}</span>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/35 ${
          disabled
            ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
            : open
            ? 'bg-white border-[#2563EB] text-[#0F172A]'
            : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#CBD5E1]'
        }`}
      >
        <span className={`font-mono tabular-nums ${value ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
          {value || placeholder}
        </span>
        <Calendar className="w-4 h-4 text-[#64748B] shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-72 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-[0_14px_36px_rgba(15,23,42,0.14)]">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
              className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-[#0F172A]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
              className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#64748B] mb-1.5">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOffset }).map((_, idx) => (
              <span key={`empty-${idx}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = iso === value;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 rounded-lg text-xs font-mono tabular-nums transition-colors ${
                    isSelected
                      ? 'bg-[#2563EB] text-white font-semibold'
                      : 'text-[#334155] hover:bg-[#EFF6FF] hover:text-[#2563EB]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          {value && (
            <div className="mt-3 pt-2 border-t border-[#E2E8F0] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
                className="text-xs text-[#64748B] hover:text-[#0F172A] px-2 py-1"
              >
                {clearLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
