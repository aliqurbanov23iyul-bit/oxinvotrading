import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDatabaseUrl, connectionOptions } from '../src/config/database-connection.cjs';

const host = 'ep-dev.eu-central-1.aws.neon.tech';
const pooled = 'postgresql://app:test-only@ep-dev-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const direct = pooled.replace('-pooler.', '.');
test('Neon runtime requires pooler; migrations require direct; expected branch must match', () => {
  assert.ok(validateDatabaseUrl(pooled, 'runtime', 'development', host));
  assert.ok(validateDatabaseUrl(direct, 'migration', 'development', host));
  assert.throws(() => validateDatabaseUrl(pooled, 'migration', 'development', host));
  assert.throws(() => validateDatabaseUrl(direct, 'runtime', 'development', host));
  assert.throws(() => validateDatabaseUrl(pooled, 'runtime', 'development', 'ep-prod.eu-central-1.aws.neon.tech'));
  assert.throws(() => validateDatabaseUrl(pooled.replace('neon.tech', 'neon.tech.attacker.example'), 'runtime', 'development', host));
});
test('Neon TLS verifies certificates and rejects downgrade/query overrides', () => {
  const options = connectionOptions(pooled, 'runtime', 'development', host);
  assert.deepEqual(options.ssl, { rejectUnauthorized: true });
  assert.equal(options.enableChannelBinding, true);
  assert.equal(new URL(options.connectionString!).searchParams.has('sslmode'), false);
  for (const suffix of ['&ssl=false', '&host=attacker.example', '&sslrootcert=some-file', '&uselibpqcompat=true', '&sslmode=disable']) assert.throws(() => connectionOptions(pooled + suffix, 'runtime', 'development', host));
  assert.throws(() => connectionOptions(pooled.replace('sslmode=require', 'sslmode=no-verify'), 'runtime', 'development', host));
});
