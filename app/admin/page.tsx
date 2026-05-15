import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth-utils'
import {
  getBlogPosts,
  getContactMessages,
} from '@/lib/db/queries'

async function getStats() {
  const [posts, messages] = await Promise.all([
    getBlogPosts(),
    getContactMessages(),
  ])

  return {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.published).length,
    totalMessages: messages.length,
    unreadMessages: messages.filter((m) => !m.read).length,
  }
}

export default async function AdminDashboard() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/admin/login')

  const stats = await getStats()

  const cards = [
    {
      label: 'Total posts',
      value: stats.totalPosts,
      sub: `${stats.publishedPosts} published`,
      href: '/admin/posts',
      accent: false,
    },
    {
      label: 'Contact messages',
      value: stats.totalMessages,
      sub: `${stats.unreadMessages} unread`,
      href: '/admin/messages',
      accent: stats.unreadMessages > 0,
    },
  ]

  const quickLinks = [
    { label: 'New blog post', href: '/admin/posts/new' },
    { label: 'Manage posts', href: '/admin/posts' },
    { label: 'Manage projects', href: '/admin/projects' },
    { label: 'Read messages', href: '/admin/messages' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1
          className="text-4xl font-bold text-[#f0ede6] mb-2"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Dashboard
        </h1>
        <p
          className="text-[#8a8a8a] text-sm"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          Manage posts, projects, and messages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`block bg-[#141414] border rounded-xl p-6 transition-colors ${
              card.accent
                ? 'border-[#00e676]/30 hover:border-[#00e676]/60'
                : 'border-[#1f1f1f] hover:border-[#2a2a2a]'
            }`}
          >
            <p
              className="text-[#8a8a8a] text-xs tracking-widest uppercase mb-3"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {card.label}
            </p>
            <p
              className="text-4xl font-bold text-[#f0ede6] mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {card.value}
            </p>
            <p
              className={`text-xs ${card.accent ? 'text-[#00e676]' : 'text-[#8a8a8a]'}`}
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              {card.sub}
            </p>
          </Link>
        ))}
      </div>

      <h2
        className="text-2xl font-bold text-[#f0ede6] mb-6"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Quick actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between bg-[#141414] border border-[#1f1f1f] rounded-lg px-5 py-4 hover:border-[#00e676]/30 transition-colors group"
          >
            <span
              className="text-[#f0ede6] text-sm font-medium"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              {link.label}
            </span>
            <span className="text-[#8a8a8a] group-hover:text-[#00e676] transition-colors">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
