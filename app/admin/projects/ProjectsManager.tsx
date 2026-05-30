'use client'

import { useState, useTransition } from 'react'
import {
  createProjectAction,
  deleteProjectAction,
  reorderProjects,
  updateProjectAction,
  updateProjectFeatured,
} from '@/app/admin/actions'

type Project = {
  id: string
  name: string
  tagline: string
  description: string
  tags: string[]
  type: string
  liveUrl: string | null
  repoUrl: string
  featured: boolean
  featuredOrder: number | null
}

type ProjectFormState = {
  name: string
  tagline: string
  description: string
  tags: string // comma-separated in the form
  type: string
  liveUrl: string
  repoUrl: string
}

const EMPTY_FORM: ProjectFormState = {
  name: '',
  tagline: '',
  description: '',
  tags: '',
  type: 'Web',
  liveUrl: '',
  repoUrl: '',
}

export default function ProjectsManager({
  initialProjects,
}: {
  initialProjects: Project[]
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState<Project | null>(null)
  const [creating, setCreating] = useState(false)

  const featured = projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999))
  const unfeatured = projects.filter((p) => !p.featured)

  const flash = (kind: 'ok' | 'err', text: string) => {
    setMessage({ kind, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const toggleFeatured = (id: string, currentlyFeatured: boolean) => {
    startTransition(async () => {
      try {
        await updateProjectFeatured(id, !currentlyFeatured)
        setProjects((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  featured: !currentlyFeatured,
                  featuredOrder: !currentlyFeatured
                    ? Math.max(0, ...featured.map((fp) => fp.featuredOrder ?? 0)) + 1
                    : null,
                }
              : p,
          ),
        )
        flash('ok', !currentlyFeatured ? 'Featured' : 'Unfeatured')
      } catch {
        flash('err', 'Update failed')
      }
    })
  }

  const reorder = (id: string, direction: 'up' | 'down') => {
    const idx = featured.findIndex((p) => p.id === id)
    if (idx < 0) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === featured.length - 1) return

    const swapped = [...featured]
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[swapped[idx], swapped[newIdx]] = [swapped[newIdx], swapped[idx]]
    const newOrder = swapped.map((p, i) => ({ id: p.id, order: i + 1 }))

    startTransition(async () => {
      try {
        await reorderProjects(newOrder)
        setProjects((prev) =>
          prev.map((p) => ({
            ...p,
            featuredOrder: newOrder.find((no) => no.id === p.id)?.order ?? p.featuredOrder,
          })),
        )
        flash('ok', 'Order updated')
      } catch {
        flash('err', 'Reorder failed')
      }
    })
  }

  const handleSubmit = (form: ProjectFormState) => {
    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      type: form.type.trim() || 'Web',
      liveUrl: form.liveUrl.trim() || null,
      repoUrl: form.repoUrl.trim(),
    }
    if (!payload.name || !payload.tagline || !payload.description || !payload.repoUrl) {
      flash('err', 'Name, tagline, description and repo URL are required')
      return
    }

    startTransition(async () => {
      try {
        if (editing) {
          const updated = await updateProjectAction(editing.id, payload)
          if (updated) {
            setProjects((prev) => prev.map((p) => (p.id === updated.id ? (updated as Project) : p)))
          }
          flash('ok', 'Project updated')
        } else {
          const created = await createProjectAction(payload)
          if (created) setProjects((prev) => [...prev, created as Project])
          flash('ok', 'Project created')
        }
        setEditing(null)
        setCreating(false)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Save failed'
        flash('err', msg.includes('unique') ? 'A project with that name already exists' : msg)
      }
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    startTransition(async () => {
      try {
        await deleteProjectAction(id)
        setProjects((prev) => prev.filter((p) => p.id !== id))
        flash('ok', 'Project deleted')
      } catch {
        flash('err', 'Delete failed')
      }
    })
  }

  return (
    <div>
      {/* Header row with action */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-xs uppercase tracking-widest text-[#8a8a8a]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {projects.length} project{projects.length === 1 ? '' : 's'} · {featured.length} featured
        </div>
        <button
          onClick={() => setCreating(true)}
          disabled={isPending}
          className="px-4 py-2 text-sm bg-[#00e676] text-black rounded-lg font-medium hover:bg-[#00b85a] disabled:opacity-50 transition-colors"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          + New project
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.kind === 'ok'
              ? 'bg-[#00e676]/10 border-[#00e676]/30 text-[#00e676]'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <p className="text-sm" style={{ fontFamily: "'Onest', sans-serif" }}>
            {message.text}
          </p>
        </div>
      )}

      {projects.length === 0 && (
        <div className="bg-[#141414] border border-dashed border-[#1f1f1f] rounded-xl p-12 text-center">
          <p className="text-[#f0ede6] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            No projects yet
          </p>
          <p className="text-[#8a8a8a] text-sm mb-6" style={{ fontFamily: "'Onest', sans-serif" }}>
            Add your first project to show it on your homepage and projects page.
          </p>
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 text-sm bg-[#00e676] text-black rounded-lg font-medium hover:bg-[#00b85a] transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            + Add project
          </button>
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-bold text-[#f0ede6]" style={{ fontFamily: "'Syne', sans-serif" }}>
              Featured ({featured.length})
            </h2>
            <p className="text-xs text-[#8a8a8a]" style={{ fontFamily: "'Onest', sans-serif" }}>
              Shown on homepage in this order
            </p>
          </div>
          <div className="space-y-3">
            {featured.map((p, idx) => (
              <ProjectRow
                key={p.id}
                project={p}
                isFirst={idx === 0}
                isLast={idx === featured.length - 1}
                isPending={isPending}
                onReorderUp={() => reorder(p.id, 'up')}
                onReorderDown={() => reorder(p.id, 'down')}
                onToggle={() => toggleFeatured(p.id, p.featured)}
                onEdit={() => setEditing(p)}
                onDelete={() => handleDelete(p.id, p.name)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Unfeatured */}
      {unfeatured.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-[#f0ede6] mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            All projects ({unfeatured.length})
          </h2>
          <div className="space-y-3">
            {unfeatured.map((p) => (
              <ProjectRow
                key={p.id}
                project={p}
                isPending={isPending}
                onToggle={() => toggleFeatured(p.id, p.featured)}
                onEdit={() => setEditing(p)}
                onDelete={() => handleDelete(p.id, p.name)}
              />
            ))}
          </div>
        </section>
      )}

      {(editing || creating) && (
        <ProjectFormModal
          initial={
            editing
              ? {
                  name: editing.name,
                  tagline: editing.tagline,
                  description: editing.description,
                  tags: editing.tags.join(', '),
                  type: editing.type,
                  liveUrl: editing.liveUrl ?? '',
                  repoUrl: editing.repoUrl,
                }
              : EMPTY_FORM
          }
          isEdit={!!editing}
          isPending={isPending}
          onCancel={() => {
            setEditing(null)
            setCreating(false)
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// Row
// ──────────────────────────────────────────────────────────
function ProjectRow({
  project,
  isFirst,
  isLast,
  isPending,
  onReorderUp,
  onReorderDown,
  onToggle,
  onEdit,
  onDelete,
}: {
  project: Project
  isFirst?: boolean
  isLast?: boolean
  isPending: boolean
  onReorderUp?: () => void
  onReorderDown?: () => void
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4 hover:border-[#2a2a2a] transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[#f0ede6] font-medium truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
              {project.name}
            </p>
            <span
              className="text-[10px] px-1.5 py-0.5 bg-[#1f1f1f] text-[#8a8a8a] rounded uppercase tracking-wider"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {project.type}
            </span>
            {project.liveUrl && (
              <span
                className="text-[10px] px-1.5 py-0.5 bg-[#00e676]/10 text-[#00e676] rounded uppercase tracking-wider"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Live
              </span>
            )}
          </div>
          <p className="text-[#8a8a8a] text-sm truncate" style={{ fontFamily: "'Onest', sans-serif" }}>
            {project.tagline}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onReorderUp && onReorderDown && (
            <>
              <IconBtn label="↑" disabled={isPending || isFirst} onClick={onReorderUp} title="Move up" />
              <IconBtn label="↓" disabled={isPending || isLast} onClick={onReorderDown} title="Move down" />
              <div className="w-px h-6 bg-[#1f1f1f] mx-1" />
            </>
          )}
          <button
            onClick={onToggle}
            disabled={isPending}
            className={`px-3 py-1.5 text-xs rounded font-medium transition-colors disabled:opacity-50 ${
              project.featured
                ? 'bg-[#00e676]/10 text-[#00e676] hover:bg-[#00e676]/20'
                : 'bg-[#1f1f1f] text-[#8a8a8a] hover:bg-[#00e676] hover:text-black'
            }`}
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            {project.featured ? 'Unfeature' : 'Feature'}
          </button>
          <button
            onClick={onEdit}
            disabled={isPending}
            className="px-3 py-1.5 text-xs bg-[#1f1f1f] text-[#f0ede6] rounded hover:bg-[#2a2a2a] disabled:opacity-50 transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={isPending}
            className="px-3 py-1.5 text-xs bg-[#1f1f1f] text-red-400 rounded hover:bg-red-500/20 disabled:opacity-50 transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function IconBtn({
  label,
  disabled,
  onClick,
  title,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  title: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-8 h-8 flex items-center justify-center text-xs bg-[#1f1f1f] text-[#8a8a8a] rounded hover:bg-[#2a2a2a] disabled:opacity-30 transition-colors"
    >
      {label}
    </button>
  )
}

// ──────────────────────────────────────────────────────────
// Form modal
// ──────────────────────────────────────────────────────────
function ProjectFormModal({
  initial,
  isEdit,
  isPending,
  onCancel,
  onSubmit,
}: {
  initial: ProjectFormState
  isEdit: boolean
  isPending: boolean
  onCancel: () => void
  onSubmit: (form: ProjectFormState) => void
}) {
  const [form, setForm] = useState<ProjectFormState>(initial)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <div
        className="bg-[#141414] border border-[#1f1f1f] rounded-2xl w-full max-w-2xl p-8 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-[#f0ede6] mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
          {isEdit ? 'Edit project' : 'New project'}
        </h2>

        <div className="space-y-4">
          <Field label="Name *">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              placeholder="D-Shastho"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <input
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputCls}
                placeholder="Web, Mobile, CLI..."
              />
            </Field>
            <Field label="Tags (comma-separated)">
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className={inputCls}
                placeholder="Next.js, TypeScript, Health"
              />
            </Field>
          </div>

          <Field label="Tagline *">
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className={inputCls}
              placeholder="One-line summary shown in cards"
            />
          </Field>

          <Field label="Description *">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className={`${inputCls} resize-y`}
              placeholder="Longer description shown on the project detail."
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Live URL">
              <input
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                className={inputCls}
                placeholder="https://..."
              />
            </Field>
            <Field label="Repo URL *">
              <input
                value={form.repoUrl}
                onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                className={inputCls}
                placeholder="https://github.com/..."
              />
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-[#1f1f1f]">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 text-sm text-[#8a8a8a] rounded-lg hover:text-[#f0ede6] disabled:opacity-50 transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            disabled={isPending}
            className="px-5 py-2 text-sm bg-[#00e676] text-black rounded-lg font-medium hover:bg-[#00b85a] disabled:opacity-50 transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            {isPending ? 'Saving...' : isEdit ? 'Save changes' : 'Create project'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputCls =
  "w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg text-[#f0ede6] placeholder-[#5a5a5a] focus:outline-none focus:border-[#00e676] transition-colors text-sm font-['Onest',sans-serif]"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-[#f0ede6] text-xs mb-1.5 font-medium uppercase tracking-wider"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}
