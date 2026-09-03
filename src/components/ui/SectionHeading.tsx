interface SectionHeadingProps {
  eyebrow?: string
  heading: string
  emphasisWord?: string
  subtext?: string
  align?: 'left' | 'center'
  eyebrowColor?: 'teal' | 'coral'
  className?: string
}

export default function SectionHeading({
  eyebrow,
  heading,
  emphasisWord,
  subtext,
  align = 'left',
  eyebrowColor = 'teal',
  className = '',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''
  const eyebrowColorClass = eyebrowColor === 'coral' ? 'text-coral-500' : 'text-teal-500'

  const headingWithEmphasis = emphasisWord
    ? heading.replace(emphasisWord, `<em>${emphasisWord}</em>`)
    : heading

  return (
    <div className={`max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && (
        <p className={`text-[0.8125rem] font-body font-semibold tracking-[0.14em] uppercase mb-3 ${eyebrowColorClass}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] tracking-[-0.02em] text-ink-900 mb-4"
        dangerouslySetInnerHTML={{ __html: headingWithEmphasis }}
      />
      {subtext && (
        <p className="text-body-lg text-ink-500 leading-relaxed mt-4" style={{ fontSize: '1.1875rem' }}>
          {subtext}
        </p>
      )}
    </div>
  )
}
