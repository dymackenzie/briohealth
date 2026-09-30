import { notFound } from 'next/navigation'

import { PageHero } from '@/components/layout/PageHero'
import { buildMetadata } from '@/lib/seo'
import { getPage } from '@/lib/wp/queries'
import { decodeTitle, plainExcerpt, renderContent } from '@/lib/wp/renderContent'

export const revalidate = 3600
export const dynamicParams = false

/**
 * CMS pages with no template of their own: the plain-text layout, 19px on a
 * 68ch measure. Adding one means adding it here and to TOP_LEVEL_ROUTES in
 * src/lib/redirects.ts, or the proxy sends it to /blog/<slug>. With
 * WordPress unreachable they 404 rather than fail the build.
 */
const CMS_PAGES = ['privacy-policy', 'terms-of-use']

export function generateStaticParams() {
  return CMS_PAGES.map((slug) => ({ slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const page = await getPage(slug)
  if (!page) return buildMetadata({ title: 'Not found', path: `/${slug}`, noindex: true })

  return buildMetadata({
    title: decodeTitle(page.title.rendered),
    description: plainExcerpt(page.excerpt?.rendered ?? '', 160) || undefined,
    path: `/${page.slug}`,
  })
}

export default async function CmsPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const page = await getPage(slug)
  if (!page) notFound()

  const title = decodeTitle(page.title.rendered)

  return (
    <main id="main">
      <PageHero title={title} />
      <div className="container-x pb-24">
        <div className="prose-post">{renderContent(page.content.rendered, { title })}</div>
      </div>
    </main>
  )
}
