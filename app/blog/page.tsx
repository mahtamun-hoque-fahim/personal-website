

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getBlogPosts, getBlogPostBySlug, type BlogPost } from '@/lib/db/queries'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing about design, creativity, and building on the web.',
}

export const revalidate = 60

async function getPosts(): Promise<BlogPost[]> {
  return (await getBlogPosts({ publishedOnly: true })) as BlogPost[]
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <Navbar />
      <main className="pt-32 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="pb-16 border-b border-[#1F2421] mb-16">
          <p
            className="text-[#3DF49A] text-xs tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Blog
          </p>
          <h1
            className="text-[clamp(2.5rem,7vw,6rem)] font-bold text-[#F3F6F4] leading-[0.95] mb-6"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Things I think about
          </h1>
          <p
            className="text-[#8A938E] text-lg max-w-xl leading-relaxed"
            style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
          >
            Writing about design systems, creative process, building products, and whatever
            I&apos;m obsessing over this month.
          </p>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="py-32 text-center">
            <p
              className="text-[#2B302D] text-8xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              Soon.
            </p>
            <p
              className="text-[#8A938E] text-base"
              style={{ fontFamily: 'var(--font-jakarta)' }}
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
                className="group flex flex-col md:flex-row gap-6 md:items-start py-10 border-b border-[#1F2421]
                           hover:bg-[#090A09] -mx-6 px-6 transition-colors duration-200"
              >
                {/* Number */}
                <span
                  className="text-[#2B302D] text-sm shrink-0 mt-1 group-hover:text-[#3DF49A] transition-colors"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Thumbnail */}
                {post.coverImage && (
                  <div
                    className="shrink-0 w-full md:w-32 rounded-md overflow-hidden border border-[#1F2421] bg-[#0F0F0F]"
                    style={{ aspectRatio: '1200 / 630' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      width={1200}
                      height={630}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Main content */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 border border-[#1F2421] rounded-full text-[#8A938E]"
                        style={{ fontFamily: 'var(--font-jakarta)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2
                    className="text-xl md:text-2xl font-bold text-[#F3F6F4] mb-2 group-hover:text-[#3DF49A] transition-colors"
                    style={{ fontFamily: 'var(--font-clash)' }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="text-[#8A938E] text-sm leading-relaxed max-w-2xl"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                  >
                    {post.excerpt}
                  </p>
                </div>

                {/* Meta */}
                <div className="shrink-0 text-right hidden md:block">
                  <p
                    className="text-[#8A938E] text-xs"
                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                  >
                    {formatDate(post.createdAt)}
                  </p>
                  <p
                    className="text-[#2B302D] text-xs mt-1"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                  >
                    {post.readingTime} min read
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
