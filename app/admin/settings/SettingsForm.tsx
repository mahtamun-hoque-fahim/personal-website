'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, X } from 'lucide-react'
import type { SiteSettings, NewSiteSettings } from '@/lib/db/queries'
import { MAX_AVATAR_BYTES } from '@/lib/constants'
import { saveSiteSettingsAction, uploadAvatarAction, removeAvatarAction } from '@/app/admin/actions'

type Props = {
  settings: SiteSettings
}

export default function SettingsForm({ settings }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [avatarUrl, setAvatarUrl] = useState(settings.avatarUrl)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(settings.title)
  const [description, setDescription] = useState(settings.description)
  const [jobTitle, setJobTitle] = useState(settings.jobTitle)
  const [keywords, setKeywords] = useState(settings.keywords.join(', '))
  const [ogTitle, setOgTitle] = useState(settings.ogTitle)
  const [ogDescription, setOgDescription] = useState(settings.ogDescription)

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Title and description are required.')
      return
    }

    setSaving(true)
    setSaved(false)

    const payload: Partial<NewSiteSettings> = {
      title: title.trim(),
      description: description.trim(),
      jobTitle: jobTitle.trim(),
      keywords: keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      ogTitle: ogTitle.trim(),
      ogDescription: ogDescription.trim(),
    }

    try {
      await saveSiteSettingsAction(payload)
    } catch (e) {
      setSaving(false)
      alert('Error saving: ' + (e instanceof Error ? e.message : String(e)))
      return
    }

    setSaving(false)
    setSaved(true)
    router.refresh()
  }

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setAvatarError('File must be an image.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError('Image must be under 4MB.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setUploadingAvatar(true)
    setAvatarError(null)

    const formData = new FormData()
    formData.set('file', file)

    try {
      const updated = await uploadAvatarAction(formData)
      setAvatarUrl(updated.avatarUrl)
      router.refresh()
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true)
    setAvatarError(null)
    try {
      const updated = await removeAvatarAction()
      setAvatarUrl(updated.avatarUrl)
      router.refresh()
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Remove failed.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <div className="space-y-6">
      <Field label="Avatar">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Avatar"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border border-[#1F2421]"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full bg-[#1F2421] flex items-center justify-center text-lg font-bold text-[#3DF49A]"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              MH
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              disabled={uploadingAvatar}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="flex items-center gap-2 px-4 py-2 bg-[#0F0F0F] border border-[#1F2421] rounded-lg text-sm
                         text-[#F3F6F4] hover:border-[#3DF49A] transition-colors cursor-pointer disabled:opacity-50"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              {uploadingAvatar ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
              ) : (
                <Upload className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              {uploadingAvatar ? 'Uploading...' : 'Upload photo'}
            </label>

            {avatarUrl && !uploadingAvatar && (
              <button
                onClick={handleRemoveAvatar}
                className="flex items-center gap-1.5 text-xs text-[#8A938E] hover:text-red-400 transition-colors"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                <X className="h-3 w-3" strokeWidth={2} />
                Remove
              </button>
            )}
          </div>
        </div>
        {avatarError && (
          <Hint>
            <span className="text-red-400">{avatarError}</span>
          </Hint>
        )}
        <Hint>Shown on the AuthorCard on blog posts and in the Person JSON-LD block. JPG/PNG/WebP, under 4MB.</Hint>
      </Field>

      <Field label="Title *">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Mahtamun Hoque Fahim — Full-Stack Developer & AI Engineer"
          className={inputClass}
          style={{ fontFamily: 'var(--font-jakarta)' }}
        />
        <Hint>Used as the default page title and the homepage &lt;title&gt; tag.</Hint>
      </Field>

      <Field label="Description *">
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Full-stack developer and AI engineer from Bangladesh..."
          className={`${inputClass} resize-none`}
          style={{ fontFamily: 'var(--font-jakarta)' }}
        />
        <Hint>Meta description and the JSON-LD Person description.</Hint>
      </Field>

      <Field label="Job title">
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Full-Stack Developer & AI Engineer"
          className={inputClass}
          style={{ fontFamily: 'var(--font-jakarta)' }}
        />
        <Hint>Feeds the JSON-LD Person jobTitle field.</Hint>
      </Field>

      <Field label="Keywords (comma-separated)">
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="developer, AI engineer, Next.js"
          className={inputClass}
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="OG title">
          <input
            type="text"
            value={ogTitle}
            onChange={(e) => setOgTitle(e.target.value)}
            className={inputClass}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </Field>
        <Field label="OG description">
          <input
            type="text"
            value={ogDescription}
            onChange={(e) => setOgDescription(e.target.value)}
            className={inputClass}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </Field>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#1F2421]">
        <p
          className="text-xs text-[#8A938E]"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          Last updated {new Date(settings.updatedAt).toLocaleString()}
        </p>

        <div className="flex items-center gap-4">
          {saved && !saving && (
            <span
              className="text-xs text-[#3DF49A]"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#3DF49A] text-[#06160E] text-sm font-semibold rounded-lg
                       hover:bg-[#5BFBA8] transition-colors disabled:opacity-50"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputClass =
  'w-full bg-[#0F0F0F] border border-[#1F2421] rounded-lg px-4 py-2.5 text-sm text-[#F3F6F4] ' +
  'placeholder:text-[#2B302D] focus:outline-none focus:border-[#3DF49A] transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-xs text-[#8A938E] mb-2 tracking-widest uppercase"
        style={{ fontFamily: 'var(--font-jetbrains)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs text-[#2B302D] mt-1.5"
      style={{ fontFamily: 'var(--font-jakarta)' }}
    >
      {children}
    </p>
  )
}
