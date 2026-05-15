import { headers } from "next/headers"
import { auth } from "@/auth"

/**
 * Get the current authenticated session
 * Safe for Edge Runtime
 */
export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.user
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}
