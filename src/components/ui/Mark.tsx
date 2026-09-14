import { Fragment, type ReactNode } from 'react'

/**
 * Highlights written inline in the copy as `**like this**`.
 *
 * Kept as a marker in the string rather than spans in the JSX so the copy
 * stays a plain string — which matters when it moves into SCF text fields and
 * the client is the one writing it. Markdown-style, so it's already familiar.
 */
const PATTERN = /\*\*(.+?)\*\*/g

export function emphasize(text: string): ReactNode {
  if (!text.includes('**')) return text

  const out: ReactNode[] = []
  let last = 0

  for (const match of text.matchAll(PATTERN)) {
    const start = match.index ?? 0
    if (start > last) out.push(text.slice(last, start))
    out.push(<mark className="mark">{match[1]}</mark>)
    last = start + match[0].length
  }

  if (last < text.length) out.push(text.slice(last))

  return out.map((node, i) => <Fragment key={i}>{node}</Fragment>)
}
