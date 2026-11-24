const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const target = path.join(root, '.env');
const example = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
const content = example.replace('REPLACE_WITH_RANDOM_32_BYTE_BASE64', randomBytes(32).toString('base64'))
  .replace('REPLACE_WITH_RANDOM_32_BYTE_BASE64', randomBytes(32).toString('base64'));
try {
  fs.writeFileSync(target, content, { flag: 'wx', mode: 0o600 });
  console.log('Created backend/.env with independent random local keys. Configure DATABASE_URL. No secrets printed.');
} catch (error) {
  if (error.code === 'EEXIST') console.log('backend/.env already exists; preserved without changes.');
  else { console.error('Unable to create backend/.env'); process.exitCode = 1; }
}
