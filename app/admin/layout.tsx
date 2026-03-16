import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { logoutAction } from './actions'

const ADMIN_COOKIE = 'fahim_admin_session'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const session = cookieStore.get(ADMIN_COOKIE)
  const isAuth = session?.value === 'authenticated'

  // Allow login page through
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {isAuth && (
        <nav className="border-b border-[#1f1f1f] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[#8a8a8a] text-sm hover:text-[#f0ede6] transition-colors"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              ← Site
            </Link>
            <span
              className="text-[#f0ede6] font-bold"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Admin
              <span className="text-[#00e676]">.</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm text-[#8a8a8a] hover:text-[#f0ede6] transition-colors"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/posts"
              className="text-sm text-[#8a8a8a] hover:text-[#f0ede6] transition-colors"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Posts
            </Link>
            <Link
              href="/admin/messages"
              className="text-sm text-[#8a8a8a] hover:text-[#f0ede6] transition-colors"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Messages
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-[#8a8a8a] hover:text-red-400 transition-colors"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                Logout
              </button>
            </form>
          </div>
        </nav>
      )}
      {children}
    </div>
  )
}
