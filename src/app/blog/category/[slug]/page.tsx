import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { PostCard } from '@/components/blog/PostCard'
import { Pagination } from '@/components/blog/Pagination'
import { getCategories, getCategory, getPosts } from '@/lib/wp/queries'
import { decodeTitle, plainExcerpt } from '@/lib/wp/renderContent'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const category = await getCategory(slug)
  if (!category) return buildMetadata({ title: 'Not found', path: `/blog/category/${slug}` })

  return buildMetadata({
    title: decodeTitle(category.name),
    description:
      plainExcerpt(category.description ?? '', 160) ||
      `Posts filed under ${decodeTitle(category.name)}.`,
    path: `/blog/category/${category.slug}`,
  })
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const [{ slug }, { page: pageParam }] = await Promise.all([
    props.params,
    props.searchParams,
  ])

  const category = await getCategory(slug)
  if (!category) notFound()

  const page = Math.max(1, Number(pageParam) || 1)
  const { posts, totalPages } = await getPosts({ page, categoryId: category.id })

  return (
    <>
      <PageHero
        title={decodeTitle(category.name)}
        lead={
          plainExcerpt(category.description ?? '', 200) ||
          `${category.count ?? posts.length} posts in this category.`
        }
      />

      <main id="main">
        <Band tone="cream" className="pt-4">
          <Container>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[0.9rem] text-ink-500 hover:text-ink-900"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              All posts
            </Link>

            {posts.length === 0 ? (
              <p className="mt-10 text-ink-500">Nothing filed here yet.</p>
            ) : (
              <ul className="mt-8 grid gap-x-7 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Reveal as="li" key={post.id} delay={(i % 3) * 80}>
                    <PostCard post={post} priority={i < 3} />
                  </Reveal>
                ))}
              </ul>
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              basePath={`/blog/category/${category.slug}`}
            />
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
