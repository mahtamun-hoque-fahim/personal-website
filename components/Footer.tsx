import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-[#1f1f1f] mt-24 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            fahim<span className="text-[#00e676]">.</span>
          </span>
          <p className="text-[#8a8a8a] text-sm mt-1" style={{ fontFamily: "'Onest', sans-serif" }}>
            Designing the gap between beauty and function.
          </p>
        </div>

        <div className="flex items-center gap-8 text-sm text-[#8a8a8a]" style={{ fontFamily: "'Onest', sans-serif" }}>
          <Link href="/about" className="hover:text-[#f0ede6] transition-colors">About</Link>
          <Link href="/blog" className="hover:text-[#f0ede6] transition-colors">Blog</Link>
          <Link href="/contact" className="hover:text-[#f0ede6] transition-colors">Contact</Link>
          <a
            href="https://mahtamundesigns.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00e676] transition-colors"
          >
            Portfolio ↗
          </a>
          <a
            href="https://linkedin.com/in/mahtamun-hoque-fahim"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00e676] transition-colors"
          >
            LinkedIn ↗
          </a>
        </div>

        <p className="text-[#8a8a8a] text-xs" style={{ fontFamily: "'Onest', sans-serif" }}>
          © {year} Mahtamun Hoque Fahim
        </p>
      </div>
    </footer>
  )
}
