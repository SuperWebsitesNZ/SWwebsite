// Super Websites v1.5.0 | Isolated local production/content fixtures; no network.
// Run without a concurrent build. Content configuration is restored in finally.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const config=JSON.parse(read('site.config.json'));
const savedPages=read('content/pages.json'),savedPosts=read('content/posts.json');
const tempConfig='.checks/production.json',tempBody='src/.check-build-body.html';
assert(!fs.existsSync(path.join(root,tempBody)),'Fixture path is already in use.');
fs.mkdirSync(path.join(root,'.checks'),{recursive:true});
const fixture={...config,siteUrl:'https://super-websites.example.test/',contactEmail:'hello@example.test',formEndpoint:''};
function run(mode,out,extra=[]){return spawnSync(process.execPath,['scripts/build-site-v1.5.0.mjs','--mode',mode,'--out',out,...extra],{cwd:root,encoding:'utf8'});}
function ok(result){assert.equal(result.status,0,result.stderr);}
try {
  const unavailable=run('production','site-dist-gate');
  assert.notEqual(unavailable.status,0,'Unconfigured production should refuse launch.');
  assert.match(unavailable.stderr,/Final domain/);
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify(fixture));
  const production=()=>run('production','site-dist-production',['--config',tempConfig]);
  ok(production());
  const home=read('site-dist-production/index.html');
  assert.match(home,/<link rel="canonical" href="https:\/\/super-websites\.example\.test\/">/);
  assert.match(home,/content="index,follow"/);
  assert(!home.includes('version-links'));
  assert(!fs.existsSync(path.join(root,'site-dist-production/about')));
  assert(!fs.existsSync(path.join(root,'site-dist-production/blog')));
  assert(!fs.existsSync(path.join(root,'site-dist-production/versions')));
  assert.equal((read('site-dist-production/sitemap.xml').match(/<loc>/g)||[]).length,1);
  assert.match(read('site-dist-production/404.html'),/content="noindex,follow"/);
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify({...fixture,contactEmail:''}));
  assert.match(production().stderr,/enquiry endpoint or a public enquiry email/);
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify(fixture));
  fs.writeFileSync(path.join(root,tempBody),'<h2>Useful content</h2><p>Local test body with <a href="{{ROOT}}#pricing">pricing</a>.</p>');
  fs.writeFileSync(path.join(root,'content/pages.json'),JSON.stringify([
    {slug:'about',navLabel:'About',title:'About the Team',description:'Test about page.',published:true,bodyFile:tempBody},
    {slug:'blog',navLabel:'Blog',title:'Useful Website Advice',description:'Test blog page.',published:true,bodyFile:''},
    {slug:'draft',title:'Invisible Draft',description:'Unpublished.',published:false,bodyFile:''}
  ]));
  fs.writeFileSync(path.join(root,'content/posts.json'),JSON.stringify([{slug:'first-post',title:'A Helpful First Post',description:'Local test article.',date:'2026-10-14',author:'Test Author',published:true,bodyFile:tempBody}]));
  ok(production());
  ok(spawnSync(process.execPath,['scripts/check-site-v1.5.0.mjs','site-dist-production'],{cwd:root,encoding:'utf8'}));
  assert.match(read('site-dist-production/blog/first-post/index.html'),/"@type":"BlogPosting"/);
  assert.match(read('site-dist-production/about/index.html'),/aria-current="page"/);
  assert(!fs.existsSync(path.join(root,'site-dist-production/draft')));
  assert.equal((read('site-dist-production/sitemap.xml').match(/<loc>/g)||[]).length,4);
  assert.match(read('site-dist-production/robots.txt'),/Sitemap: https:\/\/super-websites\.example\.test\/sitemap.xml/);
  assert.match(read('site-dist-production/_headers'),/script-src 'self' 'sha256-/);
  const unsafe=run('preview','src');
  assert.notEqual(unsafe.status,0,'Output must not overwrite source folders.');
  console.log('Build checks passed: launch gates, canonical/schema/sitemap, drafts excluded, multipage navigation/assets, blog routing, 404 and protected source output.');
} finally {
  fs.writeFileSync(path.join(root,'content/pages.json'),savedPages);
  fs.writeFileSync(path.join(root,'content/posts.json'),savedPosts);
  fs.rmSync(path.join(root,tempBody),{force:true});
  fs.rmSync(path.join(root,'.checks'),{recursive:true,force:true});
  for(const dir of ['site-dist-production','site-dist-gate'])fs.rmSync(path.join(root,dir),{recursive:true,force:true});
}
