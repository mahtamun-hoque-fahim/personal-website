'use server'

import { redirect } from 'next/navigation'
import { updateProjectFeatured as updateProjectFeaturedDb, reorderProjects as reorderProjectsDb } from '@/lib/neon'

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
