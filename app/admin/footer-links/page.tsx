import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getFooterLinks } from '@/lib/db/queries'
import FooterLinksManager from './FooterLinksManager'

export default async function AdminFooterLinksPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/admin/login')

  const links = await getFooterLinks()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-[#F3F6F4]"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
          Footer Links
        </h1>
        <p className="text-sm text-[#5C615E] mt-1" style={{ fontFamily: 'var(--font-jakarta)' }}>
          Manage the nav and social links shown in the site footer. Links with the same group name are listed together as one column.
        </p>
      </div>
      <FooterLinksManager initialLinks={links} />
    </div>
  )
}
