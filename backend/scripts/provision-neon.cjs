// One-time SQL provisioning in the user's existing Neon compute; no paid
// compute, control-plane branches, production deployment or source DB writes.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const dotenv = require('dotenv');
const { Client } = require('pg');
const { connectionOptions } = require('../src/config/database-connection.cjs');
const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const env = dotenv.parse(fs.readFileSync(envPath));
const quote = name => '"' + name.replace(/"/g, '""') + '"';
const literal = value => "'" + value.replace(/'/g, "''") + "'";
const secretFile = path.join(root, '.env.neon-provision.local');
const names = ['DEV_MIGRATOR_PASSWORD', 'DEV_RUNTIME_PASSWORD', 'TEST_MIGRATOR_PASSWORD', 'TEST_RUNTIME_PASSWORD'];
if (!fs.existsSync(secretFile)) fs.writeFileSync(secretFile, names.map(name => name + '=' + crypto.randomBytes(32).toString('base64url')).join('\n') + '\n', { flag: 'wx', mode: 0o600 });
const passwords = dotenv.parse(fs.readFileSync(secretFile));
const sourceUrl = new URL(env.DATABASE_URL_UNPOOLED);
const endpoint = env.NEON_BRANCH_HOST;
const scopes = [
  { kind: 'development', database: 'oxinvo_development', migrator: 'oxinvo_dev_migrator', runtime: 'oxinvo_dev_runtime', mp: passwords.DEV_MIGRATOR_PASSWORD, rp: passwords.DEV_RUNTIME_PASSWORD },
  { kind: 'test', database: 'oxinvo_test', migrator: 'oxinvo_test_migrator', runtime: 'oxinvo_test_runtime', mp: passwords.TEST_MIGRATOR_PASSWORD, rp: passwords.TEST_RUNTIME_PASSWORD },
];
function options(url) { return { ...connectionOptions(url, 'migration', 'development', endpoint), connectionTimeoutMillis: 15000, statement_timeout: 15000 }; }
function updateFile(file, updates, template = '') {
  let text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : template;
  for (const [key, value] of Object.entries(updates)) {
    const pattern = new RegExp('^' + key + '=.*$', 'm');
    text = pattern.test(text) ? text.replace(pattern, () => key + '=' + value) : text + '\n' + key + '=' + value;
  }
  fs.writeFileSync(file, text.endsWith('\n') ? text : text + '\n', { mode: 0o600 });
}
async function main() {
  if (sourceUrl.username !== 'neondb_owner') throw new Error('Bootstrap owner connection required; refusing to reset existing roles');
  const admin = new Client(options(sourceUrl.toString()));
  try {
    await admin.connect();
    const identity = await admin.query("SELECT current_setting('neon.project_id', true) AS project, current_setting('neon.endpoint_id', true) AS endpoint");
    // Non-secret project identity verified against Vercel's linked OXINVO resource.
    if (identity.rows[0].project !== 'cold-haze-65918453' || identity.rows[0].endpoint !== 'ep-calm-dew-bbx9ijna') throw new Error('Neon resource identity mismatch');
    for (const scope of scopes) {
      for (const [role, password, kind] of [[scope.migrator, scope.mp, 'migrator'], [scope.runtime, scope.rp, 'runtime']]) {
        const marker = 'OXINVO:' + scope.kind + ':' + kind + ':v1';
        const existing = await admin.query("SELECT oid, shobj_description(oid,'pg_authid') AS marker FROM pg_roles WHERE rolname=$1", [role]);
        if (existing.rows.length && existing.rows[0].marker !== marker) throw new Error('Unrecognized existing role');
        if (!existing.rows.length) {
          await admin.query(`CREATE ROLE ${quote(role)} LOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS PASSWORD ${literal(password)}`);
          await admin.query(`COMMENT ON ROLE ${quote(role)} IS ${literal(marker)}`);
        }
      }
      // The bootstrap owner already administers this branch. Membership permits
      // creating the new DB with its dedicated non-admin migration owner.
      await admin.query(`GRANT ${quote(scope.migrator)} TO ${quote(sourceUrl.username)}`);
      const existing = await admin.query("SELECT oid, shobj_description(oid,'pg_database') AS marker, pg_get_userbyid(datdba) AS owner FROM pg_database WHERE datname=$1", [scope.database]);
      const marker = 'OXINVO:' + scope.kind + ':v1';
      if (existing.rows.length && (existing.rows[0].marker !== marker || existing.rows[0].owner !== scope.migrator)) throw new Error('Unrecognized existing database');
      if (!existing.rows.length) {
        await admin.query(`CREATE DATABASE ${quote(scope.database)} OWNER ${quote(scope.migrator)}`);
        await admin.query(`COMMENT ON DATABASE ${quote(scope.database)} IS ${literal(marker)}`);
      }
      await admin.query(`REVOKE ALL ON DATABASE ${quote(scope.database)} FROM PUBLIC`);
      await admin.query(`GRANT CONNECT ON DATABASE ${quote(scope.database)} TO ${quote(scope.runtime)}`);
      const migrationUrl = new URL(sourceUrl); migrationUrl.pathname = '/' + scope.database; migrationUrl.username = scope.migrator; migrationUrl.password = scope.mp;
      const setup = new Client(options(migrationUrl.toString()));
      try {
        await setup.connect();
        await setup.query('REVOKE ALL ON SCHEMA public FROM PUBLIC');
        await setup.query(`GRANT USAGE ON SCHEMA public TO ${quote(scope.runtime)}`);
        await setup.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${quote(scope.runtime)}`);
        await setup.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ${quote(scope.runtime)}`);
      } finally { await setup.end().catch(() => {}); }
      const runtimeUrl = new URL(migrationUrl); runtimeUrl.hostname = runtimeUrl.hostname.replace('.c-15.', '-pooler.c-15.'); runtimeUrl.username = scope.runtime; runtimeUrl.password = scope.rp; runtimeUrl.searchParams.set('channel_binding', 'require');
      scope.migrationUrl = migrationUrl.toString(); scope.runtimeUrl = runtimeUrl.toString();
    }
    const development = scopes[0], test = scopes[1];
    const before = dotenv.parse(fs.readFileSync(envPath));
    updateFile(envPath, { DATABASE_URL: development.runtimeUrl, DATABASE_URL_UNPOOLED: development.migrationUrl, DATABASE_ENV: 'development', NODE_ENV: 'development', NEON_BRANCH_HOST: endpoint });
    const after = dotenv.parse(fs.readFileSync(envPath));
    for (const name of ['SESSION_SECRET', 'ENCRYPTION_KEY']) if (after[name] !== before[name]) throw new Error('Existing secret changed');
    updateFile(path.join(root, '.env.test.local'), { NODE_ENV: 'test', DATABASE_ENV: 'test', NEON_BRANCH_HOST: endpoint, DATABASE_URL: test.runtimeUrl, DATABASE_URL_UNPOOLED: test.migrationUrl, FRONTEND_URL: 'http://127.0.0.1:3000', SESSION_SECRET: crypto.randomBytes(32).toString('base64'), ENCRYPTION_KEY: crypto.randomBytes(32).toString('base64'), LOG_LEVEL: 'silent', PORT: '4000' });
    console.log(JSON.stringify({ projectIdentityVerified: true, sourceDatabaseUntouched: true, isolatedDatabases: scopes.map(s => ({ purpose: s.kind, database: s.database, rolesSeparated: true })), branchesCreated: false, reason: 'SQL credentials do not authorize Neon control-plane branching' }));
  } finally { await admin.end().catch(() => {}); }
}
main().catch(error => { console.error(JSON.stringify({ phase: 'provision-neon', code: error.code ?? 'PROVISIONING_GUARD' })); process.exitCode = 1; });
