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





