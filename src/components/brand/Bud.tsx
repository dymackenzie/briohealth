import { Reveal } from '@/components/ui/Reveal'
import { DotBurst } from './DotBurst'

/**
 * A scattered dot burst (spec 3.7): one of three sizes, teal on paper or
 * grey, paper on teal, placed by hand in a page's open space with
 * `className` (the parent is `relative`). It blooms once as it scrolls
 * into view through Reveal; reduced motion or no JavaScript draws it
 * static. At most three per page, never over text or photos, no two at
 * the same height or the same distance from the edge. Hidden below md
 * unless the caller knows there is room (`hideBelow={false}`), or below lg
 * where the tablet layout closes its open space (`hideBelow="lg"`).
 */

const WIDTH = { large: 'w-[130px]', medium: 'w-[70px]', small: 'w-[45px]' } as const
const COLOUR = { teal: 'text-teal', paper: 'text-paper' } as const
const HIDE = { md: 'hidden md:block', lg: 'hidden lg:block' } as const

export function Bud({
  size,
  colour,
  className = '',
  hideBelow = 'md',
}: {
  size: keyof typeof WIDTH
  colour: keyof typeof COLOUR
  className?: string
  hideBelow?: keyof typeof HIDE | false
}) {
  return (
    <Reveal
      className={`pointer-events-none absolute ${hideBelow ? HIDE[hideBelow] : ''} ${className}`}
      aria-hidden="true"
    >
      <DotBurst animate="reveal" className={`block h-auto ${WIDTH[size]} ${COLOUR[colour]}`} />
    </Reveal>
  )
}
