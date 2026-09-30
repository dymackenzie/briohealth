import Link from 'next/link'

import { PageHero } from '@/components/layout/PageHero'
import { Close } from '@/components/sections/Close'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { StepList } from '@/components/ui/StepList'
import { faqsFor } from '@/lib/content/faqs'
import { getService, services } from '@/lib/content/services'
import { breadcrumbJsonLd, JsonLd } from '@/lib/jsonld'
import { buildMetadata } from '@/lib/seo'
import { getPosts, getSiteSettings } from '@/lib/wp/queries'
import { decodeTitle } from '@/lib/wp/renderContent'

export const revalidate = 3600
// Any other slug 404s before the page runs, so every lookup below finds one.
export const dynamicParams = false

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const service = getService((await props.params).slug)!

  return buildMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
  })
}

/**
 * Teal hero with the service name; what it helps with; what a session
 * involves (a real sequence, numbered); fees; service FAQs; related posts;
 * close. Two teal fields: the hero and the close. One dot burst, the close's.
 */
export default async function ServicePage(props: { params: Promise<{ slug: string }> }) {
  const service = getService((await props.params).slug)!

  const [settings, related] = await Promise.all([
    getSiteSettings(),
    getPosts({ perPage: 3, search: service.short, fields: 'id,slug,title' }),
  ])
  const faqs = [...faqsFor(service.slug), ...(service.slug === 'naturopathic' ? faqsFor('general') : [])].slice(0, 6)

  return (
    <main id="main">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Services', path: '/services' },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />

      <PageHero surface="teal" parent={{ label: 'All services', href: '/services' }} title={service.title} lead={service.lead}>
        <div className="mt-9">
          <Button href={settings.bookingUrl} on="teal">
            {settings.ctaLabel}
          </Button>
        </div>
      </PageHero>

      <section aria-labelledby="helps-heading" className="container-x section-y grid-12 gap-y-12">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <h2 id="helps-heading" className="max-w-[14ch] text-h2">
              This is for you if
            </h2>
            <p className="mt-5 max-w-[52ch] text-lede text-ink-soft">{service.summary}</p>
          </Reveal>
          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {service.helpsWith.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 60} className="border-t-2 border-teal pt-4">
                {item}
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={120} className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-9">
          <Figure
            subject={service.image.subject}
            photo={service.image.photo}
            aspect="4/5"
            sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 66vw, 100vw"
          />
        </Reveal>
      </section>

      <section aria-labelledby="steps-heading" className="bg-grey">
        <div className="container-x section-y grid-12 gap-y-10">
          <Reveal className="col-span-12 lg:col-span-4">
            <h2 id="steps-heading" className="max-w-[10ch] text-h2">
              What a visit involves
            </h2>
          </Reveal>
          <Reveal delay={80} className="col-span-12 lg:col-span-7 lg:col-start-6">
            <StepList steps={service.steps} />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="fees-heading" className="container-x section-y grid-12 gap-y-10">
        <Reveal className="col-span-12 lg:col-span-4">
          <h2 id="fees-heading" className="text-h2">
            Fees
          </h2>
          <p className="mt-4 text-small text-ink-soft">
            {service.feesNote}{' '}
            <Link href="/book#fees" className="link-quiet">
              All fees
            </Link>
          </p>
        </Reveal>
        <dl className="col-span-12 lg:col-span-7 lg:col-start-6">
          {service.fees.map((fee, i) => (
            <Reveal
              key={`${fee.kind}-${fee.label}`}
              delay={i * 80}
              className="flex items-baseline justify-between gap-6 border-t border-grey py-5 last:border-b"
            >
              <dt>
                {fee.label}
                {fee.note && <span className="block text-small text-ink-soft">{fee.note}</span>}
              </dt>
              <dd className="font-display text-3xl font-semibold whitespace-nowrap">{fee.amount}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {faqs.length > 0 && (
        <section aria-labelledby="faq-heading" className="container-x pb-[var(--section-y)] grid-12 gap-y-10">
          <Reveal className="col-span-12 lg:col-span-4">
            <h2 id="faq-heading" className="max-w-[10ch] text-h2">
              Questions
            </h2>
          </Reveal>
          <Reveal delay={80} className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Accordion items={faqs.map(({ question, answer }) => ({ question, answer }))} />
          </Reveal>
        </section>
      )}

      {related.posts.length > 0 && (
        <section aria-labelledby="related-heading" className="container-x pb-24">
          <h2 id="related-heading" className="font-sans text-h3">
            From the blog
          </h2>
          <ul className="mt-4 grid gap-x-8 gap-y-3 border-t border-grey pt-4 sm:grid-cols-3">
            {related.posts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="link-quiet">
                  {decodeTitle(post.title.rendered)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Close settings={settings} />
    </main>
  )
}
