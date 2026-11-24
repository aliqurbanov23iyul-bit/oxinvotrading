import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTradesCsv,
  classifySignalStrength,
  computeTradeSummary,
  filterAndSortAssets,
  filterTrades,
} from './tradingMath';
import { sanitizeCsvCell } from './security';
import { MarketAsset, Trade } from '../types';

const sampleAssets: MarketAsset[] = [
  {
    symbol: 'SOL/USDT',
    base: 'SOL',
    quote: 'USDT',
    name: 'Solana',
    price: 148.5,
    change1h: 1.4,
    change24h: 6.2,
    volume24hUsd: 840_000_000,
    volumeSpikePct: 48,
    liquidityScore: 95,
    momentumScore: 84,
    newsSentiment: 'Bullish',
    socialSentiment: 'High',
    orderBookImbalance: 24,
    opportunityScore: 82,
    signalStatus: 'BUY',
    categories: ['trending', 'high_momentum', 'ai_opportunities'],
    sparkline: [140, 142, 145, 148.5],
    aiReasoning: 'Momentum increase',
    riskNote: 'Volatile asset',
  },
  {
    symbol: 'PENDLE/USDT',
    base: 'PENDLE',
    quote: 'USDT',
    name: 'Pendle',
    price: 4.82,
    change1h: -0.4,
    change24h: 12.8,
    volume24hUsd: 120_000_000,
    volumeSpikePct: 165,
    liquidityScore: 76,
    momentumScore: 88,
    newsSentiment: 'Neutral',
    socialSentiment: 'Moderate',
    orderBookImbalance: 18,
    opportunityScore: 75,
    signalStatus: 'WAIT',
    categories: ['unusual_volume', 'potential_breakout'],
    sparkline: [4.2, 4.4, 4.7, 4.82],
    aiReasoning: 'Volume spike detected',
    riskNote: 'Mid-cap slippage risk',
  },
];

const sampleTrades: Trade[] = [
  {
    id: 'TR-1',
    userId: 'u1',
    symbol: 'SOL/USDT',
    side: 'BUY',
    entryPrice: 140,
    exitPrice: 148,
    amountUsd: 500,
    quantity: 3.57,
    openedAt: '2026-11-20T10:00:00Z',
    closedAt: '2026-11-20T14:00:00Z',
    pnlUsd: 28.5,
    pnlPct: 5.7,
    feesUsd: 1.0,
    durationLabel: '4h 00m',
    strategy: 'Adaptive Momentum',
    status: 'closed',
    openReason: 'Volume breakout',
    closeReason: 'Target reached',
  },
  {
    id: 'TR-2',
    userId: 'u1',
    symbol: 'INJ/USDT',
    side: 'SELL',
    entryPrice: 24.0,
    exitPrice: 24.4,
    amountUsd: 300,
    quantity: 12.5,
    openedAt: '2026-11-21T09:00:00Z',
    closedAt: '2026-11-21T10:30:00Z',
    pnlUsd: -5.0,
    pnlPct: -1.67,
    feesUsd: 0.6,
    durationLabel: '1h 30m',
    strategy: 'Mean Reversion',
    status: 'closed',
    openReason: 'Overextended RSI',
    closeReason: 'Stop-loss triggered',
  },
];

test('filterAndSortAssets filters by query and category and sorts descending', () => {
  const byCat = filterAndSortAssets(sampleAssets, '', 'unusual_volume', 'volumeSpikePct', 'desc');
  assert.equal(byCat.length, 1);
  assert.equal(byCat[0].symbol, 'PENDLE/USDT');

  const sortedAll = filterAndSortAssets(sampleAssets, '', 'all', 'opportunityScore', 'desc');
  assert.equal(sortedAll[0].symbol, 'SOL/USDT');
});

test('filterTrades filters by side, strategy, and date range', () => {
  const filtered = filterTrades(sampleTrades, {
    query: 'SOL',
    side: 'BUY',
    strategy: 'Adaptive Momentum',
    dateFrom: '2026-11-19',
    dateTo: '2026-11-20',
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'TR-1');
});

test('computeTradeSummary calculates win rate and net PnL accurately', () => {
  const summary = computeTradeSummary(sampleTrades);
  assert.equal(summary.totalTrades, 2);
  assert.equal(summary.winRatePct, 50);
  assert.equal(summary.totalPnlUsd, 23.5);
  assert.equal(summary.totalFeesUsd, 1.6);
});

test('classifySignalStrength uses non-probabilistic signal labels', () => {
  assert.equal(classifySignalStrength(82), 'Strong Alignment');
  assert.equal(classifySignalStrength(65), 'Moderate Alignment');
  assert.equal(classifySignalStrength(45), 'Watchlist');
});

test('buildTradesCsv generates valid CSV header and rows', () => {
  const csv = buildTradesCsv(sampleTrades, sanitizeCsvCell);
  const lines = csv.split('\n');
  assert.equal(lines.length, 3);
  assert.match(lines[0], /"ID","Symbol","Side"/);
});
