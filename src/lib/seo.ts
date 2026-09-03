import type { Metadata } from 'next'

interface SeoInput {
  metaTitle?: string
  metaDescription?: string
  ogImage?: { asset?: { url: string } }
  noIndex?: boolean
}

interface SiteSettings {
  title?: string
  metaTitle?: string
  metaDescription?: string
  ogImage?: { asset?: { url: string } }
}

export function buildMetadata(seo: SeoInput | null | undefined, site: SiteSettings | null | undefined, pageTitle?: string): Metadata {
  const siteName = site?.title || 'Brio Health'
  const title = seo?.metaTitle || pageTitle || site?.metaTitle || siteName
  const description = seo?.metaDescription || site?.metaDescription || 'Brio Health Inc. — integrative health clinic in Richmond BC. Naturopathic medicine, acupuncture, IV therapy, laser, massage and more.'
  const ogImageUrl = seo?.ogImage?.asset?.url || site?.ogImage?.asset?.url

  return {
    title: `${title} | ${siteName}`,
    description,
    openGraph: {
      title,
      description,
      siteName,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    robots: seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}
