'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, X } from 'lucide-react'
import type { AboutContent } from '@/lib/db/queries'
import { MAX_AVATAR_BYTES } from '@/lib/constants'
import {
  removeAboutImageAction,
  saveAboutContentAction,
  uploadAboutImageAction,
} from '@/app/admin/actions'

type Props = {
  about: AboutContent
}

export default function AboutForm({ about }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [headlineTop, setHeadlineTop] = useState(about.headlineTop)
  const [headlineAccent, setHeadlineAccent] = useState(about.headlineAccent)
  const [intro, setIntro] = useState(about.intro)
  const [extraHeading, setExtraHeading] = useState(about.extraHeading)
  const [extra, setExtra] = useState(about.extraParagraphs.join('\n\n'))
  // Images are saved the moment they are uploaded or removed (not with "Save changes").
  const [extraImageUrl, setExtraImageUrl] = useState(about.extraImageUrl)
  const [storyImageUrl, setStoryImageUrl] = useState(about.storyImageUrl)
  const [storyHeading, setStoryHeading] = useState(about.storyHeading)
  // One textarea, paragraphs separated by a blank line.
  const [story, setStory] = useState(about.storyParagraphs.join('\n\n'))
  const [ctaHeading, setCtaHeading] = useState(about.ctaHeading)
  const [ctaText, setCtaText] = useState(about.ctaText)
  const [ctaPrimaryLabel, setCtaPrimaryLabel] = useState(about.ctaPrimaryLabel)
  const [ctaSecondaryLabel, setCtaSecondaryLabel] = useState(about.ctaSecondaryLabel)

  const [homeHeading, setHomeHeading] = useState(about.homeHeading)
  const [homeParagraphOne, setHomeParagraphOne] = useState(about.homeParagraphOne)
  const [homeParagraphTwo, setHomeParagraphTwo] = useState(about.homeParagraphTwo)
  const [homeLinkLabel, setHomeLinkLabel] = useState(about.homeLinkLabel)
  const [homeCardRole, setHomeCardRole] = useState(about.homeCardRole)
  // Card lists are edited as comma-separated text.
  const [homeCardDescription, setHomeCardDescription] = useState(about.homeCardDescription.join(', '))
  const [homeCardStack, setHomeCardStack] = useState(about.homeCardStack.join(', '))
  const [homeCardAvailability, setHomeCardAvailability] = useState(about.homeCardAvailability.join(', '))
  const [homeCardObsessions, setHomeCardObsessions] = useState(about.homeCardObsessions.join(', '))

  const toList = (value: string) => value.split(',').map((v) => v.trim()).filter(Boolean)

  const paragraphCount = story.split(/\n\s*\n/).filter((p) => p.trim()).length
  const extraCount = extra.split(/\n\s*\n/).filter((p) => p.trim()).length

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)

    try {
      await saveAboutContentAction({
        headlineTop,
        headlineAccent,
        intro,
        storyHeading,
        storyParagraphs: story.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
        extraHeading,
        extraParagraphs: extra.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
        ctaHeading,
        ctaText,
        ctaPrimaryLabel,
        ctaSecondaryLabel,
        homeHeading,
        homeParagraphOne,
        homeParagraphTwo,
        homeLinkLabel,
        homeCardRole,
        homeCardDescription: toList(homeCardDescription),
        homeCardStack: toList(homeCardStack),
        homeCardAvailability: toList(homeCardAvailability),
        homeCardObsessions: toList(homeCardObsessions),
      })
    } catch (e) {
      setSaving(false)
      setError(e instanceof Error ? e.message : String(e))
      return
    }

    setSaving(false)
    setSaved(true)
    router.refresh()
  }

  return (
    <div className="space-y-10">
      {/* Homepage teaser */}
      <section className="space-y-5">
        <SectionTitle>Homepage teaser</SectionTitle>
        <p className="text-xs text-[#8A938E]" style={{ fontFamily: 'var(--font-jakarta)' }}>
          The two-column block on the homepage: text on the left, code-style card on the right.
        </p>
        <Field label="Heading">
          <input
            type="text"
            value={homeHeading}
            onChange={(e) => setHomeHeading(e.target.value)}
            className={inputClass}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </Field>
        <Field label="First paragraph">
          <textarea
            value={homeParagraphOne}
            onChange={(e) => setHomeParagraphOne(e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </Field>
        <Field label="Second paragraph">
          <textarea
            value={homeParagraphTwo}
            onChange={(e) => setHomeParagraphTwo(e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </Field>
        <Field label="Link label">
          <input
            type="text"
            value={homeLinkLabel}
            onChange={(e) => setHomeLinkLabel(e.target.value)}
            className={inputClass}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
          <Hint>Links to /about. The arrow is added automatically.</Hint>
        </Field>

        <div className="pt-2 space-y-5">
          <p
            className="text-xs text-[#8A938E] tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Code card
          </p>
          <Field label="role">
            <input
              type="text"
              value={homeCardRole}
              onChange={(e) => setHomeCardRole(e.target.value)}
              className={inputClass}
              style={{ fontFamily: 'var(--font-jakarta)' }}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="description">
              <input
                type="text"
                value={homeCardDescription}
                onChange={(e) => setHomeCardDescription(e.target.value)}
                className={inputClass}
                style={{ fontFamily: 'var(--font-jakarta)' }}
              />
            </Field>
            <Field label="stack">
              <input
                type="text"
                value={homeCardStack}
                onChange={(e) => setHomeCardStack(e.target.value)}
                className={inputClass}
                style={{ fontFamily: 'var(--font-jakarta)' }}
              />
            </Field>
            <Field label="availability">
              <input
                type="text"
                value={homeCardAvailability}
                onChange={(e) => setHomeCardAvailability(e.target.value)}
                className={inputClass}
                style={{ fontFamily: 'var(--font-jakarta)' }}
              />
            </Field>
            <Field label="obsessions">
              <input
                type="text"
                value={homeCardObsessions}
                onChange={(e) => setHomeCardObsessions(e.target.value)}
                className={inputClass}
                style={{ fontFamily: 'var(--font-jakarta)' }}
              />
            </Field>
          </div>
          <Hint>Separate list items with commas, up to 8 each. The keys and brackets stay fixed.</Hint>
        </div>
      </section>

      {/* Header */}
      <section className="space-y-5">
        <SectionTitle>Header</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Headline, first line">
            <input
              type="text"
              value={headlineTop}
              onChange={(e) => setHeadlineTop(e.target.value)}
              className={inputClass}
              style={{ fontFamily: 'var(--font-jakarta)' }}
            />
          </Field>
          <Field label="Headline, green line">
            <input
              type="text"
              value={headlineAccent}
              onChange={(e) => setHeadlineAccent(e.target.value)}
              className={inputClass}
              style={{ fontFamily: 'var(--font-jakarta)' }}
            />
          </Field>
        </div>
        <Field label="Intro paragraph">
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </Field>
      </section>

      {/* Extra block (above the story) */}
      <section className="space-y-5">
        <SectionTitle>Extra block</SectionTitle>
        <p className="text-xs text-[#8A938E]" style={{ fontFamily: 'var(--font-jakarta)' }}>
          Shown above the story: image on the left, heading and text on the right. Leave the heading
          and the text empty to hide the whole block.
        </p>
        <Field label="Heading">
          <input
            type="text"
            value={extraHeading}
            onChange={(e) => setExtraHeading(e.target.value)}
            className={inputClass}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </Field>
        <Field label={`Paragraphs (${extraCount})`}>
          <textarea
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            rows={8}
            className={`${inputClass} leading-relaxed`}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
          <Hint>Leave a blank line between paragraphs. Up to 12 paragraphs.</Hint>
        </Field>
        <Field label="Image (left)">
          <AboutImageField slot="extra" url={extraImageUrl} onChange={setExtraImageUrl} />
        </Field>
      </section>

      {/* Story */}
      <section className="space-y-5">
        <SectionTitle>Story</SectionTitle>
        <Field label="Section heading">
          <input
            type="text"
            value={storyHeading}
            onChange={(e) => setStoryHeading(e.target.value)}
            className={inputClass}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </Field>
        <Field label={`Paragraphs (${paragraphCount})`}>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={16}
            className={`${inputClass} leading-relaxed`}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
          <Hint>Leave a blank line between paragraphs. Up to 12 paragraphs.</Hint>
        </Field>
        <Field label="Image (right)">
          <AboutImageField slot="story" url={storyImageUrl} onChange={setStoryImageUrl} />
        </Field>
      </section>

      {/* CTA */}
      <section className="space-y-5">
        <SectionTitle>Call to action</SectionTitle>
        <Field label="Heading">
          <input
            type="text"
            value={ctaHeading}
            onChange={(e) => setCtaHeading(e.target.value)}
            className={inputClass}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </Field>
        <Field label="Supporting text">
          <textarea
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            rows={2}
            className={`${inputClass} resize-none`}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Primary button label">
            <input
              type="text"
              value={ctaPrimaryLabel}
              onChange={(e) => setCtaPrimaryLabel(e.target.value)}
              className={inputClass}
              style={{ fontFamily: 'var(--font-jakarta)' }}
            />
            <Hint>Links to /contact.</Hint>
          </Field>
          <Field label="Secondary button label">
            <input
              type="text"
              value={ctaSecondaryLabel}
              onChange={(e) => setCtaSecondaryLabel(e.target.value)}
              className={inputClass}
              style={{ fontFamily: 'var(--font-jakarta)' }}
            />
            <Hint>Links to the design portfolio. The arrow is added automatically.</Hint>
          </Field>
        </div>
      </section>

      <div className="flex items-center justify-between pt-4 border-t border-[#333333]">
        <p className="text-xs text-[#8A938E]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
          {new Date(about.updatedAt).getTime() === 0
            ? 'Showing built-in defaults'
            : `Last updated ${new Date(about.updatedAt).toLocaleString()}`}
        </p>

        <div className="flex items-center gap-4">
          {error && (
            <span className="text-xs text-red-400 max-w-xs text-right" style={{ fontFamily: 'var(--font-jakarta)' }}>
              {error}
            </span>
          )}
          {saved && !saving && !error && (
            <span className="text-xs text-[#3DF49A]" style={{ fontFamily: 'var(--font-jakarta)' }}>
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
  'w-full bg-[#222222] border border-[#333333] rounded-lg px-4 py-2.5 text-sm text-[#F3F6F4] ' +
  'placeholder:text-[#5C615E] focus:outline-none focus:border-[#3DF49A] transition-colors'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-lg font-bold text-[#F3F6F4] pb-2 border-b border-[#333333]"
      style={{ fontFamily: 'var(--font-clash)' }}
    >
      {children}
    </h2>
  )
}

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
    <p className="text-xs text-[#5C615E] mt-1.5" style={{ fontFamily: 'var(--font-jakarta)' }}>
      {children}
    </p>
  )
}

/**
 * Upload / replace / remove for one About-page image slot. Uploads go straight
 * to Cloudinary through a server action and are saved immediately; the page
 * shows them as a square (cropped to fill), so square images work best.
 */
function AboutImageField({
  slot,
  url,
  onChange,
}: {
  slot: 'extra' | 'story'
  url: string | null
  onChange: (url: string | null) => void
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reset = () => {
      if (inputRef.current) inputRef.current.value = ''
    }
    if (!file.type.startsWith('image/')) {
      setError('File must be an image.')
      reset()
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError('Image must be under 4MB.')
      reset()
      return
    }

    setBusy(true)
    setError(null)
    const formData = new FormData()
    formData.set('slot', slot)
    formData.set('file', file)
    try {
      const updated = await uploadAboutImageAction(formData)
      onChange(slot === 'extra' ? updated.extraImageUrl : updated.storyImageUrl)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setBusy(false)
      reset()
    }
  }

  const handleRemove = async () => {
    setBusy(true)
    setError(null)
    try {
      await removeAboutImageAction(slot)
      onChange(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Remove failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-start gap-5">
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border border-[#333333] bg-[#222222]">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : (
          <span
            className="absolute inset-0 flex items-center justify-center text-xs text-[#5C615E]"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            No image
          </span>
        )}
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 size={18} className="animate-spin text-[#F3F6F4]" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#333333] px-3 py-2 text-xs text-[#F3F6F4] transition-colors hover:border-[#8A938E] ${
              busy ? 'pointer-events-none opacity-50' : ''
            }`}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            <Upload size={14} aria-hidden="true" />
            {url ? 'Replace' : 'Upload'}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleSelect}
              disabled={busy}
              className="sr-only"
            />
          </label>
          {url && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-[#8A938E] transition-colors hover:text-red-400 disabled:opacity-50"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              <X size={14} aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
        <Hint>Shown as a square (cropped to fill), so a square image works best. Max 4MB. Saved as soon as it uploads.</Hint>
        {error && (
          <p className="text-xs text-red-400" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
