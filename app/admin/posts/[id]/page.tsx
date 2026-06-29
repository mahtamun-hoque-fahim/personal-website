import { redirect, notFound } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth-utils'
import { getBlogPostById } from '@/lib/db/queries'
import PostEditor from '../PostEditor'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/admin/login')

  const { id } = await params
  const post = await getBlogPostById(id)
  if (!post) notFound()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1
        className="text-4xl font-bold text-[#F3F6F4] mb-10"
        style={{ fontFamily: 'var(--font-clash)' }}
      >
        Edit post
      </h1>
      <PostEditor post={post} />
    </div>
  )
}
