const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const realRoot = fs.realpathSync(root);
// Fixed generated targets only. Never delete source, env files, migrations or DB data.
for (const relative of ['dist', 'backend/dist', 'backend/.test-build']) {
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep)) throw new Error('Unsafe clean target');
  let current = root;
  for (const segment of relative.split('/')) {
    current = path.join(current, segment);
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error('Refusing symlink/junction clean path');
  }
  if (fs.existsSync(target) && !fs.realpathSync(target).startsWith(realRoot + path.sep)) throw new Error('Clean target escaped workspace');
  fs.rmSync(target, { recursive: true, force: true });
}
console.log('Removed generated build/test outputs only.');
