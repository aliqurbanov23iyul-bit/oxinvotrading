const { spawnSync } = require('node:child_process');
const path = require('node:path');
function sanitizeOutput(text, env) {
  let safe = String(text ?? '').replace(/postgres(?:ql)?:\/\/[^\s"'<>]+/gi, '[REDACTED_DATABASE_URL]');
  const secrets = [];
  for (const [name, value] of Object.entries(env)) {
    if (typeof value !== 'string') continue;
    if (/(SECRET|TOKEN|PASSWORD|API_KEY|ENCRYPTION_KEY)/i.test(name) && value.length >= 8) secrets.push(value);
    if (/DATABASE_URL/.test(name)) { try { const url = new URL(value); if (url.password) secrets.push(url.password, decodeURIComponent(url.password)); } catch {} }
  }
  for (const secret of secrets.sort((a, b) => b.length - a.length)) safe = safe.split(secret).join('[REDACTED]');
  return safe;
}
function runPrisma(args, overrides = {}) {
  const env = { ...process.env, ...overrides };
  const result = spawnSync(process.execPath, [require.resolve('prisma/build/index.js'), ...args], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8', env });
  if (result.stdout) process.stdout.write(sanitizeOutput(result.stdout, env));
  if (result.stderr) process.stderr.write(sanitizeOutput(result.stderr, env));
  return result.status ?? 1;
}
module.exports = { runPrisma, sanitizeOutput };
if (require.main === module) { require('./load-env.cjs'); process.exitCode = runPrisma(process.argv.slice(2)); }
