import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';
import { validateDatabaseUrl } from './src/config/database-connection.cjs';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env', quiet: true });
const direct = process.env.DATABASE_URL_UNPOOLED;
const configured = direct && !direct.includes('CHANGE_ME');
const needsDatabase = process.argv.includes('db') || (process.argv.includes('migrate') && !process.argv.includes('diff'));
if (needsDatabase && !configured) throw new Error('Configure DATABASE_URL_UNPOOLED privately for the selected Neon environment before database commands.');
const verifiedDirect = configured ? validateDatabaseUrl(direct, 'migration', process.env.NODE_ENV ?? 'development', process.env.NEON_BRANCH_HOST) : undefined;
if (verifiedDirect) verifiedDirect.searchParams.set('sslmode', 'verify-full');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // Generation/validation must work without a running database. Migration wrapper
  // requires a real DATABASE_URL and never silently connects to this fallback.
  datasource: { url: verifiedDirect?.toString() ?? 'postgresql://unconfigured:unconfigured@127.0.0.1:5432/oxinvo_unconfigured' },
});
