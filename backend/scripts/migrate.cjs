const fs = require('node:fs');
const path = require('node:path');
const { runPrisma } = require('./prisma-command.cjs');
const { Client } = require('pg');
require('./load-env.cjs');
const { connectionOptions } = require('../src/config/database-connection.cjs');

async function migrate() {
  if (!process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL_UNPOOLED.includes('CHANGE_ME')) {
    console.error('Migration not run: configure DATABASE_URL_UNPOOLED for a dedicated empty Neon development branch.');
    process.exitCode = 1; return;
  }
  if (process.env.NODE_ENV === 'production') {
    console.error('This Stage 2 helper is development-only. Production migrations require a reviewed deployment procedure.');
    process.exitCode = 1; return;
  }
  let client;
  try {
    if (process.env.DATABASE_ENV !== 'development' || process.env.NODE_ENV !== 'development') throw new Error('unsafe');
    client = new Client({ ...connectionOptions(process.env.DATABASE_URL_UNPOOLED, 'migration', process.env.NODE_ENV, process.env.NEON_BRANCH_HOST), connectionTimeoutMillis: 10000, statement_timeout: 10000 });
    await client.connect();
    // Initial setup may only target an empty schema. Existing tracked installations
    // must contain exactly the known completed migration, not arbitrary data.
    const url = new URL(process.env.DATABASE_URL_UNPOOLED);
    const schema = url.searchParams.get('schema') ?? 'public';
    const tables = await client.query('SELECT tablename FROM pg_tables WHERE schemaname = $1', [schema]);
    if (tables.rows.length) {
      if (!tables.rows.some(row => row.tablename === '_prisma_migrations')) throw new Error('unsafe');
      const quoted = '"' + schema.replace(/"/g, '""') + '"';
      const history = await client.query(`SELECT migration_name, finished_at, rolled_back_at FROM ${quoted}."_prisma_migrations"`);
      const allowed = fs.readdirSync(path.resolve(__dirname, '../prisma/migrations')).filter(name => /^\d+_/.test(name));
      if (!history.rows.length || history.rows.some(row => !allowed.includes(row.migration_name) || !row.finished_at || row.rolled_back_at)) throw new Error('unsafe');
    }
  } catch {
    console.error('Migration not run: database unavailable or not an empty/recognized development schema. No reset or baseline performed.');
    process.exitCode = 1; return;
  } finally { if (client) await client.end().catch(() => {}); }
  process.exitCode = runPrisma(['migrate', 'deploy']);
}
migrate().catch(() => { console.error('Migration failed. Sensitive details omitted.'); process.exitCode = 1; });
