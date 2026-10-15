# Super Websites launch preparation — v1.5.0

The GitHub Pages demo remains a noindex preview. Production is a separate, generated static website. The purple/gold identity, floating superheroes, chain-break intro, form-opening animation, pricing and cost comparison are preserved. There is no runtime framework, dependency installation, CMS subscription or tracking script.

## Editing and previewing

Use Node 20 or newer. No npm installation is needed.

```sh
npm run build
npm run check
```

This creates `site-dist/`. To update the committed GitHub Pages demo, run `npm run build:preview`, then commit the generated root files and the source changes together. Use an HTTP preview/deployment; the JavaScript modules do not run from `file://`.

Edit `src/home.html` for home content and `src/partials/` for shared navigation, footer, enquiry dialog and intro. `src/layout.html` supplies the shared document. Do not edit generated `index.html` independently. Use a fresh version for changed CSS, JS or images; preserve old versioned assets and immutable snapshots. The v1.5.0 builder recreates its own preview snapshot; do not rerun an old-version builder after that version is superseded.

## Adding About, Blog or other pages

The entries in `content/pages.json` are unpublished. They produce no page, navigation link or sitemap entry until `published` is true and content is supplied. About/Blog titles and descriptions are editable configuration, not final copy. Do not promote content training, AI training or website self-building offers without a later business decision. Existing FanCast and Camera Academy links are portfolio examples only.

For a normal page, add a reviewed HTML body under `src/pages/` and set `bodyFile`, for example `src/pages/about.html`. Supply `slug`, `navLabel`, `title`, `description` and `published`. The layout generates one H1 from the title; body content should begin at H2. Use `{{ROOT}}` for links to local assets and other pages. Content HTML is trusted repository source; do not insert untrusted submissions or raw user-authored HTML.

Blog posts go in `content/posts.json`: `slug`, `title`, `description`, `date` (YYYY-MM-DD), `author`, `bodyFile` under `src/`, and `published`. Publish the Blog entry before publishing posts. The blog automatically lists published posts in newest-first order and creates `/blog/<slug>/` pages with BlogPosting metadata. An empty blog needs introductory content before it can publish. Avoid filler or thin posts: publish useful, original advice when it is ready. A new ordinary page can use the same structure; review navigation fit as the page count grows.

## Final domain and enquiry details

Set `siteUrl` in `site.config.json` to the final HTTPS business domain. Leave `previewUrl` pointing to the demo. Set either a public `contactEmail` or a genuine `formEndpoint`:

- Public email: the form opens a populated email draft. The visitor sends it in their email app. The website cannot confirm delivery. The footer also shows a normal email link.
- Endpoint: the form POSTs JSON containing `name`, `email`, `business`, `type`, `website`, `goal`, `company_url`, `source` and `version`. The server must validate lengths/email and the honeypot, apply rate limiting, handle spam, and deliver/store the enquiry. It must return HTTP 2xx, `Content-Type: application/json` and `{ "success": true }` **only after accepting it for delivery**. A bare 200 or HTML response does not show success. If external, allow the production site's origin and POST/Content-Type CORS preflight. Keep mail/API secrets on the server, never in this repository. A failed or timed-out request preserves the brief for copying/retry.
- With neither configured, this remains a local brief builder. No data is sent. Production builds refuse to proceed without a final domain and a contact method.

Enquiry details are not written to browser storage. The intro uses one tab-session flag. Check the chosen server's actual handling/retention and add an accurate privacy notice if necessary before collecting live enquiries. No enquiry backend is included in this release, and no account-profile email has been assumed as the public address.

## Building for launch

```sh
npm run build:production
npm run check
```

Publish **only `site-dist/`**, not the repository root. Production generates canonical URLs, Organization/WebSite/WebPage metadata (BlogPosting for posts), Open Graph/Twitter tags, `robots.txt`, `sitemap.xml`, custom 404 and `.nojekyll`. Draft pages and archived demos are excluded. A separate output avoids accidentally indexing the demo's historical files or publishing source content as pages.

For Cloudflare Pages, use build command `npm run build:production`, Node 20+, and output `site-dist`. DNS/custom-domain setup and HTTPS verification still need the final chosen domain. `_headers` adds security headers and long caching for versioned assets on Cloudflare Pages; **GitHub Pages does not apply this file**. CSP permits only this build's inline script hashes and the configured enquiry origin. Rebuild after editing inline scripts; do not hand-edit generated HTML after building. Keep HTML caching short at the host and add HSTS only after the final HTTPS domain/redirects are confirmed.

If choosing GitHub Pages for production, use a build-and-deploy workflow that uploads `site-dist/` and configure the custom domain there; do not point production at the existing branch/root demo or expect Cloudflare headers to apply. No custom-domain records, paid hosting or live services were configured as part of this preparation.

## Final checks on the real host

Confirm preferred hostname redirects, HTTPS, valid canonical URLs and sitemap, real form/email delivery, mobile layout, keyboard/focus behavior and readable prices/disclaimers. Run Lighthouse/PageSpeed on the deployed domain and verify Core Web Vitals with real traffic. Register/verify the domain in Google Search Console and submit its sitemap. These steps cannot be inferred from a local source check; this release claims no measured Lighthouse score, search ranking or live enquiry delivery.
