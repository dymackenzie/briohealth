import { notFound } from 'next/navigation'

import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { Pagination } from '@/components/blog/Pagination'
import { PostList } from '@/components/blog/PostList'
import { PageHero } from '@/components/layout/PageHero'
import { Button } from '@/components/ui/Button'
import { pages } from '@/lib/content/pages'
import { buildMetadata, paged } from '@/lib/seo'
import { getCategories, getPosts, parsePage } from '@/lib/wp/queries'

export const revalidate = 3600

type SearchParams = Promise<{ page?: string | string[] }>

export async function generateMetadata(props: { searchParams: SearchParams }) {
  const { page } = await props.searchParams
  return buildMetadata({
    ...paged('Blog', '/blog', parsePage(page)),
    description: 'Health tips, recipes and clinic news from Brio Health in Richmond, BC.',
  })
}

/**
 * Reads `?page=`, so it renders per request; the WordPress reads behind it
 * stay cached under their tags.
 */
export default async function BlogIndex(props: { searchParams: SearchParams }) {
  const { page: raw } = await props.searchParams
  const page = parsePage(raw)

  const [{ posts, totalPages }, categories] = await Promise.all([getPosts({ page }), getCategories()])

  // Past the last page, not a quiet blog. Page 1 with nothing is WordPress
  // being down, and gets the empty state instead.
  if (page > 1 && posts.length === 0) notFound()

  return (
    <main id="main">
      <PageHero title={pages.blog.title} />
      <div className="container-x pb-[var(--section-y)]">
        {posts.length === 0 ? (
          <div className="border-t border-grey pt-10">
            <p className="max-w-[40ch] text-lede">{pages.blog.empty}</p>
            <Button href="/services" variant="quiet" className="mt-6">
              See how we help
            </Button>
          </div>
        ) : (
          <>
            <CategoryFilter categories={categories} />
            <div className="mt-6">
              <PostList posts={posts} />
            </div>
          </>
        )}
        <Pagination page={page} totalPages={totalPages} basePath="/blog" />
      </div>
    </main>
  )
}
