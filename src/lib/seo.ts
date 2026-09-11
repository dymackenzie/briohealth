import type { Metadata } from 'next'

import { absoluteUrl } from './site'

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
  const images = image ? [{ url: image }] : undefined

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
  }
}
