import React from 'react';
import { Trade } from '../../types';
import { TranslationDictionary, translateDecision } from '../../i18n/translations';
import { CustomModal } from '../../components/ui/CustomModal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CoinIcon } from '../../components/ui/CoinIcon';

interface TradeDetailModalProps {
  trade: Trade | null;
  t: TranslationDictionary;
  onClose: () => void;
}

export const TradeDetailModal: React.FC<TradeDetailModalProps> = ({ trade, t, onClose }) => {
  if (!trade) return null;
  const positive = trade.pnlUsd >= 0;

  return (
    <CustomModal
      open={Boolean(trade)}
      onClose={onClose}
      title={`${trade.symbol} · ${trade.id}`}
      subtitle={trade.strategy}
      maxWidthClass="max-w-lg"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
          <div className="flex items-center gap-3">
            <CoinIcon symbol={trade.symbol} size={34} />
            <div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{t.trades.pnl}</p>
              <p
                className={`text-xl font-display font-bold font-mono tabular-nums mt-0.5 ${
                  positive ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]'
                }`}
              >
                {positive ? '+' : '-'}${Math.abs(trade.pnlUsd).toFixed(2)} ({positive ? '+' : ''}
                {trade.pnlPct.toFixed(2)}%)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge
              tone={trade.side === 'BUY' ? 'emerald' : 'red'}
              label={translateDecision(trade.side, t)}
            />
            <StatusBadge
              tone={trade.status === 'active' ? 'blue' : 'slate'}
              label={trade.status === 'active' ? t.statusLabels.active : t.statusLabels.closed}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: t.trades.entry, value: `$${trade.entryPrice}` },
            {
              label: trade.status === 'active' ? t.trades.current : t.trades.exit,
              value: `$${trade.status === 'active' ? trade.currentPrice : trade.exitPrice}`,
            },
            { label: t.trades.amount, value: `$${trade.amountUsd.toLocaleString()}` },
            { label: t.trades.duration, value: trade.durationLabel },
            { label: t.trades.quantity, value: String(trade.quantity) },
            { label: t.trades.fees, value: `$${trade.feesUsd.toFixed(2)}` },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]"
            >
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{item.label}</p>
              <p className="font-mono font-semibold text-[#0A1428] dark:text-[#F1F5F9] mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-1">
          <div>
            <p className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">{t.trades.openReason}</p>
            <p className="text-sm text-[#334155] dark:text-[#CBD5E1] mt-1 leading-relaxed">{trade.openReason}</p>
          </div>
          {trade.closeReason && (
            <div>
              <p className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">{t.trades.closeReason}</p>
              <p className="text-sm text-[#334155] dark:text-[#CBD5E1] mt-1 leading-relaxed">{trade.closeReason}</p>
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};
