import Link from 'next/link'
import Logo from '@/components/Logo'
import { getFooterLinks } from '@/lib/db/queries'

export default async function Footer() {
  const year = new Date().getFullYear()
  const links = await getFooterLinks()

  // Bucket by groupLabel — each group renders as its own column. Order
  // follows first appearance in sortOrder, same rule the admin manager uses.
  const groups = new Map<string, typeof links>()
  for (const l of links) {
    if (!groups.has(l.groupLabel)) groups.set(l.groupLabel, [])
    groups.get(l.groupLabel)!.push(l)
  }

  return (
    <footer className="border-t border-[#1F2421] mt-24 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Brand + link columns: side by side on desktop (brand fixed width,
            columns share the rest), stacked full-width on phones. */}
        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-16">
          <div className="md:w-64 shrink-0">
            <Logo height={32} />
            <p className="text-[#8A938E] text-sm mt-3" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Designing the gap between beauty and function.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {Array.from(groups.entries()).map(([groupLabel, items]) => (
              <div key={groupLabel}>
                <h4
                  className="text-xs font-bold uppercase tracking-wider text-[#5C615E] mb-3"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  {groupLabel}
                </h4>
                <ul className="space-y-2.5">
                  {items.map((link) =>
                    link.external ? (
                      <li key={link.id}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#8A938E] hover:text-[#3DF49A] transition-colors"
                          style={{ fontFamily: 'var(--font-jakarta)' }}
                        >
                          {link.label} ↗
                        </a>
                      </li>
                    ) : (
                      <li key={link.id}>
                        <Link
                          href={link.url}
                          className="text-sm text-[#8A938E] hover:text-[#F3F6F4] transition-colors"
                          style={{ fontFamily: 'var(--font-jakarta)' }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#1F2421] mt-10 pt-6 text-center">
          <p className="text-[#8A938E] text-xs" style={{ fontFamily: 'var(--font-jakarta)' }}>
            © {year} Mahtamun Hoque Fahim
          </p>
        </div>
      </div>
    </footer>
  )
}
