'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { authClient } from '@/lib/auth-client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await authClient.signIn.email({ email, password })
      if (error) throw new Error(error.message || 'Sign in failed')

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
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
            Welcome back
          </h1>
          <p
            className="text-[#8a8a8a] text-sm mb-8"
            style={{ fontFamily: 'var(--font-onest)' }}
          >
            Sign in to manage posts, projects, and messages.
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

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label
                className="block text-[#f0ede6] text-sm mb-2 font-medium"
                style={{ fontFamily: 'var(--font-onest)' }}
              >
                Password
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
              <Link
                href="/admin/forgot-password"
                className="inline-block mt-2 text-xs text-[#8a8a8a] hover:text-[#00e676] transition-colors"
                style={{ fontFamily: 'var(--font-onest)' }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-[#00e676] text-black rounded-lg font-medium hover:bg-[#00b85a] disabled:opacity-50 transition-colors"
              style={{ fontFamily: 'var(--font-onest)' }}
            >
              {loading ? 'Please wait...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
