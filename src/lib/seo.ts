import type { Metadata } from 'next'

import { absoluteUrl, site } from './site'

/**
 * Next replaces openGraph wholesale rather than merging it with the layout's,
 * so every page has to carry these or it loses its share image.
 */
export const siteOpenGraph = {
  siteName: site.name,
  locale: 'en_CA',
  images: [{ url: '/brio_social_2.png', width: 1081, height: 1081, alt: site.name }],
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  publishedTime,
}: {
  title: string
  description?: string
  path?: string
  image?: string | null
  type?: 'website' | 'article'
  publishedTime?: string
}): Metadata {
  const url = absoluteUrl(path)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...siteOpenGraph,
      title,
      description,
      url,
      type,
      ...(image ? { images: [{ url: image }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
  }
}
