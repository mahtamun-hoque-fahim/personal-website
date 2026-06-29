'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { BlogPost, NewBlogPost } from '@/lib/db/queries'
import { saveBlogPostAction } from '@/app/admin/actions'
import { slugify, estimateReadingTime } from '@/lib/utils'
import { renderMarkdown } from '@/lib/markdown'
import CopyCodeInit from '@/components/CopyCodeInit'

type Props = {
  post?: BlogPost
}

export default function PostEditor({ post }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState(post?.content || '')
  const [tags, setTags] = useState(post?.tags?.join(', ') || '')
  const [coverImage, setCoverImage] = useState(post?.coverImage || '')
  const [published, setPublished] = useState(post?.published || false)

  // Auto-generate slug from title for new posts
  useEffect(() => {
    if (!post) {
      setSlug(slugify(title))
    }
  }, [title, post])

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required.')
      return
    }

    setSaving(true)

    const payload: Partial<NewBlogPost> = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      coverImage: coverImage.trim() || null,
      published,
      readingTime: estimateReadingTime(content),
    }

    try {
      if (post) {
        await saveBlogPostAction(payload, post.id)
      } else {
        await saveBlogPostAction(payload)
      }
    } catch (e) {
      setSaving(false)
      alert('Error saving: ' + (e instanceof Error ? e.message : String(e)))
      return
    }

    setSaving(false)
    router.push('/admin/posts')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Title + slug */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label
            className="block text-xs text-[#8A938E] mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full bg-[#0F0F0F] border border-[#1F2421] rounded-lg px-4 py-2.5 text-sm text-[#F3F6F4]
                       placeholder:text-[#2B302D] focus:outline-none focus:border-[#3DF49A] transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </div>
        <div>
          <label
            className="block text-xs text-[#8A938E] mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-slug"
            className="w-full bg-[#0F0F0F] border border-[#1F2421] rounded-lg px-4 py-2.5 text-sm text-[#F3F6F4]
                       placeholder:text-[#2B302D] focus:outline-none focus:border-[#3DF49A] transition-colors"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-xs text-[#8A938E] mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="design, process, ui"
            className="w-full bg-[#0F0F0F] border border-[#1F2421] rounded-lg px-4 py-2.5 text-sm text-[#F3F6F4]
                       placeholder:text-[#2B302D] focus:outline-none focus:border-[#3DF49A] transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </div>
        <div>
          <label
            className="block text-xs text-[#8A938E] mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Cover image URL (optional)
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
            className="w-full bg-[#0F0F0F] border border-[#1F2421] rounded-lg px-4 py-2.5 text-sm text-[#F3F6F4]
                       placeholder:text-[#2B302D] focus:outline-none focus:border-[#3DF49A] transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
          <p
            className="text-xs text-[#2B302D] mt-1.5"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Recommended: 1200×630px (1.91:1). Also used as the social share preview image.
          </p>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label
          className="block text-xs text-[#8A938E] mb-2 tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          Excerpt
        </label>
        <textarea
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short description shown on the blog listing..."
          className="w-full bg-[#0F0F0F] border border-[#1F2421] rounded-lg px-4 py-3 text-sm text-[#F3F6F4]
                     placeholder:text-[#2B302D] focus:outline-none focus:border-[#3DF49A] transition-colors resize-none"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        />
      </div>

      {/* Markdown editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            className="text-xs text-[#8A938E] tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Content * (Markdown)
          </label>
          <div className="flex gap-1">
            {(['write', 'preview'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-xs px-3 py-1 rounded transition-colors ${
                  tab === t
                    ? 'bg-[#3DF49A] text-[#06160E] font-medium'
                    : 'text-[#8A938E] hover:text-[#F3F6F4]'
                }`}
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {t === 'write' ? 'Write' : 'Preview'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'write' ? (
          <textarea
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"Write your post in Markdown...\n\n## Heading\n\nSome **bold** text and `code`."}
            className="w-full bg-[#0F0F0F] border border-[#1F2421] rounded-lg px-4 py-4 text-sm text-[#F3F6F4]
                       placeholder:text-[#2B302D] focus:outline-none focus:border-[#3DF49A] transition-colors resize-none leading-relaxed"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          />
        ) : (
          <>
            <div
              className="min-h-[480px] bg-[#0F0F0F] border border-[#1F2421] rounded-lg p-6 prose-dark"
              dangerouslySetInnerHTML={{
                __html: content
                  ? renderMarkdown(content)
                  : '<p style="color:#2B302D">Nothing to preview yet.</p>',
              }}
            />
            <CopyCodeInit />
          </>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1F2421]">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
              published ? 'bg-[#3DF49A]' : 'bg-[#2B302D]'
            }`}
            onClick={() => setPublished(!published)}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                published ? 'left-5' : 'left-1'
              }`}
            />
          </div>
          <span
            className="text-sm text-[#8A938E] group-hover:text-[#F3F6F4] transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            {published ? 'Published' : 'Draft'}
          </span>
        </label>

        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 border border-[#1F2421] text-[#8A938E] text-sm rounded-lg hover:border-[#2B302D] hover:text-[#F3F6F4] transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#3DF49A] text-[#06160E] text-sm font-semibold rounded-lg
                       hover:bg-[#5BFBA8] transition-colors disabled:opacity-50"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            {saving ? 'Saving...' : post ? 'Update post' : 'Create post'}
          </button>
        </div>
      </div>
    </div>
  )
}
