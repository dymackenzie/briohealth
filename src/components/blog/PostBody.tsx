import { PortableText, PortableTextComponents } from '@portabletext/react'
import SanityImage from '@/components/media/SanityImage'
import VideoEmbed from '@/components/media/VideoEmbed'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        <div className="overflow-hidden rounded-[var(--r-xl)]">
          <SanityImage image={value} alt={value.alt} sizes="(max-width: 720px) 100vw, 720px" />
        </div>
        {value.caption && (
          <figcaption className="text-center text-ink-500 text-[0.8125rem] mt-2">{value.caption}</figcaption>
        )}
      </figure>
    ),
    callout: ({ value }) => {
      const toneStyles: Record<string, string> = {
        info: 'bg-teal-050 border-teal-300',
        tip: 'bg-gold-100 border-gold-300',
        warning: 'bg-coral-100 border-coral-300',
      }
      return (
        <div className={`my-6 p-5 rounded-[var(--r-lg)] border-l-4 ${toneStyles[value.tone] || toneStyles.info}`}>
          <p className="text-ink-700 text-[0.9375rem]">{value.body}</p>
        </div>
      )
    },
    ctaBlock: ({ value }) => (
      <div className="my-6">
        <a
          href={value.href}
          className="inline-flex items-center px-6 py-3 bg-teal-500 text-white font-semibold rounded-[var(--r-pill)] hover:bg-teal-600 transition-colors"
        >
          {value.label}
        </a>
      </div>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value.href}
        target={value.openInNewTab ? '_blank' : undefined}
        rel={value.openInNewTab ? 'noopener noreferrer' : undefined}
        className="text-teal-600 underline underline-offset-2 hover:text-teal-700"
      >
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-ink-900 mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="font-display text-[1.375rem] text-ink-900 mt-8 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="font-display text-[1.125rem] text-ink-900 mt-6 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-teal-500 pl-5 my-6 font-display italic text-ink-700 text-[1.125rem]">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-5 text-ink-700 leading-[1.75] text-[1.0625rem]">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-ink-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-ink-700">{children}</ol>,
  },
}

export default function PostBody({ body }: { body: any }) {
  if (!body) return null
  return <PortableText value={body} components={components} />
}
