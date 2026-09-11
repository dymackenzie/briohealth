import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { BandDivider } from '@/components/ui/BandDivider'
import { Button } from '@/components/ui/Button'
import { DotRule } from '@/components/brand/DotBurst'
import { formatDate } from '@/components/blog/PostCard'
import { authorName, featuredImage, getPost, postCategories } from '@/lib/wp/queries'
import { decodeTitle, plainExcerpt, renderContent } from '@/lib/wp/renderContent'
import { articleJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'
import { absoluteUrl, site } from '@/lib/site'

export const revalidate = 3600
export const dynamicParams = true

/**
 * Deliberately not pre-rendering all 418 at build time — that's 418 requests to
 * the clinic's shared host on every deploy. They render on first visit and
 * stay cached until the webhook says otherwise.
 */
export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const post = await getPost(slug)
  if (!post) return buildMetadata({ title: 'Not found', path: `/blog/${slug}` })

  const image = featuredImage(post)

  return buildMetadata({
    title: decodeTitle(post.title.rendered),
    description: plainExcerpt(post.excerpt.rendered, 160),
    path: `/blog/${post.slug}`,
    image: image?.url,
    type: 'article',
    publishedTime: post.date,
  })
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const post = await getPost(slug)
  if (!post) notFound()

  const image = featuredImage(post)
  const categories = postCategories(post)
  const title = decodeTitle(post.title.rendered)
  const url = absoluteUrl(`/blog/${post.slug}`)

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title,
          description: plainExcerpt(post.excerpt.rendered, 160),
          url,
          image: image?.url,
          published: post.date,
          modified: post.modified,
          author: authorName(post),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Blog', path: '/blog' },
          { name: title, path: `/blog/${post.slug}` },
        ])}
      />

      <Band tone="teal" as="div" flush className="relative overflow-hidden">
        <Header />

        <Container prose className="relative pt-6 pb-14 lg:pt-8 lg:pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[0.9rem] opacity-70 transition-opacity hover:opacity-100"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All posts
          </Link>

          <h1 className="rise-in mt-6 text-[clamp(1.6rem,3.2vw,2.3rem)]">{title}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.9rem] opacity-75">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {categories.length > 0 && (
              <>
                <span className="opacity-40">·</span>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="underline underline-offset-4 hover:no-underline"
                  >
                    {decodeTitle(category.name)}
                  </Link>
                ))}
              </>
            )}
          </div>
        </Container>

        <BandDivider curve="drift" fill="text-canvas" className="-mb-px" />
      </Band>

      <main id="main">
        <Band tone="cream" className="pt-4">
          {image && (
            <Container className="mb-10">
              {/* Capped at its own width — plenty of these are 800px and
                  upscaling them to the container just looks soft. */}
              <Image
                src={image.url}
                alt={image.alt}
                width={image.width ?? 1600}
                height={image.height ?? 900}
                priority
                sizes="(min-width: 1200px) 1200px, 100vw"
                style={{ maxWidth: image.width ? `${image.width}px` : undefined }}
                className="mx-auto w-full rounded-lg object-cover"
              />
            </Container>
          )}

          <Container prose>
            <div className="post-body">{renderContent(post.content.rendered)}</div>

            <DotRule className="mt-11 h-2.5 w-28 text-teal-500/40" />

            <div className="mt-7 rounded-lg bg-sand-200 px-6 py-6">
              <h2 className="text-base">Have a question about your health?</h2>
              <p className="mt-3 text-ink-500">
                Book an appointment and we&rsquo;ll work through it together.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href={site.bookingUrl}>Book an appointment</Button>
                <Button href="/contact" variant="outline">
                  Contact us
                </Button>
              </div>
            </div>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
