'use server'

import { redirect } from 'next/navigation'
import { updateProjectFeatured as updateProjectFeaturedDb, reorderProjects as reorderProjectsDb, deleteBlogPost, updateContactMessage } from '@/lib/neon'

export async function logoutAction() {
  redirect('/api/auth/signout')
}

export async function updateProjectFeatured(projectId: string, featured: boolean) {
  try {
    await updateProjectFeaturedDb(projectId, featured)
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export async function reorderProjects(newOrder: { id: string; order: number }[]) {
  try {
    await reorderProjectsDb(newOrder)
  } catch (error) {
    console.error('Error reordering projects:', error)
    throw error
  }
}

export async function deletePostAction(id: string) {
  await deleteBlogPost(id)
}

export async function markMessageReadAction(id: string) {
  await updateContactMessage(id, { read: true })
}

export async function saveBlogPostAction(payload: any, postId?: string) {
  const { createBlogPost, updateBlogPost } = await import('@/lib/neon')
  if (postId) {
    return await updateBlogPost(postId, payload)
  } else {
    return await createBlogPost(payload)
  }
}
