import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import {
  getCredentialTimeline,
  getCredentialClusters,
  getCredentialCerts,
  getCredentialCommunity,
  getCredentialContributions,
} from '@/lib/db/queries'
import CredentialsManager from './CredentialsManager'

export default async function AdminCredentialsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/admin/login')

  const [timeline, clusters, certs, community, contributions] = await Promise.all([
    getCredentialTimeline(),
    getCredentialClusters(),
    getCredentialCerts(),
    getCredentialCommunity(),
    getCredentialContributions(),
  ])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-[#F3F6F4]"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
          Credentials
        </h1>
        <p className="text-sm text-[#5C615E] mt-1" style={{ fontFamily: 'var(--font-jakarta)' }}>
          Manage timeline, certifications, community roles, and contributions.
        </p>
      </div>
      <CredentialsManager
        initialTimeline={timeline}
        initialClusters={clusters}
        initialCerts={certs}
        initialCommunity={community}
        initialContributions={contributions}
      />
    </div>
  )
}
