import Container from '@/components/ui/Container'
import VideoEmbed from '@/components/media/VideoEmbed'

const BG: Record<string, string> = { canvas: 'bg-canvas', sand: 'bg-sand-200' }

export default function VideoEmbedSection({ section }: { section: any }) {
  const { heading, url, poster, caption, background = 'canvas' } = section
  const bg = BG[background] || 'bg-canvas'

  if (!url) return null

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        {heading && (
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-8 max-w-2xl">{heading}</h2>
        )}
        <div className="max-w-4xl mx-auto">
          <VideoEmbed url={url} poster={poster} caption={caption} />
        </div>
      </Container>
    </section>
  )
}
