import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

import { Field } from '@/components/ui/Field'
import { displayClass } from '@/lib/typography'

/**
 * Inner-page opener: title, one lead, optionally a way up. No eyebrow. The
 * teal variant is a full-width field and counts toward the page's three.
 * `bud` is a `Bud` placed in the hero's open right side: the one bud a
 * simple page gets (spec 3.7).
 */
export function PageHero({
  title,
  lead,
  parent,
  surface = 'paper',
  bud,
  children,
}: {
  title: string
  lead?: string
  parent?: { label: string; href: string }
  surface?: 'paper' | 'teal'
  bud?: ReactNode
  children?: ReactNode
}) {
  const inner = (
    <div className="container-x pt-12 pb-14 lg:pt-16 lg:pb-20">
      {parent && (
        <Link
          href={parent.href}
          className={`inline-flex items-center gap-1.5 text-small font-medium ${surface === 'teal' ? 'text-on-teal' : 'text-teal-deep'} underline-offset-4 hover:underline`}
        >
          <ArrowLeft size={16} aria-hidden />
          {parent.label}
        </Link>
      )}
      <h1 className={`${displayClass(title)} ${parent ? 'mt-5' : ''} max-w-[16ch]`}>{title}</h1>
      {lead && <p className="mt-6 max-w-[42ch] text-lede">{lead}</p>}
      {children}
      {bud}
    </div>
  )

  return surface === 'teal' ? (
    <Field as="section" className="relative overflow-x-clip">
      {inner}
    </Field>
  ) : (
    <section className="relative overflow-x-clip">{inner}</section>
  )
}
