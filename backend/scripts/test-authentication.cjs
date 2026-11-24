const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
require('reflect-metadata');
const env = require('dotenv').parse(fs.readFileSync(path.resolve(__dirname, '../.env.test.local')));
if (env.DATABASE_ENV !== 'test' || new URL(env.DATABASE_URL).pathname !== '/oxinvo_test') throw new Error('Isolated test database required');
Object.assign(process.env, env, { PORT: '4000', LOG_LEVEL: 'silent' });
const { PrismaClient } = require('../dist/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { connectionOptions } = require('../src/config/database-connection.cjs');
const { bootstrapSuperAdmin } = require('../dist/auth/bootstrap');
const { generatePassword } = require('../dist/auth/credentials');
const { PasswordService } = require('../dist/common/security/password.service');
const passwordService = new PasswordService();
const client = new PrismaClient({ adapter: new PrismaPg({ ...connectionOptions(env.DATABASE_URL,'runtime','test',env.NEON_BRANCH_HOST), max: 5 }), log: [] });
const results=[]; let phase='setup', lastHttp;
async function check(name, work) { phase=name; await work(); results.push({name,passed:true}); console.log('PASS '+name); }
async function system(work) { return client.$transaction(async tx=>{await tx.$executeRawUnsafe("SELECT set_config('oxinvo.admin','true',true)"); return work(tx);},{timeout:60000}); }
class BrowserClient {
 constructor(){this.cookies=new Map();this.csrf='';this.sessionSetCookie='';}
 async request(method,route,body,opts={}){
  if(method!=='GET'&&!opts.noCsrf)await this.request('GET','/auth/csrf');
  const headers={Cookie:[...this.cookies].map(([k,v])=>k+'='+v).join(';'),Origin:opts.origin??'http://127.0.0.1:3000'};
  if(body!==undefined)headers['Content-Type']='application/json';if(method!=='GET'&&!opts.noCsrf)headers['X-CSRF-Token']=opts.csrfOverride??this.csrf;
  const response=await fetch('http://127.0.0.1:4000/api/v1'+route,{method,headers,body:body===undefined?undefined:JSON.stringify(body),redirect:'manual'});
  lastHttp={method,route:route.split('?')[0],status:response.status};
  for(const value of response.headers.getSetCookie()){const [pair]=value.split(';'),at=pair.indexOf('='),name=pair.slice(0,at),cookie=pair.slice(at+1);if(value.includes('Max-Age=0'))this.cookies.delete(name);else this.cookies.set(name,cookie);if(name==='oxinvo_session')this.sessionSetCookie=value;}
  let data;try{data=await response.json();}catch{}
  if(data?.csrfToken)this.csrf=data.csrfToken;
  return {status:response.status,data,headers:response.headers};
 }
 login(username,password,rememberMe=true){return this.request('POST','/auth/login',{username,password,rememberMe});}
}
async function main(){
 const {NestFactory}=require('@nestjs/core');const {AppModule}=require('../dist/app.module');const {configureApplication}=require('../dist/application');
 let app;
 try {
  let initial;await check('bootstrap is one-time, Argon2id only and >=20 character generated password',async()=>{
   initial=await bootstrapSuperAdmin(client);
   const before=await system(tx=>tx.user.findUnique({where:{username:'oxinvo.admin'}}));
   assert.match(before.passwordHash,/^\$argon2id\$/);const again=await bootstrapSuperAdmin(client);assert.equal(again.created,false);
   assert.equal((await system(tx=>tx.user.findUnique({where:{username:'oxinvo.admin'}}))).passwordHash,before.passwordHash);
   if(initial.created){assert.ok(initial.password.length>=20);for(const pattern of [/[a-z]/,/[A-Z]/,/\d/,/[^A-Za-z0-9]/])assert.match(initial.password,pattern);}
  });
  const adminPassword=generatePassword(),adminNext=generatePassword();let superId;
  await system(async tx=>{const row=await tx.user.update({where:{username:'oxinvo.admin'},data:{passwordHash:await passwordService.hash(adminPassword),mustChangePassword:true,status:'ACTIVE',preferredLanguage:'EN'},select:{id:true}});superId=row.id;await tx.session.updateMany({where:{userId:superId},data:{revokedAt:new Date()}});await tx.loginThrottle.deleteMany({});});
  app=await NestFactory.create(AppModule,{logger:false,bodyParser:false,abortOnError:false});configureApplication(app);await app.listen(4000,'127.0.0.1');
  if(process.env.OXINVO_AUTH_BROWSER_ONLY==='true'){
   await system(tx=>tx.user.update({where:{id:superId},data:{passwordHash:undefined,mustChangePassword:false}}));
   await require('./test-auth-browser.cjs')({adminUsername:'oxinvo.admin',adminPassword,suffix:crypto.randomBytes(6).toString('hex'),generatePassword,fs});
   console.log('PASS isolated browser authentication checks');return;
  }
  const anonymous=new BrowserClient(),admin=new BrowserClient();
  await check('CSRF: missing token, forged origin, forged token and unauthenticated admin access rejected',async()=>{
   assert.equal((await anonymous.request('POST','/auth/login',{username:'oxinvo.admin',password:adminPassword},{noCsrf:true})).status,403);
   assert.equal((await anonymous.request('GET','/admin/users')).status,401);
   assert.equal((await anonymous.request('POST','/auth/login',{username:'oxinvo.admin',password:adminPassword},{csrfOverride:'forged'})).status,403);
   assert.equal((await anonymous.request('POST','/auth/login',{username:'oxinvo.admin',password:adminPassword},{origin:'https://attacker.example'})).status,403);
  });
  await check('generic invalid credentials; correct login and forced first password change',async()=>{
   const bad=await admin.login('oxinvo.admin',generatePassword());assert.equal(bad.status,401);
   const missing=await anonymous.login('unknown_'+crypto.randomBytes(6).toString('hex'),generatePassword());assert.equal(missing.status,401);assert.equal(missing.data.message,bad.data.message);
   assert.equal((await admin.login('oxinvo.admin',adminPassword)).status,200);assert.equal((await admin.request('GET','/admin/users')).status,403);
   assert.equal((await admin.request('POST','/auth/change-password',{currentPassword:adminPassword,newPassword:adminNext})).status,200);
   assert.equal((await admin.request('GET','/admin/users')).status,200);assert.equal((await admin.request('GET','/users/me/subscription')).data.subscription,null);assert.ok((await admin.request('GET','/admin/subscription-plans')).data.length);
  });
  await check('cookie flags, hashed session token, session persistence and Remember me',async()=>{
   assert.match(admin.sessionSetCookie,/HttpOnly/);assert.match(admin.sessionSetCookie,/SameSite=Lax/);assert.match(admin.sessionSetCookie,/Max-Age=/);assert.ok(!/Domain=/.test(admin.sessionSetCookie));
   assert.equal((await admin.request('GET','/auth/me')).data.user.id,superId);
   const session=await system(tx=>tx.session.findFirst({where:{userId:superId,revokedAt:null}}));assert.equal(session.sessionTokenHash.length,64);assert.notEqual(session.sessionTokenHash,admin.cookies.get('oxinvo_session'));
   const temporary=new BrowserClient();assert.equal((await temporary.login('oxinvo.admin',adminNext,false)).status,200);assert.ok(!temporary.sessionSetCookie.includes('Max-Age='));assert.ok(!temporary.sessionSetCookie.includes('Expires='));
   assert.equal((await temporary.request('POST','/auth/logout')).status,200);assert.equal((await temporary.request('GET','/auth/me')).status,401);
  });
  const plans=(await admin.request('GET','/admin/subscription-plans')).data;assert.ok(plans.length);
  const suffix=crypto.randomBytes(6).toString('hex');let manager,user1,user2;const managerClient=new BrowserClient(),first=new BrowserClient(),second=new BrowserClient();const managerPassword=generatePassword(),firstPassword=generatePassword(),secondPassword=generatePassword();
  async function create(c,username,role='USER'){const result=await c.request('POST','/admin/users',{username,role,planId:plans[0].id,durationDays:30,preferredLanguage:'EN'});assert.equal(result.status,201);assert.ok(result.data.generatedPassword.length>=20);return result.data;}
  async function firstLogin(c,row,next){assert.equal((await c.login(row.user.username,row.generatedPassword)).status,200);assert.equal((await c.request('POST','/auth/change-password',{currentPassword:row.generatedPassword,newPassword:next})).status,200);}
  await check('SUPER_ADMIN creates ADMIN; ADMIN creates USER with one-time generated credentials',async()=>{
   manager=await create(admin,'manager_'+suffix,'ADMIN');await firstLogin(managerClient,manager,managerPassword);
   user1=await create(managerClient,'first_'+suffix);user2=await create(managerClient,'second_'+suffix);await firstLogin(first,user1,firstPassword);await firstLogin(second,user2,secondPassword);
   const detail=await managerClient.request('GET','/admin/users/'+user1.user.id);assert.equal(detail.status,200);const serialized=JSON.stringify(detail.data);for(const field of ['passwordHash','generatedPassword','encryptedApiSecret','sessionTokenHash'])assert.ok(!serialized.includes(field));
   const list=await managerClient.request('GET','/admin/users?search='+suffix+'&pageSize=1&page=1');assert.equal(list.status,200);assert.equal(list.data.items.length,1);assert.ok(list.data.total>=3);
  });
  await check('new USER has real zero/empty state and no exchange integration',async()=>{
   const result=await first.request('GET','/users/me/overview');assert.equal(result.status,200);assert.equal(result.data.totalBalance,'0');assert.equal(result.data.totalTrades,0);assert.equal(result.data.botStatus,'STOPPED');assert.equal(result.data.tradingMode,'PAPER');assert.equal(result.data.tradingAvailable,false);
   assert.deepEqual((await first.request('GET','/users/me/trades')).data,[]);assert.equal((await first.request('GET','/users/me/binance')).data.integrated,false);
  });
  await check('RBAC: USER cannot administer; ADMIN cannot edit SUPER_ADMIN or self-promote',async()=>{
   assert.equal((await first.request('GET','/admin/users')).status,403);
   assert.equal((await managerClient.request('PATCH','/admin/users/'+superId,{role:'USER'})).status,403);
   assert.equal((await managerClient.request('PATCH','/admin/users/'+manager.user.id,{role:'SUPER_ADMIN'})).status,403);
   assert.equal((await first.request('PATCH','/users/me',{role:'SUPER_ADMIN',userId:superId})).status,400);
   assert.equal((await managerClient.request('GET','/admin/audit-logs')).status,403);
  });
  let trade1,trade2,note2;
  await system(async tx=>{for(const [user,target]of [[user1,1],[user2,2]]){const bot=await tx.tradingBot.create({data:{userId:user.user.id,name:'Auth test fixture'}});const trade=await tx.trade.create({data:{userId:user.user.id,botId:bot.id,symbol:'BTCUSDT',side:'BUY',quantity:'0.1',entryPrice:'1'}});if(target===1)trade1=trade.id;else trade2=trade.id;}note2=(await tx.notification.create({data:{userId:user2.user.id,type:'SYSTEM',title:'Private fixture',message:'Private fixture'}})).id;});
  await check('IDOR, horizontal tenant isolation and server-derived user identity',async()=>{
   const rows=(await first.request('GET','/users/me/trades')).data;assert.ok(rows.some(row=>row.id===trade1));assert.ok(!rows.some(row=>row.id===trade2));
   assert.equal((await first.request('GET','/users/me/trades/'+trade2)).status,404);assert.equal((await first.request('PATCH','/users/me/notifications/'+note2+'/read')).status,404);
   assert.equal((await first.request('PATCH','/users/me/settings',{userId:user2.user.id,maxAllocation:10})).status,400);
   assert.equal((await first.request('PATCH','/users/me',{fullName:'Updated fixture'})).status,200);
   await first.request('PATCH','/users/me/settings',{maxAllocation:7});assert.deepEqual((await second.request('GET','/users/me/settings')).data,[]);
   const foreignSessions=(await second.request('GET','/auth/sessions')).data;await first.request('DELETE','/auth/sessions/'+foreignSessions[0].id);assert.equal((await second.request('GET','/auth/me')).status,200);
  });
  await check('forced RLS isolates unfiltered queries and transaction-local pool context does not leak',async()=>{
   const pool=new PrismaClient({adapter:new PrismaPg({...connectionOptions(env.DATABASE_URL,'runtime','test',env.NEON_BRANCH_HOST),max:1}),log:[]});try{
    const mine=await pool.$transaction(async tx=>{await tx.$executeRawUnsafe("SELECT set_config('oxinvo.user_id',$1,true),set_config('oxinvo.admin','false',true)",user1.user.id);return tx.trade.findMany();});assert.ok(mine.every(row=>row.userId===user1.user.id));assert.ok(mine.length);
    assert.deepEqual(await pool.trade.findMany(),[]);
   }finally{await pool.$disconnect();}
  });
  await check('password change revokes other sessions and rotates the current token',async()=>{
   const extra=new BrowserClient();assert.equal((await extra.login(user1.user.username,firstPassword)).status,200);const next=generatePassword();assert.equal((await first.request('POST','/auth/change-password',{currentPassword:firstPassword,newPassword:next})).status,200);user1.currentPassword=next;
   assert.equal((await extra.request('GET','/auth/me')).status,401);assert.equal((await first.request('GET','/auth/me')).status,200);
  });
  await check('admin password reset, suspension, activation and session revocation',async()=>{
   const reset=await managerClient.request('POST','/admin/users/'+user2.user.id+'/reset-password');assert.ok(reset.data.generatedPassword.length>=20);assert.equal((await second.request('GET','/auth/me')).status,401);
   const resetLogin=await second.login(user2.user.username,reset.data.generatedPassword);assert.equal(resetLogin.status,200);assert.equal(resetLogin.data.user.mustChangePassword,true);
   await second.request('POST','/auth/change-password',{currentPassword:reset.data.generatedPassword,newPassword:secondPassword});
   await managerClient.request('POST','/admin/users/'+user2.user.id+'/suspend');assert.equal((await second.request('GET','/auth/me')).status,401);assert.equal((await second.login(user2.user.username,secondPassword)).status,401);
   await managerClient.request('POST','/admin/users/'+user2.user.id+'/activate');assert.equal((await second.login(user2.user.username,secondPassword)).status,200);
   await managerClient.request('POST','/admin/users/'+user2.user.id+'/revoke-sessions');assert.equal((await second.request('GET','/auth/me')).status,401);
  });
  await check('subscription extension/expiry, expired sessions and soft deletion preserve history',async()=>{
   const extended=await managerClient.request('PATCH','/admin/users/'+user2.user.id+'/subscription',{extendDays:30});assert.ok(extended.status<300);
   const expired=await managerClient.request('PATCH','/admin/users/'+user2.user.id+'/subscription',{expirationDate:new Date(Date.now()-500).toISOString()});assert.ok(expired.status<300);assert.equal((await second.login(user2.user.username,secondPassword)).status,401);
   const expiredSession=new BrowserClient();await expiredSession.login('oxinvo.admin',adminNext);const hash=require('crypto').createHmac('sha256',env.SESSION_SECRET).update(expiredSession.cookies.get('oxinvo_session')).digest('hex');
   await system(tx=>tx.session.update({where:{sessionTokenHash:hash},data:{createdAt:new Date(Date.now()-2*86400000),expiresAt:new Date(Date.now()-60000)}}));assert.equal((await expiredSession.request('GET','/auth/me')).status,401);
   assert.ok((await managerClient.request('DELETE','/admin/users/'+user2.user.id)).status<300);
   const deleted=await system(tx=>tx.user.findUnique({where:{id:user2.user.id}}));assert.equal(deleted.status,'DELETED');assert.ok(deleted.deletedAt);assert.ok(await system(tx=>tx.trade.count({where:{userId:user2.user.id}})));
  });
  await check('last active SUPER_ADMIN cannot be suspended, deleted or demoted',async()=>{
   for(const [method,route,body]of [['POST','/admin/users/'+superId+'/suspend',undefined],['DELETE','/admin/users/'+superId,undefined],['PATCH','/admin/users/'+superId,{role:'ADMIN'}]])assert.equal((await admin.request(method,route,body)).status,409);
  });
  if(process.env.OXINVO_BROWSER_TEST==='true')await check('browser real login, first change, create modal, refresh, cookie/localStorage and logout cache clearing',async()=>{
   await require('./test-auth-browser.cjs')({adminUsername:'oxinvo.admin',adminPassword:adminNext,suffix,generatePassword,fs});
  });
  await check('database-backed brute force lock and safe audit records',async()=>{
   const brute=new BrowserClient(),name='missing_'+suffix;for(let i=0;i<5;i++)assert.equal((await brute.login(name,generatePassword())).status,401);assert.equal((await brute.login(name,generatePassword())).status,429);
   const logs=await system(tx=>tx.auditLog.findMany({where:{createdAt:{gt:new Date(Date.now()-3600000)}}}));for(const action of ['LOGIN_SUCCESS','LOGIN_FAILURE','LOGOUT','USER_CREATED','USER_UPDATED','USER_SUSPENDED','USER_ACTIVATED','USER_DELETED','PASSWORD_CHANGED','PASSWORD_RESET','SESSION_REVOKED','SUBSCRIPTION_CHANGED','UNAUTHORIZED_ACCESS']){
    assert.ok(logs.some(log=>log.action===action));}
   for(const log of logs){const value=JSON.stringify(log.metadata);assert.ok(!value.includes(adminPassword));assert.ok(!value.includes(adminNext));assert.ok(!/passwordHash|sessionToken|apiSecret/.test(value));}
  });
  await check('concurrent last-SUPER_ADMIN protection and role-change audit',async()=>{
   const other=await create(admin,'super_'+suffix,'SUPER_ADMIN');
   const outcomes=await Promise.all([admin.request('PATCH','/admin/users/'+superId,{role:'ADMIN'}),admin.request('PATCH','/admin/users/'+other.user.id,{role:'ADMIN'})]);
   assert.ok(outcomes.some(row=>row.status>=400));assert.equal(await system(tx=>tx.user.count({where:{role:'SUPER_ADMIN',status:'ACTIVE'}})),1);
   // Restore only isolated test fixtures, never development users.
   await system(async tx=>{await tx.$executeRawUnsafe("SELECT pg_advisory_xact_lock(hashtext('oxinvo.user-management'))");await tx.user.update({where:{id:superId},data:{role:'SUPER_ADMIN'}});await tx.user.update({where:{id:other.user.id},data:{role:'ADMIN'}});});
   assert.ok(await system(tx=>tx.auditLog.count({where:{action:'ROLE_CHANGED'}})));
  });
  const summary={passed:results.length,failed:0,tests:results,scope:'Neon oxinvo_test only; development untouched by test fixtures'};fs.writeFileSync(path.resolve(__dirname,'../../.verification/stage5-auth-results.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify({authenticationTestsPassed:results.length,failed:0}));
 }finally{if(app)await app.close();await client.$disconnect();}
}
main().catch(error=>{console.error(JSON.stringify({phase,code:error.code??'AUTH_TEST_FAILED',browserStep:error.browserStep,browserButtons:error.browserButtons,responseFailures:error.responseFailures,lastHttp,completed:results.length}));process.exitCode=1;});
