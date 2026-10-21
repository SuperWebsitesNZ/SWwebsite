# Super Websites enquiry delivery v1.7.0

Recipient: **hello@superwebsites.co.nz**. Sender: **website@forms.superwebsites.co.nz**. Visitor email is **Reply-To**, so Dave/Patrick reply normally in Zoho. There are no automatic customer emails, Zoho passwords, API keys or stored enquiry databases in this implementation.

## Current status

The code and offline checks are prepared. The live website continues opening a draft until Cloudflare is configured and a real test is received in Zoho. Do not set the production endpoint before this test. No real email was sent during the offline tests.

## Cloudflare setup

1. Verify `hello@superwebsites.co.nz` under Email Service → Email Routing → Destination Addresses. Use the verification link received in Zoho. This is an account-level destination, not a request to change the domain’s incoming mail provider.
2. Set up a routing-enabled sender subdomain, `forms.superwebsites.co.nz`, for the verified-recipient free sending path. The native free path sends only from an Email Routing domain. **Keep the apex Zoho MX, SPF, DKIM and DMARC records intact.** If the dashboard demands replacing the apex Zoho MX records or buying the arbitrary-recipient sending plan, stop and inspect the available subdomain setup; do not replace the mailbox provider. The separate paid Email Sending product is not required for this fixed verified recipient.
3. Deploy this Worker using `npx wrangler deploy --config workers/enquiries/wrangler-v1.7.0.jsonc` from the repository root. It has a recipient-restricted `ENQUIRY_EMAIL` binding, and `ENQUIRY_RATE_LIMIT` allows five requests per IP per minute per Cloudflare location. Namespace `170001` is reserved for this service. Choose a different unused integer if it is already used on the account.
4. Set `ENQUIRIES_ENABLED` to the string `true` in the Worker vars once the sender/destination are verified; redeploy. Keep the versioned config in sync with the chosen enabled state so later deployments do not accidentally disable sending.
5. Check `https://enquiries.superwebsites.co.nz/health`. `configured:true` only confirms bindings and the enable flag; it does not prove email verification or delivery.
6. With the user’s authorization, submit a clearly labelled test enquiry to `/api/enquiry` from the real website origin. Check the message arrives in Zoho and Reply addresses the test visitor. A send API success alone is insufficient evidence of inbox arrival. The client form uses the same payload; no recipient can be supplied by a visitor.
7. After a real message has arrived, set these production fields in `site.config.json` and rebuild/deploy the website:

```json
{
  "formEndpoint": "https://enquiries.superwebsites.co.nz/api/enquiry",
  "enquiryDeliveryVerified": true
}
```

`contactEmail` stays `hello@superwebsites.co.nz`. The existing form automatically changes to **Send enquiry**, posts the details, and shows success only on a successful JSON response. On failure it preserves the brief for copying/retry. It does not claim inbox delivery. The new builder refuses a production endpoint without the explicit verification flag.

## Safeguards and limits

- Fixed destination, fixed authenticated sender, visitor Reply-To, text-only email.
- Server-side validation of all fields, no header newlines, 16 KiB streamed request limit, required production Origin, honeypot and native rate limiting. CORS is not authentication; the rate limiter/honeypot reduce basic spam but are not a full bot challenge. Turnstile can be added if abuse warrants it.
- No enquiry content, email addresses or IPs logged by the handler. A random reference is logged on send failures. Worker automatic observability is disabled in the supplied config.
- No automatic retries after a send failure/timeout: a request might have been accepted before the connection broke. A visitor-initiated retry could produce a duplicate.
- Rollback: clear `formEndpoint` and set `enquiryDeliveryVerified:false` in the site config, then rebuild. This restores the email-draft method. Disabling the Worker does not alter Zoho.

## Checks

`node scripts/test-enquiry-worker-v1.7.0.mjs` runs isolated mocked sending checks. The site’s `npm test` includes them. `npm run build:production` and `npm run check` retain the existing site validations. No Cloudflare credential is committed.

Official references checked 21 October 2026:
- https://developers.cloudflare.com/email-service/platform/pricing/
- https://developers.cloudflare.com/email-service/platform/limits/
- https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/
- https://developers.cloudflare.com/email-service/configuration/subdomains/
- https://developers.cloudflare.com/email-service/configuration/send-bindings/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
