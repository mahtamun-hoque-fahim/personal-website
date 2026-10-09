'use client'

import { useEffect, useRef } from 'react'

/**
 * MintGlow — fixed, full-page ambient light source.
 *
 * The colour is #444444 (see GLOW_RGB below; it was mint, rgb 61,244,154,
 * then light gray, and the component name predates both changes). To retint,
 * change that one constant and re-tune the alphas: on the #111111 page,
 * #444444 needs about 0.24 at the centre to give the same faint lift that
 * light gray gave at 0.06.
 *
 * A single large radial orb sits in the upper-right area of the
 * viewport. On scroll, it translates downward at 30% of the scroll
 * speed (parallax factor 0.3), so it lags behind the content and
 * gradually moves toward — then past — code blocks as the user reads.
 *
 * Because it's `position: fixed` and behind everything (`z-index: 0`),
 * code blocks with `backdrop-filter: blur` and a semi-transparent
 * background will visually "catch" the glow as it passes behind them,
 * creating the frosted-glass-over-ambient-light effect.
 *
 * Rendered in RootLayout so it appears on every page without any
 * per-page wiring.
 */
const GLOW_RGB = '68, 68, 68' // #444444

export default function MintGlow() {
  const orbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Parallax is pure decoration: skip it entirely for reduced-motion users.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const PARALLAX = 0.28 // glow moves at 28% of scroll speed

    let rafId: number
    let last = window.scrollY

    function onScroll() {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        const y = window.scrollY
        if (Math.abs(y - last) < 1) return
        last = y
        if (orbRef.current) {
          orbRef.current.style.transform = `translateY(${y * PARALLAX}px)`
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    >
      {/* Primary orb — upper-right, large and soft */}
      <div
        ref={orbRef}
        className="absolute will-change-transform"
        style={{
          top: '-10vh',
          right: '-5vw',
          width: 'clamp(500px, 60vw, 900px)',
          height: 'clamp(500px, 60vw, 900px)',
          background:
            `radial-gradient(circle, rgba(${GLOW_RGB},0.24) 0%, rgba(${GLOW_RGB},0.08) 45%, transparent 72%)`,
          borderRadius: '50%',
        }}
      />
      {/* Secondary echo — lower-left, much fainter, gives depth on long pages */}
      <div
        className="absolute"
        style={{
          bottom: '-20vh',
          left: '-10vw',
          width: 'clamp(300px, 40vw, 600px)',
          height: 'clamp(300px, 40vw, 600px)',
          background:
            `radial-gradient(circle, rgba(${GLOW_RGB},0.12) 0%, transparent 70%)`,
          borderRadius: '50%',
        }}
      />
    </div>
  )
}
