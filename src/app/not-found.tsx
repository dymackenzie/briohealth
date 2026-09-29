import Link from 'next/link'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { DotBurst } from '@/components/brand/DotBurst'
import { site } from '@/lib/site'

const ELSEWHERE = [
  { label: 'Our services', href: '/services' },
  { label: 'About Dr. Lee', href: '/about' },
  { label: 'Book an appointment', href: '/book' },
] as const

export default function NotFound() {
  return (
    <>
      <Band tone="teal" as="div" flush className="relative overflow-hidden">
        <DotBurst
          droplet={false}
          className="drift pointer-events-none absolute -top-52 -right-36 h-[34rem] w-[34rem] text-teal-500 opacity-40"
        />
        <Header />

        <Container prose className="relative pt-10 pb-20 text-center lg:pt-14 lg:pb-24">
          <h1 className="text-[clamp(2.25rem,1.5rem+3vw,3.75rem)]">
            We can&rsquo;t find that page
          </h1>
          <p className="mx-auto mt-5 max-w-[40ch] text-lede opacity-90">
            It may have moved when we rebuilt the site. The blog archive is all
            still here.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button href="/blog" variant="onTeal">
              Browse the blog
            </Button>
            <Button href="/contact" variant="outline">
              Contact us
            </Button>
          </div>
        </Container>
      </Band>

      <main id="main">
        <Band tone="cream">
          <Container className="text-center">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {ELSEWHERE.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-draw font-semibold text-teal-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-ink-500">
              Or call us on{' '}
              <a href={site.phoneHref} className="link-draw text-ink-900">
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
