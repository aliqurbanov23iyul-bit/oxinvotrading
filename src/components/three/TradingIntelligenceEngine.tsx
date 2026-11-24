import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Cpu, Radar, ShieldCheck } from 'lucide-react';
import { LanguageCode } from '../../types';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { TradingCandlestickCanvas } from './AICoreCanvas';
import { CoinIcon } from '../ui/CoinIcon';

interface TradingIntelligenceEngineProps {
  language: LanguageCode;
  compact?: boolean;
}

const SHOWCASE_PAIRS = [
  { symbol: 'BTC/USDT', tag: 'SPOT · EMA' },
  { symbol: 'ETH/USDT', tag: 'LIQ · DEPTH' },
  { symbol: 'SOL/USDT', tag: 'VOL · SCAN' },
  { symbol: 'BNB/USDT', tag: 'RISK · CAP' },
] as const;

export const TradingIntelligenceEngine: React.FC<TradingIntelligenceEngineProps> = ({
  language,
  compact = false,
}) => {
  const copy = EXTRA_COPY[language].engineVisual;
  const [phase, setPhase] = useState(0);

  const decisions = [
    { key: 'long', label: copy.decisions.long, activeClass: 'bg-[#10B981]/20 border-[#10B981] text-[#34D399]' },
    { key: 'hold', label: copy.decisions.hold, activeClass: 'bg-[#3B82F6]/20 border-[#60A5FA] text-[#93C5FD]' },
    { key: 'short', label: copy.decisions.short, activeClass: 'bg-[#EF4444]/20 border-[#EF4444] text-[#FCA5A5]' },
  ] as const;

  return (
    <div className="relative w-full h-full ox-terminal-stage flex flex-col justify-between overflow-hidden p-5 sm:p-7 lg:p-9 text-[#F1F5F9]">
      {/* Architectural Grid & Atmospheric Glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 ox-grid-bg opacity-65" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-[380px] h-[380px] rounded-full bg-[#2563EB]/20 blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-8 w-[300px] h-[300px] rounded-full bg-[#38BDF8]/12 blur-[90px]"
      />

      {/* Top Terminal Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[#112244] border border-[#2563EB]/45 flex items-center justify-center text-[#60A5FA]">
            <Cpu className="w-4 h-4" />
          </span>
          <div>
            <p className="font-display font-semibold text-xs sm:text-sm tracking-tight text-white">
              {copy.title}
            </p>
            <p className="text-[11px] font-mono text-[#94A3B8]">SPOT · PAPER ENGINE ARCHITECTURE</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0D1B35] border border-[#2563EB]/45 text-[11px] font-mono font-medium text-[#93C5FD]">
          {copy.demoBadge}
        </span>
      </div>

      {/* Multi-Asset Selector Strip (SVG Coin Icons) */}
      {!compact && (
        <div className="relative z-10 mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SHOWCASE_PAIRS.map((pair, idx) => (
            <div
              key={pair.symbol}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0A152B]/90 border border-[#1B2F55] hover:border-[#3B82F6]/60 transition-colors"
            >
              <CoinIcon symbol={pair.symbol} size={22} />
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-semibold text-white truncate">{pair.symbol}</p>
                <p className="font-mono text-[10px] text-[#64748B] truncate">{pair.tag}</p>
              </div>
              {idx === 0 && (
                <span className="ml-auto font-mono text-[10px] text-[#34D399] hidden xl:inline">OHLC</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Center 3D Candlestick Chart Viewport */}
      <div
        className={`relative z-10 w-full flex-1 flex items-center justify-center my-3 ${
          compact ? 'min-h-[240px]' : 'min-h-[260px] lg:min-h-[300px]'
        }`}
      >
        <TradingCandlestickCanvas
          status="running"
          interactive
          variant={compact ? 'compact' : 'hero'}
          onPhaseChange={setPhase}
        />
      </div>

      {/* Bottom Intelligence Modules (No overlap, crisp glass borders, no backdrop-filter on WebGL layer) */}
      <div className="relative z-10 space-y-3">
        {!compact && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Market Scanner Card */}
            <div className="p-3 rounded-xl bg-[#091429]/95 border border-[#1B2F55] space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#E2E8F0]">
                  <Radar className="w-3.5 h-3.5 text-[#60A5FA]" />
                  {copy.scannerLabel}
                </span>
                <span className="text-[10px] font-mono text-[#60A5FA]">SCAN</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] truncate">{copy.scannerMeta}</p>
              <div className="h-1 w-full rounded-full bg-[#112244] overflow-hidden">
                <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-transparent ox-data-stream" />
              </div>
            </div>

            {/* AI Flow / Risk Management Card */}
            <div className="p-3 rounded-xl bg-[#091429]/95 border border-[#1B2F55] space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#E2E8F0]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                  {copy.riskLabel}
                </span>
                <span className="text-[10px] font-mono text-[#34D399]">GUARD</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] truncate">{copy.riskMeta}</p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#CBD5E1]">
                <span>SL · TP</span>
                <span className="text-[#475569]">/</span>
                <span>MAX DD</span>
              </div>
            </div>

            {/* Decision Engine (LONG / HOLD / SHORT) */}
            <div className="p-3 rounded-xl bg-[#091429]/95 border border-[#1B2F55] space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#E2E8F0]">
                  <Activity className="w-3.5 h-3.5 text-[#60A5FA]" />
                  {copy.decisionLabel}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                {decisions.map((d, idx) => {
                  const active = phase === idx;
                  return (
                    <motion.span
                      key={d.key}
                      animate={{ scale: active ? 1.03 : 1 }}
                      transition={{ duration: 0.25 }}
                      className={`text-center py-1 rounded-md border font-mono text-[10px] font-semibold tracking-wide transition-colors ${
                        active
                          ? d.activeClass
                          : 'bg-[#070E1E] border-[#172847] text-[#64748B]'
                      }`}
                    >
                      {d.label}
                    </motion.span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-[#94A3B8] leading-relaxed max-w-2xl">
          {copy.subline}
        </p>
      </div>
    </div>
  );
};
