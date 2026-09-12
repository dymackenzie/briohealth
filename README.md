# Brio Health

Website for [Brio Health](https://yourbriohealth.com), an integrative clinic in
Richmond BC. Next.js 16 on Vercel, with the existing WordPress install kept on
as the CMS.

The client's editing flow doesn't change. They stay in wp-admin, keep the media
library, keep all 418 blog posts. What changes is that WordPress stops drawing
the public pages and Next reads it over the REST API instead.

None of the WordPress side is installed yet. Page copy still lives in
`src/lib/content/`, and swapping that for the API is the follow-up once there's
a staging endpoint to build against.

## Running it

```bash
yarn install
yarn dev          # localhost:3000
```

No env vars needed to start. `WP_API_URL` falls back to the live REST API,
which is readable without a key.

```bash
yarn build
yarn lint
yarn typecheck
```

yarn classic, 1.22. `vercel.json` pins `yarn install` and `yarn build`, so
`yarn.lock` is the lockfile that counts — don't leave a `package-lock.json`
behind.

Stop the dev server before installing anything. Yarn can't unlink
`node_modules/@next/swc-win32-x64-msvc` while it's running and the install dies
with `EPERM`.

There's no test suite.

## Layout

```
src/app/            routes
src/components/     ui, layout, brand, blog, forms
src/lib/wp/         REST client, types, and the normaliser for post bodies
src/lib/content/    page copy, until it moves into the CMS
src/lib/site.ts     address, phone, hours, booking URL, nav
src/styles/         design tokens
src/proxy.ts        redirects for the old WordPress URLs
wp/brio-headless/   the theme that turns the WP install into a backend
docs/               spec and client correspondence
```

`wp/README.md` is the install runbook for the theme. It goes on a WP Toolkit
staging clone first — deactivating Avada on a live clinic site with no rollback
is not a thing to do on a Thursday.

## Worth knowing

Before making architectural decisions, read the design spec at
[`docs/superpowers/specs/2026-09-02-brio-headless-wordpress-redesign-design.md`][spec].
It records what was decided and why, including a few things that look arbitrary
without the history. [`docs/client-inputs.md`](docs/client-inputs.md) tracks
what we're still waiting on from the client.

Next 16 renamed `middleware` to `proxy`, `revalidateTag` now takes a cache
profile as its second argument, and `params` and `searchParams` are Promises.
`AGENTS.md` and `CLAUDE.md` have the rest of the sharp edges.

Brand teal is `#00919D`, sampled from the logo. Older planning notes say
`#1A929C`, which is a near-miss and reads muddier beside it. Use the first.

Nothing that reads from WordPress throws. `src/lib/wp/client.ts` logs the
failure and returns `null` or an empty collection, so callers have to handle
the empty case. A clinic site that renders a blank section beats one whose
build fails because WordPress had a bad minute.

Blog posts come in two shapes: clean HTML from 2009–2023, and Avada/Fusion
builder markup on the recent ones. `src/lib/wp/renderContent.ts` handles both.
Two things it has to get right — promoting `data-orig-src` onto `img`, because
Fusion's lazyloader parks a base64 GIF in `src` and every image is otherwise
blank, and dropping the markup Avada hid in stylesheets we no longer serve.

The photography doesn't exist yet; the client is shooting it. Image slots use
`Figure`, and its `subject` prop doubles as the shot list. A few of the
client's own photos are already wired in through `src/lib/content/photos.ts`.

## Environment

| Variable | What it's for |
|---|---|
| `WP_API_URL` | WordPress REST base. Defaults to the live apex. |
| `WP_REVALIDATE_SECRET` | Shared secret for the `save_post` webhook. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for the sitemap and OG tags. |
| `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`, `MAILCHIMP_SERVER_PREFIX` | Newsletter signup. |
| `RESEND_API_KEY` | Contact form. |

[spec]: docs/superpowers/specs/2026-09-02-brio-headless-wordpress-redesign-design.md
