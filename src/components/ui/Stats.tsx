import { CountUp } from './CountUp'

/**
 * The teal slab that overlaps the bottom of the portrait on the homepage and
 * About. The overlap is the depth — it sits in front of the photo rather than
 * floating on a shadow — so keep the negative margin.
 */
export function Stats({
  stats,
}: {
  stats: readonly { numeric: number; suffix: string; label: string }[]
}) {
  return (
    <dl className="relative z-10 -mt-11 ml-4 flex gap-8 rounded-photo bg-teal-700 px-6 py-5 text-canvas sm:ml-7">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <span className="font-display block text-[clamp(2.5rem,4vw,3.5rem)] leading-none tracking-tight text-clay-300">
              <CountUp value={stat.numeric} suffix={stat.suffix} />
            </span>
            <span className="mt-2 block max-w-[14ch] text-small opacity-85">
              {stat.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
