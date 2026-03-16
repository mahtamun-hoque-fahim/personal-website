import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { supabase, type BlogPost } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import DeletePostButton from './DeletePostButton'

const ADMIN_COOKIE = 'fahim_admin_session'

async function getPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function AdminPostsPage() {
  const cookieStore = cookies()
  if (cookieStore.get(ADMIN_COOKIE)?.value !== 'authenticated') redirect('/admin/login')

  const posts = await getPosts()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1
          className="text-4xl font-bold text-[#f0ede6]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Blog Posts
        </h1>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 bg-[#00e676] text-black text-sm font-semibold rounded-lg hover:bg-[#00b85a] transition-colors"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border border-[#1f1f1f] rounded-xl p-16 text-center">
          <p className="text-[#8a8a8a] text-sm mb-4" style={{ fontFamily: "'Onest', sans-serif" }}>
            No posts yet.
          </p>
          <Link href="/admin/posts/new" className="text-[#00e676] text-sm" style={{ fontFamily: "'Onest', sans-serif" }}>
            Write your first post →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#141414] border border-[#1f1f1f] rounded-xl px-6 py-5 flex items-center gap-6 hover:border-[#2a2a2a] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      post.published
                        ? 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20'
                        : 'bg-[#2a2a2a] text-[#8a8a8a] border border-[#1f1f1f]'
                    }`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[#2a2a2a] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatDate(post.created_at)}
                  </span>
                </div>
                <h3
                  className="text-[#f0ede6] font-semibold truncate"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-[#8a8a8a] text-xs truncate mt-0.5"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {post.published && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="text-xs text-[#8a8a8a] hover:text-[#f0ede6] transition-colors"
                    style={{ fontFamily: "'Onest', sans-serif" }}
                  >
                    View ↗
                  </Link>
                )}
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="text-xs text-[#8a8a8a] hover:text-[#00e676] transition-colors px-3 py-1.5 border border-[#1f1f1f] rounded-lg"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  Edit
                </Link>
                <DeletePostButton id={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
