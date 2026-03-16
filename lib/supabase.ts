import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    // Build-time stub — module loads without crashing, real calls happen at runtime
    return {
      from: () => ({
        select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }), data: [], error: null }), order: () => ({ data: [], error: null }), data: [], error: null }),
        insert: () => ({ error: null }),
        update: () => ({ eq: () => ({ error: null }) }),
        delete: () => ({ eq: () => ({ error: null }) }),
        eq: () => ({ single: () => ({ data: null, error: null }), data: [], error: null }),
        order: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: null }),
      }),
    } as unknown as SupabaseClient
  }
  _client = createClient(url, key)
  return _client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: string) {
    return (getClient() as any)[prop]
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
