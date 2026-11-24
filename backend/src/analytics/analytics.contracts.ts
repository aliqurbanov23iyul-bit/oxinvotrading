import type { TenantScope } from '../common/security/tenant-scope';

// Contract only: no runtime implementation. Decimal API values are strings.
export interface AnalyticsPort { summarize(scope: TenantScope, mode: 'PAPER'): Promise<{ readonly realizedProfit: string; readonly totalTrades: number }> }
