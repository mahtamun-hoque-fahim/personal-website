'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DeletePostButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-[#8a8a8a] hover:text-red-400 transition-colors px-3 py-1.5 border border-[#1f1f1f] rounded-lg hover:border-red-400/30"
      style={{ fontFamily: "'Onest', sans-serif" }}
    >
      Delete
    </button>
  )
}
