import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { postsByCategoryQuery, categoryBySlugQuery, categoriesQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import PostCard from '@/components/blog/PostCard'
import CategoryFilter from '@/components/blog/CategoryFilter'
import Pagination from '@/components/blog/Pagination'
import Container from '@/components/ui/Container'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 12

export async function generateStaticParams() {
  const categories = await client.fetch(categoriesQuery).catch(() => [])
  return (categories || []).map((c: any) => ({ slug: c.slug?.current }))
}

interface Props { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [category, site] = await Promise.all([
    client.fetch(categoryBySlugQuery, { slug }),
    client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } }),
  ])
  return buildMetadata(null, site, category?.title ? `${category.title} — Blog` : 'Blog')
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const [category, posts, allCategories] = await Promise.all([
    client.fetch(categoryBySlugQuery, { slug }, { next: { tags: ['category'] } }),
    client.fetch(postsByCategoryQuery, { categorySlug: slug, start, end }, { next: { tags: ['post'] } }),
    client.fetch(categoriesQuery, {}, { next: { tags: ['category'] } }),
  ])

  if (!category) notFound()

  // Count total for pagination
  const total = posts?.length < POSTS_PER_PAGE ? start + (posts?.length || 0) : start + POSTS_PER_PAGE + 1
  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  return (
    <>
      <section className="bg-sand-200 py-[clamp(3rem,6vw,6rem)]">
        <Container>
          <p className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase text-teal-500 mb-3">Category</p>
          <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] text-ink-900 mb-6">{category.title}</h1>
          {category.description && <p className="text-ink-500 text-[1.1875rem] mb-6 max-w-xl">{category.description}</p>}
          <CategoryFilter categories={allCategories || []} />
        </Container>
      </section>

      <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
        <Container>
          {posts?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} basePath={`/blog/category/${slug}`} />
            </>
          ) : (
            <p className="text-ink-500 text-center py-16">No posts in this category yet.</p>
          )}
        </Container>
      </section>
    </>
  )
}
