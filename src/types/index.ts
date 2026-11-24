export type LanguageCode = 'en' | 'az' | 'tr' | 'ru';

export type UserRole = 'user' | 'admin' | 'super_admin';

export type SubscriptionPlan = 'trial' | 'standard' | 'professional' | 'custom';

export type UserStatus = 'active' | 'suspended' | 'expired';

export type BotStatus = 'running' | 'paused' | 'stopped';

export type StrategyMode =
  | 'Adaptive Momentum'
  | 'Breakout Volume Surge'
  | 'Mean Reversion'
  | 'Liquidity Impulse';

export type TradingDecision = 'BUY' | 'WAIT' | 'SELL';

export type TimeframeKey = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

export type MarketCategoryKey =
  | 'all'
  | 'trending'
  | 'newly_listed'
  | 'high_volume'
  | 'unusual_volume'
  | 'high_momentum'
  | 'high_volatility'
  | 'potential_breakout'
  | 'ai_opportunities';

export type ScannerCategory = MarketCategoryKey;

export type PublicRoute = 'login' | 'about' | 'contact' | 'privacy' | 'terms' | 'risk';

export type UserRoute =
  | 'overview'
  | 'ai-engine'
  | 'scanner'
  | 'ai-analysis'
  | 'trades'
  | 'live-trades'
  | 'trade-history'
  | 'portfolio'
  | 'analytics'
  | 'risk'
  | 'connections'
  | 'binance'
  | 'telegram'
  | 'affiliate'
  | 'notifications'
  | 'support'
  | 'settings'
  | 'help';

export type AdminRoute =
  | 'admin-overview'
  | 'admin-users'
  | 'admin-user-detail'
  | 'admin-activity'
  | 'admin-analytics'
  | 'admin-subscriptions'
  | 'admin-risk'
  | 'admin-binance'
  | 'admin-affiliate'
  | 'admin-support'
  | 'admin-ai-providers'
  | 'admin-system-health'
  | 'admin-notifications'
  | 'admin-audit-logs'
  | 'admin-security'
  | 'admin-settings';

export type AppRoute = UserRoute | AdminRoute;

export interface PublicContactConfig {
  whatsappUrl: string;
  telegramUrl: string;
  supportEmail: string;
  supportHandle: string;
}

export interface RiskConfigState {
  riskLevel: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  stopLossPct: number;
  takeProfitPct: number;
  maxDailyLossPct: number;
  tradeAmountUsd: number;
  selectedPair: string;
  tradingMode: 'PAPER';
  realTradingEnabled: false;
  updatedAt?: string;
}

export interface SupportTicketItem {
  id: string;
  userId: string;
  username: string;
  subject: string;
  category: string;
  message: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  plan: SubscriptionPlan;
  status: UserStatus;
  expiresAt: string;
  createdAt: string;
  lastActiveAt: string;
  notes: string;
  binanceConnected: boolean;
  telegramConnected: boolean;
  telegramHandle?: string;
  botStatus: BotStatus;
  portfolioBalance: number;
  realizedPnl: number;
  winRate: number;
  totalTrades: number;
}

export interface AuthSession {
  user: UserAccount;
  isDemoMode: boolean;
  authenticatedAt: string;
}

export interface PortfolioPoint {
  label: string;
  value: number;
  benchmark: number;
  pnl: number;
}

export interface MarketAsset {
  symbol: string;
  base: string;
  quote: string;
  name: string;
  price: number;
  change1h: number;
  change24h: number;
  volume24hUsd: number;
  volumeSpikePct: number;
  liquidityScore: number;
  momentumScore: number;
  newsSentiment: 'Bullish' | 'Neutral' | 'Cautious';
  socialSentiment: 'High' | 'Moderate' | 'Low';
  orderBookImbalance: number;
  opportunityScore: number;
  signalStatus: TradingDecision;
  categories: MarketCategoryKey[];
  sparkline: number[];
  aiReasoning: string;
  riskNote: string;
}

export interface Trade {
  id: string;
  userId: string;
  username?: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice?: number;
  exitPrice?: number;
  amountUsd: number;
  quantity: number;
  openedAt: string;
  closedAt?: string;
  pnlUsd: number;
  pnlPct: number;
  feesUsd: number;
  durationLabel: string;
  strategy: StrategyMode;
  status: 'active' | 'closed';
  openReason: string;
  closeReason?: string;
}

export interface AIDecisionCard {
  id: string;
  timestamp: string;
  symbol: string;
  marketPrice: number;
  volumeChangePct: number;
  momentumStrength: number;
  orderBookImbalance: number;
  newsSentiment: string;
  socialSentiment: string;
  opportunityScore: number;
  decision: TradingDecision;
  strategy: StrategyMode;
  explanation: string;
  riskEvaluation: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'trade' | 'signal' | 'telegram' | 'binance' | 'system';
  title: string;
  detail: string;
  symbol?: string;
  deltaUsd?: number;
}

export interface BinanceBalanceAsset {
  asset: string;
  free: number;
  locked: number;
  usdValue: number;
}

export interface BinanceConnectionState {
  connected: boolean;
  maskedApiKey: string;
  maskedApiSecret: string;
  lastSyncAt: string;
  spotTradingEnabled: boolean;
  readInfoEnabled: boolean;
  withdrawalsDisabled: boolean;
  estimatedTotalUsd: number;
  availableUsd: number;
  balances: BinanceBalanceAsset[];
}

export interface TelegramNotificationPrefs {
  buyExecuted: boolean;
  sellExecuted: boolean;
  profitNotification: boolean;
  lossNotification: boolean;
  balanceUpdate: boolean;
  aiOpportunityDetected: boolean;
  botStarted: boolean;
  botStopped: boolean;
  connectionErrors: boolean;
  dailyTradingSummary: boolean;
}

export interface TelegramConnectionState {
  connected: boolean;
  handle: string;
  connectionCode: string;
  codeExpiresAt: number;
  botUsername: string;
  prefs: TelegramNotificationPrefs;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'trade' | 'ai' | 'security' | 'system';
  timestamp: string;
  read: boolean;
}

export interface AIProviderConfig {
  id: 'openai' | 'gemini' | 'grok' | 'local';
  name: string;
  vendor: string;
  enabled: boolean;
  status: 'online' | 'standby' | 'degraded';
  selectedModel: string;
  availableModels: string[];
  maskedKey: string;
  endpointNote: string;
  requests24h: number;
  tokensUsed24h: number;
  estimatedCostUsd: number;
  avgLatencyMs: number;
  roleDescription: string;
}

export interface SystemHealthMetrics {
  cpuUsagePct: number;
  ramUsedGb: number;
  ramTotalGb: number;
  networkInMbps: number;
  networkOutMbps: number;
  uptimeLabel: string;
  wsConnections: number;
  marketDataLatencyMs: number;
  activeBotInstances: number;
  aiRequestQueue: number;
  databaseStatus: string;
  workerStatus: string;
  hostEnvironment: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ipMasked: string;
  severity: 'info' | 'warning';
}

export interface SubscriptionTierInfo {
  id: SubscriptionPlan;
  name: string;
  audience: string;
  monthlyPriceLabel: string;
  maxBots: number;
  maxPairs: number;
  aiProvidersAllowed: string;
  telegramAlerts: boolean;
  priorityExecution: boolean;
}
