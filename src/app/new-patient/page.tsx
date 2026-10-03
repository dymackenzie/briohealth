import { Bud } from '@/components/brand/Bud'
import { NewPatientForm } from '@/components/forms/NewPatientForm'
import { PageHero } from '@/components/layout/PageHero'
import { Accordion } from '@/components/ui/Accordion'
import { Reveal } from '@/components/ui/Reveal'
import { faqsFor } from '@/lib/content/faqs'
import { pages } from '@/lib/content/pages'
import { buildMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/wp/queries'
import { renderContent } from '@/lib/wp/renderContent'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'New Patient',
  description: 'How to book your first appointment with Brio Health in Richmond, BC: the welcome video, the three questions and the steps.',
  path: '/new-patient',
})

/**
 * The live Book Now page: welcome video, the booking steps, the three
 * statements that gate "Get Started", the booking FAQs. The video is a
 * normal player, not autoplaying. One left-aligned column; no teal field;
 * the page's one bud sits in the hero's open right side.
 */
export default async function NewPatientPage() {
  const settings = await getSiteSettings()
  const page = pages.newPatient

  return (
    <main id="main">
      <PageHero title={page.title} bud={<Bud size="medium" colour="teal" className="top-12 right-[12%]" />} />

      <div className="container-x pb-[var(--section-y)]">
        <div className="max-w-[68ch]">
          <Reveal>
            <video controls preload="metadata" className="w-full rounded-brand bg-grey" aria-label="Welcome to Brio Health">
              <source src={page.videoUrl} type="video/mp4" />
            </video>
          </Reveal>

          <Reveal delay={80} className="prose-post prose-page mt-10">
            {renderContent(page.intro)}
          </Reveal>

          <Reveal delay={120} className="mt-12">
            <NewPatientForm
              bookingUrl={settings.bookingUrl}
              statements={page.statements}
              heading={page.statementsHeading}
              returningLabel={page.returningLabel}
            />
          </Reveal>

          <Reveal delay={160} className="mt-16">
            <h2 className="text-h2">{page.faqHeading}</h2>
            <div className="mt-6">
              <Accordion items={faqsFor('booking').map(({ question, answer }) => ({ question, answer }))} />
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  )
}
