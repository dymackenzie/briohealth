import { notFound } from 'next/navigation'

import { Bud } from '@/components/brand/Bud'
import { ContactForm } from '@/components/forms/ContactForm'
import { PageHero } from '@/components/layout/PageHero'
import { Field } from '@/components/ui/Field'
import { Figure } from '@/components/ui/Figure'
import { QuoteList } from '@/components/ui/QuoteList'
import { Reveal } from '@/components/ui/Reveal'
import { StepList } from '@/components/ui/StepList'
import { pages } from '@/lib/content/pages'
import { features } from '@/lib/features'
import { buildMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/wp/queries'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Pickleball',
  description: 'Brio Pickleball Coaching in Richmond, BC: private and small group lessons with Dr. Jeff Lee.',
  path: '/pickleball',
})

/**
 * The live Pickleball page's words in its order, set in the site's own
 * patterns and kept compact: the two questions in serif in columns 1-6,
 * the intro and the film (under its title card) in columns 7-12, where the
 * live page had it; the three coaching steps side by side on the page's
 * one teal field (the homepage plan's numbered steps, no booking button:
 * these are lessons, not appointments); the two captioned photos; the two
 * coaching services as rows between ink rules with the rooftop photo
 * beside them; the two quotes side by side; then "Schedule a lesson" with
 * the contact form in lesson mode (the email's subject says it is a
 * lesson enquiry), or with the form off (`features.contactForm`) the phone
 * and email on the heading's line. Dr. Lee may appear on this page.
 */
export default async function PickleballPage() {
  if (!features.pickleball) notFound()

  const settings = await getSiteSettings()
  const page = pages.pickleball

  return (
    <main id="main">
      <PageHero title={page.title} bud={<Bud size="medium" colour="teal" hideBelow={false} className="top-8 right-[6%] md:right-[22%]" />}>
        <div className="mt-6 grid-12 gap-y-6">
          <Reveal className="col-span-12 lg:col-span-6">
            <ul className="grid max-w-[36ch] gap-1 font-serif text-[clamp(1.375rem,2vw,1.75rem)] leading-tight font-medium tracking-[-0.02em] text-balance">
              {page.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80} className="col-span-12 lg:col-span-6 lg:col-start-7">
            <p className="max-w-[56ch]">{page.intro}</p>
            <video
              controls
              preload="none"
              poster={page.videoPoster}
              width={1280}
              height={720}
              className="mt-5 aspect-video h-auto w-full rounded-brand bg-grey"
              aria-label="Brio Pickleball"
            >
              <source src={page.videoUrl} type="video/mp4" />
            </video>
          </Reveal>
        </div>
      </PageHero>

      <Field as="section" aria-labelledby="pickleball-steps" className="py-10 lg:py-12">
        <div className="container-x">
          <Reveal>
            <h2 id="pickleball-steps" className="text-h2">
              {page.stepsHeading}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <StepList steps={page.steps} surface="teal" className="mt-8 gap-x-8 lg:grid-cols-3" />
          </Reveal>
        </div>
      </Field>

      <div className="container-x pb-[var(--section-y)]">
        <section aria-label="Dr. Jeff on the pro tour" className="pt-12">
          <ul className="grid-12 gap-y-8">
            {page.photos.map((item, i) => (
              <Reveal as="li" key={item.caption} delay={i * 80} className="col-span-12 sm:col-span-6 lg:col-span-4">
                <figure>
                  <Figure
                    subject={item.slot.subject}
                    photo={item.slot.photo}
                    aspect="1/1"
                    sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <figcaption className="mt-3 max-w-[48ch] text-small text-ink-soft">{item.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </section>

        <section aria-labelledby="pickleball-services" className="mt-12 grid-12 gap-y-8">
          <Reveal className="col-span-12 lg:col-span-6">
            <h2 id="pickleball-services" className="text-h2">
              {page.servicesHeading}
            </h2>
            <p className="mt-3 max-w-[56ch]">{page.servicesIntro}</p>
            <h3 className="mt-6 text-h3">{page.offeringsHeading}</h3>
            <ul className="mt-3 border-t border-ink">
              {page.offerings.map((o) => (
                <li key={o.name} className="border-b border-ink py-4">
                  <p className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <span className="font-serif text-[1.375rem] leading-tight font-medium tracking-[-0.01em]">{o.name}</span>
                    <span className="font-medium">{o.price}</span>
                  </p>
                  <p className="mt-1.5 max-w-[56ch]">{o.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80} className="col-span-12 lg:col-span-5 lg:col-start-8">
            <Figure
              subject={page.court.subject}
              photo={page.court.photo}
              aspect="4/3"
              sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 100vw"
            />
          </Reveal>
        </section>

        <section aria-labelledby="pickleball-quotes" className="mt-12 border-t border-grey pt-10">
          <h2 id="pickleball-quotes" className="text-h2">
            {page.quotesHeading}
          </h2>
          <QuoteList items={page.quotes} columns className="mt-6" />
        </section>

        <section aria-labelledby="pickleball-form" className="mt-12 border-t border-grey pt-10">
          {features.contactForm ? (
            <>
              <h2 id="pickleball-form" className="text-h2">
                {page.formHeading}
              </h2>
              <div className="mt-6 max-w-[64ch]">
                <ContactForm phone={settings.phone} phoneHref={settings.phoneHref} topic="lesson" />
              </div>
            </>
          ) : (
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
              <h2 id="pickleball-form" className="text-h2">
                {page.formHeading}
              </h2>
              <a href={settings.phoneHref} className="text-h3 link-quiet">
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="link-quiet break-all">
                {settings.email}
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
