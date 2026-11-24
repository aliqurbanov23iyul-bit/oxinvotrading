import React, { useMemo } from 'react';
import { BarChart3, PieChart as PieChartIcon, Wallet } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BinanceBalanceAsset, Trade } from '../../types';
import { TranslationDictionary } from '../../i18n/translations';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { CoinIcon } from '../../components/ui/CoinIcon';
import { EmptyState } from '../../components/ui/EmptyState';
import { useTheme } from '../../components/ui/ThemeContext';

const BLUE_PIE_PALETTE = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#CBD5E1'];

interface PortfolioPageProps {
  t: TranslationDictionary;
  balances: BinanceBalanceAsset[];
  totalValueUsd: number;
  availableUsd: number;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  t,
  balances,
  totalValueUsd,
  availableUsd,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const inTrades = Math.max(0, totalValueUsd - availableUsd);
  const allocationData = useMemo(
    () =>
      balances.map((b) => ({
        name: b.asset,
        value: Number(b.usdValue.toFixed(2)),
        share: totalValueUsd > 0 ? (b.usdValue / totalValueUsd) * 100 : 0,
      })),
    [balances, totalValueUsd]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="ox-card p-5">
          <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{t.portfolio.totalValue}</p>
          <p className="mt-2 text-2xl font-display font-bold text-[#0A1428] dark:text-[#F1F5F9] tabular-nums">
            <AnimatedNumber value={totalValueUsd} prefix="$" decimals={2} />
          </p>
        </div>
        <div className="ox-card p-5">
          <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{t.portfolio.availableCash}</p>
          <p className="mt-2 text-2xl font-display font-bold text-[#2563EB] dark:text-[#60A5FA] tabular-nums">
            <AnimatedNumber value={availableUsd} prefix="$" decimals={2} />
          </p>
        </div>
        <div className="ox-card p-5">
          <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{t.portfolio.inTrades}</p>
          <p className="mt-2 text-2xl font-display font-bold text-[#0A1428] dark:text-[#F1F5F9] tabular-nums">
            <AnimatedNumber value={inTrades} prefix="$" decimals={2} />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="ox-card p-6 lg:col-span-5 flex flex-col">
          <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9] mb-4">
            {t.portfolio.allocation}
          </h2>
          {allocationData.length === 0 ? (
            <EmptyState
              compact
              icon={<PieChartIcon className="w-5 h-5" />}
              title={t.common.noData}
            />
          ) : (
            <>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={92}
                      paddingAngle={3}
                      isAnimationActive={false}
                    >
                      {allocationData.map((entry, idx) => (
                        <Cell key={entry.name} fill={BLUE_PIE_PALETTE[idx % BLUE_PIE_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0B1324' : '#FFFFFF',
                        borderColor: isDark ? '#1B2942' : '#E2E8F0',
                        borderRadius: '12px',
                        color: isDark ? '#F1F5F9' : '#0A1428',
                        fontSize: '12px',
                      }}
                      formatter={(value) => `$${Number(value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {allocationData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-xs px-2 py-1">
                    <span className="inline-flex items-center gap-2 text-[#334155] dark:text-[#CBD5E1] font-medium">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: BLUE_PIE_PALETTE[idx % BLUE_PIE_PALETTE.length] }}
                      />
                      {item.name}
                    </span>
                    <span className="font-mono text-[#64748B] dark:text-[#94A3B8]">{item.share.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="ox-card lg:col-span-7 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1B2942]">
            <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
              {t.portfolio.holdings}
            </h2>
          </div>
          {allocationData.length === 0 ? (
            <div className="p-6">
              <EmptyState
                compact
                icon={<Wallet className="w-5 h-5" />}
                title={t.common.noData}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] dark:border-[#1B2942] bg-[#F8FAFC] dark:bg-[#070D19] text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    <th className="py-3 px-6">{t.portfolio.asset}</th>
                    <th className="py-3 px-4 text-right">{t.portfolio.balance}</th>
                    <th className="py-3 px-4 text-right">{t.portfolio.valueUsd}</th>
                    <th className="py-3 px-6 text-right">{t.portfolio.share}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#16233B] text-sm">
                  {allocationData.map((row, idx) => {
                    const raw = balances[idx];
                    return (
                      <tr key={row.name} className="hover:bg-[#F8FAFC] dark:hover:bg-[#0D1629]">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-2.5">
                            <CoinIcon symbol={row.name} size={24} />
                            <span className="font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{row.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#334155] dark:text-[#CBD5E1]">
                          {raw.free.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums font-medium text-[#0A1428] dark:text-[#F1F5F9]">
                          ${row.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-6 text-right font-mono tabular-nums text-[#2563EB] dark:text-[#60A5FA]">
                          {row.share.toFixed(1)}%
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
    </div>
  );
};

interface AnalyticsPageProps {
  t: TranslationDictionary;
  historyTrades: Trade[];
  activeTrades: Trade[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ t, historyTrades, activeTrades }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const allTrades = useMemo(() => [...activeTrades, ...historyTrades], [activeTrades, historyTrades]);

  const stats = useMemo(() => {
    const wins = historyTrades.filter((tr) => tr.pnlUsd > 0);
    const losses = historyTrades.filter((tr) => tr.pnlUsd < 0);
    const grossWin = wins.reduce((acc, tr) => acc + tr.pnlUsd, 0);
    const grossLoss = Math.abs(losses.reduce((acc, tr) => acc + tr.pnlUsd, 0));
    const winRate = historyTrades.length ? (wins.length / historyTrades.length) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? 4.2 : 0;
    return {
      winRate,
      profitFactor,
      avgDuration: allTrades.length ? '—' : '0',
      totalTrades: allTrades.length,
    };
  }, [historyTrades, allTrades]);

  const dailyBars = useMemo(() => {
    const grouped = new Map<string, number>();
    historyTrades.forEach((trade) => {
      const day = (trade.closedAt ?? trade.openedAt).slice(0, 10);
      grouped.set(day, (grouped.get(day) ?? 0) + trade.pnlUsd);
    });
    return [...grouped].map(([day, pnl]) => ({ day, pnl }));
  }, [historyTrades]);

  const strategyStats = useMemo(() => {
    const map = new Map<string, { count: number; pnl: number }>();
    allTrades.forEach((tr) => {
      const prev = map.get(tr.strategy) ?? { count: 0, pnl: 0 };
      map.set(tr.strategy, { count: prev.count + 1, pnl: prev.pnl + tr.pnlUsd });
    });
    return Array.from(map.entries()).map(([strategy, data]) => ({ strategy, ...data }));
  }, [allTrades]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="ox-card p-5">
          <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{t.analytics.winRate}</p>
          <p className="mt-2 text-2xl font-display font-bold text-[#059669] dark:text-[#34D399] font-mono tabular-nums">
            {stats.winRate.toFixed(1)}%
          </p>
        </div>
        <div className="ox-card p-5">
          <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{t.analytics.profitFactor}</p>
          <p className="mt-2 text-2xl font-display font-bold text-[#2563EB] dark:text-[#60A5FA] font-mono tabular-nums">
            {stats.profitFactor.toFixed(2)}
          </p>
        </div>
        <div className="ox-card p-5">
          <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{t.analytics.avgDuration}</p>
          <p className="mt-2 text-2xl font-display font-bold text-[#0A1428] dark:text-[#F1F5F9] font-mono tabular-nums">
            {stats.avgDuration}
          </p>
        </div>
        <div className="ox-card p-5">
          <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{t.analytics.totalTrades}</p>
          <p className="mt-2 text-2xl font-display font-bold text-[#0A1428] dark:text-[#F1F5F9] font-mono tabular-nums">
            {stats.totalTrades}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="ox-card p-6 lg:col-span-7">
          <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9] mb-4">
            {t.analytics.pnlByDay}
          </h2>
          {dailyBars.length === 0 ? (
            <EmptyState
              compact
              icon={<BarChart3 className="w-5 h-5" />}
              title={t.common.noData}
            />
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyBars} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1B2942' : '#E2E8F0'} vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.06)' }}
                    contentStyle={{
                      backgroundColor: isDark ? '#0B1324' : '#FFFFFF',
                      borderColor: isDark ? '#1B2942' : '#E2E8F0',
                      borderRadius: '12px',
                      color: isDark ? '#F1F5F9' : '#0A1428',
                      fontSize: '12px',
                    }}
                    formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`}
                  />
                  <Bar dataKey="pnl" radius={[8, 8, 8, 8]} isAnimationActive={false}>
                    {dailyBars.map((bar) => (
                      <Cell key={bar.day} fill={bar.pnl >= 0 ? '#2563EB' : '#DC2626'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="ox-card p-6 lg:col-span-5">
          <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9] mb-4">
            {t.analytics.strategyBreakdown}
          </h2>
          {strategyStats.length === 0 ? (
            <EmptyState
              compact
              icon={<BarChart3 className="w-5 h-5" />}
              title={t.common.noData}
            />
          ) : (
            <div className="space-y-3">
              {strategyStats.map((item) => {
                const pos = item.pnl >= 0;
                return (
                  <div
                    key={item.strategy}
                    className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{item.strategy}</p>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                        {item.count} {t.analytics.tradesCount}
                      </p>
                    </div>
                    <span
                      className={`font-mono font-semibold text-sm ${
                        pos ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]'
                      }`}
                    >
                      {pos ? '+' : '-'}${Math.abs(item.pnl).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
