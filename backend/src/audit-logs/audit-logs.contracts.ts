// Contract only: no runtime implementation. Decimal API values are strings.
export interface AuditEvent { readonly actorUserId: string | null; readonly targetUserId: string | null; readonly action: string; readonly resource: string; readonly resourceId?: string; readonly requestId: string }
