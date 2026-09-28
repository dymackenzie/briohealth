import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import { Reveal } from '@/components/ui/Reveal'
import { HeroHeading } from '@/components/ui/HeroHeading'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { Stats } from '@/components/ui/Stats'
import { emphasize } from '@/components/ui/Mark'
import { DotBurst } from '@/components/brand/DotBurst'
import { StepTrail } from '@/components/brand/StepTrail'
import { Faq } from '@/components/home/Faq'
import { home } from '@/lib/content/home'
import { formatDays, formatTime, site } from '@/lib/site'
import { photos, planPhotos, servicePhotos } from '@/lib/content/photos'

import styles from './home.module.css'

// How far the hero photo hangs into the band below it. The next band pads by
// the same amount (plus the 1rem slab) so nothing collides at either size.
const HANG = '-mb-10 lg:-mb-16'
const AFTER_HANG =
  'pt-[calc(var(--section-y)_+_3.5rem)] pb-[var(--section-y)] lg:pt-[var(--section-y)]'

export default function HomePage() {
  const decision = home.decision

  return (
    <>
      <ScrollProgress />

      {/* Hero — what the patient wants. The photo hangs over the seam into
          the cream below, which is the page's first bit of depth. */}
      {/* Clipped on x only: the burst crops at the page edge while the photo
          is still free to hang out of the bottom. */}
      <Band tone="teal" as="div" flush className="relative overflow-x-clip">
        {/* Small screens have no room above the photo, so the burst sits in
            the corner of the band instead. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <DotBurst
            droplet={false}
            className="absolute -top-[6rem] -right-[15rem] h-[30rem] w-[30rem] text-teal-500 opacity-55"
          />
        </div>

        <Header />

        <Container className="relative grid gap-12 pt-6 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-16 lg:pt-12">
          <div className="lg:pb-24">
            <HeroHeading
              text={home.hero.heading}
              accent={home.hero.headingAccent}
              className="text-display max-w-[12ch]"
            />
            <p
              className="rise-in mt-6 max-w-[30ch] text-lede opacity-90"
              style={{ animationDelay: '430ms' }}
            >
              {home.hero.body}
            </p>
            <div
              className="rise-in mt-9 flex flex-wrap items-center gap-4"
              style={{ animationDelay: '530ms' }}
            >
              <Button href={site.bookingUrl} variant="onTeal">
                {home.hero.cta}
              </Button>
              <Button href="#plan" variant="outline">
                {home.hero.secondaryCta}
              </Button>
            </div>

            {/* The strongest thing they can say about themselves, so it goes
                up here rather than mid-page. */}
            <p
              className="rise-in mt-9 flex items-center gap-3 text-small opacity-85"
              style={{ animationDelay: '630ms' }}
            >
              <span className="h-px w-8 shrink-0 bg-clay-300" aria-hidden />
              <span>
                <span className="font-semibold">{home.empathy.award.title}</span>
                <span className="mx-2 opacity-50">·</span>
                {home.empathy.award.detail}
              </span>
            </p>
          </div>

          <div
            className={`rise-in relative z-10 w-[88%] sm:w-3/4 lg:w-full ${HANG}`}
            style={{ animationDelay: '240ms' }}
          >
            {/* The logo's burst, read at scale: it fans out from behind the
                photo's corner, so it looks like the mark and not confetti. */}
            <DotBurst
              droplet={false}
              className="pointer-events-none absolute -top-[19.84rem] left-[calc(100%-16rem)] hidden h-[32rem] w-[32rem] text-teal-500 opacity-55 lg:block"
            />
            <Figure
              subject={home.hero.image}
              {...photos.patientsConsult}
              preload
              offset="teal"
              tone="deep"
              aspect="4 / 5"
              sizes="(min-width: 1200px) 460px, (min-width: 1024px) 40vw, 88vw"
              className={styles.slabIn}
            />
          </div>
        </Container>
      </Band>

      <main id="main">
        {/* The problem — "we know what you're living with." Text starts lower
            than the photo so it clears the hero photo hanging above it. */}
        <Band tone="cream" flush className={AFTER_HANG}>
          <Container className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <div className="lg:col-start-2 lg:row-start-1 lg:pt-16">
              <Reveal>
                <h2 className="max-w-[18ch] text-h2">{home.problem.heading}</h2>
                <p className="mt-5 max-w-[40ch] text-lede text-ink-700">
                  {emphasize(home.problem.body)}
                </p>
              </Reveal>

              <ul className="mt-8">
                {home.problem.items.map((item, i) => (
                  <Reveal
                    as="li"
                    key={item}
                    delay={i * 80}
                    className="flex items-baseline gap-4 border-t border-ink-900/12 py-3.5 last:border-b"
                  >
                    <span
                      className="h-2 w-2 shrink-0 -translate-y-1 rounded-pill bg-teal-500"
                      aria-hidden
                    />
                    <span className="text-lede leading-snug text-ink-900">{item}</span>
                  </Reveal>
                ))}
              </ul>
            </div>

            <Reveal from="left" className="lg:col-start-1 lg:row-start-1">
              <Figure subject={home.problem.image} tone="sand" aspect="4 / 5" />
            </Reveal>
          </Container>
        </Band>

        {/* The guide — Dr. Lee, once. Empathy first, in his words, then the
            authority. */}
        <Band tone="paper">
          <Container className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-20">
            <div>
              <Reveal>
                <h2 className="max-w-[18ch] text-h2">{home.guide.heading}</h2>
              </Reveal>

              <Reveal as="figure" delay={90} className="mt-8 border-l-2 border-teal-500 pl-6">
                <blockquote className="font-display max-w-[34ch] text-lede leading-snug text-ink-900">
                  &ldquo;{home.guide.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-small text-ink-500">
                  {home.guide.attribution}
                </figcaption>
              </Reveal>

              <ul className="mt-10 max-w-[56ch]">
                {home.guide.credentials.map((item, i) => (
                  <Reveal
                    as="li"
                    key={item}
                    delay={180 + i * 80}
                    className="border-t border-ink-900/12 py-3.5 text-ink-700 last:border-b"
                  >
                    {item}
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={200}>
                <Link
                  href="/about"
                  className="mt-8 inline-flex items-center gap-2 font-medium text-teal-700"
                >
                  <span className="link-draw">{home.guide.link}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Reveal>
            </div>

            <Reveal from="right" className="mx-auto w-full max-w-md lg:max-w-none">
              <Figure
                subject={home.guide.image}
                {...photos.guidePortrait}
                offset="clay"
                aspect="4 / 5"
                sizes="(min-width: 1200px) 460px, (min-width: 1024px) 40vw, 90vw"
              />
              <Stats stats={home.empathy.stats} />
            </Reveal>
          </Container>
        </Band>

        {/* The plan — the signature. Steps step down the page so the sequence
            reads before you do, and the trail draws between the numerals. */}
        <Band tone="teal" id="plan" className="scroll-mt-4">
          <Container>
            <Reveal>
              <h2 className="max-w-[18ch] text-h2">{home.plan.heading}</h2>
            </Reveal>

            <StepTrail className="mt-12">
              <ol className="grid gap-14 md:grid-cols-3 md:gap-8 lg:gap-16">
                {home.plan.steps.map((step, i) => (
                  <Reveal
                    as="li"
                    key={step.title}
                    delay={i * 100}
                    className={['', 'md:mt-8', 'md:mt-16'][i]}
                  >
                    <Figure
                      subject={step.image}
                      {...(planPhotos[i] ?? {})}
                      tone="deep"
                      aspect="4 / 5"
                      sizes="(min-width: 1200px) 360px, (min-width: 768px) 30vw, 100vw"
                    />
                    {/* Inline, not block — StepTrail measures this box. */}
                    <span
                      data-trail-anchor
                      className="font-display mt-6 inline-block text-[3.25rem] leading-none tracking-tight text-clay-300 tabular-nums"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-4 text-h3">{step.title}</h3>
                    <p className="mt-3 opacity-85">{step.body}</p>
                    <p className="mt-5 border-t border-canvas/20 pt-4 font-medium">
                      {step.detail}
                    </p>
                  </Reveal>
                ))}
              </ol>
            </StepTrail>
          </Container>
        </Band>

        {/* The decision — the ask, and beside it exactly what saying yes
            involves, so nobody has to book blind. */}
        <Band tone="cream">
          <Container className="grid gap-14 lg:grid-cols-[5fr_6fr] lg:gap-24">
            <Reveal>
              <h2 className="max-w-[14ch] text-h2">{decision.heading}</h2>
              <p className="mt-5 max-w-[34ch] text-lede text-ink-700">{decision.body}</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button href={site.bookingUrl} variant="onCream">
                  {decision.cta}
                </Button>
                <Button href={site.phoneHref} variant="outline" className="text-ink-900">
                  {decision.call}
                </Button>
              </div>

              <div className="mt-12">
                <h3 className="text-base">{decision.hoursHeading}</h3>
                {site.hours.map((row) => (
                  <p key={row.opens + row.days.join()} className="mt-2 text-ink-700">
                    {formatDays(row.days)}, {formatTime(row.opens)}–{formatTime(row.closes)}
                  </p>
                ))}
                <p className="mt-1 text-small text-ink-500">{site.hoursNote}</p>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <h3 className="text-h3">{decision.firstHeading}</h3>
              </Reveal>
              <ol className="mt-5">
                {decision.first.map((item, i) => (
                  <Reveal
                    as="li"
                    key={item}
                    delay={i * 90}
                    className="flex gap-5 border-t border-ink-900/12 py-4 last:border-b"
                  >
                    <span
                      className="font-display w-6 shrink-0 text-[1.75rem] leading-[1.1] text-clay-600 tabular-nums"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <span className="max-w-[52ch] text-ink-700">{item}</span>
                  </Reveal>
                ))}
              </ol>

              <Reveal delay={200} className="mt-10">
                <h3 className="text-base">{decision.feesHeading}</h3>
                <dl className="mt-2">
                  {decision.fees.map((fee) => (
                    <div
                      key={fee.label}
                      className="flex items-baseline justify-between gap-4 border-b border-ink-900/12 py-2"
                    >
                      <dt className="text-ink-700">{fee.label}</dt>
                      <dd className="font-semibold tabular-nums">{fee.price}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-small text-ink-500">{decision.feesNote}</p>
              </Reveal>
            </div>
          </Container>
        </Band>

        {/* How we help — outcomes first, service names second. Alternating
            rows; cards read as a template. */}
        <Band tone="paper">
          <Container>
            <Reveal>
              <h2 className="max-w-[18ch] text-h2">{home.services.heading}</h2>
            </Reveal>

            <ul className="mt-10 flex flex-col gap-10">
              {home.services.items.map((service, i) => {
                const flip = i % 2 === 1
                return (
                  <Reveal as="li" key={service.href}>
                    <Link
                      href={service.href}
                      className={`media-hover group grid items-center gap-7 md:gap-14 ${
                        flip ? 'md:grid-cols-[7fr_2fr]' : 'md:grid-cols-[2fr_7fr]'
                      }`}
                    >
                      {/* 4/5, not square: the shared naturopathic crop only
                          keeps Dr. Lee out of frame at portrait ratios. */}
                      <div className={`w-full max-w-xs md:max-w-none ${flip ? 'md:order-2' : ''}`}>
                        <Figure
                          subject={service.image}
                          {...(servicePhotos[service.slug].wide ?? {})}
                          tone={flip ? 'sandLight' : 'sand'}
                          aspect="4 / 5"
                          sizes="(min-width: 1024px) 260px, (min-width: 768px) 25vw, 100vw"
                        />
                      </div>

                      <div className={flip ? 'md:order-1 md:pl-[8%]' : ''}>
                        <h3 className="text-h3">{service.title}</h3>
                        <p className="mt-3 max-w-[36ch] text-lede leading-snug text-ink-900">
                          {service.outcome}
                        </p>
                        <p className="mt-4 max-w-[52ch] text-ink-500">{service.body}</p>
                        <span className="mt-5 inline-flex items-center gap-2 font-medium text-teal-700">
                          <span className="link-draw group-hover:bg-[length:100%_1px]!">
                            About {service.title}
                          </span>
                          <ArrowRight
                            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                            aria-hidden
                          />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                )
              })}
            </ul>
          </Container>
        </Band>

        {/* Proof — the first review runs wide; the other two stack beside it.
            That's the section's one break from the grid. */}
        <Band tone="cream">
          <Container>
            <Reveal>
              <h2 className="max-w-[18ch] text-h2">{home.proof.heading}</h2>
            </Reveal>

            <div className="mt-12 grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-20">
              {home.testimonials.map((testimonial, i) => (
                <Reveal
                  as="figure"
                  key={testimonial.name}
                  delay={i * 100}
                  className={i === 0 ? 'lg:row-span-2' : ''}
                >
                  <blockquote
                    className={`font-display text-ink-900 ${
                      i === 0
                        ? 'text-[clamp(1.5rem,1.2rem+1vw,1.875rem)] leading-[1.3]'
                        : 'text-lede leading-[1.4]'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`block leading-none text-clay-600 ${
                        i === 0 ? 'mb-2 text-[4.5rem] h-[2.75rem]' : 'mb-1 text-[3rem] h-[1.75rem]'
                      }`}
                    >
                      &ldquo;
                    </span>
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-4 text-small text-ink-500">
                    <span className="font-semibold text-ink-700">{testimonial.name}</span>
                    <span className="mx-2 opacity-50">·</span>
                    Google review, {testimonial.date}
                  </figcaption>
                </Reveal>
              ))}
            </div>
          </Container>
        </Band>

        {/* Reassurance — the questions people ask on the phone before they
            book. */}
        <Band tone="tint">
          <Container className="grid gap-10 lg:grid-cols-[4fr_7fr] lg:gap-20">
            <Reveal>
              <h2 className="max-w-[12ch] text-h2">{home.faq.heading}</h2>
              <p className="mt-5 text-ink-700">
                {home.faq.body}{' '}
                <a href={site.phoneHref} className="link-draw font-medium whitespace-nowrap text-teal-700">
                  {site.phone}
                </a>
                .
              </p>
            </Reveal>

            <Reveal delay={90}>
              <Faq items={home.faq.items} />
            </Reveal>
          </Container>
        </Band>

        {/* Close */}
        <Band tone="teal-deep">
          <Container prose className="text-center">
            <Reveal from="scale">
              {/* No burst here — the hero, the step trail and the footer's
                  rule already make three, and a fourth reads as wallpaper. */}
              <h2 className="mx-auto max-w-[18ch] text-h2">{home.close.heading}</h2>
              <p className="mx-auto mt-5 max-w-[46ch] opacity-85">
                {emphasize(home.close.body)}
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Button href={site.bookingUrl} variant="onTeal">
                  {home.close.cta}
                </Button>
                <Button href="/contact" variant="outline">
                  {home.close.secondaryCta}
                </Button>
              </div>
            </Reveal>
          </Container>
        </Band>
      </main>

      <Footer />
    </>
  )
}
