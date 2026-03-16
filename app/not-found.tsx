export const runtime = 'edge'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p
          className="text-[#1f1f1f] text-[clamp(8rem,25vw,20rem)] font-bold leading-none select-none"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          404
        </p>
        <div className="-mt-8 relative z-10">
          <h1
            className="text-3xl font-bold text-[#f0ede6] mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Page not found
          </h1>
          <p
            className="text-[#8a8a8a] text-base mb-8 max-w-sm"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            Whatever you were looking for doesn&apos;t exist here. Let&apos;s get you back.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00e676] text-black text-sm font-semibold rounded-full
                       hover:bg-[#00b85a] transition-all duration-200"
            style={{ fontFamily: "'Onest', sans-serif" }}
          >
            ← Back home
          </Link>
        </div>
      </main>
    </>
  )
}
