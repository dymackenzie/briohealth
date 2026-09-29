import Link from 'next/link'

import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { Stats } from '@/components/ui/Stats'
import { DotBurst } from '@/components/brand/DotBurst'
import { Credentials } from '@/components/about/Credentials'
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

const title = 'Dr. Jeffrey Lee, N.D., R.Ac.'
const lead =
  'Naturopathic Physician and Registered Acupuncturist, serving Richmond since 2006.'

/**
 * The one page where Dr. Lee is the subject — the rest of the site is about
 * the patient, and he appears once on the homepage as their guide. So all
 * three guide photos live here and nowhere else.
 */
export default async function AboutPage() {
  const page = await getPage('about-2')
  // Passed the hero so the WordPress copy doesn't open by repeating it.
  const body = page ? renderContent(page.content.rendered, { title, lead }) : null

  return (
    <>
      <JsonLd data={clinicJsonLd()} />

      <PageHero
        title={title}
        lead={lead}
        image={{ subject: 'Dr. Jeffrey Lee — portrait', ...photos.guidePortrait }}
      />

      <main id="main">
        <Band tone="cream">
          <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
              {/* Lines up under the hero photo so the stats overlap its bottom
                  edge. The photo hangs 2rem (3rem on desktop) past the seam,
                  and the offsets are measured back from the band's padding. */}
              <div className="mt-[calc(3.25rem-var(--section-y))] w-full max-w-[20rem] sm:max-w-[24rem] lg:mt-[calc(4.25rem-var(--section-y))] lg:ml-auto lg:max-w-[26rem]">
                <Stats stats={home.empathy.stats} />
              </div>

              {/* A pull quote beside the bio it comes from, held in view so the
                  column doesn't run empty down a 600-word body. */}
              <Reveal className="mt-14 lg:sticky lg:top-10 lg:ml-auto lg:max-w-[26rem]">
                <blockquote className="relative font-display text-[clamp(1.5rem,1.25rem+0.9vw,1.9rem)] leading-[1.25] tracking-[-0.015em]">
                  <span
                    aria-hidden
                    className="absolute -top-[0.3em] -left-[0.05em] font-display text-[3em] leading-none text-clay-600 sm:-left-[0.55em]"
                  >
                    &ldquo;
                  </span>
                  <p className="relative pt-[0.9em] sm:pt-0">
                    I help patients like you make sense of all the confusing health
                    information out there, and create a personalized, actionable
                    plan to optimize your health.
                  </p>
                </blockquote>
              </Reveal>
            </div>

            {body && (
              <Reveal className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
                <div className="post-body max-w-[62ch]">{body}</div>
              </Reveal>
            )}
          </Container>
        </Band>

        <Band tone="paper">
          <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-6">
              <h2 className="text-h2">Credentials</h2>
              <p className="mt-4 max-w-[40ch] text-lede text-ink-700">
                One of the few practitioners in the area licensed as both a
                naturopathic doctor and an acupuncturist.
              </p>
              <Credentials className="mt-8" />
            </Reveal>

            <Reveal from="right" className="lg:col-span-5 lg:col-start-8">
              <Figure
                subject="Dr. Lee explaining a treatment with the anatomy model"
                {...photos.guideExplaining}
                aspect="4 / 5"
                offset="teal"
                sizes="(min-width: 1200px) 480px, (min-width: 1024px) 40vw, 100vw"
              />
            </Reveal>
          </Container>
        </Band>

        <Band tone="tint">
          <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal from="left" className="lg:col-span-5">
              <Figure
                subject="Dr. Lee at a farmers market stall in Richmond"
                {...photos.guideCommunity}
                aspect="1 / 1"
                sizes="(min-width: 1200px) 480px, (min-width: 1024px) 40vw, 100vw"
              />
            </Reveal>

            <Reveal className="lg:col-span-6 lg:col-start-7">
              <h2 className="text-h2">Outside the clinic</h2>
              <p className="mt-5 max-w-[48ch] text-lede">
                Pickleball, several days a week &mdash; by his own account,
                he&rsquo;s obsessed.
              </p>
              <p className="mt-4 max-w-[52ch] text-ink-700">
                Winters he skis at Whistler and in the interior with friends and
                family. Summers it&rsquo;s pickleball tournaments, camping and
                exploring around BC. He&rsquo;s also part of a local church
                community, and says prayer and meditation are how he stays
                grounded for his patients.
              </p>
              <p className="mt-6">
                <Link href="/pickleball" className="link-draw font-semibold text-teal-700">
                  Pickleball &amp; community at Brio &rarr;
                </Link>
              </p>
            </Reveal>
          </Container>
        </Band>

        <Band tone="teal" className="relative overflow-hidden">
          <DotBurst
            droplet={false}
            className="drift pointer-events-none absolute -top-40 -left-40 h-[36rem] w-[36rem] text-teal-500 opacity-40"
          />
          <Container prose className="relative text-center">
            <Reveal from="scale">
              <h2 className="text-h2">Voted Best Naturopath by Richmond News, 2025</h2>
              <p className="mx-auto mt-5 max-w-[44ch] text-lede opacity-90">
                New to naturopathic care? Your first visit is a 30-minute
                assessment, done virtually.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
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
      </main>

      <Footer />
    </>
  )
}
