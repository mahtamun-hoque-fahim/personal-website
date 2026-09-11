import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth-utils'
import { getSiteSettings } from '@/lib/db/queries'
import SettingsForm from './SettingsForm'

export const metadata = { title: 'Site settings' }

export default async function AdminSettingsPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/admin/login')

  const settings = await getSiteSettings()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p
          className="text-xs uppercase tracking-widest text-[#8A938E] mb-2"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          Admin · Settings
        </p>
        <h1
          className="text-4xl font-bold text-[#F3F6F4]"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
          Site metadata<span className="text-[#3DF49A]">.</span>
        </h1>
        <p
          className="text-sm text-[#8A938E] mt-2"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          Drives the homepage title, description, Open Graph tags, and the
          Person JSON-LD block. Cached for an hour on the public site; saving
          here refreshes it immediately.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  )
}
