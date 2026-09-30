import { PageHero } from '@/components/layout/PageHero'
import { Close } from '@/components/sections/Close'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { pages } from '@/lib/content/pages'
import { buildMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/wp/queries'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Pickleball and community',
  description: 'Pickleball, community and staying active with Brio Health in Richmond, BC.',
  path: '/pickleball',
})

/**
 * Short community page, per the spec. The live WordPress page is Dr. Lee's
 * coaching page (lessons, prices, photos of him), which is not what this
 * route is for until the client says otherwise, so the copy is the code's
 * and the photo is the WordPress host's, cropped clear of him (photos.ts).
 * One teal field and one burst, both the close's.
 */
export default async function PickleballPage() {
  const settings = await getSiteSettings()
  const pickleball = pages.pickleball

  return (
    <main id="main">
      <PageHero parent={{ label: 'About Dr. Lee', href: '/about' }} title={pickleball.title} lead={pickleball.lead} />

      <section aria-label="Community" className="container-x pb-[var(--section-y)] grid-12 gap-y-10">
        <Reveal className="col-span-12 lg:col-span-5">
          <p className="max-w-[40ch] text-lede">{pickleball.fallback}</p>
        </Reveal>
        <Reveal delay={80} className="col-span-12 sm:col-span-8 lg:col-span-5 lg:col-start-8">
          <Figure
            subject={pickleball.photos.court.subject}
            photo={pickleball.photos.court.photo}
            aspect="4/5"
            sizes="(min-width: 1280px) 510px, (min-width: 1024px) 40vw, (min-width: 640px) 66vw, 100vw"
          />
        </Reveal>
      </section>

      <Close settings={settings} />
    </main>
  )
}
