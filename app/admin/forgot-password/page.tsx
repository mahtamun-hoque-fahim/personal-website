'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error?.message || 'Failed to send reset email')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
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
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                fahim
              </span>
              <span className="text-2xl font-bold text-[#00e676]">.</span>
            </div>
          </Link>

          <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 text-center">
            <div className="mb-6 text-4xl">✓</div>
            <h1
              className="text-2xl font-bold text-[#f0ede6] mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Check Your Email
            </h1>
            <p
              className="text-[#8a8a8a] text-sm mb-8"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              We've sent a password reset link to <strong>{email}</strong>. 
              Click the link in your email to create a new password.
            </p>

            <p
              className="text-[#8a8a8a] text-xs mb-8"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Link expires in 24 hours. Check spam folder if you don't see it.
            </p>

            <Link
              href="/admin/login"
              className="inline-block px-6 py-3 bg-[#00e676] text-black rounded-lg font-medium hover:bg-[#00b85a] transition-colors"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Back to Sign In
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
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              fahim
            </span>
            <span className="text-2xl font-bold text-[#00e676]">.</span>
          </div>
        </Link>

        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8">
          <h1
            className="text-2xl font-bold text-[#f0ede6] mb-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Reset Password
          </h1>
          <p
            className="text-[#8a8a8a] text-sm mb-8"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Enter your email and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-500 text-sm" style={{ fontFamily: "'Onest', sans-serif" }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-[#f0ede6] text-sm mb-2 font-medium"
                style={{ fontFamily: "'Onest', sans-serif" }}
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
                style={{ fontFamily: "'Onest', sans-serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-[#00e676] text-black rounded-lg font-medium hover:bg-[#00b85a] disabled:opacity-50 transition-colors"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p
            className="text-[#8a8a8a] text-sm text-center mt-6"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Remember your password?{' '}
            <Link href="/admin/login" className="text-[#00e676] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
