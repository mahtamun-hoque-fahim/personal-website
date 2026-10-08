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

export const footerLinks = pgTable(
  'footer_links',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    label: text('label').notNull(),
    url: text('url').notNull(),
    groupLabel: text('group_label').notNull().default('Nav'),
    external: boolean('external').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sortIdx: index('footer_links_sort_idx').on(t.sortOrder),
  })
)

export const skills = pgTable(
  'skills',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    desc: text('desc').notNull(),
    imageUrl: text('image_url'),
    imagePosition: text('image_position').notNull().default('left'), // 'left' | 'right'
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sortIdx: index('skills_sort_idx').on(t.sortOrder),
  })
)

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
  skillsLayout: text('skills_layout').notNull().default('rows'), // 'rows' | 'columns'
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ──────────────────────────────────────────────────────────
// About page content (single row, id always 1 — dashboard-driven copy)
// ──────────────────────────────────────────────────────────

export const aboutContent = pgTable('about_content', {
  id: integer('id').primaryKey().default(1),
  headlineTop: text('headline_top').notNull().default('Designer who codes.'),
  headlineAccent: text('headline_accent').notNull().default('Developer who designs.'),
  intro: text('intro')
    .notNull()
    .default(
      "I'm Mahtamun Hoque Fahim. I grew up in Bangladesh with an internet connection and an obsession with how things look and work. That combination became a career."
    ),
  storyHeading: text('story_heading').notNull().default('The honest story'),
  storyParagraphs: text('story_paragraphs')
    .array()
    .notNull()
    .default(
      sql`ARRAY['I didn''t study design in a formal school. I learned by obsessively reverse-engineering things I loved: breaking down why a logo felt trustworthy, why a website felt fast, why some interfaces made you feel calm.','I started building websites because I couldn''t communicate what I wanted to developers. I started designing seriously because I couldn''t stand ugly interfaces. Both accidents became strengths.','Being from Bangladesh sharpened me. I couldn''t rely on proximity to opportunity, so I had to be undeniably good. That''s still the standard I hold myself to.','I care about work that ships, that works, that people actually use. Beautiful for its own sake doesn''t interest me. Beautiful and functional? That''s the whole game.']::text[]`
    ),
  ctaHeading: text('cta_heading').notNull().default('Want to work together?'),
  ctaText: text('cta_text')
    .notNull()
    .default("I'm selective about what I take on, which means I care about what you're building."),
  ctaPrimaryLabel: text('cta_primary_label').notNull().default('Get in touch'),
  ctaSecondaryLabel: text('cta_secondary_label').notNull().default('See portfolio'),
  // Homepage teaser ("personality" section) and its code-style card
  homeHeading: text('home_heading')
    .notNull()
    .default("Design can't be separated from engineering."),
  homeParagraphOne: text('home_paragraph_one')
    .notNull()
    .default(
      "Most designers hand off to developers. Most developers leave security for last. I do it all, because I don't rest till I build the best."
    ),
  homeParagraphTwo: text('home_paragraph_two')
    .notNull()
    .default(
      'I am obsessively curious about the space between pixels. I write code the way I design, with intention. I love what I do, and coffee? More.'
    ),
  homeLinkLabel: text('home_link_label').notNull().default('Full story'),
  homeCardRole: text('home_card_role').notNull().default('Polymath'),
  homeCardDescription: text('home_card_description')
    .array()
    .notNull()
    .default(sql`ARRAY['Design','Develop','Secure']::text[]`),
  homeCardStack: text('home_card_stack')
    .array()
    .notNull()
    .default(sql`ARRAY['Next.js','Figma','Postgres']::text[]`),
  homeCardAvailability: text('home_card_availability')
    .array()
    .notNull()
    .default(sql`ARRAY['Remote','Hybrid','Onsite']::text[]`),
  homeCardObsessions: text('home_card_obsessions')
    .array()
    .notNull()
    .default(sql`ARRAY['Sky','Grass','coffee']::text[]`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ── Inferred types ────────────────────────────────────────
export type BlogPost = typeof blogPosts.$inferSelect
export type NewBlogPost = typeof blogPosts.$inferInsert
export type ContactMessage = typeof contactMessages.$inferSelect
export type NewContactMessage = typeof contactMessages.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert
export type FooterLink = typeof footerLinks.$inferSelect
export type NewFooterLink = typeof footerLinks.$inferInsert

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
export type AboutContent = typeof aboutContent.$inferSelect
export type NewAboutContent = typeof aboutContent.$inferInsert
