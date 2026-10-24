// Super Websites v1.8.0 | Isolated local production/content fixtures; no network.
// Run without a concurrent build. Content configuration is restored in finally.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const config=JSON.parse(read('site.config.json'));
// v1.7.4: A live enquiry must be addressed to the shared Zoho mailbox.
assert.equal(config.contactEmail,'hello@superwebsites.co.nz','Production enquiries should use the shared Zoho mailbox.');
assert(config.formEndpoint===''||config.enquiryDeliveryVerified===true,'Automatic delivery must be verified before activation.');
const savedPages=read('content/pages.json'),savedPosts=read('content/posts.json');
const tempConfig='.checks/production.json',tempBody='src/.check-build-body.html';
assert(!fs.existsSync(path.join(root,tempBody)),'Fixture path is already in use.');
fs.mkdirSync(path.join(root,'.checks'),{recursive:true});
const fixture={...config,siteUrl:'https://super-websites.example.test/',contactEmail:'hello@example.test',formEndpoint:''};
function run(mode,out,extra=[]){return spawnSync(process.execPath,['scripts/build-site-v1.8.0.mjs','--mode',mode,'--out',out,...extra],{cwd:root,encoding:'utf8'});}
function ok(result){assert.equal(result.status,0,result.stderr);}
try {
  ok(run('preview','site-dist-blog-preview'));
  const listing=read('site-dist-blog-preview/blog/index.html');
  assert.equal((listing.match(/class="blog-card mock-post"/g)||[]).length,3);
  assert.match(listing,/href="\.\.\/blog\/small-website-big-job\/"/);
  for(const card of listing.matchAll(/<article class="blog-card mock-post">([\s\S]*?)<\/article>/g))assert(!card[1].includes('<a '),'Mock titles must not be dead links');
  assert.match(read('site-dist-blog-preview/blog/small-website-big-job/index.html'),/Example article for this website preview/);
  // v1.6.5: Explicit negative fixture, independent of deployed domain/contact settings.
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify({...config,siteUrl:'',contactEmail:'',formEndpoint:''}));
  const unavailable=run('production','site-dist-gate',['--config',tempConfig]);
  assert.notEqual(unavailable.status,0,'Unconfigured production should refuse launch.');
  assert.match(unavailable.stderr,/Final domain/);
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify({...fixture,socialProfiles:[{name:'Bad',url:'javascript:alert(1)'}]}));
  assert.notEqual(run('production','site-dist-gate',['--config',tempConfig]).status,0,'Non-https social URLs must be refused.');
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify(fixture));
  const production=()=>run('production','site-dist-production',['--config',tempConfig]);
  ok(production());
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify({...fixture,formEndpoint:'https://enquiries.superwebsites.co.nz/api/enquiry',enquiryDeliveryVerified:false}));
  assert.match(production().stderr,/Verify real inbox delivery/);
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify({...fixture,formEndpoint:'https://enquiries.superwebsites.co.nz/api/enquiry',enquiryDeliveryVerified:true}));
  ok(production());
  assert.match(read('site-dist-production/index.html'),/Send enquiry/);
  assert.match(read('site-dist-production/_headers'),/https:\/\/enquiries\.superwebsites\.co\.nz/);
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify(fixture));
  ok(production());
  const home=read('site-dist-production/index.html');
  assert.match(home,/<link rel="canonical" href="https:\/\/super-websites\.example\.test\/">/);
  assert.match(home,/content="index,follow"/);
  assert(!home.includes('version-links'));
  // v1.7.4: The live form uses the inbox-verified endpoint and the CSP permits it.
  const deployedForm=read('site-dist/index.html');
  assert(deployedForm.includes('"contactEmail":"hello@superwebsites.co.nz"'), 'Production output must use the shared Zoho enquiry address.');
  assert(!deployedForm.includes('superwebsites111@gmail.com'), 'Production output must not use the retired Gmail recipient.');
  assert.equal(config.formEndpoint,'https://enquiries.superwebsites.co.nz/api/enquiry');
  assert.equal(config.enquiryDeliveryVerified,true);
  assert(deployedForm.includes('"formEndpoint":"'+config.formEndpoint+'"'));
  assert(deployedForm.includes('Send enquiry'));
  assert(!deployedForm.includes('The button opens an email draft'));
  assert(read('site-dist/_headers').includes("connect-src 'self' https://cloudflareinsights.com https://enquiries.superwebsites.co.nz"));
  // v1.6.5: social profiles render in the footer and as Organization sameAs.
  assert.match(home,/class="footer-social"[^]*?href="https:\/\/www\.instagram\.com\/superwebsites\/" rel="me noopener"/);
  // v1.7.4: the hidden-email fixture keeps the fallback address out of the footer and schema.
  assert.doesNotMatch(home,/class="public-email"/);
  assert.doesNotMatch(home,/"email":"hello@example\.test"/);
  assert.match(home,/"contactEmail":"hello@example\.test"/);
  // v1.6.6: footer socials render as labelled logos, not text.
  assert.match(home,/aria-label="Super Websites on Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"/);
  assert.match(home,/"sameAs":\["https:\/\/www\.facebook\.com\/profile\.php\?id=61595189683359"/);
  assert(fs.existsSync(path.join(root,'site-dist-production/about/index.html')));
  assert.match(read('site-dist-production/about/index.html'),/aria-current="page"/);
  assert.match(read('site-dist-production/about/index.html'),/dave-v1.5.5.webp/);
  assert(fs.existsSync(path.join(root,'site-dist-production/blog/index.html')));
  assert(fs.existsSync(path.join(root,'site-dist-production/blog/small-website-big-job/index.html')));
  assert(!read('site-dist-production/blog/index.html').includes('mock-post'));
  assert.match(read('site-dist-production/blog/small-website-big-job/index.html'),/\"@id\":\"https:\/\/super-websites\.example\.test\/#organization\"/);
  assert(!fs.existsSync(path.join(root,'site-dist-production/versions')));
  assert.equal((read('site-dist-production/sitemap.xml').match(/<loc>/g)||[]).length,17); // v1.8.0: adds Cromwell and Wānaka pages and four posts
  // v1.8.0: only the cost guide loads the calculator; it is cached like other versioned files.
  assert.match(read('site-dist-production/website-cost-nz/index.html'),/<script src="\.\.\/cost-calculator-v1\.8\.0\.js" type="module"><\/script><\/body>/);
  assert.match(read('site-dist-production/website-cost-nz/index.html'),/<form class="cost-calc" id="cost-calc" hidden novalidate>/);
  assert.doesNotMatch(home,/cost-calculator/);
  assert(fs.existsSync(path.join(root,'site-dist-production/cost-calculator-v1.8.0.js')));
  assert.match(read('site-dist-production/_headers'),/\/cost-calculator-v1\.8\.0\.js\n  Cache-Control: public, max-age=31536000, immutable/);
  for(const p of ['what-is-geo','get-mentioned-by-chatgpt-nz','google-ai-overviews-small-business','website-running-costs-nz'])assert.match(read(`site-dist-production/blog/${p}/index.html`),/"@type":"BlogPosting"/);
  assert.match(read('site-dist-production/website-design-central-otago/index.html'),/href="\.\.\/website-design-cromwell\/"/);
  for(const g of ['website-cost-nz','website-design-central-otago','website-design-queenstown','website-design-cromwell','website-design-wanaka','websites-with-no-monthly-fees','our-work','switch-from-wix-squarespace']){
    const page=read(`site-dist-production/${g}/index.html`);
    assert.equal((page.match(/<h1\b/g)||[]).length,1);
    assert.match(page,/name="description" content="[^"]{60,}"/);
    const nav=read('site-dist-production/index.html').match(/<nav class="nav-links"[\s\S]*?<\/nav>/)[0];
    assert(!nav.includes(`${g}/`),'guide page must stay out of the header nav');
    assert.match(read('site-dist-production/index.html'),new RegExp(`class="footer-guides"[\\s\\S]*?href="${g}/"`));
  }
  assert.match(read('site-dist-production/404.html'),/content="noindex,follow"/);
  // v1.7.4: with showContactEmail:true the email shows in the footer and schema again.
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify({...fixture,showContactEmail:true}));
  ok(production());
  { const shown=read('site-dist-production/index.html'); assert.match(shown,/class="public-email"/); assert.match(shown,/"email":"hello@example\.test"/); }
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify({...fixture,contactEmail:''}));
  assert.match(production().stderr,/enquiry endpoint or a public enquiry email/);
  fs.writeFileSync(path.join(root,tempConfig),JSON.stringify(fixture));
  fs.writeFileSync(path.join(root,tempBody),'<h2>Useful content</h2><p>Local test body with <a href="{{ROOT}}#pricing">pricing</a>.</p>');
  fs.writeFileSync(path.join(root,'content/pages.json'),JSON.stringify([
    {slug:'about',navLabel:'About',title:'About the Team',description:'Test about page.',published:true,bodyFile:tempBody},
    {slug:'blog',navLabel:'Blog',title:'Useful Website Advice',description:'Test blog page.',published:true,bodyFile:''},
    {slug:'draft',title:'Invisible Draft',description:'Unpublished.',published:false,bodyFile:''},
    // v1.6.3: the home page links these two guides, so the fixture publishes them (footer-only, not in the header nav).
    {slug:'website-cost-nz',title:'Cost Guide',description:'Test guide.',published:true,nav:false,footer:true,bodyFile:tempBody},
    {slug:'our-work',title:'Case Studies',description:'Test case studies.',published:true,nav:false,footer:true,bodyFile:tempBody},
    // v1.6.5: the home page also links the SEO and AI search guide.
    {slug:'seo-and-ai-search',title:'SEO Guide',description:'Test SEO guide.',published:true,nav:false,footer:true,bodyFile:tempBody}
  ]));
  fs.writeFileSync(path.join(root,'content/posts.json'),JSON.stringify([{slug:'first-post',title:'A Helpful First Post',description:'Local test article.',date:'2026-10-14',author:'Test Author',published:true,bodyFile:tempBody}]));
  ok(production());
  ok(spawnSync(process.execPath,['scripts/check-site-v1.8.0.mjs','site-dist-production'],{cwd:root,encoding:'utf8'}));
  assert.match(read('site-dist-production/blog/first-post/index.html'),/"@type":"BlogPosting"/);
  assert.match(read('site-dist-production/about/index.html'),/aria-current="page"/);
  assert(!fs.existsSync(path.join(root,'site-dist-production/draft')));
  assert.equal((read('site-dist-production/sitemap.xml').match(/<loc>/g)||[]).length,7); // v1.6.5: fixture adds the SEO guide
  assert.match(read('site-dist-production/robots.txt'),/Sitemap: https:\/\/super-websites\.example\.test\/sitemap.xml/);
  assert.match(read('site-dist-production/_headers'),/script-src 'self' https:\/\/static\.cloudflareinsights\.com 'sha256-/);
  assert.match(read('site-dist-production/_headers'),/connect-src 'self' https:\/\/cloudflareinsights\.com/); // v1.6.2: Cloudflare Web Analytics
  const unsafe=run('preview','src');
  assert.notEqual(unsafe.status,0,'Output must not overwrite source folders.');
  console.log('Build checks passed: launch gates, canonical/schema/sitemap, drafts excluded, multipage navigation/assets, blog routing, 404 and protected source output.');
} finally {
  fs.writeFileSync(path.join(root,'content/pages.json'),savedPages);
  fs.writeFileSync(path.join(root,'content/posts.json'),savedPosts);
  fs.rmSync(path.join(root,tempBody),{force:true});
  fs.rmSync(path.join(root,'.checks'),{recursive:true,force:true});
  for(const dir of ['site-dist-production','site-dist-gate','site-dist-blog-preview'])fs.rmSync(path.join(root,dir),{recursive:true,force:true});
}
