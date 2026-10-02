'use client'

import { useRef, useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, Check, Loader2, ImageIcon, Upload } from 'lucide-react'
import type { Skill, NewSkill } from '@/lib/db/queries'
import {
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
  reorderSkillsAction,
  uploadSkillImageAction,
} from '@/app/admin/actions'
import { MAX_AVATAR_BYTES } from '@/lib/constants'

// ── Shared UI (matches CredentialsManager / ProjectsManager) ──────────────

const inputCls =
  'w-full bg-[#0F1210] border border-[#1F2421] rounded-lg px-3 py-2 text-sm text-[#F3F6F4] placeholder-[#3A3F3C] focus:outline-none focus:border-[#3DF49A] transition-colors'
const labelCls = 'block text-xs font-medium text-[#5C615E] mb-1 uppercase tracking-wider'
const btnPrimary =
  'flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3DF49A] text-[#070807] text-sm font-semibold hover:bg-[#2de088] transition-colors disabled:opacity-50'
const btnSecondary =
  'flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1F2421] text-sm text-[#8A938E] hover:text-[#F3F6F4] hover:border-[#3A3F3C] transition-colors'

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#0A0C0B] border border-[#1F2421] rounded-xl p-4 mb-3">{children}</div>
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#0A0C0B] border border-[#1F2421] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[#1F2421]">
          <h3 className="font-bold text-[#F3F6F4]" style={{ fontFamily: 'var(--font-clash)' }}>
            {title}
          </h3>
          <button onClick={onClose} className="text-[#5C615E] hover:text-[#F3F6F4] transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function ReorderBtns({
  onUp,
  onDown,
  upDisabled,
  downDisabled,
}: {
  onUp: () => void
  onDown: () => void
  upDisabled: boolean
  downDisabled: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <button onClick={onUp} disabled={upDisabled} className="p-1 rounded text-[#5C615E] hover:text-[#F3F6F4] disabled:opacity-30 transition-colors">
        <ChevronUp className="h-3 w-3" />
      </button>
      <button onClick={onDown} disabled={downDisabled} className="p-1 rounded text-[#5C615E] hover:text-[#F3F6F4] disabled:opacity-30 transition-colors">
        <ChevronDown className="h-3 w-3" />
      </button>
    </div>
  )
}

// Thumbnail slot: background is a shade lighter than the page (#070807),
// on purpose — a transparent PNG upload needs *some* contrast to read as a
// card and not empty space, without looking like a hard-edged box.
function Thumb({ url, size = 64 }: { url: string | null; size?: number }) {
  return (
    <div
      className="rounded-lg border border-[#1F2421] bg-[#141712] flex items-center justify-center shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="w-full h-full object-contain" />
      ) : (
        <ImageIcon className="h-5 w-5 text-[#3A3F3C]" />
      )}
    </div>
  )
}

export default function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills] = useState(initialSkills)
  const [pending, startTransition] = useTransition()

  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; skill?: Skill }>({
    open: false,
    mode: 'create',
  })
  const [form, setForm] = useState<Partial<NewSkill>>({})

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<{ id: string; message: string } | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function openCreate() {
    setForm({ title: '', desc: '' })
    setModal({ open: true, mode: 'create' })
  }

  function openEdit(skill: Skill) {
    setForm({ title: skill.title, desc: skill.desc })
    setModal({ open: true, mode: 'edit', skill })
  }

  function saveSkill() {
    startTransition(async () => {
      if (modal.mode === 'create') {
        const created = await createSkillAction({ ...form, sortOrder: skills.length } as NewSkill)
        if (created) setSkills((prev) => [...prev, created])
      } else if (modal.skill) {
        const updated = await updateSkillAction(modal.skill.id, form)
        if (updated) setSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
      }
      setModal({ open: false, mode: 'create' })
    })
  }

  function reorder(idx: number, dir: -1 | 1) {
    const next = [...skills]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setSkills(next)
    startTransition(() => reorderSkillsAction(next.map((s, i) => ({ id: s.id, order: i }))))
  }

  function confirmDeleteNow() {
    if (!deleteId) return
    const id = deleteId
    setDeleteId(null)
    startTransition(async () => {
      await deleteSkillAction(id)
      setSkills((prev) => prev.filter((s) => s.id !== id))
    })
  }

  async function handleImageSelect(skillId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError({ id: skillId, message: 'File must be an image.' })
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setUploadError({ id: skillId, message: 'Image must be under 4MB.' })
      return
    }

    setUploadingId(skillId)
    setUploadError(null)

    const formData = new FormData()
    formData.set('file', file)

    try {
      const updated = await uploadSkillImageAction(skillId, formData)
      if (updated) setSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    } catch (err) {
      setUploadError({ id: skillId, message: err instanceof Error ? err.message : 'Upload failed.' })
    } finally {
      setUploadingId(null)
      const input = fileInputRefs.current[skillId]
      if (input) input.value = ''
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-[#5C615E]">
          Cards sit in a grid — one column on phones, up to three across on desktop — each with a small icon above the title. Transparent PNGs are fine; the icon slot has a light background so they still read as a tile.
        </p>
        <button onClick={openCreate} className={btnPrimary}>
          <Plus className="h-4 w-4" /> New Skill
        </button>
      </div>

      {skills.map((skill, idx) => (
        <SectionCard key={skill.id}>
          <div className="flex items-start gap-3">
            <ReorderBtns
              onUp={() => reorder(idx, -1)}
              onDown={() => reorder(idx, 1)}
              upDisabled={idx === 0}
              downDisabled={idx === skills.length - 1}
            />
            <Thumb url={skill.imageUrl} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F3F6F4]">
                {String(idx + 1).padStart(2, '0')} · {skill.title}
              </p>
              <p className="text-xs text-[#5C615E] mt-0.5 leading-relaxed">{skill.desc}</p>

              <div className="flex items-center gap-3 mt-2">
                <label className="text-xs text-[#3DF49A] hover:text-[#5BFBA8] cursor-pointer transition-colors flex items-center gap-1">
                  {uploadingId === skill.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Upload className="h-3 w-3" />
                  )}
                  {skill.imageUrl ? 'Replace image' : 'Upload image'}
                  <input
                    ref={(el) => {
                      fileInputRefs.current[skill.id] = el
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingId === skill.id}
                    onChange={(e) => handleImageSelect(skill.id, e)}
                  />
                </label>
                {uploadError?.id === skill.id && (
                  <span className="text-xs text-red-400">{uploadError.message}</span>
                )}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(skill)} className="p-2 text-[#5C615E] hover:text-[#3DF49A] transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => setDeleteId(skill.id)} className="p-2 text-[#5C615E] hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </SectionCard>
      ))}
      {skills.length === 0 && <p className="text-sm text-[#3A3F3C] py-6 text-center">No skills yet.</p>}

      {/* ── CREATE / EDIT MODAL ── */}
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, mode: 'create' })}
        title={modal.mode === 'create' ? 'New Skill' : 'Edit Skill'}
      >
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Title</label>
            <input
              className={inputCls}
              value={form.title ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Graphic Design"
            />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={inputCls}
              rows={3}
              value={form.desc ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
              placeholder="Brand identities, print, visual systems."
            />
          </div>
          {modal.mode === 'create' && (
            <p className="text-xs text-[#5C615E]">Save first, then upload a thumbnail from the card below.</p>
          )}
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setModal({ open: false, mode: 'create' })} className={btnSecondary}>
              Cancel
            </button>
            <button onClick={saveSkill} disabled={pending} className={btnPrimary}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
            </button>
          </div>
        </div>
      </Modal>

      {/* ── DELETE CONFIRM ── */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete skill?">
        <div className="space-y-4">
          <p className="text-sm text-[#8A938E]">
            This removes the card from the home page immediately. This can&apos;t be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteId(null)} className={btnSecondary}>
              Cancel
            </button>
            <button
              onClick={confirmDeleteNow}
              disabled={pending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
