# Super Websites v1.5.2

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
