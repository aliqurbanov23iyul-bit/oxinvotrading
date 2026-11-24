import React, { useMemo, useState } from 'react';
import { CandlestickChart, Link2, Eye } from 'lucide-react';
import { LanguageCode } from '../../types';
import { EXTRA_COPY } from '../../i18n/publicAndExtra';
import { CoinIcon } from '../ui/CoinIcon';
import { MagneticButton } from '../ui/MagneticButton';

export interface OhlcCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface InteractiveCandlestickChartProps {
  language: LanguageCode;
  symbol?: string;
  candles?: OhlcCandle[];
  onOpenConnections?: () => void;
}

const DEMO_CANDLES_BY_TF: Record<'15m' | '1H' | '4H' | '1D', OhlcCandle[]> = {
  '15m': [
    { time: '09:00', open: 94210, high: 94480, low: 94060, close: 94390, volume: 420 },
    { time: '09:15', open: 94390, high: 94520, low: 94180, close: 94240, volume: 380 },
    { time: '09:30', open: 94240, high: 94610, low: 94210, close: 94570, volume: 510 },
    { time: '09:45', open: 94570, high: 94830, low: 94490, close: 94780, volume: 640 },
    { time: '10:00', open: 94780, high: 94850, low: 94520, close: 94610, volume: 470 },
    { time: '10:15', open: 94610, high: 94920, low: 94580, close: 94890, volume: 590 },
    { time: '10:30', open: 94890, high: 95120, low: 94840, close: 95060, volume: 730 },
    { time: '10:45', open: 95060, high: 95180, low: 94870, close: 94940, volume: 410 },
    { time: '11:00', open: 94940, high: 95290, low: 94900, close: 95220, volume: 680 },
    { time: '11:15', open: 95220, high: 95480, low: 95160, close: 95410, volume: 810 },
    { time: '11:30', open: 95410, high: 95520, low: 95190, close: 95280, volume: 495 },
    { time: '11:45', open: 95280, high: 95640, low: 95240, close: 95590, volume: 760 },
    { time: '12:00', open: 95590, high: 95820, low: 95510, close: 95740, volume: 845 },
    { time: '12:15', open: 95740, high: 95890, low: 95480, close: 95560, volume: 520 },
    { time: '12:30', open: 95560, high: 95910, low: 95520, close: 95880, volume: 790 },
    { time: '12:45', open: 95880, high: 96140, low: 95830, close: 96070, volume: 910 },
  ],
  '1H': [
    { time: '00:00', open: 92800, high: 93250, low: 92640, close: 93110, volume: 1840 },
    { time: '01:00', open: 93110, high: 93420, low: 92950, close: 93020, volume: 1620 },
    { time: '02:00', open: 93020, high: 93680, low: 92980, close: 93590, volume: 2150 },
    { time: '03:00', open: 93590, high: 93940, low: 93480, close: 93840, volume: 2380 },
    { time: '04:00', open: 93840, high: 94020, low: 93510, close: 93620, volume: 1790 },
    { time: '05:00', open: 93620, high: 94190, low: 93590, close: 94120, volume: 2420 },
    { time: '06:00', open: 94120, high: 94550, low: 94050, close: 94460, volume: 2640 },
    { time: '07:00', open: 94460, high: 94610, low: 94140, close: 94290, volume: 1930 },
    { time: '08:00', open: 94290, high: 94880, low: 94250, close: 94790, volume: 2810 },
    { time: '09:00', open: 94790, high: 95120, low: 94680, close: 95040, volume: 3090 },
    { time: '10:00', open: 95040, high: 95220, low: 94810, close: 94920, volume: 2140 },
    { time: '11:00', open: 94920, high: 95490, low: 94880, close: 95410, volume: 3260 },
    { time: '12:00', open: 95410, high: 95820, low: 95320, close: 95740, volume: 3420 },
    { time: '13:00', open: 95740, high: 96120, low: 95640, close: 96070, volume: 3680 },
  ],
  '4H': [
    { time: 'D1 00', open: 90400, high: 91450, low: 90120, close: 91280, volume: 6420 },
    { time: 'D1 04', open: 91280, high: 91920, low: 90950, close: 91540, volume: 5840 },
    { time: 'D1 08', open: 91540, high: 92480, low: 91410, close: 92320, volume: 7210 },
    { time: 'D1 12', open: 92320, high: 92690, low: 91880, close: 92040, volume: 6150 },
    { time: 'D1 16', open: 92040, high: 93140, low: 91990, close: 92980, volume: 8140 },
    { time: 'D1 20', open: 92980, high: 93620, low: 92760, close: 93490, volume: 7850 },
    { time: 'D2 00', open: 93490, high: 94250, low: 93310, close: 94110, volume: 8620 },
    { time: 'D2 04', open: 94110, high: 94480, low: 93780, close: 93940, volume: 6930 },
    { time: 'D2 08', open: 93940, high: 95020, low: 93890, close: 94910, volume: 9120 },
    { time: 'D2 12', open: 94910, high: 95680, low: 94780, close: 95560, volume: 9480 },
    { time: 'D2 16', open: 95560, high: 96140, low: 95320, close: 96070, volume: 9840 },
  ],
  '1D': [
    { time: 'Nov 15', open: 87400, high: 88950, low: 86800, close: 88620, volume: 22400 },
    { time: 'Nov 16', open: 88620, high: 89400, low: 87950, close: 88210, volume: 19800 },
    { time: 'Nov 17', open: 88210, high: 90120, low: 88050, close: 89940, volume: 25100 },
    { time: 'Nov 18', open: 89940, high: 91450, low: 89680, close: 91120, volume: 27400 },
    { time: 'Nov 19', open: 91120, high: 91890, low: 90340, close: 90760, volume: 21600 },
    { time: 'Nov 20', open: 90760, high: 92680, low: 90620, close: 92490, volume: 29200 },
    { time: 'Nov 21', open: 92490, high: 93840, low: 92150, close: 93620, volume: 31500 },
    { time: 'Nov 22', open: 93620, high: 94210, low: 92980, close: 93380, volume: 24900 },
    { time: 'Nov 23', open: 93380, high: 95180, low: 93250, close: 94940, volume: 33400 },
    { time: 'Nov 24', open: 94940, high: 96140, low: 94680, close: 96070, volume: 35800 },
  ],
};

export const InteractiveCandlestickChart: React.FC<InteractiveCandlestickChartProps> = ({
  language,
  symbol = 'BTC/USDT',
  candles,
  onOpenConnections,
}) => {
  const copy = EXTRA_COPY[language].chart;
  const engineDemoBadge = EXTRA_COPY[language].engineVisual.demoBadge;
  const [timeframe, setTimeframe] = useState<'15m' | '1H' | '4H' | '1D'>('1H');
  const [previewDemo, setPreviewDemo] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const hasRealFeed = Boolean(candles && candles.length > 0);
  const activeCandles = hasRealFeed ? candles! : previewDemo ? DEMO_CANDLES_BY_TF[timeframe] : [];

  const bounds = useMemo(() => {
    if (!activeCandles.length) return { min: 0, max: 1, maxVol: 1 };
    const highs = activeCandles.map((c) => c.high);
    const lows = activeCandles.map((c) => c.low);
    const vols = activeCandles.map((c) => c.volume);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const pad = Math.max((max - min) * 0.12, 1);
    return { min: min - pad, max: max + pad, maxVol: Math.max(...vols, 1) };
  }, [activeCandles]);

  const focused =
    hoverIdx !== null && activeCandles[hoverIdx]
      ? activeCandles[hoverIdx]
      : activeCandles[activeCandles.length - 1] ?? null;

  return (
    <section className="ox-card p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <CoinIcon symbol={symbol} size={30} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-semibold text-base text-[#0A1428] dark:text-[#F1F5F9]">
                {symbol}
              </h2>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">· {copy.candlestickTitle}</span>
              {!hasRealFeed && previewDemo && (
                <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border border-[#BFDBFE] dark:border-[#1D4ED8] text-[10px] font-mono font-semibold text-[#2563EB] dark:text-[#60A5FA]">
                  {engineDemoBadge}
                </span>
              )}
            </div>
            {focused && (
              <p className="text-[11px] font-mono tabular-nums text-[#64748B] dark:text-[#94A3B8] mt-0.5 flex flex-wrap gap-x-3">
                <span>
                  {copy.openLabel}: <strong className="text-[#0A1428] dark:text-[#F1F5F9]">{focused.open.toLocaleString()}</strong>
                </span>
                <span>
                  {copy.highLabel}: <strong className="text-[#059669] dark:text-[#34D399]">{focused.high.toLocaleString()}</strong>
                </span>
                <span>
                  {copy.lowLabel}: <strong className="text-[#DC2626] dark:text-[#F87171]">{focused.low.toLocaleString()}</strong>
                </span>
                <span>
                  {copy.closeLabel}: <strong className="text-[#0A1428] dark:text-[#F1F5F9]">{focused.close.toLocaleString()}</strong>
                </span>
                <span>
                  {copy.volumeLabel}: <strong className="text-[#2563EB] dark:text-[#60A5FA]">{focused.volume.toLocaleString()}</strong>
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!hasRealFeed && (
            <button
              type="button"
              onClick={() => setPreviewDemo((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                previewDemo
                  ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border-[#2563EB] text-[#2563EB] dark:text-[#60A5FA]'
                  : 'bg-white dark:bg-[#070D19] border-[#E2E8F0] dark:border-[#1B2942] text-[#475569] dark:text-[#94A3B8] hover:border-[#CBD5E1]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{copy.previewToggle}</span>
            </button>
          )}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EEF2F9] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
            {(['15m', '1H', '4H', '1D'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                  timeframe === tf
                    ? 'bg-white dark:bg-[#111C33] text-[#2563EB] dark:text-[#60A5FA] font-semibold shadow-2xs'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeCandles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#CBD5E1] dark:border-[#1B2942] bg-[#F8FAFC] dark:bg-[#070D19]/70 px-6 py-10 flex flex-col items-center text-center">
          <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#0B1324] border border-[#E2E8F0] dark:border-[#1B2942] text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center mb-3">
            <CandlestickChart className="w-5 h-5" />
          </div>
          <h3 className="font-display font-semibold text-sm text-[#0A1428] dark:text-[#F1F5F9]">
            {copy.awaitingTitle}
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-md mt-1.5 leading-relaxed">
            {copy.awaitingBody}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {onOpenConnections && (
              <MagneticButton variant="secondary" onClick={onOpenConnections} className="text-xs px-3.5 py-2">
                <Link2 className="w-3.5 h-3.5" />
                <span>{copy.connectCta}</span>
              </MagneticButton>
            )}
            <button
              type="button"
              onClick={() => setPreviewDemo(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-[#E2E8F0] dark:border-[#1B2942] bg-white dark:bg-[#0B1324] text-[#475569] dark:text-[#CBD5E1] hover:border-[#2563EB] hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{copy.previewToggle}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl bg-[#070D19] border border-[#1B2942] p-3 sm:p-4 overflow-hidden">
          <svg
            viewBox="0 0 760 250"
            className="w-full h-56 sm:h-64 select-none"
            onMouseLeave={() => setHoverIdx(null)}
          >
            {/* Horizontal grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
              const y = 16 + ratio * 165;
              const price = bounds.max - ratio * (bounds.max - bounds.min);
              return (
                <g key={ratio}>
                  <line x1="0" x2="695" y1={y} y2={y} stroke="#172847" strokeDasharray="3 4" strokeWidth="1" />
                  <text
                    x="702"
                    y={y + 3}
                    fill="#64748B"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {Math.round(price).toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* EMA Trend Path */}
            <path
              d={activeCandles
                .map((c, idx) => {
                  const slotW = 680 / activeCandles.length;
                  const x = 14 + idx * slotW + slotW * 0.5;
                  const y = 16 + ((bounds.max - c.close) / (bounds.max - bounds.min)) * 165;
                  return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                })
                .join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeOpacity="0.65"
              strokeWidth="1.75"
            />

            {/* Candles + Volume bars */}
            {activeCandles.map((c, idx) => {
              const slotW = 680 / activeCandles.length;
              const xCenter = 14 + idx * slotW + slotW * 0.5;
              const candleW = Math.min(18, Math.max(6, slotW * 0.56));
              const bull = c.close >= c.open;
              const yHigh = 16 + ((bounds.max - c.high) / (bounds.max - bounds.min)) * 165;
              const yLow = 16 + ((bounds.max - c.low) / (bounds.max - bounds.min)) * 165;
              const yOpen = 16 + ((bounds.max - c.open) / (bounds.max - bounds.min)) * 165;
              const yClose = 16 + ((bounds.max - c.close) / (bounds.max - bounds.min)) * 165;
              const yBody = Math.min(yOpen, yClose);
              const hBody = Math.max(3, Math.abs(yClose - yOpen));
              const volH = (c.volume / bounds.maxVol) * 34;
              const isHovered = hoverIdx === idx;

              return (
                <g
                  key={c.time + idx}
                  onMouseEnter={() => setHoverIdx(idx)}
                  className="cursor-crosshair"
                >
                  {isHovered && (
                    <line
                      x1={xCenter}
                      x2={xCenter}
                      y1="8"
                      y2="232"
                      stroke="#60A5FA"
                      strokeOpacity="0.45"
                      strokeDasharray="3 3"
                    />
                  )}
                  <rect
                    x={xCenter - slotW * 0.5}
                    y="10"
                    width={slotW}
                    height="225"
                    fill="transparent"
                  />
                  {/* Volume Bar */}
                  <rect
                    x={xCenter - candleW * 0.5}
                    y={232 - volH}
                    width={candleW}
                    height={volH}
                    rx="1.5"
                    fill={bull ? '#10B981' : '#EF4444'}
                    fillOpacity={isHovered ? 0.55 : 0.28}
                  />
                  {/* Wick */}
                  <line
                    x1={xCenter}
                    x2={xCenter}
                    y1={yHigh}
                    y2={yLow}
                    stroke={bull ? '#34D399' : '#F87171'}
                    strokeWidth={isHovered ? 2 : 1.4}
                  />
                  {/* Body */}
                  <rect
                    x={xCenter - candleW * 0.5}
                    y={yBody}
                    width={candleW}
                    height={hBody}
                    rx="1.8"
                    fill={bull ? '#10B981' : '#EF4444'}
                    stroke={isHovered ? '#FFFFFF' : 'none'}
                    strokeWidth="0.9"
                  />
                  {idx % Math.max(1, Math.floor(activeCandles.length / 6)) === 0 && (
                    <text
                      x={xCenter}
                      y="246"
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="9.5"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {c.time}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </section>
  );
};
