// Super Websites v1.5.1 | Mock requests only: no enquiry is transmitted.
import assert from 'node:assert/strict';
import {projectBrief, sendEnquiry} from '../enquiry-v1.5.1.js';
const fields={name:'Test visitor',email:'visitor@example.test',business:'Example',type:'New business website',website:'',goal:'A test brief',company_url:''};
assert.match(projectBrief(fields),/Name: Test visitor/);
assert.match(projectBrief(fields),/Existing website: None supplied/);
const reply=(ok,json,type='application/json')=>({ok,headers:new Headers({'content-type':type}),json:async()=>json});
let called=0;
await sendEnquiry('https://example.test/enquiry',fields,async(url,options)=>{
  called++;
  assert.equal(options.method,'POST');
  assert.equal(options.credentials,'omit');
  assert.equal(JSON.parse(options.body).email,fields.email);
  assert.equal(options.redirect,'error');
  return reply(true,{success:true});
});
assert.equal(called,1);
for(const response of [reply(false,{success:true}),reply(true,{success:false}),reply(true,{}),reply(true,{success:true},'text/html')])await assert.rejects(sendEnquiry('https://example.test/enquiry',fields,async()=>response));
await assert.rejects(sendEnquiry('https://example.test/enquiry',fields,async()=>{throw Error('offline');}));
await assert.rejects(sendEnquiry('http://example.test/enquiry',fields,async()=>{throw Error('must not be called');}));
await assert.rejects(sendEnquiry('https://example.test/enquiry',fields,async(url,options)=>new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(Error('aborted')))),5));
console.log('Enquiry checks passed: draft, request payload, receipt validation, HTTP failure, network failure, HTTPS and timeout. No real enquiries sent.');
