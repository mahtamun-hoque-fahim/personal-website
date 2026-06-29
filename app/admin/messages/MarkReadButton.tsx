'use client'

import { useRouter } from 'next/navigation'
import { markMessageReadAction } from '@/app/admin/actions'

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter()

  const handleMarkRead = async () => {
    await markMessageReadAction(id)
    router.refresh()
  }

  return (
    <button
      onClick={handleMarkRead}
      className="text-xs text-[#8A938E] hover:text-[#3DF49A] transition-colors px-3 py-1.5 border border-[#1F2421] rounded-lg hover:border-[#3DF49A]/30"
      style={{ fontFamily: 'var(--font-jakarta)' }}
    >
      Mark read
    </button>
  )
}
