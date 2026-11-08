/**
 * Parts that are built but switched off. The components, pages and API
 * routes stay as they are, so turning one back on is this flag and nothing
 * else.
 */
export const features = {
  /**
   * The Contact page form and the Pickleball lesson enquiry (2026-10-06).
   * Before turning it on, set CONTACT_FROM to an address on a domain
   * verified in Resend, or every enquiry is lost.
   */
  contactForm: false,
  /** The footer signup, while the clinic moves from Mailchimp to Cyberimpact (2026-10-06). */
  newsletter: false,
  /** The Pickleball page: a 404, out of the footer and the sitemap (2026-10-07). */
  pickleball: false,
  /** The homepage hero: the wireframe's full-width photo, or false for the herb garden (2026-11-07). */
  heroPhoto: true,
  /** Flowers on selected text: on under `yarn dev`, off in production builds until it's signed off (2026-11-07). */
  selectionFlowers: process.env.NODE_ENV === 'development',
}
