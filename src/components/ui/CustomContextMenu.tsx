import React, { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}

interface CustomContextMenuProps {
  items: ContextMenuItem[];
  ariaLabel?: string;
}

export const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
  items,
  ariaLabel = 'Actions',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-1 z-40 w-48 py-1.5 rounded-xl bg-white border border-[#E2E8F0] shadow-[0_14px_36px_rgba(15,23,42,0.14)]"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium transition-colors ${
                item.danger
                  ? 'text-[#DC2626] hover:bg-[#FEF2F2]'
                  : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
