# Brio Health

The website for [Brio Health](https://yourbriohealth.com), an integrative health
clinic in Richmond, BC, run by Dr. Jeffrey Lee since 2006.

The old site was WordPress with the Avada theme. It was slow, and editing it
meant fighting the page builder. This is a rebuild of the public site in
Next.js, hosted on Vercel. WordPress stays on as the backend, so the clinic
keeps its admin, its media library and all 400-odd blog posts. It just
stops rendering pages. Next pulls the content over the REST API instead, and
WordPress pings the site to refresh whenever something is published.

The `wp/` folder has the small WordPress theme that makes this work: custom
post types, the editable fields for each page, and a lockdown that sends
visitors from the old front end to the new one.
