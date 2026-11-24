import type { PoolConfig } from 'pg';
export function validateDatabaseUrl(value: string, purpose: 'runtime' | 'migration', environment: string, expectedHost?: string): URL;
export function connectionOptions(value: string, purpose: 'runtime' | 'migration', environment: string, expectedHost?: string): PoolConfig;
