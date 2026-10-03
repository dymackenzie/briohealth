import { Bud } from '@/components/brand/Bud'
import { PageHero } from '@/components/layout/PageHero'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { pages } from '@/lib/content/pages'
import { clinicJsonLd, JsonLd } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/wp/queries'
import { renderContent } from '@/lib/wp/renderContent'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'About Dr. Jeffrey Lee',
  description: `${pages.about.title}, ${pages.about.lead}, serving Richmond since 2006.`,
  path: '/about',
})

/**
 * The live About page's first block, verbatim, beside the clinic's own
 * portrait; the two other photos of him below. The code fallback is the
 * page: the Avada original carries a second, shorter copy of every row and
 * a person block, so it is not read at runtime (the SCF `body` field will
 * be, once wiring lands). This is one of the two pages he appears on. Two
 * buds (spec 3.7 allows up to three): small teal in the hero's right side,
 * medium teal in the empty columns between the two lower photos.
 */
export default async function AboutPage() {
  const settings = await getSiteSettings()
  const about = pages.about

  return (
    <main id="main">
      <JsonLd data={clinicJsonLd(settings)} />
      <PageHero title={about.title} lead={about.lead} bud={<Bud size="small" colour="teal" className="top-14 right-[14%]" />} />

      <section aria-label="Story" className="container-x pb-[var(--section-y)] grid-12 gap-y-10">
        <Reveal className="col-span-12 self-start sm:col-span-8 lg:sticky lg:top-10 lg:col-span-5">
          <Figure
            subject={about.photos.portrait.subject}
            photo={about.photos.portrait.photo}
            aspect="4/5"
            preload
            sizes="(min-width: 1280px) 510px, (min-width: 1024px) 40vw, (min-width: 640px) 66vw, 100vw"
          />
        </Reveal>
        <Reveal delay={80} className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div className="prose-post prose-page">{renderContent(about.body)}</div>
        </Reveal>
      </section>

      <section aria-label="In the clinic and the community" className="container-x relative pb-[var(--section-y)] grid-12 gap-y-8">
        <Bud size="medium" colour="teal" className="top-6 left-[47%]" />
        <Reveal className="col-span-12 sm:col-span-6 lg:col-span-5">
          <Figure
            subject={about.photos.explaining.subject}
            photo={about.photos.explaining.photo}
            aspect="4/5"
            sizes="(min-width: 1280px) 510px, (min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
          />
        </Reveal>
        <Reveal delay={80} className="col-span-12 sm:col-span-6 lg:col-span-4 lg:col-start-8 lg:pt-16">
          <Figure
            subject={about.photos.community.subject}
            photo={about.photos.community.photo}
            aspect="1/1"
            sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
          />
        </Reveal>
      </section>
    </main>
  )
}
