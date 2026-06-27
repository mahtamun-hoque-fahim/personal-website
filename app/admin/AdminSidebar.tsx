'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronLeft,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  ScrollText,
} from 'lucide-react'
import { logoutAction } from './actions'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/posts', label: 'Posts', icon: ScrollText },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-60 border-r border-[#1f1f1f] bg-[#0a0a0a] flex flex-col">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-[#1f1f1f]">
        <Link href="/admin" className="flex items-center gap-2">
          <span
            className="text-xl font-bold text-[#f0ede6]"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Admin
          </span>
          <span className="text-xl font-bold text-[#00e676] leading-none">.</span>
        </Link>
        <p
          className="text-[10px] uppercase tracking-widest text-[#5a5a5a] mt-1"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          fahim. portfolio
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p
          className="px-3 mb-2 text-[10px] uppercase tracking-widest text-[#5a5a5a]"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          Manage
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-[#00e676]/10 text-[#00e676]'
                      : 'text-[#8a8a8a] hover:text-[#f0ede6] hover:bg-[#141414]'
                  }`}
                  style={{ fontFamily: 'var(--font-onest)' }}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#1f1f1f] space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#8a8a8a] hover:text-[#f0ede6] hover:bg-[#141414] transition-colors"
          style={{ fontFamily: 'var(--font-onest)' }}
        >
          <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={2} />
          <span>Back to site</span>
          <ExternalLink className="h-3 w-3 ml-auto opacity-60" strokeWidth={2} />
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#8a8a8a] hover:text-red-400 hover:bg-red-500/5 transition-colors"
            style={{ fontFamily: 'var(--font-onest)' }}
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
