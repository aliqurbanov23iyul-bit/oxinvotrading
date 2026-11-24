const { spawn } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const npmCli = process.env.npm_execpath;
if (!npmCli) { console.error('Run this helper through npm scripts.'); process.exit(1); }
const mode = process.argv[2];
const jobs = {
  dev: [['run', 'dev:frontend'], ['run', 'dev', '--prefix', 'backend']],
  build: [['run', 'build:frontend'], ['run', 'build', '--prefix', 'backend']],
  test: [['run', 'test:frontend'], ['run', 'test', '--prefix', 'backend']],
};
if (!jobs[mode]) process.exit(1);
const children = new Set(); let stopping = false;
function stop() {
  if (stopping) return; stopping = true;
  for (const child of children) {
    if (process.platform === 'win32' && child.pid) spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { windowsHide: true, stdio: 'ignore' });
    else child.kill('SIGTERM');
  }
}
for (const args of jobs[mode]) {
  const child = spawn(process.execPath, [npmCli, ...args], { cwd: root, stdio: 'inherit', windowsHide: true });
  children.add(child);
  child.on('error', () => { process.exitCode = 1; stop(); });
  child.on('exit', code => { children.delete(child); if (code) { process.exitCode = code; stop(); } else if (mode === 'dev') stop(); });
}
process.on('SIGINT', stop); process.on('SIGTERM', stop);
