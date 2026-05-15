import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

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

export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.user
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}
