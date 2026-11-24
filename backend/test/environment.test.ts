import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { validateEnvironment } from '../src/config/environment';

const valid = () => ({ NODE_ENV: 'test', DATABASE_ENV: 'test', PORT: '4000', DATABASE_URL: 'postgresql://local:local@127.0.0.1:5432/oxinvo_test', FRONTEND_URL: 'http://127.0.0.1:3000', SESSION_SECRET: randomBytes(32).toString('base64'), ENCRYPTION_KEY: randomBytes(32).toString('base64'), LOG_LEVEL: 'silent' });
test('environment converts explicit port and rejects invalid or missing secrets without disclosure', () => {
  assert.equal(validateEnvironment(valid()).PORT, 4000);
  for (const change of [{ PORT: 'NaN' }, { PORT: '0' }, { PORT: '65536' }, { DATABASE_URL: 'file:local' }, { DATABASE_URL: '' }, { ENCRYPTION_KEY: 'secret-do-not-log' }, { SESSION_SECRET: '' }, { NODE_ENV: 'staging' }, { LOG_LEVEL: 'verbose' }]) {
    assert.throws(() => validateEnvironment({ ...valid(), ...change }), error => error instanceof Error && !error.message.includes('secret-do-not-log'));
  }
});
test('CORS configuration is a single exact origin and production requires HTTPS', () => {
  for (const FRONTEND_URL of ['*', 'http://localhost:3000/path', 'http://localhost:3000/', 'https://user:pass@example.com', 'https://example.com?q=1']) assert.throws(() => validateEnvironment({ ...valid(), FRONTEND_URL }));
  assert.throws(() => validateEnvironment({ ...valid(), NODE_ENV: 'production' }));
  assert.equal(validateEnvironment({ ...valid(), NODE_ENV: 'production', DATABASE_ENV: 'production', NEON_BRANCH_HOST: 'ep-prod.eu-central-1.aws.neon.tech', DATABASE_URL: 'postgresql://user:test@ep-prod-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=verify-full', FRONTEND_URL: 'https://oxinvo.com' }).NODE_ENV, 'production');
});
test('keys must be independent random canonical 32-byte base64, never placeholders', () => {
  const input = valid();
  assert.throws(() => validateEnvironment({ ...input, ENCRYPTION_KEY: input.SESSION_SECRET }));
  assert.throws(() => validateEnvironment({ ...input, ENCRYPTION_KEY: Buffer.alloc(32).toString('base64') }));
});
