import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { validateEnvironment } from '../src/config/environment';
import { configureApplication } from '../src/application';
import { DatabaseService } from '../src/database/database.service';

async function createApp(environment: string, databaseReady: () => boolean): Promise<INestApplication> {
  Object.assign(process.env, { NODE_ENV: environment, DATABASE_ENV: environment, NEON_BRANCH_HOST: 'ep-test.eu-central-1.aws.neon.tech', PORT: '4000', DATABASE_URL: 'postgresql://test:test@ep-test-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=verify-full', FRONTEND_URL: environment === 'production' ? 'https://oxinvo.com' : 'http://127.0.0.1:3000', SESSION_SECRET: randomBytes(32).toString('base64'), ENCRYPTION_KEY: randomBytes(32).toString('base64'), LOG_LEVEL: 'silent' });
  const { AppModule } = await import('../src/app.module');
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(ConfigService).useValue(new ConfigService(validateEnvironment(process.env)))
    .overrideProvider(DatabaseService)
    .useValue({ isReady: async () => databaseReady(), system: async () => undefined }).compile();
  const app = module.createNestApplication({ logger: false, bodyParser: false });
  configureApplication(app); await app.listen(0, '127.0.0.1'); return app;
}

test('HTTP boundaries: minimal health, readiness failures, CORS, security headers, request IDs, no CRUD, dev Swagger and throttling', async () => {
  let ready = false; const app = await createApp('development', () => ready);
  const url = await app.getUrl();
  try {
    const health = await fetch(url + '/api/v1/health', { headers: { Origin: 'http://127.0.0.1:3000', 'X-Request-ID': 'attacker-controlled' } });
    assert.equal(health.status, 200); assert.deepEqual(await health.json(), { status: 'ok' });
    assert.equal(health.headers.get('access-control-allow-origin'), 'http://127.0.0.1:3000');
    assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
    assert.ok(health.headers.get('content-security-policy'));
    assert.equal(health.headers.get('x-powered-by'), null);
    assert.match(health.headers.get('x-request-id')!, /^[0-9a-f-]{36}$/);
    const denied = await fetch(url + '/api/v1/health', { headers: { Origin: 'https://attacker.example' } });
    assert.equal(denied.headers.get('access-control-allow-origin'), null);
    const offline = await fetch(url + '/api/v1/health/database');
    assert.equal(offline.status, 503);
    const body = await offline.json() as Record<string, unknown>;
    assert.deepEqual(Object.keys(body).sort(), ['message', 'requestId', 'statusCode']);
    ready = true;
    assert.equal((await fetch(url + '/api/v1/health/database')).status, 200);
    const version = await fetch(url + '/api/v1/version');
    assert.deepEqual(await version.json(), { application: 'OXINVO', version: '0.1.0', apiVersion: '1' });
    for (const route of ['/api/v1/users', '/api/v1/auth/login', '/api/v1/trading']) assert.equal((await fetch(url + route)).status, 404);
    assert.equal((await fetch(url + '/api/v1/admin/users')).status, 401);
    const docs = await fetch(url + '/api/docs-json'); assert.equal(docs.status, 200);
    const specification = await docs.json() as { paths: Record<string, unknown> };
    for (const route of ['/api/v1/health','/api/v1/health/database','/api/v1/version','/api/v1/auth/login','/api/v1/admin/users']) assert.ok(specification.paths[route]);
    const malformed = await fetch(url + '/api/v1/health', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{invalid passwordSecret' });
    assert.equal(malformed.status, 400); assert.ok(malformed.headers.get('x-request-id'));
    assert.ok(!(await malformed.text()).includes('passwordSecret'));
    let limited = false;
    for (let i = 0; i < 245; i++) { const response = await fetch(url + '/api/v1/health'); if (response.status === 429) { limited = true; break; } }
    assert.equal(limited, true);
  } finally { await app.close(); }
});

test('production does not expose Swagger', async () => {
  const app = await createApp('production', () => true);
  try { const url = await app.getUrl(); assert.equal((await fetch(url + '/api/docs')).status, 404); assert.equal((await fetch(url + '/api/docs-json')).status, 404); }
  finally { await app.close(); }
});
