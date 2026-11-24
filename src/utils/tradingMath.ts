import { MarketAsset, ScannerCategory, Trade } from '../types';

export type ScannerSortField =
  | 'symbol'
  | 'price'
  | 'change1h'
  | 'change24h'
  | 'volume24hUsd'
  | 'volumeSpikePct'
  | 'liquidityScore'
  | 'momentumScore'
  | 'opportunityScore';

export type SortDirection = 'asc' | 'desc';

export function filterAndSortAssets(
  assets: MarketAsset[],
  query: string,
  category: ScannerCategory,
  sortField: ScannerSortField,
  sortDir: SortDirection
): MarketAsset[] {
  const normalized = query.trim().toLowerCase();

  const filtered = assets.filter((asset) => {
    const matchesCategory = category === 'all' || asset.categories.includes(category);
    if (!matchesCategory) return false;

    if (!normalized) return true;
    return (
      asset.symbol.toLowerCase().includes(normalized) ||
      asset.name.toLowerCase().includes(normalized) ||
      asset.base.toLowerCase().includes(normalized)
    );
  });

  return [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'symbol') {
      cmp = a.symbol.localeCompare(b.symbol);
    } else {
      cmp = a[sortField] - b[sortField];
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });
}

export interface TradeFilterOptions {
  query: string;
  side: 'ALL' | 'BUY' | 'SELL';
  strategy: string;
  dateFrom?: string;
  dateTo?: string;
}

export function filterTrades(trades: Trade[], options: TradeFilterOptions): Trade[] {
  const q = options.query.trim().toLowerCase();
  const fromTs = options.dateFrom ? Date.parse(options.dateFrom) : NaN;
  const toTs = options.dateTo ? Date.parse(options.dateTo) + 86_399_999 : NaN;

  return trades.filter((t) => {
    if (options.side !== 'ALL' && t.side !== options.side) return false;
    if (options.strategy !== 'ALL' && t.strategy !== options.strategy) return false;

    if (q) {
      const hay = `${t.symbol} ${t.strategy} ${t.openReason} ${t.closeReason ?? ''} ${t.username ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    const openedTs = Date.parse(t.openedAt);
    if (!Number.isNaN(fromTs) && openedTs < fromTs) return false;
    if (!Number.isNaN(toTs) && openedTs > toTs) return false;

    return true;
  });
}

export interface TradeSummaryMetrics {
  totalTrades: number;
  winRatePct: number;
  totalPnlUsd: number;
  totalFeesUsd: number;
  averageWinUsd: number;
  averageLossUsd: number;
}

export function computeTradeSummary(trades: Trade[]): TradeSummaryMetrics {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winRatePct: 0,
      totalPnlUsd: 0,
      totalFeesUsd: 0,
      averageWinUsd: 0,
      averageLossUsd: 0,
    };
  }

  let wins = 0;
  let winSum = 0;
  let lossCount = 0;
  let lossSum = 0;
  let totalPnlUsd = 0;
  let totalFeesUsd = 0;

  for (const t of trades) {
    totalPnlUsd += t.pnlUsd;
    totalFeesUsd += t.feesUsd;
    if (t.pnlUsd > 0) {
      wins++;
      winSum += t.pnlUsd;
    } else if (t.pnlUsd < 0) {
      lossCount++;
      lossSum += t.pnlUsd;
    }
  }

  return {
    totalTrades: trades.length,
    winRatePct: Number(((wins / trades.length) * 100).toFixed(1)),
    totalPnlUsd: Number(totalPnlUsd.toFixed(2)),
    totalFeesUsd: Number(totalFeesUsd.toFixed(2)),
    averageWinUsd: wins > 0 ? Number((winSum / wins).toFixed(2)) : 0,
    averageLossUsd: lossCount > 0 ? Number((lossSum / lossCount).toFixed(2)) : 0,
  };
}

export function classifySignalStrength(score: number): 'Strong Alignment' | 'Moderate Alignment' | 'Watchlist' {
  if (score >= 78) return 'Strong Alignment';
  if (score >= 60) return 'Moderate Alignment';
  return 'Watchlist';
}

export function buildTradesCsv(trades: Trade[], sanitizeCell: (v: string | number | undefined) => string): string {
  const headers = [
    'ID',
    'Symbol',
    'Side',
    'Entry Price',
    'Exit/Current Price',
    'Amount (USD)',
    'Opened At',
    'Closed At',
    'PnL (USD)',
    'PnL (%)',
    'Fees (USD)',
    'Duration',
    'Strategy',
    'Status',
    'Open Reason',
    'Close Reason',
  ];

  const rows = trades.map((t) => [
    t.id,
    t.symbol,
    t.side,
    t.entryPrice,
    t.exitPrice ?? t.currentPrice ?? '',
    t.amountUsd,
    t.openedAt,
    t.closedAt ?? '',
    t.pnlUsd,
    t.pnlPct,
    t.feesUsd,
    t.durationLabel,
    t.strategy,
    t.status,
    t.openReason,
    t.closeReason ?? '',
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => sanitizeCell(cell)).join(','))
    .join('\n');
}
