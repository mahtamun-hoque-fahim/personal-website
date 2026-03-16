import { loginAction } from '../actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            fahim<span className="text-[#00e676]">.</span>admin
          </p>
          <p
            className="text-[#8a8a8a] text-sm"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Enter password to continue
          </p>
        </div>

        <form action={loginAction} className="space-y-4">
          <div>
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              autoFocus
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-sm text-[#f0ede6]
                         placeholder:text-[#2a2a2a] focus:outline-none focus:border-[#00e676] transition-colors"
              style={{ fontFamily: "'Onest', sans-serif" }}
            />
          </div>

          {searchParams.error && (
            <p
              className="text-red-400 text-sm text-center"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Wrong password. Try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#00e676] text-black font-semibold text-sm rounded-lg
                       hover:bg-[#00b85a] transition-all duration-200"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Enter →
          </button>
        </form>
      </div>
    </div>
  )
}
