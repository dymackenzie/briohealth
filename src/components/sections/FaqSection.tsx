import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Accordion from '@/components/ui/Accordion'

const BG: Record<string, string> = { canvas: 'bg-canvas', sand: 'bg-sand-200' }

export default function FaqSection({ section }: { section: any }) {
  const { eyebrow, heading, faqs = [], inlineFaqs = [], background = 'canvas' } = section
  const bg = BG[background] || 'bg-canvas'
  const allFaqs = [...faqs, ...inlineFaqs]

  if (!allFaqs.length) return null

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        <div className="max-w-3xl mx-auto">
          {(eyebrow || heading) && (
            <SectionHeading eyebrow={eyebrow} heading={heading || ''} align="center" className="mb-10" />
          )}
          <Accordion items={allFaqs} />
        </div>
      </Container>
    </section>
  )
}
