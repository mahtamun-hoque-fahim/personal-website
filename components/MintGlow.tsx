'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * MintGlow: fixed, full-page ambient light source (the name predates the
 * colour changes: it was mint, then light gray, and is now #444444).
 *
 * One soft orb, behind everything (`z-index: 0`), so code blocks with
 * `backdrop-filter: blur` visibly "catch" it as it passes behind them.
 *
 * Roaming
 * - On load the orb is placed behind the hero portrait (the element marked
 *   `data-glow-anchor`, see HeroPortrait), fades in, rests there for 3
 *   seconds, then starts to roam: every 16-26 seconds it eases to a new random
 *   point in the viewport, at least ~30% of the screen diagonal away so every
 *   move is perceptible. Pages without a portrait start from the resting
 *   position in the upper right instead.
 * - The component lives in RootLayout, so it survives client navigation and
 *   keeps roaming from page to page. Navigating TO a page that has the
 *   portrait (the homepage) glides it back behind the portrait, rests 3
 *   seconds, and roams again.
 * - Reduced motion: no roaming and no glide; the orb just sits at its start
 *   position. New legs are not scheduled while the tab is hidden.
 *
 * Performance: the only animated property is `transform` (compositor-only),
 * from a handful of timers per minute. Scroll parallax is a second, separate
 * `transform` on a zero-size wrapper so the two never fight.
 *
 * Softness: the gradient is a smooth Gaussian-style falloff (many stops, no
 * hard edge), not a linear fade clipped by a border radius, which is what
 * makes it read as more blurred than before.
 *
 * Rendered in RootLayout so it appears on every page without per-page wiring.
 */
const GLOW_RGB = '68, 68, 68' // #444444
const GLOW_PEAK = 0.22 // alpha at the centre
const GLOW_SIZE = 'clamp(560px, 66vw, 980px)'

const HOLD_MS = 3000 // rest behind the portrait before the first move
const GLIDE_MS = 2200 // glide back to the portrait on navigation
const FADE_IN_MS = 1400
const ROAM_MIN_MS = 16000
const ROAM_SPAN_MS = 10000
const ROAM_EASE = 'cubic-bezier(0.45, 0.05, 0.55, 0.95)'
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
  const positionRef = useRef<Point | null>(null)

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

  // Placement and roaming. Re-runs on navigation (see header comment).
  useEffect(() => {
    const orb = orbRef.current
    if (!orb) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timers: number[] = []

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
      return { x: window.innerWidth + 0.05 * window.innerWidth - size / 2, y: -0.1 * window.innerHeight + size / 2 }
    }

    function moveTo(p: Point, durationMs: number) {
      const size = orb!.offsetWidth
      orb!.style.transition =
        durationMs > 0
          ? `opacity ${FADE_IN_MS}ms ease-out, transform ${durationMs}ms ${ROAM_EASE}`
          : `opacity ${FADE_IN_MS}ms ease-out`
      orb!.style.transform = `translate3d(${Math.round(p.x - size / 2)}px, ${Math.round(
        p.y - size / 2 - parallaxOffset()
      )}px, 0)`
      positionRef.current = p
    }

    function pickTarget(from: Point): Point {
      const w = window.innerWidth
      const h = window.innerHeight
      const minDistance = Math.hypot(w, h) * 0.3
      for (let i = 0; i < 8; i++) {
        const p = { x: w * (0.08 + Math.random() * 0.9), y: h * (0.05 + Math.random() * 0.9) }
        if (Math.hypot(p.x - from.x, p.y - from.y) >= minDistance) return p
      }
      return { x: w * 0.5, y: h * 0.5 }
    }

    function roam() {
      if (document.hidden) {
        timers.push(window.setTimeout(roam, 1000))
        return
      }
      const from = positionRef.current ?? defaultPoint()
      const duration = ROAM_MIN_MS + Math.random() * ROAM_SPAN_MS
      moveTo(pickTarget(from), Math.round(duration))
      timers.push(window.setTimeout(roam, duration))
    }

    const first = !readyRef.current
    const anchor = findAnchor()

    if (first) {
      // Instant placement while still invisible, then fade in.
      moveTo(anchor ?? defaultPoint(), 0)
      void orb.offsetWidth // commit the position before the fade starts
      orb.dataset.ready = 'true'
      readyRef.current = true
    } else if (anchor) {
      // Navigated to a page with the portrait: glide back behind it.
      moveTo(anchor, reduced ? 0 : GLIDE_MS)
    }

    if (!reduced) {
      const delay = first || anchor ? HOLD_MS : 0
      timers.push(window.setTimeout(roam, delay))
    }

    return () => timers.forEach((t) => window.clearTimeout(t))
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
