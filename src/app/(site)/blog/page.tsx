import { client } from '@/sanity/lib/client'
import { postsQuery, totalPostsQuery, categoriesQuery, featuredPostsQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import PostCard from '@/components/blog/PostCard'
import CategoryFilter from '@/components/blog/CategoryFilter'
import Pagination from '@/components/blog/Pagination'
import Container from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 12

export async function generateMetadata(): Promise<Metadata> {
  const site = await client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } })
  return buildMetadata(null, site, 'Blog — Health Tips, Recipes & Clinic News')
}

interface Props { searchParams: Promise<{ page?: string }> }

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const [posts, total, categories, featured] = await Promise.all([
    client.fetch(postsQuery, { start, end }, { next: { tags: ['post'] } }),
    client.fetch(totalPostsQuery, {}, { next: { tags: ['post'] } }),
    client.fetch(categoriesQuery, {}, { next: { tags: ['category'] } }),
    client.fetch(featuredPostsQuery, {}, { next: { tags: ['post'] } }),
  ])

  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  return (
    <>
      {/* Header */}
      <section className="bg-sand-200 py-[clamp(3rem,6vw,6rem)]">
        <Container>
          <p className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase text-teal-500 mb-3">The Blog</p>
          <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] text-ink-900 mb-6">Health insights & recipes.</h1>
          <CategoryFilter categories={categories || []} />
        </Container>
      </section>

      {/* Featured post (first page only) */}
      {page === 1 && featured?.length > 0 && (
        <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
          <Container>
            <PostCard post={featured[0]} featured />
          </Container>
        </section>
      )}

      {/* Post grid */}
      <section className="bg-canvas py-[clamp(2rem,5vw,5rem)]">
        <Container>
          {posts?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />
            </>
          ) : (
            <p className="text-ink-500 text-center py-16">No posts found.</p>
          )}
        </Container>
      </section>
    </>
  )
}
