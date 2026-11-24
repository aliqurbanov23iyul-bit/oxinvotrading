// Contract only: no runtime implementation. Decimal API values are strings.
export interface UserSummary { readonly id: string; readonly username: string; readonly fullName: string; readonly status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'DELETED' }
