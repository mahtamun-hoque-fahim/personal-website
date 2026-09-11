import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

// ──────────────────────────────────────────────────────────
// Better Auth tables (standard schema, singular table names)
// ──────────────────────────────────────────────────────────

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ──────────────────────────────────────────────────────────
// Application tables (mirror existing production schema)
// ──────────────────────────────────────────────────────────

export const blogPosts = pgTable(
  'blog_posts',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    excerpt: text('excerpt').notNull().default(''),
    content: text('content').notNull().default(''),
    coverImage: text('cover_image'),
    published: boolean('published').notNull().default(false),
    tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
    readingTime: integer('reading_time').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: index('blog_posts_slug_idx').on(t.slug),
    publishedIdx: index('blog_posts_published_idx').on(t.published, t.createdAt),
  })
)

export const contactMessages = pgTable(
  'contact_messages',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject').notNull().default(''),
    message: text('message').notNull(),
    country: text('country'),
    read: boolean('read').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    readIdx: index('contact_messages_read_idx').on(t.read, t.createdAt),
  })
)

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').notNull().unique(),
    tagline: text('tagline').notNull(),
    description: text('description').notNull(),
    tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
    type: text('type').notNull(),
    liveUrl: text('live_url'),
    repoUrl: text('repo_url').notNull(),
    featured: boolean('featured').notNull().default(false),
    featuredOrder: integer('featured_order'),
    statusBadges: text('status_badges').array().notNull().default(sql`'{}'::text[]`),
    collaborators: jsonb('collaborators')
      .$type<Array<{ name: string; url?: string | null }>>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    featuredIdx: index('projects_featured_idx').on(t.featured, t.featuredOrder),
  })
)

// ──────────────────────────────────────────────────────────
// Credentials tables
// ──────────────────────────────────────────────────────────

export const credentialTimeline = pgTable(
  'credential_timeline',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    year: text('year').notNull(),
    period: text('period').notNull(),
    title: text('title').notNull(),
    org: text('org').notNull(),
    desc: text('desc').notNull(),
    tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
    type: text('type').notNull().default('work'), // 'work' | 'education' | 'milestone'
    isCurrent: boolean('is_current').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sortIdx: index('credential_timeline_sort_idx').on(t.sortOrder),
  })
)

export const credentialClusters = pgTable(
  'credential_clusters',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    iconId: text('icon_id').notNull().default('other'), // 'ai'|'webdev'|'design'|'humanitarian'|'foundational'|'other'
    badge: text('badge'),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sortIdx: index('credential_clusters_sort_idx').on(t.sortOrder),
  })
)

export const credentialCerts = pgTable(
  'credential_certs',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    clusterId: uuid('cluster_id')
      .notNull()
      .references(() => credentialClusters.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    issuer: text('issuer').notNull(),
    date: text('date').notNull(),
    ects: real('ects'),
    credentialId: text('credential_id'),
    isFoundational: boolean('is_foundational').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    clusterIdx: index('credential_certs_cluster_idx').on(t.clusterId, t.sortOrder),
  })
)

export const credentialCommunity = pgTable(
  'credential_community',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    org: text('org').notNull(),
    period: text('period').notNull(),
    category: text('category').notNull().default(''),
    ongoing: boolean('ongoing').notNull().default(false),
    details: text('details').array().notNull().default(sql`'{}'::text[]`),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sortIdx: index('credential_community_sort_idx').on(t.sortOrder),
  })
)

export const credentialContributions = pgTable(
  'credential_contributions',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    releases: text('releases').notNull(),
    desc: text('desc').notNull(),
    link: text('link').notNull(),
    linkLabel: text('link_label').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sortIdx: index('credential_contributions_sort_idx').on(t.sortOrder),
  })
)

// ──────────────────────────────────────────────────────────
// Site settings (single row, id always 1 — dashboard-driven metadata)
// ──────────────────────────────────────────────────────────

export const siteSettings = pgTable('site_settings', {
  id: integer('id').primaryKey().default(1),
  title: text('title')
    .notNull()
    .default('Mahtamun Hoque Fahim — Full-Stack Developer & AI Engineer'),
  description: text('description')
    .notNull()
    .default(
      'Full-stack developer and AI engineer from Bangladesh. Building web apps, tools, and digital products.'
    ),
  jobTitle: text('job_title').notNull().default('Full-Stack Developer & AI Engineer'),
  avatarUrl: text('avatar_url'),
  keywords: text('keywords')
    .array()
    .notNull()
    .default(
      sql`ARRAY['developer','AI engineer','full-stack developer','Bangladesh','Next.js','TypeScript','mahtamun','mahtamun hoque fahim']::text[]`
    ),
  ogTitle: text('og_title')
    .notNull()
    .default('Mahtamun Hoque Fahim — Full-Stack Developer & AI Engineer'),
  ogDescription: text('og_description')
    .notNull()
    .default(
      'Full-stack developer and AI engineer from Bangladesh. Building web apps, tools, and digital products.'
    ),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Inferred types ────────────────────────────────────────
export type BlogPost = typeof blogPosts.$inferSelect
export type NewBlogPost = typeof blogPosts.$inferInsert
export type ContactMessage = typeof contactMessages.$inferSelect
export type NewContactMessage = typeof contactMessages.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type CredentialTimeline = typeof credentialTimeline.$inferSelect
export type NewCredentialTimeline = typeof credentialTimeline.$inferInsert
export type CredentialCluster = typeof credentialClusters.$inferSelect
export type NewCredentialCluster = typeof credentialClusters.$inferInsert
export type CredentialCert = typeof credentialCerts.$inferSelect
export type NewCredentialCert = typeof credentialCerts.$inferInsert
export type CredentialCommunity = typeof credentialCommunity.$inferSelect
export type NewCredentialCommunity = typeof credentialCommunity.$inferInsert
export type CredentialContribution = typeof credentialContributions.$inferSelect
export type NewCredentialContribution = typeof credentialContributions.$inferInsert
export type SiteSettings = typeof siteSettings.$inferSelect
export type NewSiteSettings = typeof siteSettings.$inferInsert
