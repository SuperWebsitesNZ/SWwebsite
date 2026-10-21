// Super Websites enquiry service v1.7.3 | Offline Resend and request-boundary tests.
import assert from 'node:assert/strict';
import {createWorker} from '../workers/enquiries/worker-v1.7.3.mjs';
const body = {name:'Test Visitor',email:'visitor@example.test',business:'Test Business',type:'New business website',website:'example.test',goal:'A clear business website.',company_url:''};
const headers = {Origin:'https://superwebsites.co.nz','Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'};
let sent = [], limited = [];
const secret = 're_offline_test_key_not_a_real_credential';
const env = {ENQUIRIES_ENABLED:'true',SENDER_EMAIL:'website@forms.superwebsites.co.nz',RESEND_API_KEY:secret,ENQUIRY_RATE_LIMIT:{async limit(input){limited.push(input);return {success:true};}}};
const worker = createWorker(async (url,options) => {sent.push({url,options,message:JSON.parse(options.body)});return Response.json({id:'offline-message-id'});});
function request(data=body,options={}) {return new Request('https://enquiries.superwebsites.co.nz/api/enquiry',{method:'POST',headers,...options,body:typeof data==='string'?data:JSON.stringify(data)});}
let response = await worker.fetch(request({...body,to:'attacker@example.test',from:'spoof@example.test',reply_to:'attacker@example.test'}),env);
const accepted = await response.json();
assert.equal(response.status,200);assert.equal(accepted.success,true);
assert.equal(sent.length,1);assert.equal(sent[0].url,'https://api.resend.com/emails');
assert.deepEqual(sent[0].message.to,['hello@superwebsites.co.nz']);
assert.equal(sent[0].message.from,`Super Websites enquiries <${env.SENDER_EMAIL}>`);
assert.equal(sent[0].message.reply_to,body.email);assert(sent[0].message.text.includes(body.goal));
assert.equal(sent[0].options.headers.Authorization,`Bearer ${secret}`);
assert.equal(sent[0].options.headers['Idempotency-Key'],`sw-enquiry-${accepted.reference}`);
assert.equal(sent[0].options.redirect,'manual');assert(sent[0].options.signal instanceof AbortSignal);
assert(!JSON.stringify(accepted).includes(secret));
assert.deepEqual(limited[0],{key:'sw-enquiry:192.0.2.1'});
assert.equal(response.headers.get('Access-Control-Allow-Origin'),headers.Origin);
for (const data of [{...body,email:'bad'},{...body,email:'a@example.test\r\nBcc: b@example.test'},{...body,name:'A\r\nBcc: b@example.test'},{...body,business:[]},{...body,type:'Unknown'},{...body,goal:''},{...body,company_url:'spam'},'not JSON',null]) {
 const value=typeof data==='string'?data:JSON.stringify(data);
 assert.equal((await worker.fetch(request(value),env)).status,400);
}
assert.equal(sent.length,1,'Invalid input must never send email');
assert.equal((await worker.fetch(request(body,{headers:{...headers,Origin:'https://evil.example'}}),env)).status,403);
assert.equal((await worker.fetch(request(body,{headers:{...headers,'Content-Type':'text/plain'}}),env)).status,415);
for (const override of [{ENQUIRIES_ENABLED:'false'},{RESEND_API_KEY:''},{RESEND_API_KEY:undefined},{SENDER_EMAIL:'spoof@example.test'},{ENQUIRY_RATE_LIMIT:undefined}]) {
 assert.equal((await worker.fetch(request(body),{...env,...override})).status,503);
}
assert.equal((await worker.fetch(request(body),{...env,ENQUIRY_RATE_LIMIT:{async limit(){return {success:false}}}})).status,429);
assert.equal((await worker.fetch(request(body),{...env,ENQUIRY_RATE_LIMIT:{async limit(){throw Error('offline')}}})).status,503);
assert.equal((await worker.fetch(request('x'.repeat(17000)),env)).status,413);
const stream = new ReadableStream({start(c){c.enqueue(new Uint8Array(17000));c.close();}});
assert.equal((await worker.fetch(new Request('https://enquiries.superwebsites.co.nz/api/enquiry',{method:'POST',headers,body:stream,duplex:'half'}),env)).status,413);
const before = sent.length;
const logs = [];
const originalError = console.error;
console.error = (...values) => logs.push(values);
try {
 for (const status of [301,302,307,308,400,401,403,429,500,503]) {
  const failing = createWorker(async()=>Response.json({message:`private ${secret}`},{status}));
  const result = await failing.fetch(request(body),env);
  const failure = await result.json();
  assert.equal(result.status,502);assert.equal(failure.success,false);
  assert.equal(failure.code,'provider_rejected');assert.equal(failure.provider_status,status);
  assert(!JSON.stringify(failure).includes(secret));assert(!JSON.stringify(failure).includes('private'));
 }
 for (const payload of [{},null,{id:''},{id:'message-id',error:'private provider error'}]) {
  assert.equal((await createWorker(async()=>Response.json(payload)).fetch(request(body),env)).status,502);
 }
 assert.equal((await createWorker(async()=>new Response('not JSON')).fetch(request(body),env)).status,502);
 assert.equal((await createWorker(async()=>{throw Error(`private ${secret}`)}).fetch(request(body),env)).status,502);
 const timeoutWorker = createWorker(async(_url,options)=>new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(Error('timeout')),{once:true})),5);
 const timedOut = await timeoutWorker.fetch(request(body),env);
 assert.equal(timedOut.status,502);assert.equal((await timedOut.json()).code,'provider_timeout');
 const rejection = await createWorker(async()=>Response.json({name:'restricted_api_key',message:`private ${secret}`},{status:403})).fetch(request(body),env);
 assert.deepEqual(Object.fromEntries(Object.entries(await rejection.json()).filter(([key])=>['code','provider_status','provider_code'].includes(key))),{code:'provider_rejected',provider_status:403,provider_code:'restricted_api_key'});
 const unsafe = await createWorker(async()=>Response.json({name:secret,message:body.email},{status:401})).fetch(request(body),env);
 assert(!(await unsafe.text()).includes(secret));
 const connection = await createWorker(async()=>{throw Error(secret)}).fetch(request(body),env);
 assert.equal((await connection.json()).code,'provider_connection_failed');
} finally {console.error = originalError;}
assert(logs.length > 0);assert(logs.every(row => row.length===3 && row[0]==='enquiry_send_failed' && typeof row[2].code==='string'));
assert(!JSON.stringify(logs).includes(secret));assert(!JSON.stringify(logs).includes(body.email));
assert.equal(sent.length,before);
const preflight = await worker.fetch(new Request('https://enquiries.superwebsites.co.nz/api/enquiry',{method:'OPTIONS',headers:{Origin:headers.Origin,'Access-Control-Request-Method':'POST'}}),env);
assert.equal(preflight.status,204);
const health = await worker.fetch(new Request('https://enquiries.superwebsites.co.nz/health'),env);
assert.equal(health.status,200);assert.equal((await health.json()).version,'1.7.3');
assert.equal((await worker.fetch(new Request('https://enquiries.superwebsites.co.nz/health'),{})).status,503);
console.log('Worker v1.7.3 checks passed: Resend acceptance/failure/timeout, fixed addresses, Reply-To, no secret/content leaks, validation, honeypot, origin, body bounds, rate limit and disabled setup. No email sent.');
