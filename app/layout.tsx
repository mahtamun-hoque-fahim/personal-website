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
    url: 'https://mahtamunhoquefahim.pages.dev',
    siteName: 'Mahtamun Hoque Fahim',
    title: 'Mahtamun Hoque Fahim — Designer & Developer',
    description: 'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahtamun Hoque Fahim',
    description: 'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh.',
  },
  verification: {
    google: '8PIgBrmXnVMSgvDYawTHZ__GpsAuaihf-ZrNx2hfMoA',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Mahtamun Hoque Fahim',
              url: 'https://mahtamunhoquefahim.pages.dev',
              jobTitle: 'Graphic Designer & Full-Stack Developer',
              description: 'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh.',
              nationality: 'Bangladeshi',
              sameAs: [
                'https://github.com/mahtamun-hoque-fahim',
                'https://linkedin.com/in/mahtamun-hoque-fahim',
              ],
              knowsAbout: ['Graphic Design', 'UI/UX Design', 'Next.js', 'React', 'TypeScript', 'Brand Identity'],
            }),
          }}
        />
        {children}
      </body>
    </html>
  )
}
