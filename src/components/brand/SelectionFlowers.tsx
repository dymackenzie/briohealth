'use client'

import { useEffect } from 'react'

import { flowerSvg, plants } from '@/lib/flowers'

/** Past this many on screen a bigger selection plants nothing more. */
const CAP = 60
/** How long the closing runs before a flower is removed (motion.css). */
const CLOSE_MS = 600

/**
 * Select text anywhere and small flowers open on the letters; let go and
 * they close again (the user's text-selection flowers reference). Which
 * letters plant is fixed per letter, so dragging further only adds. Only
 * letters on screen plant, so selecting the whole page costs no more than a
 * screenful. Decoration only: aria-hidden, no pointer events, and the
 * selection itself is untouched.
 */
export function SelectionFlowers() {
  useEffect(() => {
    const layer = document.createElement('div')
    layer.className = 'flower-layer'
    document.body.append(layer)

    const ids = new WeakMap<Text, number>()
    let nextId = 0
    const live = new Map<string, { el: Element; timer?: number }>()
    const probe = document.createRange()

    const wanted = () => {
      const want = new Map<string, () => Element>()
      const sel = getSelection()
      if (!sel || sel.isCollapsed || !sel.rangeCount) return want
      const range = sel.getRangeAt(0)
      const root = range.commonAncestorContainer
      const walker = document.createTreeWalker(root.nodeType === Node.TEXT_NODE ? root.parentNode! : root, NodeFilter.SHOW_TEXT)

      for (let node = walker.nextNode() as Text | null; node && want.size < CAP; node = walker.nextNode() as Text | null) {
        if (!range.intersectsNode(node) || node.parentElement?.closest('[aria-hidden="true"], script, style')) continue
        probe.selectNodeContents(node)
        const box = probe.getBoundingClientRect()
        if (box.bottom < 0 || box.top > innerHeight || box.width === 0) continue

        if (!ids.has(node)) ids.set(node, nextId++)
        const from = node === range.startContainer ? range.startOffset : 0
        const to = node === range.endContainer ? range.endOffset : node.length
        // capped: headline-sized heads are clumsy and sit on the line above
        const size = Math.min(parseFloat(getComputedStyle(node.parentElement!).fontSize), 30)
        for (let i = from; i < to && want.size < CAP; i++) {
          const key = `${ids.get(node)}:${i}`
          if (/\s/.test(node.data[i]) || !plants(key)) continue
          want.set(key, () => {
            probe.setStart(node, i)
            probe.setEnd(node, i + 1)
            const r = probe.getBoundingClientRect()
            const t = document.createElement('template')
            t.innerHTML = flowerSvg(size)
            const el = t.content.firstElementChild as SVGSVGElement
            // at the top of the letter; the head floats up from there
            el.style.left = `${r.left + r.width / 2 + scrollX}px`
            el.style.top = `${r.top + r.height * 0.2 + scrollY}px`
            layer.append(el)
            return el
          })
        }
      }
      return want
    }

    let frame = 0
    const update = () => {
      frame = 0
      // the layer clips, so a flower leaning off the right edge can't scroll the page sideways
      layer.style.height = `${document.documentElement.scrollHeight}px`
      const want = wanted()
      for (const [key, make] of want) {
        const had = live.get(key)
        if (had) {
          if (had.timer !== undefined) {
            clearTimeout(had.timer)
            had.timer = undefined
            had.el.classList.add('on')
          }
          continue
        }
        const el = make()
        live.set(key, { el })
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('on')))
      }
      for (const [key, flower] of live) {
        if (want.has(key) || flower.timer !== undefined) continue
        flower.el.classList.remove('on')
        flower.timer = window.setTimeout(() => {
          flower.el.remove()
          live.delete(key)
        }, CLOSE_MS)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    document.addEventListener('selectionchange', schedule)
    return () => {
      document.removeEventListener('selectionchange', schedule)
      cancelAnimationFrame(frame)
      for (const { timer } of live.values()) clearTimeout(timer)
      layer.remove()
    }
  }, [])

  return null
}
