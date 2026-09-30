import type { Metadata } from 'next'

import { absoluteUrl, defaultDescription, site } from './site'

/**
 * Next replaces openGraph wholesale rather than merging it with the layout's,
 * so every page carries these or it loses its share image.
 */
export const siteOpenGraph = {
  siteName: site.name,
  locale: 'en_CA',
  images: [
    {
      url: absoluteUrl(site.ogImage.url),
      width: site.ogImage.width,
      height: site.ogImage.height,
      alt: site.ogImage.alt,
    },
  ],
}

/**
 * A plain `title` is wrapped by the root layout's `%s | Brio Health`
 * template; `{ absolute }` skips it (the homepage).
 */
export function buildMetadata({
  title,
  description = defaultDescription,
  path = '/',
  image,
  type = 'website',
  publishedTime,
  noindex = false,
}: {
  title: string | { absolute: string }
  description?: string
  path?: string
  image?: string | null
  type?: 'website' | 'article'
  publishedTime?: string
  noindex?: boolean
}): Metadata {
  const url = absoluteUrl(path)

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
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
