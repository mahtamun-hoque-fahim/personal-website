

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth-utils'
import { getBlogPosts, type BlogPost } from '@/lib/db/queries'
import { formatDate } from '@/lib/utils'
import DeletePostButton from './DeletePostButton'

export default async function AdminPostsPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/admin/login')

  const posts = (await getBlogPosts()) as BlogPost[]

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-[#F3F6F4]" style={{ fontFamily: 'var(--font-jakarta)' }}>
          Blog Posts
        </h1>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 bg-[#3DF49A] text-[#06160E] text-sm font-semibold rounded-lg hover:bg-[#5BFBA8] transition-colors"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border border-[#1F2421] rounded-xl p-16 text-center">
          <p className="text-[#8A938E] text-sm mb-4" style={{ fontFamily: 'var(--font-jakarta)' }}>No posts yet.</p>
          <Link href="/admin/posts/new" className="text-[#3DF49A] text-sm" style={{ fontFamily: 'var(--font-jakarta)' }}>Write your first post →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#0F0F0F] border border-[#1F2421] rounded-xl px-6 py-5 flex items-center gap-6 hover:border-[#2B302D] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${post.published ? 'bg-[#3DF49A]/10 text-[#3DF49A] border border-[#3DF49A]/20' : 'bg-[#2B302D] text-[#8A938E] border border-[#1F2421]'}`} style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[#2B302D] text-xs" style={{ fontFamily: 'var(--font-jetbrains)' }}>{formatDate(post.createdAt)}</span>
                </div>
                <h3 className="text-[#F3F6F4] font-semibold truncate" style={{ fontFamily: 'var(--font-jakarta)' }}>{post.title}</h3>
                <p className="text-[#8A938E] text-xs truncate mt-0.5" style={{ fontFamily: 'var(--font-jakarta)' }}>{post.excerpt}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {post.published && (
                  <Link href={`/blog/${post.slug}`} target="_blank" className="text-xs text-[#8A938E] hover:text-[#F3F6F4] transition-colors" style={{ fontFamily: 'var(--font-jakarta)' }}>View ↗</Link>
                )}
                <Link href={`/admin/posts/${post.id}`} className="text-xs text-[#8A938E] hover:text-[#3DF49A] transition-colors px-3 py-1.5 border border-[#1F2421] rounded-lg" style={{ fontFamily: 'var(--font-jakarta)' }}>Edit</Link>
                <DeletePostButton id={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
