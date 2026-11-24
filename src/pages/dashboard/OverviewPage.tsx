import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bot,
  ChevronRight,
  Gauge,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AppRoute, BotStatus, LanguageCode, MarketAsset, PortfolioPoint, RiskConfigState, TimeframeKey, Trade } from '../../types';
import { TranslationDictionary, translateBotStatus, translateDecision } from '../../i18n/translations';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CoinIcon } from '../../components/ui/CoinIcon';
import { EmptyState } from '../../components/ui/EmptyState';
import { useTheme } from '../../components/ui/ThemeContext';
import { InteractiveCandlestickChart } from '../../components/charts/InteractiveCandlestickChart';

interface OverviewPageProps {
  language: LanguageCode;
  t: TranslationDictionary;
  totalBalance: number;
  totalProfit: number;
  todayProfit: number;
  botStatus: BotStatus;
  riskConfig?: RiskConfigState | null;
  binanceConnected?: boolean;
  activeTrades: Trade[];
  recentTrades: Trade[];
  opportunities: MarketAsset[];
  portfolioSeries: Record<TimeframeKey, PortfolioPoint[]>;
  onNavigate: (route: AppRoute) => void;
  onSelectTrade: (trade: Trade) => void;
}

const TIMEFRAMES: TimeframeKey[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export const OverviewPage: React.FC<OverviewPageProps> = ({
  language,
  t,
  totalBalance,
  totalProfit,
  todayProfit,
  botStatus,
  riskConfig,
  binanceConnected = false,
  activeTrades,
  recentTrades,
  opportunities,
  portfolioSeries,
  onNavigate,
  onSelectTrade,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const extra = EXTRA_COPY[language];
  const [timeframe, setTimeframe] = useState<TimeframeKey>('1M');
  const chartData = useMemo(() => portfolioSeries[timeframe] ?? portfolioSeries['1M'], [portfolioSeries, timeframe]);

  const topOpportunities = useMemo(
    () => [...opportunities].sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, 4),
    [opportunities],
  );

  const combinedRecentTrades = useMemo(
    () => [...activeTrades.slice(0, 2), ...recentTrades.slice(0, 2)].slice(0, 4),
    [activeTrades, recentTrades],
  );

  const riskLabel = riskConfig
    ? extra.botExtra.riskLevels[riskConfig.riskLevel]
    : extra.botExtra.riskLevels.BALANCED;

  const kpis = [
    {
      label: t.overview.totalBalance,
      value: totalBalance,
      prefix: '$',
      decimals: 2,
      toneClass: 'text-[#0A1428] dark:text-[#F1F5F9]',
      icon: <Wallet className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />,
      iconBg: 'bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60',
    },
    {
      label: t.overview.todayProfit,
      value: Math.abs(todayProfit),
      prefix: todayProfit >= 0 ? '+$' : '-$',
      decimals: 2,
      toneClass: todayProfit >= 0 ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]',
      icon: <ArrowUpRight className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />,
      iconBg: 'bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60',
    },
    {
      label: t.overview.totalProfit,
      value: Math.abs(totalProfit),
      prefix: totalProfit >= 0 ? '+$' : '-$',
      decimals: 2,
      toneClass: totalProfit >= 0 ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]',
      icon: <TrendingUp className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />,
      iconBg: 'bg-[#ECFDF5] dark:bg-[#064E3B]/40 border border-[#A7F3D0]/60 dark:border-[#047857]/60',
    },
    {
      label: t.overview.activeTrades,
      value: activeTrades.length,
      prefix: '',
      decimals: 0,
      toneClass: 'text-[#0A1428] dark:text-[#F1F5F9]',
      icon: <Activity className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />,
      iconBg: 'bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60',
    },
  ];

  return (
    <div className="space-y-6">
      {!binanceConnected && (
        <div className="ox-card p-4 bg-gradient-to-r from-[#EFF6FF] to-white dark:from-[#0B172E] dark:to-[#0B1324] border-[#BFDBFE] dark:border-[#1E3A8A]/70 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-[#1E40AF] dark:text-[#93C5FD]">
              {extra.overviewExtra.integrationUnavailable}
            </p>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
              {extra.overviewExtra.connectExchangeHint}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('connections')}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#070D19] border border-[#BFDBFE] dark:border-[#1E3A8A] text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#EFF6FF] dark:hover:bg-[#111C33] transition-colors"
          >
            {extra.dashboardNav.binanceConnection}
          </button>
        </div>
      )}

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
              <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{kpi.label}</span>
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.iconBg}`}>
                {kpi.icon}
              </span>
            </div>
            <div className={`mt-3 text-2xl font-display font-bold tracking-tight tabular-nums ${kpi.toneClass}`}>
              <AnimatedNumber value={kpi.value} decimals={kpi.decimals} prefix={kpi.prefix} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Secondary Status Row: Active Bots, Bot Status, Risk Level */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('ai-engine')}
          className="ox-card ox-card-hover p-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#EFF6FF] dark:bg-[#111C33] text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60">
              <Bot className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{extra.overviewExtra.activeBots}</p>
              <p className="font-mono font-bold text-base text-[#0A1428] dark:text-[#F1F5F9] mt-0.5 tabular-nums">
                {botStatus === 'running' ? 1 : 0} / 1
              </p>
            </div>
          </div>
          <StatusBadge
            tone={botStatus === 'running' ? 'blue' : botStatus === 'paused' ? 'amber' : 'slate'}
            label={translateBotStatus(botStatus, t)}
          />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('ai-engine')}
          className="ox-card ox-card-hover p-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] text-[#0A1428] dark:text-[#F1F5F9] flex items-center justify-center border border-[#E2E8F0] dark:border-[#1B2942]">
              <Gauge className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
            </span>
            <div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{extra.overviewExtra.botStatus}</p>
              <p className="font-display font-semibold text-sm text-[#0A1428] dark:text-[#F1F5F9] mt-0.5">
                {translateBotStatus(botStatus, t)} · PAPER
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('risk')}
          className="ox-card ox-card-hover p-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#EFF6FF] dark:bg-[#111C33] text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{extra.overviewExtra.riskLevel}</p>
              <p className="font-display font-semibold text-sm text-[#0A1428] dark:text-[#F1F5F9] mt-0.5">{riskLabel}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
            SL {riskConfig?.stopLossPct ?? 2.5}%
          </span>
        </button>
      </div>

      {/* Interactive OHLC Candlestick Market Terminal */}
      <InteractiveCandlestickChart
        language={language}
        symbol={riskConfig?.selectedPair ?? 'BTC/USDT'}
        onOpenConnections={() => onNavigate('connections')}
      />

      {/* Portfolio Balance Chart */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.14 }}
        className="ox-card p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
              {t.overview.portfolioChart}
            </h2>
            <p className="text-xl font-display font-bold text-[#0A1428] dark:text-[#F1F5F9] mt-1 tabular-nums">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#EEF2F9] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  timeframe === tf
                    ? 'bg-white dark:bg-[#111C33] text-[#2563EB] dark:text-[#60A5FA] shadow-2xs'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[240px] w-full">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="oxvBlueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isDark ? '#3B82F6' : '#2563EB'} stopOpacity={0.26} />
                    <stop offset="65%" stopColor="#60A5FA" stopOpacity={0.07} />
                    <stop offset="100%" stopColor={isDark ? '#0B1324' : '#FFFFFF'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1B2942' : '#E2E8F0'} vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={['dataMin - 400', 'dataMax + 300']}
                  tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }}
                  tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  cursor={{ stroke: isDark ? '#3B82F6' : '#93C5FD', strokeWidth: 1.5 }}
                  contentStyle={{
                    backgroundColor: isDark ? '#0B1324' : '#FFFFFF',
                    borderColor: isDark ? '#1B2942' : '#E2E8F0',
                    borderRadius: '12px',
                    color: isDark ? '#F1F5F9' : '#0A1428',
                    boxShadow: isDark ? '0 10px 25px rgba(2, 6, 23, 0.5)' : '0 10px 25px rgba(15, 23, 42, 0.08)',
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
                  stroke={isDark ? '#3B82F6' : '#2563EB'}
                  strokeWidth={2.5}
                  fill="url(#oxvBlueFill)"
                  isAnimationActive={false}
                  activeDot={{ r: 5, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              compact
              icon={<BarChart3 className="w-5 h-5" />}
              title={t.common.noData}
              description={extra.overviewExtra.integrationUnavailable}
              actionLabel={!binanceConnected ? extra.dashboardNav.binanceConnection : undefined}
              onAction={!binanceConnected ? () => onNavigate('connections') : undefined}
            />
          )}
        </div>
      </motion.section>

      {/* Bottom Row: Recent Trades & Market Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="ox-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
              {t.overview.recentTrades}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('trade-history')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:text-[#1D4ED8]"
            >
              <span>{t.overview.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {combinedRecentTrades.length === 0 ? (
            <EmptyState
              compact
              icon={<Activity className="w-5 h-5" />}
              title={t.common.noData}
              description={t.trades.empty}
            />
          ) : (
            <div className="divide-y divide-[#F1F5F9] dark:divide-[#16233B]">
              {combinedRecentTrades.map((trade) => {
                const positive = trade.pnlUsd >= 0;
                return (
                  <button
                    key={trade.id}
                    type="button"
                    onClick={() => onSelectTrade(trade)}
                    className="w-full py-3.5 flex items-center justify-between gap-4 text-left hover:bg-[#F8FAFC] dark:hover:bg-[#0D1629] -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CoinIcon symbol={trade.symbol} size={30} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#0A1428] dark:text-[#F1F5F9]">
                            {trade.symbol}
                          </span>
                          <StatusBadge
                            tone={trade.status === 'active' ? 'blue' : 'slate'}
                            label={trade.status === 'active' ? t.statusLabels.active : t.statusLabels.closed}
                          />
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5 truncate">
                          ${trade.amountUsd.toLocaleString()} · {trade.durationLabel}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm font-semibold font-mono tabular-nums ${
                          positive ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]'
                        }`}
                      >
                        {positive ? '+' : '-'}${Math.abs(trade.pnlUsd).toFixed(2)}
                      </p>
                      <p
                        className={`text-xs font-mono tabular-nums ${
                          positive ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]'
                        }`}
                      >
                        {positive ? '+' : ''}
                        {trade.pnlPct.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="ox-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
              <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                {extra.overviewExtra.marketIndicators}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:text-[#1D4ED8]"
            >
              <span>{t.overview.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {topOpportunities.length === 0 ? (
            <EmptyState
              compact
              icon={<Sparkles className="w-5 h-5" />}
              title={t.common.noData}
              description={extra.overviewExtra.integrationUnavailable}
            />
          ) : (
            <div className="divide-y divide-[#F1F5F9] dark:divide-[#16233B]">
              {topOpportunities.map((asset) => {
                const positive24h = asset.change24h >= 0;
                const badgeTone =
                  asset.signalStatus === 'BUY' ? 'emerald' : asset.signalStatus === 'SELL' ? 'red' : 'slate';
                return (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => onNavigate('scanner')}
                    className="w-full py-3.5 flex items-center justify-between gap-4 text-left hover:bg-[#F8FAFC] dark:hover:bg-[#0D1629] -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CoinIcon symbol={asset.symbol} size={30} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#0A1428] dark:text-[#F1F5F9]">
                            {asset.symbol}
                          </span>
                          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate">{asset.name}</span>
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5 font-mono tabular-nums">
                          ${asset.price.toLocaleString('en-US', { maximumFractionDigits: 4 })} ·{' '}
                          <span
                            className={
                              positive24h ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]'
                            }
                          >
                            {positive24h ? '+' : ''}
                            {asset.change24h.toFixed(2)}%
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{t.overview.score}</p>
                        <p className="text-xs font-semibold font-mono text-[#2563EB] dark:text-[#60A5FA]">
                          {asset.opportunityScore}
                        </p>
                      </div>
                      <StatusBadge tone={badgeTone} label={translateDecision(asset.signalStatus, t)} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
