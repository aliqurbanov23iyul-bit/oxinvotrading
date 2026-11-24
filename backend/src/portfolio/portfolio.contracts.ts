import type { TenantScope } from '../common/security/tenant-scope';

// Contract only: no runtime implementation. Decimal API values are strings.
export interface PortfolioPort { snapshot(scope: TenantScope, mode: 'PAPER'): Promise<{ readonly totalBalance: string; readonly availableBalance: string; readonly valuationCurrency: string }> }
