# v1.8.0 — SEO growth pages, cost calculator and GEO posts

2026-10-24: From Dave's 24 Oct SEO audit, on branch `seo-growth-v1.8.0` for Dave and Patrick to review before merging. New town pages /website-design-cromwell/ and /website-design-wanaka/ (footer Guides, not header nav) with local detail: Dave based in Cromwell, in-person meetings, towns served, CamerAcademy's Cromwell classes and FanCast's Cromwell filming. The Cromwell results on Google are town pages from small studios, so these are the quickest page-one chance. Central Otago page links both. /website-cost-nz/ gets an interactive cost calculator (package, extra pages, add-ons, quick updates, and a five-year comparison against the NZ$79 example agency plan or the visitor's own quote; a website builder comparison was left out at Dave's request because builders are DIY and the numbers do not show design, copywriting or ownership); the form is hidden until its script runs, so the page still reads fully without JavaScript. Four new posts, all linking to the guides: what GEO is, how to get mentioned by ChatGPT (NZ), Google AI Overviews for small businesses, and monthly website running costs in NZ. No ranking or AI-mention promises; no mention of Cloudflare or code. Builder: new `scripts` field in content/pages.json loads versioned page modules through a new {{PAGE_SCRIPTS}} layout token, copies them to the output and caches them in _headers. New styles-v1.8.0.css (v1.6.8 plus calculator styles), cost-calculator-v1.8.0.js and its test, v1.8.0 build/check/build-test scripts (live sitemap count 17). The CI workflow file stays verify-production-v1.7.4.yml (it runs the npm scripts, so it checks v1.8.0); rename it when convenient, since this push token cannot edit workflows. Enquiry sending, app and Worker files are unchanged. Prior snapshots, code and assets are unchanged.

# v1.7.4 — live contact form

2026-10-21: Resend accepted the labelled v1.7.3 test and Patrick confirmed Zoho receipt and Reply-To behavior. Enabled the verified enquiry endpoint in the live site configuration. Enquiries go to hello@superwebsites.co.nz; Reply-To uses the visitor’s submitted email. Patrick and Dave can respond from their own Zoho domain mailboxes. The Gmail address was only a simulated visitor in the setup test and is not configured as a live recipient. Versioned frontend/build/check/test files and generated previews updated; service stays v1.7.3, with existing layout, styling, content and failure recovery preserved. Production tests verify endpoint, sending copy and CSP permission. Rollback: revert the complete v1.7.4 activation commit to restore the prior build and email-draft fallback.

# v1.7.3 — Cloudflare runtime compatibility

2026-10-21: Reproduced the send failure in Cloudflare's native workerd runtime: redirect:error throws during Request construction before any network request. Use redirect:manual and continue rejecting every non-2xx response, including redirects; credentials are never forwarded to another host. Native fetch is called through a global receiver wrapper. Added a handler-only entry module and an isolated, pinned Miniflare regression test that proves v1.7.2 fails and v1.7.3 passes without sending email or using real credentials. Test-only dependencies stay in workers/enquiries and run in CI; the frontend stays dependency-free and unchanged on v1.7.0. Zoho setup notes record a previously successful shared-mailbox send/receive test. Live form endpoint remains blank pending an actual successful Resend send and Zoho inbox/reply confirmation.

# v1.7.2 — enquiry service diagnostics

2026-10-21: Runtime settings and key now present, with health returning configured:true on service 1.7.1. First real labelled enquiry test returned 502; Resend dashboard showed no logs. Added safe failure categories, reference, upstream HTTP status and an allowlist of documented provider error names so connection/timeout/authentication/validation failures can be distinguished without exposing keys, visitor data or raw provider errors. Tests cover privacy of both responses and logs. Pinned the deploy command to dry-run-validated Wrangler 4.151.3. Frontend stays 1.7.0 with formEndpoint blank and enquiryDeliveryVerified:false. No retry, real delivery or live form activation is claimed by this patch.

# v1.7.1 — enquiry service

2026-10-21: Replaced the prepared native Cloudflare email binding with Resend for the separate enquiry Worker. Resend's forms.superwebsites.co.nz sending subdomain is verified, based on Patrick's screenshot. The Cloudflare routing wizard proposed apex MX records and was abandoned before activation to preserve Zoho. Added a sending-only runtime RESEND_API_KEY integration, fixed sender/destination, visitor Reply-To, an eight-second timeout, strict provider-success checks and outbound idempotency header. Request validation/rate limiting are retained. Added mocked Resend failure/timeout/log-privacy checks and a versioned setup guide with GitHub Worker deployment and secret instructions. Package service version is 1.7.1; frontend files/build scripts remain 1.7.0 with no content or layout changes. Live form endpoint remains blank and delivery verification false. Worker deployment, runtime key, actual inbox arrival/reply confirmation and subsequent website activation are pending. No real email sent by offline tests; no credentials committed.

# v1.7.0

2026-10-21: Prepared a native Cloudflare Worker enquiry sender restricted to hello@superwebsites.co.nz, with website@forms.superwebsites.co.nz as authenticated From and the visitor’s name/email as Reply-To for ordinary Zoho replies. Added bounded input reading, field/header validation, production-Origin checks, honeypot and native per-IP rate limiting. Failed/unconfigured sending returns success:false and does not log personal form content. Worker starts disabled until sender/destination setup is verified. Added mocked Worker tests, versioned Wrangler configuration and a concrete activation/rollback guide. Production endpoint remains blank; the live email-draft fallback is preserved until a real inbox test succeeds. Builder now gates automatic sending on an explicit enquiryDeliveryVerified flag. Future success copy reports sending to the team rather than claiming inbox receipt. Preserved all current content, layout, pricing, photos, SEO, contact settings and existing motion/form behavior. Cloudflare sign-in, sender/destination setup, deployment and real delivery/reply checks are still required.

# v1.6.9

2026-10-21: Production project-brief email-draft recipient changed from the temporary Gmail address to the tested shared Zoho mailbox `hello@superwebsites.co.nz`. Two individual mailboxes and the shared mailbox are already set up; only the site recipient changed. `showContactEmail:false` remains unchanged, so the address appears in the visitor's email draft but is not added to the footer or Organization schema. No server-side form endpoint was added; the visitor must send the draft. New v1.6.9 build/check/test scripts, versioned config/package and updated GitHub production workflow now verify the shared recipient (instead of the old Gmail). Styles, page content, existing production assets and older versions stay unchanged.

# v1.6.8

2026-10-17: Gmail address hidden from the public site (Dave, option 1). New site.config.json field `showContactEmail` (default true); set to false, the builder leaves the email out of the footer and the Organization schema. `contactEmail` stays configured because the enquiry form's "Open email draft" sends to it and production requires an email or a form endpoint, so the address is only seen by someone who opens the draft. The footer now shows the phone and service area. Build test covers hidden and shown modes. New styles-v1.6.8.css (identical to v1.6.6 apart from its header) and v1.6.8 build/check/build-test scripts; JS unchanged. Prior snapshots, code and assets are unchanged. Longer term: a domain address (e.g. hello@superwebsites.co.nz via Cloudflare Email Routing) can replace the Gmail.

# v1.6.7

2026-10-17: Home "Stop paying rent" lede reworded at Dave's request. "We do it the other way round." was unclear; it now reads "Stop paying and your site can go offline. Ours stay online with no plan at all, because the hosting is in your name." New styles-v1.6.7.css (identical to v1.6.6 apart from its header) and v1.6.7 build/check/build-test scripts; JS unchanged. Prior snapshots, code and assets are unchanged.

# v1.6.6

2026-10-17: Footer social links show the Facebook, Instagram, LinkedIn and YouTube logos instead of their names (Dave). Logos are inline SVG paths from Simple Icons (CC0) in the builder, white in 44px round buttons that turn yellow on hover/focus; each link keeps an accessible name ("Super Websites on Instagram") and a tooltip. A network without a logo falls back to its text name. New styles-v1.6.6.css (v1.6.5 plus the logo buttons) and v1.6.6 build/check/build-test scripts; the build test checks the labelled logo markup. JS unchanged. Prior snapshots, code and assets are unchanged.

# v1.6.5

2026-10-17: SEO and AI search (GEO) messaging, on branch `seo-geo-v1.6.5` for Dave and Patrick to review before merging. Dave confirmed every build includes the full setup (speed checks, titles and descriptions, schema, sitemap, Search Console in the client's name), so "Basic SEO" becomes "SEO and AI search setup" in the one-page package, the cost guide table and the Central Otago page (new *-v1.6.5.html bodies). New home section "Built to be found" (#found, between Your keys and pricing) with four points and an honest no-guarantee line, a new FAQ "Will my website show up on Google and in AI search?", and a new footer guide /seo-and-ai-search/ explaining SEO and GEO in plain English, what every build includes, what nobody can promise and what helps after launch. No ranking or AI-mention promises; no mention of Cloudflare or code. New styles-v1.6.5.css (v1.6.4 plus .found-grid) and v1.6.5 build/check/build-test scripts (sitemap counts 11 live, 7 in the fixture); JS unchanged. Prior snapshots, code and assets are unchanged.

# v1.6.4

2026-10-17: Fixes from Dave's evening SEO re-audit. Home H1 now contains the service line ("Website design for small businesses in Central Otago and across New Zealand.") as a span styled exactly like the old paragraph, so the main heading carries the service and place with no visual change. About says "Two Central Otago business owners" and its meta description "the Central Otago duo" (was Queenstown), matching the home page and title; new src/pages/about-v1.6.4.html. Blog listing meta description trimmed from 163 to 144 characters. The blog post keeps its slug but is retitled "What a small business website needs to do" with a 150-character description (was 97). New styles-v1.6.4.css (v1.6.3 plus the H1 service-line rule) and v1.6.4 build/check/build-test scripts; JS unchanged. Prior snapshots, code and assets are unchanged.

# v1.6.3

2026-10-17: Super Websites social profiles. New site.config.json field `socialProfiles` (name + https URL, validated by the build): Facebook, Instagram, LinkedIn and YouTube. They show as a link row in the footer under the contact details ({{FOOTER_SOCIAL}} in src/partials/footer.html, rel="me", new tab) and as Organization `sameAs` in the JSON-LD, so Google can tie the profiles to the site. New styles-v1.6.3.css (v1.6.2 plus .footer-social) and v1.6.3 build/check/build-test scripts; JS unchanged. Prior snapshots, code and assets are unchanged.

# v1.6.2

2026-10-17: Hero sizes hint 84vw to 82vw on phones. At 412px and 1.75x density, 84vw asked for 605px, just over the new 600px variant, so phones still downloaded the 768px heroes; 82vw (measured display is about 83%) selects the 600px files. styles-v1.6.2.css is identical to v1.6.1 apart from its header; v1.6.2 build/check/build-test scripts. Note: the Cloudflare Web Analytics script now loads, but its beacon POST to cloudflareinsights.com/cdn-cgi/rum returns 503, which needs the Web Analytics site checked for superwebsites.co.nz in the Cloudflare dashboard.

# v1.6.1

2026-10-17: Fixes from Dave's 17 Oct audit and Lighthouse run (mobile 96, SEO 100). Cloudflare Web Analytics was injected by Pages but blocked by the CSP, so it recorded nothing; the CSP now allows https://static.cloudflareinsights.com (script) and https://cloudflareinsights.com (connect). The "+ GST" on the purple five-page card is white instead of yellow (contrast 3.95:1 to about 5.3:1). Phones now get new 600px hero variants (hero1/hero2-600-v1.6.1.webp, about 70 KB instead of about 140 KB) via a 600w srcset entry and sizes matching the measured display width (84vw up to 600px), and the 49px ownership shield uses shield-100-v1.6.1.webp (5 KB instead of 52 KB). New styles-v1.6.1.css and v1.6.1 build/check/build-test scripts; JS unchanged. Original assets, prior snapshots and code unchanged.

# v1.6.0

2026-10-16: Six SEO pages requested by Dave after the launch-day audit, on branch `pages-v1.6.0` for Patrick and Dave to review before merging: /website-cost-nz/ (NZ 2026 price ranges, ongoing costs, our packages, five questions to ask), /website-design-central-otago/, /website-design-queenstown/, /websites-with-no-monthly-fees/, /our-work/ (FanCast Productions and CamerAcademy case studies) and /switch-from-wix-squarespace/. Dave and Patrick reviewed the branch preview: in-person meetings, email continuity and redirects on a switch, and the NZ$20 to NZ$65 domain range are confirmed; the case studies say they were built by Super Websites. Copy uses only facts already on the site (packages, add-ons, FAQ, About) plus public facts about the two portfolio sites; no timelines, payment terms or results are claimed. Pages use the standard content layout (one H1 from `heading`, body from H2). New page options in content/pages.json: `nav: false` keeps a page out of the header, `footer: true` with `footerLabel` lists it in a new footer Guides row ({{FOOTER_GUIDES}} in src/partials/footer.html). Home links the cost guide from the pricing note and the case studies from Our work. New styles-v1.6.0.css (v1.5.9 plus prose tables/lists and the Guides row) and v1.6.0 build/check/build-test scripts; also fixes the demo version links, which v1.5.9 showed as "Previous: v1.5.9". JS modules unchanged. Prior snapshots, code and assets are unchanged.

# v1.5.9

2026-10-16: Local SEO pass requested by Dave after the launch-day audit. Home title is now "Website Design Central Otago & NZ | Super Websites" and the meta description names Central Otago, New Zealand, no monthly fees, copy included and the NZ$1,500 + GST starting price. The hero service line reads "Website design for small businesses in Central Otago and across New Zealand." The footer shows the email, Dave's phone (027 230 7050, tel: link) and a service-area line naming Central Otago, Queenstown, Cromwell, Wānaka and New Zealand. Organization schema adds telephone, areaServed and an Otago/NZ PostalAddress (no street address). Blog listing gets a full meta description. New site.config.json fields: contactPhone, contactPhoneDisplay, serviceArea, areaServed. New styles-v1.5.9.css (v1.5.8 plus the footer contact row) and v1.5.9 build/check/build-test scripts; app, enquiry, cost-animation and back-to-top JS are unchanged. Prior snapshots, code and assets are unchanged.

# v1.5.8

2026-10-15: Added a compact yellow circular back-to-top arrow in the bottom-right corner of every active page. Appears after 500px of scrolling and returns to the actual page top. The native labelled button is keyboard accessible, uses smooth scrolling, respects reduced-motion and Pause motion, and restores keyboard focus to the home/brand link when it hides. It stays clear of device safe areas and is hidden behind open dialogs/mobile navigation. New shared back-to-top JS is isolated from existing interaction code. Existing page content, pricing, About profiles, assets, forms and animation code are preserved. Added v1.5.8 build/check/test/style files and retained earlier releases.

# v1.5.7

2026-10-15: Added Patrick’s surname, Timm, to his About profile heading and portrait alternative text. Dave remains first. Existing profile wording, links, images, styling and behavior are preserved.

# v1.5.6

2026-10-15: Put Dave’s About profile before Patrick’s in the actual document order, so he appears first on desktop, mobile and for screen readers. About introduction and metadata now name Dave first. Profile wording, portraits, links, styling and interaction code are preserved. Previous About source and snapshots remain available.

# v1.5.5

2026-10-15: Published the About page with Patrick and Dave’s supplied portraits, compressed as WebP while retaining the originals. Circular portrait framing is CSS, including Dave’s rectangular source. Added a purple/yellow people-behind-the-capes introduction, individual bios, a shared helping-people/website-ownership story, three service principles and working enquiry/package calls to action. Patrick’s copy uses the information he supplied in this request (behavioural consultancy and search and rescue). Dave’s factual background is paraphrased from FanCast Productions and CamerAcademy’s own About/instructor pages, linked from his profile. His bio covers video, live sports, storytelling and 15 years in education. Patrick’s separate work is linked as requested without importing its brand or assets. About is included in shared navigation, canonical metadata and the production sitemap. Added a reusable full-width content layout and v1.5.5 source/build/check/test/style files; preserved homepage content, pricing, enquiry and animation code, older versions and HTTP diagnostics.

# v1.5.4

2026-10-15: Integrated the supplied v1.0 social/shortcut asset pack into SWwebsite. The shared page head now uses the opaque 1200×630 JPEG sharing card, correct image dimensions/type/description, and explicit Twitter title, description and image metadata while preserving each page’s title, URL and description. Retained the working 48×48 favicon and existing website logos/artwork. Added the supplied solid-background Apple touch icon and 192px, 512px and maskable shortcut icons with a relative-path browser manifest that also works under the preview subpath. Unused alternate exports remain in the supplied archive rather than adding duplicates to the website. New v1.5.4 build/check/test scripts retain v1.5.3 CSS and v1.5.1 interaction code. Extended output checks for social-image consistency and manifest targets. Pricing, enquiry settings, content, animation behavior, hosting diagnostics and previous versions are preserved.

# v1.5.3

2026-10-15: Patrick authorised the updated package/add-on structure for the production SWwebsite repo. One-page website NZ$1,500 + GST and up-to-five-page website NZ$2,950 + GST, with copywriting from basic customer information included in both. One-page inclusions now explicitly cover design, mobile responsiveness, basic SEO and a standard contact form. Five-page adds copywriting for all pages, Google Business Profile setup and a photo gallery. Replaced the third quick-updates package card with eight optional add-ons: additional page including design/copy NZ$300; Google Business Profile setup NZ$175; gallery/portfolio NZ$200; blog/news from NZ$350; existing booking integration from NZ$150; advanced forms/automations from NZ$350; quick updates up to 30 minutes NZ$50; other custom functionality fixed quoted. All prices NZD excluding GST. FAQs and chart assumptions match the new pricing and update time limit. Added responsive two-package/add-on styling and versioned build/check files. Retained the configured production domain, email-draft enquiry method, existing JavaScript and previous versioned files. SWdemo1 and SWdemo2 were not edited.

# v1.5.2

2026-10-15: Dave requested two fixes. FAQ wording: "Do I really own the website?" and "Can I edit the site myself?" now say "website files" instead of "website code". Mobile: on screens up to 600px the ownership panel is sized to the viewport so the 110%-wide key hero no longer pushes 8px past the screen edge. New `styles-v1.5.2.css` (v1.5.1 plus one rule) and v1.5.2 builder/check/build-test scripts; app, enquiry and cost-animation JS are unchanged and keep their v1.5.1 filenames and tests. Prior snapshots, code and assets are unchanged.

# v1.5.1

2026-10-15: Added visible Blog navigation, a branded blog listing, one short article and three labelled preview-only mock titles. Mock cards have no fake links or generated article pages and are excluded from production. Article layout includes brand byline/date, preview note, return link and enquiry CTA. Compact form spacing and wider desktop modal; a fixed close bar stays outside the scrolling body, with background scroll locked. Replaced one-shot intersection playback with measured graph visibility and a pause/resume timeline: starts when most of the chart is visible, pauses offscreen or behind the intro/form/menu, handles hidden tabs/global pause/reduced motion, and resumes without counting time away. Persistent observation plus passive viewport checks cover sticky headers and fallback support. Added versioned animation tests and updated blog build checks. Shared header icons use local fragments on nested pages. Domain remains unconnected; demo stays noindex and no enquiries are transmitted. Prior snapshots, code and assets are unchanged.

# v1.5.0

2026-10-14: Prepared SWdemo1 for a future production launch while keeping the GitHub Pages demo noindex. Added dependency-free shared layouts and explicit publishing configuration for About, Blog, posts and future pages. Unpublished entries are omitted from generated navigation/routes/sitemaps; no content/AI training offers are promoted. Production requires a final HTTPS business domain and configured enquiry receiver, emits canonical/social/structured metadata, sitemap, robots and custom 404, and excludes archived demo pages. Added Cloudflare security/caching headers; GitHub Pages does not apply them. Responsive hero/logo variants and licensed subset self-hosted Barlow fonts reduce image/font payloads and remove Google Fonts requests. Added configurable JSON enquiry submission with receipt/error/timeout handling and email-draft fallback, preserving local brief/copy behavior when unconfigured. Added name/email fields, honeypot, shared-page chart guards, versioned source/build/check/test files and launch instructions. Removed the unfinished third portfolio tile and duplicate skip link; made hero service wording clearer and softened the service-page Google claim. Current pricing, cost comparison, chain-break intro, button morph and floating artwork are preserved. Final domain, public contact receiver, DNS and real-host verification remain unset. No real enquiries sent. Existing snapshots and original assets remain unchanged.

# v1.4.3

2026-10-14: Added a DC-inspired chain-break page-opening animation, with gradient gold links, a clearer central snap, detached link pieces and smoother outward reveal. Plays once per tab session with footer replay, click/Skip and Escape. Closed native dialog is fail-open without JavaScript; reduced motion, deep links, paused motion, missing dialog support and hidden tabs bypass it. Added safety timeout, optional namespaced session storage and background/page-cache cleanup. Current artwork and existing form/chart interactions are preserved. Added a v1.4.3 snapshot and updated version links. Demo2 read only and unchanged.

# v1.4.2

2026-10-14: Replaced character artwork with the three supplied transparent images: Hero1 with laptop in the hero, Hero2 offering the key in ownership, and Hero3 victory pair in the closing section. Compressed to WebP while retaining original dimensions and exact alpha. Adjusted portrait frames and closing aspect ratio; retained floating motion. Hero1 renders in front of its panel/background rays and behind the ownership box. Removed the faint background shield. Preserved the button-to-form spin and all interaction behavior. Added a stable v1.4.2 snapshot and updated version links; all previous files/snapshots remain unchanged. No changes to Demo2 or uploaded originals.

# v1.4.1

2026-10-14: Added a button-to-form opening animation to every brief CTA. The clicked button's rectangle expands and spins through a full turn into the actual modal over 720ms; yellow becomes white and the form content fades in towards the end. Uses capture-phase measurement for mobile navigation and transform-based Web Animations. Reduced-motion, paused-motion and unsupported-animation paths open directly. Closing/Escape, resize, preference changes and failures clear temporary animation state. Preserved existing form/copy and chart behavior, all v1.4.0/v1.3.0 files/assets and previous snapshots. Added a stable v1.4.1 snapshot and version links. No changes to Demo 2.

# v1.4.0

2026-10-14: Blended the requested SWdemo2 styling/content into SWdemo1 only. Adopted pale violet #F4EEFE, Barlow/Barlow Condensed typography and yellow comic-style buttons. Updated hero to “Super sites. No subscriptions.” Retained original transparent flying superheroes and the original closing section. Replaced the subscription section with the yellow “Break the subscription cycle” panel and two-series five-year comparison; both totals and all ten bars animate together, with replay, pause/resume, background-tab handling and reduced-motion support. Copied ownership, package pricing ($1,500 one-page / $2,500 up to five pages / $50 updates, all + GST) and portfolio sections. Combined both FAQs. Removed all above-heading labels, yellow ticker and four-step/comic chapter section. Kept the brief builder browser-only. Added stable v1.3.0 and v1.4.0 HTML snapshots and footer links; preserved old versioned CSS/JS/assets. Demo2 was read only and was not modified. Third portfolio tile still awaits Patrick's project.

# v1.3.0

2026-10-13: Added pricing immediately after the subscription rescue mission: basic website NZ$1,500 + GST; basic text/image updates NZ$50 + GST; larger redesigns or changes quoted. Replaced the pricing FAQ and update FAQ to match. Rising-cost animation ends in a large red X with a no-ongoing-website-subscription message, resets on replay and displays its final state with reduced motion. Replaced the four origin-story tiles with supplied transparent graphic-novel panels, optimised as high-quality WebP, with accessible enlargement. Preserves existing approved artwork and portfolio concepts.

# v1.2.1

2026-10-13: Prepared SuperWebsitesNZ/SWdemo1 as the independent Super Websites source repository. Split HTML, styles and interaction code into maintainable versioned files; bundled all optimised transparent artwork, self-hosted fonts, favicon and touch icon. Preserves the approved v1.2.0 appearance and interactions. Browser-only brief builder; no enquiries are sent.

# v1.2.0

2026-10-13: Applied supplied royal purple #7B3FE4, sunshine yellow #FFD43B, deep plum #2B183F, soft white #FAF8FD and silver grey #E2DEE8. Integrated full wordmark, shield favicon, female hero, male hero and subscription-rescue artwork as optimised transparent WebP assets. Replaced the slider/calculator and drawn rescue with supplied rescue illustration and animated cumulative NZ$30/month platform fees across five years. Fixed illustration labelled separately from our build price. Preserved design concepts, brief builder, reduced motion and global pause. Source images remain unchanged.

# v1.1.0

2026-10-13: Visual superhero refresh. Original angular S shield and caped vector hero, electric violet/comic yellow/signal red/white identity independent of TBT. Interactive subscription rescue with chain-breaking animation, clearly labelled adjustable other-platform fee example, NZ$30 default, recurring-platform total separated from build pricing, visual ownership panels and four illustrated launch steps. Reduced copy, closed FAQ, reduced-motion support and global pause control. Existing brief builder and design concepts preserved. No enquiry backend.

# v1.0.0

2026-10-13: Initial Super Websites visual concept. Original shield and lightning identity, ivory/ink/lime/lilac palette, responsive editorial layout, subscription calculator, three illustrative design concepts, accessible navigation, project brief builder, reduced-motion support. No real client claims, fixed pricing or enquiry backend. Private design review release.





