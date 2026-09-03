# Access request — send to the clinic / current site maintainer

Everything below is read-only or staging-only. Nothing here changes the live
site, and no step is taken on production until it's been proven on a clone.

---

**Subject:** Website rebuild — hosting access needed

Hi,

To start the website rebuild I need access to a few things. Some background on
why, so it's clear what's being asked for and what it's used for.

The new site will be much faster because the page builder (Avada) is being
removed from the public site. WordPress stays exactly as it is for you — same
login, same place you write blog posts, same media library. All 400+ existing
posts stay put; nothing is migrated or retyped. WordPress just stops drawing the
public pages, and a new front end does that instead.

**1. Plesk control panel**

The site is hosted with Rebel.com and managed through a Plesk panel at:

    https://yourbriohealth.com:8443

I need the login for this. If nobody on your side has it, Rebel.com support can
reset it — but the request has to come from the account holder, so that would
need to be you.

This is the important one. It's what lets me make a safe copy of the site to
test on, rather than experimenting on the live site.

**2. WordPress administrator account**

An admin account at `yourbriohealth.com/wp-login.php`. A new account created for
me is better than sharing an existing one — that way you can see exactly what
changed and remove the access cleanly when the project ends.

**3. Rebel.com account access — later, not yet**

Only needed on launch day, to point the domain at the new site. Flagging it now
so it isn't a surprise later. Nothing needs to happen with this today.

**Two things worth confirming:**

- Your email runs on Google Workspace. It is unaffected by all of this, and the
  launch-day domain change will be done in a way that leaves email alone. Just
  want it on the record that I know it's there.
- Is there anyone else currently maintaining the site — a previous developer or
  agency — who should be looped in before I make changes?

**On timing:** I can build most of the new site before needing any of this, so
nothing is stalled today. Item 1 is the one that eventually gates progress, so
it's worth starting on it now.

Thanks,
Mackenzie

---

## Notes for me (don't send)

- Plesk `:8443` confirmed live — returns a 303 to the login. Host is
  `canada22.rebel.com` / `208.69.79.182`.
- First thing to do once in: **WP Toolkit → Clone** to a staging subdomain.
  Every step in spec §10.1 happens on the clone first.
- Before any DNS work: **export the zone file.** MX points at Google Workspace
  (`aspmx.l.google.com` + 4 alts). Repointing nameservers would break their
  email — the cutover edits the `A` record inside Plesk instead.
- If only wp-admin ever materializes, the fallback is SCF via the plugin
  installer, theme via zip upload, `acf-json/` synced by hand. Works, but no
  staging clone and no git-backed content model.
