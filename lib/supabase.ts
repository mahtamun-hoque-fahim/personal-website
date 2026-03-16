import { createClient } from '@supabase/supabase-js'

// Use empty string fallbacks so the module loads at build time without crashing.
// At runtime these will always be set via env vars.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
