import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { teamMemberBySlugQuery, teamMembersQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import SanityImage from '@/components/media/SanityImage'
import Placeholder from '@/components/media/Placeholder'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import { PortableText } from '@portabletext/react'
import CtaBandSection from '@/components/sections/CtaBandSection'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const members = await client.fetch(teamMembersQuery).catch(() => [])
  return (members || []).map((m: any) => ({ slug: m.slug?.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [member, site] = await Promise.all([
    client.fetch(teamMemberBySlugQuery, { slug }, { next: { tags: ['teamMember'] } }),
    client.fetch(siteSettingsQuery, {}, { next: { tags: ['siteSettings'] } }),
  ])
  return buildMetadata(member?.seo, site, member?.name)
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params
  const member = await client.fetch(teamMemberBySlugQuery, { slug }, { next: { tags: ['teamMember'] } })
  if (!member) notFound()

  return (
    <>
      {/* Bio hero */}
      <section className="bg-sand-200 py-[clamp(4rem,9vw,8rem)]">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-[380px] mx-auto lg:mx-0">
              <div className="overflow-hidden rounded-t-[999px] rounded-b-[var(--r-xl)]">
                {member.photo ? (
                  <SanityImage image={member.photo} alt={member.name} sizes="(max-width: 768px) 100vw, 380px" />
                ) : (
                  <Placeholder label={`${member.name} portrait`} ratio="3/4" />
                )}
              </div>
            </div>
            <div>
              <p className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase text-teal-500 mb-2">Team Member</p>
              <h1 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] text-ink-900 mb-1">{member.name}</h1>
              {member.credentials && <p className="text-teal-600 font-semibold text-lg mb-1">{member.credentials}</p>}
              {member.role && <p className="text-ink-500 text-[1.0625rem] mb-5">{member.role}</p>}
              {member.pullQuote && (
                <blockquote className="border-l-4 border-teal-500 pl-5 mb-6 font-display italic text-ink-700 text-[1.125rem] leading-snug">
                  &ldquo;{member.pullQuote}&rdquo;
                </blockquote>
              )}
              {member.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {member.specialties.map((s: string) => <Tag key={s} color="teal">{s}</Tag>)}
                </div>
              )}
              <Button href="https://yourbriohealth.janeapp.com" external variant="primary" size="lg">
                Book with {member.name.split(' ')[0]}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Bio */}
      {member.bio && (
        <section className="bg-canvas py-[clamp(4rem,9vw,8rem)]">
          <Container size="prose">
            <div className="prose">
              <PortableText value={member.bio} />
            </div>
          </Container>
        </section>
      )}

      <CtaBandSection section={{
        heading: `Book a visit with ${member.name.split(' ')[0]}.`,
        primaryCta: { label: 'Book Now', style: 'accent', link: { kind: 'booking' } },
        background: 'teal',
      }} />
    </>
  )
}
