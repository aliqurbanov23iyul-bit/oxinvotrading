// Contract only: no runtime implementation. Decimal API values are strings.
export interface MarketScannerPort { scan(): Promise<ReadonlyArray<{ readonly symbol: string; readonly price: string; readonly signal: 'BUY' | 'WAIT' | 'SELL' }>> }
