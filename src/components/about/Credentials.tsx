import { site, yearsPractising } from '@/lib/site'

/**
 * Facts only, each one on the live site — the About bio, the acupuncture page
 * or the Richmond News award. Set as type with hairlines between, not as
 * badges or icons: it should read like a CV, not a feature row.
 */
const CREDENTIALS = [
  {
    title: 'Naturopathic Physician (N.D.)',
    detail: 'Board-certified and licensed',
  },
  {
    title: 'Registered Acupuncturist (R.Ac.)',
    detail: 'Practising acupuncture for 18+ years',
  },
  {
    title: 'Bastyr University, Seattle',
    detail: 'Degrees in Naturopathic Medicine and Acupuncture',
  },
  {
    title: 'University of British Columbia',
    detail: 'Science degree',
  },
  {
    title: `Richmond, since ${site.foundedYear}`,
    detail: `${yearsPractising} years in practice here`,
  },
  {
    title: 'Best of Richmond 2025',
    detail: 'Voted Best Naturopath by Richmond News',
  },
] as const

export function Credentials({ className = '' }: { className?: string }) {
  return (
    <ul className={`border-t border-ink-900/12 ${className}`}>
      {CREDENTIALS.map((item) => (
        <li
          key={item.title}
          className="grid gap-x-6 gap-y-0.5 border-b border-ink-900/12 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:items-baseline"
        >
          <span className="font-semibold">{item.title}</span>
          <span className="text-ink-500">{item.detail}</span>
        </li>
      ))}
    </ul>
  )
}
