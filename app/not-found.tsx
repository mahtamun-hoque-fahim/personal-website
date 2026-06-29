

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p
          className="text-[#1F2421] text-[clamp(8rem,25vw,20rem)] font-bold leading-none select-none"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
          404
        </p>
        <div className="-mt-8 relative z-10">
          <h1
            className="text-3xl font-bold text-[#F3F6F4] mb-4"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Page not found
          </h1>
          <p
            className="text-[#8A938E] text-base mb-8 max-w-sm"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Whatever you were looking for doesn&apos;t exist here. Let&apos;s get you back.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3DF49A] text-[#06160E] text-sm font-semibold rounded-full
                       hover:bg-[#5BFBA8] transition-all duration-200"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            ← Back home
          </Link>
        </div>
      </main>
    </>
  )
}
