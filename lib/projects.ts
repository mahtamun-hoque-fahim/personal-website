import { getSupabase } from './supabase'

export type Project = {
  id: string
  name: string
  tagline: string
  description: string
  tags: string[]
  type: string
  live_url: string | null
  repo_url: string
  featured: boolean
  featured_order: number | null
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return (data || []).map(p => ({
    ...p,
    description: p.description || '',
    tags: p.tags || [],
  }))
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('featured_order', { ascending: true })

  if (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }

  return (data || []).map(p => ({
    ...p,
    description: p.description || '',
    tags: p.tags || [],
  }))
}

