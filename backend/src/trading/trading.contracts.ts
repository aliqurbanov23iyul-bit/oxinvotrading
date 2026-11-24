import type { TenantScope } from '../common/security/tenant-scope';

// Contract only: no runtime implementation. Decimal API values are strings.
export interface PaperOrderRequest { readonly clientOrderId: string; readonly symbol: string; readonly side: 'BUY' | 'SELL'; readonly quantity: string; readonly tradingMode: 'PAPER' }
export interface TradingPort { submitPaperOrder(scope: TenantScope, request: PaperOrderRequest): Promise<{ readonly orderId: string }> }
