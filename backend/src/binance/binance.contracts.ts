import type { TenantScope } from '../common/security/tenant-scope';

// Contract only: no runtime implementation. Decimal API values are strings.
export interface BinanceConnectionPort { verifyPermissions(scope: TenantScope): Promise<{ readonly readEnabled: boolean; readonly spotTradingEnabled: boolean; readonly withdrawalsDisabled: boolean }> }
