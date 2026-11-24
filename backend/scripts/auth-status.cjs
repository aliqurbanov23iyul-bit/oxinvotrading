// Safe metadata only; never print passwords, hashes, URLs, cookies or secrets.
require('./load-env.cjs');
const {Client}=require('pg');
const {connectionOptions}=require('../src/config/database-connection.cjs');
async function main(){
 const client=new Client(connectionOptions(process.env.DATABASE_URL,'runtime',process.env.NODE_ENV,process.env.NEON_BRANCH_HOST));
 try{
  await client.connect();await client.query('BEGIN');await client.query("SELECT set_config('oxinvo.admin','true',true)");
  const users=await client.query(`SELECT count(*)::int AS accounts,count(*) FILTER(WHERE role='SUPER_ADMIN' AND status='ACTIVE')::int AS active_super_admins,count(*) FILTER(WHERE username<>'oxinvo.admin')::int AS other_accounts FROM "User"`);
  const admin=await client.query(`SELECT username,role,status,"mustChangePassword",("passwordHash" LIKE '$argon2id$%') AS argon2id FROM "User" WHERE username='oxinvo.admin'`);
  const rls=await client.query("SELECT count(*)::int AS forced_rls_tables FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relrowsecurity AND c.relforcerowsecurity");
  await client.query('ROLLBACK');console.log(JSON.stringify({environment:process.env.DATABASE_ENV,...users.rows[0],administrator:admin.rows[0]??null,...rls.rows[0]}));
 }finally{await client.end();}
}
main().catch(()=>{console.error('Account metadata check failed; details omitted.');process.exitCode=1;});
