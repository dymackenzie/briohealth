import { absoluteUrl, site, type SiteSettings } from './site'

/**
 * Local SEO does a lot of work for a single-location clinic, so the NAP here
 * must match the footer and contact page exactly: both read the same settings.
 */
export function clinicJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: settings.legalName,
    url: settings.url,
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.street,
      addressLocality: settings.address.locality,
      addressRegion: settings.address.region,
      postalCode: settings.address.postal,
      addressCountry: settings.address.country,
    },
    // Physical hours only. The alternating remote Saturday is a note on the
    // page, never here: schema.org cannot say "alternating" and Google would
    // read it as the clinic being physically open.
    openingHoursSpecification: settings.hours.map((row) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: row.days.map((d) => `https://schema.org/${d}`),
      opens: row.opens,
      closes: row.closes,
    })),
    medicalSpecialty: 'Naturopathic',
    foundingDate: String(settings.foundedYear),
    sameAs: settings.social.map((s) => s.href),
  }
}

export function articleJsonLd({
  title,
  description,
  url,
  image,
  published,
  modified,
  author,
}: {
  title: string
  description?: string
  url: string
  image?: string | null
  published: string
  modified?: string
  author: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image ?? undefined,
    datePublished: published,
    dateModified: modified ?? published,
    author: { '@type': 'Person', name: author },
    publisher: { '@type': 'Organization', name: site.legalName },
    mainEntityOfPage: url,
  }
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function JsonLd({ data }: { data: object }) {
  // Post titles land in here, so a `</script>` in one would close the tag
  // early and drop the rest of the payload into the document as markup.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
