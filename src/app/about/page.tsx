import { PageHero } from '@/components/layout/PageHero'
import { Close } from '@/components/sections/Close'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { pages } from '@/lib/content/pages'
import { clinicJsonLd, JsonLd } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'
import { getPage, getSiteSettings } from '@/lib/wp/queries'
import { paragraphsOf } from '@/lib/wp/renderContent'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'About Dr. Jeffrey Lee',
  description: pages.about.lead,
  path: '/about',
})

/**
 * Dr. Lee leads. The story is the words of the WordPress About page (slug
 * about-2), set in our layout: its Avada markup repeats the title, the
 * portrait and every row twice, so only the paragraphs are taken. The code
 * paragraphs are the fallback. This is the one page where the photos of him
 * are used freely. One teal field and one burst, both the close's.
 */
export default async function AboutPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getPage('about-2')])
  const about = pages.about
  const fromWordPress = page ? paragraphsOf(page.content.rendered) : []
  const story = fromWordPress.length ? fromWordPress : about.story

  return (
    <main id="main">
      <JsonLd data={clinicJsonLd(settings)} />
      <PageHero title={about.title} lead={about.lead} />

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
          <div className="prose-post">
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="credentials-heading" className="bg-grey">
        <div className="container-x section-y grid-12 gap-y-10">
          <Reveal className="col-span-12 lg:col-span-4">
            <h2 id="credentials-heading" className="text-h2">
              Credentials
            </h2>
            <p className="mt-5 max-w-[30ch] text-ink-soft">{about.award}</p>
          </Reveal>
          <ul className="col-span-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {about.credentials.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 60} className="border-t-2 border-teal pt-4">
                {item}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="In the clinic and the community" className="container-x section-y grid-12 gap-y-8">
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

      <Close settings={settings} />
    </main>
  )
}
