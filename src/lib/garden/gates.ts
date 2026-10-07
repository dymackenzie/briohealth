/**
 * The garden's gates as pure functions, like `shouldPlayLoop` for video.
 * The visitor's pause, reduced motion, save-data and a hidden tab win over
 * everything; otherwise it animates while the box is in view.
 */

export interface AnimateGates {
  paused: boolean
  reducedMotion: boolean
  saveData: boolean
  hidden: boolean
  inView: boolean
}

export function shouldAnimateGarden(g: AnimateGates): boolean {
  if (g.paused || g.reducedMotion || g.saveData || g.hidden) return false
  return g.inView
}

/**
 * How the garden starts. Save-data: the engine is never fetched; the
 * finished still (a static SVG) stands in. Reduced motion: the engine draws
 * the finished garden once and nothing moves. Otherwise every plant grows,
 * its stem rising from the first frame.
 */
export type StartMode = 'still' | 'static' | 'grow'

export function gardenStartMode(g: { saveData: boolean; reducedMotion: boolean }): StartMode {
  if (g.saveData) return 'still'
  return g.reducedMotion ? 'static' : 'grow'
}
