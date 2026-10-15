// Super Websites v1.5.1 | No service receives data until an endpoint is configured.
export function projectBrief(fields) {
  return 'SUPER WEBSITES / PROJECT BRIEF\n\nName: ' + fields.name
    + '\nEmail: ' + fields.email + '\nBusiness: ' + fields.business
    + '\nProject: ' + fields.type + '\nExisting website: ' + (fields.website || 'None supplied')
    + '\n\nWhat I want the website to do:\n' + fields.goal
    + '\n\nPreference: A website I own, without a required ongoing website subscription.';
}

export async function sendEnquiry(endpoint, fields, fetcher = globalThis.fetch, timeoutMs = 15000) {
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || url.username || url.password) throw Error('Invalid enquiry endpoint.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(url.href, {
      method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      credentials: 'omit', redirect: 'error', signal: controller.signal,
      body: JSON.stringify({...fields, source: 'super-websites', version: '1.5.1'})
    });
    if (!response.ok || !(response.headers.get('content-type') || '').includes('application/json')) throw Error('Enquiry was not accepted.');
    const receipt = await response.json();
    if (receipt.success !== true) throw Error('Enquiry was not accepted.');
  } finally {
    clearTimeout(timeout);
  }
}
