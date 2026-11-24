// Integration tests against ONLY the marked, isolated OXINVO test database.
// All fixture writes roll back. No business data is deleted or truncated.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const dotenv = require('dotenv');
const { Client, Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient, Prisma } = require('../dist/generated/prisma/client');
const { connectionOptions } = require('../src/config/database-connection.cjs');
const root = path.resolve(__dirname, '..');
const env = dotenv.parse(fs.readFileSync(path.join(root, '.env.test.local')));
const quote = value => '"' + value.replace(/"/g, '""') + '"';
const results = [];
const filter = process.env.OXINVO_DB_TEST_FILTER;
let currentTest = 'initialization', lastModel, lastPrivilegeProbe;
async function check(name, work) { if (filter && !name.includes(filter)) return; currentTest = name; await work(); results.push({ name, passed: true }); console.log('PASS ' + name); }
const clientOptions = (url, purpose = 'migration') => ({ ...connectionOptions(url, purpose, 'test', env.NEON_BRANCH_HOST), connectionTimeoutMillis: 15000, statement_timeout: 15000 });

async function main() {
  const direct = new URL(env.DATABASE_URL_UNPOOLED);
  if (env.NODE_ENV !== 'test' || env.DATABASE_ENV !== 'test' || direct.pathname !== '/oxinvo_test' || direct.username !== 'oxinvo_test_migrator') throw new Error('Dedicated test target required');
  const sql = new Client(clientOptions(direct.toString()));
  const prisma = new PrismaClient({ adapter: new PrismaPg({ ...clientOptions(env.DATABASE_URL, 'runtime'), max: 2 }), log: [] });
  await sql.connect();
  try {
    const marker = await sql.query("SELECT shobj_description(oid,'pg_database') AS marker FROM pg_database WHERE datname=current_database()");
    assert.equal(marker.rows[0].marker, 'OXINVO:test:v1');
    await sql.query("SELECT set_config('oxinvo.admin','true',false)"); // Dedicated direct test connection, never a pool.
    const initialSql = fs.readFileSync(path.join(root, 'prisma/migrations/202611240001_initial/migration.sql'), 'utf8') + fs.readFileSync(path.join(root, 'prisma/migrations/202611240003_authentication/migration.sql'), 'utf8');
    const safetySql = fs.readFileSync(path.join(root, 'prisma/migrations/202611240002_safety_constraints/migration.sql'), 'utf8');
    const tables = [...initialSql.matchAll(/CREATE TABLE "([^"]+)"/g)].map(match => match[1]);
    const indexes = [...(initialSql + safetySql).matchAll(/CREATE (?:UNIQUE )?INDEX "([^"]+)"/g)].map(match => match[1]);
    const fks = [...initialSql.matchAll(/ADD CONSTRAINT "([^"]+)" FOREIGN KEY/g)].map(match => match[1]);
    const primaryKeys = [...initialSql.matchAll(/CONSTRAINT "([^"]+)" PRIMARY KEY/g)].map(match => match[1]);
    const checks = [...safetySql.matchAll(/ADD CONSTRAINT "([^"]+)"/g)].map(match => match[1]);
    async function rowCounts() {
      const rows = await sql.query(tables.map(table => `SELECT '${table}'::text AS model,count(*)::int AS count FROM public.${quote(table)}`).join(' UNION ALL '));
      return Object.fromEntries(rows.rows.map(row => [row.model, row.count]));
    }
    const before = await rowCounts();
    await check('catalog: 22 models, every declared index/FK/CHECK and valid indexes', async () => {
      assert.equal(tables.length, 22);
      const actualTables = await sql.query("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename <> '_prisma_migrations'");
      assert.deepEqual(actualTables.rows.map(row => row.tablename).sort(), [...tables].sort());
      const actualIndexes = await sql.query("SELECT c.relname, i.indisvalid, i.indisready FROM pg_index i JOIN pg_class c ON c.oid=i.indexrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public'");
      for (const index of indexes) assert.ok(actualIndexes.rows.some(row => row.relname === index && row.indisvalid && row.indisready));
      const constraints = await sql.query("SELECT conname,contype,convalidated FROM pg_constraint c JOIN pg_namespace n ON n.oid=c.connamespace WHERE n.nspname='public'");
      for (const name of fks) assert.ok(constraints.rows.some(row => row.conname === name && row.contype === 'f' && row.convalidated));
      for (const name of checks) assert.ok(constraints.rows.some(row => row.conname === name && row.contype === 'c' && row.convalidated));
      assert.equal(primaryKeys.length, 22);
      for (const name of primaryKeys) assert.ok(constraints.rows.some(row => row.conname === name && row.contype === 'p' && row.convalidated));
      const history = await sql.query('SELECT migration_name,finished_at,rolled_back_at FROM public."_prisma_migrations" ORDER BY migration_name');
      assert.deepEqual(history.rows.map(row => row.migration_name), ['202611240001_initial', '202611240002_safety_constraints', '202611240003_authentication']);
      assert.ok(history.rows.every(row => row.finished_at && !row.rolled_back_at));
    });
    await check('Prisma create/read: all 22 models, Decimal precision, UTC, PAPER defaults, soft delete; transaction rollback', async () => {
      const passwordHash = await require('argon2').hash(crypto.randomBytes(24).toString('base64url'));
      const suffix = crypto.randomBytes(8).toString('hex');
      const created = [];
      const rollback = new Error('OXINVO_TEST_ROLLBACK');
      try {
        await prisma.$transaction(async tx => {
          await tx.$executeRawUnsafe("SELECT set_config('oxinvo.admin','true',true)");
          async function create(model, data) { lastModel = model; const row = await tx[model].create({ data }); created.push(model); assert.ok(await tx[model].findUnique({ where: model === 'loginThrottle' ? {key:row.key} : { id: row.id } })); return row; }
          const user = await create('user', { username: 'stage4_' + suffix, passwordHash, fullName: 'Rollback-only integration fixture', createdAt: new Date('2026-11-24T17:00:00+04:00') });
          assert.equal(user.createdAt.toISOString(), '2026-11-24T13:00:00.000Z');
          await create('session', { userId: user.id, sessionTokenHash: crypto.randomBytes(32).toString('hex'), expiresAt: new Date(Date.now() + 60000) });
          const plan = await create('subscriptionPlan', { name: 'fixture_' + suffix, description: 'Rollback fixture', durationDays: 30, price: new Prisma.Decimal('0.10000001') });
          await create('userSubscription', { userId: user.id, planId: plan.id, startDate: new Date(), expirationDate: new Date(Date.now() + 86400000) });
          const { EncryptionService } = require('../dist/common/security/encryption.service');
          const { ConfigService } = require('@nestjs/config');
          const encryption = new EncryptionService(new ConfigService(env));
          await create('binanceConnection', { userId: user.id, encryptedApiKey: encryption.encrypt('fake-test-key', user.id + ':key'), encryptedApiSecret: encryption.encrypt('fake-test-secret', user.id + ':secret') });
          await create('telegramConnection', { userId: user.id, telegramChatId: BigInt('987654321012345'), telegramUsername: 'rollback_fixture' });
          await create('telegramConnectionToken', { userId: user.id, tokenHash: crypto.randomBytes(32).toString('hex'), expiresAt: new Date(Date.now() + 60000) });
          const bot = await create('tradingBot', { userId: user.id, name: 'Fixture bot' }); assert.equal(bot.tradingMode, 'PAPER');
          const trade = await create('trade', { userId: user.id, botId: bot.id, symbol: 'BTCUSDT', side: 'BUY', quantity: '0.123456789123456789', entryPrice: '12345.123456789123456789' });
          assert.equal(trade.quantity.toFixed(18), '0.123456789123456789'); assert.equal(trade.entryPrice.toFixed(18), '12345.123456789123456789');
          assert.equal(new Prisma.Decimal('0.1').plus('0.2').toString(), '0.3');
          const order = await create('order', { userId: user.id, botId: bot.id, tradeId: trade.id, clientOrderId: 'fixture_' + suffix, symbol: 'BTCUSDT', side: 'BUY', orderType: 'MARKET', quantity: '0.1' });
          await create('orderFill', { orderId: order.id, userId: user.id, symbol: 'BTCUSDT', quantity: '0.1', price: '12345.1', commission: '0.00000001', commissionAsset: 'USDT', executedAt: new Date() });
          await create('portfolioSnapshot', { userId: user.id, totalBalance: '1000.100000000000000001', availableBalance: '999.1', realizedProfit: '0.1', unrealizedProfit: '-0.1' });
          await create('marketSignal', { symbol: 'BTCUSDT', price: '12345.1', volumeChange: '2.1', momentumScore: '51.1', sentimentScore: '-1.1', opportunityScore: '60', signalType: 'WAIT' });
          await create('aIDecision', { userId: user.id, botId: bot.id, symbol: 'BTCUSDT', provider: 'LOCAL', model: 'fixture_' + suffix, decision: 'WAIT', confidenceScore: '50.5', reasoning: 'Offline test fixture only' });
          await create('aIProvider', { providerName: 'LOCAL', modelName: 'fixture_' + suffix });
          await create('notification', { userId: user.id, type: 'SYSTEM', title: 'Fixture', message: 'Rollback only' });
          await create('notificationPreference', { userId: user.id, notificationType: 'SYSTEM' });
          await create('auditLog', { actorUserId: user.id, targetUserId: user.id, action: 'TEST', resource: 'fixture' });
          await create('systemSetting', { key: 'fixture_' + suffix, value: { test: true } });
          await create('idempotencyRecord', { userId: user.id, scope: 'fixture', key: suffix, requestHash: crypto.randomBytes(32).toString('hex') });
          await create('userSetting', {userId:user.id,key:'fixture',value:{test:true}});
          await create('loginThrottle', {key:crypto.randomBytes(32).toString('hex')});
          const deleted = await tx.user.update({ where: { id: user.id }, data: { status: 'DELETED', deletedAt: new Date() } });
          assert.ok(deleted.deletedAt); assert.equal(await tx.trade.count({ where: { userId: user.id } }), 1);
          assert.equal(created.length, 22);
          throw rollback;
        }, { timeout: 120000, maxWait: 15000 });
      } catch (error) { if (error !== rollback) throw error; }
      assert.equal(created.length, 22);
      assert.deepEqual(await rowCounts(), before);
    });

    await sql.query('BEGIN');
    try {
      const u1 = crypto.randomUUID(), u2 = crypto.randomUUID(), b1 = crypto.randomUUID(), b2 = crypto.randomUUID(), trade = crypto.randomUUID(), order = crypto.randomUUID();
      await sql.query('INSERT INTO "User" (id,username,"passwordHash","fullName","updatedAt") VALUES ($1,$2,$3,$4,now()),($5,$6,$3,$4,now())', [u1, 'sql_' + u1.replaceAll('-', ''), '$argon2id$rollback-only-fixture', 'Rollback fixture', u2, 'sql_' + u2.replaceAll('-', '')]);
      await sql.query('INSERT INTO "TradingBot" (id,"userId",name,"updatedAt") VALUES ($1,$2,$3,now()),($4,$5,$3,now())', [b1, u1, 'Fixture', b2, u2]);
      await sql.query('INSERT INTO "Trade" (id,"userId","botId",symbol,side,quantity,"entryPrice","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,now())', [trade, u1, b1, 'BTCUSDT', 'BUY', '0.1', '100.1']);
      await sql.query('INSERT INTO "Order" (id,"userId","botId","tradeId","clientOrderId",symbol,side,"orderType",quantity,"updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,now())', [order, u1, b1, trade, 'fixture_' + crypto.randomBytes(8).toString('hex'), 'BTCUSDT', 'BUY', 'MARKET', '0.1']);
      async function rejected(query, values, code) {
        await sql.query('SAVEPOINT invalid_fixture'); let actual;
        try { await sql.query(query, values); } catch (error) { actual = error.code; }
        await sql.query('ROLLBACK TO SAVEPOINT invalid_fixture; RELEASE SAVEPOINT invalid_fixture');
        if (actual !== code) console.error(JSON.stringify({ constraintProbe: query.slice(0, 100), expectedSqlState: code, actualSqlState: actual ?? 'QUERY_SUCCEEDED' }));
        assert.equal(actual, code);
      }
      await check('tenant FK protection, bot/trade/symbol consistency and deletion restriction', async () => {
        await rejected('UPDATE "Trade" SET "userId"=$1 WHERE id=$2', [u2, trade], '23503');
        await rejected('UPDATE "Order" SET "botId"=$1,"userId"=$2 WHERE id=$3', [b2, u2, order], '23503');
        await rejected('UPDATE "Order" SET symbol=$1 WHERE id=$2', ['ETHUSDT', order], '23503');
        await rejected('DELETE FROM "User" WHERE id=$1', [u1], '23001');
      });
      await check('all LIVE writes blocked; invalid soft delete, financial values and timestamps rejected', async () => {
        for (const table of ['TradingBot', 'Trade', 'Order']) await rejected(`UPDATE ${quote(table)} SET "tradingMode"='LIVE'`, [], '23514');
        await rejected('INSERT INTO "PortfolioSnapshot" (id,"userId","tradingMode","totalBalance","availableBalance","realizedProfit","unrealizedProfit") VALUES ($1,$2,$3,1,1,0,0)', [crypto.randomUUID(), u1, 'LIVE'], '23514');
        await rejected('INSERT INTO "IdempotencyRecord" (id,"userId","tradingMode",scope,key,"requestHash","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,now())', [crypto.randomUUID(), u1, 'LIVE', 'test', 'live', 'a'.repeat(64)], '23514');
        // CHECKs run before FK validation, so LIVE cannot pass even with no LIVE parent.
        await rejected('INSERT INTO "AIDecision" (id,"userId","botId","tradingMode",symbol,provider,model,decision,"confidenceScore",reasoning) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,50,$9)', [crypto.randomUUID(), u1, b1, 'LIVE', 'BTCUSDT', 'LOCAL', 'fixture', 'WAIT', 'fixture'], '23514');
        await rejected('INSERT INTO "OrderFill" (id,"orderId","userId","tradingMode",symbol,quantity,price,commission,"commissionAsset","executedAt") VALUES ($1,$2,$3,$4,$5,1,1,0,$6,now())', [crypto.randomUUID(), order, u1, 'LIVE', 'BTCUSDT', 'USDT'], '23514');
        await rejected('UPDATE "User" SET status=$1 WHERE id=$2', ['DELETED', u1], '23514');
        await rejected('UPDATE "Trade" SET quantity=-1 WHERE id=$1', [trade], '23514');
        await rejected('INSERT INTO "Session" (id,"userId","sessionTokenHash","expiresAt") VALUES ($1,$2,$3,now()-interval \'1 day\')', [crypto.randomUUID(), u1, 'b'.repeat(64)], '23514');
      });
      await check('unique constraints: usernames, client/exchange IDs, fill deduplication, preferences, active subscriptions and idempotency', async () => {
        await rejected('UPDATE "User" SET username=(SELECT username FROM "User" WHERE id=$1) WHERE id=$2', [u1, u2], '23505');
        await rejected('INSERT INTO "Order" (id,"userId","botId","clientOrderId",symbol,side,"orderType",quantity,"updatedAt") SELECT $1,"userId","botId","clientOrderId",symbol,side,"orderType",quantity,now() FROM "Order" WHERE id=$2', [crypto.randomUUID(), order], '23505');
        await sql.query('UPDATE "Order" SET "exchangeOrderId"=$1 WHERE id=$2', ['test-exchange', order]);
        await rejected('INSERT INTO "Order" (id,"userId","botId","clientOrderId","exchangeOrderId",symbol,side,"orderType",quantity,"updatedAt") SELECT $1,"userId","botId",$2,"exchangeOrderId",symbol,side,"orderType",quantity,now() FROM "Order" WHERE id=$3', [crypto.randomUUID(), 'unique_' + crypto.randomBytes(6).toString('hex'), order], '23505');
        const fill = crypto.randomUUID();
        await sql.query('INSERT INTO "OrderFill" (id,"orderId","userId",symbol,"exchangeTradeId",quantity,price,"commissionAsset","executedAt") VALUES ($1,$2,$3,$4,$5,1,1,$6,now())', [fill, order, u1, 'BTCUSDT', 'fill-fixture', 'USDT']);
        await rejected('INSERT INTO "OrderFill" SELECT $1,"orderId","userId","tradingMode",symbol,"exchangeTradeId",quantity,price,commission,"commissionAsset","executedAt" FROM "OrderFill" WHERE id=$2', [crypto.randomUUID(), fill], '23505');
        await sql.query('INSERT INTO "NotificationPreference" (id,"userId","notificationType") VALUES ($1,$2,$3)', [crypto.randomUUID(), u1, 'SYSTEM']);
        await rejected('INSERT INTO "NotificationPreference" (id,"userId","notificationType") VALUES ($1,$2,$3)', [crypto.randomUUID(), u1, 'SYSTEM'], '23505');
        const plan = crypto.randomUUID();
        await sql.query('INSERT INTO "SubscriptionPlan" (id,name,description,"durationDays",price) VALUES ($1,$2,$3,30,1)', [plan, 'plan_' + plan, 'Fixture']);
        await sql.query('INSERT INTO "UserSubscription" (id,"userId","planId","startDate","expirationDate","updatedAt") VALUES ($1,$2,$3,now(),now()+interval \'1 day\',now())', [crypto.randomUUID(), u1, plan]);
        await rejected('INSERT INTO "UserSubscription" (id,"userId","planId","startDate","expirationDate","updatedAt") VALUES ($1,$2,$3,now(),now()+interval \'1 day\',now())', [crypto.randomUUID(), u1, plan], '23505');
        await sql.query('INSERT INTO "IdempotencyRecord" (id,"userId",scope,key,"requestHash","updatedAt") VALUES ($1,$2,$3,$4,$5,now())', [crypto.randomUUID(), u1, 'fixture', 'dedup', 'c'.repeat(64)]);
        await rejected('INSERT INTO "IdempotencyRecord" (id,"userId",scope,key,"requestHash","updatedAt") VALUES ($1,$2,$3,$4,$5,now())', [crypto.randomUUID(), u1, 'fixture', 'dedup', 'd'.repeat(64)], '23505');
        await sql.query('INSERT INTO "IdempotencyRecord" (id,"userId",scope,key,"requestHash","updatedAt") VALUES ($1,$2,$3,$4,$5,now())', [crypto.randomUUID(), u2, 'fixture', 'dedup', 'c'.repeat(64)]);
      });
      await check('PostgreSQL exact NUMERIC and UTC instant under non-UTC session timezone', async () => {
        await sql.query("SET LOCAL TIME ZONE 'Asia/Baku'");
        const data = await sql.query("SELECT (0.1::numeric + 0.2::numeric)::text AS exact, '2026-11-24 17:00:00+04'::timestamptz AS instant");
        assert.equal(data.rows[0].exact, '0.3'); assert.equal(data.rows[0].instant.toISOString(), '2026-11-24T13:00:00.000Z');
      });
    } finally { await sql.query('ROLLBACK'); }
    await check('rollback leaves every model row count unchanged', async () => assert.deepEqual(await rowCounts(), before));
    await check('runtime least privilege and cross-database isolation', async () => {
      lastPrivilegeProbe = 'role attributes';
      const role = new URL(env.DATABASE_URL).username;
      const data = await sql.query('SELECT rolsuper,rolcreatedb,rolcreaterole,rolbypassrls,rolreplication FROM pg_roles WHERE rolname=$1', [role]);
      assert.ok(Object.values(data.rows[0]).every(value => value === false));
      const runtime = new Client(clientOptions(env.DATABASE_URL, 'runtime'));
      try { await runtime.connect(); lastPrivilegeProbe = 'migration table'; await assert.rejects(runtime.query('SELECT * FROM "_prisma_migrations"'), { code: '42501' }); lastPrivilegeProbe = 'DDL'; await runtime.query('BEGIN'); await assert.rejects(runtime.query('CREATE TABLE runtime_must_not_create(id int)'), { code: '42501' }); }
      finally { await runtime.query('ROLLBACK').catch(() => {}); await runtime.end().catch(() => {}); }
      lastPrivilegeProbe = 'cross-database';
      assert.equal((await sql.query("SELECT has_database_privilege($1,'oxinvo_development','CONNECT') AS allowed", [role])).rows[0].allowed, false);
      const wrong = new URL(env.DATABASE_URL); wrong.pathname = '/oxinvo_development';
      const cross = new Client(clientOptions(wrong.toString(), 'runtime'));
      // Poolers may wrap the server's permission error in a connection-level SQLSTATE.
      try { await assert.rejects(async () => { await cross.connect(); await cross.query('SELECT 1'); }); } finally { await cross.end().catch(() => {}); }
    });
    await check('connection pool max=2, queueing, broken-connection discard and recovery', async () => {
      const pool = new Pool({ ...clientOptions(env.DATABASE_URL, 'runtime'), max: 2, idleTimeoutMillis: 1000 });
      pool.on('error', () => {});
      try {
        await Promise.all(Array.from({ length: 6 }, () => pool.query('SELECT pg_sleep(0.03), 1 AS ok')));
        assert.ok(pool.totalCount <= 2);
        const leased = await pool.connect(); leased.on('error', () => {});
        leased.connection.stream.destroy(); leased.release(true);
        assert.equal((await pool.query('SELECT 1 AS ok')).rows[0].ok, 1);
      } finally { await pool.end(); }
    });
    const summary = { passed: results.length, failed: 0, filtered: Boolean(filter), tests: results, modelCount: tables.length, primaryKeyCount: primaryKeys.length, indexCount: indexes.length, foreignKeyCount: fks.length, checkConstraintCount: checks.length, fixtureRowsPersisted: 0, scope: 'isolated oxinvo_test database; transactional rollback', outageScope: 'client-side broken socket recovery; Neon server suspension not triggered' };
    fs.mkdirSync(path.resolve(root, '../.verification'), { recursive: true });
    fs.writeFileSync(path.resolve(root, '../.verification/stage4-database-tests.json'), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary));
  } finally { await prisma.$disconnect(); await sql.end().catch(() => {}); }
}
main().catch(error => { console.error(JSON.stringify({ phase: 'real-database-tests', code: error.code ?? 'ASSERTION_FAILED', currentTest, lastModel, lastPrivilegeProbe, expectedCode: error.expected?.code, actualCode: error.actual?.code, completed: results.length })); process.exitCode = 1; });
