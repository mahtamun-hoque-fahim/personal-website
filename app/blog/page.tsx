import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { supabase, type BlogPost } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing about design, creativity, and building on the web.',
}

export const revalidate = 60

async function getPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  return data || []
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <Navbar />
      <main className="pt-32 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="pb-16 border-b border-[#1f1f1f] mb-16">
          <p
            className="text-[#00e676] text-xs tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Blog
          </p>
          <h1
            className="text-[clamp(2.5rem,7vw,6rem)] font-bold text-[#f0ede6] leading-[0.95] mb-6"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Things I think about
          </h1>
          <p
            className="text-[#8a8a8a] text-lg max-w-xl leading-relaxed"
            style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}
          >
            Writing about design systems, creative process, building products, and whatever
            I&apos;m obsessing over this month.
          </p>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="py-32 text-center">
            <p
              className="text-[#2a2a2a] text-8xl font-bold mb-6"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Soon.
            </p>
            <p
              className="text-[#8a8a8a] text-base"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              First post is being written. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {posts.map((post, i) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className="group flex flex-col md:flex-row gap-6 md:items-start py-10 border-b border-[#1f1f1f]
                           hover:bg-[#0d0d0d] -mx-6 px-6 transition-colors duration-200"
              >
                {/* Number */}
                <span
                  className="text-[#2a2a2a] text-sm shrink-0 mt-1 group-hover:text-[#00e676] transition-colors"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Main content */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 border border-[#1f1f1f] rounded-full text-[#8a8a8a]"
                        style={{ fontFamily: "'Onest', sans-serif" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2
                    className="text-xl md:text-2xl font-bold text-[#f0ede6] mb-2 group-hover:text-[#00e676] transition-colors"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="text-[#8a8a8a] text-sm leading-relaxed max-w-2xl"
                    style={{ fontFamily: "'Onest', sans-serif" }}
                  >
                    {post.excerpt}
                  </p>
                </div>

                {/* Meta */}
                <div className="shrink-0 text-right hidden md:block">
                  <p
                    className="text-[#8a8a8a] text-xs"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {formatDate(post.created_at)}
                  </p>
                  <p
                    className="text-[#2a2a2a] text-xs mt-1"
                    style={{ fontFamily: "'Onest', sans-serif" }}
                  >
                    {post.reading_time} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="py-16" />
      </main>
      <Footer />
    </>
  )
}
