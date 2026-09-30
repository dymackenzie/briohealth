import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/layout/PageHero'
import { pages } from '@/lib/content/pages'
import { site } from '@/lib/site'

export default function NotFound() {
  return (
    <main id="main">
      <PageHero title={pages.notFound.title} lead={pages.notFound.body} />
      <div className="container-x pb-24">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <Button href="/services" variant="quiet">Services</Button>
          <Button href="/blog" variant="quiet">Blog</Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Button href={site.bookingUrl}>{site.ctaLabel}</Button>
          <p className="text-ink-soft">
            Or call{' '}
            <a href={site.phoneHref} className="link-quiet">
              {site.phone}
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  )
}
