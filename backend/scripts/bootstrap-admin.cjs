if (!process.stdout.isTTY || !process.stdin.isTTY) {
  console.error('Bootstrap requires a local interactive terminal. Credentials are never written to redirected output.'); process.exit(1);
}
require('./load-env.cjs');
const { PrismaClient } = require('../dist/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { connectionOptions } = require('../src/config/database-connection.cjs');
const { bootstrapSuperAdmin } = require('../dist/auth/bootstrap');
async function main() {
  if (process.env.DATABASE_ENV !== 'development' || new URL(process.env.DATABASE_URL).pathname !== '/oxinvo_development') throw new Error('Bootstrap development target required');
  const client = new PrismaClient({ adapter: new PrismaPg(connectionOptions(process.env.DATABASE_URL, 'runtime', process.env.NODE_ENV, process.env.NEON_BRANCH_HOST)), log: [] });
  try {
    const result = await bootstrapSuperAdmin(client);
    if (!result.created) console.log('SUPER_ADMIN already exists. No account or password was changed.');
    else {
      console.clear();
      console.log('OXINVO — one-time SUPER_ADMIN credentials\n');
      console.log('Local login: http://127.0.0.1:3000');
      console.log('Username: ' + result.username);
      console.log('Initial password: ' + result.password);
      console.log('\nChange this password after the first login. It is not saved as plaintext and cannot be displayed again.');
    }
  } finally { await client.$disconnect(); }
  const terminal = require('node:readline').createInterface({ input: process.stdin, output: process.stdout });
  await new Promise(resolve => terminal.question('\nPress Enter when you have copied the credentials to close. ', resolve)); terminal.close();
}
main().catch(() => { console.error('Bootstrap failed. No credential details logged.'); process.exitCode = 1; });
