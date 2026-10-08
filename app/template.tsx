'use client'

import { useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// The hero entrance is released once the page is this close to the top.
// Slightly early on purpose: smooth scroll decelerates, so starting at 24px
// makes the animation begin as you arrive instead of after you have stopped.
const RELEASE_AT_PX = 24
// Safety net: never keep the hero hidden longer than this (manual scroll,
// #anchor navigation, a scroll that stalls).
const MAX_WAIT_MS = 2000

/**
 * Route enter transition. Unlike layout.tsx, a template remounts on every
 * navigation, so the CSS animation replays for each page.
 *
 * Enter-only on purpose: the App Router unmounts the old page before the
 * new one mounts, so an exit animation would need a router-freezing hack.
 * A short fade in turns the hard cut into a soft one without that risk.
 * The fade is applied to <main> and <footer> through CSS (`.route-enter >`),
 * never to this wrapper: the navbar sits inside it and uses
 * `backdrop-filter`, which stops working when an ancestor animates opacity.
 * /admin is skipped: it is a high-frequency tool where motion only adds delay.
 *
 * Arrival gate: the site has `scroll-behavior: smooth`, so after a link click
 * from far down a page, Next scrolls to the top smoothly while the new page's
 * timer-based hero entrance (`.blur-load`, `BlurWords mode="load"`) has
 * already started and finishes before you get there. If the page mounts
 * scrolled down, `data-await-top` pauses those animations (see globals.css)
 * until the scroll arrives near the top. At the top on mount (first visit,
 * or a click from the top of a page) nothing is gated, so first paint never
 * waits for JavaScript.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || window.scrollY <= RELEASE_AT_PX) return

    // Layout effects run before the browser's first style pass, so the
    // animations are paused before they can show a single frame.
    el.dataset.awaitTop = 'true'

    let timer = 0
    const release = () => {
      delete el.dataset.awaitTop
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => {
      if (window.scrollY <= RELEASE_AT_PX) release()
    }
    timer = window.setTimeout(release, MAX_WAIT_MS)
    window.addEventListener('scroll', onScroll, { passive: true })
    return release
  }, [])

  if (pathname.startsWith('/admin')) return <>{children}</>
  return (
    <div ref={ref} className="route-enter">
      {children}
    </div>
  )
}
