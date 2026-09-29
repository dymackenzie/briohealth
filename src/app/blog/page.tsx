import { notFound } from 'next/navigation'

import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { CategoryNav } from '@/components/blog/CategoryNav'
import { PostCard } from '@/components/blog/PostCard'
import { Pagination } from '@/components/blog/Pagination'
import { getCategories, getPosts } from '@/lib/wp/queries'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Blog',
  description:
    'Health tips, recipes and clinic news from Brio Health in Richmond, BC.',
  path: '/blog',
})

export default async function BlogIndex(props: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await props.searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const [{ posts, total, totalPages }, categories] = await Promise.all([
    getPosts({ page }),
    getCategories(),
  ])

  // Past the last page, not a quiet blog.
  if (page > 1 && posts.length === 0) notFound()

  // Only the front page leads with a featured post — further back, the newest
  // on the page isn't news.
  const featured = page === 1 ? posts[0] : undefined
  const rest = featured ? posts.slice(1) : posts

  return (
    <>
      <PageHero
        title="Notes on getting your health back"
        lead={`${total.toLocaleString('en-CA')} posts on nutrition, treatment and everything we’ve learned in the clinic.`}
      />

      <main id="main">
        <Band tone="cream">
          <Container>
            <Reveal>
              <CategoryNav categories={categories} />
            </Reveal>

            {posts.length === 0 ? (
              <p className="mt-12 text-ink-500">Nothing here yet. Check back soon.</p>
            ) : (
              <>
                {featured && (
                  <Reveal className="mt-12 lg:mt-16">
                    <PostCard post={featured} featured eager />
                  </Reveal>
                )}

                <ul
                  className={`grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 ${
                    featured ? 'mt-16 border-t border-ink-900/15 pt-14 lg:mt-20 lg:pt-16' : 'mt-12'
                  }`}
                >
                  {rest.map((post, i) => (
                    <Reveal as="li" key={post.id} delay={(i % 3) * 90}>
                      <PostCard post={post} eager={i < 3} />
                    </Reveal>
                  ))}
                </ul>
              </>
            )}

            <Pagination page={page} totalPages={totalPages} basePath="/blog" />
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}

export const revalidate = 3600
