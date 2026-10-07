import { describe, expect, it } from 'vitest'
import { pages } from './pages'

/** The live Pickleball page's text (23155), as it read when it was split into fields. */
const LIVE_PICKLEBALL = `
Are you ready to unlock your hidden potential on the pickleball court?
Are you ready to win more games and have more fun?
Brio Pickleball Coaching offers private & small group lessons. We work with beginners & advanced players. We specialize in developing solid fundamentals so players improve faster and have more fun.
Our Coaching methodology follows these 3 steps
Better Movement
Better paddle technique improves your consistency.
Better footwork helps you be in the right position to win more points.
Better Decision making
Learn different strategies to quickly adapt against different opponents
Develop a higher pickleball IQ to win more games
Better Recovery
Learn the right technique to keep your body more efficient & injury free
Learn how to prevent injuries so you can play for years to come.
Pickleball Coaching Services
Dr. Jeff’s team of coaches are Pickleball Canada certified instructors. They bring a wealth of experience from other health disciplines combined with their years of coaching pickleball.
Coaching Services offered:
Private Coaching Sessions ($110+GST/hour): 1 to 2 players. One-on-one coaching includes a full assessment and tailored instructions to improve your paddle skills, movement patterns, and improved mindset.
Group Coaching Sessions:($ 160+GST/hour): 3-4 players. Team coaching includes skill development, key movement patterns with your partner and winning doubles strategy.
`

describe('the Pickleball page is the live page, verbatim', () => {
  const pb = pages.pickleball
  const strings = [
    ...pb.questions,
    pb.intro,
    pb.stepsHeading,
    ...pb.steps.flatMap((step) => [step.title, ...step.points]),
    pb.servicesHeading,
    pb.servicesIntro,
    pb.offeringsHeading,
    ...pb.offerings.flatMap((o) => [o.name, o.price, o.detail]),
  ]

  it.each(strings)('%s', (s) => {
    expect(LIVE_PICKLEBALL).toContain(s)
  })

  it('keeps every part of it', () => {
    expect(pb.questions).toHaveLength(2)
    expect(pb.steps.map((s) => s.points.length)).toEqual([2, 2, 2])
    expect(pb.offerings.map((o) => o.price)).toEqual(['$110+GST/hour', '$ 160+GST/hour'])
    // Nothing dropped in the split: take out every field and only the
    // punctuation the layout replaces (the price brackets and colons) is left.
    const rest = [...strings].sort((a, b) => b.length - a.length).reduce((text, s) => text.replace(s, ''), LIVE_PICKLEBALL)
    expect(rest.replace(/[\s():]/g, '')).toBe('')
  })
})
