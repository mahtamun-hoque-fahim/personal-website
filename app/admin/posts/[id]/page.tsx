import { redirect, notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import PostEditor from '../PostEditor'

const ADMIN_COOKIE = 'fahim_admin_session'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  if (cookieStore.get(ADMIN_COOKIE)?.value !== 'authenticated') redirect('/admin/login')

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1
        className="text-4xl font-bold text-[#f0ede6] mb-10"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Edit Post
      </h1>
      <PostEditor post={post} />
    </div>
  )
}
