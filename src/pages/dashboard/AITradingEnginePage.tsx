import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Lock, Pause, Play, ShieldCheck, SlidersHorizontal, Square } from 'lucide-react';
import {
  AIDecisionCard,
  ActivityEvent,
  BotStatus,
  LanguageCode,
  RiskConfigState,
  StrategyMode,
} from '../../types';
import { TranslationDictionary, translateBotStatus, translateDecision } from '../../i18n/translations';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { TradingCandlestickCanvas } from '../../components/three/AICoreCanvas';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CustomModal } from '../../components/ui/CustomModal';
import { CustomRadioGroup } from '../../components/ui/CustomRadioGroup';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { CustomSlider } from '../../components/ui/CustomSlider';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { CoinIcon } from '../../components/ui/CoinIcon';
import { EmptyState } from '../../components/ui/EmptyState';

interface AITradingEnginePageProps {
  language: LanguageCode;
  t: TranslationDictionary;
  botStatus: BotStatus;
  strategy: StrategyMode;
  riskConfig: RiskConfigState;
  assetsScanned: number;
  opportunitiesDetected: number;
  activeTradesCount: number;
  todayPnl: number;
  activityFeed: ActivityEvent[];
  decisions: AIDecisionCard[];
  onBotStatusChange: (status: BotStatus) => void;
  onStrategyChange: (strategy: StrategyMode) => void;
  onSaveRiskConfig: (next: Partial<RiskConfigState>) => Promise<void>;
}

const PAIRS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT'];

export const AITradingEnginePage: React.FC<AITradingEnginePageProps> = ({
  language,
  t,
  botStatus,
  strategy,
  riskConfig,
  assetsScanned,
  opportunitiesDetected,
  activeTradesCount,
  todayPnl,
  activityFeed,
  decisions,
  onBotStatusChange,
  onStrategyChange,
  onSaveRiskConfig,
}) => {
  const extra = EXTRA_COPY[language].botExtra;
  const visualCopy = EXTRA_COPY[language].engineVisual;
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState(riskConfig.selectedPair);
  const [riskLevel, setRiskLevel] = useState<RiskConfigState['riskLevel']>(riskConfig.riskLevel);
  const [stopLossPct, setStopLossPct] = useState(riskConfig.stopLossPct);
  const [takeProfitPct, setTakeProfitPct] = useState(riskConfig.takeProfitPct);
  const [maxDailyLossPct, setMaxDailyLossPct] = useState(riskConfig.maxDailyLossPct);
  const [tradeAmountUsd, setTradeAmountUsd] = useState(riskConfig.tradeAmountUsd);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedPair(riskConfig.selectedPair);
    setRiskLevel(riskConfig.riskLevel);
    setStopLossPct(riskConfig.stopLossPct);
    setTakeProfitPct(riskConfig.takeProfitPct);
    setMaxDailyLossPct(riskConfig.maxDailyLossPct);
    setTradeAmountUsd(riskConfig.tradeAmountUsd);
  }, [riskConfig]);

  const strategyOptions: { value: StrategyMode; label: string }[] = [
    { value: 'Adaptive Momentum', label: t.aiBot.strategies.adaptive },
    { value: 'Breakout Volume Surge', label: t.aiBot.strategies.breakout },
    { value: 'Mean Reversion', label: t.aiBot.strategies.reversion },
    { value: 'Liquidity Impulse', label: t.aiBot.strategies.impulse },
  ];

  const statusTone = botStatus === 'running' ? 'blue' : botStatus === 'paused' ? 'amber' : 'slate';

  const stats = [
    {
      label: t.aiBot.assetsScanned,
      value: assetsScanned,
      prefix: '',
      decimals: 0,
      color: 'text-[#0A1428] dark:text-[#F1F5F9]',
    },
    {
      label: t.aiBot.opportunitiesDetected,
      value: opportunitiesDetected,
      prefix: '',
      decimals: 0,
      color: 'text-[#2563EB] dark:text-[#60A5FA]',
    },
    {
      label: t.aiBot.activeTrades,
      value: activeTradesCount,
      prefix: '',
      decimals: 0,
      color: 'text-[#0A1428] dark:text-[#F1F5F9]',
    },
    {
      label: t.aiBot.todayPnl,
      value: Math.abs(todayPnl),
      prefix: todayPnl >= 0 ? '+$' : '-$',
      decimals: 2,
      color: todayPnl >= 0 ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]',
    },
  ];

  const activeStrategyLabel = strategyOptions.find((s) => s.value === strategy)?.label ?? strategy;

  const handleSaveParams = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveRiskConfig({
        selectedPair,
        riskLevel,
        stopLossPct,
        takeProfitPct,
        maxDailyLossPct,
        tradeAmountUsd,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Hero: 3D Trading Candlestick Stage + Mode Switch + Start/Stop + 4 Core Metrics */}
      <section className="ox-card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 relative ox-terminal-stage min-h-[300px] sm:min-h-[360px] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#172847]">
            <div className="relative z-10 flex items-center justify-between px-4 pt-4">
              <div className="flex items-center gap-2">
                <CoinIcon symbol={selectedPair} size={24} />
                <span className="font-mono text-xs font-semibold text-[#F1F5F9]">{selectedPair}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#111C33]/90 border border-[#273A5C] text-[10px] font-mono text-[#93C5FD]">
                {visualCopy.demoBadge}
              </span>
            </div>
            <div className="flex-1 w-full min-h-[240px]">
              <TradingCandlestickCanvas status={botStatus} interactive variant="hero" />
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{t.aiBot.status}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display font-bold text-2xl text-[#0A1428] dark:text-[#F1F5F9]">
                    {translateBotStatus(botStatus, t)}
                  </h2>
                  <StatusBadge tone={statusTone} label={activeStrategyLabel} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAdvancedOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1B2942] bg-white dark:bg-[#070D19] hover:bg-[#F8FAFC] dark:hover:bg-[#111C33] text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                <span>{t.aiBot.advancedSettings}</span>
              </button>
            </div>

            {/* Paper Trading vs Real Trading (Real Trading strictly disabled) */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center p-1 rounded-xl bg-white dark:bg-[#0B1324] border border-[#E2E8F0] dark:border-[#1B2942]">
                  <span className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold">
                    {extra.paperTrading}
                  </span>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title={extra.realTradingDisabledNote}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] dark:text-[#64748B] cursor-not-allowed"
                  >
                    <Lock className="w-3 h-3" />
                    <span>{extra.realTrading}</span>
                  </button>
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">
                  <CoinIcon symbol={selectedPair} size={18} />
                  <span>{selectedPair}</span>
                </div>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] shrink-0 mt-0.5" />
                <span>{extra.realTradingDisabledNote}</span>
              </p>
            </div>

            {/* Start / Pause / Stop Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <MagneticButton
                variant={botStatus === 'running' ? 'primary' : 'secondary'}
                onClick={() => onBotStatusChange('running')}
                className="flex-1 min-w-[100px]"
              >
                <Play className="w-4 h-4" />
                <span>{t.aiBot.start}</span>
              </MagneticButton>

              <MagneticButton
                variant={botStatus === 'paused' ? 'primary' : 'secondary'}
                onClick={() => onBotStatusChange('paused')}
                className="flex-1 min-w-[100px]"
              >
                <Pause className="w-4 h-4" />
                <span>{t.aiBot.pause}</span>
              </MagneticButton>

              <MagneticButton
                variant={botStatus === 'stopped' ? 'danger' : 'secondary'}
                onClick={() => onBotStatusChange('stopped')}
                className="flex-1 min-w-[100px]"
              >
                <Square className="w-4 h-4" />
                <span>{t.aiBot.stop}</span>
              </MagneticButton>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]"
                >
                  <p className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] truncate">
                    {item.label}
                  </p>
                  <p className={`mt-1 text-lg font-display font-bold tabular-nums ${item.color}`}>
                    <AnimatedNumber value={item.value} decimals={item.decimals} prefix={item.prefix} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strategy, Pair & Risk Controls */}
      <form onSubmit={handleSaveParams} className="ox-card p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
              {t.aiBot.advancedTitle}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{extra.engineUnavailable}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            label={t.aiBot.strategyLabel}
            value={strategy}
            onChange={(val) => onStrategyChange(val as StrategyMode)}
            options={strategyOptions}
          />
          <CustomSelect
            label={extra.pairLabel}
            value={selectedPair}
            onChange={setSelectedPair}
            options={PAIRS.map((p) => ({ value: p, label: p }))}
          />
          <CustomSelect
            label={extra.riskLevelLabel}
            value={riskLevel}
            onChange={(val) => setRiskLevel(val as RiskConfigState['riskLevel'])}
            options={[
              { value: 'CONSERVATIVE', label: extra.riskLevels.CONSERVATIVE },
              { value: 'BALANCED', label: extra.riskLevels.BALANCED },
              { value: 'AGGRESSIVE', label: extra.riskLevels.AGGRESSIVE },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <CustomSlider
            label={extra.stopLossPct}
            value={stopLossPct}
            min={0.5}
            max={15}
            step={0.5}
            valueSuffix="%"
            onChange={setStopLossPct}
          />
          <CustomSlider
            label={extra.takeProfitPct}
            value={takeProfitPct}
            min={1}
            max={30}
            step={0.5}
            valueSuffix="%"
            onChange={setTakeProfitPct}
          />
          <CustomSlider
            label={extra.maxDailyLossPct}
            value={maxDailyLossPct}
            min={1}
            max={20}
            step={0.5}
            valueSuffix="%"
            onChange={setMaxDailyLossPct}
          />
          <div>
            <label htmlFor="bot-trade-amount" className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8] mb-2">
              {extra.tradeAmountUsd}
            </label>
            <input
              id="bot-trade-amount"
              type="number"
              min={10}
              max={100000}
              step={10}
              value={tradeAmountUsd}
              onChange={(e) => setTradeAmountUsd(Math.max(10, Number(e.target.value) || 10))}
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-white dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] text-[#0A1428] dark:text-[#F1F5F9] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <MagneticButton type="submit" loading={saving}>
            <span>{extra.saveConfig}</span>
          </MagneticButton>
        </div>
      </form>

      {/* Bot Activity History */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="ox-card p-5 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
            {t.aiBot.activityFeed}
          </h3>
        </div>

        {activityFeed.length === 0 ? (
          <EmptyState
            compact
            icon={<Activity className="w-5 h-5" />}
            title={t.common.noData}
            description={extra.engineUnavailable}
          />
        ) : (
          <div className="divide-y divide-[#F1F5F9] dark:divide-[#16233B]">
            {activityFeed.map((ev) => {
              const loc = t.demoActivity[ev.id];
              return (
                <div key={ev.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0A1428] dark:text-[#F1F5F9]">
                      {loc ? loc.title : ev.title}
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      {loc ? loc.detail : ev.detail}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-[#94A3B8] dark:text-[#64748B] font-mono">
                      {loc ? loc.timestamp : ev.timestamp}
                    </span>
                    {typeof ev.deltaUsd === 'number' && (
                      <p
                        className={`text-xs font-semibold font-mono mt-0.5 ${
                          ev.deltaUsd >= 0 ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]'
                        }`}
                      >
                        {ev.deltaUsd >= 0 ? '+' : '-'}${Math.abs(ev.deltaUsd).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.section>

      <CustomModal
        open={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
        title={t.aiBot.advancedTitle}
        maxWidthClass="max-w-2xl"
      >
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-3">
              {t.aiBot.strategyLabel}
            </p>
            <CustomRadioGroup
              name="strategy-mode"
              columns={2}
              value={strategy}
              onChange={onStrategyChange}
              options={strategyOptions}
            />
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1B2942]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-3">
              {t.aiBot.recentSignals}
            </p>
            {decisions.length === 0 ? (
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] py-4">{t.common.noData}</p>
            ) : (
              <div className="space-y-3">
                {decisions.map((card) => {
                  const tone =
                    card.decision === 'BUY' ? 'emerald' : card.decision === 'SELL' ? 'red' : 'slate';
                  return (
                    <div
                      key={card.id}
                      className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CoinIcon symbol={card.symbol} size={22} />
                          <span className="font-semibold text-sm text-[#0A1428] dark:text-[#F1F5F9]">
                            {card.symbol}
                          </span>
                          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                            {t.overview.score} {card.opportunityScore}
                          </span>
                        </div>
                        <StatusBadge tone={tone} label={translateDecision(card.decision, t)} />
                      </div>
                      <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                        {card.explanation}
                      </p>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                        {t.aiBot.riskNote}: {card.riskEvaluation}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <MagneticButton variant="primary" onClick={() => setAdvancedOpen(false)}>
              {t.common.close}
            </MagneticButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};
