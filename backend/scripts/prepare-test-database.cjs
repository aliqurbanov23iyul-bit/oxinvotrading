const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const { Client } = require('pg');
const { connectionOptions } = require('../src/config/database-connection.cjs');
const { runPrisma } = require('./prisma-command.cjs');
async function main() {
  const file = path.resolve(__dirname, '../.env.test.local');
  if (!fs.existsSync(file)) throw new Error('Dedicated test environment is unavailable');
  const env = dotenv.parse(fs.readFileSync(file));
  const url = new URL(env.DATABASE_URL_UNPOOLED);
  if (env.NODE_ENV !== 'test' || env.DATABASE_ENV !== 'test' || url.pathname !== '/oxinvo_test' || url.username !== 'oxinvo_test_migrator') throw new Error('Test database guard rejected target');
  const client = new Client({ ...connectionOptions(url.toString(), 'migration', 'test', env.NEON_BRANCH_HOST), connectionTimeoutMillis: 15000, statement_timeout: 10000 });
  try {
    await client.connect();
    const result = await client.query("SELECT shobj_description(oid,'pg_database') AS marker FROM pg_database WHERE datname=current_database()");
    if (result.rows[0]?.marker !== 'OXINVO:test:v1') throw new Error('Unrecognized test database');
    const tables = await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
    if (tables.rows.length && !tables.rows.some(row => row.tablename === '_prisma_migrations')) throw new Error('Unrecognized existing test schema');
  } finally { await client.end().catch(() => {}); }
  const code = runPrisma(['migrate', 'deploy'], env);
  if (code) { process.exitCode = code; return; }
  console.log('Dedicated test database migrations ready. No reset performed.');
}
main().catch(error => { console.error(JSON.stringify({ phase: 'prepare-test-database', code: error.code ?? 'TEST_TARGET_GUARD' })); process.exitCode = 1; });
