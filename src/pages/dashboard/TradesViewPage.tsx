import React, { useEffect, useMemo, useState } from 'react';
import { Trade } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { CustomTabs } from '../../components/ui/CustomTabs';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { CustomDatePicker } from '../../components/ui/CustomDatePicker';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface TradesViewPageProps {
  t: TranslationDictionary;
  initialMode?: 'active' | 'history';
  activeTrades: Trade[];
  historyTrades: Trade[];
  onSelectTrade: (trade: Trade) => void;
}

export const TradesViewPage: React.FC<TradesViewPageProps> = ({
  t,
  initialMode = 'active',
  activeTrades,
  historyTrades,
  onSelectTrade,
}) => {
  const [mode, setMode] = useState<'active' | 'history'>(initialMode);
  const [pairFilter, setPairFilter] = useState<string>('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState<'ALL' | 'WIN' | 'LOSS'>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const sourceList = mode === 'active' ? activeTrades : historyTrades;

  const pairOptions = useMemo(() => {
    const unique = Array.from(new Set(sourceList.map((tr) => tr.symbol)));
    return [
      { value: 'ALL', label: t.trades.allPairs },
      ...unique.map((sym) => ({ value: sym, label: sym })),
    ];
  }, [sourceList, t.trades.allPairs]);

  const filtered = useMemo(() => {
    return sourceList.filter((tr) => {
      const pairOk = pairFilter === 'ALL' || tr.symbol === pairFilter;
      const outOk =
        outcomeFilter === 'ALL' ||
        (outcomeFilter === 'WIN' && tr.pnlUsd >= 0) ||
        (outcomeFilter === 'LOSS' && tr.pnlUsd < 0);
      const dateOk = !dateFilter || tr.openedAt.startsWith(dateFilter) || (tr.closedAt?.startsWith(dateFilter) ?? false);
      return pairOk && outOk && dateOk;
    });
  }, [sourceList, pairFilter, outcomeFilter, dateFilter]);

  const netPnl = useMemo(() => filtered.reduce((acc, item) => acc + item.pnlUsd, 0), [filtered]);
  const winCount = useMemo(() => filtered.filter((item) => item.pnlUsd >= 0).length, [filtered]);
  const winRate = filtered.length ? (winCount / filtered.length) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Header Switch & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <CustomTabs
          activeTab={mode}
          onChange={(next) => {
            setMode(next);
            setPairFilter('ALL');
            setOutcomeFilter('ALL');
            setDateFilter('');
          }}
          tabs={[
            { id: 'active', label: t.trades.activeTab, count: activeTrades.length },
            { id: 'history', label: t.trades.historyTab, count: historyTrades.length },
          ]}
        />

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-xs text-[#64748B] mr-2">{t.trades.netPnl}:</span>
            <span className={`font-mono font-semibold ${netPnl >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
              {netPnl >= 0 ? '+' : '-'}${Math.abs(netPnl).toFixed(2)}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-xs text-[#64748B] mr-2">{t.trades.winRate}:</span>
            <span className="font-mono font-semibold text-[#0F172A]">{winRate.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="ox-card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <CustomSelect
          value={pairFilter}
          onChange={setPairFilter}
          options={pairOptions}
        />
        <CustomSelect
          value={outcomeFilter}
          onChange={(v) => setOutcomeFilter(v as 'ALL' | 'WIN' | 'LOSS')}
          options={[
            { value: 'ALL', label: t.trades.allResults },
            { value: 'WIN', label: t.trades.winsOnly },
            { value: 'LOSS', label: t.trades.lossesOnly },
          ]}
        />
        <CustomDatePicker
          value={dateFilter}
          onChange={setDateFilter}
          placeholder={t.trades.dateFilter}
          clearLabel={t.common.clear}
        />
      </div>

      {/* Table */}
      <section className="ox-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#64748B]">{t.trades.empty}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  <th className="py-3.5 px-5">{t.trades.pair}</th>
                  <th className="py-3.5 px-4 text-right">{t.trades.entry}</th>
                  <th className="py-3.5 px-4 text-right">
                    {mode === 'active' ? t.trades.current : t.trades.exit}
                  </th>
                  <th className="py-3.5 px-4 text-right hidden sm:table-cell">{t.trades.amount}</th>
                  <th className="py-3.5 px-4 text-right">{t.trades.pnl}</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">{t.trades.duration}</th>
                  <th className="py-3.5 px-5 text-right">{t.trades.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-sm">
                {filtered.map((tr) => {
                  const pos = tr.pnlUsd >= 0;
                  return (
                    <tr
                      key={tr.id}
                      onClick={() => onSelectTrade(tr)}
                      className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-[#0F172A]">{tr.symbol}</p>
                        <p className="text-xs text-[#64748B]">{tr.strategy}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#334155]">
                        ${tr.entryPrice}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#0F172A]">
                        ${mode === 'active' ? tr.currentPrice : tr.exitPrice}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#334155] hidden sm:table-cell">
                        ${tr.amountUsd.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        <p className={`font-semibold ${pos ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                          {pos ? '+' : '-'}${Math.abs(tr.pnlUsd).toFixed(2)}
                        </p>
                        <p className={`text-xs ${pos ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                          {pos ? '+' : ''}
                          {tr.pnlPct.toFixed(2)}%
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] font-mono text-xs hidden md:table-cell">
                        {tr.durationLabel}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <StatusBadge
                          tone={tr.status === 'active' ? 'blue' : 'slate'}
                          label={tr.status === 'active' ? t.statusLabels.active : t.statusLabels.closed}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
