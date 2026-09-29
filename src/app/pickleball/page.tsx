import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { getPage } from '@/lib/wp/queries'
import { renderContent } from '@/lib/wp/renderContent'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Pickleball & Community',
  description:
    'Pickleball, community and staying active with Brio Health in Richmond, BC.',
  path: '/pickleball',
})

const title = 'Pickleball & community'

export default async function PickleballPage() {
  const page = await getPage('pickleball')
  // Title only — this page's lead is written copy rather than a restatement of
  // the heading, so there's nothing in it the body would be repeating.
  const body = page ? renderContent(page.content.rendered, { title }) : null

  return (
    <>
      <PageHero
        title={title}
        lead="Dr. Lee plays several days a week. Staying active with other people is half the point of getting your energy back."
      />

      <main id="main">
        <Band tone="cream">
          {/* Prose width, no photo column: the WordPress body already carries
              the court and group photos, so a second copy beside it just
              repeated them. */}
          <Container prose>
            <Reveal>
              {body ? (
                <div className="post-body">{body}</div>
              ) : (
                <p className="text-lede text-ink-700">
                  More on our pickleball community soon. In the meantime, come
                  say hello at the clinic.
                </p>
              )}

              <div className="mt-10 flex flex-wrap gap-4">
                <Button href={site.bookingUrl}>Book an appointment</Button>
                <Button href="/contact" variant="outline">
                  Get in touch
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
