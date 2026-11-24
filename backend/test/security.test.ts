import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import { PasswordService } from '../src/common/security/password.service';
import { createStructuredLogger, redact } from '../src/common/logging/structured-logger';
import { requireTenantScope } from '../src/common/security/tenant-scope';

test('Argon2id hashes use independent salts and verify only the correct password', async () => {
  const passwords = new PasswordService();
  const first = await passwords.hash('Local test password !23');
  const second = await passwords.hash('Local test password !23');
  assert.match(first, /^\$argon2id\$/); assert.notEqual(first, second);
  assert.equal(await passwords.verify(first, 'Local test password !23'), true);
  assert.equal(await passwords.verify(first, 'incorrect password'), false);
  assert.equal(await passwords.verify('malformed', 'anything'), false);
  await assert.rejects(passwords.hash('short'));
});
test('logging redacts nested credentials and strips arbitrary Error messages', () => {
  const value = { username: 'visible', nested: [{ encryptedApiSecret: 'secretA', session_token: 'secretB' }], error: new Error('secretC'), SESSION_SECRET: 'secretD', passwordHash: 'secretE' };
  const sanitized = JSON.stringify(redact(value));
  assert.ok(sanitized.includes('visible'));
  for (const secret of ['secretA', 'secretB', 'secretC', 'secretD', 'secretE']) assert.ok(!sanitized.includes(secret));
  let log = '';
  createStructuredLogger('info', { write: chunk => { log += chunk; } }).info({ password: 'secretF', sessionToken: 'secretG' });
  assert.ok(!log.includes('secretF')); assert.ok(!log.includes('secretG'));
});
test('tenant filter requires a nonempty valid identity and is immutable', () => {
  assert.throws(() => requireTenantScope({ userId: '' }));
  const scope = requireTenantScope({ userId: '61b2b0ae-a89a-42d8-884a-32b0d54f0071' });
  assert.equal(Object.isFrozen(scope), true);
});
