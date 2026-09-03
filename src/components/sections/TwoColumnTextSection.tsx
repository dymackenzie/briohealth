import { PortableText } from '@portabletext/react'
import Container from '@/components/ui/Container'

const BG: Record<string, string> = {
  canvas: 'bg-canvas',
  sand: 'bg-sand-200',
}

interface TwoColumnTextSectionProps {
  section: {
    leftBody?: any[]
    rightBody?: any[]
    background?: string
  }
}

export default function TwoColumnTextSection({ section }: TwoColumnTextSectionProps) {
  const { leftBody, rightBody, background = 'canvas' } = section
  const bg = BG[background] || 'bg-canvas'

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {leftBody && (
            <div className="prose max-w-none">
              <PortableText value={leftBody} />
            </div>
          )}
          {rightBody && (
            <div className="prose max-w-none">
              <PortableText value={rightBody} />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
