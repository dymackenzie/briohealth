import type { Bounds } from './species'

/**
 * Sprite geometry for the canvas engine. A growing plant's leaves and
 * flowers are drawn once each into an atlas, then scaled out of it frame by
 * frame, so a frame costs one image draw per part instead of every path in
 * it. Pure, so it is tested without a canvas.
 */

/** Where some parts sit (x, y in plant coordinates, CSS px) and their size in device px, padded for strokes and washes. */
export interface Cell {
  x: number
  y: number
  sw: number
  sh: number
}

export function cellFor(b: Bounds, dpr: number, pad = 3): Cell {
  const x = Math.floor(b.minX - pad)
  const y = Math.floor(b.minY - pad)
  return {
    x,
    y,
    sw: Math.max(1, Math.ceil((Math.ceil(b.maxX + pad) - x) * dpr)),
    sh: Math.max(1, Math.ceil((Math.ceil(b.maxY + pad) - y) * dpr)),
  }
}

/**
 * Shelf-pack boxes (device px) into a sheet: tallest first, left to right,
 * a new shelf when a row is full, `gap` px between neighbours. Returns each
 * box's top-left, in input order, and the sheet's size.
 */
export function packShelves(boxes: readonly { sw: number; sh: number }[], gap = 1): { at: [number, number][]; w: number; h: number } {
  let area = 0
  let widest = 0
  for (const b of boxes) {
    area += (b.sw + gap) * (b.sh + gap)
    widest = Math.max(widest, b.sw + gap)
  }
  const w = Math.max(widest, Math.ceil(Math.sqrt(area) * 1.15))
  const order = boxes.map((_, i) => i).sort((a, b) => boxes[b].sh - boxes[a].sh)
  const at: [number, number][] = new Array(boxes.length)
  let x = 0
  let y = 0
  let row = 0
  for (const i of order) {
    const b = boxes[i]
    if (x + b.sw > w) {
      x = 0
      y += row + gap
      row = 0
    }
    at[i] = [x, y]
    x += b.sw + gap
    row = Math.max(row, b.sh)
  }
  return { at, w, h: Math.max(1, y + row) }
}
