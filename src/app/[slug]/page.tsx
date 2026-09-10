import { notFound } from 'next/navigation'

import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { getPage } from '@/lib/wp/queries'
import { decodeTitle, plainExcerpt, renderContent } from '@/lib/wp/renderContent'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

/**
 * Anything CMS-managed that doesn't need its own template — privacy policy,
 * terms, whatever the client adds later.
 *
 * proxy.ts sends unknown root slugs to /blog/<slug>, so this only ever runs
 * for the handful listed here.
 */
const CMS_PAGES = ['privacy-policy', 'terms-of-use']

export function generateStaticParams() {
  return CMS_PAGES.map((slug) => ({ slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const page = await getPage(slug)
  if (!page) return buildMetadata({ title: 'Not found', path: `/${slug}` })

  return buildMetadata({
    title: decodeTitle(page.title.rendered),
    description: plainExcerpt(page.excerpt?.rendered ?? '', 160) || undefined,
    path: `/${page.slug}`,
  })
}

export default async function CmsPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  if (!CMS_PAGES.includes(slug)) notFound()

  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <>
      <PageHero title={decodeTitle(page.title.rendered)} />

      <main id="main">
        <Band tone="cream" className="pt-4">
          <Container prose>
            <div className="post-body">{renderContent(page.content.rendered)}</div>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
