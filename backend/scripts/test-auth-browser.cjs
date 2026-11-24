const assert=require('node:assert/strict');
module.exports=async function({adminUsername,adminPassword,suffix,generatePassword,fs}){
 let step='connect';
 const tabs=await fetch('http://127.0.0.1:9225/json').then(row=>row.json());const ws=new WebSocket(tabs.find(row=>row.type==='page').webSocketDebuggerUrl);await new Promise(resolve=>ws.addEventListener('open',resolve,{once:true}));
 let id=0;const pending=new Map(),exceptions=[],responseFailures=[];
 ws.addEventListener('message',({data})=>{const message=JSON.parse(data);if(message.id&&pending.has(message.id)){const promise=pending.get(message.id);pending.delete(message.id);message.error?promise.reject(Error('Browser command failed')):promise.resolve(message.result);}if(message.method==='Runtime.exceptionThrown')exceptions.push('Runtime exception');if(message.method==='Network.responseReceived'&&message.params.response.status>=400){responseFailures.push({path:new URL(message.params.response.url).pathname,status:message.params.response.status});}});
 const call=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});ws.send(JSON.stringify({id:key,method,params}));});
 async function evaluate(expression){const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error('Browser evaluation failed');return result.result.value;}
 const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 async function wait(expression){for(let i=0;i<80;i++){if(await evaluate(expression))return;await pause(250);}throw Error('Browser condition timed out');}
 async function type(selector,text){await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`);await call('Input.dispatchKeyEvent',{type:'keyDown',key:'a',code:'KeyA',modifiers:2});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'a',code:'KeyA',modifiers:2});await call('Input.insertText',{text});}
 async function click(text){await evaluate(`[...document.querySelectorAll('button')].find(button=>button.innerText.trim()===${JSON.stringify(text)}).click()`);}
 try{
  await call('Runtime.enable');await call('Page.enable');await call('Network.enable');await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  step='login page';await call('Network.clearBrowserCookies');await call('Page.navigate',{url:'http://127.0.0.1:3000/'});await wait(`Boolean(document.querySelector('#login-username'))`);
  assert.equal(await evaluate(`document.body.textContent.includes('Demo Trader')||document.body.textContent.includes('Demo Admin')`),false);
  step='admin login';await type('#login-username',adminUsername);await type('#login-password',adminPassword);await evaluate(`document.querySelector('form').requestSubmit()`);await wait(`document.body.textContent.includes('Total Users')`);
  step='admin refresh';await call('Page.reload');await wait(`document.body.textContent.includes('Total Users')`);
  assert.equal(await evaluate(`document.cookie.includes('oxinvo_session')`),false);
  assert.ok((await evaluate(`Object.keys(localStorage)`)).every(key=>key==='oxinvo_language'));
  step='users navigation';await click('Users');step='create button';await wait(`Boolean([...document.querySelectorAll('button')].find(button=>button.innerText.trim()==='New User'))`);await click('New User');step='create form';
  await wait(`Boolean(document.querySelector('input[autocomplete=off]'))`);await type('input[autocomplete=off]','browser_'+suffix);step='create form readiness';
  await wait(`!document.querySelector('input[autocomplete=off]').closest('form').querySelector('button[type=submit]').disabled`);
  await evaluate(`document.querySelector('input[autocomplete=off]').closest('form').requestSubmit()`);
  step='create response';await wait(`Boolean(document.querySelector('code'))&&document.body.textContent.includes('Account created successfully')`);
  const password=await evaluate(`document.querySelector('code').innerText`);assert.ok(password.length>=20);
  const copyFormat=await evaluate(`document.body.textContent.includes('Copy all credentials')`);assert.equal(copyFormat,true);
  step='credential close';await click('Close');await wait(`!document.querySelector('code')`);
  // Sign out using the existing sidebar action; the credential modal is closed
  // before any screenshot to avoid persisting the one-time password in artifacts.
  step='admin logout';await evaluate(`document.querySelector('header button[aria-label=Profile]').click()`);await click('Log out');await wait(`Boolean(document.querySelector('#login-username'))`);
  step='new user login';await type('#login-username','browser_'+suffix);await type('#login-password',password);await evaluate(`document.querySelector('form').requestSubmit()`);await wait(`document.body.textContent.includes('Change password')`);
  const next=generatePassword();const inputs=await evaluate(`document.querySelectorAll('input[type=password]').length`);assert.equal(inputs,3);
  for(const [index,value]of [[0,password],[1,next],[2,next]]){await evaluate(`document.querySelectorAll('input[type=password]')[${index}].focus()`);await call('Input.insertText',{text:value});}
  step='new user password change';await evaluate(`document.querySelector('form').requestSubmit()`);await wait(`document.body.textContent.includes('Total Balance')`);
  assert.ok(!await evaluate(`document.body.textContent.includes('24,850')`));await call('Page.reload');await wait(`document.body.textContent.includes('Total Balance')`);
  fs.writeFileSync(require('node:path').resolve(__dirname,'../../.verification/stage5-user.png'),Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
  await click('Log out');await wait(`Boolean(document.querySelector('#login-username'))`);
  assert.equal(await evaluate(`document.body.textContent.includes('Total Balance')||document.body.textContent.includes('browser_${suffix}')`),false);
  assert.ok((await evaluate(`Object.keys(localStorage)`)).every(key=>key==='oxinvo_language'));assert.equal(exceptions.length,0);
  fs.writeFileSync(require('node:path').resolve(__dirname,'../../.verification/stage5-browser-results.json'),JSON.stringify({realAdminLogin:true,refreshSession:true,createCredentialsModal:true,passwordClearedOnClose:true,firstPasswordChange:true,newUserEmptyState:true,httpOnlyCookie:true,noSecretLocalStorage:true,logoutStateCleared:true,runtimeExceptions:0},null,2));
 }catch(error){error.browserButtons=await evaluate(`[...document.querySelectorAll('button')].map(button=>button.innerText.trim()).filter(Boolean)`);error.browserStep=step;error.responseFailures=responseFailures;throw error;}finally{ws.send(JSON.stringify({id:++id,method:'Browser.close'}));await pause(250);ws.close();}
};
