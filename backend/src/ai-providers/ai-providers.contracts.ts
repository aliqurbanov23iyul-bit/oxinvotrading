import type { TenantScope } from '../common/security/tenant-scope';

// Contract only: no runtime implementation. Decimal API values are strings.
export interface AiProviderPort { analyze(scope: TenantScope, input: Readonly<Record<string, unknown>>): Promise<{ readonly provider: string; readonly model: string; readonly decision: 'BUY' | 'WAIT' | 'SELL'; readonly reasoning: string }> }
