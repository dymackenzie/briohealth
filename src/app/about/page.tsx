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
 * The live About page's first block, verbatim, beside his portrait in the
 * clinic: the page's one photo, 2:3, shown whole and never cropped, sticky
 * beside the story at lg and preloaded (it is the LCP image). The page ends
 * with the story. The code fallback is the page: the Avada original carries
 * a second, shorter copy of every row and a person block, so it is not read
 * at runtime (the SCF `body` field will be, once wiring lands). This is one
 * of the two pages he appears on. One bud: small teal in the hero's right
 * side.
 */
export default async function AboutPage() {
  const settings = await getSiteSettings()
  const about = pages.about

  return (
    <main id="main">
      <JsonLd data={clinicJsonLd(settings)} />
      <PageHero title={about.title} lead={about.lead} bud={<Bud size="small" colour="teal" hideBelow={false} className="top-[5.75rem] right-[6%] md:top-14 md:right-[14%]" />} />

      <section aria-label="Story" className="container-x pb-[var(--section-y)] grid-12 gap-y-10">
        <Reveal className="col-span-12 self-start sm:col-span-8 lg:sticky lg:top-10 lg:col-span-5">
          <Figure
            subject={about.photos.portrait.subject}
            photo={about.photos.portrait.photo}
            aspect="2/3"
            preload
            sizes="(min-width: 1280px) 486px, (min-width: 1024px) 38vw, (min-width: 640px) 61vw, 92vw"
          />
        </Reveal>
        <Reveal delay={80} className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div className="prose-post prose-page">{renderContent(about.body)}</div>
        </Reveal>
      </section>
    </main>
  )
}
