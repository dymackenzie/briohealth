import Container from '@/components/ui/Container'
import SanityImage from '@/components/media/SanityImage'

const BG: Record<string, string> = { canvas: 'bg-canvas', sand: 'bg-sand-200' }

export default function LogoCloudSection({ section }: { section: any }) {
  const { eyebrow, logos = [], background = 'canvas' } = section
  const bg = BG[background] || 'bg-canvas'

  if (!logos.length) return null

  return (
    <section className={`${bg} py-12`}>
      <Container>
        {eyebrow && (
          <p className="text-center text-[0.8125rem] font-semibold tracking-[0.14em] uppercase text-ink-300 mb-6">{eyebrow}</p>
        )}
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {logos.map((logo: any, i: number) => (
            logo.link ? (
              <a key={i} href={logo.link} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                <SanityImage image={logo.image} alt={logo.image?.alt || ''} width={120} height={40} className="h-8 w-auto object-contain grayscale" />
              </a>
            ) : (
              <div key={i} className="opacity-60">
                <SanityImage image={logo.image} alt={logo.image?.alt || ''} width={120} height={40} className="h-8 w-auto object-contain grayscale" />
              </div>
            )
          ))}
        </div>
      </Container>
    </section>
  )
}
