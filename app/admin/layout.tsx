import { isAuthenticated } from '@/lib/auth-utils'
import AdminSidebar from './AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuth = await isAuthenticated()

  // Unauthenticated routes (login, forgot/reset password) render plain — no chrome.
  if (!isAuth) {
    return <div className="min-h-screen bg-[#070807]">{children}</div>
  }

  return (
    <div className="min-h-screen bg-[#070807]">
      <AdminSidebar />
      <main className="ml-60 min-h-screen">{children}</main>
    </div>
  )
}
