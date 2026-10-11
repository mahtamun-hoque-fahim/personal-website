'use client'

import { useLayoutEffect, useRef } from 'react'

type MarqueeStripProps = {
  items: string[]
  /** Scroll speed in pixels per second (Settings > Strip speed). */
  speed: number
}

// Used for the server-rendered first frame only, until the real width is
// measured on the client (about the width of one item incl. separator).
const ESTIMATED_ITEM_PX = 190

/**
 * The one marquee strip used on every page (homepage skills, /projects
 * technologies): same band (`#222222`, `#333333` lines), same speed.
 *
 * - Speed is in pixels per second, so a long list and a short one move at the
 *   same pace. The animation duration is derived from the measured width of
 *   one copy of the list (`distance / speed`) and re-derived if the width
 *   changes (fonts loading, window resize).
 * - Seamless loop: the list is rendered twice and the track slides by exactly
 *   half its width (`animate-marquee`, 0% to -50%). For that to be exact the
 *   spacing lives INSIDE each item (no flex `gap`), and the track is `w-max`:
 *   `translateX(-50%)` is half the track's own width.
 * - The second copy is aria-hidden. Pauses on hover. Reduced motion is
 *   handled globally (animation collapses, the strip rests).
 */
export default function MarqueeStrip({ items, speed }: MarqueeStripProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pxPerSecond = Math.min(Math.max(Number(speed) || 60, 5), 400)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const apply = () => {
      const distance = track.scrollWidth / 2 // one copy of the list
      if (distance > 0) {
        track.style.animationDuration = `${(distance / pxPerSecond).toFixed(2)}s`
      }
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(track)
    return () => observer.disconnect()
  }, [pxPerSecond, items])

  if (items.length === 0) return null

  const track = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-[#333333] bg-[#222222] py-4">
      <div
        ref={trackRef}
        className="flex w-max animate-marquee whitespace-nowrap hover:[animation-play-state:paused]"
        style={{ animationDuration: `${((items.length * ESTIMATED_ITEM_PX) / pxPerSecond).toFixed(2)}s` }}
      >
        {track.map((name, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length ? true : undefined}
            className="shrink-0 text-sm uppercase tracking-widest"
            style={{
              fontFamily: 'var(--font-jakarta)',
              color: i % 3 === 0 ? '#3DF49A' : '#8A938E',
            }}
          >
            {name}
            <span className="mx-12 text-[#333333]" aria-hidden="true">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
