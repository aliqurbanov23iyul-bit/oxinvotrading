const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const root = path.resolve(__dirname, '..');
const candidates = [];
function addValues(values) {
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== 'string' || !/(?:SECRET|TOKEN|PASSWORD|API_KEY|ENCRYPTION_KEY|DATABASE_URL|POSTGRES.*URL)/i.test(key) || value.length < 8 || /CHANGE_ME|REPLACE_WITH|MY_.*_KEY/.test(value)) continue;
    for (const encoded of [value, encodeURIComponent(value), JSON.stringify(value).slice(1, -1)]) candidates.push(Buffer.from(encoded));
  }
}
addValues(process.env);
for (const folder of [root, path.join(root, 'backend')]) {
  if (!fs.existsSync(folder)) continue;
  for (const name of fs.readdirSync(folder).filter(name => name.startsWith('.env') && !name.endsWith('.example'))) {
    const file = path.join(folder, name);
    if (!fs.statSync(file).isFile()) continue;
    addValues(dotenv.parse(fs.readFileSync(file)));
  }
}
let checked = 0;
function scan(folder) {
  for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, item.name);
    if (item.isSymbolicLink()) throw new Error('Unexpected symlink in frontend output');
    if (item.isDirectory()) { scan(file); continue; }
    const data = fs.readFileSync(file); checked++;
    if (candidates.some(secret => data.includes(secret)) || /postgres(?:ql)?:\/\/|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(data.toString('utf8'))) {
      console.error('Frontend secret scan failed. Review output file:', path.relative(root, file));
      process.exit(1);
    }
  }
}
scan(path.join(root, 'dist'));
console.log(`Frontend output scan passed (${checked} files); no known local secret values or PostgreSQL URLs found. This is not a full secret-history audit.`);
