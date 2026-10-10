'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * MintGlow: fixed, full-page ambient light source (the name predates the
 * colour changes: it was mint, then light gray, and is now #444444).
 *
 * ONE soft orb, behind everything (`z-index: 0`), so code blocks with
 * `backdrop-filter: blur` visibly "catch" it. Its softness is fixed: a smooth
 * Gaussian-style falloff (many stops, no hard edge). Nothing about it varies
 * over time.
 *
 * Position
 * - On pages that have the hero portrait (the element marked
 *   `data-glow-anchor`, see HeroPortrait) it is centred behind it, biased
 *   toward the face and shoulders. It is measured on load, on resize, and
 *   when you navigate, so it stays behind the portrait at any screen width.
 * - On other pages it sits where it always lived: upper right.
 * - It fades in once placed, so it never flashes at the wrong spot; changing
 *   page glides it to its new position instead of jumping.
 * - Scroll parallax: it follows scroll at 28% speed (skipped for reduced
 *   motion). The parallax is a second, separate `transform` on a zero-size
 *   wrapper so the two never fight.
 * - Without JS it shows at the upper-right default.
 *
 * (Earlier versions roamed around the background, or drifted in softness;
 * the roaming one is in git history on this branch at 14cec60.)
 *
 * Rendered in RootLayout so it appears on every page without per-page wiring.
 */
const GLOW_RGB = '68, 68, 68' // #444444
const GLOW_PEAK = 0.22 // alpha at the centre; raise for a stronger glow
const GLOW_SIZE = 'clamp(560px, 66vw, 980px)'

const GLIDE_MS = 1200 // move between pages with / without the portrait
const FADE_IN_MS = 1400
const PARALLAX = 0.28 // orb follows scroll at 28% speed

// Smooth falloff, precomputed once: alpha = peak * exp(-(r / 0.5)^2).
const GLOW_GRADIENT = (() => {
  const stops: string[] = []
  for (let i = 0; i <= 10; i++) {
    const r = i / 10
    const a = GLOW_PEAK * Math.exp(-Math.pow(r / 0.5, 2))
    stops.push(`rgba(${GLOW_RGB},${a.toFixed(4)}) ${i * 10}%`)
  }
  return `radial-gradient(closest-side, ${stops.join(', ')}, transparent 100%)`
})()

type Point = { x: number; y: number }

export default function MintGlow() {
  const pathname = usePathname()
  const parallaxRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const readyRef = useRef(false)

  // Scroll parallax (decoration: skipped for reduced motion).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId = 0
    let last = -1

    function apply() {
      rafId = 0
      const y = window.scrollY
      if (Math.abs(y - last) < 1) return
      last = y
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(0, ${y * PARALLAX}px, 0)`
      }
    }
    function onScroll() {
      if (!rafId) rafId = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Placement: on load, on every navigation, and on resize.
  useEffect(() => {
    const orb = orbRef.current
    if (!orb) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function parallaxOffset() {
      return reduced ? 0 : window.scrollY * PARALLAX
    }

    // The centre of the portrait, biased toward the face and shoulders.
    function findAnchor(): Point | null {
      const el = document.querySelector('[data-glow-anchor]')
      if (!el) return null
      const r = el.getBoundingClientRect()
      if (r.width < 8 || r.height < 8) return null // hidden (phones)
      const p = { x: r.left + r.width / 2, y: r.top + r.height * 0.38 }
      // Scrolled away (reload mid-page): behind a portrait nobody can see.
      if (p.y < 0 || p.y > window.innerHeight) return null
      return p
    }

    // Where the orb rests when there is no portrait: upper right, as before.
    function defaultPoint(): Point {
      const size = orb!.offsetWidth
      return {
        x: window.innerWidth + 0.05 * window.innerWidth - size / 2,
        y: -0.1 * window.innerHeight + size / 2,
      }
    }

    function place(durationMs: number) {
      const p = findAnchor() ?? defaultPoint()
      const size = orb!.offsetWidth
      orb!.style.transition =
        durationMs > 0
          ? `opacity ${FADE_IN_MS}ms ease-out, transform ${durationMs}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`
          : `opacity ${FADE_IN_MS}ms ease-out`
      orb!.style.transform = `translate3d(${Math.round(p.x - size / 2)}px, ${Math.round(
        p.y - size / 2 - parallaxOffset()
      )}px, 0)`
    }

    if (!readyRef.current) {
      // Instant placement while still invisible, then fade in.
      place(0)
      void orb.offsetWidth // commit the position before the fade starts
      orb.dataset.ready = 'true'
      readyRef.current = true
    } else {
      place(reduced ? 0 : GLIDE_MS)
    }

    // Keep it behind the portrait when the window changes size.
    let rafId = 0
    function onResize() {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        place(0)
      })
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [pathname])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    >
      {/* Zero-size origin that carries the scroll parallax. */}
      <div
        ref={parallaxRef}
        className="absolute left-0 top-0 h-0 w-0 will-change-transform"
      >
        <div
          ref={orbRef}
          className="glow-orb absolute left-0 top-0 will-change-transform"
          style={{
            width: GLOW_SIZE,
            height: GLOW_SIZE,
            background: GLOW_GRADIENT,
            // Start position until JS takes over (also what no-JS visitors
            // see): upper right, where the orb used to live.
            transform: `translate3d(calc(105vw - ${GLOW_SIZE}), -10vh, 0)`,
          }}
        />
      </div>
    </div>
  )
}
