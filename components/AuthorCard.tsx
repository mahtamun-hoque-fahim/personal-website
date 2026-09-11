import Link from 'next/link'
import { Github } from 'lucide-react'

type Props = {
  jobTitle: string
}

export default function AuthorCard({ jobTitle }: Props) {
  return (
    <div className="mt-16 pt-8 border-t border-[#1F2421]">
      <div className="flex items-start gap-4 bg-[#0F0F0F] border border-[#1F2421] rounded-xl p-6">
        <div
          className="w-14 h-14 rounded-full bg-[#1F2421] flex items-center justify-center text-lg font-bold
                     text-[#3DF49A] shrink-0"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
          MH
        </div>

        <div className="min-w-0">
          <p
            className="text-[#F3F6F4] text-base font-bold"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Mahtamun Hoque Fahim
          </p>
          <p
            className="text-[#8A938E] text-sm mt-0.5"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            {jobTitle}
          </p>
          <p
            className="text-[#8A938E] text-sm mt-3 leading-relaxed"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Writing about building and shipping software solo — from
            architecture decisions to the small tools that make it easier.
          </p>

          <div
            className="flex flex-wrap items-center gap-4 mt-4 text-sm"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            <a
              href="https://mahtamundesigns.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8A938E] hover:text-[#3DF49A] transition-colors"
            >
              Portfolio ↗
            </a>
            <Link
              href="/projects"
              className="text-[#8A938E] hover:text-[#3DF49A] transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="text-[#8A938E] hover:text-[#3DF49A] transition-colors"
            >
              More posts
            </Link>
            <a
              href="https://github.com/mahtamun-hoque-fahim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#8A938E] hover:text-[#3DF49A] transition-colors"
            >
              <Github className="h-3.5 w-3.5" strokeWidth={2} />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
