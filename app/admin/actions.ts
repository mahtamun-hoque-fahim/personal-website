'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import {
  createBlogPost,
  deleteBlogPost,
  markMessageRead,
  reorderProjects as reorderProjectsDb,
  updateBlogPost,
  updateProjectFeatured as updateProjectFeaturedDb,
  type NewBlogPost,
} from '@/lib/db/queries'

export async function logoutAction() {
  try {
    await auth.api.signOut({ headers: await headers() })
  } catch (error) {
    console.error('logoutAction error:', error)
  }
  redirect('/admin/login')
}

export async function updateProjectFeatured(projectId: string, featured: boolean) {
  await updateProjectFeaturedDb(projectId, featured)
  revalidatePath('/admin/projects')
  revalidatePath('/')
  revalidatePath('/projects')
}

export async function reorderProjects(newOrder: Array<{ id: string; order: number }>) {
  await reorderProjectsDb(newOrder)
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function deletePostAction(id: string) {
  await deleteBlogPost(id)
  revalidatePath('/admin/posts')
  revalidatePath('/blog')
}

export async function markMessageReadAction(id: string) {
  await markMessageRead(id)
  revalidatePath('/admin/messages')
}

export async function saveBlogPostAction(payload: Partial<NewBlogPost>, postId?: string) {
  if (postId) {
    const updated = await updateBlogPost(postId, payload)
    revalidatePath('/admin/posts')
    revalidatePath('/blog')
    if (updated?.slug) revalidatePath(`/blog/${updated.slug}`)
    return updated
  }
  const created = await createBlogPost(payload as NewBlogPost)
  revalidatePath('/admin/posts')
  revalidatePath('/blog')
  return created
}
