import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getBlogPostBySlug, type BlogPost } from '@/lib/db/queries'
import { formatDate } from '@/lib/utils'
import { renderMarkdown } from '@/lib/markdown'
import CopyCodeInit from '@/components/CopyCodeInit'

export const revalidate = 60

async function getPost(slug: string): Promise<BlogPost | null> {
  return getBlogPostBySlug(slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <>
      <Navbar />
      <main>
        <section className="max-w-3xl mx-auto px-6 py-24 pt-32">
          <Link
            href="/blog"
            className="inline-block text-[#8a8a8a] text-sm mb-12 hover:text-[#00e676] transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            ← Back to blog
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 border border-[#1f1f1f] text-[#8a8a8a] rounded"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold text-[#f0ede6] mb-6 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {post.title}
            </h1>

            <div
              className="flex items-center gap-4 text-sm text-[#8a8a8a]"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          <article
            className="prose-dark"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
          <CopyCodeInit />
        </section>
      </main>
      <Footer />
    </>
  )
}
