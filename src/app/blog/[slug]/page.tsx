import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
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
  const hangs = !!image && (image.width ?? 0) >= 560

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

        <Container prose className={`relative pt-6 pb-14 lg:pt-8 ${hangs ? 'lg:pb-36' : 'lg:pb-16'}`}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-small text-canvas/80 transition-colors hover:text-canvas"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="link-draw">All posts</span>
          </Link>

          <h1 className="rise-in mt-6 text-h2">{title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-canvas/80">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {categories.length > 0 && (
              <>
                <span aria-hidden className="opacity-50">
                  ·
                </span>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="underline decoration-canvas/40 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-canvas"
                  >
                    {decodeTitle(category.name)}
                  </Link>
                ))}
              </>
            )}
          </div>
        </Container>
      </Band>

      <main id="main">
        <Band tone="cream">
          {image && (
            // On desktop a wide cover hangs over the seam into the hero — the
            // one grid break on the page. Small covers from the old posts stay
            // below it; a 300px thumbnail straddling the band looks like a slip.
            <Container
              className={`mb-12 lg:mb-16 ${hangs ? 'relative lg:-mt-[calc(var(--section-y)+6rem)]' : ''}`}
            >
              {/* Capped at its own width — plenty of these are 800px and
                  upscaling them to the container just looks soft. */}
              <Image
                src={image.url}
                alt={image.alt}
                width={image.width ?? 1600}
                height={image.height ?? 900}
                preload
                sizes="(min-width: 1200px) 1040px, 100vw"
                style={{ maxWidth: image.width ? `min(${image.width}px, 1040px)` : '1040px' }}
                className="mx-auto w-full rounded-photo object-cover"
              />
            </Container>
          )}

          <Container prose>
            {/* Title passed so recent posts, which carry an Avada title block
                in the body, don't repeat the heading above. */}
            <div className="post-body">
              {renderContent(post.content.rendered, { title })}
            </div>

            <aside aria-labelledby="post-cta" className="mt-16">
              <DotRule className="h-2.5 w-28 text-teal-500/60" />
              <h2 id="post-cta" className="mt-8 text-h3">
                Have a question about your health?
              </h2>
              <p className="mt-2 text-ink-700">
                Book an appointment and we&rsquo;ll work through it together.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={site.bookingUrl}>Book an appointment</Button>
                <Button href="/contact" variant="outline">
                  Contact us
                </Button>
              </div>
            </aside>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
