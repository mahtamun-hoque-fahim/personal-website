

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getBlogPosts, getBlogPostBySlug, type BlogPost } from '@/lib/db/queries'
import { formatDate } from '@/lib/utils'
import { getCoverUrl } from '@/lib/blog-image'
import BlurWords from '@/components/BlurWords'
import Reveal from '@/components/Reveal'
import type { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing about design, creativity, and building on the web.',
  alternates: {
    canonical: 'https://mahtamunhoquefahim.vercel.app/blog',
  },
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
        <div className="pb-16 border-b border-[#333333] mb-16">
          <p
            className="text-[#3DF49A] text-xs tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Blog
          </p>
          <BlurWords as="h1" text="Things I think about" mode="load" className="text-[clamp(2.5rem,7vw,6rem)] font-bold text-[#F3F6F4] leading-[0.95] mb-6" style={{ fontFamily: 'var(--font-clash)' }} />
          <p
            className="blur-load text-[#8A938E] text-lg max-w-xl leading-relaxed"
            style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300, '--reveal-delay': '220ms' } as CSSProperties}
          >
            Writing about design systems, creative process, building products, and whatever
            I&apos;m obsessing over this month.
          </p>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="py-32 text-center">
            <p
              className="text-[#5C615E] text-8xl font-bold mb-6"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, i) => {
              const isLastOdd = i === posts.length - 1 && posts.length % 2 === 1

              return (
                <Reveal
                  key={post.id}
                  className={isLastOdd ? 'md:col-span-2' : ''}
                  delay={(i % 2) * 180}
                  // cover images are large: a lighter blur keeps the reveal cheap
                  style={{ '--blur-from': '3px' } as CSSProperties}
                >
                <Link
                  href={`/blog/${post.slug}`}
                  className={`group block h-full rounded-xl border border-[#333333] bg-[#222222] overflow-hidden
                              hover:border-[#3DF49A]/40 transition-colors duration-200
                              ${isLastOdd ? 'md:flex md:items-stretch' : ''}`}
                >
                  {/* Cover image */}
                  <div
                    className={
                      isLastOdd
                        ? 'aspect-[1200/630] md:aspect-auto md:w-2/5 md:shrink-0 overflow-hidden bg-[#000000]'
                        : 'aspect-[1200/630] w-full overflow-hidden bg-[#000000]'
                    }
                  >
                    {true ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getCoverUrl(post.slug, post.coverImage)}
                        alt={post.title}
                        width={1200}
                        height={630}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        {...(i === 0 ? { fetchPriority: 'high' as const } : {})}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span
                          className="text-[#5C615E] text-4xl font-bold"
                          style={{ fontFamily: 'var(--font-clash)' }}
                        >
                          {post.title.slice(0, 1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={isLastOdd ? 'p-6 md:p-8 flex-1 flex flex-col justify-center' : 'p-6'}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex gap-2 min-w-0">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 border border-[#333333] rounded-full text-[#8A938E] truncate"
                            style={{ fontFamily: 'var(--font-jakarta)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p
                        className="text-[#5C615E] text-xs shrink-0"
                        style={{ fontFamily: 'var(--font-jetbrains)' }}
                      >
                        {post.readingTime} min read
                      </p>
                    </div>

                    <h2
                      className={`font-bold text-[#F3F6F4] mb-2 group-hover:text-[#3DF49A] transition-colors ${
                        isLastOdd ? 'text-2xl md:text-3xl' : 'text-xl'
                      }`}
                      style={{ fontFamily: 'var(--font-clash)' }}
                    >
                      {post.title}
                    </h2>
                    <p
                      className={`text-[#8A938E] text-sm leading-relaxed ${
                        isLastOdd ? 'line-clamp-3' : 'line-clamp-2'
                      }`}
                      style={{ fontFamily: 'var(--font-jakarta)' }}
                    >
                      {post.excerpt}
                    </p>
                    <p
                      className="text-[#8A938E] text-xs mt-4"
                      style={{ fontFamily: 'var(--font-jetbrains)' }}
                    >
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </Link>
                </Reveal>
              )
            })}
          </div>
        )}

        <div className="py-16" />
      </main>
      <Footer />
    </>
  )
}
