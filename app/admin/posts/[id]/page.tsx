export const runtime = 'edge'

import { redirect, notFound } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import PostEditor from '../PostEditor'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/admin/login')

  const result = await db`SELECT * FROM blog_posts WHERE id = ${params.id}`
  const post = result?.[0] || null
  if (!post) notFound()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-[#f0ede6] mb-10" style={{ fontFamily: "'Syne', sans-serif" }}>Edit Post</h1>
      <PostEditor post={post} />
    </div>
  )
}
