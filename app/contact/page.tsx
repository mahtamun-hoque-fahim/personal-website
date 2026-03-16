export const runtime = 'edge'

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Mahtamun Hoque Fahim for design and development projects.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="pb-16 border-b border-[#1f1f1f] mb-16">
            <p
              className="text-[#00e676] text-xs tracking-[0.2em] uppercase mb-6"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Contact
            </p>
            <h1
              className="text-[clamp(2.5rem,7vw,6rem)] font-bold text-[#f0ede6] leading-[0.95] mb-6"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Let&apos;s build
              <br />
              <span className="text-[#00e676]">something.</span>
            </h1>
            <p
              className="text-[#8a8a8a] text-lg max-w-xl leading-relaxed"
              style={{ fontFamily: "'Onest', sans-serif", fontWeight: 300 }}
            >
              I&apos;m open to freelance projects, collaborations, and full-time opportunities.
              Tell me what you&apos;re working on.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pb-24">

            {/* Left — info */}
            <div>
              <div className="space-y-8 mb-12">
                {[
                  {
                    label: 'Email',
                    value: 'mahtamunhoquefahim@gmail.com',
                    href: 'mailto:mahtamunhoquefahim@gmail.com',
                  },
                  {
                    label: 'LinkedIn',
                    value: 'linkedin.com/in/mahtamun-hoque-fahim',
                    href: 'https://linkedin.com/in/mahtamun-hoque-fahim',
                  },
                  {
                    label: 'Portfolio',
                    value: 'mahtamundesigns.vercel.app',
                    href: 'https://mahtamundesigns.vercel.app',
                  },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <p
                      className="text-[#8a8a8a] text-xs tracking-widest uppercase"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {item.label}
                    </p>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-[#f0ede6] text-sm hover:text-[#00e676] transition-colors"
                      style={{ fontFamily: "'Onest', sans-serif" }}
                    >
                      {item.value} ↗
                    </a>
                  </div>
                ))}
              </div>

              <div className="border border-[#1f1f1f] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
                  <span
                    className="text-[#00e676] text-xs tracking-widest uppercase"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Currently available
                  </span>
                </div>
                <p
                  className="text-[#8a8a8a] text-sm leading-relaxed"
                  style={{ fontFamily: "'Onest', sans-serif" }}
                >
                  Open to freelance design & development projects, long-term collaborations,
                  and interesting full-time roles. Response time: usually within 24h.
                </p>
              </div>
            </div>

            {/* Right — form */}
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
