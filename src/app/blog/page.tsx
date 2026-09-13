import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { PostCard } from '@/components/blog/PostCard'
import { Pagination } from '@/components/blog/Pagination'
import { getCategories, getPosts } from '@/lib/wp/queries'
import { decodeTitle } from '@/lib/wp/renderContent'
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

  return (
    <>
      <PageHero
        title="Notes on getting your health back"
        lead={`${total.toLocaleString('en-CA')} posts on nutrition, treatment and everything we've learned in the clinic.`}
      />

      <main id="main">
        <Band tone="cream" className="pt-4">
          <Container>
            {categories.length > 0 && (
              <Reveal>
                <ul className="flex flex-wrap gap-2">
                  <li>
                    <span className="inline-flex rounded-pill bg-teal-700 px-4 py-2 text-[0.875rem] text-canvas">
                      All
                    </span>
                  </li>
                  {categories.slice(0, 10).map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/blog/category/${category.slug}`}
                        className="inline-flex rounded-pill border border-ink-900/15 px-4 py-2 text-[0.875rem] transition-colors hover:border-teal-500 hover:text-teal-700"
                      >
                        {decodeTitle(category.name)}
                        <span className="ml-2 text-ink-300 tabular-nums">
                          {category.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {posts.length === 0 ? (
              <p className="mt-11 text-ink-500">
                Nothing here yet. Check back soon.
              </p>
            ) : (
              <ul className="mt-10 grid gap-x-7 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Reveal as="li" key={post.id} delay={(i % 3) * 80}>
                    <PostCard post={post} priority={i < 3} />
                  </Reveal>
                ))}
              </ul>
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
