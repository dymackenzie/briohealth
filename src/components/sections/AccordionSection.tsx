import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Accordion from '@/components/ui/Accordion'

const BG: Record<string, string> = { canvas: 'bg-canvas', sand: 'bg-sand-200' }

export default function AccordionSection({ section }: { section: any }) {
  const { heading, items = [], background = 'canvas' } = section
  const bg = BG[background] || 'bg-canvas'

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        {heading && <SectionHeading heading={heading} align="center" className="mb-10" />}
        <div className="max-w-3xl mx-auto">
          <Accordion items={items} />
        </div>
      </Container>
    </section>
  )
}
