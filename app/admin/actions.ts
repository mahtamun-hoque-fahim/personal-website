'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

const ADMIN_COOKIE = 'fahim_admin_session'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'fahim2024admin'

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string

  if (password === ADMIN_PASSWORD) {
    cookies().set(ADMIN_COOKIE, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    redirect('/admin')
  } else {
    redirect('/admin/login?error=1')
  }
}

export async function logoutAction() {
  cookies().delete(ADMIN_COOKIE)
  redirect('/admin/login')
}

export async function updateProjectFeatured(projectId: string, featured: boolean) {
  const supabase = getSupabase()
  
  if (featured) {
    // Get the max order to add new featured project at the end
    const { data } = await supabase
      .from('projects')
      .select('featured_order')
      .eq('featured', true)
      .order('featured_order', { ascending: false })
      .limit(1)
    
    const maxOrder = data?.[0]?.featured_order || 0
    
    const { error } = await supabase
      .from('projects')
      .update({ featured: true, featured_order: maxOrder + 1 })
      .eq('id', projectId)
    
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('projects')
      .update({ featured: false, featured_order: null })
      .eq('id', projectId)
    
    if (error) throw error
  }
}

export async function reorderProjects(newOrder: { id: string; order: number }[]) {
  const supabase = getSupabase()
  
  for (const { id, order } of newOrder) {
    const { error } = await supabase
      .from('projects')
      .update({ featured_order: order })
      .eq('id', id)
    
    if (error) throw error
  }
}
