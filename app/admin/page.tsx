import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth-utils'
import {
  getAllProjects,
  getBlogPosts,
  getContactMessages,
} from '@/lib/db/queries'

export const metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/admin/login')

  const [posts, messages, projects] = await Promise.all([
    getBlogPosts(),
    getContactMessages(),
    getAllProjects(),
  ])

  const totalPosts = posts.length
  const publishedPosts = posts.filter((p) => p.published).length
  const draftPosts = totalPosts - publishedPosts
  const totalMessages = messages.length
  const unreadMessages = messages.filter((m) => !m.read).length
  const totalProjects = projects.length
  const featuredProjects = projects.filter((p) => p.featured).length

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <p
            className="text-xs uppercase tracking-widest text-[#8A938E] mb-2"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Admin · Overview
          </p>
          <h1
            className="text-4xl font-bold text-[#F3F6F4]"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Welcome back<span className="text-[#3DF49A]">.</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <PrimaryLink href="/admin/posts/new">+ New post</PrimaryLink>
          <SecondaryLink href="/admin/projects">+ New project</SecondaryLink>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <StatCard
          label="Posts"
          value={totalPosts}
          sub={`${publishedPosts} live · ${draftPosts} draft`}
          href="/admin/posts"
        />
        <StatCard
          label="Projects"
          value={totalProjects}
          sub={`${featuredProjects} featured`}
          href="/admin/projects"
        />
        <StatCard
          label="Messages"
          value={totalMessages}
          sub={unreadMessages > 0 ? `${unreadMessages} unread` : 'All read'}
          href="/admin/messages"
          accent={unreadMessages > 0}
        />
        <StatCard
          label="This week"
          value={
            messages.filter((m) => {
              const d = new Date(m.createdAt)
              const week = 7 * 24 * 60 * 60 * 1000
              return Date.now() - d.getTime() < week
            }).length
          }
          sub="new messages"
          href="/admin/messages"
        />
      </div>

      {/* Two-column: recent posts + recent messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <Panel
          title="Recent posts"
          action={{ label: 'Manage all', href: '/admin/posts' }}
          empty={recentPosts.length === 0 ? 'No posts yet' : null}
        >
          {recentPosts.map((p) => (
            <Link
              key={p.id}
              href={`/admin/posts/${p.id}`}
              className="flex items-center justify-between py-3 border-b border-[#1F2421] last:border-0 hover:text-[#3DF49A] transition-colors group"
            >
              <div className="flex-1 min-w-0 mr-4">
                <p
                  className="text-[#F3F6F4] text-sm font-medium truncate group-hover:text-[#3DF49A]"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  {p.title}
                </p>
                <p
                  className="text-[#8A938E] text-xs mt-0.5"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  {formatRelative(p.updatedAt)}
                </p>
              </div>
              <Badge variant={p.published ? 'live' : 'draft'}>
                {p.published ? 'Live' : 'Draft'}
              </Badge>
            </Link>
          ))}
        </Panel>

        <Panel
          title="Recent messages"
          action={{ label: 'Manage all', href: '/admin/messages' }}
          empty={recentMessages.length === 0 ? 'No messages yet' : null}
        >
          {recentMessages.map((m) => (
            <Link
              key={m.id}
              href="/admin/messages"
              className="flex items-center justify-between py-3 border-b border-[#1F2421] last:border-0 group"
            >
              <div className="flex-1 min-w-0 mr-4">
                <p
                  className="text-[#F3F6F4] text-sm font-medium truncate group-hover:text-[#3DF49A] transition-colors"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  {m.name}
                  <span className="text-[#8A938E] font-normal"> · {m.email}</span>
                </p>
                <p
                  className="text-[#8A938E] text-xs mt-0.5"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  {formatRelative(m.createdAt)}
                </p>
              </div>
              {!m.read && <Badge variant="unread">New</Badge>}
            </Link>
          ))}
        </Panel>
      </div>

      {/* Quick actions */}
      <div>
        <h2
          className="text-xs uppercase tracking-widest text-[#8A938E] mb-4"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          Quick actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction href="/admin/posts/new" label="Write a post" />
          <QuickAction href="/admin/projects" label="Add a project" />
          <QuickAction href="/admin/messages" label="Inbox" badge={unreadMessages || null} />
          <QuickAction href="/" label="View site" external />
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// Pieces
// ──────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  href,
  accent,
}: {
  label: string
  value: number
  sub: string
  href: string
  accent?: boolean
}) {
  return (
    <Link
      href={href}
      className={`block bg-[#0F0F0F] border rounded-xl p-5 transition-colors ${
        accent ? 'border-[#3DF49A]/40 hover:border-[#3DF49A]' : 'border-[#1F2421] hover:border-[#2B302D]'
      }`}
    >
      <p
        className="text-[10px] uppercase tracking-widest text-[#8A938E] mb-3"
        style={{ fontFamily: 'var(--font-jetbrains)' }}
      >
        {label}
      </p>
      <p
        className="text-3xl font-bold text-[#F3F6F4] mb-1 leading-none"
        style={{ fontFamily: 'var(--font-clash)' }}
      >
        {value}
      </p>
      <p
        className={`text-xs ${accent ? 'text-[#3DF49A]' : 'text-[#8A938E]'}`}
        style={{ fontFamily: 'var(--font-jakarta)' }}
      >
        {sub}
      </p>
    </Link>
  )
}

function Panel({
  title,
  action,
  empty,
  children,
}: {
  title: string
  action?: { label: string; href: string }
  empty?: string | null
  children?: React.ReactNode
}) {
  return (
    <div className="bg-[#0F0F0F] border border-[#1F2421] rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h3
          className="text-base font-bold text-[#F3F6F4]"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
          {title}
        </h3>
        {action && (
          <Link
            href={action.href}
            className="text-xs text-[#8A938E] hover:text-[#3DF49A] transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            {action.label} →
          </Link>
        )}
      </div>
      {empty ? (
        <p
          className="text-[#8A938E] text-sm py-8 text-center"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          {empty}
        </p>
      ) : (
        <div>{children}</div>
      )}
    </div>
  )
}

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode
  variant: 'live' | 'draft' | 'unread'
}) {
  const styles = {
    live: 'bg-[#3DF49A]/10 text-[#3DF49A]',
    draft: 'bg-[#1F2421] text-[#8A938E]',
    unread: 'bg-[#3DF49A] text-[#06160E]',
  }[variant]
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium ${styles}`}
      style={{ fontFamily: 'var(--font-jetbrains)' }}
    >
      {children}
    </span>
  )
}

function QuickAction({
  href,
  label,
  badge,
  external,
}: {
  href: string
  label: string
  badge?: number | null
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className="bg-[#0F0F0F] border border-[#1F2421] rounded-lg px-4 py-3 hover:border-[#3DF49A]/40 transition-colors group flex items-center justify-between"
    >
      <span
        className="text-[#F3F6F4] text-sm group-hover:text-[#3DF49A] transition-colors"
        style={{ fontFamily: 'var(--font-jakarta)' }}
      >
        {label}
      </span>
      {badge ? (
        <span
          className="text-[10px] bg-[#3DF49A] text-[#06160E] rounded-full px-1.5 py-0.5 font-medium"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          {badge}
        </span>
      ) : (
        <span className="text-[#8A938E] group-hover:text-[#3DF49A] transition-colors">→</span>
      )}
    </Link>
  )
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-sm bg-[#3DF49A] text-[#06160E] rounded-lg font-medium hover:bg-[#5BFBA8] transition-colors"
      style={{ fontFamily: 'var(--font-jakarta)' }}
    >
      {children}
    </Link>
  )
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-sm bg-[#1F2421] text-[#F3F6F4] rounded-lg font-medium hover:bg-[#2B302D] transition-colors"
      style={{ fontFamily: 'var(--font-jakarta)' }}
    >
      {children}
    </Link>
  )
}

function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const sec = Math.floor(diff / 1000)
  const min = Math.floor(sec / 60)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  if (sec < 60) return 'just now'
  if (min < 60) return `${min}m ago`
  if (hr < 24) return `${hr}h ago`
  if (day < 7) return `${day}d ago`
  return d.toLocaleDateString()
}
