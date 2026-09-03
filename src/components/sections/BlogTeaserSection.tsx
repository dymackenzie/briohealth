import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import PostCard from '@/components/blog/PostCard'
import Button from '@/components/ui/Button'
import { client } from '@/sanity/lib/client'
import { latestPostsQuery } from '@/sanity/lib/queries'

const BG: Record<string, string> = { canvas: 'bg-canvas', sand: 'bg-sand-200' }

export default async function BlogTeaserSection({ section }: { section: any }) {
  const { eyebrow, heading, count = 3, background = 'sand' } = section
  const bg = BG[background] || 'bg-sand-200'

  const posts = await client.fetch(latestPostsQuery, { count }, { next: { tags: ['post'] } })

  if (!posts?.length) return null

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        <div className="flex items-end justify-between gap-6 mb-10">
          {(eyebrow || heading) && (
            <SectionHeading eyebrow={eyebrow} heading={heading || 'Latest from the blog'} />
          )}
          <Button href="/blog" variant="secondary" size="sm" className="shrink-0">
            View all posts
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  )
}
