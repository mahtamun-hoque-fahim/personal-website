'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { submitContactMessage } from '@/app/contact/actions'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setState('loading')

    // Best-effort country lookup; non-blocking on failure.
    let country: string | null = null
    try {
      const geo = await fetch('https://ipapi.co/json/', { cache: 'no-store' })
      if (geo.ok) {
        const geoData = (await geo.json()) as { country_name?: string }
        country = geoData.country_name ?? null
      }
    } catch {
      // silently ignore — country is optional
    }

    const result = await submitContactMessage({ ...form, country })

    if (!result.ok) {
      setError(result.error)
      setState('error')
      return
    }

    setState('success')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-start justify-center h-full py-12 blur-load">
        <div
          className="w-12 h-12 rounded-full bg-[#3DF49A]/10 border border-[#3DF49A]/30 flex items-center justify-center mb-6 pop-in"
          aria-hidden="true"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3DF49A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline className="check-draw" pathLength="1" points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3
          className="text-2xl font-bold text-[#F3F6F4] mb-3"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
          Message sent.
        </h3>
        <p
          className="text-[#8A938E] text-sm leading-relaxed mb-6"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          I&apos;ll get back to you within 24 hours. Looking forward to it.
        </p>
        <button
          onClick={() => setState('idle')}
          className="text-[#3DF49A] text-sm hover:underline"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          Send another →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-xs text-[#8A938E] mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full bg-[#222222] border border-[#333333] rounded-lg px-4 py-3 text-sm text-[#F3F6F4]
                       placeholder:text-[#5C615E] focus:outline-none focus:border-[#3DF49A] focus:shadow-[0_0_0_3px_rgba(61,244,154,0.12)] transition-[border-color,box-shadow] duration-200"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </div>
        <div>
          <label
            className="block text-xs text-[#8A938E] mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full bg-[#222222] border border-[#333333] rounded-lg px-4 py-3 text-sm text-[#F3F6F4]
                       placeholder:text-[#5C615E] focus:outline-none focus:border-[#3DF49A] focus:shadow-[0_0_0_3px_rgba(61,244,154,0.12)] transition-[border-color,box-shadow] duration-200"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          />
        </div>
      </div>

      <div>
        <label
          className="block text-xs text-[#8A938E] mb-2 tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          Subject
        </label>
        <select
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="w-full bg-[#222222] border border-[#333333] rounded-lg px-4 py-3 text-sm text-[#F3F6F4]
                     focus:outline-none focus:border-[#3DF49A] focus:shadow-[0_0_0_3px_rgba(61,244,154,0.12)] transition-[border-color,box-shadow] duration-200"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          <option value="">Select a topic</option>
          <option value="Freelance project">Freelance project</option>
          <option value="Full-time opportunity">Full-time opportunity</option>
          <option value="Collaboration">Collaboration</option>
          <option value="Just saying hi">Just saying hi</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label
          className="block text-xs text-[#8A938E] mb-2 tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          Message
        </label>
        <textarea
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about what you're building..."
          className="w-full bg-[#222222] border border-[#333333] rounded-lg px-4 py-3 text-sm text-[#F3F6F4]
                     placeholder:text-[#5C615E] focus:outline-none focus:border-[#3DF49A] focus:shadow-[0_0_0_3px_rgba(61,244,154,0.12)] transition-[border-color,box-shadow] duration-200 resize-none"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        />
      </div>

      {state === 'error' && (
        <p
          role="alert"
          className="text-red-400 text-sm blur-load"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        aria-busy={state === 'loading'}
        className="w-full py-3.5 bg-[#3DF49A] text-[#06160E] font-semibold text-sm rounded-lg
                   inline-flex items-center justify-center gap-2
                   hover:bg-[#5BFBA8] transition-[background-color,transform,opacity] duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   active:scale-[0.98]"
        style={{ fontFamily: 'var(--font-jakarta)' }}
      >
        {state === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          'Send message →'
        )}
      </button>
    </form>
  )
}
