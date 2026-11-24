import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  AlertCircle,
  BrainCircuit,
  Compass,
  LineChart,
  Loader2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SkeletonBlock } from '../../components/ui/Skeleton';
import { CoinIcon } from '../../components/ui/CoinIcon';
import { InteractiveCandlestickChart } from '../../components/charts/InteractiveCandlestickChart';

const PAIRS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'AVAX/USDT'];
const TIMEFRAMES = ['15m', '1h', '4h', '1D'];

export const AIAnalysisPage: React.FC<{
  language: LanguageCode;
  onOpenConnections?: () => void;
}> = ({ language, onOpenConnections }) => {
  const copy = EXTRA_COPY[language].aiAnalysis;
  const [pair, setPair] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('1h');
  const [analyzing, setAnalyzing] = useState(false);
  const [checkedOnce, setCheckedOnce] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    window.setTimeout(() => {
      setAnalyzing(false);
      setCheckedOnce(true);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <section className="ox-card p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-[#EFF6FF] dark:bg-[#111C33] border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/60 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display font-bold text-lg text-[#0A1428] dark:text-[#F1F5F9]">{copy.title}</h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{copy.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <CoinIcon symbol={pair} size={26} />
            <StatusBadge tone="amber" label="AI Provider Standby" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <CustomSelect
            label={copy.pairLabel}
            value={pair}
            onChange={setPair}
            options={PAIRS.map((p) => ({ value: p, label: p }))}
          />
          <CustomSelect
            label={copy.timeframeLabel}
            value={timeframe}
            onChange={setTimeframe}
            options={TIMEFRAMES.map((tf) => ({ value: tf, label: tf }))}
          />
          <MagneticButton onClick={handleAnalyze} loading={analyzing} className="w-full py-2.5">
            <Sparkles className="w-4 h-4" />
            <span>{copy.analyzeBtn}</span>
          </MagneticButton>
        </div>
      </section>

      {/* Interactive Candlestick Structure View */}
      <InteractiveCandlestickChart
        language={language}
        symbol={pair}
        onOpenConnections={onOpenConnections}
      />

      {/* Animated AI Loading State */}
      {analyzing && (
        <motion.section
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ox-card p-8 border-[#BFDBFE] dark:border-[#1E3A8A] bg-gradient-to-br from-[#EFF6FF] via-white to-white dark:from-[#0B172E] dark:via-[#0B1324] dark:to-[#0B1324] space-y-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.3)]">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <p className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                {copy.analyzingTitle}
              </p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                {pair} · {timeframe} — {copy.analyzingSub}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-20" />
          </div>
        </motion.section>
      )}

      {/* Honest Provider Status Banner */}
      {!analyzing && (
        <section className="ox-card p-6 bg-gradient-to-r from-[#FFFBEB] to-white dark:from-[#451A03]/35 dark:to-[#0B1324] border-[#FDE68A] dark:border-[#78350F] flex items-start gap-3.5">
          <AlertCircle className="w-5 h-5 text-[#D97706] dark:text-[#FBBF24] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-sm text-[#92400E] dark:text-[#FCD34D]">
              {copy.providerUnavailableTitle}
              {checkedOnce ? ` (${pair} · ${timeframe})` : ''}
            </h3>
            <p className="text-xs text-[#78350F] dark:text-[#FDE68A]/85 leading-relaxed">
              {copy.providerUnavailableBody}
            </p>
          </div>
        </section>
      )}

      {/* Structured AI Modules Ready for Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { title: copy.marketAnalysis, icon: <LineChart className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" /> },
          { title: copy.trendDirection, icon: <Compass className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" /> },
          { title: copy.riskAnalysis, icon: <ShieldAlert className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" /> },
          { title: copy.technicalIndicators, icon: <Activity className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" /> },
          { title: copy.signalInterface, icon: <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" /> },
        ].map((panel) => (
          <section key={panel.title} className="ox-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#EFF6FF] dark:bg-[#111C33] flex items-center justify-center">
                  {panel.icon}
                </span>
                <h3 className="font-display font-semibold text-sm text-[#0A1428] dark:text-[#F1F5F9]">
                  {panel.title}
                </h3>
              </div>
              <span className="text-xs font-mono text-[#94A3B8] dark:text-[#64748B]">—</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942] flex items-center gap-2 text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
              <CoinIcon symbol={pair} size={18} />
              <span>
                {pair} · {timeframe}
              </span>
            </div>
          </section>
        ))}
      </div>

      {/* AI Analysis History */}
      <section className="ox-card p-6 space-y-3">
        <h3 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
          {copy.historyTitle}
        </h3>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] py-4 text-center">{copy.emptyHistory}</p>
      </section>
    </div>
  );
};
