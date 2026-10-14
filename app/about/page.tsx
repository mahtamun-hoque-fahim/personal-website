

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
 * Cloudinary delivers a ready-made crop at the size we display: smart-cropped
 * around the subject (`g_auto`), compressed (`q_auto`), best format for the
 * browser (`f_auto`), instead of the raw upload. Other hosts pass through.
 */
function fitImage(url: string | null, width: number, height: number): string | null {
  if (!url) return null
  const marker = '/image/upload/'
  const i = url.indexOf(marker)
  if (i === -1) return url
  const at = i + marker.length
  return `${url.slice(0, at)}c_fill,g_auto,w_${width},h_${height},q_auto,f_auto/${url.slice(at)}`
}

/** Heading + paragraphs of one text block. */
function TextBlock({ heading, paragraphs }: { heading: string; paragraphs: string[] }) {
  return (
    <div>
      {heading && (
        <BlurWords
          as="h2"
          text={heading}
          className="text-3xl font-bold text-[#F3F6F4] mb-6"
          style={{ fontFamily: 'var(--font-clash)' }}
        />
      )}
      <div
        className="text-[#8A938E] leading-relaxed space-y-4 text-base"
        style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
      >
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}

/** One block of the 'beside' and 'text' layouts: image on the left (when there is one), text on the right. */
function BlockRow({
  image,
  alt,
  heading,
  paragraphs,
}: {
  image: string | null
  alt: string
  heading: string
  paragraphs: string[]
}) {
  return (
    <div
      className={cn(
        'grid gap-10 md:gap-16',
        image && 'md:grid-cols-[minmax(0,36.5fr)_minmax(0,63.5fr)] md:items-start'
      )}
    >
      {image && (
        <Reveal style={{ '--blur-from': '3px' } as CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={alt}
            width={900}
            height={900}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full rounded-xl object-cover"
          />
        </Reveal>
      )}
      <div className={image ? undefined : 'max-w-2xl'}>
        <TextBlock heading={heading} paragraphs={paragraphs} />
      </div>
    </div>
  )
}

export default async function AboutPage() {
  const about = await getCachedAboutContent()
  const hasExtraBlock = Boolean(about.extraHeading) || about.extraParagraphs.length > 0
  // 'beside' | 'text' | 'tall' (Admin > About > Layout); anything unexpected means 'beside'.
  const layout = about.layout === 'text' || about.layout === 'tall' ? about.layout : 'beside'
  const extraImage = layout === 'beside' ? fitImage(about.extraImageUrl, 900, 900) : null
  const storyImage = layout === 'beside' ? fitImage(about.storyImageUrl, 900, 900) : null
  // The tall layout needs its image; without one it falls back to text only.
  const tallImage = layout === 'tall' ? fitImage(about.tallImageUrl, 1200, 1600) : null

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
        {/* Three layouts, chosen in Admin > About (column split 36.5% / 63.5%):
            - beside (default): both blocks, image on the left, text on the right
            - text: no images, the two blocks stacked
            - tall: one tall image pinned on the left (sticky from md up) while the
              two text blocks scroll on the right
            The extra block hides while empty; images are optional in every layout. */}
        <section className="border-t border-[#333333]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            {tallImage ? (
              <div className="grid gap-10 md:gap-16 md:grid-cols-[minmax(0,36.5fr)_minmax(0,63.5fr)] md:items-start">
                <Reveal
                  className="md:sticky md:top-28"
                  style={{ '--blur-from': '3px' } as CSSProperties}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tallImage}
                    alt={about.extraHeading || about.storyHeading}
                    width={1200}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full rounded-xl object-cover md:aspect-[3/4] md:max-h-[calc(100vh-9rem)]"
                  />
                </Reveal>
                <div className="space-y-24">
                  {hasExtraBlock && (
                    <TextBlock heading={about.extraHeading} paragraphs={about.extraParagraphs} />
                  )}
                  <TextBlock heading={about.storyHeading} paragraphs={about.storyParagraphs} />
                </div>
              </div>
            ) : (
              <div className="space-y-24">
                {hasExtraBlock && (
                  <BlockRow
                    image={extraImage}
                    alt={about.extraHeading}
                    heading={about.extraHeading}
                    paragraphs={about.extraParagraphs}
                  />
                )}
                <BlockRow
                  image={storyImage}
                  alt={about.storyHeading}
                  heading={about.storyHeading}
                  paragraphs={about.storyParagraphs}
                />
              </div>
            )}
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
