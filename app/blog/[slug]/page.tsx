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
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: post.coverImage ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
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
            className="inline-block text-[#8A938E] text-sm mb-12 hover:text-[#3DF49A] transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            ← Back to blog
          </Link>

          <div className="mb-8">
            <h1
              className="text-4xl md:text-5xl font-bold text-[#F3F6F4] mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              {post.title}
            </h1>

            <div
              className="flex items-center gap-4 text-sm text-[#8A938E]"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          {post.coverImage && (
            <div
              className="mb-12 rounded-lg overflow-hidden border border-[#1F2421] bg-[#0F0F0F]"
              style={{ aspectRatio: '1200 / 630' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                width={1200}
                height={630}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          <article
            className="prose-dark"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
          <CopyCodeInit />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-[#1F2421] flex flex-wrap items-center gap-2">
              <span
                className="text-xs text-[#8A938E] mr-1"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                Tagged
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 border border-[#1F2421] text-[#8A938E] rounded
                             whitespace-nowrap flex-shrink-0
                             hover:text-[#3DF49A] hover:border-[#3DF49A] transition-colors duration-150"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
