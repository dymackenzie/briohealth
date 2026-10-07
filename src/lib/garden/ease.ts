/**
 * The site's two motion curves (tokens.css, --ease-out-quart and
 * --ease-out-expo) as functions of t in [0, 1], for motion the canvas draws
 * frame by frame. `smoothstep` is a spatial falloff, never a timing.
 */

export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

/** The t at which easeOutQuart reaches p. */
export const invOutQuart = (p: number) => 1 - Math.pow(1 - Math.min(p, 0.999999), 0.25)

/** Where the quart ease passes 99.9%: the rest of a part's growth is sub-pixel, so it counts as done. */
export const DONE_AT = 1 - Math.pow(0.001, 0.25)

export const smoothstep = (t: number) => t * t * (3 - 2 * t)
