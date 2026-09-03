import Link from 'next/link'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="bg-canvas min-h-[60vh] flex items-center py-[clamp(4rem,9vw,8rem)]">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display text-[6rem] text-teal-100 leading-none font-light mb-2">404</p>
          <h1 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-4">Page not found.</h1>
          <p className="text-ink-500 text-[1.1875rem] mb-8 max-w-md mx-auto">
            This page may have moved. Try one of the links below or book your appointment directly.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Button href="/" variant="primary">Go Home</Button>
            <Button href="https://yourbriohealth.janeapp.com" external variant="accent">Book Now</Button>
            <Button href="/blog" variant="secondary">Read the Blog</Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-teal-500 text-[0.9375rem]">
            {['About', 'Services', 'Programs', 'Contact'].map((p) => (
              <Link key={p} href={`/${p.toLowerCase()}`} className="hover:text-teal-700 underline underline-offset-2">
                {p}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
