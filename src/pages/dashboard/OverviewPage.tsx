import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, ArrowUpRight, ChevronRight, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AppRoute, MarketAsset, PortfolioPoint, TimeframeKey, Trade } from '../../types';
import { TranslationDictionary, translateDecision } from '../../i18n/translations';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface OverviewPageProps {
  t: TranslationDictionary;
  totalBalance: number;
  totalProfit: number;
  todayProfit: number;
  activeTrades: Trade[];
  recentTrades: Trade[];
  opportunities: MarketAsset[];
  portfolioSeries: Record<TimeframeKey, PortfolioPoint[]>;
  onNavigate: (route: AppRoute) => void;
  onSelectTrade: (trade: Trade) => void;
}

const TIMEFRAMES: TimeframeKey[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export const OverviewPage: React.FC<OverviewPageProps> = ({
  t,
  totalBalance,
  totalProfit,
  todayProfit,
  activeTrades,
  recentTrades,
  opportunities,
  portfolioSeries,
  onNavigate,
  onSelectTrade,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeKey>('1M');
  const chartData = useMemo(() => portfolioSeries[timeframe] ?? portfolioSeries['1M'], [portfolioSeries, timeframe]);

  const topOpportunities = useMemo(
    () =>
      [...opportunities]
        .sort((a, b) => b.opportunityScore - a.opportunityScore)
        .slice(0, 4),
    [opportunities]
  );

  const combinedRecentTrades = useMemo(
    () => [...activeTrades.slice(0, 2), ...recentTrades.slice(0, 2)].slice(0, 4),
    [activeTrades, recentTrades]
  );

  const kpis = [
    {
      label: t.overview.totalBalance,
      value: totalBalance,
      prefix: '$',
      decimals: 2,
      toneClass: 'text-[#0F172A]',
      icon: <Wallet className="w-4 h-4 text-[#2563EB]" />,
      iconBg: 'bg-[#EFF6FF]',
    },
    {
      label: t.overview.totalProfit,
      value: Math.abs(totalProfit),
      prefix: totalProfit >= 0 ? '+$' : '-$',
      decimals: 2,
      toneClass: totalProfit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]',
      icon: <TrendingUp className="w-4 h-4 text-[#16A34A]" />,
      iconBg: 'bg-[#F0FDF4]',
    },
    {
      label: t.overview.todayProfit,
      value: Math.abs(todayProfit),
      prefix: todayProfit >= 0 ? '+$' : '-$',
      decimals: 2,
      toneClass: todayProfit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]',
      icon: <ArrowUpRight className="w-4 h-4 text-[#2563EB]" />,
      iconBg: 'bg-[#EFF6FF]',
    },
    {
      label: t.overview.activeTrades,
      value: activeTrades.length,
      prefix: '',
      decimals: 0,
      toneClass: 'text-[#0F172A]',
      icon: <Activity className="w-4 h-4 text-[#2563EB]" />,
      iconBg: 'bg-[#EFF6FF]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: idx * 0.04 }}
            className="ox-card ox-card-hover p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-[#64748B]">{kpi.label}</span>
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.iconBg}`}>
                {kpi.icon}
              </span>
            </div>
            <div className={`mt-3 text-2xl font-display font-bold tracking-tight ${kpi.toneClass}`}>
              <AnimatedNumber value={kpi.value} decimals={kpi.decimals} prefix={kpi.prefix} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Portfolio Chart */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.14 }}
        className="ox-card p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-semibold text-base text-[#0F172A]">
              {t.overview.portfolioChart}
            </h2>
            <p className="text-xl font-display font-bold text-[#0F172A] mt-1 tabular-nums">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F1F5F9]">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  timeframe === tf
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[260px] w-full">
          {chartData.length ? <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="oxvBlueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.22} />
                  <stop offset="65%" stopColor="#60A5FA" stopOpacity={0.07} />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 400', 'dataMax + 300']}
                tick={{ fill: '#64748B', fontSize: 12 }}
                tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(1)}k`}
              />
              <Tooltip
                cursor={{ stroke: '#93C5FD', strokeWidth: 1.5 }}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
                  fontSize: '12px',
                }}
                formatter={(value) => [
                  `$${Number(value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                  t.overview.totalBalance,
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#oxvBlueFill)"
                isAnimationActive={false}
                activeDot={{ r: 5, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer> : <div className="h-full flex items-center justify-center text-sm text-[#64748B]">{t.common.noData}</div>}
        </div>
      </motion.section>

      {/* Bottom Row: Recent Trades & Detected Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <section className="ox-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-base text-[#0F172A]">
              {t.overview.recentTrades}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('trades')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
            >
              <span>{t.overview.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {combinedRecentTrades.map((trade) => {
              const positive = trade.pnlUsd >= 0;
              return (
                <button
                  key={trade.id}
                  type="button"
                  onClick={() => onSelectTrade(trade)}
                  className="w-full py-3.5 flex items-center justify-between gap-4 text-left hover:bg-[#F8FAFC] -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#0F172A]">{trade.symbol}</span>
                      <StatusBadge
                        tone={trade.status === 'active' ? 'blue' : 'slate'}
                        label={trade.status === 'active' ? t.statusLabels.active : t.statusLabels.closed}
                      />
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 truncate">
                      ${trade.amountUsd.toLocaleString()} · {trade.durationLabel}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold font-mono tabular-nums ${positive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {positive ? '+' : '-'}${Math.abs(trade.pnlUsd).toFixed(2)}
                    </p>
                    <p className={`text-xs font-mono tabular-nums ${positive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                      {positive ? '+' : ''}
                      {trade.pnlPct.toFixed(2)}%
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Detected Opportunities */}
        <section className="ox-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <h2 className="font-display font-semibold text-base text-[#0F172A]">
                {t.overview.detectedOpportunities}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
            >
              <span>{t.overview.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {topOpportunities.map((asset) => {
              const positive24h = asset.change24h >= 0;
              const badgeTone =
                asset.signalStatus === 'BUY' ? 'emerald' : asset.signalStatus === 'SELL' ? 'red' : 'slate';
              return (
                <button
                  key={asset.symbol}
                  type="button"
                  onClick={() => onNavigate('scanner')}
                  className="w-full py-3.5 flex items-center justify-between gap-4 text-left hover:bg-[#F8FAFC] -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#0F172A]">{asset.symbol}</span>
                      <span className="text-xs text-[#64748B] truncate">{asset.name}</span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 font-mono tabular-nums">
                      ${asset.price.toLocaleString('en-US', { maximumFractionDigits: 4 })} ·{' '}
                      <span className={positive24h ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                        {positive24h ? '+' : ''}
                        {asset.change24h.toFixed(2)}%
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-[11px] text-[#64748B]">{t.overview.score}</p>
                      <p className="text-xs font-semibold font-mono text-[#2563EB]">{asset.opportunityScore}</p>
                    </div>
                    <StatusBadge tone={badgeTone} label={translateDecision(asset.signalStatus, t)} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
