'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = mode === 'signup' ? '/api/auth/sign-up' : '/api/auth/sign-in/email'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error?.message || 'Authentication failed')
      }

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      // Redirect to Better Auth Google signin
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/signin/google`
    } catch (err) {
      console.error('Google signin error:', err)
      setError('Failed to sign in with Google')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md">
        {/* Logo */}
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

        {/* Form */}
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8">
          <h1
            className="text-2xl font-bold text-[#f0ede6] mb-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Admin Access
          </h1>
          <p
            className="text-[#8a8a8a] text-sm mb-8"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Sign in to manage your portfolio
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-500 text-sm" style={{ fontFamily: "'Onest', sans-serif" }}>
                {error}
              </p>
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-6 px-4 py-3 bg-[#f0ede6] text-black rounded-lg font-medium hover:bg-[#e0dcd6] disabled:opacity-50 transition-colors"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1f1f1f]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="px-2 bg-[#141414] text-[#8a8a8a]"
                style={{ fontFamily: "'Onest', sans-serif" }}
              >
                or
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
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

            <div>
              <label
                className="block text-[#f0ede6] text-sm mb-2 font-medium"
                style={{ fontFamily: "'Onest', sans-serif" }}
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
                style={{ fontFamily: "'Onest', sans-serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-[#00e676] text-black rounded-lg font-medium hover:bg-[#00b85a] disabled:opacity-50 transition-colors"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              {loading ? 'Signing in...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle mode */}
          <p
            className="text-[#8a8a8a] text-sm text-center mt-6"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
              }}
              className="text-[#00e676] hover:underline font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p
          className="text-[#8a8a8a] text-xs text-center mt-8"
          style={{ fontFamily: "'Onest', sans-serif" }}
        >
          Only mahtamunhoquefahim@gmail.com can sign in with Google
        </p>
      </div>
    </div>
  )
}
