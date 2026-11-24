// Shared by Prisma runtime, CLI preflight and scripts. Never log returned options.
function validateDatabaseUrl(value, purpose, environment, expectedHost) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Invalid database connection configuration'); }
  if (!['postgresql:', 'postgres:'].includes(url.protocol) || !url.hostname || !url.username || !url.password || url.pathname.length < 2) throw new Error('Invalid database connection configuration');
  // Loopback is permitted only for isolated tests; development now uses Neon.
  if (environment === 'test' && ['127.0.0.1', 'localhost'].includes(url.hostname)) return url;
  const host = url.hostname;
  if (!host.endsWith('.neon.tech') || !host.startsWith('ep-') || url.port && url.port !== '5432') throw new Error('A Neon PostgreSQL endpoint is required');
  const pooled = host.includes('-pooler.');
  if ((purpose === 'runtime') !== pooled) throw new Error('Use pooled runtime and direct migration connections');
  const directHost = host.replace('-pooler.', '.');
  if (!expectedHost || expectedHost !== directHost || expectedHost.includes('-pooler.')) throw new Error('Database endpoint does not match the selected environment branch');
  const sslMode = url.searchParams.get('sslmode');
  if (!['require', 'verify-full'].includes(sslMode)) throw new Error('Verified TLS is required for Neon');
  // Forbid query-level host/password/SSL overrides and local certificate paths.
  const allowed = new Set(['sslmode', 'channel_binding', 'connect_timeout', 'schema', 'pgbouncer', 'connection_limit', 'pool_timeout']);
  for (const key of url.searchParams.keys()) if (!allowed.has(key) || url.searchParams.getAll(key).length !== 1) throw new Error('Unsupported database URL parameter');
  if (url.searchParams.has('channel_binding') && url.searchParams.get('channel_binding') !== 'require') throw new Error('Invalid channel binding configuration');
  return url;
}

function connectionOptions(value, purpose, environment, expectedHost) {
  const url = validateDatabaseUrl(value, purpose, environment, expectedHost);
  if (environment === 'test' && ['127.0.0.1', 'localhost'].includes(url.hostname)) return { connectionString: url.toString() };
  // pg URL SSL parameters override an explicit ssl object. Remove those parameters
  // after validating them, then enforce CA + hostname verification explicitly.
  for (const key of ['sslmode', 'channel_binding']) url.searchParams.delete(key);
  return { connectionString: url.toString(), ssl: { rejectUnauthorized: true }, enableChannelBinding: true };
}

module.exports = { validateDatabaseUrl, connectionOptions };
