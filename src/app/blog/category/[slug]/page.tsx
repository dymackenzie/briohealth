import { notFound } from 'next/navigation'

import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { Pagination } from '@/components/blog/Pagination'
import { PostList } from '@/components/blog/PostList'
import { PageHero } from '@/components/layout/PageHero'
import { Button } from '@/components/ui/Button'
import { buildMetadata } from '@/lib/seo'
import { getCategories, getCategory, getPosts, parsePage } from '@/lib/wp/queries'
import { decodeTitle, plainExcerpt } from '@/lib/wp/renderContent'

export const revalidate = 3600

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const category = await getCategory(slug)
  if (!category)
    return buildMetadata({
      title: 'Not found',
      path: `/blog/category/${slug}`,
      noindex: true,
    })

  return buildMetadata({
    title: decodeTitle(category.name),
    description: plainExcerpt(category.description ?? '', 160) || `Posts filed under ${decodeTitle(category.name)}.`,
    path: `/blog/category/${category.slug}`,
  })
}

/**
 * Like the index, it reads `?page=` and so renders per request. No
 * generateStaticParams: a page that reads searchParams can't be prerendered.
 */
export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const [{ slug }, { page: raw }] = await Promise.all([props.params, props.searchParams])
  const [category, categories] = await Promise.all([getCategory(slug), getCategories()])
  if (!category) notFound()

  const page = parsePage(raw)
  const { posts, totalPages } = await getPosts({
    page,
    categoryId: category.id,
  })
  if (page > 1 && posts.length === 0) notFound()

  return (
    <main id="main">
      <PageHero
        parent={{ label: 'All posts', href: '/blog' }}
        title={decodeTitle(category.name)}
        lead={plainExcerpt(category.description ?? '', 200) || undefined}
      />
      <div className="container-x pb-24">
        <CategoryFilter categories={categories} current={category.slug} />
        {posts.length === 0 ? (
          <div className="mt-10 border-t border-grey pt-10">
            <p className="max-w-[40ch] text-lede">Nothing filed here yet.</p>
            <Button href="/blog" variant="quiet" className="mt-6">
              All posts
            </Button>
          </div>
        ) : (
          <div className="mt-10">
            <PostList posts={posts} />
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} basePath={`/blog/category/${category.slug}`} />
      </div>
    </main>
  )
}
