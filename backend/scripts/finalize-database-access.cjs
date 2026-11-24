const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const { Client } = require('pg');
const { connectionOptions } = require('../src/config/database-connection.cjs');
const quote = value => '"' + value.replace(/"/g, '""') + '"';
async function main() {
  const results = [];
  for (const name of ['.env', '.env.test.local']) {
    const env = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '..', name)));
    const runtime = new URL(env.DATABASE_URL).username;
    const client = new Client({ ...connectionOptions(env.DATABASE_URL_UNPOOLED, 'migration', env.NODE_ENV, env.NEON_BRANCH_HOST), connectionTimeoutMillis: 15000 });
    try {
      await client.connect();
      // Prisma migration history is never writable/readable by the runtime role.
      await client.query(`REVOKE ALL ON TABLE public."_prisma_migrations" FROM ${quote(runtime)}`);
      const role = await client.query('SELECT rolsuper,rolcreatedb,rolcreaterole,rolbypassrls,rolreplication FROM pg_roles WHERE rolname=$1', [runtime]);
      const rights = await client.query("SELECT has_schema_privilege($1,'public','CREATE') AS schema_create, has_table_privilege($1,'public.\"_prisma_migrations\"','UPDATE') AS migration_update, has_table_privilege($1,'public.\"User\"','SELECT') AS user_read", [runtime]);
      if (Object.values(role.rows[0]).some(Boolean) || rights.rows[0].schema_create || rights.rows[0].migration_update || !rights.rows[0].user_read) throw new Error('Runtime role privilege check failed');
      results.push({ environment: env.NODE_ENV, runtimeLeastPrivilege: true, migrationHistoryProtected: true });
    } finally { await client.end().catch(() => {}); }
  }
  console.log(JSON.stringify(results));
}
main().catch(error => { console.error(JSON.stringify({ phase: 'finalize-database-access', code: error.code ?? 'PRIVILEGE_GUARD' })); process.exitCode = 1; });
