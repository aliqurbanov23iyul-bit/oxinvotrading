import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LanguageCode } from '../../types';

interface LanguageMeta {
  code: LanguageCode;
  label: string;
  short: string;
}

const LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'az', label: 'Azərbaycanca', short: 'AZ' },
  { code: 'tr', label: 'Türkçe', short: 'TR' },
  { code: 'ru', label: 'Русский', short: 'RU' },
];

const FlagCircle: React.FC<{ code: LanguageCode }> = ({ code }) => {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="rounded-full shrink-0 overflow-hidden ring-1 ring-[#E2E8F0]" aria-hidden="true">
      <defs>
        <clipPath id={`flag-${code}-${uid}`}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#flag-${code}-${uid})`}>
        {code === 'en' && (
          <>
            <rect width="24" height="24" fill="#012169" />
            <path d="M0 0L24 24M24 0L0 24" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="2" />
            <path d="M12 0V24M0 12H24" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="3.5" />
          </>
        )}
        {code === 'az' && (
          <>
            <rect width="24" height="8" y="0" fill="#0092BC" />
            <rect width="24" height="8" y="8" fill="#E4002B" />
            <rect width="24" height="8" y="16" fill="#00AF66" />
            <circle cx="11.5" cy="12" r="2.6" fill="#FFFFFF" />
            <circle cx="12.3" cy="12" r="2.1" fill="#E4002B" />
            <circle cx="14.5" cy="12" r="1" fill="#FFFFFF" />
          </>
        )}
        {code === 'tr' && (
          <>
            <rect width="24" height="24" fill="#E30A17" />
            <circle cx="10.2" cy="12" r="4.6" fill="#FFFFFF" />
            <circle cx="11.5" cy="12" r="3.6" fill="#E30A17" />
            <circle cx="15.2" cy="12" r="1.4" fill="#FFFFFF" />
          </>
        )}
        {code === 'ru' && (
          <>
            <rect width="24" height="8" y="0" fill="#FFFFFF" />
            <rect width="24" height="8" y="8" fill="#0039A6" />
            <rect width="24" height="8" y="16" fill="#D52B1E" />
          </>
        )}
      </g>
    </svg>
  );
};

interface LanguageSelectorProps {
  language: LanguageCode;
  onChange: (code: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  const active = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Select language"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] text-xs font-medium text-[#0F172A] transition-colors whitespace-nowrap shrink-0 shadow-2xs"
      >
        <FlagCircle code={active.code} />
        <span>{active.short}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-1.5 w-44 py-1 rounded-xl bg-white border border-[#E2E8F0] shadow-[0_14px_36px_rgba(15,23,42,0.14)] z-50"
        >
          {LANGUAGES.map((lang) => {
            const isCurrent = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                onClick={() => {
                  onChange(lang.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                  isCurrent ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#334155] hover:bg-[#F8FAFC]'
                }`}
              >
                <FlagCircle code={lang.code} />
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
