// Super Websites v1.7.0 | Validate sending boundaries without sending real email.
import assert from 'node:assert/strict';
import worker from '../workers/enquiries/worker-v1.7.0.mjs';
const body = {name:'Test Visitor',email:'visitor@example.test',business:'Test Business',type:'New business website',website:'example.test',goal:'A clear business website.',company_url:''};
const headers = {Origin:'https://superwebsites.co.nz','Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'};
let sent = [], limited = [];
const env = {ENQUIRIES_ENABLED:'true',SENDER_EMAIL:'website@forms.superwebsites.co.nz',ENQUIRY_EMAIL:{async send(message){sent.push(message);}},ENQUIRY_RATE_LIMIT:{async limit(input){limited.push(input);return {success:true};}}};
function request(data=body,options={}) {return new Request('https://enquiries.superwebsites.co.nz/api/enquiry',{method:'POST',headers,...options,body:typeof data==='string'?data:JSON.stringify(data)});}
let response = await worker.fetch(request({...body,to:'attacker@example.test',from:'spoof@example.test'}),env);
assert.equal(response.status,200);assert.equal((await response.json()).success,true);
assert.equal(sent.length,1);assert.equal(sent[0].to,'hello@superwebsites.co.nz');assert.equal(sent[0].from.email,env.SENDER_EMAIL);assert.equal(sent[0].replyTo.email,body.email);assert(sent[0].text.includes(body.goal));
assert.deepEqual(limited[0],{key:'sw-enquiry:192.0.2.1'});
assert.equal(response.headers.get('Access-Control-Allow-Origin'),headers.Origin);
for (const data of [{...body,email:'bad'},{...body,email:'a@example.test\r\nBcc: b@example.test'},{...body,name:'A\r\nBcc: b@example.test'},{...body,business:[]},{...body,type:'Unknown'},{...body,goal:''},{...body,company_url:'spam'},'not JSON',null]) {
 const value=typeof data==='string'?data:JSON.stringify(data);
 assert.equal((await worker.fetch(request(value),env)).status,400);
}
assert.equal(sent.length,1,'Invalid input must never send email');
assert.equal((await worker.fetch(request(body,{headers:{...headers,Origin:'https://evil.example'}}),env)).status,403);
assert.equal((await worker.fetch(request(body,{headers:{...headers,'Content-Type':'text/plain'}}),env)).status,415);
assert.equal((await worker.fetch(request(body),{...env,ENQUIRIES_ENABLED:'false'})).status,503);
assert.equal((await worker.fetch(request(body),{...env,ENQUIRY_RATE_LIMIT:{async limit(){return {success:false}}}})).status,429);
assert.equal((await worker.fetch(request('x'.repeat(17000)),env)).status,413);
const stream = new ReadableStream({start(c){c.enqueue(new Uint8Array(17000));c.close();}});
assert.equal((await worker.fetch(new Request('https://enquiries.superwebsites.co.nz/api/enquiry',{method:'POST',headers,body:stream,duplex:'half'}),env)).status,413);
const before = sent.length;
assert.equal((await worker.fetch(request(body),{...env,ENQUIRY_EMAIL:{async send(){throw Error('private provider details')}}})).status,502);
assert.equal(sent.length,before);
const preflight = await worker.fetch(new Request('https://enquiries.superwebsites.co.nz/api/enquiry',{method:'OPTIONS',headers:{Origin:headers.Origin,'Access-Control-Request-Method':'POST'}}),env);
assert.equal(preflight.status,204);
assert.equal((await worker.fetch(new Request('https://enquiries.superwebsites.co.nz/health'),env)).status,200);
assert.equal((await worker.fetch(new Request('https://enquiries.superwebsites.co.nz/health'),{})).status,503);
console.log('Worker checks passed: fixed recipient/sender, Reply-To, validation, honeypot, origin, body bounds, rate limit, preflight, disabled setup and failed-send response. No email sent.');
