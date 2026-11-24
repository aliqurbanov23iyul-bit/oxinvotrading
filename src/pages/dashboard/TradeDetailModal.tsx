import React from 'react';
import { Trade } from '../../types';
import { TranslationDictionary, translateDecision } from '../../i18n/translations';
import { CustomModal } from '../../components/ui/CustomModal';
import { StatusBadge } from '../../components/ui/StatusBadge';

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
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div>
            <p className="text-xs text-[#64748B]">{t.trades.pnl}</p>
            <p
              className={`text-2xl font-display font-bold font-mono tabular-nums mt-0.5 ${
                positive ? 'text-[#16A34A]' : 'text-[#DC2626]'
              }`}
            >
              {positive ? '+' : '-'}${Math.abs(trade.pnlUsd).toFixed(2)} ({positive ? '+' : ''}
              {trade.pnlPct.toFixed(2)}%)
            </p>
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
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">{t.trades.entry}</p>
            <p className="font-mono font-semibold text-[#0F172A] mt-0.5">${trade.entryPrice}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">
              {trade.status === 'active' ? t.trades.current : t.trades.exit}
            </p>
            <p className="font-mono font-semibold text-[#0F172A] mt-0.5">
              ${trade.status === 'active' ? trade.currentPrice : trade.exitPrice}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">{t.trades.amount}</p>
            <p className="font-mono font-semibold text-[#0F172A] mt-0.5">${trade.amountUsd.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">{t.trades.duration}</p>
            <p className="font-mono font-semibold text-[#0F172A] mt-0.5">{trade.durationLabel}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">{t.trades.quantity}</p>
            <p className="font-mono font-semibold text-[#0F172A] mt-0.5">{trade.quantity}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">{t.trades.fees}</p>
            <p className="font-mono font-semibold text-[#0F172A] mt-0.5">${trade.feesUsd.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div>
            <p className="text-xs font-semibold text-[#64748B]">{t.trades.openReason}</p>
            <p className="text-sm text-[#334155] mt-1 leading-relaxed">{trade.openReason}</p>
          </div>
          {trade.closeReason && (
            <div>
              <p className="text-xs font-semibold text-[#64748B]">{t.trades.closeReason}</p>
              <p className="text-sm text-[#334155] mt-1 leading-relaxed">{trade.closeReason}</p>
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};
