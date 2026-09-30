import { PageHero } from '@/components/layout/PageHero'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { pages } from '@/lib/content/pages'
import { buildMetadata } from '@/lib/seo'
import { getPage, getSiteSettings } from '@/lib/wp/queries'
import { decodeTitle, renderContent } from '@/lib/wp/renderContent'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Pickleball and community',
  description: 'Pickleball, community and staying active with Brio Health in Richmond, BC.',
  path: '/pickleball',
})

/**
 * Short community page. The words come from WordPress; the photos are its
 * two images, still on the WordPress host and cropped clear of Dr. Lee
 * (see photos.ts). The body's own images and video are left out: they put
 * him in frame, and this page places its photos itself.
 */
export default async function PickleballPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getPage('pickleball')])
  const body = page
    ? renderContent(page.content.rendered, { title: decodeTitle(page.title.rendered), media: false })
    : null
  const pickleball = pages.pickleball

  return (
    <main id="main">
      <PageHero parent={{ label: 'About Dr. Lee', href: '/about' }} title={pickleball.title} lead={pickleball.lead} />

      <div className="container-x pb-24 grid-12 gap-y-12">
        <Reveal className="col-span-12 lg:col-span-6">
          {body ? <div className="prose-post">{body}</div> : <p className="max-w-[46ch]">{pickleball.fallback}</p>}
          <div className="mt-10">
            <Button href={settings.bookingUrl}>{settings.ctaLabel}</Button>
          </div>
        </Reveal>

        <div className="col-span-12 grid content-start gap-8 sm:grid-cols-2 lg:col-span-5 lg:col-start-8 lg:grid-cols-1">
          <Reveal delay={80}>
            <Figure
              subject={pickleball.photos.group.subject}
              photo={pickleball.photos.group.photo}
              aspect="4/5"
              sizes="(min-width: 1280px) 510px, (min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
            />
          </Reveal>
          <Reveal delay={160} className="lg:ml-16">
            <Figure
              subject={pickleball.photos.court.subject}
              photo={pickleball.photos.court.photo}
              aspect="1/1"
              sizes="(min-width: 1280px) 440px, (min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw"
            />
          </Reveal>
        </div>
      </div>
    </main>
  )
}
