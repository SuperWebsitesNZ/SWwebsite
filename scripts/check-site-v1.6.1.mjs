// Super Websites v1.6.1 | Static output checks; no network requests.
import fs from 'node:fs';
import path from 'node:path';
const base = path.resolve(process.argv[2] || 'site-dist');
const errors = [];
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
}
const files = walk(base);
const publicBase = new URL(fs.readFileSync(path.join(base,'index.html'),'utf8').match(/property="og:url" content="([^"]+)"/)[1]);
const publicPath=publicBase.pathname;
const pages = files.filter(p => p.endsWith('.html') && !path.relative(base,p).startsWith('versions/'));
function assert(value, detail) { if (!value) errors.push(detail); }
for (const file of pages) {
  const label = path.relative(base,file), html = fs.readFileSync(file,'utf8');
  assert(!/\{\{[A-Z_]+\}\}/.test(html), label+': unresolved template');
  assert((html.match(/<h1\b/g)||[]).length===1, label+': one H1 required');
  assert(/<title>[^<]+<\/title>/.test(html), label+': missing title');
  assert(/name="description" content="[^"]+"/.test(html), label+': missing description');
  assert(/name="robots"/.test(html), label+': missing indexing rule');
  const ogImage=html.match(/property="og:image" content="([^"]+)"/)?.[1];
  const twitterImage=html.match(/name="twitter:image" content="([^"]+)"/)?.[1];
  assert(ogImage&&twitterImage===ogImage, label+': social image must match across Open Graph and Twitter');
  assert(/name="twitter:image:alt" content="[^"]+"/.test(html), label+': missing social image description');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert(new Set(ids).size===ids.length, label+': duplicate IDs');
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    assert(/\balt="[^"]*"/.test(image[0]), label+': image without alt');
    assert(/\bwidth="\d+"/.test(image[0])&&/\bheight="\d+"/.test(image[0]), label+': image without dimensions');
  }
  for (const script of html.matchAll(/<script\b[^>]*type="application\/(?:ld\+json|json)"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {JSON.parse(script[1]);} catch {errors.push(label+': invalid JSON script');}
  }
  for(const meta of html.matchAll(/property="og:image" content="([^"]+)"/g)){
    const asset=new URL(meta[1]);
    if(asset.origin===publicBase.origin&&asset.pathname.startsWith(publicPath))assert(fs.existsSync(path.resolve(base,asset.pathname.slice(publicPath.length))),label+': missing social share image');
  }
  const refs=[...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
  for (const set of html.matchAll(/\bsrcset="([^"]+)"/g)) refs.push(...set[1].split(',').map(s=>s.trim().split(/\s+/)[0]));
  for (const ref of refs) {
    if (/^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
    const [pathname, fragment]=ref.split('#');
    let target=pathname.startsWith('/') ? path.resolve(base, pathname.slice(publicPath.length)) : pathname ? path.resolve(path.dirname(file),pathname) : file;
    if (fs.existsSync(target)&&fs.statSync(target).isDirectory()) target=path.join(target,'index.html');
    assert(fs.existsSync(target), label+': missing local target '+ref);
    if (fragment&&fs.existsSync(target)&&target.endsWith('.html')) {
      const destination=target===file?html:fs.readFileSync(target,'utf8');
      assert(destination.includes('id="'+fragment+'"'),label+': missing fragment '+ref);
    }
  }
}
const manifestFile=path.join(base,'assets/site-v1.0.webmanifest');
const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
const manifestURL=new URL('assets/site-v1.0.webmanifest',publicBase);
assert(new URL(manifest.start_url,manifestURL).href===publicBase.href,'Shortcut must open the site root, including preview subpaths');
for(const icon of manifest.icons){
  assert(fs.existsSync(path.resolve(path.dirname(manifestFile),icon.src)),'Missing manifest icon '+icon.src);
}
assert(manifest.icons.some(icon=>icon.purpose==='maskable'),'Missing maskable shortcut icon');
for(const name of ['app-v1.5.1.js','enquiry-v1.5.1.js','cost-animation-v1.5.1.js']){
  const source=fs.readFileSync(path.join(base,name),'utf8');
  for(const m of source.matchAll(/from ["'](\.\/[^"']+)["']/g))assert(fs.existsSync(path.resolve(base,m[1])),'Missing module '+m[1]);
}
const css=fs.readFileSync(path.join(base,'styles-v1.6.1.css'),'utf8');
for(const match of css.matchAll(/url\("([^"#]+)"\)/g)) if(!/^(?:data:|https?:)/.test(match[1]))assert(fs.existsSync(path.resolve(base,match[1])),'Missing CSS asset '+match[1]);
assert(!/fonts\.googleapis|fonts\.gstatic/.test(css+pages.map(p=>fs.readFileSync(p,'utf8')).join('')),'Active pages should use self-hosted fonts');
for(const required of ['robots.txt','404.html','.nojekyll','app-v1.5.1.js','enquiry-v1.5.1.js','cost-animation-v1.5.1.js'])assert(fs.existsSync(path.join(base,required)),'Missing '+required);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Checked ${pages.length} active HTML documents: metadata, JSON, IDs, image dimensions, fonts, files and fragments passed.`);
