import { PageHero } from '@/components/layout/PageHero'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { Parallax } from '@/components/ui/Parallax'
import { getPage } from '@/lib/wp/queries'
import { renderContent } from '@/lib/wp/renderContent'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'
import { photos } from '@/lib/content/photos'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Pickleball & Community',
  description:
    'Pickleball, community and staying active with Brio Health in Richmond, BC.',
  path: '/pickleball',
})

export default async function PickleballPage() {
  const page = await getPage('pickleball')
  const body = page ? renderContent(page.content.rendered) : null

  return (
    <>
      <PageHero
        title="Pickleball & community"
        lead="Dr. Lee plays several days a week. Staying active with other people is half the point of getting your energy back."
      />

      <main id="main">
        <Band tone="cream" className="pt-4">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <Reveal>
                {body ? (
                  <div className="post-body">{body}</div>
                ) : (
                  <p className="text-base text-ink-500">
                    More on our pickleball community soon. In the meantime, come
                    say hello at the clinic.
                  </p>
                )}

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href={site.bookingUrl}>Book an appointment</Button>
                  <Button href="/contact" variant="outline">
                    Get in touch
                  </Button>
                </div>
              </Reveal>

              <Reveal from="right" className="flex flex-col gap-4 lg:pt-6">
                <Parallax speed={0.07}>
                  <Figure
                    subject="Pickleball — Dr. Lee playing, or a community game"
                    {...photos.pickleballCourt}
                    shape="leaf"
                    tone="sand"
                    aspect="4 / 3"
                  />
                </Parallax>
                <Parallax speed={-0.09} className="ml-7">
                  <Figure
                    subject="Community group shot — post-game, outdoors"
                    {...photos.pickleballGroup}
                    shape="soft"
                    tone="sandLight"
                    aspect="1 / 1"
                  />
                </Parallax>
              </Reveal>
            </div>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
