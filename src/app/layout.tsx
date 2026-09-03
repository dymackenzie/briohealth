import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk } from 'next/font/google'
import './globals.css'
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd'
import { Analytics } from '@vercel/analytics/next'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
  weight: 'variable',
})

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Brio Health | Integrative Health Clinic in Richmond BC',
  description: 'Naturopathic medicine, acupuncture, IV therapy, laser, and massage in Richmond BC. Book with Dr. Jeffrey Lee.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable}`}>
      <body>
        <LocalBusinessJsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
