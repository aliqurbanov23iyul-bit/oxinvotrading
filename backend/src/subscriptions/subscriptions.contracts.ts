// Contract only: no runtime implementation. Decimal API values are strings.
export interface SubscriptionEntitlement { readonly userId: string; readonly planId: string; readonly expirationDate: Date; readonly active: boolean }
