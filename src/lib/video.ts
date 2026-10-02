/**
 * Loop playback is decided by a pure function so the gates are testable:
 * reduced motion and save-data win over everything; a tile plays on hover
 * or focus where hover exists and while in view where it does not; the
 * service hero plays while in view. The component feeds this the live
 * values and calls play()/pause().
 */

export interface LoopDecision {
  mode: 'tile' | 'hero'
  hovered: boolean
  focused: boolean
  inView: boolean
  canHover: boolean
  reducedMotion: boolean
  saveData: boolean
}

export function shouldPlayLoop(d: LoopDecision): boolean {
  if (d.reducedMotion || d.saveData) return false
  if (d.mode === 'hero') return d.inView
  if (d.canHover) return d.hovered || d.focused
  return d.inView
}

const YOUTUBE_HOSTS = new Set(['www.youtube.com', 'youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube-nocookie.com'])
const ID = /^[\w-]{11}$/

/** The privacy-enhanced embed for a YouTube link in any of its usual forms, or null. */
export function youtubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null
  let parsed: URL
  try {
    parsed = new URL(url.trim())
  } catch {
    return null
  }
  if (!YOUTUBE_HOSTS.has(parsed.hostname)) return null

  const segments = parsed.pathname.split('/').filter(Boolean)
  const candidate =
    parsed.hostname === 'youtu.be'
      ? segments[0]
      : segments[0] === 'embed' || segments[0] === 'shorts'
        ? segments[1]
        : parsed.searchParams.get('v')
  if (!candidate || !ID.test(candidate)) return null

  return `https://www.youtube-nocookie.com/embed/${candidate}?autoplay=1&cc_load_policy=1&rel=0`
}
