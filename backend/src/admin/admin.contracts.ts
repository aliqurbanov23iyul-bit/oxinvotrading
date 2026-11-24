// Contract only: no runtime implementation. Decimal API values are strings.
export interface AdministrativeContext { readonly actorUserId: string; readonly role: 'SUPER_ADMIN' | 'ADMIN'; readonly requestId: string }
