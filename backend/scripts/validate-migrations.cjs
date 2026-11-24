const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const cli = require.resolve('prisma/build/index.js');
const result = spawnSync(process.execPath, [cli, 'migrate', 'diff', '--from-empty', '--to-schema', 'prisma/schema.prisma', '--script'], { cwd: root, encoding: 'utf8', env: process.env });
if (result.status !== 0) {
  console.error('Offline migration generation failed. Check Prisma engine availability and schema validation.');
  process.exit(1);
}
const migrationRoot=path.join(root,'prisma/migrations');
const files=fs.readdirSync(migrationRoot).filter(name=>/^\d+_/.test(name)).map(name=>path.join(migrationRoot,name,'migration.sql'));
const combined=files.map(file=>fs.readFileSync(file,'utf8')).join('\n');
const tables=[...result.stdout.matchAll(/CREATE TABLE "([^"]+)"/g)].map(match=>match[1]);
if(tables.some(table=>!combined.includes('CREATE TABLE "'+table+'"'))){console.error('A schema model is missing from migration SQL.');process.exit(1);}
console.log('Offline schema generation succeeded; all '+tables.length+' models are represented in '+files.length+' migrations.');
console.log('This is an offline structural check, not proof of applied database equivalence. Run db:status and test:database against the isolated database.');
