'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
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
          <Link href="/" className="inline-block mb-12">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#f0ede6]" style={{ fontFamily: "'Syne', sans-serif" }}>
                fahim
              </span>
              <span className="text-2xl font-bold text-[#00e676]">.</span>
            </div>
          </Link>
          <p className="text-[#8a8a8a]" style={{ fontFamily: "'Onest', sans-serif" }}>
            Invalid or expired reset link.{' '}
            <Link href="/admin/forgot-password" className="text-[#00e676] hover:underline">
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
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error?.message || 'Failed to reset password')
      }

      setSuccess(true)
      setTimeout(() => router.push('/admin/login'), 2000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 text-4xl">✓</div>
          <h1 className="text-2xl font-bold text-[#f0ede6] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            Password Reset
          </h1>
          <p className="text-[#8a8a8a]" style={{ fontFamily: "'Onest', sans-serif" }}>
            Your password has been reset successfully. Redirecting to sign in...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-12">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#f0ede6]" style={{ fontFamily: "'Syne', sans-serif" }}>
              fahim
            </span>
            <span className="text-2xl font-bold text-[#00e676]">.</span>
          </div>
        </Link>

        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-[#f0ede6] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            Create New Password
          </h1>
          <p className="text-[#8a8a8a] text-sm mb-8" style={{ fontFamily: "'Onest', sans-serif" }}>
            Enter a new password for your account.
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
              <label className="block text-[#f0ede6] text-sm mb-2 font-medium" style={{ fontFamily: "'Onest', sans-serif" }}>
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg text-[#f0ede6] placeholder-[#8a8a8a] focus:outline-none focus:border-[#00e676] transition-colors"
                style={{ fontFamily: "'Onest', sans-serif" }}
              />
            </div>

            <div>
              <label className="block text-[#f0ede6] text-sm mb-2 font-medium" style={{ fontFamily: "'Onest', sans-serif" }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
