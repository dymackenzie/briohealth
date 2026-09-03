import Container from '@/components/ui/Container'
import { PortableText } from '@portabletext/react'

const BG: Record<string, string> = { canvas: 'bg-canvas', sand: 'bg-sand-200', paper: 'bg-paper' }

export default function RichTextSection({ section }: { section: any }) {
  const { body, background = 'canvas' } = section
  const bg = BG[background] || 'bg-canvas'

  if (!body) return null

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container size="prose">
        <div className="prose">
          <PortableText value={body} />
        </div>
      </Container>
    </section>
  )
}
