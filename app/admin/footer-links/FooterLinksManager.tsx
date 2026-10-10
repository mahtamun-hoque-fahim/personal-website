'use client'

import { useMemo, useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, Check, Loader2, ExternalLink } from 'lucide-react'
import type { FooterLink, NewFooterLink } from '@/lib/db/queries'
import {
  createFooterLinkAction,
  updateFooterLinkAction,
  deleteFooterLinkAction,
  reorderFooterLinksAction,
} from '@/app/admin/actions'

// ── Shared UI (matches SkillsManager / CredentialsManager) ────────────────

const inputCls =
  'w-full bg-[#222222] border border-[#333333] rounded-lg px-3 py-2 text-sm text-[#F3F6F4] placeholder-[#5C615E] focus:outline-none focus:border-[#3DF49A] transition-colors'
const labelCls = 'block text-xs font-medium text-[#5C615E] mb-1 uppercase tracking-wider'
const btnPrimary =
  'flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3DF49A] text-[#111111] text-sm font-semibold hover:bg-[#2de088] transition-colors disabled:opacity-50'
const btnSecondary =
  'flex items-center gap-2 px-3 py-2 rounded-lg border border-[#333333] text-sm text-[#8A938E] hover:text-[#F3F6F4] hover:border-[#444444] transition-colors'

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
      <div className="relative bg-[#222222] border border-[#333333] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[#333333]">
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

export default function FooterLinksManager({ initialLinks }: { initialLinks: FooterLink[] }) {
  const [links, setLinks] = useState(initialLinks)
  const [pending, startTransition] = useTransition()

  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; link?: FooterLink }>({
    open: false,
    mode: 'create',
  })
  const [form, setForm] = useState<Partial<NewFooterLink>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Bucket by groupLabel, first-appearance order (in the current sortOrder
  // pass) decides which column shows first. Membership is by label only —
  // items don't need to sit in a contiguous numeric range to belong
  // together, so moving one item's sortOrder never splits its group.
  const groups = useMemo(() => {
    const map = new Map<string, FooterLink[]>()
    for (const l of links) {
      if (!map.has(l.groupLabel)) map.set(l.groupLabel, [])
      map.get(l.groupLabel)!.push(l)
    }
    return Array.from(map.entries())
  }, [links])

  const existingGroups = useMemo(() => Array.from(new Set(links.map((l) => l.groupLabel))), [links])

  function openCreate(defaultGroup?: string) {
    setForm({ groupLabel: defaultGroup ?? existingGroups[0] ?? 'Navigate', label: '', url: '', external: false })
    setModal({ open: true, mode: 'create' })
  }

  function openEdit(link: FooterLink) {
    setForm({ groupLabel: link.groupLabel, label: link.label, url: link.url, external: link.external })
    setModal({ open: true, mode: 'edit', link })
  }

  function saveLink() {
    startTransition(async () => {
      if (modal.mode === 'create') {
        const maxOrder = links.reduce((m, l) => Math.max(m, l.sortOrder), -1)
        const created = await createFooterLinkAction({ ...form, sortOrder: maxOrder + 1 } as NewFooterLink)
        if (created) setLinks((prev) => [...prev, created])
      } else if (modal.link) {
        const updated = await updateFooterLinkAction(modal.link.id, form)
        if (updated) setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
      }
      setModal({ open: false, mode: 'create' })
    })
  }

  // Swaps sortOrder with the neighbor WITHIN the same group only — this
  // never lets a reorder click move an item into a different column.
  function reorderWithinGroup(groupItems: FooterLink[], idx: number, dir: -1 | 1) {
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= groupItems.length) return
    const a = groupItems[idx]
    const b = groupItems[swapIdx]
    setLinks((prev) =>
      prev
        .map((l) => {
          if (l.id === a.id) return { ...l, sortOrder: b.sortOrder }
          if (l.id === b.id) return { ...l, sortOrder: a.sortOrder }
          return l
        })
        .sort((x, y) => x.sortOrder - y.sortOrder)
    )
    startTransition(() =>
      reorderFooterLinksAction([
        { id: a.id, order: b.sortOrder },
        { id: b.id, order: a.sortOrder },
      ])
    )
  }

  function confirmDeleteNow() {
    if (!deleteId) return
    const id = deleteId
    setDeleteId(null)
    startTransition(async () => {
      await deleteFooterLinkAction(id)
      setLinks((prev) => prev.filter((l) => l.id !== id))
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-[#5C615E]">
          Links sharing the same group name render together as one footer column. Group display order follows whichever group's links were added first — move a link to the top of its group to bring the whole column forward.
        </p>
        <button onClick={() => openCreate()} className={btnPrimary}>
          <Plus className="h-4 w-4" /> New Link
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(([groupLabel, items]) => (
          <div key={groupLabel} className="bg-[#222222] border border-[#333333] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5C615E]">{groupLabel}</h4>
              <button
                onClick={() => openCreate(groupLabel)}
                className="text-xs text-[#3DF49A] hover:text-[#5BFBA8] transition-colors"
              >
                + Add here
              </button>
            </div>
            {items.map((link, idx) => (
              <div key={link.id} className="flex items-center gap-2 py-2 border-t border-[#333333] first:border-t-0">
                <ReorderBtns
                  onUp={() => reorderWithinGroup(items, idx, -1)}
                  onDown={() => reorderWithinGroup(items, idx, 1)}
                  upDisabled={idx === 0}
                  downDisabled={idx === items.length - 1}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F3F6F4] flex items-center gap-1 truncate">
                    {link.label}
                    {link.external && <ExternalLink className="h-3 w-3 text-[#5C615E] shrink-0" />}
                  </p>
                  <p className="text-xs text-[#5C615E] truncate">{link.url}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(link)} className="p-1.5 text-[#5C615E] hover:text-[#3DF49A] transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(link.id)} className="p-1.5 text-[#5C615E] hover:text-red-400 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-xs text-[#5C615E] py-2">No links yet.</p>}
          </div>
        ))}
        {groups.length === 0 && <p className="text-sm text-[#5C615E] py-6 text-center col-span-2">No footer links yet.</p>}
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, mode: 'create' })}
        title={modal.mode === 'create' ? 'New Footer Link' : 'Edit Footer Link'}
      >
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Group</label>
            <input
              className={inputCls}
              list="footer-link-groups"
              value={form.groupLabel ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, groupLabel: e.target.value }))}
              placeholder="Navigate"
            />
            <datalist id="footer-link-groups">
              {existingGroups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
            <p className="text-xs text-[#5C615E] mt-1">Type an existing group to add to that column, or a new name to start one.</p>
          </div>
          <div>
            <label className={labelCls}>Label</label>
            <input
              className={inputCls}
              value={form.label ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              placeholder="About"
            />
          </div>
          <div>
            <label className={labelCls}>URL</label>
            <input
              className={inputCls}
              value={form.url ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              placeholder="/about or https://..."
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#8A938E] cursor-pointer">
            <input
              type="checkbox"
              checked={form.external ?? false}
              onChange={(e) => setForm((p) => ({ ...p, external: e.target.checked }))}
              className="accent-[#3DF49A]"
            />
            Opens in a new tab (external link)
          </label>
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setModal({ open: false, mode: 'create' })} className={btnSecondary}>
              Cancel
            </button>
            <button onClick={saveLink} disabled={pending} className={btnPrimary}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
            </button>
          </div>
        </div>
      </Modal>

      {/* ── DELETE CONFIRM ── */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete link?">
        <div className="space-y-4">
          <p className="text-sm text-[#8A938E]">This removes the link from the footer immediately. This can&apos;t be undone.</p>
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
