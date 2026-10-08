'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
  as?: ElementType
  className?: string
  /** Milliseconds to wait after the element enters view. */
  delay?: number
  style?: CSSProperties
  /**
   * Set false when a child animates instead (BlurWords): the wrapper
   * then only reports "in view" and is not blurred itself.
   */
  blurSelf?: boolean
  children: ReactNode
}

/**
 * Scroll-triggered fade + blur reveal.
 *
 * The hidden state lives in CSS (`.blur-reveal`, only under
 * `@media (scripting: enabled)`), so content stays visible without JS.
 * One IntersectionObserver per element sets `data-revealed` once and
 * then stops observing: the reveal plays a single time per page view.
 * The attribute is set on the DOM node directly, not through React
 * state, so revealing never re-renders anything.
 */
export default function Reveal({
  as: Tag = 'div',
  className,
  delay = 0,
  style,
  blurSelf = true,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      el.dataset.revealed = 'true'
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).dataset.revealed = 'true'
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const Component = Tag as ElementType

  return (
    <Component
      ref={ref}
      className={cn(blurSelf && 'blur-reveal', className)}
      style={{ '--reveal-delay': `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </Component>
  )
}
