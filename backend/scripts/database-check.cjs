require('./load-env.cjs');
const { Client } = require('pg');
const { connectionOptions } = require('../src/config/database-connection.cjs');

async function check() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('CHANGE_ME')) {
    console.error('DATABASE_URL is not configured. Create the Neon development database and configure backend/.env privately.');
    process.exitCode = 1; return;
  }
  let client;
  try {
    client = new Client({ ...connectionOptions(process.env.DATABASE_URL, 'runtime', process.env.NODE_ENV ?? 'development', process.env.NEON_BRANCH_HOST), connectionTimeoutMillis: 10000, statement_timeout: 10000 });
    await client.connect();
    await client.query('SELECT 1');
    console.log('Database connection: OK (read-only probe)');
  } catch { console.error('Database unavailable. Connection details omitted.'); process.exitCode = 1; }
  finally { if (client) await client.end().catch(() => {}); }
}
check();
