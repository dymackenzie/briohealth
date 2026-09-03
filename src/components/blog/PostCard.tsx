import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import SanityImage from '@/components/media/SanityImage'
import Placeholder from '@/components/media/Placeholder'
import Tag from '@/components/ui/Tag'

interface PostCardProps {
  post: any
  featured?: boolean
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const slug = post.slug?.current
  const category = post.categories?.[0]
  const date = post.publishedAt ? formatDate(post.publishedAt) : ''

  if (featured) {
    return (
      <Link href={`/blog/${slug}`} className="group grid md:grid-cols-2 gap-8 items-center">
        <div className="overflow-hidden rounded-[var(--r-xl)] aspect-video md:aspect-auto">
          {post.heroImage ? (
            <SanityImage image={post.heroImage} alt={post.title} sizes="(max-width: 768px) 100vw, 50vw" className="group-hover:scale-105 transition-transform duration-500 h-full" />
          ) : (
            <Placeholder label={post.title} ratio="16/9" />
          )}
        </div>
        <div>
          {category && <Tag color="teal" className="mb-4">{category.title}</Tag>}
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-ink-900 mb-3 group-hover:text-teal-500 transition-colors leading-snug">
            {post.title}
          </h2>
          {post.excerpt && <p className="text-ink-500 text-[1.0625rem] leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>}
          <div className="flex items-center gap-3 text-ink-500 text-[0.875rem]">
            {post.author?.name && <span>{post.author.name}</span>}
            {date && <><span>·</span><time dateTime={post.publishedAt}>{date}</time></>}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${slug}`} className="group block bg-paper rounded-[var(--r-lg)] shadow-sm border border-sand-300 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="aspect-video overflow-hidden relative">
        {post.heroImage ? (
          <SanityImage image={post.heroImage} fill alt={post.title} className="group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <Placeholder label={post.title} />
        )}
      </div>
      <div className="p-5">
        {category && <Tag color="teal" className="mb-3">{category.title}</Tag>}
        <h3 className="font-display text-[1.125rem] text-ink-900 mb-2 group-hover:text-teal-500 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-ink-500 text-[0.9375rem] line-clamp-2 mb-3 leading-relaxed">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-ink-300 text-[0.8125rem]">
          {post.author?.name && <span>{post.author.name}</span>}
          {date && <><span>·</span><time dateTime={post.publishedAt}>{date}</time></>}
        </div>
      </div>
    </Link>
  )
}
