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
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#070807]">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-12" aria-label="Mahtamun — home">
          <Logo height={26} />
        </Link>

        <div className="bg-[#0F0F0F] border border-[#1F2421] rounded-2xl p-8">
          <h1
            className="text-2xl font-bold text-[#F3F6F4] mb-2"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Welcome back
          </h1>
          <p
            className="text-[#8A938E] text-sm mb-8"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Sign in to manage posts, projects, and messages.
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

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label
                className="block text-[#F3F6F4] text-sm mb-2 font-medium"
                style={{ fontFamily: 'var(--font-jakarta)' }}
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
                className="w-full px-4 py-3 bg-[#070807] border border-[#1F2421] rounded-lg text-[#F3F6F4] placeholder-[#8A938E] focus:outline-none focus:border-[#3DF49A] transition-colors"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              />
              <Link
                href="/admin/forgot-password"
                className="inline-block mt-2 text-xs text-[#8A938E] hover:text-[#3DF49A] transition-colors"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-[#3DF49A] text-[#06160E] rounded-lg font-medium hover:bg-[#5BFBA8] disabled:opacity-50 transition-colors"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              {loading ? 'Please wait...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
