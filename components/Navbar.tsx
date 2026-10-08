'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Logo from '@/components/Logo'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/credentials', label: 'Credentials' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll() // correct state on load/restore (e.g. reload mid-page)
    // passive: tells the browser this handler never blocks scrolling.
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the full-screen menu is open: Esc closes it, and the page
  // behind it does not scroll.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  // Don't show on admin pages
  if (pathname.startsWith('/admin')) return null

  return (
    <>
      {/* Floating pill nav: inset from the top (and sides) at every width —
          never flush against the viewport edge, mobile or desktop. Scroll
          only deepens the background/shadow for legibility; the shape
          itself doesn't change. */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
        <div
          className={cn(
            'max-w-6xl mx-auto rounded-full border border-[#1F2421] backdrop-blur-md px-5 sm:px-6 py-3 flex items-center justify-between transition-[background-color,box-shadow] duration-300',
            scrolled
              ? 'bg-[#0A0C0B]/70 shadow-lg shadow-black/40'
              : 'bg-[#0A0C0B]/40'
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="group inline-flex items-center"
            aria-label="Mahtamun — home"
          >
            <Logo height={32} className="transition-opacity group-hover:opacity-80" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm tracking-wide transition-colors duration-200 relative group',
                  pathname === link.href
                    ? 'text-[#3DF49A]'
                    : 'text-[#8A938E] hover:text-[#F3F6F4]'
                )}
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute -bottom-1 left-0 w-full h-px origin-left transition-transform duration-300 ease-ui-out',
                    pathname === link.href
                      ? 'bg-[#3DF49A] scale-x-100'
                      : 'bg-[#8A938E] scale-x-0 group-hover:scale-x-100'
                  )}
                />
              </Link>
            ))}

          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={cn(
                'block w-6 h-0.5 rounded-full bg-[#F3F6F4] transition-[transform,opacity] duration-300 ease-ui-in-out',
                menuOpen && 'rotate-45 translate-y-2'
              )}
            />
            <span
              className={cn(
                'block w-6 h-0.5 rounded-full bg-[#F3F6F4] transition-[transform,opacity] duration-300 ease-ui-in-out',
                menuOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'block w-6 h-0.5 rounded-full bg-[#F3F6F4] transition-[transform,opacity] duration-300 ease-ui-in-out',
                menuOpen && '-rotate-45 -translate-y-2'
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-0 z-40 bg-[#070807] flex flex-col justify-center items-center gap-10 transition-[opacity,visibility] duration-300',
          // invisible (not just transparent) so closed links leave the tab order
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={cn(
              'text-4xl font-display font-bold transition-[opacity,transform,filter,color] duration-500 ease-ui-out',
              pathname === link.href ? 'text-[#3DF49A]' : 'text-[#F3F6F4]',
              menuOpen
                ? 'opacity-100 translate-y-0 blur-0'
                : 'opacity-0 translate-y-3 blur-[6px]'
            )}
            style={{
              fontFamily: 'var(--font-clash)',
              // stagger only on the way in; closing is immediate
              transitionDelay: menuOpen ? `${80 + i * 50}ms` : '0ms',
            }}
          >
            {link.label}
          </Link>
        ))}

      </div>
    </>
  )
}
