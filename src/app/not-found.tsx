import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { BandDivider } from '@/components/ui/BandDivider'
import { DotBurst } from '@/components/brand/DotBurst'
import { site } from '@/lib/site'

export default function NotFound() {
  return (
    <>
      <Band tone="teal" as="div" flush className="relative overflow-hidden">
        <DotBurst
          droplet={false}
          className="drift pointer-events-none absolute -top-52 -right-36 h-[34rem] w-[34rem] text-teal-400/10"
        />
        <Header />

        <Container prose className="relative pt-11 pb-16 text-center">
          <DotBurst className="mx-auto h-12 w-12 text-teal-300" />
          <h1 className="mt-6 text-[clamp(1.9rem,4vw,2.6rem)]">
            We can&rsquo;t find that page
          </h1>
          <p className="mx-auto mt-4 max-w-[44ch] text-base opacity-85">
            It may have moved when we rebuilt the site. The blog archive is all
            still here.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Button href="/blog" variant="onTeal">
              Browse the blog
            </Button>
            <Button href="/contact" variant="outline">
              Contact us
            </Button>
          </div>
        </Container>

        <BandDivider curve="drift" fill="text-canvas" className="-mb-px" />
      </Band>

      <main id="main">
        <Band tone="cream" className="pt-4">
          <Container className="text-center">
            <p className="text-ink-500">
              Or call us on{' '}
              <a href={site.phoneHref} className="text-teal-700 underline">
                {site.phone}
              </a>
              .
            </p>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
