/**
 * Loop playback is decided by a pure function so the gates are testable:
 * the visitor's own pause, reduced motion and save-data win over
 * everything; a service row plays while it is open and its media is in
 * view (open means hovered or focused where the device can hover, toggled
 * by the row's disclosure button where it cannot; a closed row's media is
 * clipped to nothing, so it is never in view); the service hero plays
 * while in view. The component feeds this the live values and calls
 * play()/pause().
 */

export interface LoopDecision {
  mode: 'row' | 'hero'
  /** Row mode: the row is expanded. Ignored by the hero. */
  open: boolean
  inView: boolean
  reducedMotion: boolean
  saveData: boolean
  /** The visitor pressed pause (WCAG 2.2.2); only their play undoes it. */
  paused: boolean
}

export function shouldPlayLoop(d: LoopDecision): boolean {
  if (d.paused || d.reducedMotion || d.saveData) return false
  if (d.mode === 'hero') return d.inView
  return d.open && d.inView
}

/**
 * The service page's narrated video plays by itself, muted, while it is in
 * view, once the page has loaded and gone idle (so it never competes with
 * the LCP), and never under reduced motion or save-data. The visitor's
 * first touch hands it over: a pause, a play or turning the sound on, and
 * from then on it is theirs (a pause holds until they press play, and a
 * video they are listening to keeps playing when they scroll past). null
 * means hands off; 'pause' on a video that is already paused does nothing.
 */
export interface NarratedDecision {
  /** Hydrated, and the page has loaded and gone idle. */
  ready: boolean
  inView: boolean
  reducedMotion: boolean
  saveData: boolean
  /** The visitor paused, played or unmuted it. */
  taken: boolean
}

export function narratedAutoplay(d: NarratedDecision): 'play' | 'pause' | null {
  if (d.taken) return null
  return d.ready && d.inView && !d.reducedMotion && !d.saveData ? 'play' : 'pause'
}

/**
 * Whether a media event came from the visitor. A play or pause is theirs
 * unless it is the one the page just asked for (`ours`), the pause at the
 * end included; a volume change is theirs when it leaves the sound on
 * (the page only ever mutes).
 */
export function byVisitor(event: 'play' | 'pause' | 'volumechange', ours: 'play' | 'pause' | null, muted: boolean): boolean {
  if (event === 'volumechange') return !muted
  return event !== ours
}
