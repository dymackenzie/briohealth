import type { Metadata } from 'next'
import { Funnel_Display, Funnel_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

/* Both are variable fonts on Google Fonts, so no weight list is needed. */
const display = Funnel_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-funnel-display',
})

const sans = Funnel_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-funnel-sans',
})

export const metadata: Metadata = {
  title: 'Brio Health',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script adds a class before React hydrates, so server and
    // client markup differ here on purpose.
    <html lang="en-CA" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Gates every hidden-until-revealed state. Inline and synchronous so
            nothing flashes; with no JavaScript the class never lands and the
            page renders complete. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
