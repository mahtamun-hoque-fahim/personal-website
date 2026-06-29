import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth-utils'
import { getAllProjects } from '@/lib/db/queries'
import JsonHelpPanel from './JsonHelpPanel'
import ProjectsManager from './ProjectsManager'

export const metadata = { title: 'Manage Projects' }

export default async function ProjectsAdminPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/admin/login')

  const projects = await getAllProjects()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#F3F6F4] mb-2" style={{ fontFamily: 'var(--font-jakarta)' }}>Manage Projects</h1>
        <p className="text-[#8A938E] text-sm" style={{ fontFamily: 'var(--font-jakarta)' }}>Control which projects appear on your homepage and projects page.</p>
      </div>
      <JsonHelpPanel />
      <ProjectsManager initialProjects={projects || []} />
    </div>
  )
}
