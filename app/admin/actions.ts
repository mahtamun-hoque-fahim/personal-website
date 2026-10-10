'use server'

import {
  MARQUEE_SPEED_DEFAULT,
  MARQUEE_SPEED_MAX,
  MARQUEE_SPEED_MIN,
} from '@/lib/constants'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath, revalidateTag } from 'next/cache'
import { auth } from '@/lib/auth'
import { isAuthenticated } from '@/lib/auth-utils'
import { uploadAvatarToCloudinary, uploadSkillImageToCloudinary } from '@/lib/cloudinary'
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
  updateSiteSettings,
  updateAboutContent,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
  reorderFooterLinks,
  type NewBlogPost,
  type NewProject,
  type NewSiteSettings,
  type AboutContent,
  type NewSkill,
  type NewFooterLink,
} from '@/lib/db/queries'
import {
  createCredentialTimelineEntry,
  updateCredentialTimelineEntry,
  deleteCredentialTimelineEntry,
  reorderCredentialTimeline,
  createCredentialCluster,
  updateCredentialCluster,
  deleteCredentialCluster,
  reorderCredentialClusters,
  createCredentialCert,
  updateCredentialCert,
  deleteCredentialCert,
  reorderCredentialCerts,
  createCredentialCommunityEntry,
  updateCredentialCommunityEntry,
  deleteCredentialCommunityEntry,
  reorderCredentialCommunity,
  createCredentialContribution,
  updateCredentialContribution,
  deleteCredentialContribution,
  reorderCredentialContributions,
  type NewCredentialTimeline,
  type NewCredentialCluster,
  type NewCredentialCert,
  type NewCredentialCommunity,
  type NewCredentialContribution,
} from '@/lib/db/queries'

// Footer renders on every top-level page (it's included per-page, not from
// the root layout), so an edit needs each of those paths revalidated.
function revalidateFooterPaths() {
  for (const p of ['/', '/about', '/blog', '/contact', '/projects', '/credentials']) {
    revalidatePath(p)
  }
}

export async function uploadAvatarAction(formData: FormData) {
  // File uploads get an explicit auth check (unlike the other actions in
  // this file, which rely on their calling page already being gated) —
  // an unauthenticated upload endpoint is a meaningfully different risk
  // (storage/bandwidth abuse) from an unauthenticated text-field write.
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    throw new Error('Not authenticated.')
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    throw new Error('No file provided.')
  }

  const avatarUrl = await uploadAvatarToCloudinary(file)
  const updated = await updateSiteSettings({ avatarUrl })

  revalidateTag('site-settings', 'max')
  revalidatePath('/')
  revalidatePath('/admin/settings')

  return updated
}

export async function removeAvatarAction() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    throw new Error('Not authenticated.')
  }

  const updated = await updateSiteSettings({ avatarUrl: null })

  revalidateTag('site-settings', 'max')
  revalidatePath('/')
  revalidatePath('/admin/settings')

  return updated
}

export async function saveSiteSettingsAction(updates: Partial<NewSiteSettings>) {
  // Strip speed is the only numeric setting: keep it inside the range the
  // dashboard offers, whatever a client sends.
  if (updates.marqueeSpeed !== undefined) {
    const speed = Math.round(Number(updates.marqueeSpeed))
    updates.marqueeSpeed = Number.isFinite(speed)
      ? Math.min(Math.max(speed, MARQUEE_SPEED_MIN), MARQUEE_SPEED_MAX)
      : MARQUEE_SPEED_DEFAULT
  }
  const updated = await updateSiteSettings(updates)
  // The public site reads settings through the cached getCachedSiteSettings()
  // (unstable_cache, 1h revalidate) — revalidateTag clears that cache entry
  // immediately; revalidatePath('/') refreshes the homepage render on top.
  revalidateTag('site-settings', 'max')
  revalidatePath('/')
  revalidatePath('/projects')
  revalidatePath('/admin/settings')
  return updated
}

export type AboutContentInput = Pick<
  AboutContent,
  | 'headlineTop'
  | 'headlineAccent'
  | 'intro'
  | 'storyHeading'
  | 'storyParagraphs'
  | 'ctaHeading'
  | 'ctaText'
  | 'ctaPrimaryLabel'
  | 'ctaSecondaryLabel'
  | 'homeHeading'
  | 'homeParagraphOne'
  | 'homeParagraphTwo'
  | 'homeLinkLabel'
  | 'homeCardRole'
  | 'homeCardDescription'
  | 'homeCardStack'
  | 'homeCardAvailability'
  | 'homeCardObsessions'
>

export async function saveAboutContentAction(input: AboutContentInput) {
  // Server actions are public POST endpoints, so gate explicitly instead of
  // trusting the calling page, and copy only known fields (never spread the
  // client object into the update, or a crafted request could set `id` etc.).
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    throw new Error('Not authenticated.')
  }

  const clean = (value: unknown, max: number, label: string) => {
    const text = typeof value === 'string' ? value.trim() : ''
    if (!text) throw new Error(`${label} can't be empty.`)
    if (text.length > max) throw new Error(`${label} is too long (max ${max} characters).`)
    return text
  }

  const cleanList = (value: unknown, label: string) => {
    const items = Array.isArray(value)
      ? value.map((v) => (typeof v === 'string' ? v.trim() : '')).filter(Boolean)
      : []
    if (items.length === 0) throw new Error(`${label} needs at least one item.`)
    if (items.length > 8) throw new Error(`${label} has too many items (max 8).`)
    if (items.some((v) => v.length > 40)) {
      throw new Error(`An item in ${label} is too long (max 40 characters).`)
    }
    return items
  }

  const paragraphs = Array.isArray(input.storyParagraphs)
    ? input.storyParagraphs.map((p) => (typeof p === 'string' ? p.trim() : '')).filter(Boolean)
    : []
  if (paragraphs.length === 0) throw new Error('Add at least one story paragraph.')
  if (paragraphs.length > 12) throw new Error('Too many story paragraphs (max 12).')
  if (paragraphs.some((p) => p.length > 1500)) {
    throw new Error('A story paragraph is too long (max 1500 characters).')
  }

  const updated = await updateAboutContent({
    headlineTop: clean(input.headlineTop, 120, 'Headline'),
    headlineAccent: clean(input.headlineAccent, 120, 'Accent headline'),
    intro: clean(input.intro, 800, 'Intro'),
    storyHeading: clean(input.storyHeading, 120, 'Story heading'),
    storyParagraphs: paragraphs,
    ctaHeading: clean(input.ctaHeading, 120, 'CTA heading'),
    ctaText: clean(input.ctaText, 300, 'CTA text'),
    ctaPrimaryLabel: clean(input.ctaPrimaryLabel, 40, 'Primary button label'),
    ctaSecondaryLabel: clean(input.ctaSecondaryLabel, 40, 'Secondary button label'),
    homeHeading: clean(input.homeHeading, 120, 'Homepage heading'),
    homeParagraphOne: clean(input.homeParagraphOne, 600, 'Homepage first paragraph'),
    homeParagraphTwo: clean(input.homeParagraphTwo, 600, 'Homepage second paragraph'),
    homeLinkLabel: clean(input.homeLinkLabel, 40, 'Homepage link label'),
    homeCardRole: clean(input.homeCardRole, 40, 'Card role'),
    homeCardDescription: cleanList(input.homeCardDescription, 'Card description'),
    homeCardStack: cleanList(input.homeCardStack, 'Card stack'),
    homeCardAvailability: cleanList(input.homeCardAvailability, 'Card availability'),
    homeCardObsessions: cleanList(input.homeCardObsessions, 'Card obsessions'),
  })

  revalidateTag('about-content', 'max')
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/admin/about')
  return updated
}

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

function sanitizeCollaborators<
  T extends { collaborators?: Array<{ name?: string; url?: string | null }> | null },
>(payload: T): T {
  if (Array.isArray(payload.collaborators)) {
    payload.collaborators = payload.collaborators
      .map((c) => {
        const name = String(c?.name ?? '').trim()
        if (!name) return null
        const url = c?.url ? String(c.url).trim() : null
        return { name, url: url || null }
      })
      .filter((c): c is { name: string; url: string | null } => c !== null)
  }
  return payload
}

export async function createProjectAction(payload: NewProject) {
  const created = await createProject(sanitizeCollaborators(payload))
  revalidatePath('/admin/projects')
  revalidatePath('/')
  revalidatePath('/projects')
  return created
}

export async function updateProjectAction(id: string, payload: Partial<NewProject>) {
  const updated = await updateProject(id, sanitizeCollaborators(payload))
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

// ──────────────────────────────────────────────────────────
// Skills ("What I do" section)
// ──────────────────────────────────────────────────────────

export async function createSkillAction(payload: NewSkill) {
  const created = await createSkill(payload)
  revalidatePath('/admin/skills')
  revalidatePath('/')
  return created
}

export async function updateSkillAction(id: string, payload: Partial<NewSkill>) {
  const updated = await updateSkill(id, payload)
  revalidatePath('/admin/skills')
  revalidatePath('/')
  return updated
}

export async function deleteSkillAction(id: string) {
  await deleteSkill(id)
  revalidatePath('/admin/skills')
  revalidatePath('/')
}

export async function reorderSkillsAction(orders: Array<{ id: string; order: number }>) {
  await reorderSkills(orders)
  revalidatePath('/admin/skills')
  revalidatePath('/')
}

export async function uploadSkillImageAction(skillId: string, formData: FormData) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    throw new Error('Not authenticated.')
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    throw new Error('No file provided.')
  }

  const imageUrl = await uploadSkillImageToCloudinary(file, skillId)
  const updated = await updateSkill(skillId, { imageUrl })

  revalidatePath('/admin/skills')
  revalidatePath('/')

  return updated
}

// ──────────────────────────────────────────────────────────
// Footer links (nav + social links shown in the site footer)
// ──────────────────────────────────────────────────────────

export async function createFooterLinkAction(payload: NewFooterLink) {
  const created = await createFooterLink(payload)
  revalidatePath('/admin/footer-links')
  revalidateFooterPaths()
  return created
}

export async function updateFooterLinkAction(id: string, payload: Partial<NewFooterLink>) {
  const updated = await updateFooterLink(id, payload)
  revalidatePath('/admin/footer-links')
  revalidateFooterPaths()
  return updated
}

export async function deleteFooterLinkAction(id: string) {
  await deleteFooterLink(id)
  revalidatePath('/admin/footer-links')
  revalidateFooterPaths()
}

export async function reorderFooterLinksAction(orders: Array<{ id: string; order: number }>) {
  await reorderFooterLinks(orders)
  revalidatePath('/admin/footer-links')
  revalidateFooterPaths()
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
    // Sanitize collaborators: drop empty names, normalize empty url to null.
    if (Array.isArray(row.collaborators)) {
      row.collaborators = row.collaborators
        .map((c) => {
          const name = String(c?.name ?? '').trim()
          if (!name) return null
          const url = c?.url ? String(c.url).trim() : null
          return { name, url: url || null }
        })
        .filter((c): c is { name: string; url: string | null } => c !== null)
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


// ──────────────────────────────────────────────────────────
// Credential Timeline actions
// ──────────────────────────────────────────────────────────

export async function createTimelineEntryAction(data: NewCredentialTimeline) {
  const result = await createCredentialTimelineEntry(data)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
  return result
}
export async function updateTimelineEntryAction(id: string, data: Partial<NewCredentialTimeline>) {
  const result = await updateCredentialTimelineEntry(id, data)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
  return result
}
export async function deleteTimelineEntryAction(id: string) {
  await deleteCredentialTimelineEntry(id)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
}
export async function reorderTimelineAction(orders: Array<{ id: string; order: number }>) {
  await reorderCredentialTimeline(orders)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
}

export async function createClusterAction(data: NewCredentialCluster) {
  const result = await createCredentialCluster(data)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
  return result
}
export async function updateClusterAction(id: string, data: Partial<NewCredentialCluster>) {
  const result = await updateCredentialCluster(id, data)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
  return result
}
export async function deleteClusterAction(id: string) {
  await deleteCredentialCluster(id)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
}
export async function reorderClustersAction(orders: Array<{ id: string; order: number }>) {
  await reorderCredentialClusters(orders)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
}

export async function createCertAction(data: NewCredentialCert) {
  const result = await createCredentialCert(data)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
  return result
}
export async function updateCertAction(id: string, data: Partial<NewCredentialCert>) {
  const result = await updateCredentialCert(id, data)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
  return result
}
export async function deleteCertAction(id: string) {
  await deleteCredentialCert(id)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
}
export async function reorderCertsAction(orders: Array<{ id: string; order: number }>) {
  await reorderCredentialCerts(orders)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
}

export async function createCommunityEntryAction(data: NewCredentialCommunity) {
  const result = await createCredentialCommunityEntry(data)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
  return result
}
export async function updateCommunityEntryAction(id: string, data: Partial<NewCredentialCommunity>) {
  const result = await updateCredentialCommunityEntry(id, data)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
  return result
}
export async function deleteCommunityEntryAction(id: string) {
  await deleteCredentialCommunityEntry(id)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
}
export async function reorderCommunityAction(orders: Array<{ id: string; order: number }>) {
  await reorderCredentialCommunity(orders)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
}

export async function createContributionAction(data: NewCredentialContribution) {
  const result = await createCredentialContribution(data)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
  return result
}
export async function updateContributionAction(id: string, data: Partial<NewCredentialContribution>) {
  const result = await updateCredentialContribution(id, data)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
  return result
}
export async function deleteContributionAction(id: string) {
  await deleteCredentialContribution(id)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
}
export async function reorderContributionsAction(orders: Array<{ id: string; order: number }>) {
  await reorderCredentialContributions(orders)
  revalidatePath('/admin/credentials')
  revalidatePath('/credentials')
}
