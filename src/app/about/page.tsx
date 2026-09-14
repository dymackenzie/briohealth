import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import { BandDivider } from '@/components/ui/BandDivider'
import { Reveal } from '@/components/ui/Reveal'
import { Parallax } from '@/components/ui/Parallax'
import { Stats } from '@/components/ui/Stats'
import { DotBurst } from '@/components/brand/DotBurst'
import { getPage } from '@/lib/wp/queries'
import { renderContent } from '@/lib/wp/renderContent'
import { clinicJsonLd, JsonLd } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'
import { home } from '@/lib/content/home'
import { photos } from '@/lib/content/photos'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'About',
  description:
    'Dr. Jeffrey Lee, N.D., R.Ac. — Naturopathic Physician and Registered Acupuncturist, serving Richmond since 2006.',
  path: '/about',
})

export default async function AboutPage() {
  const page = await getPage('about-2')
  const body = page ? renderContent(page.content.rendered) : null

  return (
    <>
      <JsonLd data={clinicJsonLd()} />

      <PageHero
        title="Dr. Jeffrey Lee, N.D., R.Ac."
        lead="Naturopathic Physician and Registered Acupuncturist, serving Richmond since 2006."
      />

      <main id="main">
        <Band tone="cream" className="pt-4">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
              <Reveal from="left" className="relative">
                <Parallax speed={0.05}>
                  <Figure
                    subject="Dr. Jeffrey Lee — portrait, clinic setting"
                    {...photos.leePortraitAlt}
                    shape="archSoft"
                    tone="sand"
                    aspect="3 / 4"
                  />
                </Parallax>

                <Stats stats={home.empathy.stats} />
              </Reveal>

              <Reveal>
                <blockquote className="font-display text-[clamp(1.05rem,1.7vw,1.25rem)] leading-[1.4]">
                  <span className="text-teal-700">&ldquo;</span>I help patients like
                  you make sense of all the confusing health information out there,
                  and create a personalized, actionable plan to optimize your health.
                  <span className="text-teal-700">&rdquo;</span>
                </blockquote>

                {body && <div className="post-body mt-7">{body}</div>}
              </Reveal>
            </div>
          </Container>
        </Band>

        <div className="relative">
          <BandDivider curve="drift" fill="text-teal-700" className="bg-canvas -mb-px" />

          <Band tone="teal" className="relative overflow-hidden pt-4">
            <DotBurst
              droplet={false}
              className="drift pointer-events-none absolute -top-40 -left-40 h-[36rem] w-[36rem] text-teal-400/10"
            />
            <Container prose className="relative text-center">
              <Reveal from="scale">
                <h2 className="text-[clamp(1.5rem,2.9vw,2rem)]">
                  Voted Best Naturopath by Richmond News, 2025
                </h2>
                <div className="mt-7 flex flex-wrap justify-center gap-4">
                  <Button href={site.bookingUrl} variant="onTeal">
                    Book an appointment
                  </Button>
                  <Button href="/services" variant="outline">
                    See our services
                  </Button>
                </div>
              </Reveal>
            </Container>
          </Band>
        </div>
      </main>

      <Footer />
    </>
  )
}
