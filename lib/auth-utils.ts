import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { isAdminEmail } from '@/lib/admin-allowlist'

/**
 * Get the current authenticated session (Server Components, Route Handlers, Server Actions).
 */
export async function getSession() {
  try {
    return await auth.api.getSession({ headers: await headers() })
  } catch (error) {
    console.error('getSession error:', error)
    return null
  }
}

/**
 * `true` only if there is a session AND the session's email is in
 * the ADMIN_EMAILS allowlist. Defense-in-depth: even if a stale or
 * unauthorized user row exists in the DB, they cannot access admin
 * unless their email is explicitly allowlisted in env.
 */
export async function isAuthenticated() {
  const session = await getSession()
  if (!session?.user?.email) return false
  return isAdminEmail(session.user.email)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  if (!isAdminEmail(session.user.email)) return null
  return session.user
}
