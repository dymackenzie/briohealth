import { notFound } from 'next/navigation'

import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { Pagination } from '@/components/blog/Pagination'
import { PostLead, PostList } from '@/components/blog/PostList'
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
 * The archive as a front page: the serif heading with the categories
 * beside it, then on page 1 the newest post on the tide field and the next
 * two under it (PostLead), then the rest by month. Reads `?page=`, so it
 * renders per request; the WordPress reads behind it stay cached under
 * their tags.
 */
export default async function BlogIndex(props: { searchParams: SearchParams }) {
  const { page: raw } = await props.searchParams
  const page = parsePage(raw)

  const [{ posts, totalPages }, categories] = await Promise.all([getPosts({ page }), getCategories()])

  // Past the last page, not a quiet blog. Page 1 with nothing is WordPress
  // being down, and gets the empty state instead.
  if (page > 1 && posts.length === 0) notFound()

  const lead = page === 1 ? posts.slice(0, 3) : []

  return (
    <main id="main" className="pb-[var(--section-y)]">
      <div className="container-x grid-12 gap-y-6 pt-10 pb-8 lg:pt-14">
        <h1 className="col-span-12 text-display lg:col-span-5">{pages.blog.title}</h1>
        {posts.length > 0 && (
          <div className="col-span-12 self-end lg:col-span-7">
            <CategoryFilter categories={categories} />
          </div>
        )}
      </div>
      {posts.length === 0 ? (
        <div className="container-x">
          <div className="border-t border-grey pt-10">
            <p className="max-w-[40ch] text-lede">{pages.blog.empty}</p>
            <Button href="/services" variant="quiet" className="mt-6">
              See how we help
            </Button>
          </div>
        </div>
      ) : (
        <>
          <PostLead posts={lead} />
          <PostList posts={posts.slice(lead.length)} />
        </>
      )}
      <Pagination page={page} totalPages={totalPages} basePath="/blog" />
    </main>
  )
}
