import { notFound } from 'next/navigation'

import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { CategoryNav } from '@/components/blog/CategoryNav'
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

  // getCategory reads the same cached list, so this is one request, not two.
  const [category, categories] = await Promise.all([getCategory(slug), getCategories()])
  if (!category) notFound()

  const page = Math.max(1, Number(pageParam) || 1)
  const { posts, totalPages } = await getPosts({ page, categoryId: category.id })
  if (page > 1 && posts.length === 0) notFound()

  return (
    <>
      <PageHero
        parent={{ label: 'All posts', href: '/blog' }}
        title={decodeTitle(category.name)}
        lead={
          plainExcerpt(category.description ?? '', 200) ||
          `${category.count ?? posts.length} posts in this category.`
        }
      />

      <main id="main">
        <Band tone="cream">
          <Container>
            <Reveal>
              <CategoryNav categories={categories} active={category.slug} />
            </Reveal>

            {posts.length === 0 ? (
              <p className="mt-12 text-ink-500">Nothing filed here yet.</p>
            ) : (
              <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Reveal as="li" key={post.id} delay={(i % 3) * 90}>
                    <PostCard post={post} eager={i < 3} />
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
