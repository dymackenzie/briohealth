import { describe, expect, it } from 'vitest'
import { home } from './home'
import { site } from '@/lib/site'

/** Spot checks against the wireframe (spec Appendix A) and its reading notes. */
describe('homepage content is the wireframe, verbatim', () => {
  it('hero', () => {
    expect(home.hero.heading).toBe('Transform Your Health, Regain Your Life:')
    expect(home.hero.sentence).toBe('A Natural Approach to Building Vitality and Increasing Energy')
    expect(home.hero.image.photo?.src.startsWith('/photos/stock/')).toBe(true)
    expect(home.hero.image.photo?.credit?.url).toContain('unsplash.com')
  })

  it('stakes', () => {
    expect(home.stakes.heading).toBe('Have you been frustrated with your level of health?')
    expect(home.stakes.questions).toEqual([
      'Do you feel tired all the time?',
      'Do you have digestive issues?',
      'Do you get sick easily?',
      'Do you experience brain fog or anxiety?',
    ])
    expect(home.stakes.paragraphs[0]).toBe(
      "At Brio Health, we don't focus on quick fixes that give you a temporary solution. That only leads to long term frustration.",
    )
    expect(home.stakes.paragraphs[1]).toBe(
      'We uncover the obstacles blocking your healing and guide you back to wellness. Our patients follow a customized road map empowering them to take control of their own health.',
    )
  })

  it('trust', () => {
    expect(home.trust.stats.map((s) => s.text)).toEqual([
      'Licensed Health Professionals',
      `Serving Richmond Since ${site.foundedYear}`,
      'Trusted by over 5,000 patients',
    ])
    expect(site.foundedYear).toBe(2006)
    expect(home.trust.badge.src).toBe('https://yourbriohealth.com/wp-content/uploads/2025/06/2025-best-of-richmond-logo.jpg')
    expect(home.trust.badgeHeading).toBe('Brio Health was voted in Richmond News’ “Best of Richmond 2025” in the category of Best Naturopath!')
    expect(home.trust.badgeThanks).toBe('Thank you, Richmond!')
  })

  it('plan', () => {
    expect(home.plan.heading).toBe("Here's How It Works")
    expect(home.plan.steps.map((s) => s.title)).toEqual([
      'Book An Appointment',
      'Build A Personal Health Plan',
      'Be Proud Of Your Health',
    ])
    expect(home.plan.steps[0].body).toBe(
      "Everyone's healing journey is unique. During the initial assessment, we carefully listen to you, and meet you where you are.",
    )
  })

  it('explanatory paragraph', () => {
    expect(home.explain.heading).toBe('At Brio Health we know you want to be healthy, vibrant and full of energy.')
    expect(home.explain.paragraphs[0]).toBe(
      'In order to be that way, you need a custom step-by-step plan that rebuilds your health from the inside out.',
    )
    expect(home.explain.stepsIntro).toBe('Here are the steps to transform your health:')
    expect(home.explain.steps.map((s) => s.title)).toEqual(['Assessment', 'Re-establish a Healthy Baseline', 'Cultivate & Optimize Vitality'])
    expect(home.explain.closing).toBe(
      'Book an appointment today, so you can stop feeling frustrated about your health and start believing you can be healthy, vibrant and full of energy again.',
    )
  })

  it('has no double spaces anywhere (wireframe typing artefacts)', () => {
    expect(JSON.stringify(home)).not.toContain('  ')
  })
})
