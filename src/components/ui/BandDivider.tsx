type Curve = 'swell' | 'drift'

// Deliberately asymmetric — a symmetric arc looks like a template flourish.
const CURVES: Record<Curve, string> = {
  swell: 'M0,64 C220,10 440,0 720,26 C1000,52 1230,88 1440,52 L1440,120 L0,120 Z',
  drift: 'M0,30 C300,86 560,92 880,60 C1120,36 1300,14 1440,34 L1440,120 L0,120 Z',
}

export function BandDivider({
  curve = 'swell',
  fill,
  flip = false,
  className = '',
}: {
  curve?: Curve
  /** Text-colour class for the band *below*, e.g. `text-canvas`. */
  fill: string
  flip?: boolean
  className?: string
}) {
  return (
    <div aria-hidden className={`pointer-events-none relative ${fill} ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="currentColor"
        className={`block h-[clamp(1.75rem,4vw,3.5rem)] w-full ${flip ? 'scale-x-[-1]' : ''}`}
      >
        <path d={CURVES[curve]} />
      </svg>
    </div>
  )
}
