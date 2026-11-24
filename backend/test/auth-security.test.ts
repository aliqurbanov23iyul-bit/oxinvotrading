import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../src/auth/auth.service';
import { PasswordService } from '../src/common/security/password.service';
import { DatabaseService } from '../src/database/database.service';
import { generatePassword } from '../src/auth/credentials';
import { Request, Response } from 'express';
test('production cookies are host-only Secure HttpOnly SameSite and CSRF is session bound', () => {
 const auth=new AuthService({} as DatabaseService,new PasswordService(),new ConfigService({NODE_ENV:'production',SESSION_SECRET:randomBytes(32).toString('base64'),FRONTEND_URL:'https://oxinvo.com'}));
 const cookies:any[]=[];const response={cookie:(...args:any[])=>cookies.push(args)} as unknown as Response;
 const request={headers:{},get:()=>undefined} as unknown as Request;
 const token=auth.csrf(request,response);assert.equal(cookies[0][0],'__Host-oxinvo_csrf');assert.equal(cookies[0][2].secure,true);assert.equal(cookies[0][2].httpOnly,true);assert.equal(cookies[0][2].sameSite,'lax');assert.equal(cookies[0][2].domain,undefined);
 const valid={headers:{cookie:'__Host-oxinvo_csrf='+token},get:(name:string)=>name==='Origin'?'https://oxinvo.com':name==='X-CSRF-Token'?token:undefined} as unknown as Request;
 assert.doesNotThrow(()=>auth.verifyCsrf(valid));
 assert.throws(()=>auth.verifyCsrf({...valid,headers:{cookie:'__Host-oxinvo_csrf='+token+'; __Host-oxinvo_session='+randomBytes(32).toString('base64url')}} as unknown as Request));
 assert.throws(()=>auth.verifyCsrf({...valid,get:(name:string)=>name==='Origin'?'https://evil.oxinvo.com':name==='X-CSRF-Token'?token:undefined} as unknown as Request));
});
test('generated account passwords contain all classes and unique random values',()=>{
 const passwords=new Set(Array.from({length:100},()=>generatePassword()));assert.equal(passwords.size,100);for(const password of passwords){assert.ok(password.length>=20);for(const pattern of [/[a-z]/,/[A-Z]/,/\d/,/[^A-Za-z0-9]/])assert.match(password,pattern);}
});
