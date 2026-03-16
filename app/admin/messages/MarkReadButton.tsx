'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter()

  const handleMarkRead = async () => {
    await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id)
    router.refresh()
  }

  return (
    <button
      onClick={handleMarkRead}
      className="text-xs text-[#8a8a8a] hover:text-[#00e676] transition-colors px-3 py-1.5 border border-[#1f1f1f] rounded-lg hover:border-[#00e676]/30"
      style={{ fontFamily: "'Onest', sans-serif" }}
    >
      Mark read
    </button>
  )
}
