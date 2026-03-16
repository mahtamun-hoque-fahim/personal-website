export const runtime = 'edge'

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Mahtamun Hoque Fahim — Designer & Developer',
    template: '%s | Fahim',
  },
  description:
    'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh. Crafting intentional digital experiences.',
  keywords: ['designer', 'developer', 'Bangladesh', 'UI/UX', 'graphic design', 'fullstack'],
  authors: [{ name: 'Mahtamun Hoque Fahim' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fahim.dev',
    siteName: 'Mahtamun Hoque Fahim',
    title: 'Mahtamun Hoque Fahim — Designer & Developer',
    description: 'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahtamun Hoque Fahim',
    description: 'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Onest:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Onest', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
