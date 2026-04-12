export const runtime = 'edge'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'
import MarkReadButton from './MarkReadButton'

const ADMIN_COOKIE = 'fahim_admin_session'

type Message = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  country: string | null
  created_at: string
}

async function getMessages(): Promise<Message[]> {
  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function AdminMessagesPage() {
  const cookieStore = cookies()
  if (cookieStore.get(ADMIN_COOKIE)?.value !== 'authenticated') redirect('/admin/login')

  const messages = await getMessages()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1
        className="text-4xl font-bold text-[#f0ede6] mb-10"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Messages
        {messages.filter((m) => !m.read).length > 0 && (
          <span className="ml-3 text-lg text-[#00e676]">
            ({messages.filter((m) => !m.read).length} unread)
          </span>
        )}
      </h1>

      {messages.length === 0 ? (
        <div className="border border-[#1f1f1f] rounded-xl p-16 text-center">
          <p className="text-[#8a8a8a] text-sm" style={{ fontFamily: "'Onest', sans-serif" }}>
            No messages yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border rounded-xl p-6 transition-colors ${
                msg.read ? 'border-[#1f1f1f] bg-[#0f0f0f]' : 'border-[#00e676]/20 bg-[#141414]'
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {!msg.read && (
                      <span
                        className="text-xs px-2 py-0.5 bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20 rounded-full"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        New
                      </span>
                    )}
                    <span
                      className="font-semibold text-[#f0ede6]"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {msg.name}
                    </span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-[#8a8a8a] text-sm hover:text-[#00e676] transition-colors"
                      style={{ fontFamily: "'Onest', sans-serif" }}
                    >
                      {msg.email}
                    </a>
                    <div className="ml-auto flex items-center gap-3">
                      {msg.country && (
                        <span
                          className="text-xs px-2 py-0.5 border border-[#1f1f1f] text-[#8a8a8a] rounded"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          📍 {msg.country}
                        </span>
                      )}
                      <div className="text-right">
                        <p
                          className="text-[#2a2a2a] text-xs"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {formatDateTime(msg.created_at).date}
                        </p>
                        <p
                          className="text-[#2a2a2a] text-xs"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {formatDateTime(msg.created_at).time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {msg.subject && (
                    <p
                      className="text-sm text-[#f0ede6] font-medium mb-2"
                      style={{ fontFamily: "'Onest', sans-serif" }}
                    >
                      Re: {msg.subject}
                    </p>
                  )}

                  <p
                    className="text-[#8a8a8a] text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: "'Onest', sans-serif" }}
                  >
                    {msg.message}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {!msg.read && <MarkReadButton id={msg.id} />}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your message')}`}
                    className="text-xs text-[#8a8a8a] hover:text-[#00e676] transition-colors px-3 py-1.5 border border-[#1f1f1f] rounded-lg text-center"
                    style={{ fontFamily: "'Onest', sans-serif" }}
                  >
                    Reply ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
