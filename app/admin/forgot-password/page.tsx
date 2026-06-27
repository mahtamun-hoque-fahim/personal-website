'use client'

import { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })
      if (error) throw new Error(error.message || 'Failed to send reset email')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-block mb-12">
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-bold text-[#f0ede6]"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                fahim
              </span>
              <span className="text-2xl font-bold text-[#00e676]">.</span>
            </div>
          </Link>

          <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 text-center">
            <div
              className="w-12 h-12 rounded-full bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center mx-auto mb-6"
              aria-hidden="true"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00e676"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1
              className="text-2xl font-bold text-[#f0ede6] mb-2"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Check your email
            </h1>
            <p
              className="text-[#8a8a8a] text-sm mb-8"
              style={{ fontFamily: 'var(--font-onest)' }}
            >
              We sent a password reset link to <strong>{email}</strong>. Click the link in
              your email to create a new password.
            </p>

            <p
              className="text-[#8a8a8a] text-xs mb-8"
              style={{ fontFamily: 'var(--font-onest)' }}
            >
              The link expires in 24 hours. Check spam if you don&apos;t see it.
            </p>

            <Link
              href="/admin/login"
              className="inline-block px-6 py-3 bg-[#00e676] text-black rounded-lg font-medium hover:bg-[#00b85a] transition-colors"
              style={{ fontFamily: 'var(--font-onest)' }}
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-12">
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-bold text-[#f0ede6]"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              fahim
            </span>
            <span className="text-2xl font-bold text-[#00e676]">.</span>
          </div>
        </Link>

        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8">
          <h1
            className="text-2xl font-bold text-[#f0ede6] mb-2"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Reset password
          </h1>
          <p
            className="text-[#8a8a8a] text-sm mb-8"
            style={{ fontFamily: 'var(--font-onest)' }}
          >
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p
                className="text-red-500 text-sm"
                style={{ fontFamily: 'var(--font-onest)' }}
              >
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-[#f0ede6] text-sm mb-2 font-medium"
                style={{ fontFamily: 'var(--font-onest)' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg text-[#f0ede6] placeholder-[#8a8a8a] focus:outline-none focus:border-[#00e676] transition-colors"
                style={{ fontFamily: 'var(--font-onest)' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-[#00e676] text-black rounded-lg font-medium hover:bg-[#00b85a] disabled:opacity-50 transition-colors"
              style={{ fontFamily: 'var(--font-onest)' }}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <p
            className="text-[#8a8a8a] text-sm text-center mt-6"
            style={{ fontFamily: 'var(--font-onest)' }}
          >
            Remember your password?{' '}
            <Link
              href="/admin/login"
              className="text-[#00e676] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
