const CLINIC = {
  name: 'Brio Health Inc.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2168 – 3779 Sexsmith Road',
    addressLocality: 'Richmond',
    addressRegion: 'BC',
    postalCode: 'V6X 3Z2',
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 49.1720,
    longitude: -123.1433,
  },
  telephone: '(604) 271-9355',
  email: 'info@yourbriohealth.com',
  url: 'https://www.yourbriohealth.com',
  sameAs: [
    'https://www.facebook.com/briohealth',
    'https://www.instagram.com/briohealth',
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' },
  ],
}

export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'LocalBusiness'],
    '@id': 'https://www.yourbriohealth.com/#clinic',
    name: CLINIC.name,
    description: 'Integrative health clinic offering naturopathic medicine, acupuncture, IV therapy, laser therapy, and massage in Richmond, BC.',
    address: CLINIC.address,
    geo: CLINIC.geo,
    telephone: CLINIC.telephone,
    email: CLINIC.email,
    url: CLINIC.url,
    sameAs: CLINIC.sameAs,
    openingHoursSpecification: CLINIC.openingHoursSpecification,
    medicalSpecialty: ['Naturopathic Medicine', 'Acupuncture', 'Integrative Medicine'],
    priceRange: '$$',
    image: 'https://www.yourbriohealth.com/og-image.jpg',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function ArticleJsonLd({ post, url }: { post: any; url: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Brio Health',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Brio Health Inc.',
      url: 'https://www.yourbriohealth.com',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(post.heroImage?.asset?.url && { image: post.heroImage.asset.url }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function FaqPageJsonLd({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
