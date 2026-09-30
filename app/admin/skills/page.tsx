import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getSkills } from '@/lib/db/queries'
import SkillsManager from './SkillsManager'

export default async function AdminSkillsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/admin/login')

  const skills = await getSkills()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-[#F3F6F4]"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
          Skills
        </h1>
        <p className="text-sm text-[#5C615E] mt-1" style={{ fontFamily: 'var(--font-jakarta)' }}>
          Manage the &quot;What I do&quot; cards on the home page: title, description, thumbnail, and order.
        </p>
      </div>
      <SkillsManager initialSkills={skills} />
    </div>
  )
}
