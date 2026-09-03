import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { postBySlugQuery, postsQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import Container from '@/components/ui/Container'
import SanityImage from '@/components/media/SanityImage'
import Placeholder from '@/components/media/Placeholder'
import PostBody from '@/components/blog/PostBody'
import Tag from '@/components/ui/Tag'
import NewsletterSignupSection from '@/components/sections/NewsletterSignupSection'
import CtaBandSection from '@/components/sections/CtaBandSection'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await client.fetch(postsQuery, { start: 0, end: 200 }).catch(() => [])
  return (posts || []).map((p: any) => ({ slug: p.slug?.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [post, site] = await Promise.all([
    client.fetch(postBySlugQuery, { slug }, { next: { tags: ['post'] } }),
    client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } }),
  ])
  return buildMetadata(post?.seo, site, post?.title)
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await client.fetch(postBySlugQuery, { slug }, { next: { tags: ['post'] } })
  if (!post) notFound()

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yourbriohealth.com'

  return (
    <>
      <ArticleJsonLd post={post} url={`${SITE_URL}/blog/${slug}`} />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: SITE_URL },
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: post.title, url: `${SITE_URL}/blog/${slug}` },
      ]} />
      {/* Article header */}
      <section className="bg-sand-200 py-[clamp(3rem,6vw,6rem)]">
        <Container size="prose">
          <Link href="/blog" className="inline-flex items-center gap-1 text-teal-500 text-[0.875rem] font-semibold hover:gap-2 transition-all mb-6">
            <ChevronLeft size={15} /> Back to blog
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories?.map((cat: any) => (
              <Tag key={cat._id} color="teal">{cat.title}</Tag>
            ))}
          </div>
          <h1 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 leading-[1.1] mb-5">{post.title}</h1>
          <div className="flex items-center gap-3 text-ink-500 text-[0.875rem]">
            {post.author?.name && (
              <span className="font-semibold text-ink-700">
                {post.author.name}
              </span>
            )}
            {date && <><span>·</span><time dateTime={post.publishedAt}>{date}</time></>}
          </div>
        </Container>
      </section>

      {/* Hero image */}
      {(post.heroImage || true) && (
        <section className="bg-canvas">
          <Container>
            <div className="overflow-hidden rounded-[var(--r-xl)] mt-[-2rem] mb-0 max-w-[720px] mx-auto">
              {post.heroImage ? (
                <SanityImage image={post.heroImage} alt={post.title} sizes="720px" priority />
              ) : null}
            </div>
          </Container>
        </section>
      )}

      {/* Article body */}
      <article className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
        <Container size="prose">
          <PostBody body={post.body} />
        </Container>
      </article>

      <NewsletterSignupSection section={{
        heading: 'Enjoyed this article?',
        subtext: 'Subscribe for more health insights, recipes, and clinic news.',
        background: 'teal-100',
      }} />

      <CtaBandSection section={{
        heading: 'Ready to take charge of your health?',
        primaryCta: { label: 'Book with Dr. Lee', style: 'accent', link: { kind: 'booking' } },
        background: 'teal',
      }} />
    </>
  )
}
