import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from '../src/common/security/encryption.service';
const service = () => new EncryptionService(new ConfigService({ ENCRYPTION_KEY: randomBytes(32).toString('base64') }));

test('AES-256-GCM roundtrip preserves Unicode and uses different nonces', () => {
  const encryption = service();
  const plaintext = 'məxfi Binance/API credential 🔐';
  const context = 'binance:user-1:connection-1:apiSecret';
  const first = encryption.encrypt(plaintext, context);
  const second = encryption.encrypt(plaintext, context);
  assert.notEqual(first, second);
  assert.equal(encryption.decrypt(first, context), plaintext);
  assert.ok(!first.includes(plaintext));
});
test('rejects cross-tenant ciphertext substitution and wrong keys', () => {
  const encryption = service();
  const envelope = encryption.encrypt('test-only-secret', 'binance:user-1:secret');
  assert.throws(() => encryption.decrypt(envelope, 'binance:user-2:secret'), /Unable to decrypt credential/);
  assert.throws(() => service().decrypt(envelope, 'binance:user-1:secret'), /Unable to decrypt credential/);
});
test('rejects tampered ciphertext, nonce, tag, version and malformed envelope', () => {
  const encryption = service(); const context = 'resource:owner:field';
  const envelope = encryption.encrypt('test credential', context);
  for (const index of [1, 2, 3]) {
    const parts = envelope.split('.'); const bytes = Buffer.from(parts[index]!, 'base64url'); bytes[0] = bytes[0]! ^ 1; parts[index] = bytes.toString('base64url');
    assert.throws(() => encryption.decrypt(parts.join('.'), context));
  }
  for (const invalid of ['', 'v2.' + envelope.slice(3), 'v1.a.b.c', envelope + '.extra']) assert.throws(() => encryption.decrypt(invalid, context));
  assert.throws(() => encryption.encrypt('secret', ''));
});
