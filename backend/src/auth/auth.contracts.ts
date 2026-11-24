// Contract only: no runtime implementation. Decimal API values are strings.
export interface VerifiedSession { readonly sessionId: string; readonly userId: string; readonly role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'; readonly mustChangePassword: boolean }
