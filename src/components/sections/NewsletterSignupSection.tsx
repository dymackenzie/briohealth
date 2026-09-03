import Container from '@/components/ui/Container'
import NewsletterForm from '@/components/forms/NewsletterForm'

const BG: Record<string, string> = {
  canvas: 'bg-canvas',
  sand: 'bg-sand-200',
  'teal-100': 'bg-teal-100',
}

export default function NewsletterSignupSection({ section }: { section: any }) {
  const { heading, subtext, background = 'teal-100' } = section
  const bg = BG[background] || 'bg-teal-100'

  return (
    <section className={`${bg} py-[clamp(4rem,9vw,8rem)]`}>
      <Container>
        <div className="max-w-xl mx-auto text-center">
          {heading && (
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-ink-900 mb-3">{heading}</h2>
          )}
          {subtext && (
            <p className="text-ink-500 text-[1.0625rem] mb-6">{subtext}</p>
          )}
          <NewsletterForm />
        </div>
      </Container>
    </section>
  )
}
