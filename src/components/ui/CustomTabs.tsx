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
      className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#EEF2F9] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]"
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
                ? 'bg-white dark:bg-[#111C33] text-[#2563EB] dark:text-[#60A5FA] font-semibold shadow-xs border border-transparent dark:border-[#273A5C]'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`ml-1.5 font-mono tabular-nums ${
                  active ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-[#94A3B8] dark:text-[#64748B]'
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
