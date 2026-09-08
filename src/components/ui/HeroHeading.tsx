/**
 * The one orchestrated moment on the page.
 *
 * The headline sets word by word from behind a mask — type arriving rather
 * than a block fading in — and the hand-drawn underline draws itself once the
 * last word has landed.
 *
 * No JavaScript. The animation lives in globals.css behind the same `js` class
 * as Reveal and rise-in, so the words are simply there if the script never
 * runs, and there's no client/server branch to mismatch on hydration. An
 * earlier version used motion here and reduced-motion visitors got a headline
 * frozen behind its own mask.
 *
 * Deliberately the only entrance of its kind on the site. Repeated per section
 * it would stop being a moment and start being a tic.
 */

const PER_WORD = 55
const AFTER_WORDS = 320

export function HeroHeading({
  text,
  accent,
  className = '',
}: {
  text: string
  /** Gets the underline, drawn once the words have landed. */
  accent: string
  className?: string
}) {
  const words = [...text.split(' '), accent]
  const drawAt = words.length * PER_WORD + AFTER_WORDS

  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="hero-word">
          <span style={{ animationDelay: `${i * PER_WORD}ms` }}>
            {word}
            {i === words.length - 1 && (
              <svg
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
                className="hero-underline absolute bottom-0 left-0 h-[0.2em] w-full text-teal-300"
              >
                {/* One sag, not a wave. The earlier S-curve read as a stray
                    squiggle at this size rather than a drawn line.
                    pathLength normalises the dash maths to 0-1 whatever the
                    rendered width turns out to be. */}
                <path
                  pathLength="1"
                  d="M3 5.4 C52 10.2, 148 10.4, 197 5.8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{ animationDelay: `${drawAt}ms` }}
                />
              </svg>
            )}
          </span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </h1>
  )
}
