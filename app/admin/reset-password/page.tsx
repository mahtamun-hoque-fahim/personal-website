'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { authClient } from '@/lib/auth-client'

function ResetPasswordInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="inline-block mb-12" aria-label="Mahtamun — home">
            <Logo height={26} className="mx-auto" />
          </Link>
          <p
            className="text-[#8a8a8a]"
            style={{ fontFamily: 'var(--font-onest)' }}
          >
            Invalid or expired reset link.{' '}
            <Link
              href="/admin/forgot-password"
              className="text-[#00e676] hover:underline"
            >
              Request a new one
            </Link>
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      })
      if (error) throw new Error(error.message || 'Failed to reset password')

      setSuccess(true)
      setTimeout(() => router.push('/admin/login'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <div className="w-full max-w-md text-center">
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
            Password reset
          </h1>
          <p className="text-[#8a8a8a]" style={{ fontFamily: 'var(--font-onest)' }}>
            Your password has been reset successfully. Redirecting to sign in...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-12" aria-label="Mahtamun — home">
          <Logo height={26} />
        </Link>

        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8">
          <h1
            className="text-2xl font-bold text-[#f0ede6] mb-2"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Create new password
          </h1>
          <p
            className="text-[#8a8a8a] text-sm mb-8"
            style={{ fontFamily: 'var(--font-onest)' }}
          >
            Enter a new password for your account.
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
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg text-[#f0ede6] placeholder-[#8a8a8a] focus:outline-none focus:border-[#00e676] transition-colors"
                style={{ fontFamily: 'var(--font-onest)' }}
              />
            </div>

            <div>
              <label
                className="block text-[#f0ede6] text-sm mb-2 font-medium"
                style={{ fontFamily: 'var(--font-onest)' }}
              >
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
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
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  )
}
