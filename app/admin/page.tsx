export const runtime = 'edge'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_COOKIE = 'fahim_admin_session'

async function getStats() {
  const [postsRes, messagesRes] = await Promise.all([
    supabase.from('blog_posts').select('id, published', { count: 'exact' }),
    supabase.from('contact_messages').select('id, read', { count: 'exact' }),
  ])

  const posts = postsRes.data || []
  const messages = messagesRes.data || []

  return {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.published).length,
    totalMessages: messages.length,
    unreadMessages: messages.filter((m) => !m.read).length,
  }
}

export default async function AdminDashboard() {
  const cookieStore = cookies()
  const session = cookieStore.get(ADMIN_COOKIE)
  if (session?.value !== 'authenticated') redirect('/admin/login')

  const stats = await getStats()

  const cards = [
    { label: 'Total Posts', value: stats.totalPosts, sub: `${stats.publishedPosts} published`, href: '/admin/posts', accent: false },
    { label: 'Contact Messages', value: stats.totalMessages, sub: `${stats.unreadMessages} unread`, href: '/admin/messages', accent: stats.unreadMessages > 0 },
  ]

  const quickLinks = [
    { label: 'New blog post', href: '/admin/posts/new', icon: '✍️' },
    { label: 'Manage posts', href: '/admin/posts', icon: '📝' },
    { label: 'Read messages', href: '/admin/messages', icon: '📬' },
    { label: 'View live site', href: '/', icon: '🌐' },
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
          Welcome back, Fahim.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 hover:border-[#00e676]/40 transition-colors group"
          >
            <p
              className="text-4xl font-bold mb-1 group-hover:text-[#00e676] transition-colors"
              style={{
                fontFamily: "'Syne', sans-serif",
                color: c.accent ? '#00e676' : '#f0ede6',
              }}
            >
              {c.value}
            </p>
            <p
              className="text-[#f0ede6] text-sm font-medium mb-1"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              {c.label}
            </p>
            <p
              className="text-[#8a8a8a] text-xs"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              {c.sub}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2
          className="text-lg font-bold text-[#f0ede6] mb-6"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Quick actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((ql) => (
            <Link
              key={ql.label}
              href={ql.href}
              className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-5 flex flex-col gap-3
                         hover:border-[#00e676]/40 hover:bg-[#0f0f0f] transition-all group"
            >
              <span className="text-2xl">{ql.icon}</span>
              <span
                className="text-sm text-[#8a8a8a] group-hover:text-[#f0ede6] transition-colors"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                {ql.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
