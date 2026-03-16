import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'fahim_admin_session'
const SESSION_VALUE = 'authenticated'

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies()
  const session = cookieStore.get(ADMIN_COOKIE)
  return session?.value === SESSION_VALUE
}

export { ADMIN_COOKIE, SESSION_VALUE }
