

import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Mahtamun Hoque Fahim — Designer & Developer',
    template: '%s | Mahtamun',
  },
  description:
    'Graphic designer, full-stack web developer, and UI/UX designer from Bangladesh. Crafting intentional digital experiences.',
  keywords: ['designer', 'developer', 'Bangladesh', 'UI/UX', 'graphic design', 'fullstack','mahtamun','mahtamun hoque fahim'],
  authors: [{ name: 'Mahtamun Hoque Fahim' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mahtamunhoquefahim.vercel.app',
    siteName: 'Mahtamun Hoque Fahim',
    title: 'Mahtamun Hoque Fahim — Senior Designer & Full Stack Developer',
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
      </head>
      <body style={{ fontFamily: 'var(--font-jakarta)' }}>
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
              knowsAbout: ['Graphic Design', 'UI/UX Design', 'Next.js', 'React', 'TypeScript', 'Brand Identity','web development'],
            }),
          }}
        />
        {children}
      </body>
    </html>
  )
}
