import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Pause, Play, SlidersHorizontal, Square } from 'lucide-react';
import { AIDecisionCard, ActivityEvent, BotStatus, StrategyMode } from '../../types';
import { TranslationDictionary, translateBotStatus, translateDecision } from '../../i18n/translations';
import { AICoreCanvas } from '../../components/three/AICoreCanvas';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CustomModal } from '../../components/ui/CustomModal';
import { CustomRadioGroup } from '../../components/ui/CustomRadioGroup';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';

interface AITradingEnginePageProps {
  t: TranslationDictionary;
  botStatus: BotStatus;
  strategy: StrategyMode;
  assetsScanned: number;
  opportunitiesDetected: number;
  activeTradesCount: number;
  todayPnl: number;
  activityFeed: ActivityEvent[];
  decisions: AIDecisionCard[];
  onBotStatusChange: (status: BotStatus) => void;
  onStrategyChange: (strategy: StrategyMode) => void;
}

export const AITradingEnginePage: React.FC<AITradingEnginePageProps> = ({
  t,
  botStatus,
  strategy,
  assetsScanned,
  opportunitiesDetected,
  activeTradesCount,
  todayPnl,
  activityFeed,
  decisions,
  onBotStatusChange,
  onStrategyChange,
}) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const strategyOptions: { value: StrategyMode; label: string }[] = [
    { value: 'Adaptive Momentum', label: t.aiBot.strategies.adaptive },
    { value: 'Breakout Volume Surge', label: t.aiBot.strategies.breakout },
    { value: 'Mean Reversion', label: t.aiBot.strategies.reversion },
    { value: 'Liquidity Impulse', label: t.aiBot.strategies.impulse },
  ];

  const statusTone =
    botStatus === 'running' ? 'blue' : botStatus === 'paused' ? 'amber' : 'slate';

  const stats = [
    { label: t.aiBot.assetsScanned, value: assetsScanned, prefix: '', decimals: 0, color: 'text-[#0F172A]' },
    { label: t.aiBot.opportunitiesDetected, value: opportunitiesDetected, prefix: '', decimals: 0, color: 'text-[#2563EB]' },
    { label: t.aiBot.activeTrades, value: activeTradesCount, prefix: '', decimals: 0, color: 'text-[#0F172A]' },
    {
      label: t.aiBot.todayPnl,
      value: Math.abs(todayPnl),
      prefix: todayPnl >= 0 ? '+$' : '-$',
      decimals: 2,
      color: todayPnl >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]',
    },
  ];

  const activeStrategyLabel =
    strategyOptions.find((s) => s.value === strategy)?.label ?? strategy;

  return (
    <div className="space-y-6">
      {/* Main Hero: 3D Blue AI Sphere + Controls + 4 Core Metrics */}
      <section className="ox-card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Smooth Glass & Fluid Blue AI Sphere Stage */}
          <div className="lg:col-span-6 relative ox-blue-stage h-[320px] sm:h-[380px] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#E2E8F0]">
            <div className="w-full h-full max-w-[400px]">
              <AICoreCanvas status={botStatus} interactive variant="hero" />
            </div>
          </div>

          {/* Right Controls & Stats */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#64748B]">{t.aiBot.status}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display font-bold text-2xl text-[#0F172A]">
                    {translateBotStatus(botStatus, t)}
                  </h2>
                  <StatusBadge tone={statusTone} label={activeStrategyLabel} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAdvancedOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#334155] transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{t.aiBot.advancedSettings}</span>
              </button>
            </div>

            {/* Start / Pause / Stop Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <MagneticButton
                variant={botStatus === 'running' ? 'primary' : 'secondary'}
                onClick={() => onBotStatusChange('running')}
                disabled={botStatus === 'running'}
                className="flex-1 min-w-[100px]"
              >
                <Play className="w-4 h-4" />
                <span>{t.aiBot.start}</span>
              </MagneticButton>

              <MagneticButton
                variant={botStatus === 'paused' ? 'primary' : 'secondary'}
                onClick={() => onBotStatusChange('paused')}
                disabled={botStatus === 'paused'}
                className="flex-1 min-w-[100px]"
              >
                <Pause className="w-4 h-4" />
                <span>{t.aiBot.pause}</span>
              </MagneticButton>

              <MagneticButton
                variant={botStatus === 'stopped' ? 'danger' : 'secondary'}
                onClick={() => onBotStatusChange('stopped')}
                disabled={botStatus === 'stopped'}
                className="flex-1 min-w-[100px]"
              >
                <Square className="w-4 h-4" />
                <span>{t.aiBot.stop}</span>
              </MagneticButton>
            </div>

            {/* 4 Key AI Bot Metrics */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]"
                >
                  <p className="text-xs font-medium text-[#64748B]">{item.label}</p>
                  <p className={`mt-1.5 text-xl font-display font-bold tabular-nums ${item.color}`}>
                    <AnimatedNumber value={item.value} decimals={item.decimals} prefix={item.prefix} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="ox-card p-5 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-base text-[#0F172A]">
            {t.aiBot.activityFeed}
          </h3>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {activityFeed.map((ev) => {
            const loc = t.demoActivity[ev.id];
            return (
              <div key={ev.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0F172A]">{loc ? loc.title : ev.title}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{loc ? loc.detail : ev.detail}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-[#94A3B8] font-mono">
                    {loc ? loc.timestamp : ev.timestamp}
                  </span>
                  {typeof ev.deltaUsd === 'number' && (
                    <p
                      className={`text-xs font-semibold font-mono mt-0.5 ${
                        ev.deltaUsd >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
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
      </motion.section>

      {/* Advanced Settings & AI Analysis Modal */}
      <CustomModal
        open={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
        title={t.aiBot.advancedTitle}
        maxWidthClass="max-w-2xl"
      >
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
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

          <div className="pt-2 border-t border-[#E2E8F0]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
              {t.aiBot.recentSignals}
            </p>
            <div className="space-y-3">
              {decisions.map((card) => {
                const tone =
                  card.decision === 'BUY' ? 'emerald' : card.decision === 'SELL' ? 'red' : 'slate';
                return (
                  <div
                    key={card.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#0F172A]">{card.symbol}</span>
                        <span className="text-xs text-[#64748B] font-mono">
                          {t.overview.score} {card.opportunityScore}
                        </span>
                      </div>
                      <StatusBadge tone={tone} label={translateDecision(card.decision, t)} />
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">{card.explanation}</p>
                    <p className="text-[11px] text-[#64748B]">
                      {t.aiBot.riskNote}: {card.riskEvaluation}
                    </p>
                  </div>
                );
              })}
            </div>
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
