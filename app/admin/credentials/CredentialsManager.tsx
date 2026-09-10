'use client'

import { useState, useTransition } from 'react'
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  X, Check, Loader2, Award, GitBranch, Users, Clock
} from 'lucide-react'
import type {
  CredentialTimeline, CredentialCluster, CredentialCert,
  CredentialCommunity, CredentialContribution,
  NewCredentialTimeline, NewCredentialCluster, NewCredentialCert,
  NewCredentialCommunity, NewCredentialContribution,
} from '@/lib/db/queries'
import {
  createTimelineEntryAction, updateTimelineEntryAction, deleteTimelineEntryAction, reorderTimelineAction,
  createClusterAction, updateClusterAction, deleteClusterAction, reorderClustersAction,
  createCertAction, updateCertAction, deleteCertAction, reorderCertsAction,
  createCommunityEntryAction, updateCommunityEntryAction, deleteCommunityEntryAction, reorderCommunityAction,
  createContributionAction, updateContributionAction, deleteContributionAction, reorderContributionsAction,
} from '@/app/admin/actions'

// ── Shared UI ─────────────────────────────────────────────

const inputCls = 'w-full bg-[#0F1210] border border-[#1F2421] rounded-lg px-3 py-2 text-sm text-[#F3F6F4] placeholder-[#3A3F3C] focus:outline-none focus:border-[#3DF49A] transition-colors'
const labelCls = 'block text-xs font-medium text-[#5C615E] mb-1 uppercase tracking-wider'
const btnPrimary = 'flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3DF49A] text-[#070807] text-sm font-semibold hover:bg-[#2de088] transition-colors disabled:opacity-50'
const btnSecondary = 'flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1F2421] text-sm text-[#8A938E] hover:text-[#F3F6F4] hover:border-[#3A3F3C] transition-colors'
const btnDanger = 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors'

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#0A0C0B] border border-[#1F2421] rounded-xl p-4 mb-3">{children}</div>
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#0A0C0B] border border-[#1F2421] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[#1F2421]">
          <h3 className="font-bold text-[#F3F6F4]" style={{ fontFamily: 'var(--font-clash)' }}>{title}</h3>
          <button onClick={onClose} className="text-[#5C615E] hover:text-[#F3F6F4] transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-[#3DF49A]/10 text-[#3DF49A] border border-[#3DF49A]/20' : 'text-[#5C615E] hover:text-[#F3F6F4]'}`}
      style={{ fontFamily: 'var(--font-jakarta)' }}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
      {label}
    </button>
  )
}

function ReorderBtns({ onUp, onDown, upDisabled, downDisabled }: { onUp: () => void; onDown: () => void; upDisabled: boolean; downDisabled: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <button onClick={onUp} disabled={upDisabled} className="p-1 rounded text-[#5C615E] hover:text-[#F3F6F4] disabled:opacity-30 transition-colors"><ChevronUp className="h-3 w-3" /></button>
      <button onClick={onDown} disabled={downDisabled} className="p-1 rounded text-[#5C615E] hover:text-[#F3F6F4] disabled:opacity-30 transition-colors"><ChevronDown className="h-3 w-3" /></button>
    </div>
  )
}

function JsonTab({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={12}
      placeholder={placeholder ?? '[\n  {\n    "title": "...",\n    ...\n  }\n]'}
      className={`${inputCls} font-mono text-xs resize-none`}
    />
  )
}

// ── Props ─────────────────────────────────────────────────

interface Props {
  initialTimeline: CredentialTimeline[]
  initialClusters: CredentialCluster[]
  initialCerts: CredentialCert[]
  initialCommunity: CredentialCommunity[]
  initialContributions: CredentialContribution[]
}

export default function CredentialsManager({ initialTimeline, initialClusters, initialCerts, initialCommunity, initialContributions }: Props) {
  const [tab, setTab] = useState<'timeline' | 'certs' | 'community' | 'contributions'>('timeline')
  const [timeline, setTimeline] = useState(initialTimeline)
  const [clusters, setClusters] = useState(initialClusters)
  const [certs, setCerts] = useState(initialCerts)
  const [community, setCommunity] = useState(initialCommunity)
  const [contributions, setContributions] = useState(initialContributions)
  const [pending, startTransition] = useTransition()

  // ── Timeline tab ────────────────────────────────────────
  const [tlModal, setTlModal] = useState<{ open: boolean; mode: 'create' | 'edit' | 'json'; entry?: CredentialTimeline }>({ open: false, mode: 'create' })
  const [tlForm, setTlForm] = useState<Partial<NewCredentialTimeline>>({})
  const [tlJson, setTlJson] = useState('')
  const [tlJsonMode, setTlJsonMode] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; label: string; action: () => void }>({ open: false, id: '', label: '', action: () => {} })

  function openTlCreate() {
    setTlForm({ year: '', period: '', title: '', org: '', desc: '', tags: [], type: 'work', isCurrent: false })
    setTlJsonMode(false)
    setTlModal({ open: true, mode: 'create' })
  }
  function openTlEdit(entry: CredentialTimeline) {
    setTlForm({ ...entry })
    setTlJsonMode(false)
    setTlModal({ open: true, mode: 'edit', entry })
  }

  function saveTlForm() {
    startTransition(async () => {
      if (tlModal.mode === 'create') {
        const result = await createTimelineEntryAction({ ...tlForm, sortOrder: timeline.length } as NewCredentialTimeline)
        if (result) setTimeline(prev => [...prev, result])
      } else if (tlModal.entry) {
        const result = await updateTimelineEntryAction(tlModal.entry.id, tlForm)
        if (result) setTimeline(prev => prev.map(e => e.id === result.id ? result : e))
      }
      setTlModal({ open: false, mode: 'create' })
    })
  }

  function saveTlJson() {
    try {
      const parsed = JSON.parse(tlJson)
      const rows: NewCredentialTimeline[] = Array.isArray(parsed) ? parsed : [parsed]
      startTransition(async () => {
        const results: CredentialTimeline[] = []
        for (let i = 0; i < rows.length; i++) {
          const r = await createTimelineEntryAction({ ...rows[i], sortOrder: timeline.length + i })
          if (r) results.push(r)
        }
        setTimeline(prev => [...prev, ...results])
        setTlModal({ open: false, mode: 'create' })
      })
    } catch { alert('Invalid JSON') }
  }

  function reorderTl(idx: number, dir: -1 | 1) {
    const next = [...timeline]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    const orders = next.map((e, i) => ({ id: e.id, order: i }))
    setTimeline(next)
    startTransition(() => reorderTimelineAction(orders))
  }

  // ── Cluster + Cert tab ──────────────────────────────────
  const [clModal, setClModal] = useState<{ open: boolean; mode: 'create' | 'edit'; cluster?: CredentialCluster }>({ open: false, mode: 'create' })
  const [clForm, setClForm] = useState<Partial<NewCredentialCluster>>({})
  const [certModal, setCertModal] = useState<{ open: boolean; mode: 'create' | 'edit' | 'json'; cert?: CredentialCert; clusterId?: string }>({ open: false, mode: 'create' })
  const [certForm, setCertForm] = useState<Partial<NewCredentialCert>>({})
  const [certJson, setCertJson] = useState('')
  const [certJsonMode, setCertJsonMode] = useState(false)

  function saveCluster() {
    startTransition(async () => {
      if (clModal.mode === 'create') {
        const r = await createClusterAction({ ...clForm, sortOrder: clusters.length } as NewCredentialCluster)
        if (r) setClusters(prev => [...prev, r])
      } else if (clModal.cluster) {
        const r = await updateClusterAction(clModal.cluster.id, clForm)
        if (r) setClusters(prev => prev.map(c => c.id === r.id ? r : c))
      }
      setClModal({ open: false, mode: 'create' })
    })
  }

  function reorderCl(idx: number, dir: -1 | 1) {
    const next = [...clusters]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setClusters(next)
    startTransition(() => reorderClustersAction(next.map((c, i) => ({ id: c.id, order: i }))))
  }

  function saveCert() {
    startTransition(async () => {
      const clusterCerts = certs.filter(c => c.clusterId === certForm.clusterId)
      if (certModal.mode === 'create') {
        const r = await createCertAction({ ...certForm, sortOrder: clusterCerts.length } as NewCredentialCert)
        if (r) setCerts(prev => [...prev, r])
      } else if (certModal.cert) {
        const r = await updateCertAction(certModal.cert.id, certForm)
        if (r) setCerts(prev => prev.map(c => c.id === r.id ? r : c))
      }
      setCertModal({ open: false, mode: 'create' })
    })
  }

  function saveCertJson() {
    try {
      const parsed = JSON.parse(certJson)
      const rows: NewCredentialCert[] = Array.isArray(parsed) ? parsed : [parsed]
      startTransition(async () => {
        const results: CredentialCert[] = []
        for (let i = 0; i < rows.length; i++) {
          const r = await createCertAction({ ...rows[i], sortOrder: certs.length + i })
          if (r) results.push(r)
        }
        setCerts(prev => [...prev, ...results])
        setCertModal({ open: false, mode: 'create' })
      })
    } catch { alert('Invalid JSON') }
  }

  function reorderCert(clusterId: string, idx: number, dir: -1 | 1) {
    const clusterCerts = certs.filter(c => c.clusterId === clusterId)
    const swap = idx + dir
    if (swap < 0 || swap >= clusterCerts.length) return
    ;[clusterCerts[idx], clusterCerts[swap]] = [clusterCerts[swap], clusterCerts[idx]]
    const updated = certs.map(c => {
      const pos = clusterCerts.findIndex(cc => cc.id === c.id)
      return pos >= 0 ? { ...clusterCerts[pos], sortOrder: pos } : c
    })
    setCerts(updated)
    startTransition(() => reorderCertsAction(clusterCerts.map((c, i) => ({ id: c.id, order: i }))))
  }

  // ── Community tab ───────────────────────────────────────
  const [comModal, setComModal] = useState<{ open: boolean; mode: 'create' | 'edit' | 'json'; entry?: CredentialCommunity }>({ open: false, mode: 'create' })
  const [comForm, setComForm] = useState<Partial<NewCredentialCommunity>>({})
  const [comDetailsInput, setComDetailsInput] = useState('')
  const [comJson, setComJson] = useState('')
  const [comJsonMode, setComJsonMode] = useState(false)

  function saveCom() {
    startTransition(async () => {
      const payload = { ...comForm, details: comDetailsInput.split('\n').map(s => s.trim()).filter(Boolean) }
      if (comModal.mode === 'create') {
        const r = await createCommunityEntryAction({ ...payload, sortOrder: community.length } as NewCredentialCommunity)
        if (r) setCommunity(prev => [...prev, r])
      } else if (comModal.entry) {
        const r = await updateCommunityEntryAction(comModal.entry.id, payload)
        if (r) setCommunity(prev => prev.map(c => c.id === r.id ? r : c))
      }
      setComModal({ open: false, mode: 'create' })
    })
  }

  function saveComJson() {
    try {
      const parsed = JSON.parse(comJson)
      const rows = Array.isArray(parsed) ? parsed : [parsed]
      startTransition(async () => {
        const results: CredentialCommunity[] = []
        for (let i = 0; i < rows.length; i++) {
          const r = await createCommunityEntryAction({ ...rows[i], sortOrder: community.length + i })
          if (r) results.push(r)
        }
        setCommunity(prev => [...prev, ...results])
        setComModal({ open: false, mode: 'create' })
      })
    } catch { alert('Invalid JSON') }
  }

  function reorderCom(idx: number, dir: -1 | 1) {
    const next = [...community]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setCommunity(next)
    startTransition(() => reorderCommunityAction(next.map((c, i) => ({ id: c.id, order: i }))))
  }

  // ── Contributions tab ───────────────────────────────────
  const [conModal, setConModal] = useState<{ open: boolean; mode: 'create' | 'edit' | 'json'; entry?: CredentialContribution }>({ open: false, mode: 'create' })
  const [conForm, setConForm] = useState<Partial<NewCredentialContribution>>({})
  const [conJson, setConJson] = useState('')
  const [conJsonMode, setConJsonMode] = useState(false)

  function saveCon() {
    startTransition(async () => {
      if (conModal.mode === 'create') {
        const r = await createContributionAction({ ...conForm, sortOrder: contributions.length } as NewCredentialContribution)
        if (r) setContributions(prev => [...prev, r])
      } else if (conModal.entry) {
        const r = await updateContributionAction(conModal.entry.id, conForm)
        if (r) setContributions(prev => prev.map(c => c.id === r.id ? r : c))
      }
      setConModal({ open: false, mode: 'create' })
    })
  }

  function saveConJson() {
    try {
      const parsed = JSON.parse(conJson)
      const rows = Array.isArray(parsed) ? parsed : [parsed]
      startTransition(async () => {
        const results: CredentialContribution[] = []
        for (let i = 0; i < rows.length; i++) {
          const r = await createContributionAction({ ...rows[i], sortOrder: contributions.length + i })
          if (r) results.push(r)
        }
        setContributions(prev => [...prev, ...results])
        setConModal({ open: false, mode: 'create' })
      })
    } catch { alert('Invalid JSON') }
  }

  function reorderCon(idx: number, dir: -1 | 1) {
    const next = [...contributions]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setContributions(next)
    startTransition(() => reorderContributionsAction(next.map((c, i) => ({ id: c.id, order: i }))))
  }

  // ── Confirm delete helper ───────────────────────────────
  function confirmDelete(label: string, action: () => void) {
    setDeleteModal({ open: true, id: '', label, action })
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <TabBtn active={tab === 'timeline'} onClick={() => setTab('timeline')} icon={Clock} label={`Timeline (${timeline.length})`} />
        <TabBtn active={tab === 'certs'} onClick={() => setTab('certs')} icon={Award} label={`Certifications (${certs.length})`} />
        <TabBtn active={tab === 'community'} onClick={() => setTab('community')} icon={Users} label={`Community (${community.length})`} />
        <TabBtn active={tab === 'contributions'} onClick={() => setTab('contributions')} icon={GitBranch} label={`Contributions (${contributions.length})`} />
      </div>

      {/* ── TIMELINE ── */}
      {tab === 'timeline' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-[#5C615E]">Drag to reorder using the arrows. Most recent first.</p>
            <div className="flex gap-2">
              <button onClick={() => { setTlJson(''); setTlJsonMode(true); setTlModal({ open: true, mode: 'create' }) }} className={btnSecondary}>Paste JSON</button>
              <button onClick={openTlCreate} className={btnPrimary}><Plus className="h-4 w-4" /> Add Entry</button>
            </div>
          </div>
          {timeline.map((entry, idx) => (
            <SectionCard key={entry.id}>
              <div className="flex items-start gap-3">
                <ReorderBtns onUp={() => reorderTl(idx, -1)} onDown={() => reorderTl(idx, 1)} upDisabled={idx === 0} downDisabled={idx === timeline.length - 1} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#3DF49A] font-mono">{entry.year}</span>
                    <span className="text-xs text-[#5C615E]">{entry.period}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${entry.type === 'work' ? 'border-blue-500/30 text-blue-400' : entry.type === 'education' ? 'border-purple-500/30 text-purple-400' : 'border-yellow-500/30 text-yellow-400'}`}>{entry.type}</span>
                    {entry.isCurrent && <span className="text-xs px-2 py-0.5 rounded-full border border-[#3DF49A]/30 text-[#3DF49A]">current</span>}
                  </div>
                  <p className="text-sm font-semibold text-[#F3F6F4]">{entry.title}</p>
                  <p className="text-xs text-[#8A938E]">{entry.org}</p>
                  <p className="text-xs text-[#5C615E] mt-1 line-clamp-2">{entry.desc}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">{entry.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 bg-[#1A1F1C] rounded text-[#5C615E]">{t}</span>)}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openTlEdit(entry)} className="p-2 text-[#5C615E] hover:text-[#3DF49A] transition-colors"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => confirmDelete(`"${entry.title}" at ${entry.org}`, () => startTransition(async () => { await deleteTimelineEntryAction(entry.id); setTimeline(prev => prev.filter(e => e.id !== entry.id)) }))} className="p-2 text-[#5C615E] hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </SectionCard>
          ))}
          {timeline.length === 0 && <p className="text-center text-[#5C615E] py-12 text-sm">No timeline entries yet.</p>}
        </div>
      )}

      {/* ── CERTIFICATIONS ── */}
      {tab === 'certs' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-[#5C615E]">Manage clusters and certs within each cluster.</p>
            <button onClick={() => { setClForm({ title: '', iconId: 'other', badge: '' }); setClModal({ open: true, mode: 'create' }) }} className={btnPrimary}><Plus className="h-4 w-4" /> New Cluster</button>
          </div>
          {clusters.map((cluster, clIdx) => {
            const clusterCerts = certs.filter(c => c.clusterId === cluster.id).sort((a, b) => a.sortOrder - b.sortOrder)
            return (
              <div key={cluster.id} className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <ReorderBtns onUp={() => reorderCl(clIdx, -1)} onDown={() => reorderCl(clIdx, 1)} upDisabled={clIdx === 0} downDisabled={clIdx === clusters.length - 1} />
                  <div className="flex-1">
                    <span className="font-semibold text-[#F3F6F4] text-sm">{cluster.title}</span>
                    {cluster.badge && <span className="ml-2 text-xs text-[#5C615E]">{cluster.badge}</span>}
                    <span className="ml-2 text-xs text-[#3A3F3C]">icon: {cluster.iconId}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setCertForm({ clusterId: cluster.id, name: '', issuer: '', date: '', isFoundational: false }); setCertJsonMode(false); setCertModal({ open: true, mode: 'create', clusterId: cluster.id }) }} className={btnSecondary}><Plus className="h-3 w-3" /> Add Cert</button>
                    <button onClick={() => { setCertJson(''); setCertJsonMode(true); setCertModal({ open: true, mode: 'json', clusterId: cluster.id }) }} className={btnSecondary}>JSON</button>
                    <button onClick={() => { setClForm({ ...cluster }); setClModal({ open: true, mode: 'edit', cluster }) }} className="p-2 text-[#5C615E] hover:text-[#3DF49A] transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => confirmDelete(`cluster "${cluster.title}" and all its certs`, () => startTransition(async () => { await deleteClusterAction(cluster.id); setClusters(prev => prev.filter(c => c.id !== cluster.id)); setCerts(prev => prev.filter(c => c.clusterId !== cluster.id)) }))} className="p-2 text-[#5C615E] hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="ml-10 space-y-2">
                  {clusterCerts.map((cert, cIdx) => (
                    <SectionCard key={cert.id}>
                      <div className="flex items-center gap-3">
                        <ReorderBtns onUp={() => reorderCert(cluster.id, cIdx, -1)} onDown={() => reorderCert(cluster.id, cIdx, 1)} upDisabled={cIdx === 0} downDisabled={cIdx === clusterCerts.length - 1} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#F3F6F4]">{cert.name}</p>
                          <p className="text-xs text-[#5C615E]">{cert.issuer} · {cert.date}{cert.ects ? ` · ${cert.ects} ECTS` : ''}{cert.credentialId ? ` · ID: ${cert.credentialId}` : ''}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {cert.isFoundational && <span className="text-xs px-2 py-0.5 rounded-full border border-yellow-500/30 text-yellow-400">foundational</span>}
                          <button onClick={() => { setCertForm({ ...cert }); setCertJsonMode(false); setCertModal({ open: true, mode: 'edit', cert }) }} className="p-2 text-[#5C615E] hover:text-[#3DF49A] transition-colors"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => confirmDelete(`cert "${cert.name}"`, () => startTransition(async () => { await deleteCertAction(cert.id); setCerts(prev => prev.filter(c => c.id !== cert.id)) }))} className="p-2 text-[#5C615E] hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </SectionCard>
                  ))}
                  {clusterCerts.length === 0 && <p className="text-xs text-[#3A3F3C] py-3 pl-2">No certs in this cluster yet.</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── COMMUNITY ── */}
      {tab === 'community' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-[#5C615E]">Community roles and memberships.</p>
            <div className="flex gap-2">
              <button onClick={() => { setComJson(''); setComJsonMode(true); setComModal({ open: true, mode: 'json' }) }} className={btnSecondary}>Paste JSON</button>
              <button onClick={() => { setComForm({ title: '', org: '', period: '', category: '', ongoing: false, details: [] }); setComDetailsInput(''); setComJsonMode(false); setComModal({ open: true, mode: 'create' }) }} className={btnPrimary}><Plus className="h-4 w-4" /> Add Role</button>
            </div>
          </div>
          {community.map((entry, idx) => (
            <SectionCard key={entry.id}>
              <div className="flex items-start gap-3">
                <ReorderBtns onUp={() => reorderCom(idx, -1)} onDown={() => reorderCom(idx, 1)} upDisabled={idx === 0} downDisabled={idx === community.length - 1} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#F3F6F4]">{entry.title}</p>
                    {entry.ongoing && <span className="text-xs px-2 py-0.5 rounded-full border border-[#3DF49A]/30 text-[#3DF49A]">ongoing</span>}
                  </div>
                  <p className="text-xs text-[#8A938E]">{entry.org} · {entry.period}</p>
                  {entry.category && <p className="text-xs text-[#5C615E]">{entry.category}</p>}
                  {entry.details.length > 0 && <ul className="mt-1 space-y-0.5">{entry.details.map((d, i) => <li key={i} className="text-xs text-[#5C615E]">· {d}</li>)}</ul>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setComForm({ ...entry }); setComDetailsInput(entry.details.join('\n')); setComJsonMode(false); setComModal({ open: true, mode: 'edit', entry }) }} className="p-2 text-[#5C615E] hover:text-[#3DF49A] transition-colors"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => confirmDelete(`"${entry.title}"`, () => startTransition(async () => { await deleteCommunityEntryAction(entry.id); setCommunity(prev => prev.filter(c => c.id !== entry.id)) }))} className="p-2 text-[#5C615E] hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </SectionCard>
          ))}
          {community.length === 0 && <p className="text-center text-[#5C615E] py-12 text-sm">No community roles yet.</p>}
        </div>
      )}

      {/* ── CONTRIBUTIONS ── */}
      {tab === 'contributions' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-[#5C615E]">Open source and notable contributions.</p>
            <div className="flex gap-2">
              <button onClick={() => { setConJson(''); setConJsonMode(true); setConModal({ open: true, mode: 'json' }) }} className={btnSecondary}>Paste JSON</button>
              <button onClick={() => { setConForm({ title: '', releases: '', desc: '', link: '', linkLabel: '' }); setConJsonMode(false); setConModal({ open: true, mode: 'create' }) }} className={btnPrimary}><Plus className="h-4 w-4" /> Add Contribution</button>
            </div>
          </div>
          {contributions.map((entry, idx) => (
            <SectionCard key={entry.id}>
              <div className="flex items-start gap-3">
                <ReorderBtns onUp={() => reorderCon(idx, -1)} onDown={() => reorderCon(idx, 1)} upDisabled={idx === 0} downDisabled={idx === contributions.length - 1} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#F3F6F4]">{entry.title}</p>
                  <p className="text-xs text-[#3DF49A]">{entry.releases}</p>
                  <p className="text-xs text-[#5C615E] mt-1">{entry.desc}</p>
                  <a href={entry.link} target="_blank" rel="noreferrer" className="text-xs text-[#8A938E] hover:text-[#3DF49A] transition-colors">{entry.linkLabel} →</a>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setConForm({ ...entry }); setConJsonMode(false); setConModal({ open: true, mode: 'edit', entry }) }} className="p-2 text-[#5C615E] hover:text-[#3DF49A] transition-colors"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => confirmDelete(`"${entry.title}"`, () => startTransition(async () => { await deleteContributionAction(entry.id); setContributions(prev => prev.filter(c => c.id !== entry.id)) }))} className="p-2 text-[#5C615E] hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </SectionCard>
          ))}
          {contributions.length === 0 && <p className="text-center text-[#5C615E] py-12 text-sm">No contributions yet.</p>}
        </div>
      )}

      {/* ── TIMELINE MODAL ── */}
      <Modal open={tlModal.open} onClose={() => setTlModal({ open: false, mode: 'create' })} title={tlJsonMode ? 'Paste Timeline JSON' : tlModal.mode === 'create' ? 'Add Timeline Entry' : 'Edit Timeline Entry'}>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTlJsonMode(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!tlJsonMode ? 'bg-[#3DF49A]/10 text-[#3DF49A]' : 'text-[#5C615E] hover:text-[#F3F6F4]'}`}>Form</button>
          <button onClick={() => setTlJsonMode(true)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tlJsonMode ? 'bg-[#3DF49A]/10 text-[#3DF49A]' : 'text-[#5C615E] hover:text-[#F3F6F4]'}`}>Paste JSON</button>
        </div>
        {tlJsonMode ? (
          <>
            <JsonTab value={tlJson} onChange={setTlJson} placeholder='[{"year":"2026","period":"Jul 2026 – Sep 2026","title":"...","org":"...","desc":"...","tags":[],"type":"work","isCurrent":false}]' />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setTlModal({ open: false, mode: 'create' })} className={btnSecondary}>Cancel</button>
              <button onClick={saveTlJson} disabled={pending} className={btnPrimary}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Import</button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Year</label><input className={inputCls} value={tlForm.year ?? ''} onChange={e => setTlForm(p => ({ ...p, year: e.target.value }))} placeholder="2026" /></div>
              <div><label className={labelCls}>Period</label><input className={inputCls} value={tlForm.period ?? ''} onChange={e => setTlForm(p => ({ ...p, period: e.target.value }))} placeholder="Jul 2026 – Sep 2026" /></div>
            </div>
            <div><label className={labelCls}>Title</label><input className={inputCls} value={tlForm.title ?? ''} onChange={e => setTlForm(p => ({ ...p, title: e.target.value }))} placeholder="Front-end AI Engineering Intern" /></div>
            <div><label className={labelCls}>Organisation</label><input className={inputCls} value={tlForm.org ?? ''} onChange={e => setTlForm(p => ({ ...p, org: e.target.value }))} placeholder="FlyRank AI" /></div>
            <div><label className={labelCls}>Description</label><textarea rows={3} className={inputCls} value={tlForm.desc ?? ''} onChange={e => setTlForm(p => ({ ...p, desc: e.target.value }))} /></div>
            <div><label className={labelCls}>Tags (comma separated)</label><input className={inputCls} value={(tlForm.tags ?? []).join(', ')} onChange={e => setTlForm(p => ({ ...p, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} placeholder="AI Engineering, Remote" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Type</label>
                <select className={inputCls} value={tlForm.type ?? 'work'} onChange={e => setTlForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="work">Work</option><option value="education">Education</option><option value="milestone">Milestone</option>
                </select>
              </div>
              <div className="flex items-end pb-2"><label className="flex items-center gap-2 text-sm text-[#8A938E] cursor-pointer"><input type="checkbox" className="accent-[#3DF49A]" checked={!!tlForm.isCurrent} onChange={e => setTlForm(p => ({ ...p, isCurrent: e.target.checked }))} /> Current role</label></div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setTlModal({ open: false, mode: 'create' })} className={btnSecondary}>Cancel</button>
              <button onClick={saveTlForm} disabled={pending} className={btnPrimary}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── CLUSTER MODAL ── */}
      <Modal open={clModal.open} onClose={() => setClModal({ open: false, mode: 'create' })} title={clModal.mode === 'create' ? 'New Cluster' : 'Edit Cluster'}>
        <div className="space-y-3">
          <div><label className={labelCls}>Title</label><input className={inputCls} value={clForm.title ?? ''} onChange={e => setClForm(p => ({ ...p, title: e.target.value }))} placeholder="AI & Machine Intelligence" /></div>
          <div><label className={labelCls}>Icon ID</label>
            <select className={inputCls} value={clForm.iconId ?? 'other'} onChange={e => setClForm(p => ({ ...p, iconId: e.target.value }))}>
              <option value="ai">ai</option><option value="webdev">webdev</option><option value="design">design</option><option value="humanitarian">humanitarian</option><option value="foundational">foundational</option><option value="other">other</option>
            </select>
          </div>
          <div><label className={labelCls}>Badge (optional)</label><input className={inputCls} value={clForm.badge ?? ''} onChange={e => setClForm(p => ({ ...p, badge: e.target.value }))} placeholder="8.5 ECTS · 6 Anthropic Courses" /></div>
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setClModal({ open: false, mode: 'create' })} className={btnSecondary}>Cancel</button>
            <button onClick={saveCluster} disabled={pending} className={btnPrimary}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save</button>
          </div>
        </div>
      </Modal>

      {/* ── CERT MODAL ── */}
      <Modal open={certModal.open} onClose={() => setCertModal({ open: false, mode: 'create' })} title={certJsonMode ? 'Paste Cert JSON' : certModal.mode === 'edit' ? 'Edit Certificate' : 'Add Certificate'}>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setCertJsonMode(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!certJsonMode ? 'bg-[#3DF49A]/10 text-[#3DF49A]' : 'text-[#5C615E] hover:text-[#F3F6F4]'}`}>Form</button>
          <button onClick={() => setCertJsonMode(true)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${certJsonMode ? 'bg-[#3DF49A]/10 text-[#3DF49A]' : 'text-[#5C615E] hover:text-[#F3F6F4]'}`}>Paste JSON</button>
        </div>
        {certJsonMode ? (
          <>
            <JsonTab value={certJson} onChange={setCertJson} placeholder='[{"clusterId":"<uuid>","name":"...","issuer":"Anthropic","date":"Jul 2026","credentialId":"abc123"}]' />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setCertModal({ open: false, mode: 'create' })} className={btnSecondary}>Cancel</button>
              <button onClick={saveCertJson} disabled={pending} className={btnPrimary}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Import</button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div><label className={labelCls}>Cluster</label>
              <select className={inputCls} value={certForm.clusterId ?? ''} onChange={e => setCertForm(p => ({ ...p, clusterId: e.target.value }))}>
                <option value="">Select cluster...</option>
                {clusters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Certificate Name</label><input className={inputCls} value={certForm.name ?? ''} onChange={e => setCertForm(p => ({ ...p, name: e.target.value }))} placeholder="Introduction to Model Context Protocol" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Issuer</label><input className={inputCls} value={certForm.issuer ?? ''} onChange={e => setCertForm(p => ({ ...p, issuer: e.target.value }))} placeholder="Anthropic" /></div>
              <div><label className={labelCls}>Date</label><input className={inputCls} value={certForm.date ?? ''} onChange={e => setCertForm(p => ({ ...p, date: e.target.value }))} placeholder="Jul 2026" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>ECTS (optional)</label><input type="number" step="0.5" className={inputCls} value={certForm.ects ?? ''} onChange={e => setCertForm(p => ({ ...p, ects: e.target.value ? parseFloat(e.target.value) : undefined }))} /></div>
              <div><label className={labelCls}>Credential ID</label><input className={inputCls} value={certForm.credentialId ?? ''} onChange={e => setCertForm(p => ({ ...p, credentialId: e.target.value }))} placeholder="s9kjg6ztedp8" /></div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#8A938E] cursor-pointer"><input type="checkbox" className="accent-[#3DF49A]" checked={!!certForm.isFoundational} onChange={e => setCertForm(p => ({ ...p, isFoundational: e.target.checked }))} /> Mark as foundational</label>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setCertModal({ open: false, mode: 'create' })} className={btnSecondary}>Cancel</button>
              <button onClick={saveCert} disabled={pending} className={btnPrimary}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── COMMUNITY MODAL ── */}
      <Modal open={comModal.open} onClose={() => setComModal({ open: false, mode: 'create' })} title={comJsonMode ? 'Paste Community JSON' : comModal.mode === 'edit' ? 'Edit Role' : 'Add Community Role'}>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setComJsonMode(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!comJsonMode ? 'bg-[#3DF49A]/10 text-[#3DF49A]' : 'text-[#5C615E] hover:text-[#F3F6F4]'}`}>Form</button>
          <button onClick={() => setComJsonMode(true)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${comJsonMode ? 'bg-[#3DF49A]/10 text-[#3DF49A]' : 'text-[#5C615E] hover:text-[#F3F6F4]'}`}>Paste JSON</button>
        </div>
        {comJsonMode ? (
          <>
            <JsonTab value={comJson} onChange={setComJson} placeholder='[{"title":"...","org":"...","period":"...","category":"...","ongoing":false,"details":[]}]' />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setComModal({ open: false, mode: 'create' })} className={btnSecondary}>Cancel</button>
              <button onClick={saveComJson} disabled={pending} className={btnPrimary}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Import</button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div><label className={labelCls}>Title</label><input className={inputCls} value={comForm.title ?? ''} onChange={e => setComForm(p => ({ ...p, title: e.target.value }))} placeholder="Member" /></div>
            <div><label className={labelCls}>Organisation</label><input className={inputCls} value={comForm.org ?? ''} onChange={e => setComForm(p => ({ ...p, org: e.target.value }))} placeholder="BGCTUB Debating Club" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Period</label><input className={inputCls} value={comForm.period ?? ''} onChange={e => setComForm(p => ({ ...p, period: e.target.value }))} placeholder="Jan 2025 – Present" /></div>
              <div><label className={labelCls}>Category</label><input className={inputCls} value={comForm.category ?? ''} onChange={e => setComForm(p => ({ ...p, category: e.target.value }))} placeholder="Academic" /></div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#8A938E] cursor-pointer"><input type="checkbox" className="accent-[#3DF49A]" checked={!!comForm.ongoing} onChange={e => setComForm(p => ({ ...p, ongoing: e.target.checked }))} /> Ongoing</label>
            <div><label className={labelCls}>Details (one per line)</label><textarea rows={4} className={inputCls} value={comDetailsInput} onChange={e => setComDetailsInput(e.target.value)} placeholder="Participated in inter-university debates&#10;Represented the club at national events" /></div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setComModal({ open: false, mode: 'create' })} className={btnSecondary}>Cancel</button>
              <button onClick={saveCom} disabled={pending} className={btnPrimary}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── CONTRIBUTION MODAL ── */}
      <Modal open={conModal.open} onClose={() => setConModal({ open: false, mode: 'create' })} title={conJsonMode ? 'Paste Contribution JSON' : conModal.mode === 'edit' ? 'Edit Contribution' : 'Add Contribution'}>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setConJsonMode(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!conJsonMode ? 'bg-[#3DF49A]/10 text-[#3DF49A]' : 'text-[#5C615E] hover:text-[#F3F6F4]'}`}>Form</button>
          <button onClick={() => setConJsonMode(true)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${conJsonMode ? 'bg-[#3DF49A]/10 text-[#3DF49A]' : 'text-[#5C615E] hover:text-[#F3F6F4]'}`}>Paste JSON</button>
        </div>
        {conJsonMode ? (
          <>
            <JsonTab value={conJson} onChange={setConJson} placeholder='[{"title":"...","releases":"Lubuntu 21.10","desc":"...","link":"https://...","linkLabel":"View release"}]' />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setConModal({ open: false, mode: 'create' })} className={btnSecondary}>Cancel</button>
              <button onClick={saveConJson} disabled={pending} className={btnPrimary}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Import</button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div><label className={labelCls}>Title</label><input className={inputCls} value={conForm.title ?? ''} onChange={e => setConForm(p => ({ ...p, title: e.target.value }))} placeholder="Lubuntu Default Wallpaper & Greeter Art" /></div>
            <div><label className={labelCls}>Releases</label><input className={inputCls} value={conForm.releases ?? ''} onChange={e => setConForm(p => ({ ...p, releases: e.target.value }))} placeholder="Lubuntu 21.10 + 22.04 LTS" /></div>
            <div><label className={labelCls}>Description</label><textarea rows={3} className={inputCls} value={conForm.desc ?? ''} onChange={e => setConForm(p => ({ ...p, desc: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Link</label><input className={inputCls} value={conForm.link ?? ''} onChange={e => setConForm(p => ({ ...p, link: e.target.value }))} placeholder="https://..." /></div>
              <div><label className={labelCls}>Link Label</label><input className={inputCls} value={conForm.linkLabel ?? ''} onChange={e => setConForm(p => ({ ...p, linkLabel: e.target.value }))} placeholder="View release" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setConModal({ open: false, mode: 'create' })} className={btnSecondary}>Cancel</button>
              <button onClick={saveCon} disabled={pending} className={btnPrimary}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── DELETE CONFIRM ── */}
      <Modal open={deleteModal.open} onClose={() => setDeleteModal(p => ({ ...p, open: false }))} title="Confirm Delete">
        <p className="text-sm text-[#8A938E] mb-6">Are you sure you want to delete {deleteModal.label}? This cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleteModal(p => ({ ...p, open: false }))} className={btnSecondary}>Cancel</button>
          <button onClick={() => { deleteModal.action(); setDeleteModal(p => ({ ...p, open: false })) }} disabled={pending} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-semibold hover:bg-red-500/20 transition-colors">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}
