import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { HideBrokenImages } from '@/components/blog/HideBrokenImages'
import { formatDate } from '@/components/blog/PostList'
import { Button } from '@/components/ui/Button'
import { articleJsonLd, breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'
import { absoluteUrl, BOOKING_PATH } from '@/lib/site'
import { authorName, featuredImage, getPost, getSiteSettings, postCategories } from '@/lib/wp/queries'
import { decodeTitle, postSummary, renderContent, showsImage } from '@/lib/wp/renderContent'

export const revalidate = 3600
export const dynamicParams = true

/**
 * Not pre-rendering all 418 at build time: that is 418 requests to the
 * clinic's shared host on every deploy. They render on first visit and stay
 * cached until the webhook says otherwise.
 */
export function generateStaticParams() {
  return []
}

/**
 * The featured image keeps its own ratio: these are the clinic's blog
 * images, not shoot photos. It sits on the reading column, never wider than
 * the text or taller than a screen, and never upscaled. Plenty are portrait
 * phone shots at 2560px tall.
 */
const IMAGE_MAX_W = 720
const IMAGE_MAX_H = 640

function imageBox(width?: number, height?: number) {
  if (!width || !height) return null
  return Math.round(Math.min(width, IMAGE_MAX_W, (IMAGE_MAX_H * width) / height))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const post = await getPost(slug)
  if (!post)
    return buildMetadata({
      title: 'Not found',
      path: `/blog/${slug}`,
      noindex: true,
    })

  const image = featuredImage(post)
  return buildMetadata({
    title: decodeTitle(post.title.rendered),
    description: postSummary(post, 160),
    path: `/blog/${post.slug}`,
    image: image?.url,
    type: 'article',
    publishedTime: post.date,
  })
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const [post, settings] = await Promise.all([getPost(slug), getSiteSettings()])
  if (!post) notFound()

  const image = featuredImage(post)
  // Still the share image and the JSON-LD image either way.
  const lead = image && !showsImage(post.content.rendered, image.url) ? image : null
  const imageWidth = imageBox(lead?.width, lead?.height)
  const category = postCategories(post)[0]
  const title = decodeTitle(post.title.rendered)
  const url = absoluteUrl(`/blog/${post.slug}`)

  return (
    <main id="main">
      <JsonLd
        data={articleJsonLd({
          title,
          description: postSummary(post, 160),
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

      <article>
        <div className="container-x">
          <div className="mx-auto max-w-[68ch]">
            <header className="pt-10 lg:pt-12">
              <p className="text-small text-ink-soft">
                <Link href="/blog" className="link-quiet">
                  Blog
                </Link>
                {category && (
                  <>
                    <span className="mx-2" aria-hidden>
                      /
                    </span>
                    <Link href={`/blog/category/${category.slug}`} className="link-quiet">
                      {decodeTitle(category.name)}
                    </Link>
                  </>
                )}
              </p>
              <h1 className="text-post-title mt-5">{title}</h1>
              <p className="mt-5 text-small text-ink-soft">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </p>
            </header>

            {lead && (
              <div className="mt-8 text-[length:var(--fs-post)]">
                {imageWidth ? (
                  <Image
                    src={lead.url}
                    alt={lead.alt}
                    width={lead.width}
                    height={lead.height}
                    preload
                    sizes={`(max-width: ${imageWidth}px) 100vw, ${imageWidth}px`}
                    style={{ width: imageWidth }}
                    className="h-auto max-w-full rounded-brand bg-grey"
                  />
                ) : (
                  <div className="relative aspect-[3/2] overflow-hidden rounded-brand bg-grey">
                    <Image
                      src={lead.url}
                      alt={lead.alt}
                      fill
                      preload
                      sizes="(max-width: 720px) 100vw, 720px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 pb-[var(--section-y)]">
              <HideBrokenImages className="prose-post">
                {renderContent(post.content.rendered, { title })}
              </HideBrokenImages>

              <aside className="mt-14 border-t-2 border-teal pt-6">
                <Button href={BOOKING_PATH}>{settings.ctaLabel}</Button>
              </aside>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
