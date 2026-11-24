import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '../generated/prisma/client';
import { connectionOptions } from '../config/database-connection.cjs';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  // No public raw Prisma client: Stage 3 must add explicitly tenant-scoped
  // repositories and separate authorized admin projections.
  private readonly client: PrismaClient;
  private readonly configured: boolean;
  constructor(config: ConfigService) {
    const connectionString = config.getOrThrow<string>('DATABASE_URL');
    this.configured = !connectionString.includes('CHANGE_ME');
    const schema = new URL(connectionString).searchParams.get('schema') ?? 'public';
    const adapter = new PrismaPg({
      ...connectionOptions(connectionString, 'runtime', config.getOrThrow('NODE_ENV'), config.get('NEON_BRANCH_HOST')),
      max: 5, connectionTimeoutMillis: 10000, idleTimeoutMillis: 30000,
      query_timeout: 10000, statement_timeout: 10000,
    }, { schema });
    this.client = new PrismaClient({ adapter, log: [] });
  }
  async isReady(): Promise<boolean> {
    if (!this.configured) return false;
    try { await this.client.$queryRaw`SELECT 1`; return true; } catch { return false; }
  }
  async onModuleDestroy() { await this.client.$disconnect(); }
  // Internal-only transaction boundaries. Controllers never receive raw Prisma.
  system<T>(work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.client.$transaction(async tx => {
      await tx.$executeRaw`SELECT set_config('oxinvo.admin', 'true', true)`;
      return work(tx);
    }, { timeout: 30000, maxWait: 15000 });
  }
  tenant<T>(userId: string, work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.client.$transaction(async tx => {
      await tx.$executeRaw`SELECT set_config('oxinvo.user_id', ${userId}, true), set_config('oxinvo.admin', 'false', true)`;
      return work(tx);
    }, { timeout: 30000, maxWait: 15000 });
  }
}
