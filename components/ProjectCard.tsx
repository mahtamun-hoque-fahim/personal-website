import type { Project } from '@/lib/db/queries'
import Reveal from '@/components/Reveal'

/**
 * The cell (background, 1px grid lines, hover) is always visible; only the
 * content blurs in, once, when this card scrolls into view. `index` staggers
 * cards that share a row (2 columns at md and up).
 */
export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <div className="bg-[#111111] p-8 group hover:bg-[#222222] transition-colors duration-300 flex flex-col min-h-[280px]">
      <Reveal className="flex flex-1 flex-col justify-between" delay={(index % 2) * 180}>
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3
              className="text-2xl font-bold text-[#F3F6F4]"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              {project.name}
            </h3>
          </div>
        </div>
        <p
          className="text-[#3DF49A] text-sm mb-3 italic"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          {project.tagline}
        </p>
        <p
          className="text-[#8A938E] text-sm leading-relaxed"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          {project.description}
        </p>
        {project.collaborators && project.collaborators.length > 0 && (
          <p
            className="text-[#5C615E] text-xs mt-3"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            with{' '}
            {project.collaborators.map((c, i) => (
              <span key={`${c.name}-${i}`}>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8A938E] hover:text-[#3DF49A] underline-offset-2 hover:underline transition-colors"
                  >
                    {c.name}
                  </a>
                ) : (
                  <span className="text-[#8A938E]">{c.name}</span>
                )}
                {i < (project.collaborators?.length ?? 0) - 1 && ', '}
              </span>
            ))}
          </p>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-[#333333]">
        <div className="flex flex-wrap gap-2 mb-4">
          {(project.tags || []).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 border border-[#333333] text-[#8A938E] rounded"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3DF49A] text-sm hover:underline"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Live ↗
            </a>
          )}
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8A938E] text-sm hover:text-[#F3F6F4] transition-colors"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            GitHub →
          </a>
        </div>
      </div>
      </Reveal>
    </div>
  )
}
