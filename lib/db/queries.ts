import { and, asc, desc, eq, isNotNull, sql } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import { db } from './index'
import {
  blogPosts,
  contactMessages,
  projects,
  credentialTimeline,
  credentialClusters,
  credentialCerts,
  credentialCommunity,
  credentialContributions,
  siteSettings,
  type BlogPost,
  type NewBlogPost,
  type NewContactMessage,
  type NewProject,
  type Project,
  type CredentialTimeline,
  type NewCredentialTimeline,
  type CredentialCluster,
  type NewCredentialCluster,
  type CredentialCert,
  type NewCredentialCert,
  type CredentialCommunity,
  type NewCredentialCommunity,
  type CredentialContribution,
  type NewCredentialContribution,
  type SiteSettings,
  type NewSiteSettings,
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


// ──────────────────────────────────────────────────────────
// Credential Timeline
// ──────────────────────────────────────────────────────────

export async function getCredentialTimeline(): Promise<CredentialTimeline[]> {
  try {
    return await db.select().from(credentialTimeline).orderBy(asc(credentialTimeline.sortOrder))
  } catch (error) {
    console.error('getCredentialTimeline error:', error)
    return []
  }
}

export async function createCredentialTimelineEntry(data: NewCredentialTimeline): Promise<CredentialTimeline | null> {
  try {
    const rows = await db.insert(credentialTimeline).values(data).returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('createCredentialTimelineEntry error:', error)
    throw error
  }
}

export async function updateCredentialTimelineEntry(id: string, data: Partial<NewCredentialTimeline>): Promise<CredentialTimeline | null> {
  try {
    const rows = await db.update(credentialTimeline).set({ ...data, updatedAt: new Date() }).where(eq(credentialTimeline.id, id)).returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('updateCredentialTimelineEntry error:', error)
    throw error
  }
}

export async function deleteCredentialTimelineEntry(id: string): Promise<void> {
  await db.delete(credentialTimeline).where(eq(credentialTimeline.id, id))
}

export async function reorderCredentialTimeline(orders: Array<{ id: string; order: number }>): Promise<void> {
  for (const { id, order } of orders) {
    await db.update(credentialTimeline).set({ sortOrder: order, updatedAt: new Date() }).where(eq(credentialTimeline.id, id))
  }
}

// ──────────────────────────────────────────────────────────
// Credential Clusters
// ──────────────────────────────────────────────────────────

export async function getCredentialClusters(): Promise<CredentialCluster[]> {
  try {
    return await db.select().from(credentialClusters).orderBy(asc(credentialClusters.sortOrder))
  } catch (error) {
    console.error('getCredentialClusters error:', error)
    return []
  }
}

export async function createCredentialCluster(data: NewCredentialCluster): Promise<CredentialCluster | null> {
  try {
    const rows = await db.insert(credentialClusters).values(data).returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('createCredentialCluster error:', error)
    throw error
  }
}

export async function updateCredentialCluster(id: string, data: Partial<NewCredentialCluster>): Promise<CredentialCluster | null> {
  try {
    const rows = await db.update(credentialClusters).set({ ...data, updatedAt: new Date() }).where(eq(credentialClusters.id, id)).returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('updateCredentialCluster error:', error)
    throw error
  }
}

export async function deleteCredentialCluster(id: string): Promise<void> {
  await db.delete(credentialClusters).where(eq(credentialClusters.id, id))
}

export async function reorderCredentialClusters(orders: Array<{ id: string; order: number }>): Promise<void> {
  for (const { id, order } of orders) {
    await db.update(credentialClusters).set({ sortOrder: order, updatedAt: new Date() }).where(eq(credentialClusters.id, id))
  }
}

// ──────────────────────────────────────────────────────────
// Credential Certs
// ──────────────────────────────────────────────────────────

export async function getCredentialCerts(): Promise<CredentialCert[]> {
  try {
    return await db.select().from(credentialCerts).orderBy(asc(credentialCerts.clusterId), asc(credentialCerts.sortOrder))
  } catch (error) {
    console.error('getCredentialCerts error:', error)
    return []
  }
}

export async function createCredentialCert(data: NewCredentialCert): Promise<CredentialCert | null> {
  try {
    const rows = await db.insert(credentialCerts).values(data).returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('createCredentialCert error:', error)
    throw error
  }
}

export async function updateCredentialCert(id: string, data: Partial<NewCredentialCert>): Promise<CredentialCert | null> {
  try {
    const rows = await db.update(credentialCerts).set({ ...data, updatedAt: new Date() }).where(eq(credentialCerts.id, id)).returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('updateCredentialCert error:', error)
    throw error
  }
}

export async function deleteCredentialCert(id: string): Promise<void> {
  await db.delete(credentialCerts).where(eq(credentialCerts.id, id))
}

export async function reorderCredentialCerts(orders: Array<{ id: string; order: number }>): Promise<void> {
  for (const { id, order } of orders) {
    await db.update(credentialCerts).set({ sortOrder: order, updatedAt: new Date() }).where(eq(credentialCerts.id, id))
  }
}

// ──────────────────────────────────────────────────────────
// Credential Community
// ──────────────────────────────────────────────────────────

export async function getCredentialCommunity(): Promise<CredentialCommunity[]> {
  try {
    return await db.select().from(credentialCommunity).orderBy(asc(credentialCommunity.sortOrder))
  } catch (error) {
    console.error('getCredentialCommunity error:', error)
    return []
  }
}

export async function createCredentialCommunityEntry(data: NewCredentialCommunity): Promise<CredentialCommunity | null> {
  try {
    const rows = await db.insert(credentialCommunity).values(data).returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('createCredentialCommunityEntry error:', error)
    throw error
  }
}

export async function updateCredentialCommunityEntry(id: string, data: Partial<NewCredentialCommunity>): Promise<CredentialCommunity | null> {
  try {
    const rows = await db.update(credentialCommunity).set({ ...data, updatedAt: new Date() }).where(eq(credentialCommunity.id, id)).returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('updateCredentialCommunityEntry error:', error)
    throw error
  }
}

export async function deleteCredentialCommunityEntry(id: string): Promise<void> {
  await db.delete(credentialCommunity).where(eq(credentialCommunity.id, id))
}

export async function reorderCredentialCommunity(orders: Array<{ id: string; order: number }>): Promise<void> {
  for (const { id, order } of orders) {
    await db.update(credentialCommunity).set({ sortOrder: order, updatedAt: new Date() }).where(eq(credentialCommunity.id, id))
  }
}

// ──────────────────────────────────────────────────────────
// Credential Contributions
// ──────────────────────────────────────────────────────────

export async function getCredentialContributions(): Promise<CredentialContribution[]> {
  try {
    return await db.select().from(credentialContributions).orderBy(asc(credentialContributions.sortOrder))
  } catch (error) {
    console.error('getCredentialContributions error:', error)
    return []
  }
}

export async function createCredentialContribution(data: NewCredentialContribution): Promise<CredentialContribution | null> {
  try {
    const rows = await db.insert(credentialContributions).values(data).returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('createCredentialContribution error:', error)
    throw error
  }
}

export async function updateCredentialContribution(id: string, data: Partial<NewCredentialContribution>): Promise<CredentialContribution | null> {
  try {
    const rows = await db.update(credentialContributions).set({ ...data, updatedAt: new Date() }).where(eq(credentialContributions.id, id)).returning()
    return rows[0] ?? null
  } catch (error) {
    console.error('updateCredentialContribution error:', error)
    throw error
  }
}

export async function deleteCredentialContribution(id: string): Promise<void> {
  await db.delete(credentialContributions).where(eq(credentialContributions.id, id))
}

export async function reorderCredentialContributions(orders: Array<{ id: string; order: number }>): Promise<void> {
  for (const { id, order } of orders) {
    await db.update(credentialContributions).set({ sortOrder: order, updatedAt: new Date() }).where(eq(credentialContributions.id, id))
  }
}

// ──────────────────────────────────────────────────────────
// Site settings (single row, id always 1 — dashboard-driven metadata)
// ──────────────────────────────────────────────────────────

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 1,
  title: 'Mahtamun Hoque Fahim — Full-Stack Developer & AI Engineer',
  description:
    'Full-stack developer and AI engineer from Bangladesh. Building web apps, tools, and digital products.',
  jobTitle: 'Full-Stack Developer & AI Engineer',
  avatarUrl: null,
  keywords: [
    'developer',
    'AI engineer',
    'full-stack developer',
    'Bangladesh',
    'Next.js',
    'TypeScript',
    'mahtamun',
    'mahtamun hoque fahim',
  ],
  ogTitle: 'Mahtamun Hoque Fahim — Full-Stack Developer & AI Engineer',
  ogDescription:
    'Full-stack developer and AI engineer from Bangladesh. Building web apps, tools, and digital products.',
  updatedAt: new Date(),
}

/**
 * Reads the single site_settings row (id=1), creating it with defaults on
 * first read if it doesn't exist yet. Uncached — use getCachedSiteSettings()
 * for anything rendered on the public site.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1)
    if (rows[0]) return rows[0]
    const created = await db.insert(siteSettings).values({ id: 1 }).returning()
    return created[0] ?? DEFAULT_SITE_SETTINGS
  } catch (error) {
    console.error('getSiteSettings error:', error)
    return DEFAULT_SITE_SETTINGS
  }
}

/**
 * Cached read for public-facing metadata (root layout). Revalidates every
 * hour, and on-demand via revalidateTag('site-settings') from the admin
 * save action below.
 */
export const getCachedSiteSettings = unstable_cache(
  async () => getSiteSettings(),
  ['site-settings'],
  { revalidate: 3600, tags: ['site-settings'] }
)

export async function updateSiteSettings(
  updates: Partial<NewSiteSettings>
): Promise<SiteSettings> {
  const rows = await db
    .update(siteSettings)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(siteSettings.id, 1))
    .returning()
  if (rows[0]) return rows[0]
  const created = await db
    .insert(siteSettings)
    .values({ id: 1, ...updates })
    .returning()
  return created[0]
}

// Re-export the inferred types for convenience
export type {
  BlogPost,
  ContactMessage,
  NewBlogPost,
  NewContactMessage,
  NewProject,
  Project,
  CredentialTimeline,
  NewCredentialTimeline,
  CredentialCluster,
  NewCredentialCluster,
  CredentialCert,
  NewCredentialCert,
  CredentialCommunity,
  NewCredentialCommunity,
  CredentialContribution,
  NewCredentialContribution,
  SiteSettings,
  NewSiteSettings,
} from './schema'
