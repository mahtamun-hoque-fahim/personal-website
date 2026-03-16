import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import PostEditor from '../PostEditor'

const ADMIN_COOKIE = 'fahim_admin_session'

export default function NewPostPage() {
  const cookieStore = cookies()
  if (cookieStore.get(ADMIN_COOKIE)?.value !== 'authenticated') redirect('/admin/login')

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1
        className="text-4xl font-bold text-[#f0ede6] mb-10"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        New Post
      </h1>
      <PostEditor />
    </div>
  )
}
