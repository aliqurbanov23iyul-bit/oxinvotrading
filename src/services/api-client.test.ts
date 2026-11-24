import test from 'node:test';
import assert from 'node:assert/strict';
import { createApiClient, ApiError } from './api-client';
import { resolveApiBaseUrl } from '../config/public-config';

test('API environment boundaries reject credentials, insecure production and external origins', () => {
  assert.equal(resolveApiBaseUrl(undefined, true), '/api/v1');
  assert.equal(resolveApiBaseUrl(undefined, false), 'https://api.oxinvo.com/api/v1');
  for (const value of ['/api/v1', 'http://api.oxinvo.com/api/v1', 'https://user:secret@api.oxinvo.com/api/v1', 'https://attacker.example/api/v1', 'https://api.oxinvo.com/api/v1?token=secret']) assert.throws(() => resolveApiBaseUrl(value, false));
});

test('API client sends cookies, disables redirects, propagates cancellation and exposes safe errors', async () => {
  let seen: RequestInit | undefined;
  const client = createApiClient({ baseUrl: 'https://api.oxinvo.com/api/v1', fetch: (async (url, init) => {
    assert.equal(url, 'https://api.oxinvo.com/api/v1/health'); seen = init;
    return new Response(JSON.stringify({ secret: 'must-not-be-in-error' }), { status: 503, headers: { 'Content-Type': 'application/json', 'X-Request-ID': 'test-request' } });
  }) as typeof fetch });
  await assert.rejects(client.get('/health'), error => error instanceof ApiError && error.status === 503 && error.requestId === 'test-request' && !error.message.includes('must-not-be-in-error'));
  assert.equal(seen?.credentials, 'include'); assert.equal(seen?.redirect, 'error');
  const controller = new AbortController(); controller.abort();
  const aborting = createApiClient({ baseUrl: '/api/v1', fetch: (async (_url, init) => { assert.equal(init?.signal?.aborted, true); throw new DOMException('Aborted', 'AbortError'); }) as typeof fetch });
  await assert.rejects(aborting.get('/health', { signal: controller.signal }));
});

test('mutations fail closed without CSRF token and unsafe paths cannot redirect credentials', async () => {
  let calls = 0;
  const client = createApiClient({ baseUrl: '/api/v1', fetch: (async () => { calls++; return new Response(null, { status: 204 }); }) as typeof fetch });
  await assert.rejects(client.post('/orders', { body: {} }), /CSRF/);
  for (const path of ['https://attacker.example', '//attacker.example', '/../admin', '/%2e%2e/admin']) await assert.rejects(client.get(path));
  assert.equal(calls, 0);
  const protectedClient = createApiClient({ baseUrl: '/api/v1', csrfToken: () => 'in-memory-test-csrf', fetch: (async (_url, init) => {
    assert.equal((init?.headers as Record<string, string>)['X-CSRF-Token'], 'in-memory-test-csrf');
    return new Response(null, { status: 204 });
  }) as typeof fetch });
  assert.equal(await protectedClient.post('/future-endpoint'), undefined);
});
