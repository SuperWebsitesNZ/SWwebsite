# Super Websites v1.8.0

v1.8.0: Cromwell and Wānaka pages, a cost calculator on /website-cost-nz/ (page-level `scripts` in content/pages.json), and four blog posts on GEO and running costs. Build/check/build-test entry points are v1.8.0.

## Contact form — v1.7.4

The live contact form sends enquiries automatically to `hello@superwebsites.co.nz` through the verified Resend enquiry service v1.7.3. Patrick confirmed the labelled setup email arrived in Zoho and its Reply-To worked before activation. Each enquiry uses the visitor’s submitted email as Reply-To. Patrick and Dave reply from `patrick@superwebsites.co.nz` or `dave@superwebsites.co.nz` in Zoho. The test Gmail address is not a live form recipient.

## Direct enquiry delivery — site v1.7.4 / service v1.7.3

`site.config.json` sets `formEndpoint` to `https://enquiries.superwebsites.co.nz/api/enquiry` and `enquiryDeliveryVerified:true`. The frontend reports sending only after server acceptance and preserves a copyable project brief if sending fails. The CSP permits the enquiry origin. Build/check/build-test scripts and app are v1.7.4; styling remains v1.6.8.

The separate Worker fixes the destination and authenticated sender, sets visitor Reply-To, validates inputs, rate limits, and times out provider requests after eight seconds. Deployment and runtime secret instructions: `workers/enquiries/SETUP-v1.7.3.md`. `npm run deploy:enquiries` deploys the Worker; Cloudflare Pages continues to use `npm run build:production` and `site-dist`. Secrets stay in runtime configuration. Apex mail records stay with Zoho; do not activate Cloudflare Email Routing there.

Validation: `npm run build:production`, `npm run check`, `npm test`, and `npm run test:worker:runtime`. Offline tests never send real email. To restore the draft fallback, revert the v1.7.4 activation commit, including its configuration, build/test scripts and generated files. The shared Zoho address remains the draft recipient.

## Previous: v1.6.8

v1.6.8: `showContactEmail: false` hides the enquiry email from the footer and schema; the email-draft form still uses `contactEmail`. Build/check/build-test entry points are v1.6.8.

## Copy — v1.6.7

Home "Stop paying rent" lede reworded.

## Social logos — v1.6.6

Footer social links are logos.

## SEO and AI search — v1.6.5

v1.6.5: SEO and AI search messaging (home "Built to be found" section, FAQ, /seo-and-ai-search/ guide, "Basic SEO" renamed). 

## Search fixes — v1.6.4

Home H1 carries the service line, About location now Central Otago, blog meta and post title fixes.

## Social profiles — v1.6.3

Footer social profile links and Organization sameAs.

## Analytics, contrast and image sizes — v1.6.1

CSP allows Cloudflare Web Analytics; "+ GST" on the featured price card is white; 600px hero variants and a 100px shield cut phone image weight. Build/check/build-test entry points are v1.6.1.


## SEO pages — v1.6.0

Six guide pages live in `src/pages/*-v1.6.0.html` and `content/pages.json`. `nav: false` keeps a page out of the header; `footer: true` (+ `footerLabel`) lists it in the footer Guides row. Build/check/build-test entry points are v1.6.0; JS modules unchanged.


## Local SEO — v1.5.9

Home title and meta description name Central Otago and New Zealand; the hero service line adds the service area. The footer shows email, phone and a service-area line from `site.config.json` (`contactPhone`, `contactPhoneDisplay`, `serviceArea`, `areaServed`), and Organization schema adds telephone, areaServed and an Otago/NZ address. Source: `scripts/build-site-v1.5.9.mjs`, `styles-v1.5.9.css`, `src/home.html`, `content/pages.json`. JS modules unchanged.


## Back to top — v1.5.8

A small fixed bottom-right arrow appears after 500px of scrolling on all active pages. Source: `back-to-top-v1.5.8.js`, `src/layout.html` and `styles-v1.5.8.css`. The control respects reduced-motion and Pause motion, device safe areas, keyboard focus and modal/menu overlays. Build/check/build-test entry points are v1.5.8; the existing app/enquiry/chart modules remain unchanged.

## Profile name — v1.5.7

Patrick’s profile heading and portrait alternative text now use Patrick Timm. Current About source and builder/build-test scripts are v1.5.7; existing styles/checker remain v1.5.5.

## Profile order — v1.5.6

Dave now appears first on the About page in document order, including mobile and assistive technology. Current About source and builder/build-test scripts are v1.5.6; existing v1.5.5 styles and checker are reused unchanged.

## About page — v1.5.5 (15 October 2026)

- Published `/about/` with shared navigation, canonical metadata and sitemap inclusion. Source: `src/pages/about-v1.5.5.html`; publication: `content/pages.json` (`layout: "full"` allows a page to supply its own semantic sections and heading).
- Both supplied portraits are compressed WebP files. CSS makes both circular without altering the original photographs. The page links both founders’ outside work and retains the Super Websites visual identity.
- Dave’s background sources, checked 15 October 2026: <https://fancast.co.nz/about> and <https://www.cameracademy.com/instructors>. His bio is paraphrased; review counts, awards, client results and unsupported personal claims are not reused. Patrick’s role and search-and-rescue information were supplied directly for this page.
- Current builder/check/build tests and styles: v1.5.5. Interaction JS remains v1.5.1. `npm run build:production`, `npm run check`, `npm test` validate the current site. Previous versioned files and diagnostics are preserved.

## Sharing assets — v1.5.4 (15 October 2026)

- Shared source builder/check/build tests: `scripts/*-v1.5.4.mjs`. Styling remains `styles-v1.5.3.css`; interactions remain v1.5.1.
- The supplied `assets/social-wide-v1.0.jpg` is the default Open Graph and Twitter/X card on all active pages. Each page keeps its own title, description and canonical URL. Declared image type and dimensions match the actual JPEG (1200×630).
- Existing favicon and site logo are preserved. Added the pack’s solid Apple touch icon plus browser-shortcut manifest/icons. Manifest paths are relative for both the production root and preview subpath. This adds no service worker or offline behavior.
- Alternate square/profile exports remain available in the supplied ZIP for manual social/profile uploads; duplicate full-size logo and PNG sharing exports are not added to page downloads.
- Production still uses `npm run build:production` → `site-dist`. Run `npm run check` and `npm test` after building. Social platforms can cache previous previews; crawler access remains a separate hosting concern.

## Production pricing update — v1.5.3 (15 October 2026)

Patrick explicitly instructed these prices to be published in **SuperWebsitesNZ/SWwebsite**. Production target: **https://superwebsites.co.nz/**. Current deployment uses Cloudflare Pages, `main`, `npm run build:production`, output `site-dist`; the existing verification workflow runs the current package scripts. Email-draft enquiries still use the configured temporary address. SWdemo1/SWdemo2 are separate and unchanged.

- One-page website **NZ$1,500 + GST**, with design, copywriting from basic customer information, mobile responsiveness, basic SEO and a standard contact form.
- Up-to-five-page website **NZ$2,950 + GST**, with everything above, copywriting for all five pages, Google Business Profile setup and a photo gallery.
- All eight supplied add-ons are displayed with exact prices, From qualifiers and the 30-minute quick-update limit. Custom functionality is fixed quoted. Domain renewals and any paid third-party services remain separate.
- Current editable source: `src/home.html`; styles: `styles-v1.5.3.css`; builder/check/build tests: `scripts/*-v1.5.3.mjs`. Existing interaction JS remains v1.5.1.
- Build/check: `npm run build:production`, `npm run check`, `npm test`. Production publishes generated `site-dist/`; root HTML remains a generated preview copy for repository review.

Task branch: `codex/v1.5.3-pricing`. Validation covers generated production prices/inclusions, all eight add-on price pairs, FAQ/chart consistency, markup/assets/metadata, production build and existing mock enquiry/animation/build tests. No real enquiry was sent. Older source/snapshots and domain/email settings are preserved. Historical handovers below may describe earlier prices or deployment status.

## SWwebsite deployment configuration — v1.5.2 (15 October 2026)

- Official production domain configured in `site.config.json`: **https://superwebsites.co.nz/** (canonical apex hostname).
- The original `SWdemo1` preview, its noindex setting, and `previewUrl` remain unchanged.
- Cloudflare Pages should connect **SuperWebsitesNZ/SWwebsite**, production branch `main`, build command `npm run build:production`, build output directory `site-dist`, Node.js 20+.
- **Production enquiry setup:** `contactEmail` is set to **superwebsites111@gmail.com** as a temporary public contact address; `formEndpoint` is blank. The form opens a prefilled `mailto:` draft for the visitor to send themselves. No automatic submission or server-side form delivery is configured.
- In Cloudflare Pages > Custom domains, add `superwebsites.co.nz` after a successful production deploy; also configure `www.superwebsites.co.nz` to redirect to the apex. DNS records and mail records must be reviewed before changing nameservers.
- Domain and temporary enquiry-email configuration retain website version **v1.5.2**. As of this handover, the Cloudflare Pages production deployment and custom domain are not yet connected; no DNS change has been made.

Launch preparation for **SuperWebsitesNZ/SWdemo1**. The current GitHub Pages site remains a noindex review preview while production is built separately with the final domain and enquiry details. SWdemo2 and Think Blue Tree were not changed.

- Latest preview: https://superwebsitesnz.github.io/SWdemo1/
- Current snapshot: https://superwebsitesnz.github.io/SWdemo1/versions/v1.5.2/
- Previous snapshots: `versions/v1.3.0/` through `versions/v1.5.1/`, retained unchanged.
- Static HTML/CSS/JavaScript with a dependency-free Node builder; no browser framework or npm dependencies.
- Shared layouts and an unpublished About entry and a visible Blog prepare for future pages. No training offers are promoted. The Blog includes one short article and three clearly labelled preview-only sample titles.
- Responsive WebP artwork, subset self-hosted Barlow fonts, local icons, social metadata, custom 404 and separate preview/production SEO rules.
- Production enquiry email-draft fallback configured to **superwebsites111@gmail.com**. The GitHub Pages demo remains on its separate preview settings.
- Current pricing and five-year illustrative cost comparison are preserved. The unfinished third portfolio tile was removed.

## Source and commands

Read [LAUNCH-v1.5.2.md](LAUNCH-v1.5.2.md) for domain/hosting setup, contact configuration, page/blog publishing, privacy and final live checks.

```sh
npm run build
npm run check
npm test
```

Node 20+; no installation needed. `npm run build:preview` updates generated root demo files. `npm run build:production` creates the isolated `site-dist/` deployment and refuses to proceed without a final HTTPS domain and a contact method. The production host must publish `site-dist/`, not the repository root. JavaScript modules require HTTP hosting; opening HTML via `file://` is not supported.

- `src/home.html`: home content.
- `src/layout.html`, `src/partials/`: shared document, header, footer, intro and enquiry dialog.
- `content/pages.json`, `content/posts.json`: reviewed, explicitly published page/post configuration.
- `site.config.json`: site title, description, final/preview URL, public enquiry email/endpoint.
- `scripts/*-v1.5.2.mjs`: builder, output validation and build tests (enquiry and cost-animation tests stay at v1.5.1, their JS is unchanged).
- `styles-v1.5.2.css`, `app-v1.5.1.js`, `enquiry-v1.5.1.js`: current presentation/interactions.
- `assets/`: local artwork, icons and licensed fonts.
- `index.html`, `404.html`, `robots.txt`, `_headers`: generated preview output.
- `VERSION.md`: website history.

**Preserve previous versions:** retain old snapshots and referenced versioned assets unchanged. Create a new version for new code. Edit shared source, rebuild, and commit generated and source files together. Production excludes archive pages. Cloudflare applies `_headers`; GitHub Pages ignores it.

## Current release handover — Codex — 2026-10-15

Patrick requested a more compact form, a visible blog listing and article example, and cost animation playback only when the graph is being viewed. Task branch: `codex/v1.5.1-blog-form`. Added `cost-animation-v1.5.1.js` with measured graph visibility (65% of its visible viewport capacity, excluding the sticky header) and a pausable timeline. Playback waits on entry and stops while offscreen, tab-hidden, intro/form/menu-covered or globally paused; returning resumes remaining time. Reduced motion displays final totals. The observer stays attached, with passive scroll/resize geometry checks for header/viewport changes and fallback support.

Made the form wider and more compact, separated its close bar from the body scroll area and locked background scrolling while open. Added the Blog navigation link, purple/gold featured article layout, one short article and three non-clickable sample-title cards. Sample titles are preview-only, with no fake pages or production sitemap entries. Added a return link, brand byline and enquiry CTA to the article. Fixed the shared header's SVG arrow to reference local icons on nested pages. Domain and enquiry configuration remain unset; the whole demo stays noindex. No training offers were added.

Validation: output metadata/IDs/assets/fragments/module paths; mock enquiry tests; controlled chart timing and visibility tests; preview/production blog routing and sample-card exclusion. Browser-rendered QA was unavailable. The supplied screenshot was readable and informed the modal changes. All earlier snapshots/assets retained unchanged. Current code, builder, checks and notes use v1.5.1.

## Previous release handover — Codex — 2026-10-14

Patrick authorised sensible preparation for a future domain launch, with About/Blog and more pages to come. Task branch: `codex/v1.5.0-launch-prep`. Added the multipage static build, SEO/share metadata, launch gates, responsive artwork/font optimisation and configurable enquiry flow. Kept Dave's future content/AI training promotion unpublished and retained the existing design/animations. The public contact email/domain were not inferred from account details.

Checks: JavaScript syntax, preview/production fixture builds, missing asset/fragment and duplicate ID checks, image integrity, mocked enquiry success/failure/timeout handling, draft exclusion, nested blog/page routes, canonical/schema/sitemap and output-folder protection. Browser-rendered QA, real-domain speed measurement and real enquiry delivery remain to be checked on the chosen host. No real enquiry was sent during tests. Older files and collaboration notes below are historical and may describe superseded behavior.

## Codex and DC collaboration — notes v1.0.0

2026-10-14 (Pacific/Auckland). Patrick has authorised Patrick's Codex and Dave's Claude (DC) to work together on Super Websites. Use this README for asynchronous handovers; neither assistant automatically receives the other's chat messages.

- Before starting, read this README, the current source, recent commits, branches and open pull requests. GitHub's latest committed files are the source of truth.
- Keep SWdemo1 and SWdemo2 as separate design alternatives unless Patrick or Dave requests a combination. Reuse useful ideas deliberately; do not replace either site wholesale with the other.
- For website code changes, use a task branch such as `codex/<task>` or `dc/<task>`, with a pull request explaining the change, validation and remaining questions.
- Before merging, fetch the latest target branch and reconcile changes. Preserve the other assistant's work; do not force-push shared branches or resolve conflicts by blindly taking one whole file.
- Scope tasks clearly. If both tasks touch the same file or section, agree the handover through notes or Patrick/Dave before making overlapping edits. README notes are coordination aids, not an automatic lock.
- Keep version numbers and code version notes current for website changes. This README-only handover is notes v1.0.0 and does not change the website's version.
- When handing over, append a dated note with assistant name, task/branch, files changed, checks performed, unfinished items and decisions needed. Preserve existing notes and clearly mark proposals.
- Keep unagreed prices, inclusions, delivery times, hosting assumptions and client claims labelled as proposals. Do not make commitments on behalf of Patrick or Dave.
- Super Websites uses this GitHub account. Think Blue Tree uses the separate TBT-APP account.

### Codex review — 2026-10-14

Reviewed website v1.3.0 at commit `5083749`: static HTML, separate versioned CSS/JavaScript, local fonts, optimised artwork/favicons and four enlargeable graphic-novel chapters. Pricing currently displayed: basic website NZ$1,500 + GST; basic text/image updates NZ$50 + GST; larger work quoted. The brief builder prepares copyable text only.

Source checks found no missing local HTML assets, missing fragment targets or duplicate IDs. Responsive and reduced-motion code is present. This was a source review, not a fresh visual/browser test or a verified production deployment.

No website source or assets changed in this review. Useful next discussions: preferred direction across the two demos, final superhero identity, real enquiry delivery, and final commercial scope. This repo has no enquiry backend.


### Codex handover — v1.4.0 — 2026-10-14

Patrick explicitly requested a blend in **SWdemo1 only**: Dave's pale violet background, Barlow typography and yellow buttons; hero copy/headline; rent/cost-comparison section; ownership; full pricing; portfolio; and a combined FAQ. Kept Demo 1's original transparent superhero artwork, flying motion and closing section. Removed above-heading labels, ticker and all steps/chapters. Do not modify SWdemo2 as part of this change.

Task branch: `codex/v1.4.0`. Changes: `index.html`, new `styles-v1.4.0.css` and `app-v1.4.0.js`, two portfolio screenshots, `README.md`, `VERSION.md`, and stable HTML snapshots under `versions/v1.3.0/` and `versions/v1.4.0/`. Existing v1.3.0 CSS, JavaScript and artwork are retained unchanged. The v1.3.0 source is also saved on `versions/v1.3.0`.

Validation: JavaScript syntax; HTML structure/IDs/local references/internal links; CSS syntax structure; image integrity; execution of actual app code with controlled DOM/time events covering both totals, all ten bars, replay, pause/resume, background-tab resume, reduced motion, observer fallback, menu and brief/copy behavior. Browser rendering QA was unavailable in this environment; inspect the deployed desktop/mobile layouts when available.

The five-year comparison has a replay button and shares one timeline across both series. Both totals render fully without JavaScript or under reduced motion. Existing copyable-brief behavior is preserved. Remaining product work: third portfolio project and production enquiry delivery. Future edits must preserve the immutable snapshots and use fresh versioned files.



### Codex handover — v1.4.1 — 2026-10-14

Patrick requested that a form-opening button grow and spin into the form. Each `[data-brief]` button now opens the actual modal from its measured on-screen rectangle, expands through one turn and settles at full size over 720ms. The yellow button surface changes to the white form, with contents revealed towards the end. It measures in the capture phase so the mobile navigation button still has its position before the menu closes.

Task branch: `codex/v1.4.1`. Changed the current index, added `styles-v1.4.1.css` / `app-v1.4.1.js`, updated version notes and added `versions/v1.4.1/index.html`. Existing v1.4.0/v1.3.0 snapshots, source files and artwork stay immutable. Demo 2 was not read or changed for this task.

The form opens directly when reduced motion is enabled, site motion is paused or Web Animations is unavailable. Closing/Escape, viewport resize, reduced-motion changes and animation failures clean up the morph immediately. Native modal focus behavior and the existing brief/copy flow are retained. Validation covered these animation paths, the mobile capture order, existing cost/brief interactions, syntax and version/asset links. Rendered browser QA was unavailable in this environment.



### Codex handover — v1.4.2 — 2026-10-14

Patrick supplied three new transparent character images. Hero1 (female with laptop) now appears at the top, Hero2 (male offering key) in “Your website. Your keys.” and Hero3 (victory pair) in the closing section. The top image is above the panel/background rays (z-index 2), behind the ownership box (z-index 4), and can extend beyond the panel. Removed only the faint background shield; the small shield in the ownership box remains.

Task branch: `codex/v1.4.2`. Added three compressed WebP assets preserving source dimensions and alpha exactly, new versioned CSS/JavaScript, a v1.4.2 snapshot, current index updates and version notes. Portrait frames and the closing artwork aspect ratio were adjusted for the new image shapes. Existing floating motion and the button-to-form spin are retained. JavaScript behavior is identical to v1.4.1, apart from version/header comments.

Validation: original-to-WebP dimension/alpha checks; HTML/image/asset/version/fragment mappings; CSS layering and responsive rules; JS syntax and unchanged-behavior comparison; immutable prior assets/snapshots. Rendered browser QA was unavailable. Demo2 and original uploaded PNG files were not modified.



### Codex handover — v1.4.3 — 2026-10-14

Patrick requested DC's page-opening chain break in Demo1, with improvements where useful. Read SWdemo2 at `937eedb` as reference only. Added a richer gold chain, central snap/star and detached link fragments, then smooth outward reveal over about 1.8 seconds. It runs once per tab session; “Replay intro” in the footer plays it again. No changes to Demo2.

The intro uses a closed native dialog plus a small early inline script, so JavaScript-disabled or failed-script visits stay visible. It supports click/Skip and Escape, native modal keyboard handling, reduced-motion bypass/changes, a 2.3-second safety timeout, background-tab dismissal and page-cache restoration. Deep-link visits skip the automatic intro, and its session key is namespaced to Demo1 so Demo2 cannot suppress it. Blocked sessionStorage is optional and never traps the page. Replay respects Pause motion/reduced motion.

Task branch: `codex/v1.4.3`. Changed current index, added new versioned CSS/JS and a v1.4.3 snapshot, and updated version notes. Current artwork files and all earlier snapshots remain unchanged. The existing cost animation pauses while the intro is open and resumes on reveal/replay completion, so its animation is not consumed behind the opening screen. Existing form and navigation behavior is unchanged.

Validation: intro event/lifecycle execution covering initial/repeat/storage/replay/skip/Escape/timeout/background/cache/deep-link/reduced-motion/failure paths; existing app syntax and unchanged-behavior comparison; markup/asset/version/fragment links; stylesheet/SVG structure; preservation of older snapshots/artwork. Browser-rendered QA unavailable.
