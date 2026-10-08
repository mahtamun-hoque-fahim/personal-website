'use client'

import { usePathname } from 'next/navigation'

/**
 * Route enter transition. Unlike layout.tsx, a template remounts on every
 * navigation, so the CSS animation replays for each page.
 *
 * Enter-only on purpose: the App Router unmounts the old page before the
 * new one mounts, so an exit animation would need a router-freezing hack.
 * A short fade in turns the hard cut into a soft one without that risk.
 * It is opacity only (no transform or filter), so it never creates a
 * containing block for the fixed navbar. /admin is skipped: it is a
 * high-frequency tool where motion only adds delay.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return <>{children}</>
  return <div className="route-enter">{children}</div>
}
