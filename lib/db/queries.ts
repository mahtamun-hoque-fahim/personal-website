import { and, asc, desc, eq, isNotNull, sql } from 'drizzle-orm'
import { db } from './index'
import {
  blogPosts,
  contactMessages,
  projects,
  type BlogPost,
  type NewBlogPost,
  type NewContactMessage,
  type NewProject,
  type Project,
} from './schema'

// ──────────────────────────────────────────────────────────
// Blog posts
// ──────────────────────────────────────────────────────────

export async function getBlogPosts(opts?: {
  publishedOnly?: boolean
  limit?: number
  offset?: number
}): Promise<BlogPost[]> {
  const { publishedOnly, limit, offset } = opts ?? {}

  let q = db.select().from(blogPosts).$dynamic()
  if (publishedOnly) q = q.where(eq(blogPosts.published, true))
  q = q.orderBy(desc(blogPosts.createdAt))
  if (typeof limit === 'number') q = q.limit(limit)
  if (typeof offset === 'number') q = q.offset(offset)

  try {
    return await q
  } catch (error) {
    console.error('getBlogPosts error:', error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1)
    return rows[0] ?? null
  } catch (error) {
    console.error('getBlogPostBySlug error:', error)
    return null
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1)
    return rows[0] ?? null
  } catch (error) {
    console.error('getBlogPostById error:', error)
    return null
  }
}

export async function createBlogPost(input: NewBlogPost): Promise<BlogPost | null> {
  const rows = await db.insert(blogPosts).values(input).returning()
  return rows[0] ?? null
}

export async function updateBlogPost(
  id: string,
  updates: Partial<NewBlogPost>
): Promise<BlogPost | null> {
  const rows = await db
    .update(blogPosts)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(blogPosts.id, id))
    .returning()
  return rows[0] ?? null
}

export async function deleteBlogPost(id: string): Promise<void> {
  await db.delete(blogPosts).where(eq(blogPosts.id, id))
}

// ──────────────────────────────────────────────────────────
// Contact messages
// ──────────────────────────────────────────────────────────

export async function getContactMessages(opts?: {
  unreadOnly?: boolean
  limit?: number
}) {
  const { unreadOnly, limit } = opts ?? {}

  let q = db.select().from(contactMessages).$dynamic()
  if (unreadOnly) q = q.where(eq(contactMessages.read, false))
  q = q.orderBy(desc(contactMessages.createdAt))
  if (typeof limit === 'number') q = q.limit(limit)

  try {
    return await q
  } catch (error) {
    console.error('getContactMessages error:', error)
    return []
  }
}

export async function createContactMessage(input: NewContactMessage) {
  const rows = await db.insert(contactMessages).values(input).returning()
  return rows[0] ?? null
}

export async function markMessageRead(id: string) {
  const rows = await db
    .update(contactMessages)
    .set({ read: true })
    .where(eq(contactMessages.id, id))
    .returning()
  return rows[0] ?? null
}

export async function deleteContactMessage(id: string) {
  await db.delete(contactMessages).where(eq(contactMessages.id, id))
}

// ──────────────────────────────────────────────────────────
// Projects
// ──────────────────────────────────────────────────────────

export async function getAllProjects(): Promise<Project[]> {
  try {
    return await db.select().from(projects).orderBy(asc(projects.name))
  } catch (error) {
    console.error('getAllProjects error:', error)
    return []
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(asc(projects.featuredOrder))
  } catch (error) {
    console.error('getFeaturedProjects error:', error)
    return []
  }
}

export async function updateProjectFeatured(
  id: string,
  featured: boolean
): Promise<Project | null> {
  if (featured) {
    const maxRow = await db
      .select({ max: sql<number | null>`max(${projects.featuredOrder})` })
      .from(projects)
      .where(eq(projects.featured, true))
    const nextOrder = (maxRow[0]?.max ?? 0) + 1

    const rows = await db
      .update(projects)
      .set({ featured: true, featuredOrder: nextOrder, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning()
    return rows[0] ?? null
  }

  const rows = await db
    .update(projects)
    .set({ featured: false, featuredOrder: null, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning()
  return rows[0] ?? null
}

export async function reorderProjects(
  orders: Array<{ id: string; order: number }>
) {
  for (const { id, order } of orders) {
    await db
      .update(projects)
      .set({ featuredOrder: order, updatedAt: new Date() })
      .where(eq(projects.id, id))
  }
}

export async function createProject(data: NewProject): Promise<Project | null> {
  try {
    const rows = await db.insert(projects).values(data).returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('createProject error:', error)
    throw error
  }
}

export async function updateProject(
  id: string,
  data: Partial<NewProject>
): Promise<Project | null> {
  try {
    const rows = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('updateProject error:', error)
    throw error
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await db.delete(projects).where(eq(projects.id, id))
    return true
  } catch (error) {
    console.error('deleteProject error:', error)
    return false
  }
}

// Re-export the inferred types for convenience
export type {
  BlogPost,
  ContactMessage,
  NewBlogPost,
  NewContactMessage,
  NewProject,
  Project,
} from './schema'
