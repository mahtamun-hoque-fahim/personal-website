export const runtime = 'edge'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getSupabase } from '@/lib/supabase'
import ProjectsManager from './ProjectsManager'

const ADMIN_COOKIE = 'fahim_admin_session'

export const metadata = {
  title: 'Manage Projects',
}

export default async function ProjectsAdminPage() {
  const cookieStore = cookies()
  const session = cookieStore.get(ADMIN_COOKIE)
  if (session?.value !== 'authenticated') redirect('/admin/login')

  const supabase = getSupabase()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('featured_order', { ascending: true, nullsLast: true })

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1
          className="text-4xl font-bold text-[#f0ede6] mb-2"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Manage Projects
        </h1>
        <p
          className="text-[#8a8a8a] text-sm"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          Control which projects appear on your homepage and projects page.
        </p>
      </div>

      <ProjectsManager initialProjects={projects || []} />
    </div>
  )
}
