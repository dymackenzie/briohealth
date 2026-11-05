import { describe, expect, it } from 'vitest'
import { home } from './home'
import { reviewsUrl } from '@/lib/site'

/** Spot checks against the second wireframe (2026-10-24) and the first round's reading notes. */
describe('homepage content is the wireframe, verbatim', () => {
  it('labels the homepage buttons as the wireframe does', () => {
    expect(home.cta).toBe('Schedule a Consultation')
  })

  it('hero', () => {
    expect(home.hero).toEqual({
      heading: 'Reclaim Your Vitality Naturally',
      sentence: 'Are you tired of feeling exhausted every single day?',
    })
  })

  it('stakes', () => {
    expect(home.stakes.heading).toBe('Don’t Let Fatigue Control Your Life')
    expect(home.stakes.sentence).toBe('What happens if you continue to ignore your health?')
    expect(home.stakes.points).toHaveLength(8)
    expect(home.stakes.points[0]).toBe('You’re exhausted and drained every day.')
    expect(home.stakes.points[4]).toBe('Chronic inflammation and burnout can ruin health.')
    expect(home.stakes.points[7]).toBe('Anxiety leaves you feeling unproductive')
  })

  it('value', () => {
    expect(home.value.heading).toBe('Live with Lasting Energy')
    expect(home.value.sentence).toBe('Experience the joy of true vitality in everyday life.')
    expect(home.value.points.map((p) => p.text)).toEqual([
      'Customized treatment plans addressing your unique needs',
      'Rooted in Tradition. Guided by Science. Focused Personalized Care',
      'Proven methods to restore balance and energy',
      'Support from a dedicated health professional with proven success',
    ])
  })

  it('trust', () => {
    expect(home.trust.heading).toBe('We Make Your Health Journey Simple')
    expect(home.trust.sentence).toBe('With 20 years of experience, we know how to help you.')
    expect(home.trust.stats.map((s) => s.title)).toEqual(['20 years of Clinical experience', 'Trusted by over 5,000+ patients.'])
    expect(home.trust.stats[1].link).toBe(reviewsUrl)
    expect(home.trust.badgeHeading).toBe('Brio Health was voted in Richmond News’ “Best of Richmond 2026” in the category of Best Naturopath!')
    expect(home.trust.badgeThanks).toBe('Thank you, Richmond!')
  })

  it('plan', () => {
    expect(home.plan.heading).toBe('3 Simple Steps to Transform Your Health')
    expect(home.plan.sentence).toBe('Easy steps to restore your vitality and energy.')
    expect(home.plan.steps.map((s) => s.title)).toEqual(['Assessment', 'Healthy Baseline', 'Cultivate Vitality'])
    expect(home.plan.steps[0].body).toBe(
      'Everyone’s healing journey is unique. During the initial assessment, we carefully listen and uncover your root causes.',
    )
  })

  it('explanatory paragraph', () => {
    expect(home.explain.heading).toBe('Your Health Matters: Let Us Help')
    expect(home.explain.sentence).toBe('You deserve to feel energized and healthy.')
    expect(home.explain.paragraphs).toHaveLength(4)
    expect(home.explain.paragraphs[3]).toBe(
      'Don’t let frustration hold you back any longer—schedule a consultation today and discover how you can take charge of your health!',
    )
  })

  it('has no double spaces anywhere (wireframe typing artefacts)', () => {
    expect(JSON.stringify(home)).not.toContain('  ')
  })
})
