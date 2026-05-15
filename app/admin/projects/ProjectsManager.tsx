'use client'

import { useState } from 'react'
import { updateProjectFeatured, reorderProjects } from '@/app/admin/actions'

type Project = {
  id: string
  name: string
  tagline: string
  type: string
  featured: boolean
  featured_order: number | null
  live_url: string | null
}

export default function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const featuredProjects = projects.filter(p => p.featured).sort((a, b) => (a.featured_order || 999) - (b.featured_order || 999))
  const unfeaturedProjects = projects.filter(p => !p.featured)

  const toggleFeatured = async (projectId: string, currentFeatured: boolean) => {
    setLoading(true)
    const newFeatured = !currentFeatured

    // Update local state
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, featured: newFeatured, featured_order: newFeatured ? Math.max(...featuredProjects.map(fp => fp.featured_order || 0)) + 1 : null }
        : p
    ))

    try {
      await updateProjectFeatured(projectId, newFeatured)
      setMessage(`Project ${newFeatured ? 'featured' : 'unfeatured'} successfully`)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error updating project')
      setProjects(initialProjects)
    } finally {
      setLoading(false)
    }
  }

  const reorder = async (projectId: string, direction: 'up' | 'down') => {
    const currentIndex = featuredProjects.findIndex(p => p.id === projectId)
    if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === featuredProjects.length - 1)) {
      return
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const newFeatured = [...featuredProjects]
    [newFeatured[currentIndex], newFeatured[newIndex]] = [newFeatured[newIndex], newFeatured[currentIndex]]

    const newOrder = newFeatured.map((p, i) => ({ id: p.id, order: i + 1 }))
    setProjects(prev => prev.map(p => ({
      ...p,
      featured_order: newOrder.find(no => no.id === p.id)?.order || p.featured_order
    })))

    setLoading(true)
    try {
      await reorderProjects(newOrder)
      setMessage('Order updated')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error updating order')
      setProjects(initialProjects)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {message && (
        <div className="mb-6 p-4 bg-[#00e676]/10 border border-[#00e676]/30 rounded-lg">
          <p className="text-[#00e676] text-sm" style={{ fontFamily: "'Onest', sans-serif" }}>
            {message}
          </p>
        </div>
      )}

      {/* Featured Projects */}
      <div className="mb-12">
        <h2
          className="text-2xl font-bold text-[#f0ede6] mb-6"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Featured Projects ({featuredProjects.length})
        </h2>
        <p
          className="text-[#8a8a8a] text-sm mb-6"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          These projects appear on your homepage. Drag to reorder.
        </p>

        <div className="space-y-3">
          {featuredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4 flex items-center justify-between hover:border-[#00e676]/40 transition-colors"
            >
              <div className="flex-1">
                <p
                  className="text-[#f0ede6] font-medium"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {project.name}
                </p>
                <p
                  className="text-[#8a8a8a] text-sm"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  {project.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => reorder(project.id, 'up')}
                  disabled={loading || idx === 0}
                  className="px-3 py-2 text-xs bg-[#1f1f1f] text-[#8a8a8a] rounded hover:bg-[#2a2a2a] disabled:opacity-50 transition-colors"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  ↑
                </button>
                <button
                  onClick={() => reorder(project.id, 'down')}
                  disabled={loading || idx === featuredProjects.length - 1}
                  className="px-3 py-2 text-xs bg-[#1f1f1f] text-[#8a8a8a] rounded hover:bg-[#2a2a2a] disabled:opacity-50 transition-colors"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  ↓
                </button>
                <button
                  onClick={() => toggleFeatured(project.id, true)}
                  disabled={loading}
                  className="px-4 py-2 text-xs bg-[#00e676] text-black rounded font-medium hover:bg-[#00b85a] disabled:opacity-50 transition-colors"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  Unfeature
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Projects */}
      <div>
        <h2
          className="text-2xl font-bold text-[#f0ede6] mb-6"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          All Projects ({projects.length})
        </h2>
        <p
          className="text-[#8a8a8a] text-sm mb-6"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          Feature projects to show them on your homepage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {unfeaturedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4 hover:border-[#00e676]/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p
                    className="text-[#f0ede6] font-medium"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {project.name}
                  </p>
                  <p
                    className="text-[#8a8a8a] text-sm mt-1"
                    style={{ fontFamily: "'Onest', sans-serif" }}
                  >
                    {project.tagline}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <span
                      className="text-xs px-2 py-1 bg-[#1f1f1f] text-[#8a8a8a] rounded"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {project.type}
                    </span>
                    {project.live_url && (
                      <span
                        className="text-xs px-2 py-1 bg-[#00e676]/10 text-[#00e676] rounded"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        Live
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleFeatured(project.id, false)}
                  disabled={loading}
                  className="ml-2 px-4 py-2 text-xs bg-[#1f1f1f] text-[#8a8a8a] rounded hover:bg-[#00e676] hover:text-black disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  Feature
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
