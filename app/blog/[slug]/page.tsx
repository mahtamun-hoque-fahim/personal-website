export const runtime = 'edge'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { supabase, type BlogPost } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const revalidate = 60

async function getPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        {/* Back */}
        <div className="max-w-3xl mx-auto px-6 mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#8a8a8a] text-sm hover:text-[#00e676] transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            ← Back to blog
          </Link>
        </div>

        {/* Header */}
        <header className="max-w-3xl mx-auto px-6 mb-12">
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 border border-[#00e676]/30 rounded-full text-[#00e676]"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1
            className="text-4xl md:text-6xl font-bold text-[#f0ede6] leading-tight mb-6"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {post.title}
          </h1>

          <p
            className="text-[#8a8a8a] text-lg leading-relaxed mb-8"
            style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}
          >
            {post.excerpt}
          </p>

          <div
            className="flex items-center gap-6 text-xs text-[#8a8a8a] border-t border-[#1f1f1f] pt-6"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span>Mahtamun Hoque Fahim</span>
            <span className="text-[#2a2a2a]">·</span>
            <span>{formatDate(post.created_at)}</span>
            <span className="text-[#2a2a2a]">·</span>
            <span>{post.reading_time} min read</span>
          </div>
        </header>

        {/* Cover image */}
        {post.cover_image && (
          <div className="max-w-4xl mx-auto px-6 mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full rounded-xl border border-[#1f1f1f] object-cover"
              style={{ maxHeight: '480px' }}
            />
          </div>
        )}

        {/* Content */}
        <article className="max-w-3xl mx-auto px-6">
          <div className="prose-dark">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Footer nav */}
        <div className="max-w-3xl mx-auto px-6 mt-20 pt-8 border-t border-[#1f1f1f]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#8a8a8a] hover:text-[#00e676] transition-colors text-sm"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            ← All posts
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
