import { Bud } from '@/components/brand/Bud'
import { VideoHero } from '@/components/sections/VideoHero'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { faqsFor } from '@/lib/content/faqs'
import { getService, services } from '@/lib/content/services'
import { breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'
import { BOOKING_PATH } from '@/lib/site'
import { getSiteSettings } from '@/lib/wp/queries'
import { paragraphsOf, renderContent } from '@/lib/wp/renderContent'

export const revalidate = 3600
// Any other slug 404s before the page runs, so every lookup below finds one.
export const dynamicParams = false

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

/** The meta description is the clinic's own opening paragraph, clipped. */
function description(body: string): string {
  const first = paragraphsOf(body)[0] ?? ''
  if (first.length <= 160) return first
  const cut = first.lastIndexOf(' ', 157)
  return `${first.slice(0, cut > 0 ? cut : 157)}...`
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const service = getService((await props.params).slug)!

  return buildMetadata({
    title: service.title,
    description: description(service.body),
    path: `/services/${service.slug}`,
  })
}

/**
 * Video hero, then the live page verbatim in one left-aligned column: the
 * body, the booking button, the FAQs under the live page's heading
 * ("FAQ's", `faqHeading`) as an accordion, the closing block where the
 * live page has one, and the booking button again where the live page's
 * closing ends in BOOK NOW. The page's one bud (spec 3.7) sits in the open
 * space right of the body's opening, from lg: below that the 68ch column
 * fills the width and the bud would land on the text. The hero's still is
 * the video poster only: the 4/5 shoot crops in `image` show Dr. Lee at
 * full width (spec 7.5), so without a poster the hero is the teal field.
 */
export default async function ServicePage(props: { params: Promise<{ slug: string }> }) {
  const service = getService((await props.params).slug)!
  const settings = await getSiteSettings()
  const faqs = faqsFor(service.slug)

  return (
    <main id="main">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Services', path: '/services' },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />

      <VideoHero
        title={service.title}
        still={service.video.poster}
        loop={service.video.loop}
        youtube={service.video.youtube}
        ctaLabel={settings.ctaLabel}
      />

      <div className="container-x section-y relative overflow-x-clip">
        <Bud size="medium" colour="teal" hideBelow="lg" className="top-[calc(var(--section-y)+4rem)] right-[9%]" />
        <div className="max-w-[68ch]">
          {/* Not a Reveal: the body opens under the hero, and on a phone its top can sit below Reveal's line
              (threshold 0, 10% above the viewport's bottom), so the page's main text would wait for a scroll. */}
          <div className="prose-post prose-page">{renderContent(service.body)}</div>

          <Reveal delay={80} className="mt-8">
            <Button href={BOOKING_PATH}>{settings.ctaLabel}</Button>
          </Reveal>

          {faqs.length > 0 && (
            <Reveal delay={80} className="mt-14">
              <h2 className="text-h2">{service.faqHeading}</h2>
              <div className="mt-6">
                <Accordion items={faqs.map(({ question, answer }) => ({ question, answer }))} />
              </div>
            </Reveal>
          )}

          {service.closing && (
            <Reveal delay={80} className="mt-14 border-t border-grey pt-10">
              <div className="prose-post prose-page">{renderContent(service.closing)}</div>
              <div className="mt-8">
                <Button href={BOOKING_PATH}>{settings.ctaLabel}</Button>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </main>
  )
}
