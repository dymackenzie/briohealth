import { absoluteUrl, site } from './site'

/**
 * Local SEO does a lot of work for a single-location clinic, so the NAP here
 * has to match the footer and contact page exactly.
 */
export function clinicJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: site.legalName,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postal,
      addressCountry: site.address.country,
    },
    /**
     * Physical hours only. The alternating remote Saturday is left out on
     * purpose — see the note in site.ts.
     */
    openingHoursSpecification: site.hours.map((row) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: row.days.map((d) => `https://schema.org/${d}`),
      opens: row.opens,
      closes: row.closes,
    })),
    medicalSpecialty: 'Naturopathic',
    foundingDate: String(site.foundedYear),
    sameAs: site.social.map((s) => s.href),
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

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  )
}
