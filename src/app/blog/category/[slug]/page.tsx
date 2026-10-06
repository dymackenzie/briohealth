import { notFound } from 'next/navigation'

import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { Pagination } from '@/components/blog/Pagination'
import { PostList } from '@/components/blog/PostList'
import { Button } from '@/components/ui/Button'
import { buildMetadata, paged } from '@/lib/seo'
import { getCategories, getCategory, getPosts, parsePage } from '@/lib/wp/queries'
import { decodeTitle, plainExcerpt } from '@/lib/wp/renderContent'

export const revalidate = 3600

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const [{ slug }, { page }] = await Promise.all([props.params, props.searchParams])
  const category = await getCategory(slug)
  if (!category)
    return buildMetadata({
      title: 'Not found',
      path: `/blog/category/${slug}`,
      noindex: true,
    })

  return buildMetadata({
    ...paged(decodeTitle(category.name), `/blog/category/${category.slug}`, parsePage(page)),
    description: plainExcerpt(category.description ?? '', 160) || `Posts filed under ${decodeTitle(category.name)}.`,
  })
}

/**
 * The index's layout with the category's name as the heading and its
 * description under it; the "All" tab leads back. Like the index, it reads
 * `?page=` and so renders per request. No generateStaticParams: a page
 * that reads searchParams can't be prerendered.
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
  const lead = plainExcerpt(category.description ?? '', 200)

  return (
    <main id="main">
      <div className="container-x pb-[var(--section-y)]">
        <div className="mx-auto max-w-[38rem] pt-10 lg:pt-14">
          <h1 className="text-post-title">{decodeTitle(category.name)}</h1>
          {lead && <p className="mt-3 text-ink-soft">{lead}</p>}
          <div className="mt-6">
            <CategoryFilter categories={categories} current={category.slug} />
          </div>
          {posts.length === 0 ? (
            <div className="mt-10 border-t border-grey pt-10">
              <p className="max-w-[40ch] text-lede">Nothing filed here yet.</p>
              <Button href="/blog" variant="quiet" className="mt-6">
                All posts
              </Button>
            </div>
          ) : (
            <PostList posts={posts} />
          )}
          <Pagination page={page} totalPages={totalPages} basePath={`/blog/category/${category.slug}`} />
        </div>
      </div>
    </main>
  )
}
