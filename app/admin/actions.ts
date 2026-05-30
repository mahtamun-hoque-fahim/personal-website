'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import {
  createBlogPost,
  createProject,
  deleteBlogPost,
  deleteProject,
  getAllProjects,
  markMessageRead,
  reorderProjects as reorderProjectsDb,
  updateBlogPost,
  updateProject,
  updateProjectFeatured as updateProjectFeaturedDb,
  type NewBlogPost,
  type NewProject,
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

function sanitizeStatusBadges<T extends { statusBadges?: string[] | null }>(payload: T): T {
  if (Array.isArray(payload.statusBadges)) {
    payload.statusBadges = Array.from(
      new Set(
        payload.statusBadges
          .map((b) => String(b).trim().toLowerCase())
          .filter((b) => ALLOWED_BADGES.includes(b)),
      ),
    )
  }
  return payload
}

const ALLOWED_BADGES = ['live', 'beta', 'deprecated', 'funding']

export async function createProjectAction(payload: NewProject) {
  const created = await createProject(sanitizeStatusBadges(payload))
  revalidatePath('/admin/projects')
  revalidatePath('/')
  revalidatePath('/projects')
  return created
}

export async function updateProjectAction(id: string, payload: Partial<NewProject>) {
  const updated = await updateProject(id, sanitizeStatusBadges(payload))
  revalidatePath('/admin/projects')
  revalidatePath('/')
  revalidatePath('/projects')
  return updated
}

export async function deleteProjectAction(id: string) {
  await deleteProject(id)
  revalidatePath('/admin/projects')
  revalidatePath('/')
  revalidatePath('/projects')
}

// Bulk JSON upsert: for each row, if a project with the same name exists,
// update it; otherwise create it. Returns one outcome per row so the UI can
// show which succeeded vs failed without aborting the whole batch.
export type BulkProjectOutcome = {
  index: number
  name: string
  status: 'created' | 'updated' | 'error'
  error?: string
}

export async function bulkUpsertProjectsAction(
  rows: Array<Partial<NewProject> & { name: string }>,
): Promise<BulkProjectOutcome[]> {
  // Load existing names once so we know create vs update without N+1 queries.
  const existing = await getAllProjects()
  const byName = new Map(existing.map((p) => [p.name.toLowerCase(), p]))

  const outcomes: BulkProjectOutcome[] = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    // Sanitize statusBadges: only allow known values, lowercase, deduped.
    if (Array.isArray(row.statusBadges)) {
      row.statusBadges = Array.from(
        new Set(
          row.statusBadges
            .map((b) => String(b).trim().toLowerCase())
            .filter((b) => ALLOWED_BADGES.includes(b)),
        ),
      )
    }
    try {
      if (!row.name?.trim()) {
        outcomes.push({ index: i, name: row.name ?? '', status: 'error', error: 'name is required' })
        continue
      }
      if (!row.tagline?.trim() || !row.description?.trim() || !row.repoUrl?.trim()) {
        outcomes.push({
          index: i,
          name: row.name,
          status: 'error',
          error: 'tagline, description, repoUrl are required',
        })
        continue
      }
      const match = byName.get(row.name.toLowerCase())
      if (match) {
        await updateProject(match.id, row)
        outcomes.push({ index: i, name: row.name, status: 'updated' })
      } else {
        await createProject(row as NewProject)
        outcomes.push({ index: i, name: row.name, status: 'created' })
      }
    } catch (err) {
      outcomes.push({
        index: i,
        name: row.name ?? '',
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }
  revalidatePath('/admin/projects')
  revalidatePath('/')
  revalidatePath('/projects')
  return outcomes
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
