import { neon, neonConfig } from '@neondatabase/serverless'

// Disable caching for better Edge Runtime compatibility
neonConfig.fetchConnectionCache = (query) => undefined

/**
 * Database client for Neon PostgreSQL (Edge Runtime compatible)
 * Uses @neondatabase/serverless for Cloudflare Edge support
 */
export const db = neon(process.env.DATABASE_URL!)

export async function query(text: string, params?: any[]) {
  try {
    const result = await db(text, params)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

