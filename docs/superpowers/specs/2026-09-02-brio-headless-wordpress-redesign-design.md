# Brio Health — Headless WordPress Redesign

**Design spec** · 2026-09-02
Status: awaiting review

---

## 1. What we're building

A complete rebuild of yourbriohealth.com as a **Next.js 16 front end reading from
the clinic's existing WordPress install over the REST API**.

The site keeps its 422 blog posts, its media library, and its `/wp-admin` editing
flow. It loses Avada, the page builder, and roughly everything that makes it slow.
The public site is rebuilt from a blank Next.js app with a new design system.

### Goals

1. **Speed** — Avada/Fusion Builder is the single biggest cause of the current
   site's weight. Going headless deletes it from the critical path entirely.
2. **Flexibility** — fixed page templates backed by Secure Custom Fields, so the
   client edits real named fields ("Hero heading", "Step 1 title") instead of
   fighting a builder.
3. **Look** — an original, restrained, spa-premium design built on the logo's
   teal. Not a template, not a stock AI layout.
4. **Zero content migration** — the blog does not move. WordPress stays the
   database.

### Non-goals

- Migrating content to a new CMS (this was the earlier Sanity plan; it is dropped).
- Preserving any of the current front-end code. This is a clean slate.
- Redesigning the WordPress admin. The client's editor experience stays familiar.

---

## 2. Decisions already locked

| Decision | Choice |
|---|---|
| CMS | Headless WordPress (existing install), `wp/v2` REST API |
| Field modeling | Secure Custom Fields (SCF) with fixed page templates |
| Codebase | True clean slate — fresh Next.js 16 app |
| Ported from old repo | Legacy redirect map + brand color only |
| Aesthetic | Deep Teal Immersive |
| WP backend | Strip down the existing live install *(re-confirm — see §11)* |

---

## 3. Architecture

```
                     ┌──────────────────────────────┐
   Client edits ───► │  WordPress @ cms.yourbrio…   │
                     │  · SCF field groups          │
                     │  · wp/v2 REST (read-only)    │
                     │  · Avada deactivated         │
                     └──────────┬───────────────────┘
                                │ save_post webhook
                                ▼
                     ┌──────────────────────────────┐
   Visitors ───────► │  Next.js 16 on Vercel        │
                     │  @ yourbriohealth.com        │
                     │  · ISR + revalidateTag()     │
                     └──────────────────────────────┘
```

### 3.1 Domains

- `yourbriohealth.com` → Vercel (the public site)
- `cms.yourbriohealth.com` → the existing WordPress host (admin + REST only)

WordPress keeps serving the same database it serves today. Only its hostname
changes, plus a `wp-config` update to the site/home URL so admin links resolve.
Post IDs, media URLs, and the media library are untouched.

### 3.2 Data fetching

Every read goes through a small typed client (`src/lib/wp/client.ts`) wrapping
`fetch` against `https://cms.yourbriohealth.com/wp-json/wp/v2/…`, with:

- `next: { tags: [...], revalidate: 3600 }` on every call
- a graceful-empty-state guard mirroring the old `isSanityConfigured` pattern:
  if `WP_API_URL` is unset or the API 5xx's, pages render an empty state rather
  than crashing the build
- `_embed` used where we need author/media/terms in one round trip
- typed response shapes hand-written in `src/lib/wp/types.ts` (the REST shape is
  stable and small enough that codegen is not worth the dependency)

### 3.3 Revalidation

A `save_post` / `deleted_post` hook in the theme's `functions.php` POSTs to
`/api/revalidate` on the Next.js side with a shared secret header. The route
handler maps the post type to a cache tag and calls `revalidateTag()`:

| WP post type | Tag(s) revalidated |
|---|---|
| `post` | `posts`, `post:<slug>`, `categories` |
| `page` | `page:<slug>` |
| `service` / `program` / `team_member` | `<type>`, `<type>:<slug>` |
| `testimonial` / `faq` | `<type>` |
| SCF options page save | `site-settings` |

Secret lives in `WP_REVALIDATE_SECRET`, set on both sides. Rejected requests
return 401 without revealing whether the tag exists.

> **Next 16 change (verified in `node_modules/next/dist/docs`):**
> `revalidateTag` now takes a **required second argument**, a `cacheLife`
> profile. The single-argument form is deprecated and is a TypeScript error.
>
> ```ts
> revalidateTag('posts', 'max')   // not revalidateTag('posts')
> ```
>
> `'max'` is right for us: stale-while-revalidate is the correct semantic for a
> CMS webhook — a reader mid-page-load gets the previous version while the new
> one builds behind them. The alternative, `updateTag`, gives read-your-writes
> semantics but is **Server-Actions-only**, so it can't be called from a route
> handler and is not an option for the webhook.
>
> Consequence for the client: after they hit Publish, the new version appears on
> the next request or the one after. Not instant. Worth telling them so it
> doesn't read as a bug.

### 3.4 Images

Media stays on the WordPress host. `next.config.ts` allows
`cms.yourbriohealth.com` in `images.remotePatterns`, and `next/image` handles
resizing and AVIF/WebP conversion at the edge — so the client's uploads get
optimized without them doing anything.

---

## 4. Content model (Secure Custom Fields)

SCF is WordPress.org's maintained fork of ACF **Pro** — free, and it includes
Repeater, Flexible Content, Gallery, Clone, and Options Pages. Field groups are
exported to **`acf-json/` inside the theme and committed to git**, which puts the
content model under version control the same way a Sanity schema folder would be.

### 4.1 Custom post types

Registered in code (theme `functions.php` or a small mu-plugin), not via a UI
plugin, so they live in git:

| CPT | Purpose | Key SCF fields |
|---|---|---|
| `service` | Naturopathic, Acupuncture, IV Therapy, Laser, Massage | summary, hero image, body sections, related programs, practitioners |
| `program` | Weight Loss Rehab, Liver Detox, Healthy Living 101, Workshops | summary, duration, what's included (repeater), price note, CTA |
| `team_member` | Practitioner bios | credentials, role, headshot, bio, services offered, booking URL |
| `testimonial` | Patient quotes | quote, attribution, related service |
| `faq` | Reusable Q&A | question, answer, group |

`post`, `page`, `category` are stock WordPress and stay as-is.

### 4.2 Fixed page templates

Rather than a general-purpose section builder, each singular page gets one SCF
field group bound to it, with named fields matching that page's actual layout.
This is the decision that makes editing legible for the client: they open the
Home page and see *"Hero heading", "Hero subheading", "Stakes bullets"* — not a
pile of interchangeable blocks.

| Page | Field group |
|---|---|
| Home | `home_fields` — the StoryBrand sequence in §6 |
| About | `about_fields` — story, values, timeline, team grid toggle |
| Services overview | `services_overview_fields` — intro, ordering |
| Programs overview | `programs_overview_fields` |
| Contact | `contact_fields` — hours, map embed, form intro |
| Pickleball | `pickleball_fields` |

A generic `page` template (title + WYSIWYG + optional hero) backs everything
else, including Privacy Policy and Terms of Use.

### 4.3 Options page

An SCF Options Page provides site-wide settings the client can change without a
developer: phone, email, address, hours, social links, booking URL, default OG
image, announcement bar. Exposed at a custom REST route and cached under the
`site-settings` tag.

### 4.4 Navigation

The nav in §5 is defined in code, not the CMS. It is small, structural, and
changes rarely; letting the client rearrange it is a liability, not a feature.
The one exception is the announcement bar, which is an Options-page field.

---

## 5. Information architecture

Per the approved `planning/brio_proposed_nav.md`:

```
Services ▾   Programs ▾   About ▾   Blog   Contact        [ Book Now ]
```

- **Services ▾** — Naturopathic Medicine · Acupuncture · I.V. Therapy ·
  Low Level Laser Therapy · Registered Massage Therapy · Services Overview *(new)*
- **Programs ▾** — Weight Loss Rehab · Liver Detox · Healthy Living 101 ·
  Workshops & Events
- **About ▾** — About Brio Health · Our Team *(new)* · Pickleball & Community
- **Blog** — 422 posts, with category wayfinding
- **Contact** — promoted from footer-only
- **Book Now** — CTA button → `https://yourbriohealth.janeapp.com`

### Routes

```
/                          home
/services                  overview
/services/[slug]           service CPT
/programs                  overview
/programs/[slug]           program CPT
/about                     about page
/about/team                team landing
/about/team/[slug]         team_member CPT
/pickleball
/blog                      paginated index
/blog/[slug]               post
/blog/category/[slug]      category archive
/blog/rss.xml
/contact
/[slug]                    catch-all for WP pages (privacy, terms, etc.)
```

### Legacy URLs

Two layers, both ported from the current repo:

1. **`next.config.ts` redirects** — the 25 hand-mapped legacy WP URLs
   (`/about-2/` → `/about`, `/acupuncture-3/` → `/services/acupuncture`, etc.)
2. **`src/proxy.ts`** — any unknown single-segment root slug 301s to
   `/blog/<slug>`, since the old WP permalink structure was root-level posts.
   Keeps the `KNOWN_ROUTES` allowlist so real routes pass through.

> **Next 16 change (verified in `node_modules/next/dist/docs`):** the
> `middleware` file convention is **deprecated and renamed to `proxy`**. The
> file is `proxy.ts` and the exported function is `proxy`, not `middleware`.
> The old `src/middleware.ts` we planned to port must be renamed, not copied.
>
> `proxy` runs on the **nodejs runtime only** — edge is not supported and the
> runtime is not configurable. For a redirect layer this is fine, but it is a
> cold-start-able hop in front of every unmatched request rather than an edge
> one. Mitigation: keep `KNOWN_ROUTES` exhaustive and keep the matcher tight, so
> `proxy` is never invoked for real routes or static assets.

This preserves the SEO value of the archive, which is the site's main organic
traffic source.

---

## 6. Homepage — StoryBrand sequence

Straight from `planning/website_wireframe.pdf`. Copy is the employer's; the
layout is ours. Every heading and body string is an SCF field so the client can
revise without a deploy.

| # | Section | Content | Treatment |
|---|---|---|---|
| 1 | **Hero** | "Reclaim Your Vitality Naturally" / "Tired of feeling exhausted and confused about your health?" / *Schedule a consultation* | Full-bleed deep teal band, nav sitting inside it. Large photo, soft organic mask. |
| 2 | **Stakes** | "Don't Let Fatigue Control Your Life" + 8 bullets | Cream band. Bullets as a quiet two-column list, not cards. |
| 3 | **Value** | "Feel Energized Again" + 4 bullets | Teal band. Numbered, generous line-height. |
| 4 | **Empathy & Competency** | "We Understand Your Challenges" · 20 Years · 5000+ Patients · Emily T. testimonial | Cream band. Stats large and typographic — no icon grid. |
| 5 | **Plan** | "3 Simple Steps to Reclaim Vitality" — Assessment / Create Your Plan / Optimize Your Vitality | Teal band. Horizontal on desktop, stacked on mobile. |
| 6 | **Explanatory** | "Take the First Step Towards Wellness" / "It doesn't have to be overwhelming." | Cream band, prose width, closing CTA. |
| 7 | **Footer** | NAP, service links, quick links, legal | Deepest teal. |

The wireframe's footer lists About Us · Contact Us · Privacy Policy · FAQs ·
Testimonials; the approved nav doc's footer is richer. We use the nav doc's
version and fold FAQs and Testimonials in as sections on the pages they belong to
rather than standalone footer links.

---

## 7. Design system — "Deep Teal Immersive"

### 7.1 Principle

The site alternates **full-bleed color bands**: deep teal, then cream, then teal.
The teal is not an accent — it is the ground. This is what keeps the site from
reading as a generic white-background wellness template. Photography sits large
inside the bands, masked with soft organic curves rather than rectangles.

### 7.1a The logo (received 2026-09-03)

`public/brio_social_1.png` (positive) and `brio_social_2.png` (reversed on teal),
1081×1081 each. Sampled values:

| Element | Hex |
|---|---|
| "HEALTH", droplet, dot burst | **#00919D** |
| "brio" wordmark | **#231F20** |
| Reversed lockup ground | **#00919D** |

Two things follow from it:

**The brand teal is `#00919D`, not `#1A929C`.** The earlier note was close but
wrong; the token scale below is corrected. `#1A929C` is muddier and greener —
side by side against the real mark it looks like a near-miss, which is worse than
an obvious difference. The approved `#0C4A4F` ground stays: its hue (184.6°) is
within a degree of the logo's (185.8°), so it already reads as the same family.

**The dot burst is the design motif.** The mark is a droplet with a radiating
scatter of dots above the "i" — dots sized largest near the center and tapering
outward. That is a real, ownable graphic device, and it solves §7.4's problem: it
gives us an ornament that is *the client's own*, not a stock abstract blob.
Use it for section dividers, the band-to-band transitions, list markers on the
Stakes and Value bullets, and a large low-contrast field behind the hero. It
should appear at most two or three times per page — it's a signature, not a
texture.

The reversed lockup on solid teal is, in effect, the client's own brand team
already endorsing Deep Teal Immersive. Worth saying out loud in the client
presentation.

An SVG is still worth asking for. These PNGs are fine for reference and for OG
images, but the header lockup and any large-scale use want vector.

### 7.2 Tokens

Corrected against the sampled logo:

```css
/* Teal — the ground */
--teal-700: #0C4A4F;   /* dominant band color (approved) */
--teal-600: #067680;
--teal-500: #00919D;   /* the logo teal — exact */
--teal-300: #6FC2CA;
--teal-100: #D2EDF0;
--teal-050: #EBF7F8;

/* Ink — the logo's black is #231F20, a warm near-black, not pure #000 */
--ink-900: #231F20;  --ink-700: #3A3536;
--ink-500: #5A6566;  --ink-300: #9AA3A3;

/* Neutrals */
--canvas: #FAF6EF;   /* the cream band */
--sand-200: #F1E9DB; --sand-300: #E7DCC9; --paper: #FFFFFF;

/* Accent — used sparingly, CTAs and highlights only */
--coral-500: #E8775A; --coral-300: #F3B39E; --coral-100: #FBE7DF;
--gold-300: #F4C77B;  --gold-100: #FBEFD6;

/* Rhythm */
--section-y: clamp(4rem, 9vw, 8rem);
--container: 1200px; --container-prose: 720px;
--gutter: clamp(1.25rem, 4vw, 3rem);
--r-sm:.625rem; --r-md:1rem; --r-lg:1.5rem; --r-xl:2rem; --r-pill:999px;
```

Tailwind v4, tokens as CSS custom properties consumed through the `@theme`
directive.

### 7.3 Type

- **Display:** Fraunces — a variable serif with real optical sizing and a soft
  `WONK` axis. Warm and human without being decorative. Used at large sizes only.
- **Body:** Hanken Grotesk — quiet, high x-height, excellent at 16–18px.

Both are already in the current build and both are correct for this direction, so
they carry over. Body copy sits at 17–18px with 1.65 line-height — clinic
audiences skew older, and this is a legibility decision, not a style one.

### 7.4 What we're deliberately not doing

The brief was *"don't look like AI slop."* Concretely, that means avoiding:

- three-icon feature rows with generic line icons
- gradient-purple anything
- card grids with drop shadows as the primary layout device
- stock photos of smiling people in white coats pointing at tablets
- "Trusted by" logo strips
- glassmorphism, blur-behind headers, floating pills over hero images

Instead: full-bleed color as structure, type doing the hierarchy work, real
photography at scale, one accent color used rarely enough that it means something.

### 7.5 Photography and placeholders

The client is shooting new photos. Every image slot ships with a designed
placeholder — a teal or sand field with a subtle organic mask and the intended
subject labeled — so the layout is complete and reviewable before the shoot, and
so swapping in real photos is a CMS upload, not a code change.

A short shot list falls out of the layout and should be handed to the client
before the shoot: clinic exterior, treatment room, each practitioner headshot,
one IV therapy detail, one acupuncture detail, one lifestyle/outdoors frame for
the hero.

---

## 8. Blog

422 posts, staying in WordPress. Two content shapes to handle:

**Older posts (2009 → ~2023, the bulk)** — clean classic HTML wrapped in
`<div class="brio_archived_post">`. Render nearly as-is.

**Recent posts** — wrapped in Avada/Fusion builder markup: `fusion-fullwidth`,
`fusion-builder-row`, `fusion-layout-column`, `fusion-text`, `fusion-title`, with
`--awb-*` inline styles. Real semantic content is nested inside `.fusion-text`
and `.fusion-title-heading`.

### 8.1 Content transform

A server-side sanitize/normalize pass (`src/lib/wp/renderContent.ts`) runs on
`content.rendered` before it reaches the page:

1. Unwrap `fusion-*` container divs, keeping their children
2. Strip `fusion-*` classes and `--awb-*` inline styles
3. **Lazyload fix:** Fusion sets `<img src>` to a base64 GIF placeholder and puts
   the real URL in `data-orig-src`. Promote `data-orig-src` → `src`.
4. Rewrite `wp-content/uploads` URLs to the `cms.` host
5. Map surviving `<img>` to `next/image` where dimensions are known
6. Flag images pointing at dead external hosts (Flickr, cbc.ca) so they can be
   re-hosted or removed — a reporting script, not a silent deletion

Once Avada is deactivated, new posts author cleanly in the block editor and skip
steps 1–3 entirely.

### 8.2 Taxonomy

41 categories exist, but `brio-health-clinic` is applied to 316 of 422 posts and
functions as "uncategorized." A cleanup pass — done in `/wp-admin` against real
data, not guessed by a script — should collapse these into a handful of real
categories (Recipes, Health Tips, Clinic News, Programs). This is content work
for the client with our guidance, scheduled after launch.

> The old `scripts/import-blog.ts` guessed categories by regex against an invented
> taxonomy and hardcoded every author. It is obsolete under this architecture and
> gets deleted with the rest of the old codebase.

---

## 9. Integrations

| Feature | Approach |
|---|---|
| **Booking** | Jane App. All booking CTAs link to `https://yourbriohealth.janeapp.com`, stored once as an SCF Options field. No embed — Jane's own flow converts better than an iframe. |
| **Newsletter** | Mailchimp. `POST /api/newsletter` route handler, rebuilt. Server-side only; keys never reach the client. |
| **Contact form** | Resend. `POST /api/contact`, rebuilt, with honeypot + rate limit. |
| **SEO** | A `buildMetadata()` helper merging page-level SCF SEO fields over Options-page defaults, wired into every route's `generateMetadata`. Yoast data is available on the REST response if the client keeps Yoast; otherwise plain SCF fields. |
| **Structured data** | JSON-LD: `MedicalClinic` on home/contact with real NAP, `Article` on posts, `Person` on team bios, `Service` on service pages. Local SEO matters a lot for a Richmond clinic. |
| **Analytics** | Vercel Analytics. No third-party tag manager. |

### NAP (single source of truth, Options page)

```
Brio Health Inc.
2168 – 3779 Sexsmith Road, Richmond, BC
(604) 271-9355
info@yourbriohealth.com
```

---

## 10. WordPress side of the work

### 10.0 What the host actually is (probed 2026-09-03)

| | |
|---|---|
| Web server | nginx, PHP **8.2.33** |
| Control panel | **Plesk (Linux)** — `X-Powered-By: PleskLin`, panel live at `https://yourbriohealth.com:8443` |
| Host / IP | **Rebel.com** — `canada22.rebel.com` / `208.69.79.182` |
| DNS | **Vanity nameservers** `ns1/ns2.yourbriohealth.com` → `208.69.79.120`, on Rebel infrastructure. Zone is edited in Plesk. |
| Email | **Google Workspace** (`aspmx.l.google.com`) — MX records must survive the DNS cutover |
| Active plugins visible | `complianz-gdpr`, `cookie-law-info`, `wp-google-places-review-slider` |
| Theme | `Avada` + `Avada-Child-Theme` |

Three separate credentials are needed, and they are not the same thing:

1. **WordPress admin** (`/wp-login.php`) — enough to install SCF and upload a
   theme zip. Not enough for a git-based workflow on `acf-json/`.
2. **Plesk panel** (`:8443`) — the one that matters. Gives File Manager, SSH/SFTP
   credentials, the database, the DNS zone editor, and **WP Toolkit**.
3. **Rebel.com account** — registrar-level, only needed if we move nameservers
   off the Plesk box.

### 10.0a Use WP Toolkit's clone-to-staging first

Plesk ships **WordPress Toolkit**, which clones the whole install (files + DB) to
a staging subdomain in one action. Steps 1–6 below all get done on the clone
first, verified, and only then repeated on production. Deactivating Avada on a
live clinic site with no rollback is not a thing to do on a Thursday.

Staging also gives the Next.js build a real SCF-enabled endpoint to develop
against, months before production changes at all.

### 10.0b DNS cutover risk

Because the zone is served from vanity nameservers on the Plesk box, pointing the
apex at Vercel means editing the zone in Plesk (change `A @` to Vercel's IP, add
`CNAME cms` → the current host) — **not** repointing nameservers. Repointing
nameservers to Vercel would drop the Google Workspace MX records and take the
clinic's email down. Whatever path is taken, export the current zone file first.

### 10.1 Steps

1. **Deactivate Avada / Fusion Builder** and the theme-bundled plugin stack.
2. **Install a minimal headless theme** — a bare theme whose only job is to hold
   `functions.php`, `acf-json/`, CPT registration, and the revalidation webhook.
   No templates, no front-end assets.
3. **Install Secure Custom Fields**, define the field groups in §4, enable
   *Show in REST API* on each, and commit `acf-json/`.
4. **Register CPTs** with `show_in_rest => true` and a REST base per §4.1.
5. **Lock down the front end** — WordPress no longer serves pages to the public.
   Redirect all non-`/wp-admin`, non-`/wp-json` traffic on the `cms.` host to the
   Vercel site.
6. **Harden** — disable XML-RPC, restrict `wp/v2/users` exposure, keep REST reads
   public (they're already public today) but nothing writable unauthenticated.
7. **Move the hostname** to `cms.yourbriohealth.com`; point the apex at Vercel.

Steps 1–6 are reversible and can be staged before any DNS change. Step 7 is the
only cutover moment, and it's a DNS record.

---

## 11. Open items — need answers before build

### Blocking

1. ~~**The logo file.**~~ **Resolved 2026-09-03** — received as PNG, sampled, and
   folded into §7.1a. Brand teal corrected to `#00919D`. An SVG is still wanted
   for the header lockup but is no longer blocking.

2. **Back up `planning/` and `briohealth/`.** Both are in `.gitignore`. This
   content — the wireframe, the notes, the 422-post scrape, the media mirror —
   exists **only on this disk, in no commit**. Before the rebuild touches the
   working tree it must be copied somewhere else. (446MB total, but 391MB of that
   is two videos: `BrioBookNowVideo.mp4` 297MB and `BRIOP.mp4` 94MB. The JSON and
   images that actually matter are well under 100MB and could be committed to a
   sibling archive repo.)

3. **Host access — specifically the Plesk login.** See §10.0. Ask whoever
   currently maintains the site (or Rebel.com support, as the account holder) for
   the Plesk panel credentials at `https://yourbriohealth.com:8443`. WordPress
   admin alone is *not* sufficient — `acf-json/` in version control needs file
   access, and the staging clone needs WP Toolkit. If the client only has
   wp-admin, the fallback is: SCF via the plugin installer, theme via zip upload,
   and `acf-json/` synced by hand on each deploy. Workable, but worse.

### Re-confirm

4. **Strip down the existing WP install** vs. standing up a fresh one and
   importing. The lean is *strip down the existing install* — the media library
   and post IDs stay intact, which is most of the value. This was selected in a
   tool call that got interrupted, so it should be confirmed rather than assumed.

### Scope

5. ~~**v1 page scope.**~~ **Decided 2026-09-03 — full nav at launch.** All ~14
   routes ship together. No SEO gap, one cutover.

6. **DNS mechanics.** Registrar and host are both **Rebel.com** (§10.0), and the
   zone lives on the Plesk box. Remaining question is who holds that account and
   whether there's a maintenance-window preference. **Email is Google Workspace —
   the MX records must be preserved through the cutover** (§10.0b).

---

## 12. Build order

**Toolchain, verified installed 2026-09-03:** Node 24.13.1 · Next **16.2.7** ·
React **19.2.4** · Tailwind **4.3.0**. Turbopack is the default in Next 16 for
both `dev` and `build` — no `--turbopack` flag needed, and `next.config.ts` uses
a top-level `turbopack` key rather than `experimental.turbopack`.

**Steps 1–9 need no WordPress access.** The live REST API at
`yourbriohealth.com/wp-json/wp/v2/` is public and works today, so the front end
can be built and reviewed in full against real posts and real categories while
the Plesk credentials (§11.3) are still being chased. Only steps 10–12 are
blocked.

1. Scaffold fresh Next.js 16 app; port the redirect map and `middleware.ts`
2. Tokens, typography, `Container`, band primitives, button/link system
3. WP client + types + `renderContent` transform, against the live public REST API
   (works today, before any WP changes)
4. Header, footer, nav
5. Homepage against the StoryBrand sequence, with designed placeholders
6. Blog index, post, category
7. Service / program / team templates
8. Contact, newsletter, booking CTAs
9. SEO, JSON-LD, sitemap, RSS
10. WordPress side: theme, SCF groups, CPTs, webhook
11. Wire the front end to the SCF fields (until now it reads stock REST + fixtures)
12. Cutover: DNS, redirects verified, revalidation smoke-tested
