// Super Websites enquiry service v1.7.1.
// Fixed recipient + authenticated sender; visitor address is Reply-To only.
export const VERSION = '1.7.1';
const ORIGIN = 'https://superwebsites.co.nz';
const RECIPIENT = 'hello@superwebsites.co.nz';
const MAX_BYTES = 16384;
const TYPES = new Set(['New business website', 'Refresh an existing website', 'Landing page', 'Website with bookings or a shop', 'Something else']);
const EMAIL = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i;
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

function reply(status, body, cors = false, extra = {}) {
  return new Response(JSON.stringify(body), {status, headers: {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', Vary: 'Origin',
    ...(cors ? {'Access-Control-Allow-Origin': ORIGIN} : {}), ...extra
  }});
}

async function readBody(request) {
  const declared = request.headers.get('content-length');
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > MAX_BYTES)) throw new Error('size');
  if (!request.body) throw new Error('json');
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) {await reader.cancel(); throw new Error('size');}
      chunks.push(value);
    }
  } finally {reader.releaseLock();}
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {bytes.set(chunk, offset); offset += chunk.byteLength;}
  const data = JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes));
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('json');
  return data;
}

function fieldsFrom(data) {
  const fields = {};
  for (const [key, max] of Object.entries({name:120,email:254,business:100,type:100,website:200,goal:1500,company_url:200})) {
    if (data[key] !== undefined && typeof data[key] !== 'string') throw new Error('field');
    const value = (data[key] || '').trim();
    if (value.length > max || CONTROL.test(value) || (key !== 'goal' && /[\r\n]/.test(value))) throw new Error('field');
    fields[key] = value;
  }
  if (fields.company_url) throw new Error('spam');
  if (!fields.name || !fields.business || !fields.goal || !EMAIL.test(fields.email) || !TYPES.has(fields.type)) throw new Error('field');
  return fields;
}

export function enquiryMessage(fields, reference, sender) {
  if (!/^website@forms\.superwebsites\.co\.nz$/.test(sender || '')) throw new Error('sender');
  return {
    to: [RECIPIENT],
    from: `Super Websites enquiries <${sender}>`,
    reply_to: fields.email,
    subject: `Website enquiry — ${fields.business}`,
    text: `NEW SUPER WEBSITES ENQUIRY\nReference: ${reference}\n\nName: ${fields.name}\nEmail: ${fields.email}\nBusiness: ${fields.business}\nProject: ${fields.type}\nExisting website: ${fields.website || 'None supplied'}\n\nWhat should the website help them do?\n${fields.goal}\n\nReply to this email in Zoho to contact ${fields.name}.`
  };
}

// The provider URL and recipient are fixed; credentials remain server-side.
async function sendResend(message, reference, apiKey, providerFetch, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await providerFetch('https://api.resend.com/emails', {
      method: 'POST', redirect: 'error', signal: controller.signal,
      headers: {'Content-Type':'application/json', Authorization:`Bearer ${apiKey}`,
        'Idempotency-Key':`sw-enquiry-${reference}`},
      body: JSON.stringify(message)
    });
    if (!response.ok) throw new Error('provider');
    const result = await response.json();
    if (typeof result?.id !== 'string' || !result.id.trim() || result.error || result.name) throw new Error('provider');
  } finally {clearTimeout(timer);}
}

// Dependency injection keeps tests offline; production always uses native fetch.
export function createWorker(providerFetch = fetch, timeoutMs = 8000) {
 return {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/enquiry' && url.pathname !== '/health') return reply(404, {success:false});
    const configured = env.ENQUIRIES_ENABLED === 'true' && env.SENDER_EMAIL === 'website@forms.superwebsites.co.nz'
      && typeof env.RESEND_API_KEY === 'string' && /^re_[A-Za-z0-9_-]+$/.test(env.RESEND_API_KEY)
      && typeof env.ENQUIRY_RATE_LIMIT?.limit === 'function';
    if (url.pathname === '/health') {
      if (request.method !== 'GET') return reply(405, {success:false}, false, {Allow:'GET'});
      // Configuration presence is not proof of verified sender or inbox delivery.
      return reply(configured ? 200 : 503, {version:VERSION, configured});
    }
    const allowedOrigin = request.headers.get('Origin') === ORIGIN;
    if (!allowedOrigin) return reply(403, {success:false, error:'Request origin not allowed.'});
    if (request.method === 'OPTIONS') {
      if (request.headers.get('Access-Control-Request-Method') !== 'POST') return reply(405, {success:false}, true);
      return new Response(null, {status:204,headers:{
        'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Methods':'POST',
        'Access-Control-Allow-Headers':'Content-Type, Accept', 'Access-Control-Max-Age':'600', Vary:'Origin'
      }});
    }
    if (request.method !== 'POST') return reply(405, {success:false}, true, {Allow:'POST, OPTIONS'});
    if (!configured) return reply(503, {success:false,error:'Enquiries are temporarily unavailable. Please try again.'}, true);
    if (url.protocol !== 'https:') return reply(400, {success:false}, true);
    if ((request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase() !== 'application/json') return reply(415, {success:false}, true);
    const ip = request.headers.get('CF-Connecting-IP');
    if (!ip) return reply(400, {success:false}, true);
    try {
      // Workers injects CF-Connecting-IP. Limit is per client per Cloudflare location.
      const limit = await env.ENQUIRY_RATE_LIMIT.limit({key:`sw-enquiry:${ip}`});
      if (!limit.success) return reply(429, {success:false,error:'Please wait a minute before trying again.'}, true, {'Retry-After':'60'});
    } catch {return reply(503, {success:false,error:'Please try again shortly.'}, true);}
    let fields;
    try {fields = fieldsFrom(await readBody(request));}
    catch (error) {return reply(error.message === 'size' ? 413 : 400, {success:false,error:'Please check the form fields and try again.'}, true);}
    const reference = crypto.randomUUID();
    try {
      // Await provider acceptance; never report success for a failed send.
      await sendResend(enquiryMessage(fields, reference, env.SENDER_EMAIL), reference, env.RESEND_API_KEY, providerFetch, timeoutMs);
      return reply(200, {success:true,reference}, true);
    } catch {
      // Do not log form content, addresses, IPs, provider errors or credentials.
      console.error('enquiry_send_failed', reference);
      return reply(502, {success:false,error:'We could not confirm delivery. Please try again.'}, true);
    }
  }
 };
}
export default createWorker();
