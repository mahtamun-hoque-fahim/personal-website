'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Don't show on admin pages
  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'py-3 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#1f1f1f]'
            : 'py-6'
        )}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-800 text-xl tracking-tight group"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
          >
            <span className="text-[#f0ede6]">fahim</span>
            <span className="text-[#00e676]">.</span>
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
                    ? 'text-[#00e676]'
                    : 'text-[#8a8a8a] hover:text-[#f0ede6]'
                )}
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-[#00e676]" />
                )}
              </Link>
            ))}
            <a
              href="https://mahtamundesigns.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-1.5 border border-[#00e676] text-[#00e676] rounded-full
                         hover:bg-[#00e676] hover:text-black transition-all duration-200"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Portfolio ↗
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                'block w-6 h-0.5 bg-[#f0ede6] transition-all duration-300',
                menuOpen && 'rotate-45 translate-y-2'
              )}
            />
            <span
              className={cn(
                'block w-6 h-0.5 bg-[#f0ede6] transition-all duration-300',
                menuOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'block w-6 h-0.5 bg-[#f0ede6] transition-all duration-300',
                menuOpen && '-rotate-45 -translate-y-2'
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-center items-center gap-10 transition-all duration-500',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={cn(
              'text-4xl font-display font-bold transition-colors duration-200',
              pathname === link.href ? 'text-[#00e676]' : 'text-[#f0ede6]'
            )}
            style={{
              fontFamily: "'Syne', sans-serif",
              animationDelay: `${i * 80}ms`,
            }}
          >
            {link.label}
          </Link>
        ))}
        <a
          href="https://mahtamundesigns.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00e676] text-lg"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          Portfolio ↗
        </a>
      </div>
    </>
  )
}
