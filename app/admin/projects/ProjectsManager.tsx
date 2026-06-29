'use client'

import { useState, useTransition } from 'react'
import {
  type BulkProjectOutcome,
  bulkUpsertProjectsAction,
  createProjectAction,
  deleteProjectAction,
  reorderProjects,
  updateProjectAction,
  updateProjectFeatured,
} from '@/app/admin/actions'

type Collaborator = { name: string; url?: string | null }

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
  statusBadges: string[]
  collaborators: Collaborator[]
}

type ProjectFormState = {
  name: string
  tagline: string
  description: string
  tags: string // comma-separated in the form
  type: string
  liveUrl: string
  repoUrl: string
  statusBadges: string[]
  collaborators: Collaborator[]
}

const STATUS_BADGES = ['live', 'beta', 'deprecated', 'funding'] as const
type StatusBadge = (typeof STATUS_BADGES)[number]

const EMPTY_FORM: ProjectFormState = {
  name: '',
  tagline: '',
  description: '',
  tags: '',
  type: 'Web',
  liveUrl: '',
  repoUrl: '',
  statusBadges: [],
  collaborators: [],
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
      statusBadges: form.statusBadges,
      collaborators: form.collaborators
        .map((c) => ({
          name: c.name.trim(),
          url: c.url?.trim() ? c.url.trim() : null,
        }))
        .filter((c) => c.name),
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

  const [bulkOutcomes, setBulkOutcomes] = useState<BulkProjectOutcome[] | null>(null)

  const handleBulkSubmit = (rawJson: string) => {
    setBulkOutcomes(null)
    let parsed: unknown
    try {
      parsed = JSON.parse(rawJson)
    } catch (err) {
      flash('err', `Invalid JSON: ${err instanceof Error ? err.message : 'parse failed'}`)
      return
    }

    // Accept either { "projects": [...] }, a single object, or a bare array.
    let arr: unknown[]
    if (Array.isArray(parsed)) {
      arr = parsed
    } else if (parsed && typeof parsed === 'object' && 'projects' in parsed && Array.isArray((parsed as { projects: unknown[] }).projects)) {
      arr = (parsed as { projects: unknown[] }).projects
    } else if (parsed && typeof parsed === 'object') {
      arr = [parsed]
    } else {
      flash('err', 'JSON must be an object, an array, or { "projects": [...] }')
      return
    }

    // Normalize each row into the DB-shaped payload.
    const rows = arr.map((raw) => {
      const r = (raw ?? {}) as Record<string, unknown>
      const tagsField = r.tags
      const tags = Array.isArray(tagsField)
        ? tagsField.map((t) => String(t).trim()).filter(Boolean)
        : typeof tagsField === 'string'
        ? tagsField.split(',').map((t) => t.trim()).filter(Boolean)
        : []
      const badgesField = r.statusBadges ?? r.status_badges ?? r.badges
      const statusBadges = Array.isArray(badgesField)
        ? badgesField
            .map((b) => String(b).trim().toLowerCase())
            .filter((b): b is StatusBadge => (STATUS_BADGES as readonly string[]).includes(b))
        : typeof badgesField === 'string'
        ? badgesField
            .split(',')
            .map((b) => b.trim().toLowerCase())
            .filter((b): b is StatusBadge => (STATUS_BADGES as readonly string[]).includes(b))
        : []
      const collabField = r.collaborators ?? r.collaborated_with ?? r.collaboratedWith
      const collaborators: Collaborator[] = Array.isArray(collabField)
        ? collabField
            .map((c): Collaborator | null => {
              if (typeof c === 'string') {
                const name = c.trim()
                return name ? { name, url: null } : null
              }
              if (c && typeof c === 'object') {
                const obj = c as Record<string, unknown>
                const name = String(obj.name ?? '').trim()
                if (!name) return null
                const urlRaw = obj.url ?? obj.link ?? obj.href
                const url = typeof urlRaw === 'string' && urlRaw.trim() ? urlRaw.trim() : null
                return { name, url }
              }
              return null
            })
            .filter((c): c is Collaborator => c !== null)
        : []
      const liveUrlRaw = typeof r.liveUrl === 'string' ? r.liveUrl.trim() : ''
      return {
        name: String(r.name ?? '').trim(),
        tagline: String(r.tagline ?? '').trim(),
        description: String(r.description ?? '').trim(),
        tags,
        type: String(r.type ?? 'Web').trim() || 'Web',
        liveUrl: liveUrlRaw ? liveUrlRaw : null,
        repoUrl: String(r.repoUrl ?? '').trim(),
        statusBadges,
        collaborators,
      }
    })

    startTransition(async () => {
      try {
        const outcomes = await bulkUpsertProjectsAction(rows)
        setBulkOutcomes(outcomes)
        const okCount = outcomes.filter((o) => o.status !== 'error').length
        const errCount = outcomes.length - okCount
        flash(
          errCount === 0 ? 'ok' : 'err',
          `${okCount} saved${errCount ? `, ${errCount} failed` : ''}`,
        )
        // Refresh the in-memory list from server-rendered state by fetching
        // none — easiest path: synthesize the new list via a router refresh.
        // We'll just reload the page to pull the new rows since revalidate
        // is server-side.
        if (okCount > 0) {
          setTimeout(() => window.location.reload(), 700)
        }
      } catch (err) {
        flash('err', err instanceof Error ? err.message : 'Bulk import failed')
      }
    })
  }

  return (
    <div>
      {/* Header row with action */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-xs uppercase tracking-widest text-[#8A938E]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
          {projects.length} project{projects.length === 1 ? '' : 's'} · {featured.length} featured
        </div>
        <button
          onClick={() => setCreating(true)}
          disabled={isPending}
          className="px-4 py-2 text-sm bg-[#3DF49A] text-[#06160E] rounded-lg font-medium hover:bg-[#5BFBA8] disabled:opacity-50 transition-colors"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          + New project
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.kind === 'ok'
              ? 'bg-[#3DF49A]/10 border-[#3DF49A]/30 text-[#3DF49A]'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <p className="text-sm" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {message.text}
          </p>
        </div>
      )}

      {projects.length === 0 && (
        <div className="bg-[#0F0F0F] border border-dashed border-[#1F2421] rounded-xl p-12 text-center">
          <p className="text-[#F3F6F4] mb-2" style={{ fontFamily: 'var(--font-clash)' }}>
            No projects yet
          </p>
          <p className="text-[#8A938E] text-sm mb-6" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Add your first project to show it on your homepage and projects page.
          </p>
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 text-sm bg-[#3DF49A] text-[#06160E] rounded-lg font-medium hover:bg-[#5BFBA8] transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            + Add project
          </button>
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-bold text-[#F3F6F4]" style={{ fontFamily: 'var(--font-clash)' }}>
              Featured ({featured.length})
            </h2>
            <p className="text-xs text-[#8A938E]" style={{ fontFamily: 'var(--font-jakarta)' }}>
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
          <h2 className="text-xl font-bold text-[#F3F6F4] mb-4" style={{ fontFamily: 'var(--font-clash)' }}>
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
                  statusBadges: editing.statusBadges ?? [],
                  collaborators: (editing.collaborators ?? []).map((c) => ({
                    name: c.name,
                    url: c.url ?? '',
                  })),
                }
              : EMPTY_FORM
          }
          isEdit={!!editing}
          isPending={isPending}
          bulkOutcomes={bulkOutcomes}
          onCancel={() => {
            setEditing(null)
            setCreating(false)
            setBulkOutcomes(null)
          }}
          onSubmit={handleSubmit}
          onBulkSubmit={handleBulkSubmit}
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
    <div className="bg-[#0F0F0F] border border-[#1F2421] rounded-lg p-4 hover:border-[#2B302D] transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-[#F3F6F4] font-medium truncate" style={{ fontFamily: 'var(--font-clash)' }}>
              {project.name}
            </p>
            <span
              className="text-[10px] px-1.5 py-0.5 bg-[#1F2421] text-[#8A938E] rounded uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              {project.type}
            </span>
            {project.statusBadges?.map((b) => (
              <StatusPill key={b} badge={b} />
            ))}
          </div>
          <p className="text-[#8A938E] text-sm truncate" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {project.tagline}
          </p>
          {project.collaborators && project.collaborators.length > 0 && (
            <p
              className="text-[#5C615E] text-xs mt-1 truncate"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              with {project.collaborators.map((c) => c.name).join(', ')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onReorderUp && onReorderDown && (
            <>
              <IconBtn label="↑" disabled={isPending || isFirst} onClick={onReorderUp} title="Move up" />
              <IconBtn label="↓" disabled={isPending || isLast} onClick={onReorderDown} title="Move down" />
              <div className="w-px h-6 bg-[#1F2421] mx-1" />
            </>
          )}
          <button
            onClick={onToggle}
            disabled={isPending}
            className={`px-3 py-1.5 text-xs rounded font-medium transition-colors disabled:opacity-50 ${
              project.featured
                ? 'bg-[#3DF49A]/10 text-[#3DF49A] hover:bg-[#3DF49A]/20'
                : 'bg-[#1F2421] text-[#8A938E] hover:bg-[#3DF49A] hover:text-[#06160E]'
            }`}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            {project.featured ? 'Unfeature' : 'Feature'}
          </button>
          <button
            onClick={onEdit}
            disabled={isPending}
            className="px-3 py-1.5 text-xs bg-[#1F2421] text-[#F3F6F4] rounded hover:bg-[#2B302D] disabled:opacity-50 transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={isPending}
            className="px-3 py-1.5 text-xs bg-[#1F2421] text-red-400 rounded hover:bg-red-500/20 disabled:opacity-50 transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
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
      className="w-8 h-8 flex items-center justify-center text-xs bg-[#1F2421] text-[#8A938E] rounded hover:bg-[#2B302D] disabled:opacity-30 transition-colors"
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
  bulkOutcomes,
  onCancel,
  onSubmit,
  onBulkSubmit,
}: {
  initial: ProjectFormState
  isEdit: boolean
  isPending: boolean
  bulkOutcomes: BulkProjectOutcome[] | null
  onCancel: () => void
  onSubmit: (form: ProjectFormState) => void
  onBulkSubmit: (rawJson: string) => void
}) {
  const [form, setForm] = useState<ProjectFormState>(initial)
  const [tab, setTab] = useState<'form' | 'json'>('form')
  const [jsonText, setJsonText] = useState('')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <div
        className="bg-[#0F0F0F] border border-[#1F2421] rounded-2xl w-full max-w-3xl p-8 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold text-[#F3F6F4]"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            {isEdit ? 'Edit project' : 'New project'}
          </h2>
          {!isEdit && (
            <div className="flex items-center bg-[#070807] border border-[#1F2421] rounded-lg p-1">
              <TabButton active={tab === 'form'} onClick={() => setTab('form')}>
                Form
              </TabButton>
              <TabButton active={tab === 'json'} onClick={() => setTab('json')}>
                Paste JSON
              </TabButton>
            </div>
          )}
        </div>

        {/* ── FORM TAB ── */}
        {(isEdit || tab === 'form') && (
          <>
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

              <Field label="Status badges">
                <div className="flex flex-wrap gap-2">
                  {STATUS_BADGES.map((badge) => {
                    const on = form.statusBadges.includes(badge)
                    return (
                      <button
                        key={badge}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            statusBadges: on
                              ? form.statusBadges.filter((b) => b !== badge)
                              : [...form.statusBadges, badge],
                          })
                        }
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors uppercase tracking-wider ${
                          on
                            ? badgeOnCls(badge)
                            : 'bg-transparent border-[#1F2421] text-[#5C615E] hover:border-[#2B302D] hover:text-[#8A938E]'
                        }`}
                        style={{ fontFamily: 'var(--font-jetbrains)' }}
                      >
                        {on ? '✓ ' : ''}
                        {badge}
                      </button>
                    )
                  })}
                </div>
                <p
                  className="text-[10px] text-[#5C615E] mt-1.5"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  Toggle any combination, or none.
                </p>
              </Field>

              <Field label="Collaborators">
                {form.collaborators.length === 0 && (
                  <p
                    className="text-[10px] text-[#5C615E] mb-2"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                  >
                    No collaborators yet. Add a person, team, or organization the
                    project was built with.
                  </p>
                )}
                <div className="space-y-2">
                  {form.collaborators.map((c, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={c.name}
                        onChange={(e) => {
                          const next = [...form.collaborators]
                          next[i] = { ...next[i], name: e.target.value }
                          setForm({ ...form, collaborators: next })
                        }}
                        placeholder="Name (e.g. Tanvir Hossain, Team CoxMC)"
                        className={`${inputCls} flex-[2]`}
                      />
                      <input
                        value={c.url ?? ''}
                        onChange={(e) => {
                          const next = [...form.collaborators]
                          next[i] = { ...next[i], url: e.target.value }
                          setForm({ ...form, collaborators: next })
                        }}
                        placeholder="URL (optional)"
                        className={`${inputCls} flex-[3]`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            collaborators: form.collaborators.filter((_, j) => j !== i),
                          })
                        }
                        className="shrink-0 w-9 h-9 flex items-center justify-center text-[#8A938E] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      collaborators: [...form.collaborators, { name: '', url: '' }],
                    })
                  }
                  className="mt-2 px-3 py-1.5 text-xs border border-dashed border-[#1F2421] text-[#8A938E] hover:text-[#3DF49A] hover:border-[#3DF49A]/40 rounded-lg transition-colors"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  + Add collaborator
                </button>
              </Field>

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

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-[#1F2421]">
              <button
                onClick={onCancel}
                disabled={isPending}
                className="px-4 py-2 text-sm text-[#8A938E] rounded-lg hover:text-[#F3F6F4] disabled:opacity-50 transition-colors"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => onSubmit(form)}
                disabled={isPending}
                className="px-5 py-2 text-sm bg-[#3DF49A] text-[#06160E] rounded-lg font-medium hover:bg-[#5BFBA8] disabled:opacity-50 transition-colors"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {isPending ? 'Saving...' : isEdit ? 'Save changes' : 'Create project'}
              </button>
            </div>
          </>
        )}

        {/* ── JSON TAB ── */}
        {!isEdit && tab === 'json' && (
          <>
            <div className="space-y-4">
              <div
                className="text-xs text-[#8A938E] space-y-2 bg-[#070807] border border-[#1F2421] rounded-lg p-3"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                <p>
                  Paste one project, an array, or{' '}
                  <code className="text-[#3DF49A]">{'{ "projects": [...] }'}</code>. Existing
                  projects (matched by <code className="text-[#3DF49A]">name</code>) are updated;
                  new ones are created. <strong className="text-[#F3F6F4]">Required:</strong> name,
                  tagline, description, repoUrl.
                </p>
                <details>
                  <summary className="cursor-pointer text-[#F3F6F4] hover:text-[#3DF49A]">
                    Show example
                  </summary>
                  <pre className="mt-2 text-[11px] overflow-x-auto text-[#8A938E] leading-relaxed">
{`{
  "projects": [
    {
      "name": "D-Shastho",
      "type": "Health",
      "tags": ["Next.js", "TypeScript", "Neon"],
      "tagline": "A diabetes operating system for Bangladesh.",
      "description": "Health platform for at-risk diabetics...",
      "liveUrl": null,
      "repoUrl": "https://github.com/Tanvir83775757676/D-SHASTHO",
      "statusBadges": ["beta", "funding"],
      "collaborators": [
        "Tanvir Hossain",
        { "name": "Cox's Bazar Medical College", "url": "https://cbmc.edu.bd" }
      ]
    }
  ]
}

// statusBadges (optional): any subset of
//   ["live", "beta", "deprecated", "funding"]
// collaborators (optional): array of strings or
//   { "name": "...", "url": "..." } objects.
// Omit either field for none.`}
                  </pre>
                </details>
              </div>

              <Field label="JSON *">
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
                  placeholder='{ "projects": [ { "name": "...", "tagline": "...", "description": "...", "repoUrl": "..." } ] }'
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                />
              </Field>

              {bulkOutcomes && bulkOutcomes.length > 0 && (
                <div className="bg-[#070807] border border-[#1F2421] rounded-lg p-3 max-h-40 overflow-y-auto">
                  <p
                    className="text-[10px] uppercase tracking-widest text-[#8A938E] mb-2"
                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                  >
                    Results
                  </p>
                  <ul className="space-y-1">
                    {bulkOutcomes.map((o) => (
                      <li
                        key={o.index}
                        className="flex items-start gap-2 text-xs"
                        style={{ fontFamily: 'var(--font-jakarta)' }}
                      >
                        <span
                          className={`shrink-0 w-16 text-[10px] uppercase tracking-wider ${
                            o.status === 'created'
                              ? 'text-[#3DF49A]'
                              : o.status === 'updated'
                              ? 'text-blue-400'
                              : 'text-red-400'
                          }`}
                          style={{ fontFamily: 'var(--font-jetbrains)' }}
                        >
                          {o.status === 'created'
                            ? '✓ new'
                            : o.status === 'updated'
                            ? '↻ updated'
                            : '✗ error'}
                        </span>
                        <span className="text-[#F3F6F4]">{o.name || `(row ${o.index + 1})`}</span>
                        {o.error && <span className="text-red-400">— {o.error}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-[#1F2421]">
              <button
                onClick={onCancel}
                disabled={isPending}
                className="px-4 py-2 text-sm text-[#8A938E] rounded-lg hover:text-[#F3F6F4] disabled:opacity-50 transition-colors"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Close
              </button>
              <button
                onClick={() => onBulkSubmit(jsonText)}
                disabled={isPending || !jsonText.trim()}
                className="px-5 py-2 text-sm bg-[#3DF49A] text-[#06160E] rounded-lg font-medium hover:bg-[#5BFBA8] disabled:opacity-50 transition-colors"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {isPending ? 'Importing...' : 'Import'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
        active
          ? 'bg-[#3DF49A] text-[#06160E]'
          : 'text-[#8A938E] hover:text-[#F3F6F4]'
      }`}
      style={{ fontFamily: 'var(--font-jakarta)' }}
    >
      {children}
    </button>
  )
}

const inputCls =
  "w-full px-4 py-2.5 bg-[#070807] border border-[#1F2421] rounded-lg text-[#F3F6F4] placeholder-[#5C615E] focus:outline-none focus:border-[#3DF49A] transition-colors text-sm font-['Plus_Jakarta_Sans',sans-serif]"

// Color palette per badge — used for both toggle (on state) and display pills.
function badgeOnCls(badge: string): string {
  switch (badge) {
    case 'live':
      return 'bg-[#3DF49A]/15 border-[#3DF49A]/40 text-[#3DF49A]'
    case 'beta':
      return 'bg-blue-500/15 border-blue-500/40 text-blue-400'
    case 'deprecated':
      return 'bg-[#1F2421] border-[#2B302D] text-[#8A938E]'
    case 'funding':
      return 'bg-amber-500/15 border-amber-500/40 text-amber-400'
    default:
      return 'bg-[#1F2421] border-[#2B302D] text-[#8A938E]'
  }
}

function StatusPill({ badge }: { badge: string }) {
  return (
    <span
      className={`text-[10px] px-2 py-0.5 border rounded-full uppercase tracking-wider font-medium ${badgeOnCls(
        badge,
      )}`}
      style={{ fontFamily: 'var(--font-jetbrains)' }}
    >
      {badge}
    </span>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-[#F3F6F4] text-xs mb-1.5 font-medium uppercase tracking-wider"
        style={{ fontFamily: 'var(--font-jetbrains)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}
