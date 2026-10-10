

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getCachedAboutContent } from '@/lib/db/queries'
import BlurWords from '@/components/BlurWords'
import Reveal from '@/components/Reveal'
import { cn } from '@/lib/utils'
import type { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: 'About',
  description: 'The story of Mahtamun Hoque Fahim — designer, developer, and creative from Bangladesh.',
  alternates: {
    canonical: 'https://mahtamunhoquefahim.vercel.app/about',
  },
}

/**
 * Cloudinary delivers a ready-made square: 900px, smart-cropped around the
 * subject (`g_auto`), compressed (`q_auto`) and in the best format for the
 * browser (`f_auto`), instead of the raw upload. Other hosts pass through.
 */
function squareImage(url: string | null): string | null {
  if (!url) return null
  const marker = '/image/upload/'
  const i = url.indexOf(marker)
  if (i === -1) return url
  const at = i + marker.length
  return `${url.slice(0, at)}c_fill,g_auto,w_900,h_900,q_auto,f_auto/${url.slice(at)}`
}

export default async function AboutPage() {
  const about = await getCachedAboutContent()
  const hasExtraBlock = Boolean(about.extraHeading) || about.extraParagraphs.length > 0
  const extraImage = squareImage(about.extraImageUrl)
  const storyImage = squareImage(about.storyImageUrl)

  return (
    <>
      <Navbar />
      <main className="pt-32">

        {/* ── HEADER ── */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <p
            className="text-[#3DF49A] text-xs tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            About
          </p>
          <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight text-[#F3F6F4] mb-10" style={{ fontFamily: 'var(--font-clash)' }}>
            <BlurWords text={about.headlineTop} mode="load" className="block" />
            <BlurWords text={about.headlineAccent} mode="load" delay={140} className="block text-[#3DF49A]" />
          </h1>
          <p
            className="blur-load text-[#8A938E] text-xl max-w-2xl leading-relaxed"
            style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300, '--reveal-delay': '220ms' } as CSSProperties}
          >
            {about.intro}
          </p>
        </section>

        {/* ── EXTRA BLOCK + STORY ── */}
        {/* Wireframe: extra block = image left, text right; story = text left, image right.
            Column split is 36.5% image / 63.5% text. No cell borders (they were only
            there to explain the layout). The extra block hides while empty, and either
            image is optional: without one the text simply takes the full width. */}
        <section className="border-t border-[#333333]">
          <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
            {hasExtraBlock && (
              <div
                className={cn(
                  'grid gap-10 md:gap-16',
                  extraImage && 'md:grid-cols-[minmax(0,36.5fr)_minmax(0,63.5fr)] md:items-start'
                )}
              >
                {extraImage && (
                  <Reveal style={{ '--blur-from': '3px' } as CSSProperties}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={extraImage}
                      alt={about.extraHeading}
                      width={900}
                      height={900}
                      loading="lazy"
                      decoding="async"
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  </Reveal>
                )}
                <div className={extraImage ? undefined : 'max-w-2xl'}>
                  {about.extraHeading && (
                    <BlurWords as="h2" text={about.extraHeading} className="text-3xl font-bold text-[#F3F6F4] mb-6" style={{ fontFamily: 'var(--font-clash)' }} />
                  )}
                  <div
                    className="text-[#8A938E] leading-relaxed space-y-4 text-base"
                    style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
                  >
                    {about.extraParagraphs.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div
              className={cn(
                'grid gap-10 md:gap-16',
                storyImage && 'md:grid-cols-[minmax(0,63.5fr)_minmax(0,36.5fr)] md:items-start'
              )}
            >
              <div className={storyImage ? undefined : 'max-w-2xl'}>
                <BlurWords as="h2" text={about.storyHeading} className="text-3xl font-bold text-[#F3F6F4] mb-6" style={{ fontFamily: 'var(--font-clash)' }} />
                <div
                  className="text-[#8A938E] leading-relaxed space-y-4 text-base"
                  style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
                >
                  {about.storyParagraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
              {storyImage && (
                <Reveal style={{ '--blur-from': '3px' } as CSSProperties}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={storyImage}
                    alt={about.storyHeading}
                    width={900}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                </Reveal>
              )}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border border-[#333333] rounded-xl p-8">
            <div>
              <h3
                className="text-2xl font-bold text-[#F3F6F4] mb-1"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                {about.ctaHeading}
              </h3>
              <p
                className="text-[#8A938E] text-sm"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {about.ctaText}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">
              <Link
                href="/contact"
                className="w-full sm:w-auto text-center px-6 py-2.5 bg-[#3DF49A] text-[#06160E] text-sm font-semibold rounded-full
                           hover:bg-[#5BFBA8] transition-[background-color,transform] duration-200 active:scale-[0.97]"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {about.ctaPrimaryLabel}
              </Link>
              <a
                href="https://mahtamundesigns.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-6 py-2.5 border border-[#333333] text-[#F3F6F4] text-sm rounded-full
                           hover:border-[#8A938E] transition-[border-color,color,transform] duration-200 active:scale-[0.97]"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {about.ctaSecondaryLabel} ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
