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
