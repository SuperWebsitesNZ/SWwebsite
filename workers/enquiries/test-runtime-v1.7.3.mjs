// Super Websites v1.7.3 | Native workerd regression; no network or real credentials.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Miniflare} from 'miniflare';

const body={name:'Runtime Test',email:'visitor@example.test',business:'Runtime Test',type:'Something else',website:'',goal:'Offline runtime regression.',company_url:''};
const harness=`
import {createWorker} from './core.mjs';
const env={ENQUIRIES_ENABLED:'true',SENDER_EMAIL:'website@forms.superwebsites.co.nz',RESEND_API_KEY:'re_fake_native_test',ENQUIRY_RATE_LIMIT:{async limit(){return {success:true}}}};
const worker=createWorker(async(url,init)=>{
  // Native Request construction reproduces workerd's unsupported redirect:error.
  const outgoing=new Request(url,init);
  if(outgoing.url!=='https://api.resend.com/emails')throw Error('Unexpected destination');
  const data=await outgoing.json();
  if(data.to.length!==1 || data.to[0]!=='hello@superwebsites.co.nz' || data.reply_to!=='visitor@example.test')throw Error('Unexpected recipient');
  if(data.from!=='Super Websites enquiries <website@forms.superwebsites.co.nz>')throw Error('Unexpected sender');
  if(outgoing.headers.get('Authorization')!=='Bearer re_fake_native_test')throw Error('Missing fake credential');
  return Response.json({id:'offline-native-message-id'});
});
export default {fetch(request){return worker.fetch(request,env)}};
`;

async function run(mainModule,modules,path='/api/enquiry') {
 const mf=new Miniflare({host:'127.0.0.1',port:0,cf:false,telemetry:{enabled:false},workers:[{config:{name:'sw-runtime-test',compatibilityDate:'2026-10-21',manifest:{mainModule,modules}}}]});
 try {
  const options=path==='/health'?{}:{method:'POST',headers:{Origin:'https://superwebsites.co.nz','Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1'},body:JSON.stringify(body)};
  const response=await mf.dispatchFetch('https://enquiries.superwebsites.co.nz'+path,options);
  return {status:response.status,body:await response.json()};
 } finally {await mf.dispose();}
}

const previous=await readFile(new URL('./worker-v1.7.2.mjs',import.meta.url),'utf8');
const current=await readFile(new URL('./worker-v1.7.3.mjs',import.meta.url),'utf8');
const before=await run('harness.mjs',{'harness.mjs':{type:'esm',contents:harness},'core.mjs':{type:'esm',contents:previous}});
assert.equal(before.status,502);
assert.equal(before.body.code,'provider_connection_failed');
const after=await run('harness.mjs',{'harness.mjs':{type:'esm',contents:harness},'core.mjs':{type:'esm',contents:current}});
assert.equal(after.status,200);
assert.equal(after.body.success,true);

// Also prove the actual production entrypoint starts in native workerd.
const entry=await readFile(new URL('./entry-v1.7.3.mjs',import.meta.url),'utf8');
const health=await run('entry-v1.7.3.mjs',{'entry-v1.7.3.mjs':{type:'esm',contents:entry},'worker-v1.7.3.mjs':{type:'esm',contents:current}},'/health');
assert.equal(health.status,503,'No real runtime key is supplied to this test');
assert.deepEqual(health.body,{version:'1.7.3',configured:false});
console.log('Native workerd regression passed: old redirect mode fails before network, current send succeeds with a local provider stub, actual entrypoint starts. No email or external request sent.');
