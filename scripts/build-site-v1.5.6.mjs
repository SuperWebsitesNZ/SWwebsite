// Super Websites v1.5.6 | Dependency-free shared-page builder and production gate.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
function arg(key,fallback){const i=args.indexOf(key);if(i<0)return fallback;if(!args[i+1]||args[i+1].startsWith('--'))throw Error(`${key} needs a value`);return args[i+1];}
const mode=arg('--mode','preview');
if(!['preview','production'].includes(mode))throw Error('Use preview or production mode.');
const config=JSON.parse(fs.readFileSync(path.resolve(project,arg('--config','site.config.json')),'utf8'));
const output=path.resolve(project,arg('--out','site-dist'));
if(output!==project&&!/^site-dist(?:-[a-z0-9-]+)?$/.test(path.relative(project,output)))throw Error('Output must be site-dist or site-dist-name inside this project.');
if(mode==='production'&&output===project)throw Error('Production output must be separate from the demo source.');
if(fs.existsSync(output)&&fs.lstatSync(output).isSymbolicLink())throw Error('Output cannot be a symlink.');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=s=>JSON.stringify(s).replace(/</g,'\\u003c');
function https(value,label){let u;try{u=new URL(value);}catch{throw Error(`${label} must be configured as a complete HTTPS URL.`);}if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash)throw Error(`${label} must be an HTTPS URL without credentials, query or fragment.`);return u;}
if(mode==='production'){
  const official=https(config.siteUrl,'Final domain');
  if(official.href===config.previewUrl||official.hostname==='localhost'||/\.github\.io$/.test(official.hostname))throw Error('Production needs the final business domain, not the demo address.');
  if(!config.formEndpoint&&!config.contactEmail)throw Error('Configure an enquiry endpoint or a public enquiry email before production.');
}
if(config.formEndpoint)https(config.formEndpoint,'Enquiry endpoint');
if(config.contactEmail&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.contactEmail))throw Error('Public enquiry email is invalid.');
if(config.version!=='1.5.6'||!config.title||!config.description||!config.name)throw Error('Site configuration needs version 1.5.6, title, description and name.');
const base=https(mode==='production'?config.siteUrl:config.previewUrl,'Site URL');
if(!base.pathname.endsWith('/'))base.pathname+='/';
const pages=JSON.parse(fs.readFileSync(path.join(project,'content/pages.json'),'utf8'));
const posts=JSON.parse(fs.readFileSync(path.join(project,'content/posts.json'),'utf8'));
function slug(s){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s))throw Error(`Invalid page slug: ${s}`);return s;}
function bodyFile(file){if(!file)throw Error('Published pages and posts need real content.');const resolved=path.resolve(project,file);if(!resolved.startsWith(path.join(project,'src')+path.sep))throw Error('Content files must live in src/.');return fs.readFileSync(resolved,'utf8');}
const activePages=pages.filter(p=>p.published===true);
const activePosts=posts.filter(p=>p.published===true);
const routes=new Set(['','404.html','assets','src','scripts','content','versions','site-dist']);
for(const p of activePages){slug(p.slug);if(routes.has(p.slug))throw Error('Duplicate route.');routes.add(p.slug);if(!p.title||!p.description)throw Error('Published pages need title and description.');}
for(const p of activePosts){slug(p.slug);if(!p.title||!p.description||!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||!p.author)throw Error('Published posts need title, description, date and author.');}
const blog=activePages.find(p=>p.slug==='blog');
if(activePosts.length&&!blog)throw Error('Publish the Blog page before publishing posts.');
if(blog&&!activePosts.length&&!blog.bodyFile)throw Error('An empty draft blog cannot be published.');
if(new Set(activePosts.map(p=>p.slug)).size!==activePosts.length)throw Error('Duplicate post slug.');
for(const page of activePages)if(page.slug!=='blog'||page.bodyFile)bodyFile(page.bodyFile);
for(const post of activePosts)bodyFile(post.bodyFile);
const layout=fs.readFileSync(path.join(project,'src/layout.html'),'utf8');
const partials=Object.fromEntries(['intro','icons','header','footer','dialog'].map(n=>[n.toUpperCase(),fs.readFileSync(path.join(project,'src/partials',n+'.html'),'utf8')]));
const knownFiles=[];
const documents=[];
const rendered=[];
function write(relative,contents){const dest=path.resolve(output,relative);if(!dest.startsWith(output+path.sep))throw Error('Invalid output path.');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,contents);knownFiles.push(relative);}
if(output!==project){fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});fs.cpSync(path.join(project,'assets'),path.join(output,'assets'),{recursive:true});}
if(mode==='preview'&&output!==project){
  if(fs.existsSync(path.join(project,'versions')))fs.cpSync(path.join(project,'versions'),path.join(output,'versions'),{recursive:true});
  for(const name of fs.readdirSync(project).filter(name=>/^(?:styles|app|enquiry|cost-animation)-v[0-9.]+\.(?:css|js)$/.test(name)))if(fs.existsSync(path.join(project,name)))fs.copyFileSync(path.join(project,name),path.join(output,name));
}
for(const filename of ['styles-v1.5.5.css','app-v1.5.1.js','enquiry-v1.5.1.js','cost-animation-v1.5.1.js'])if(output!==project)fs.copyFileSync(path.join(project,filename),path.join(output,filename));
function render(route,page,main,is404=false,article=null){
  const depth=route.split('/').filter(Boolean).length-(route.endsWith('.html')?1:0);
  const root=is404?base.pathname:'../'.repeat(depth);
  const url=new URL(route,base).href;
  const contactReady=!!(config.formEndpoint||config.contactEmail);
  const publicContact=config.contactEmail?`<a class="public-email" href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a>`:'';
  const contactNotice=config.formEndpoint?'Tell us about your project. We’ll use these details to respond to your enquiry.':config.contactEmail?'Tell us about your project. The button opens an email draft for you to send.':'Prepare a project brief you can save. This preview does not send enquiries.';
  const nav=activePages.map(p=>`<a href="${root}${esc(p.slug)}/"${route===p.slug+'/'?' aria-current="page"':''}>${esc(p.navLabel||p.title)}</a>`).join('');
  const versions=mode==='preview'?`<nav class="version-links" aria-label="Demo versions"><a href="${root}versions/v1.5.6/">v1.5.6</a><a href="${root}versions/v1.5.5/">Previous: v1.5.5</a></nav>`:'';
  const entity={'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':base.href+'#organization',name:config.name,url:base.href,logo:new URL('assets/logo-640-v1.5.0.webp',base).href},{'@type':'WebSite','@id':base.href+'#website',name:config.name,url:base.href,publisher:{'@id':base.href+'#organization'}},{'@type':article?'BlogPosting':'WebPage','@id':url+'#page',url,name:page.title,description:page.description,inLanguage:'en-NZ',isPartOf:{'@id':base.href+'#website'}}]};
  if(article)Object.assign(entity['@graph'][2],{headline:page.title,datePublished:article.date,author:article.author===config.name?{'@id':base.href+'#organization'}:{'@type':'Person',name:article.author},publisher:{'@id':base.href+'#organization'}});
  if(config.contactEmail)entity['@graph'][0].email=config.contactEmail;
  const indexing=mode==='production'&&!is404;
  const share=new URL(config.socialImage,base).href;
  const head=`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#7b3fe4"><meta name="robots" content="${indexing?'index,follow':'noindex,follow'}"><meta name="application-version" content="1.5.6"><title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}">${indexing?`<link rel="canonical" href="${esc(url)}">`:''}<meta property="og:locale" content="en_NZ"><meta property="og:type" content="${article?'article':'website'}"><meta property="og:site_name" content="${esc(config.name)}"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${esc(share)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:alt" content="Super Websites purple and yellow shield. Your website. Owned by you. No required monthly plan."><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(page.title)}"><meta name="twitter:description" content="${esc(page.description)}"><meta name="twitter:image" content="${esc(share)}"><meta name="twitter:image:alt" content="Super Websites purple and yellow shield. Your website. Owned by you. No required monthly plan."><link rel="icon" href="${root}assets/favicon-v1.2.1.png" type="image/png"><link rel="apple-touch-icon" sizes="180x180" href="${root}assets/apple-touch-icon-v1.0.png"><link rel="manifest" href="${root}assets/site-v1.0.webmanifest"><link rel="preload" href="${root}assets/BarlowCondensed-ExtraBoldItalic-v1.5.0.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${root}styles-v1.5.5.css"><script type="application/ld+json">${json(entity)}</script>`;
  const values={...partials,HEAD:head,MAIN:main,ROOT:root,EXTRA_NAV:nav,VERSION_LINKS:versions,FOOTER_LABEL:`© ${new Date().getUTCFullYear()} Super Websites${mode==='preview'?' · Preview v1.5.6':''}`,FORM_INTRO:contactNotice,FORM_ACTION:config.formEndpoint?'Send enquiry':config.contactEmail?'Open email draft':'Prepare my brief',CONTACT_REQUIRED:contactReady?'required':'',PUBLIC_CONTACT:publicContact,RUNTIME:json({version:'1.5.6',mode,formEndpoint:config.formEndpoint,contactEmail:config.contactEmail})};
  let html=layout;
  for(let pass=0;pass<3;pass++)html=html.replace(/\{\{([A-Z_]+)\}\}/g,(whole,key)=>values[key]??whole);
  if(/\{\{[A-Z_]+\}\}/.test(html))throw Error('Unresolved layout token.');
  const file=route.endsWith('.html')?route:route+'index.html';write(file,html);if(!is404)documents.push(url);
  rendered.push(html);
  return html;
}
const homeBody=fs.readFileSync(path.join(project,'src/home.html'),'utf8');
render('',{title:config.title,description:config.description},homeBody);
if(mode==='preview')render('versions/v1.5.6/',{title:config.title,description:config.description},homeBody);
const displayDate=value=>new Intl.DateTimeFormat('en-NZ',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T00:00:00Z'));
const arrow='<svg class="arrow" aria-hidden="true"><use href="#icon-arrow"/></svg>';
for(const page of activePages){
  let content=page.bodyFile?bodyFile(page.bodyFile):'';
  if(page.slug==='blog'){
    const mockPosts=mode==='preview'?posts.filter(p=>p.mockTitle===true&&p.published!==true):[];
    const cards=[...activePosts].sort((a,b)=>b.date.localeCompare(a.date)).map((p,index)=>{
      const href='{{ROOT}}blog/'+esc(p.slug)+'/';
      const meta=`<p class="blog-meta">${esc(p.author)} · <time datetime="${esc(p.date)}">${esc(displayDate(p.date))}</time></p>`;
      if(index===0)return `<article class="blog-featured"><div class="blog-featured-copy">${meta}<h2><a href="${href}">${esc(p.title)}</a></h2><p>${esc(p.description)}</p><a class="btn" href="${href}">Read the story ${arrow}</a></div><div class="blog-featured-art"><img src="{{ROOT}}assets/hero1-480-v1.5.0.webp" width="1024" height="1536" decoding="async" alt="Super Websites heroine holding a laptop"></div></article>`;
      return `<article class="blog-card">${meta}<h2><a href="${href}">${esc(p.title)}</a></h2><p>${esc(p.description)}</p><a class="textlink" href="${href}">Read article ↗</a></article>`;
    }).join('');
    content+=`<div class="blog-grid">${cards}${mockPosts.map(p=>`<article class="blog-card mock-post"><span class="mock-label">Sample title · Layout preview</span><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p></article>`).join('')}</div>`;
    render(page.slug+'/',page,`<section class="section content-page blog-page"><div class="wrap"><h1 class="display">${esc(page.heading||page.title)}</h1>${content}</div></section>`);
  }else if(page.layout==='full')render(page.slug+'/',page,content);
  else render(page.slug+'/',page,`<section class="section content-page"><div class="wrap"><h1 class="display">${esc(page.heading||page.title)}</h1><div class="prose">${content}</div></div></section>`);
}
for(const post of activePosts){
  const sample=post.sampleArticle&&mode==='preview'?'<p class="article-preview-note">Example article for this website preview.</p>':'';
  render('blog/'+post.slug+'/',post,`<article class="section content-page"><div class="wrap article-shell"><a class="article-back" href="{{ROOT}}blog/">← All articles</a><p class="blog-meta">${esc(post.author)} · <time datetime="${esc(post.date)}">${esc(displayDate(post.date))}</time></p><h1 class="display">${esc(post.title)}</h1><div class="prose">${sample}${bodyFile(post.bodyFile)}</div></div></article>`,false,post);
}
render('404.html',{title:'Page Not Found | Super Websites',description:'This page could not be found. Return to Super Websites.'},'<section class="section content-page"><div class="wrap"><p class="fine">404</p><h1 class="display">This page has flown<br>out of reach.</h1><p class="lede">Let’s get you back to the website.</p><a class="btn" href="{{ROOT}}">Back to home ↗</a></div></section>',true);
write('robots.txt',`User-agent: *\nAllow: /\n${mode==='production'?'Sitemap: '+new URL('sitemap.xml',base).href+'\n':'# Preview pages carry noindex; allow crawling so that rule can be read.\n'}`);
if(mode==='production')write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${documents.map(url=>`<url><loc>${esc(url)}</loc></url>`).join('')}</urlset>`);
const inline=[...new Set(rendered.flatMap(html=>[...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].filter(m=>m[1]).map(m=>`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`)))];
const endpointOrigin=config.formEndpoint?new URL(config.formEndpoint).origin:'';
// Cloudflare Pages applies these headers; GitHub Pages ignores this configuration.
write('_headers',`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self' ${inline.join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ${endpointOrigin}; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/styles-v1.5.5.css\n  Cache-Control: public, max-age=31536000, immutable\n/app-v1.5.1.js\n  Cache-Control: public, max-age=31536000, immutable\n/enquiry-v1.5.1.js\n  Cache-Control: public, max-age=31536000, immutable\n/cost-animation-v1.5.1.js\n  Cache-Control: public, max-age=31536000, immutable\n`);
write('.nojekyll','');
console.log(JSON.stringify({version:'1.5.6',mode,publishedPages:documents.length,output:path.relative(project,output)||'.',productionDomainConfigured:!!config.siteUrl,enquiryConfigured:!!(config.formEndpoint||config.contactEmail)}));
