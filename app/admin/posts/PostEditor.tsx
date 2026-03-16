'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type BlogPost } from '@/lib/supabase'
import { slugify, estimateReadingTime } from '@/lib/utils'

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
  const [coverImage, setCoverImage] = useState(post?.cover_image || '')
  const [published, setPublished] = useState(post?.published || false)

  // Auto-generate slug from title
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

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      cover_image: coverImage.trim() || null,
      published,
      reading_time: estimateReadingTime(content),
      updated_at: new Date().toISOString(),
    }

    let error

    if (post) {
      const res = await supabase.from('blog_posts').update(payload).eq('id', post.id)
      error = res.error
    } else {
      const res = await supabase.from('blog_posts').insert({
        ...payload,
        created_at: new Date().toISOString(),
      })
      error = res.error
    }

    setSaving(false)

    if (error) {
      alert('Error saving: ' + error.message)
      return
    }

    router.push('/admin/posts')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-xs text-[#8a8a8a] mb-2 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-lg text-[#f0ede6]
                     placeholder:text-[#2a2a2a] focus:outline-none focus:border-[#00e676] transition-colors font-bold"
          style={{ fontFamily: "'Syne', sans-serif" }}
        />
      </div>

      {/* Slug + Excerpt row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#8a8a8a] mb-2 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-sm text-[#f0ede6]
                       focus:outline-none focus:border-[#00e676] transition-colors"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <div>
          <label className="block text-xs text-[#8a8a8a] mb-2 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="design, process, ui"
            className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-sm text-[#f0ede6]
                       placeholder:text-[#2a2a2a] focus:outline-none focus:border-[#00e676] transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-xs text-[#8a8a8a] mb-2 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Excerpt
        </label>
        <textarea
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short description shown on the blog listing..."
          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-[#f0ede6]
                     placeholder:text-[#2a2a2a] focus:outline-none focus:border-[#00e676] transition-colors resize-none"
          style={{ fontFamily: "'Onest', sans-serif" }}
        />
      </div>

      {/* Cover image */}
      <div>
        <label className="block text-xs text-[#8a8a8a] mb-2 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Cover image URL (optional)
        </label>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://..."
          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-sm text-[#f0ede6]
                     placeholder:text-[#2a2a2a] focus:outline-none focus:border-[#00e676] transition-colors"
          style={{ fontFamily: "'Onest', sans-serif" }}
        />
      </div>

      {/* Markdown editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-[#8a8a8a] tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Content * (Markdown)
          </label>
          <div className="flex gap-1">
            {(['write', 'preview'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-xs px-3 py-1 rounded transition-colors ${
                  tab === t
                    ? 'bg-[#00e676] text-black font-medium'
                    : 'text-[#8a8a8a] hover:text-[#f0ede6]'
                }`}
                style={{ fontFamily: "'Onest', sans-serif" }}
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
            placeholder="Write your post in Markdown...&#10;&#10;## Heading&#10;&#10;Some **bold** text and `code`."
            className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-4 text-sm text-[#f0ede6]
                       placeholder:text-[#2a2a2a] focus:outline-none focus:border-[#00e676] transition-colors resize-none leading-relaxed"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        ) : (
          <div
            className="min-h-[480px] bg-[#141414] border border-[#1f1f1f] rounded-lg p-6 prose-dark"
            dangerouslySetInnerHTML={{ __html: content || '<p style="color:#2a2a2a">Nothing to preview yet.</p>' }}
          />
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1f1f1f]">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
              published ? 'bg-[#00e676]' : 'bg-[#2a2a2a]'
            }`}
            onClick={() => setPublished(!published)}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                published ? 'left-5' : 'left-1'
              }`}
            />
          </div>
          <span className="text-sm text-[#8a8a8a] group-hover:text-[#f0ede6] transition-colors" style={{ fontFamily: "'Onest', sans-serif" }}>
            {published ? 'Published' : 'Draft'}
          </span>
        </label>

        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 border border-[#1f1f1f] text-[#8a8a8a] text-sm rounded-lg hover:border-[#2a2a2a] hover:text-[#f0ede6] transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#00e676] text-black text-sm font-semibold rounded-lg
                       hover:bg-[#00b85a] transition-colors disabled:opacity-50"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            {saving ? 'Saving...' : post ? 'Update post' : 'Create post'}
          </button>
        </div>
      </div>
    </div>
  )
}
