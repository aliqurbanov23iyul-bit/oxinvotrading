const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const dotenv = require('dotenv');
const root = path.resolve(__dirname, '..');
const probe = path.join(root, '.verification', 'git-ignore-probe');
fs.mkdirSync(probe, { recursive: true });
if (spawnSync('git', ['init', '--quiet', probe], { encoding: 'utf8' }).status !== 0) throw new Error('Git is required for ignore validation');
const ignore = paths => {
  const result = spawnSync('git', ['-C', probe, '-c', 'core.excludesFile=' + path.join(root, '.gitignore'), 'check-ignore', '--no-index', '--stdin'], { input: paths.join('\n') + '\n', encoding: 'utf8' });
  if (![0, 1].includes(result.status)) throw new Error('Unable to validate ignore rules');
  return new Set(result.stdout.trim().split(/\r?\n/).filter(Boolean));
};
const privatePaths = ['.env', '.env.local', '.env.production', 'backend/.env', 'backend/.env.production.local', 'backend/.env.test.local', 'backend/.env.neon-provision.local', '.vercel/project.json', '.verification/runtime-results.json', 'server.key', 'database.dump', 'backend/src/generated/prisma/client.ts'];
const publicPaths = ['.env.example', '.env.production.example', 'backend/.env.example', 'backend/.env.production.example', 'backend/prisma/schema.prisma', 'vercel.json'];
const result = ignore([...privatePaths, ...publicPaths]);
if (privatePaths.some(file => !result.has(file)) || publicPaths.some(file => result.has(file))) throw new Error('Repository ignore policy failed');
const secrets = [];
for (const folder of [root, path.join(root, 'backend')]) {
  if (!fs.existsSync(folder)) continue;
  for (const name of fs.readdirSync(folder).filter(name => name.startsWith('.env') && !name.endsWith('.example'))) {
    const file = path.join(folder, name); if (!fs.statSync(file).isFile()) continue;
    for (const [key, value] of Object.entries(dotenv.parse(fs.readFileSync(file)))) if (/(?:SECRET|TOKEN|PASSWORD|API_KEY|ENCRYPTION_KEY|DATABASE_URL|POSTGRES_URL)/i.test(key) && value.length >= 8 && !/CHANGE_ME|REPLACE_WITH/.test(value)) secrets.push(Buffer.from(value));
  }
}
const files = [];
function collect(folder, prefix = '') {
  for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
    if (['.git', '.verification', '.aistudio', 'node_modules', 'dist', '.test-build', 'generated'].includes(item.name)) continue;
    const relative = prefix + item.name;
    if (item.isSymbolicLink()) continue;
    if (item.isDirectory()) collect(path.join(folder, item.name), relative + '/'); else files.push(relative);
  }
}
collect(root);
const ignored = ignore(files); let checked = 0;
for (const file of files) {
  if (ignored.has(file)) continue;
  const data = fs.readFileSync(path.join(root, file)); checked++;
  if (secrets.some(secret => data.includes(secret)) || /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(data.toString('utf8'))) {
    console.error('Potential local secret in repository candidate file:', file); process.exit(1);
  }
}
console.log(`Ignore policy and known-local-secret checks passed (${checked} candidate files).`);
console.log(fs.existsSync(path.join(root, '.git')) ? 'Existing Git history is outside this file scan.' : 'Project root is not a Git repository; no tracked-file or remote-history claim is made.');
