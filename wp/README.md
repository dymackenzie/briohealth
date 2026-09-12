# WordPress side

`brio-headless/` is the theme that turns the existing Avada install into a
backend. Deploy it to a WP Toolkit staging clone first — deactivating Avada on
the live clinic site with no rollback is not a thing to do on a Thursday.

Full context is in the design spec, §10.

## What's in it

| | |
|---|---|
| `functions.php` | Wires up the rest and points SCF at `acf-json/` |
| `inc/post-types.php` | `service`, `program`, `team_member`, `testimonial`, `faq` |
| `inc/options.php` | Site settings page + `/wp-json/brio/v1/settings` |
| `inc/revalidate.php` | `save_post` → `POST /api/revalidate` on the Next site |
| `inc/headless.php` | Front-end lockdown and hardening |
| `inc/preview.php` | Renders post previews, which the lockdown would otherwise kill |
| `acf-json/` | The field groups, in git |

## Install

1. **Clone to staging.** Plesk → WordPress Toolkit → Clone. Everything below
   happens on the clone until it's verified.

2. **Add the constants** to `wp-config.php`, above the
   `/* That's all, stop editing */` line:

   ```php
   define( 'BRIO_SITE_URL',          'https://yourbriohealth.com' );
   define( 'BRIO_REVALIDATE_SECRET', '<same value as WP_REVALIDATE_SECRET on Vercel>' );
   ```

   Generate the secret with `openssl rand -hex 32`. On staging, point
   `BRIO_SITE_URL` at the Vercel preview URL instead.

3. **Install Secure Custom Fields** — Plugins → Add New → search "Secure Custom
   Fields" (the WordPress.org one, not ACF). Activate.

4. **Upload the theme.** Copy `brio-headless/` into `wp-content/themes/`, or zip
   it and use Appearance → Themes → Add New → Upload. Don't activate yet.

5. **Deactivate the Avada theme's extras — but leave Fusion Builder alone for
   now.** The recent blog posts are built with Fusion, and without the plugin
   they open in the editor as a wall of `[fusion_builder_container]`
   shortcodes. The client asked specifically that whoever writes the blog can
   keep working normally, so Fusion stays until you've checked, post by post,
   that they don't need it.

   Fusion Builder may refuse to load without the Avada theme active — several
   versions check. **Test that on the staging clone before you touch the live
   site**, because it decides which of two paths you're on:

   - *It runs* → leave it active. Old posts stay editable as they are.
   - *It won't run* → leave the old posts alone. They still render correctly on
     the public site (`renderContent.ts` normalises Fusion markup), and new
     posts get written in the block editor. Say so to the client before the
     switch rather than after.

   Leave `complianz-gdpr` and `cookie-law-info` alone either way — the cookie
   banner is a compliance decision, not a technical one.

6. **Activate Brio Headless.** The field groups appear on their own; SCF reads
   `acf-json/` on load. If they don't, Custom Fields → Field Groups → Sync.

7. **Tag the pages.** Each page needs its template set under Page Attributes,
   or its fields won't show:

   | Page | Template |
   |---|---|
   | About | About |
   | Services | Services overview |
   | Contact | Contact |
   | Pickleball | Pickleball |

   The home page picks its group up automatically from Settings → Reading.

8. **Fill in Site settings** — phone, address, hours, Jane link. Hours are the
   one thing we don't have yet and the contact page and Google both want them.

9. **Check the API.** These should all return JSON:

   ```
   /wp-json/brio/v1/settings
   /wp-json/wp/v2/services
   /wp-json/wp/v2/testimonials
   /wp-json/wp/v2/pages?slug=about-2
   ```

   And `/wp-json/wp/v2/users` should now 404 while
   `/wp-json/wp/v2/posts?_embed=1` still comes back with an author name.

10. **Test the webhook.** Publish anything, then check the Vercel function log
    for a hit on `/api/revalidate`. A missing `BRIO_REVALIDATE_SECRET` shows as
    an admin notice rather than failing quietly.

Steps 2–10 are all reversible. The only one-way step is the DNS change in §10.1
step 7, and that's a separate day.

## What the blog editor sees afterwards

The client's existing web person keeps working in wp-admin exactly as before.
Worth being able to answer these when they ask:

| | |
|---|---|
| Writing and editing posts | Unchanged. Same editor, same media library. |
| **Preview** | Works. WordPress renders it — a clean page with the post's own words, headings and images, not the live layout. `inc/preview.php` explains why. |
| **View post** | Goes to the real page on the public site. |
| Publishing | The webhook fires on save and the public page updates within seconds. No cache to clear by hand. |
| Categories and tags | Unchanged, and editing one revalidates its archive. |
| Featured images | Unchanged. |
| The public front end of *this* install | Gone — every URL redirects to the Next site. That's the point of the switch. |

The one honest gap is that Preview doesn't show the site's design. Closing it
means Next draft mode: WordPress hands off to `/api/preview`, which reads the
draft over the REST API and renders it in the real templates. That needs an
application password stored on Vercel, so it waits for a staging endpoint.
`inc/preview.php` has the note.

## Editing the field groups

Edit them in wp-admin. SCF writes the JSON back into `acf-json/`, so the change
arrives as a diff — commit it like any other. Hand-editing the JSON works too,
but then hit Sync in the admin afterwards.

## Field group locations

Groups bind to a **page template**, not a page ID, so they survive the staging
clone and any future rebuild. That's what the `template-*.php` stubs are for;
they never render anything.
