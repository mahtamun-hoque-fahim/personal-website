import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Returns a fresh Supabase client per call — safe for Cloudflare Edge Runtime.
 *
 * Why no singleton:
 *  - Cloudflare V8 isolates can share module-level state across requests in
 *    unpredictable ways, causing stale/broken client state.
 *  - @supabase/supabase-js v2 lazily imports `ws` for Realtime; the import
 *    itself crashes on Edge if the module is retained across requests.
 *
 * Why db: false (Realtime disabled):
 *  - Realtime requires a persistent WebSocket connection via the `ws` package,
 *    which is Node.js-only and not available on Cloudflare Workers / Edge Runtime.
 *  - We only use Supabase for simple HTTP queries (from/select/insert/update),
 *    so Realtime is not needed.
 */
export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Build-time stub — keeps the module from crashing during static analysis
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => ({ data: null, error: null }),
            data: [],
            error: null,
          }),
          order: () => ({ data: [], error: null }),
          data: [],
          error: null,
        }),
        insert: () => ({ error: null }),
        update: () => ({ eq: () => ({ error: null }) }),
        delete: () => ({ eq: () => ({ error: null }) }),
        eq: () => ({
          single: () => ({ data: null, error: null }),
          data: [],
          error: null,
        }),
        order: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: null }),
      }),
    } as unknown as SupabaseClient
  }

  return createClient(url, key, {
    auth: {
      persistSession: false, // no localStorage — Edge has no DOM storage
      autoRefreshToken: false,
    },
    realtime: {
      // Disable Realtime entirely — prevents `ws` package from being imported,
      // which crashes on Cloudflare Edge Runtime (Node-only WebSocket dependency)
      params: { eventsPerSecond: -1 },
    },
    global: {
      fetch: fetch.bind(globalThis), // use the native Edge fetch, not Node's
    },
  })
}

// Legacy named export — kept so existing callers don't need to change.
// Each property access creates a fresh client, which is the safe pattern on Edge.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: string) {
    return (getSupabase() as any)[prop]
  },
})

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  published: boolean
  tags: string[]
  reading_time: number
  created_at: string
  updated_at: string
}
