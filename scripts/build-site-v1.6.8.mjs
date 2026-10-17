// Super Websites v1.6.8 | Dependency-free shared-page builder and production gate.
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
if(config.socialProfiles&&(!Array.isArray(config.socialProfiles)||config.socialProfiles.some(s=>!s||!s.name||!/^https:\/\/[^\s"<>]+$/.test(s.url||''))))throw Error('Social profiles need a name and an https URL.');
if(config.contactPhone&&!/^\+64[\d ]{8,13}$/.test(config.contactPhone))throw Error('Public phone must be in +64 format.');
if(config.contactEmail&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.contactEmail))throw Error('Public enquiry email is invalid.');
if(config.version!=='1.6.8'||!config.title||!config.description||!config.name)throw Error('Site configuration needs version 1.6.8, title, description and name.');
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
for(const filename of ['styles-v1.6.8.css','app-v1.5.1.js','enquiry-v1.5.1.js','cost-animation-v1.5.1.js','back-to-top-v1.5.8.js'])if(output!==project)fs.copyFileSync(path.join(project,filename),path.join(output,filename));
function render(route,page,main,is404=false,article=null){
  const depth=route.split('/').filter(Boolean).length-(route.endsWith('.html')?1:0);
  const root=is404?base.pathname:'../'.repeat(depth);
  const url=new URL(route,base).href;
  const contactReady=!!(config.formEndpoint||config.contactEmail);
  const phoneLink=config.contactPhone?`<a class="public-email public-phone" href="tel:${esc(config.contactPhone.replace(/[^+\d]/g,''))}">${esc(config.contactPhoneDisplay||config.contactPhone)}</a>`:'';
  // v1.6.8: showContactEmail:false keeps the address behind the email-draft form only (no footer link, no schema email).
  const showEmail=config.showContactEmail!==false;
  const emailLink=showEmail&&config.contactEmail?`<a class="public-email" href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a>`:'';
  const publicContact=(emailLink||phoneLink||config.serviceArea)?`<div class="public-contact">${emailLink}${phoneLink}${config.serviceArea?`<p class="footer-area">${esc(config.serviceArea)}</p>`:''}</div>`:'';
  const guides=activePages.filter(p=>p.footer===true);
  const footerGuides=guides.length?`<nav class="footer-guides" aria-label="Guides"><p>Guides</p><ul>${guides.map(p=>`<li><a href="${root}${esc(p.slug)}/"${route===p.slug+'/'?' aria-current="page"':''}>${esc(p.footerLabel||p.navLabel||p.title)}</a></li>`).join('')}</ul></nav>`:'';
  const socials=config.socialProfiles||[];
  // v1.6.8: brand logos (Simple Icons, CC0) instead of text; unknown networks fall back to their name.
  const socialIcons={Facebook:'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',Instagram:'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',LinkedIn:'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',YouTube:'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'};
  const footerSocial=socials.length?`<ul class="footer-social" aria-label="Super Websites on social media">${socials.map(s=>`<li><a href="${esc(s.url)}" rel="me noopener" target="_blank"${socialIcons[s.name]?` aria-label="Super Websites on ${esc(s.name)}" title="${esc(s.name)}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${socialIcons[s.name]}"/></svg>`:`>${esc(s.name)}`}</a></li>`).join('')}</ul>`:'';
  const contactNotice=config.formEndpoint?'Tell us about your project. We’ll use these details to respond to your enquiry.':config.contactEmail?'Tell us about your project. The button opens an email draft for you to send.':'Prepare a project brief you can save. This preview does not send enquiries.';
  const nav=activePages.filter(p=>p.nav!==false).map(p=>`<a href="${root}${esc(p.slug)}/"${route===p.slug+'/'?' aria-current="page"':''}>${esc(p.navLabel||p.title)}</a>`).join('');
  const versions=mode==='preview'?`<nav class="version-links" aria-label="Demo versions"><a href="${root}versions/v1.6.8/">v1.6.8</a><a href="${root}versions/v1.6.7/">Previous: v1.6.7</a></nav>`:'';
  const entity={'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':base.href+'#organization',name:config.name,url:base.href,logo:new URL('assets/logo-640-v1.5.0.webp',base).href},{'@type':'WebSite','@id':base.href+'#website',name:config.name,url:base.href,publisher:{'@id':base.href+'#organization'}},{'@type':article?'BlogPosting':'WebPage','@id':url+'#page',url,name:page.title,description:page.description,inLanguage:'en-NZ',isPartOf:{'@id':base.href+'#website'}}]};
  if(article)Object.assign(entity['@graph'][2],{headline:page.title,datePublished:article.date,author:article.author===config.name?{'@id':base.href+'#organization'}:{'@type':'Person',name:article.author},publisher:{'@id':base.href+'#organization'}});
  if(showEmail&&config.contactEmail)entity['@graph'][0].email=config.contactEmail;
  if(socials.length)entity['@graph'][0].sameAs=socials.map(s=>s.url);
  if(config.contactPhone)entity['@graph'][0].telephone=config.contactPhone;
  if(config.areaServed&&config.areaServed.length){entity['@graph'][0].areaServed=config.areaServed.map(a=>a==='New Zealand'?{'@type':'Country',name:a}:{'@type':'Place',name:a});entity['@graph'][0].address={'@type':'PostalAddress',addressRegion:'Otago',addressCountry:'NZ'};}
  const indexing=mode==='production'&&!is404;
  const share=new URL(config.socialImage,base).href;
  const head=`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#7b3fe4"><meta name="robots" content="${indexing?'index,follow':'noindex,follow'}"><meta name="application-version" content="1.6.8"><title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}">${indexing?`<link rel="canonical" href="${esc(url)}">`:''}<meta property="og:locale" content="en_NZ"><meta property="og:type" content="${article?'article':'website'}"><meta property="og:site_name" content="${esc(config.name)}"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${esc(share)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:alt" content="Super Websites purple and yellow shield. Your website. Owned by you. No required monthly plan."><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(page.title)}"><meta name="twitter:description" content="${esc(page.description)}"><meta name="twitter:image" content="${esc(share)}"><meta name="twitter:image:alt" content="Super Websites purple and yellow shield. Your website. Owned by you. No required monthly plan."><link rel="icon" href="${root}assets/favicon-v1.2.1.png" type="image/png"><link rel="apple-touch-icon" sizes="180x180" href="${root}assets/apple-touch-icon-v1.0.png"><link rel="manifest" href="${root}assets/site-v1.0.webmanifest"><link rel="preload" href="${root}assets/BarlowCondensed-ExtraBoldItalic-v1.5.0.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${root}styles-v1.6.8.css"><script type="application/ld+json">${json(entity)}</script>`;
  const values={...partials,HEAD:head,MAIN:main,ROOT:root,EXTRA_NAV:nav,VERSION_LINKS:versions,FOOTER_LABEL:`© ${new Date().getUTCFullYear()} Super Websites${mode==='preview'?' · Preview v1.6.8':''}`,FORM_INTRO:contactNotice,FORM_ACTION:config.formEndpoint?'Send enquiry':config.contactEmail?'Open email draft':'Prepare my brief',CONTACT_REQUIRED:contactReady?'required':'',PUBLIC_CONTACT:publicContact,FOOTER_GUIDES:footerGuides,FOOTER_SOCIAL:footerSocial,RUNTIME:json({version:'1.6.8',mode,formEndpoint:config.formEndpoint,contactEmail:config.contactEmail})};
  let html=layout;
  for(let pass=0;pass<3;pass++)html=html.replace(/\{\{([A-Z_]+)\}\}/g,(whole,key)=>values[key]??whole);
  if(/\{\{[A-Z_]+\}\}/.test(html))throw Error('Unresolved layout token.');
  const file=route.endsWith('.html')?route:route+'index.html';write(file,html);if(!is404)documents.push(url);
  rendered.push(html);
  return html;
}
const homeBody=fs.readFileSync(path.join(project,'src/home.html'),'utf8');
render('',{title:config.title,description:config.description},homeBody);
if(mode==='preview')render('versions/v1.5.9/',{title:config.title,description:config.description},homeBody);
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
write('_headers',`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self' https://static.cloudflareinsights.com ${inline.join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com ${endpointOrigin}; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/styles-v1.6.8.css\n  Cache-Control: public, max-age=31536000, immutable\n/app-v1.5.1.js\n  Cache-Control: public, max-age=31536000, immutable\n/enquiry-v1.5.1.js\n  Cache-Control: public, max-age=31536000, immutable\n/cost-animation-v1.5.1.js\n  Cache-Control: public, max-age=31536000, immutable\n/back-to-top-v1.5.8.js\n  Cache-Control: public, max-age=31536000, immutable\n`);
write('.nojekyll','');
console.log(JSON.stringify({version:'1.6.8',mode,publishedPages:documents.length,output:path.relative(project,output)||'.',productionDomainConfigured:!!config.siteUrl,enquiryConfigured:!!(config.formEndpoint||config.contactEmail)}));
