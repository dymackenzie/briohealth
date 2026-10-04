# WordPress side

`brio-headless/` is the theme that turns the existing Avada install into a
backend. Deploy it to a WP Toolkit staging clone first; deactivating Avada on
the live clinic site with no rollback is not a thing to do on a Thursday.

Content model: spec section 8 in
`docs/superpowers/specs/2026-09-30-brio-signal-rebuild-design.md`, as revised
by section 9 of `docs/superpowers/specs/2026-10-02-brio-signal-revision-design.md`.

## What is in it

| | |
|---|---|
| `functions.php` | Wires up the rest and points SCF at `acf-json/` |
| `inc/post-types.php` | `service`, `testimonial`, `faq` |
| `inc/options.php` | Site settings page and `/wp-json/brio/v1/settings` |
| `inc/revalidate.php` | Publish, update, trash: `POST /api/revalidate` on the Next site |
| `inc/headless.php` | Front-end lockdown and hardening |
| `inc/preview.php` | Renders post previews, which the lockdown would otherwise kill |
| `template-*.php` | Empty stubs that let a page pick its field group |
| `acf-json/` | The field groups, generated from `../tools/field-groups.mjs` |

## Editing the field groups

The source of truth is `wp/tools/field-groups.mjs`. Change it, then:

    node wp/tools/build-acf-json.mjs
    node wp/tools/check-acf-json.mjs

and commit both the source and the generated JSON. SCF reads `acf-json/` on
load. If you edit a group in wp-admin instead, SCF writes the JSON back into
`acf-json/`; copy the change into `field-groups.mjs` so the next build does
not undo it.

## Install

1. **Clone to staging.** Plesk, WordPress Toolkit, Clone. Everything below
   happens on the clone until it is verified.

2. **Add the constants** to `wp-config.php`, above the
   `/* That's all, stop editing */` line:

   ```php
   define( 'BRIO_SITE_URL',          'https://yourbriohealth.com' );
   define( 'BRIO_REVALIDATE_SECRET', '<same value as WP_REVALIDATE_SECRET on Vercel>' );
   ```

   Generate the secret with `openssl rand -hex 32`. On staging, point
   `BRIO_SITE_URL` at the Vercel preview URL.

   On the Vercel side, set `WP_REVALIDATE_SECRET` to the same value, and
   `WP_API_URL` to the clone's `/wp-json` while testing against staging.
   Redeploy after changing either; Vercel only applies env changes to new
   deployments.

3. **Install Secure Custom Fields** (the WordPress.org plugin, not ACF).
   Activate it.

4. **Upload the theme.** Copy `brio-headless/` into `wp-content/themes/`, or
   zip it and use Appearance, Themes, Add New, Upload. Do not activate yet.

5. **Fusion Builder.** The recent blog posts are built with it. Test on the
   clone whether it runs without the Avada theme active. If it runs, leave it
   active and old posts stay editable as they are. If it will not, leave the
   old posts alone (they render correctly on the public site; the normaliser
   handles Fusion markup) and new posts are written in the block editor. Tell
   the client before the switch, not after. Leave the cookie plugins alone.

6. **Activate Brio Headless.** The field groups appear on their own. If they
   do not: Custom Fields, Field Groups, Sync.

7. **Tag the pages.** Each needs its template set under Page Attributes, or
   its fields will not show:

   | Page | Template |
   |---|---|
   | About | About |
   | Contact | Contact |
   | New Patient (the old Book Now page) | New Patient |
   | Pickleball | Pickleball |

   The home page picks its groups up from Settings, Reading (front page).

8. **Fill in Site settings**: phone, address, hours, the Saturday note, the
   Jane link, the CTA label ("Book Appointment"), socials.

9. **Add the three services** (slugs `naturopathic`, `acupuncture`,
   `iv-therapy`; the slug is the URL), the testimonials and the FAQs. The
   copy to paste is in `src/lib/content/` on the Next side. The service
   bodies are the live pages' text (`src/lib/content/services.ts`, `body` and
   `closing`); paste them into the wysiwyg fields and keep the headings and
   lists.

10. **Check the API.** These should all return JSON:

    ```
    /wp-json/brio/v1/settings
    /wp-json/wp/v2/services
    /wp-json/wp/v2/testimonials
    /wp-json/wp/v2/faqs
    /wp-json/wp/v2/pages?slug=about-2
    ```

    `/wp-json/wp/v2/users` should 404 while `/wp-json/wp/v2/posts?_embed=1`
    still comes back with an author name. Logged out, `/wp-json/wp/v2/users/1`
    should show `id` and `name` but no `slug`, `link` or `avatar_urls`.

11. **Test the webhook.** Publish anything, then check the Vercel function
    log for a hit on `/api/revalidate`. A missing `BRIO_REVALIDATE_SECRET`
    shows as an admin notice rather than failing quietly. The call goes out
    after WordPress has answered the editor, so a failure only shows in the
    PHP error log (`[brio] revalidate ...`), never as a failed save.

    That depends on PHP-FPM. Check it on the clone: Plesk, the domain, PHP
    Settings, "PHP support" should read "FPM application served by Apache"
    (or by nginx). Under mod_php or plain FastCGI there is no
    `fastcgi_finish_request()`, so each save waits for the webhook, up to 3
    seconds per call when the Vercel site is slow or down. Switch the
    handler to FPM if the host allows it; otherwise saves are just slower.

Steps 2 to 11 are reversible. The only one-way step is the DNS change in the
2026-09-02 spec, section 10.1, and that is a separate day.

## Service videos

Each service has three fields: a background loop, its still, and the
narrated video. Dr. Jeff narrates the full video; the loop is what plays
silently on the home page tiles (on hover, or as they scroll into view on
phones) and behind the service page title.

**Loop** (`Background loop`): 8 to 15 seconds, 1280x720, H.264 MP4, no
audio track, under about 3 MB. From the full video, in HandBrake or
ffmpeg:

    ffmpeg -ss 00:00:12 -t 10 -i full.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 24 -preset slow -movflags +faststart loop-naturopathic.mp4

Upload it to the media library (Media, Add New; the install's upload limit
must be at least 3 MB, which Plesk sets under PHP Settings), then pick it
in the field.

**Still** (`Loop still`): one frame from the loop, JPG, 1600 pixels wide:

    ffmpeg -ss 00:00:02 -i loop-naturopathic.mp4 -frames:v 1 -vf scale=1600:-2 -q:v 3 still-naturopathic.jpg

It shows until the loop plays, on devices that cannot play it, and for
anyone who prefers less motion.

**Narrated video** (`Narrated video`): upload the full video to YouTube
(unlisted is fine) and paste its link. The site shows "Watch the video"
only when this is filled in.

## What the editor sees afterwards

| | |
|---|---|
| Writing and editing posts | Unchanged. Same editor, same media library. |
| Pages | Labelled forms instead of the Avada builder. Every field says what it is for and how long it should be. Empty fields fall back to the site's own copy. |
| Preview | Works. WordPress renders a clean page with the post's words, not the live layout. |
| View post | Goes to the real page on the public site. |
| Publishing | The webhook fires on save; the public page updates within a minute. |
| The public front end of this install | Gone. Every URL redirects to the Next site. |
