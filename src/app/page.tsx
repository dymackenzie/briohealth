import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Band, Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Figure } from '@/components/ui/Figure'
import { BandDivider } from '@/components/ui/BandDivider'
import { Reveal } from '@/components/ui/Reveal'
import { HeroHeading } from '@/components/ui/HeroHeading'
import { Parallax, ScrollZoom } from '@/components/ui/Parallax'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { CountUp } from '@/components/ui/CountUp'
import { emphasize } from '@/components/ui/Mark'
import { DotBurst, DotRule } from '@/components/brand/DotBurst'
import { StepTrail } from '@/components/brand/StepTrail'
import { home } from '@/lib/content/home'
import { site } from '@/lib/site'
import { photos } from '@/lib/content/photos'

export default function HomePage() {
  return (
    <>
      <ScrollProgress />

      {/* Hero — two images at different scales, the larger breaking the
          container edge. Each drifts at its own rate on scroll. A third one
          sat behind the main photo and only ever showed as a sliver. */}
      <Band tone="teal" as="div" flush className="relative overflow-hidden">
        <DotBurst
          droplet={false}
          className="drift pointer-events-none absolute -top-56 -right-40 h-[46rem] w-[46rem] text-teal-400/10"
        />

        <Header />

        <Container className="relative grid gap-11 pt-7 pb-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-6 lg:pt-10 lg:pb-16">
          <div className="lg:pr-6">
            <HeroHeading
              text={home.hero.heading}
              accent={home.hero.headingAccent}
              className="text-[clamp(2.15rem,5vw,3.5rem)]"
            />
            <p
              className="rise-in mt-5 max-w-[32ch] text-lg opacity-85 lg:text-[1.2rem]"
              style={{ animationDelay: '430ms' }}
            >
              {home.hero.body}
            </p>
            <div
              className="rise-in mt-8 flex flex-wrap items-center gap-4"
              style={{ animationDelay: '530ms' }}
            >
              <Button href={site.bookingUrl} variant="onTeal">
                {home.hero.cta}
              </Button>
              <Button href="/services" variant="outline">
                Explore our services
              </Button>
            </div>

            {/* Award goes up here, not mid-page — it's the strongest thing
                they can say about themselves. */}
            <div
              className="rise-in mt-8 flex items-center gap-3 text-[0.9rem] opacity-75"
              style={{ animationDelay: '630ms' }}
            >
              <DotBurst className="h-5 w-5 shrink-0 text-teal-300" />
              <span>
                <span className="font-medium">{home.empathy.award.title}</span>
                <span className="mx-2 opacity-40">·</span>
                {home.empathy.award.detail}
              </span>
            </div>
          </div>

          <div
            className="rise-in relative lg:-mr-[5vw]"
            style={{ animationDelay: '240ms' }}
          >
            <Parallax speed={0.05}>
              <Figure
                subject={home.hero.images.primary}
                {...photos.leeTeaching}
                priority
                shape="blob"
                tone="deep"
                aspect="1 / 1"
                className="w-full"
              />
            </Parallax>

            <Parallax
              speed={-0.16}
              className="absolute -bottom-14 -left-6 w-[34%] sm:-left-12 lg:-left-24"
            >
              <Figure
                subject={home.hero.images.secondary}
                shape="archSoft"
                tone="teal"
                aspect="3 / 4"
                className="shadow-lg"
              />
            </Parallax>
          </div>
        </Container>

        <BandDivider curve="swell" fill="text-canvas" className="-mb-px" />
      </Band>

      <main id="main">
        {/* Stakes */}
        <Band tone="cream" className="pt-4">
          <Container>
            <div className="grid gap-11 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
              <div>
                <Reveal>
                  <h2 className="max-w-[16ch] text-[clamp(1.6rem,3.2vw,2.3rem)]">
                    {home.stakes.heading}
                  </h2>
                  <p className="mt-4 max-w-[40ch] text-base text-ink-500">
                    {emphasize(home.stakes.body)}
                  </p>
                </Reveal>

                <ul className="mt-8 space-y-1">
                  {home.stakes.items.map((item, i) => (
                    <Reveal
                      as="li"
                      key={item}
                      delay={i * 70}
                      from="left"
                      className="flex items-start gap-4 border-t border-ink-900/10 py-4"
                    >
                      <span
                        className="mt-3 h-1.5 w-1.5 shrink-0 rounded-pill bg-teal-500"
                        aria-hidden
                      />
                      <span className="font-display text-[clamp(1.05rem,1.7vw,1.25rem)] leading-snug text-ink-700">
                        {item}
                      </span>
                    </Reveal>
                  ))}
                </ul>
              </div>

              <Reveal from="right" className="flex flex-col gap-4 lg:pt-11">
                <Parallax speed={0.08}>
                  <Figure
                    subject={home.stakes.images.tall}
                    shape="leaf"
                    tone="sand"
                    aspect="4 / 5"
                  />
                </Parallax>
                <Parallax speed={-0.1} className="ml-7">
                  <Figure
                    subject={home.stakes.images.wide}
                    shape="soft"
                    tone="sandLight"
                    aspect="3 / 2"
                  />
                </Parallax>
              </Reveal>
            </div>
          </Container>
        </Band>

        {/* Value */}
        <div className="relative">
          <BandDivider
            curve="drift"
            fill="text-teal-700"
            flip
            className="bg-canvas -mb-px"
          />

          <Band tone="teal" className="pt-0">
            <Container>
              <div className="grid gap-11 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
                <Reveal from="left">
                  <h2 className="text-[clamp(1.6rem,3.2vw,2.3rem)]">
                    {home.value.heading}
                  </h2>
                  <p className="mt-4 text-base opacity-85">{home.value.body}</p>
                  <p className="mt-4 opacity-70">{emphasize(home.value.lead)}</p>
                  <DotRule className="mt-7 h-2.5 w-32 text-teal-300/50" />

                  <ScrollZoom className="mt-8">
                    <Figure
                      subject={home.value.image}
                      {...photos.leeCoat}
                      shape="leafAlt"
                      tone="deep"
                      aspect="16 / 9"
                    />
                  </ScrollZoom>
                </Reveal>

                {/* Hairlines, not boxes — the numeral carries the hierarchy. */}
                <ul className="lg:pt-4">
                  {home.value.items.map((item, i) => (
                    <Reveal
                      as="li"
                      key={item}
                      delay={i * 90}
                      className="border-b border-canvas/15 py-5 first:border-t"
                    >
                      <span className="text-[1.05rem] leading-snug opacity-90">
                        {item}
                      </span>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </Container>
          </Band>

          <BandDivider curve="swell" fill="text-canvas" className="-mt-px" />
        </div>

        {/* Proof */}
        <Band tone="cream" className="pt-0">
          <Container>
            <div className="grid gap-11 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
              <Reveal from="left" className="relative">
                <ScrollZoom from={1.06}>
                  <Figure
                    subject={home.empathy.images.portrait}
                    {...photos.leePortrait}
                    shape="archSoft"
                    tone="sand"
                    aspect="4 / 5"
                  />
                </ScrollZoom>

                {/* Only overlap on the page, so it reads as deliberate. */}
                <dl className="relative z-10 -mt-11 ml-4 flex gap-7 rounded-lg bg-teal-700 px-6 py-5 text-canvas shadow-lg sm:ml-7">
                  {home.empathy.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd>
                        <span className="font-display block text-[clamp(2rem,3.6vw,2.6rem)] leading-none">
                          <CountUp value={stat.numeric} suffix={stat.suffix} />
                        </span>
                        <span className="mt-2 block max-w-[14ch] text-[0.85rem] opacity-80">
                          {stat.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <div>
                <Reveal>
                  <h2 className="max-w-[18ch] text-[clamp(1.6rem,3.2vw,2.3rem)]">
                    {home.empathy.heading}
                  </h2>
                  <p className="mt-4 max-w-[42ch] text-base text-ink-500">
                    {emphasize(home.empathy.body)}
                  </p>
                </Reveal>

                <div className="mt-10 flex flex-col gap-7">
                  {home.testimonials.map((testimonial, i) => (
                    <Reveal as="figure" key={testimonial.name} delay={i * 110}>
                      <blockquote className="font-display text-[clamp(1.1rem,1.6vw,1.3rem)] leading-[1.42] text-ink-900">
                        <span className="mr-1 text-teal-700">&ldquo;</span>
                        {testimonial.quote}
                        <span className="ml-0.5 text-teal-700">&rdquo;</span>
                      </blockquote>
                      <figcaption className="mt-4 flex items-center gap-3 text-[0.9rem] text-ink-500">
                        <span className="h-px w-8 bg-ink-300" aria-hidden />
                        <span className="font-medium text-ink-700">
                          {testimonial.name}
                        </span>
                        <span className="opacity-40">·</span>
                        {testimonial.date}
                      </figcaption>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Band>

        {/* Plan — steps descend diagonally so the sequence reads before you do. */}
        <div className="relative">
          <BandDivider curve="drift" fill="text-teal-700" className="bg-canvas -mb-px" />

          <Band tone="teal" className="pt-0">
            <Container>
              <Reveal>
                <h2 className="max-w-[20ch] text-[clamp(1.6rem,3.2vw,2.3rem)]">
                  {home.plan.heading}
                </h2>
              </Reveal>

              <StepTrail className="mt-11">
                <ol className="grid gap-10 md:grid-cols-3 md:gap-6">
                {home.plan.steps.map((step, i) => (
                  <Reveal
                    as="li"
                    key={step.title}
                    delay={i * 130}
                    className={i === 1 ? 'md:mt-10' : i === 2 ? 'md:mt-20' : ''}
                  >
                    <Parallax speed={0.06 + i * 0.04}>
                      <Figure
                        subject={step.image}
                        shape={i === 1 ? 'blobAlt' : 'blob'}
                        tone="deep"
                        aspect="4 / 3"
                        className="w-full"
                      />
                    </Parallax>
                    <span
                      data-trail-anchor
                      className="font-display mt-6 inline-block text-3xl leading-none text-teal-300/40 tabular-nums"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-4 text-base">{step.title}</h3>
                    <p className="mt-3 opacity-80">{step.body}</p>
                  </Reveal>
                ))}
                </ol>
              </StepTrail>
            </Container>
          </Band>

          <BandDivider curve="swell" fill="text-canvas" flip className="-mt-px" />
        </div>

        {/* Services — alternating rows. Cards read as a template here. */}
        <Band tone="cream" className="pt-0">
          <Container>
            <Reveal>
              <h2 className="text-[clamp(1.6rem,3.2vw,2.3rem)]">
                {home.services.heading}
              </h2>
            </Reveal>

            <ul className="mt-11 flex flex-col gap-12 lg:gap-16">
              {home.services.items.map((service, i) => (
                <Reveal as="li" key={service.href}>
                  <Link
                    href={service.href}
                    className="media-hover group grid items-center gap-7 md:grid-cols-2 md:gap-11"
                  >
                    <div className={`overflow-hidden ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                      <Parallax speed={0.07}>
                        <Figure
                          subject={service.image}
                          shape={i % 2 === 1 ? 'leafAlt' : 'leaf'}
                          tone={i % 2 === 1 ? 'sandLight' : 'sand'}
                          aspect="3 / 2"
                          className="media-zoom w-full"
                        />
                      </Parallax>
                    </div>

                    <div className={i % 2 === 1 ? 'md:order-1 md:pr-6' : 'md:pl-4'}>
                      <h3 className="text-[clamp(1.35rem,2.3vw,1.7rem)]">
                        {service.title}
                      </h3>
                      <p className="mt-4 max-w-[40ch] text-base text-ink-500">
                        {service.body}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 font-medium text-teal-700">
                        Learn more
                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Band>

        {/* Close */}
        <div className="relative">
          <BandDivider curve="swell" fill="text-teal-900" className="bg-canvas -mb-px" />

          <Band tone="teal-deep" className="relative overflow-hidden pt-4">
            <DotBurst
              droplet={false}
              className="drift pointer-events-none absolute -bottom-64 -left-40 h-[40rem] w-[40rem] text-teal-400/8"
            />
            <Container prose className="relative text-center">
              <Reveal from="scale">
                <DotBurst className="mx-auto h-12 w-12 text-teal-300" />
                <h2 className="mt-6 text-[clamp(1.6rem,3.2vw,2.3rem)]">
                  {home.close.heading}
                </h2>
                <p className="mx-auto mt-4 max-w-[46ch] text-base opacity-80">
                  {emphasize(home.close.body)}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Button href={site.bookingUrl} variant="onTeal">
                    {home.close.cta}
                  </Button>
                  <Button href="/contact" variant="outline">
                    Ask us a question
                  </Button>
                </div>
              </Reveal>
            </Container>
          </Band>
        </div>
      </main>

      <Footer />
    </>
  )
}
