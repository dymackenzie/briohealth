import { Bud } from '@/components/brand/Bud'
import { PageHero } from '@/components/layout/PageHero'
import { ServiceTiles } from '@/components/sections/ServiceTiles'
import { services } from '@/lib/content/services'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = buildMetadata({
  title: 'Services',
  description: 'Naturopathic medicine, acupuncture and I.V. therapy at Brio Health in Richmond, BC.',
  path: '/services',
})

/** The live services page is empty, so: the title, one bud, and the three tiles, nothing else. */
export default function ServicesPage() {
  return (
    <main id="main">
      <PageHero title="Services" bud={<Bud size="small" colour="teal" className="top-10 right-[18%]" />} />
      <div className="container-x pb-[var(--section-y)]">
        <ServiceTiles order={services.map((s) => s.slug)} />
      </div>
    </main>
  )
}
