'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
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
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#070807]">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-block mb-12" aria-label="Mahtamun — home">
            <Logo height={26} />
          </Link>

          <div className="bg-[#0F0F0F] border border-[#1F2421] rounded-2xl p-8 text-center">
            <div
              className="w-12 h-12 rounded-full bg-[#3DF49A]/10 border border-[#3DF49A]/30 flex items-center justify-center mx-auto mb-6"
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1
              className="text-2xl font-bold text-[#F3F6F4] mb-2"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              Check your email
            </h1>
            <p
              className="text-[#8A938E] text-sm mb-8"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              We sent a password reset link to <strong>{email}</strong>. Click the link in
              your email to create a new password.
            </p>

            <p
              className="text-[#8A938E] text-xs mb-8"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              The link expires in 24 hours. Check spam if you don&apos;t see it.
            </p>

            <Link
              href="/admin/login"
              className="inline-block px-6 py-3 bg-[#3DF49A] text-[#06160E] rounded-lg font-medium hover:bg-[#5BFBA8] transition-colors"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#070807]">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-12" aria-label="Mahtamun — home">
          <Logo height={26} />
        </Link>

        <div className="bg-[#0F0F0F] border border-[#1F2421] rounded-2xl p-8">
          <h1
            className="text-2xl font-bold text-[#F3F6F4] mb-2"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Reset password
          </h1>
          <p
            className="text-[#8A938E] text-sm mb-8"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p
                className="text-red-500 text-sm"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-[#F3F6F4] text-sm mb-2 font-medium"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-[#070807] border border-[#1F2421] rounded-lg text-[#F3F6F4] placeholder-[#8A938E] focus:outline-none focus:border-[#3DF49A] transition-colors"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-[#3DF49A] text-[#06160E] rounded-lg font-medium hover:bg-[#5BFBA8] disabled:opacity-50 transition-colors"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <p
            className="text-[#8A938E] text-sm text-center mt-6"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Remember your password?{' '}
            <Link
              href="/admin/login"
              className="text-[#3DF49A] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
