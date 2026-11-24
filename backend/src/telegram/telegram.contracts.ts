import type { TenantScope } from '../common/security/tenant-scope';

// Contract only: no runtime implementation. Decimal API values are strings.
export interface TelegramNotificationPort { send(scope: TenantScope, notificationId: string): Promise<void> }
