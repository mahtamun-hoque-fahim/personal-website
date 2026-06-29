'use client'

import { useRouter } from 'next/navigation'
import { deletePostAction } from '@/app/admin/actions'

export default function DeletePostButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await deletePostAction(id)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-[#8A938E] hover:text-red-400 transition-colors px-3 py-1.5 border border-[#1F2421] rounded-lg hover:border-red-400/30"
      style={{ fontFamily: 'var(--font-jakarta)' }}
    >
      Delete
    </button>
  )
}
