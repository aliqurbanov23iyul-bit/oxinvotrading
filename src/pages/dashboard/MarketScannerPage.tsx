import React, { useMemo, useState } from 'react';
import { Globe } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { MarketAsset, MarketCategoryKey } from '../../types';
import { TranslationDictionary, translateDecision } from '../../i18n/translations';
import { CustomSearchInput } from '../../components/ui/CustomSearchInput';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CustomModal } from '../../components/ui/CustomModal';
import { CustomPagination } from '../../components/ui/CustomPagination';
import { CoinIcon } from '../../components/ui/CoinIcon';
import { EmptyState } from '../../components/ui/EmptyState';

interface MarketScannerPageProps {
  t: TranslationDictionary;
  assets: MarketAsset[];
}

const PAGE_SIZE = 10;

export const MarketScannerPage: React.FC<MarketScannerPageProps> = ({ t, assets }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<MarketCategoryKey>('all');
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [page, setPage] = useState(1);

  const categories: { id: MarketCategoryKey; label: string }[] = [
    { id: 'all', label: t.markets.categories.all },
    { id: 'trending', label: t.markets.categories.trending },
    { id: 'ai_opportunities', label: t.markets.categories.aiOpportunities },
    { id: 'unusual_volume', label: t.markets.categories.unusualVolume },
    { id: 'high_momentum', label: t.markets.categories.highMomentum },
    { id: 'potential_breakout', label: t.markets.categories.potentialBreakout },
    { id: 'newly_listed', label: t.markets.categories.newlyListed },
    { id: 'high_volatility', label: t.markets.categories.highVolatility },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((a) => {
      const catMatch = category === 'all' || a.categories.includes(category);
      const qMatch =
        !q ||
        a.symbol.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.base.toLowerCase().includes(q);
      return catMatch && qMatch;
    });
  }, [assets, category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Search + Category Filter Strip */}
      <div className="ox-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CustomSearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder={t.markets.searchPlaceholder}
            ariaLabel={t.markets.searchPlaceholder}
            className="w-full sm:max-w-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const active = cat.id === category;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategory(cat.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#2563EB] text-white font-semibold'
                    : 'bg-[#F1F5F9] dark:bg-[#070D19] text-[#475569] dark:text-[#94A3B8] hover:text-[#0A1428] dark:hover:text-white hover:bg-[#E2E8F0] dark:hover:bg-[#111C33]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Market Table */}
      <section className="ox-card overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<Globe className="w-5 h-5" />}
              title={t.common.noData}
              description={t.markets.empty}
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] dark:border-[#1B2942] bg-[#F8FAFC] dark:bg-[#070D19] text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    <th className="py-3.5 px-5">{t.markets.asset}</th>
                    <th className="py-3.5 px-4 text-right">{t.markets.price}</th>
                    <th className="py-3.5 px-4 text-right">{t.markets.change24h}</th>
                    <th className="py-3.5 px-4 text-right hidden md:table-cell">{t.markets.volume24h}</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell w-28" />
                    <th className="py-3.5 px-4 text-right">{t.markets.score}</th>
                    <th className="py-3.5 px-5 text-right">{t.markets.signal}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#16233B] text-sm">
                  {rows.map((asset) => {
                    const pos24 = asset.change24h >= 0;
                    const sparkData = asset.sparkline.map((v, i) => ({ i, v }));
                    const badgeTone =
                      asset.signalStatus === 'BUY' ? 'emerald' : asset.signalStatus === 'SELL' ? 'red' : 'slate';
                    return (
                      <tr
                        key={asset.symbol}
                        onClick={() => setSelectedAsset(asset)}
                        className="hover:bg-[#F8FAFC] dark:hover:bg-[#0D1629] cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <CoinIcon symbol={asset.symbol} size={28} />
                            <div>
                              <p className="font-semibold text-[#0A1428] dark:text-[#F1F5F9]">{asset.symbol}</p>
                              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{asset.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums font-medium text-[#0A1428] dark:text-[#F1F5F9]">
                          ${asset.price.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                        </td>
                        <td
                          className={`py-3.5 px-4 text-right font-mono tabular-nums font-semibold ${
                            pos24 ? 'text-[#059669] dark:text-[#34D399]' : 'text-[#DC2626] dark:text-[#F87171]'
                          }`}
                        >
                          {pos24 ? '+' : ''}
                          {asset.change24h.toFixed(2)}%
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#475569] dark:text-[#CBD5E1] hidden md:table-cell">
                          ${(asset.volume24hUsd / 1_000_000).toFixed(1)}M
                        </td>
                        <td className="py-3.5 px-4 hidden sm:table-cell">
                          <div className="h-8 w-24 ml-auto">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={sparkData}>
                                <Line
                                  type="monotone"
                                  dataKey="v"
                                  stroke={pos24 ? '#2563EB' : '#DC2626'}
                                  strokeWidth={1.8}
                                  dot={false}
                                  isAnimationActive={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-[#2563EB] dark:text-[#60A5FA]">
                          {asset.opportunityScore}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <StatusBadge tone={badgeTone} label={translateDecision(asset.signalStatus, t)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 pb-4">
              <CustomPagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={filtered.length}
                pageLabel={t.common.page}
              />
            </div>
          </>
        )}
      </section>

      {/* Asset Detail Modal */}
      <CustomModal
        open={Boolean(selectedAsset)}
        onClose={() => setSelectedAsset(null)}
        title={selectedAsset ? `${selectedAsset.symbol} · ${selectedAsset.name}` : t.markets.details}
        maxWidthClass="max-w-lg"
      >
        {selectedAsset && (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
              <div className="flex items-center gap-3">
                <CoinIcon symbol={selectedAsset.symbol} size={34} />
                <div>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{t.markets.price}</p>
                  <p className="text-2xl font-display font-bold font-mono text-[#0A1428] dark:text-[#F1F5F9] mt-0.5">
                    ${selectedAsset.price.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                  </p>
                </div>
              </div>
              <StatusBadge
                tone={
                  selectedAsset.signalStatus === 'BUY'
                    ? 'emerald'
                    : selectedAsset.signalStatus === 'SELL'
                    ? 'red'
                    : 'slate'
                }
                label={translateDecision(selectedAsset.signalStatus, t)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{t.markets.liquidity}</p>
                <p className="font-mono font-semibold text-sm text-[#0A1428] dark:text-[#F1F5F9] mt-1">
                  {selectedAsset.liquidityScore}/100
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{t.markets.momentum}</p>
                <p className="font-mono font-semibold text-sm text-[#2563EB] dark:text-[#60A5FA] mt-1">
                  {selectedAsset.momentumScore}/100
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#070D19] border border-[#E2E8F0] dark:border-[#1B2942]">
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{t.markets.imbalance}</p>
                <p
                  className={`font-mono font-semibold text-sm mt-1 ${
                    selectedAsset.orderBookImbalance >= 0
                      ? 'text-[#059669] dark:text-[#34D399]'
                      : 'text-[#DC2626] dark:text-[#F87171]'
                  }`}
                >
                  {selectedAsset.orderBookImbalance >= 0 ? '+' : ''}
                  {selectedAsset.orderBookImbalance}%
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">{t.markets.aiSummary}</p>
              <p className="text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">{selectedAsset.aiReasoning}</p>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] pt-1">{selectedAsset.riskNote}</p>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
};
