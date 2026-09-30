import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Brio Health',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body>{children}</body>
    </html>
  )
}
