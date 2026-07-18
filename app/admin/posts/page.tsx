import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth-utils'
import { getBlogPosts, type BlogPost } from '@/lib/db/queries'
import PostsSearchList from './PostsSearchList'

export default async function AdminPostsPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/admin/login')

  const posts = (await getBlogPosts()) as BlogPost[]

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1
          className="text-4xl font-bold text-[#F3F6F4]"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
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

      <PostsSearchList posts={posts} />
    </div>
  )
}
