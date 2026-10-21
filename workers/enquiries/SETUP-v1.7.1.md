# Super Websites enquiry service v1.7.1

This version replaces the v1.7.0 native Cloudflare email binding with Resend. The website frontend remains v1.7.0, with automatic sending disabled until real inbox delivery has been confirmed.

## Confirmed setup and boundaries

- Recipient: `hello@superwebsites.co.nz` in the shared Zoho inbox.
- Sender: `Super Websites enquiries <website@forms.superwebsites.co.nz>`.
- Reply-To: the validated visitor email. Dave and Patrick use Reply in Zoho as normal. No automatic visitor acknowledgement is sent.
- Patrick's screenshot confirmed Resend's `forms.superwebsites.co.nz` sending domain verified on 21 October 2026, Tokyo region. DNS records were added through Resend's Cloudflare configuration flow. Apex Zoho DNS records must remain intact.
- Cloudflare Email Routing onboarding proposed apex MX changes and was abandoned before activation. Do not use the old v1.7.0 setup guide or native email binding for this release. The verified Cloudflare destination is no longer required for Resend sending.
- No Resend key, Cloudflare credential, visitor content or IP is stored in git. Mock tests send no email.

## Deploy the standalone Worker

Keep the existing Cloudflare Pages website connected exactly as it is. Create a separate Worker from the same GitHub repository:

| Setting | Value |
| --- | --- |
| Repository | `SuperWebsitesNZ/SWwebsite` |
| Production branch | `main` |
| Worker name | `sw-enquiries` |
| Root directory | repository root (blank or `/`) |
| Build command | blank (no compilation needed) |
| Deploy command | `npm run deploy:enquiries` |

The package command invokes `npx wrangler@4 deploy --config workers/enquiries/wrangler-v1.7.1.jsonc`. This explicit config deploys only the Worker, adds `enquiries.superwebsites.co.nz` as a custom domain and sets its native rate-limit binding. It does not publish or replace the Pages website. Disable non-production branch preview builds for this Worker unless a separate preview config is introduced.

The configuration sets `ENQUIRIES_ENABLED:true`, but the handler returns 503 until its runtime secret and rate limiter are present. A redeploy preserves existing Worker secrets. Namespace `170001` is intended for this service only; if already used by another rate limiter on this account, select an unused namespace and version that change before deployment.

## Add the Resend runtime secret

1. In Resend, create a key named `SW website enquiries`, with **Sending access**, restricted to **forms.superwebsites.co.nz**. Save it privately. Do not paste or screenshot its value into chat.
2. In Cloudflare, open the **sw-enquiries Worker**, then **Settings → Variables and Secrets → Add**. Choose **Secret**, name it `RESEND_API_KEY`, and paste the key as its value. Save/deploy it. This must be a **runtime secret**, not a build-only variable or a Pages variable.
3. CLI alternative: from the repository root, `npx wrangler@4 secret put RESEND_API_KEY --config workers/enquiries/wrangler-v1.7.1.jsonc`. Enter the key only at Wrangler's secret prompt.
4. Open `https://enquiries.superwebsites.co.nz/health`. Expect HTTP 200 with `{"version":"1.7.1","configured":true}`. This checks configuration presence only; it does not verify actual provider acceptance, sender verification or inbox delivery.

## Real delivery test, then website activation

Submit one clearly labelled test to `/api/enquiry` with the production website Origin and a real visitor address controlled by Patrick or Dave. Confirm the message actually arrives in Zoho and that clicking Reply selects the visitor address. Resend's success ID only establishes provider acceptance; check the inbox as well. Do not send to arbitrary or invented recipients.

After inbox confirmation, create the next website patch release, set `formEndpoint` to `https://enquiries.superwebsites.co.nz/api/enquiry`, set `enquiryDeliveryVerified:true`, and run production build/check/tests before publishing. Leave `contactEmail` as `hello@superwebsites.co.nz`. The existing app will show Send enquiry and submit JSON without opening a draft. Review the generated CSP to ensure the endpoint is allowed (the builder derives it from the configured URL).

## Safeguards and rollback

- Fixed Resend API URL, recipient and authenticated sender; validated visitor Reply-To; text-only email; unknown recipient/sender fields are ignored.
- Same bounded 16 KiB streamed reading, required fields/type allowlist, header-newline rejection, Origin check, honeypot and five requests per IP per minute per Cloudflare location as v1.7.0. Origin is not authentication, and rate limits are not a complete bot challenge.
- Resend requests time out after eight seconds and reject redirects. Success requires a 2xx response with a nonempty message ID; HTTP errors, malformed responses, network errors and timeouts return success:false. No automatic retry occurs. A unique provider idempotency key protects retries of the same outbound request; a fresh visitor submission creates a new reference and can still duplicate a previously accepted send.
- Errors log only a generic label and random reference. Automatic Worker observability remains disabled. Resend may retain email/log data under its account settings; no visitor database is introduced by this application.
- Rollback website: clear `formEndpoint`, set `enquiryDeliveryVerified:false`, rebuild and deploy. This restores the existing email-draft form. Disabling/deleting the separate Worker does not change Zoho's mailbox routing.

## Validation and sources

`npm test` includes `scripts/test-enquiry-worker-v1.7.1.mjs`, with mocked Resend success, rejection, malformed payload, network failure, timeout, address boundaries and log checks. `npm run build:production` and `npm run check` validate the unchanged frontend. Offline checks are not a delivery test.

Official references checked 21 October 2026:
- https://resend.com/docs/api-reference/emails/send-email
- https://resend.com/docs/dashboard/api-keys/introduction
- https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
