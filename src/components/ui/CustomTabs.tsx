import React from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
}

interface CustomTabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  ariaLabel?: string;
}

export function CustomTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  ariaLabel = 'Tabs',
}: CustomTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#EEF2F9] border border-[#E2E8F0]"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45 ${
              active
                ? 'bg-white text-[#2563EB] font-semibold shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`ml-1.5 font-mono tabular-nums ${
                  active ? 'text-[#2563EB]' : 'text-[#94A3B8]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
