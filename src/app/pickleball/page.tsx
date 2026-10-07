import { Bud } from '@/components/brand/Bud'
import { ContactForm } from '@/components/forms/ContactForm'
import { PageHero } from '@/components/layout/PageHero'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { pages } from '@/lib/content/pages'
import { buildMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/wp/queries'
import { renderContent } from '@/lib/wp/renderContent'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Pickleball',
  description: 'Brio Pickleball Coaching in Richmond, BC: private and small group lessons with Dr. Jeff Lee.',
  path: '/pickleball',
})

/**
 * The live Pickleball page, in its order: the questions and the coaching
 * methodology, the video (controls, no autoplay), the two coaching photos
 * with their captions, the coaching services, the court photo, the two
 * quotes, then "Schedule a lesson" with the contact form in lesson mode
 * (the email's subject says it is a lesson enquiry). Dr. Lee may appear
 * on this page.
 */
export default async function PickleballPage() {
  const settings = await getSiteSettings()
  const page = pages.pickleball

  return (
    <main id="main">
      <PageHero title={page.title} bud={<Bud size="medium" colour="teal" hideBelow={false} className="top-8 right-[6%] md:right-[22%]" />} />

      <div className="container-x pb-[var(--section-y)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="prose-post prose-page lg:col-span-6">{renderContent(page.intro)}</Reveal>
          <Reveal delay={80} className="lg:col-span-6">
            <video controls preload="metadata" className="w-full rounded-brand bg-grey" aria-label="Brio Pickleball">
              {/* The film fades in from white; at 0.5s the first frame shows its logo. */}
              <source src={`${page.videoUrl}#t=0.5`} type="video/mp4" />
            </video>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2">
          {page.photos.map((item, i) => (
            <Reveal as="li" key={item.caption} delay={i * 80}>
              <figure>
                <Figure
                  subject={item.slot.subject}
                  photo={item.slot.photo}
                  aspect="4/5"
                  sizes="(min-width: 1280px) 600px, (min-width: 640px) 50vw, 100vw"
                />
                <figcaption className="mt-3 max-w-[48ch] text-small text-ink-soft">{item.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="prose-post prose-page lg:col-span-6">{renderContent(page.services)}</Reveal>
          <Reveal delay={80} className="lg:col-span-6">
            <Figure
              subject={page.court.subject}
              photo={page.court.photo}
              aspect="4/3"
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
            />
          </Reveal>
        </div>

        <section aria-labelledby="pickleball-quotes" className="mt-14 border-t border-grey pt-10">
          <h2 id="pickleball-quotes" className="text-h2">
            {page.quotesHeading}
          </h2>
          <ul className="mt-6 grid gap-8 md:grid-cols-2">
            {page.quotes.map((item, i) => (
              <Reveal as="li" key={item.name} delay={i * 80}>
                <figure>
                  <blockquote className="max-w-[48ch] text-body">
                    {'“'}
                    {item.quote}
                    {'”'}
                  </blockquote>
                  <figcaption className="mt-3 text-small text-ink-soft">{item.name}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </section>

        <section aria-labelledby="pickleball-form" className="mt-14 border-t border-grey pt-10">
          <h2 id="pickleball-form" className="text-h2">
            {page.formHeading}
          </h2>
          <div className="mt-6 max-w-[64ch]">
            <ContactForm phone={settings.phone} phoneHref={settings.phoneHref} topic="lesson" />
          </div>
        </section>
      </div>
    </main>
  )
}
