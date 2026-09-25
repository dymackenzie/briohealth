import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import { siteOpenGraph } from '@/lib/seo'
import { site } from '@/lib/site'
import './globals.css'

/**
 * Display — h1, h2, pull quotes and big numerals, nothing smaller. SOFT and
 * WONK made the headings read as a third typeface, so only optical size stays.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  weight: 'variable',
  axes: ['opsz'],
})

/** Everything else, h3 down. High x-height, which matters now body is 18px. */
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hanken',
  weight: 'variable',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    'Integrative and naturopathic care in Richmond, BC. Custom treatment plans that target root causes, not symptoms.',
  openGraph: { ...siteOpenGraph, type: 'website' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The inline script adds a class before React hydrates, so server and
    // client markup differ here on purpose.
    <html
      lang="en-CA"
      className={`${fraunces.variable} ${hanken.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Gates the scroll reveals. Has to be inline and synchronous —
            deferring it flashes content in and then hides it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-paper focus:px-4 focus:py-2 focus:text-ink-900"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
