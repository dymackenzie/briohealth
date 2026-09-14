import { CountUp } from './CountUp'

/** The teal card that overlaps the portrait on the homepage and About. */
export function Stats({
  stats,
}: {
  stats: readonly { numeric: number; suffix: string; label: string }[]
}) {
  return (
    <dl className="relative z-10 -mt-11 ml-4 flex gap-7 rounded-lg bg-teal-700 px-6 py-5 text-canvas shadow-lg sm:ml-7">
      {stats.map((stat) => (
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
  )
}
