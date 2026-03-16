'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setState('loading')

    const { error: dbError } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    })

    if (dbError) {
      setError('Something went wrong. Please email me directly.')
      setState('error')
      return
    }

    setState('success')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-start justify-center h-full py-12">
        <div className="w-12 h-12 rounded-full bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center mb-6">
          <span className="text-[#00e676] text-xl">✓</span>
        </div>
        <h3
          className="text-2xl font-bold text-[#f0ede6] mb-3"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Message sent.
        </h3>
        <p
          className="text-[#8a8a8a] text-sm leading-relaxed mb-6"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          I&apos;ll get back to you within 24 hours. Looking forward to it.
        </p>
        <button
          onClick={() => setState('idle')}
          className="text-[#00e676] text-sm hover:underline"
          style={{ fontFamily: "'Onest', sans-serif" }}
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
            className="block text-xs text-[#8a8a8a] mb-2 tracking-widest uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
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
            className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-[#f0ede6]
                       placeholder:text-[#2a2a2a] focus:outline-none focus:border-[#00e676] transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          />
        </div>
        <div>
          <label
            className="block text-xs text-[#8a8a8a] mb-2 tracking-widest uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
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
            className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-[#f0ede6]
                       placeholder:text-[#2a2a2a] focus:outline-none focus:border-[#00e676] transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          />
        </div>
      </div>

      <div>
        <label
          className="block text-xs text-[#8a8a8a] mb-2 tracking-widest uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Subject
        </label>
        <select
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-[#f0ede6]
                     focus:outline-none focus:border-[#00e676] transition-colors"
          style={{ fontFamily: "'Onest', sans-serif" }}
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
          className="block text-xs text-[#8a8a8a] mb-2 tracking-widest uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
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
          className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-[#f0ede6]
                     placeholder:text-[#2a2a2a] focus:outline-none focus:border-[#00e676] transition-colors resize-none"
          style={{ fontFamily: "'Onest', sans-serif" }}
        />
      </div>

      {state === 'error' && (
        <p
          className="text-red-400 text-sm"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full py-3.5 bg-[#00e676] text-black font-semibold text-sm rounded-lg
                   hover:bg-[#00b85a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   hover:scale-[1.01] active:scale-[0.99]"
        style={{ fontFamily: "'Onest', sans-serif" }}
      >
        {state === 'loading' ? 'Sending...' : 'Send message →'}
      </button>
    </form>
  )
}
