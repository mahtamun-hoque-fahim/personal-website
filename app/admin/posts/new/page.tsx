

import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth-utils'
import PostEditor from '../PostEditor'

export default async function NewPostPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/admin/login')

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-[#F3F6F4] mb-10" style={{ fontFamily: 'var(--font-jakarta)' }}>New Post</h1>
      <PostEditor />
    </div>
  )
}
