import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { pageBySlugQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import Container from '@/components/ui/Container'
import { PortableText } from '@portabletext/react'
import SectionRenderer from '@/components/sections/SectionRenderer'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [page, site] = await Promise.all([
    client.fetch(pageBySlugQuery, { slug }, { next: { tags: ['page'] } }),
    client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } }),
  ])
  return buildMetadata(page?.seo, site, page?.title)
}

export default async function GenericPage({ params }: Props) {
  const { slug } = await params
  const page = await client.fetch(pageBySlugQuery, { slug }, { next: { tags: ['page'] } })
  if (!page) notFound()

  if (page.mode === 'legal') {
    return (
      <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
        <Container size="prose">
          <h1 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-8">{page.title}</h1>
          {page.legalBody && (
            <div className="prose">
              <PortableText value={page.legalBody} />
            </div>
          )}
        </Container>
      </section>
    )
  }

  return <SectionRenderer sections={page.sections} />
}
