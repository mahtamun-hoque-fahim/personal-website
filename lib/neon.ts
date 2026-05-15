import { db } from './db'

/**
 * Database queries for blog_posts, contact_messages, and projects tables
 * Using Neon PostgreSQL
 */

// Blog Posts
export async function getBlogPosts(published?: boolean, limit?: number, offset?: number) {
  let query = 'SELECT * FROM blog_posts'
  const params: any[] = []
  
  if (published !== undefined) {
    query += ` WHERE published = $${params.length + 1}`
    params.push(published)
  }
  
  query += ' ORDER BY created_at DESC'
  
  if (limit) {
    query += ` LIMIT $${params.length + 1}`
    params.push(limit)
  }
  if (offset) {
    query += ` OFFSET $${params.length + 1}`
    params.push(offset)
  }
  
  try {
    return await db(query, params)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const result = await db('SELECT * FROM blog_posts WHERE slug = $1', [slug])
    return result?.[0] || null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function createBlogPost(post: any) {
  const { title, slug, excerpt, content, cover_image, published, tags, reading_time } = post
  try {
    const result = await db(
      `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, published, tags, reading_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, slug, excerpt, content, cover_image, published, tags, reading_time || 1]
    )
    return result?.[0] || null
  } catch (error) {
    console.error('Error creating blog post:', error)
    throw error
  }
}

export async function updateBlogPost(id: string, updates: any) {
  const fields: string[] = []
  const values: any[] = []
  let paramIndex = 1
  
  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = $${paramIndex}`)
    values.push(value)
    paramIndex++
  })
  
  values.push(id)
  
  try {
    const result = await db(
      `UPDATE blog_posts SET ${fields.join(', ')}, updated_at = now() WHERE id = $${paramIndex} RETURNING *`,
      values
    )
    return result?.[0] || null
  } catch (error) {
    console.error('Error updating blog post:', error)
    throw error
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await db('DELETE FROM blog_posts WHERE id = $1', [id])
  } catch (error) {
    console.error('Error deleting blog post:', error)
    throw error
  }
}

// Contact Messages
export async function getContactMessages(unreadOnly?: boolean, limit?: number) {
  let query = 'SELECT * FROM contact_messages'
  const params: any[] = []
  
  if (unreadOnly) {
    query += ' WHERE read = false'
  }
  
  query += ' ORDER BY created_at DESC'
  
  if (limit) {
    query += ` LIMIT $${params.length + 1}`
    params.push(limit)
  }
  
  try {
    return await db(query, params)
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return []
  }
}

export async function createContactMessage(message: any) {
  const { name, email, subject, message: msg } = message
  try {
    const result = await db(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, subject, msg]
    )
    return result?.[0] || null
  } catch (error) {
    console.error('Error creating contact message:', error)
    throw error
  }
}

export async function updateContactMessage(id: string, updates: any) {
  const fields: string[] = []
  const values: any[] = []
  let paramIndex = 1
  
  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = $${paramIndex}`)
    values.push(value)
    paramIndex++
  })
  
  values.push(id)
  
  try {
    const result = await db(
      `UPDATE contact_messages SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )
    return result?.[0] || null
  } catch (error) {
    console.error('Error updating contact message:', error)
    throw error
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await db('DELETE FROM contact_messages WHERE id = $1', [id])
  } catch (error) {
    console.error('Error deleting contact message:', error)
    throw error
  }
}

// Projects
export async function getProjects(featuredOnly?: boolean) {
  let query = 'SELECT * FROM projects'
  const params: any[] = []
  
  if (featuredOnly) {
    query += ' WHERE featured = true ORDER BY featured_order ASC'
  } else {
    query += ' ORDER BY name ASC'
  }
  
  try {
    return await db(query, params)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function updateProjectFeatured(id: string, featured: boolean, order?: number) {
  try {
    if (featured) {
      // Get max order
      const maxResult = await db('SELECT MAX(featured_order) as max_order FROM projects WHERE featured = true')
      const maxOrder = maxResult?.[0]?.max_order || 0
      
      const result = await db(
        `UPDATE projects SET featured = $1, featured_order = $2, updated_at = now() WHERE id = $3 RETURNING *`,
        [true, maxOrder + 1, id]
      )
      return result?.[0] || null
    } else {
      const result = await db(
        `UPDATE projects SET featured = $1, featured_order = null, updated_at = now() WHERE id = $2 RETURNING *`,
        [false, id]
      )
      return result?.[0] || null
    }
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export async function reorderProjects(orders: { id: string; order: number }[]) {
  try {
    for (const { id, order } of orders) {
      await db(
        `UPDATE projects SET featured_order = $1, updated_at = now() WHERE id = $2`,
        [order, id]
      )
    }
  } catch (error) {
    console.error('Error reordering projects:', error)
    throw error
  }
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  published: boolean
  tags: string[]
  reading_time: number
  created_at: string
  updated_at: string
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

export type Project = {
  id: string
  name: string
  tagline: string
  description: string
  tags: string[]
  type: string
  live_url: string | null
  repo_url: string
  featured: boolean
  featured_order: number | null
  created_at: string
  updated_at: string
}
