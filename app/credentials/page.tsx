import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ExternalLink, Cpu, Code2, Palette, Globe, BookOpen, MapPin, Briefcase, GraduationCap, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Credentials & Journey',
  description:
    '5+ years of professional design, 4+ years of full-stack development, 8.5 ECTS in AI from the University of Helsinki, and official Anthropic certifications. The complete story.',
}

// ─── TIMELINE DATA ───────────────────────────────────────────────────────────

type TimelineType = 'work' | 'education' | 'milestone'

interface TimelineEvent {
  year: string
  period: string
  title: string
  org: string
  desc: string
  tags: string[]
  type: TimelineType
  isCurrent?: boolean
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2026',
    period: 'Jun 2026 – Present',
    title: 'Front-end AI Engineering Intern',
    org: 'FlyRank AI',
    desc: 'Building AI-powered frontend systems for organic growth automation. Remote internship.',
    tags: ['AI Engineering', 'Remote'],
    type: 'work',
    isCurrent: true,
  },
  {
    year: '2025',
    period: 'Jul 2025 – Present',
    title: 'B.Sc (Hons.) Computer Science & Engineering',
    org: 'BGC Trust University Bangladesh',
    desc: 'CGPA 3.40 / 4.0. Media & IT Subcommittee — BGCTUB Debating Club. ACS Subcommittee Member. Captain, 45 Central Football Team. Active debater.',
    tags: ['CSE', 'Active', 'CGPA 3.40'],
    type: 'education',
    isCurrent: true,
  },
  {
    year: '2025',
    period: 'Nov 2025 – Jun 2026',
    title: 'Lead Designer',
    org: 'Interting Digital',
    desc: 'Rebranded a growing digital agency end-to-end — visual identity, design system, and social content direction.',
    tags: ['Brand Direction', 'Lead Role', 'Hybrid'],
    type: 'work',
  },
  {
    year: '2025',
    period: 'Jan 2025 – Feb 2025',
    title: 'Graphic Designer — Contract',
    org: 'Failed Camera Stories',
    desc: '6th Book Exchange Festival Chattogram. Designed social media visuals, posters, banners, and print flyers for a city-wide cultural event.',
    tags: ['Print Media', 'Events', 'Contract'],
    type: 'work',
  },
  {
    year: '2023',
    period: 'Nov 2023 – Nov 2025',
    title: 'Graphic Designer',
    org: 'Interting Digital',
    desc: 'Built the brand identity from zero for a brand-new agency. Led daily visual content and shaped the design language that defined the brand.',
    tags: ['Brand Identity', '2 Years', 'Remote'],
    type: 'work',
  },
  {
    year: '2022',
    period: 'Mar 2022 – Oct 2023',
    title: 'HSC — Science',
    org: 'Patiya Govt. College',
    desc: 'GPA 4 / 5. BNCC Cadet Corporal. Red Crescent Volunteer. 1× Team Championship — Prottoy Debate Fest. 1× Runner-up, Patiya Upazilla Football Fest.',
    tags: ['Science', 'BNCC', 'Debate Champion'],
    type: 'education',
  },
  {
    year: '2022',
    period: 'Sep 2022 – Sep 2023',
    title: 'Graphic Designer',
    org: 'Datos Marketing Tour',
    desc: 'Social media design and marketing content for a growing tour marketing agency. Remote, 1 year.',
    tags: ['Social Media', 'Marketing', 'Remote'],
    type: 'work',
  },
  {
    year: '2021',
    period: 'Feb 2021 – Jul 2022',
    title: 'Graphic Designer',
    org: 'Loraz',
    desc: 'Part-time design work covering brand assets, social content, and digital collateral.',
    tags: ['Design', 'Part-time'],
    type: 'work',
  },
  {
    year: '2021',
    period: 'Feb 2021 – Sep 2021',
    title: 'Graphic Designer',
    org: 'Sulphuric Bench',
    desc: 'Logo design and brand identity work. First remote client-facing design role.',
    tags: ['Logo Design', 'Remote'],
    type: 'work',
  },
  {
    year: '2019',
    period: '2019 – 2021',
    title: 'SSC — Science — GPA 5 / 5',
    org: 'Govt. Muslim High School, Chattogram',
    desc: 'Perfect score. BNCC Cadet Sergeant. Deputy Youth Chief, Red Crescent Youth GMHS Unit. 1× BNCC Regimental Camp. 1× Red Crescent Youth Divisional Camp.',
    tags: ['Perfect Score', 'BNCC Sergeant', 'Red Crescent'],
    type: 'education',
  },
  {
    year: '2016',
    period: '2016',
    title: 'Foundation & Basic First Aid Training — Passed',
    org: 'BDRCS / Red Crescent Youth, Chattogram',
    desc: '7-day residential training. The first formal certification of any kind — humanitarian before digital.',
    tags: ['BDRCS', '7-Day Training', 'First Cert'],
    type: 'milestone',
  },
]

// ─── CREDENTIAL CLUSTER DATA ──────────────────────────────────────────────────

interface Cert {
  name: string
  issuer: string
  date: string
  ects?: number
  credentialId?: string
  isFoundational?: boolean
}

interface Cluster {
  id: string
  title: string
  badge?: string
  certs: Cert[]
}

const credentialClusters: Cluster[] = [
  {
    id: 'ai',
    title: 'AI & Machine Intelligence',
    badge: '8.5 ECTS · 2 Anthropic Certifications',
    certs: [
      { name: 'Introduction to Model Context Protocol', issuer: 'Anthropic', date: 'Jul 2026', credentialId: 'dxqz448h9iex' },
      { name: 'AI Fluency: Framework & Foundations', issuer: 'Anthropic', date: 'Jun 2026', credentialId: 'f3m25y4u3fm8' },
      { name: 'AI in Society: Introduction', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 1.5 },
      { name: 'AI in Society: AI and Privacy', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5 },
      { name: 'AI in Society: AI and Disinformation', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5 },
      { name: 'AI in Society: AI and One Health', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5 },
      { name: 'AI in Society: AI and Democracy', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5 },
      { name: 'AI in Society: AI and Justice', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5 },
      { name: 'AI in Society: AI and Discrimination', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5 },
      { name: 'Ethics of AI', issuer: 'University of Helsinki', date: 'Mar 2026', ects: 2 },
      { name: 'Elements of AI', issuer: 'University of Helsinki / MinnaLearn', date: 'Mar 2026', ects: 2 },
    ],
  },
  {
    id: 'webdev',
    title: 'Web Engineering',
    certs: [
      { name: 'Next.js App Router Fundamentals', issuer: 'Vercel', date: 'Nov 2025', credentialId: 'dashboard-app' },
      { name: 'Client-side Web Development with React.js', issuer: 'CodeSignal', date: 'Oct 2025' },
      { name: 'React Foundations for Next.js', issuer: 'Vercel', date: 'Jul 2025', credentialId: 'react-foundations' },
      { name: 'Getting Into JavaScript Fundamentals', issuer: 'CodeSignal', date: 'Jun 2025' },
      { name: 'Web Development with HTML, CSS & JavaScript', issuer: 'CodeSignal', date: 'Jun 2025' },
      { name: 'Responsive Web Design', issuer: 'freeCodeCamp', date: 'Dec 2020', isFoundational: true },
    ],
  },
  {
    id: 'design',
    title: 'Design & Marketing',
    certs: [
      { name: 'Digital Skills: User Experience', issuer: 'Accenture / FutureLearn', date: 'Sep 2025' },
      { name: 'Fundamentals of Digital Marketing', issuer: 'Google Career Certificates', date: 'Aug 2022', credentialId: 'RLY UVE 73T' },
      { name: 'Mobile Photography', issuer: '10 Minute School', date: 'Apr 2022' },
    ],
  },
  {
    id: 'humanitarian',
    title: 'Humanitarian & Global',
    certs: [
      { name: 'Introduction to Emergency Operations Center', issuer: 'World Bank Group', date: 'Nov 2025' },
      { name: 'Green Skills for Future Employability', issuer: 'UNDP Bangladesh / Grameenphone', date: 'Sep 2025' },
      { name: 'Green Skills for SDG: Green Start-Ups', issuer: 'UNDP Bangladesh / Grameenphone', date: 'Sep 2025' },
      { name: 'Green Skills for SDG: SDG Primer', issuer: 'UNDP Bangladesh / Grameenphone', date: 'Sep 2025' },
      { name: 'Foundation & Basic First Aid Training — 7 Days, Passed', issuer: 'BDRCS / Red Crescent Youth, Chattogram', date: '2016' },
    ],
  },
  {
    id: 'foundational',
    title: 'Digital Literacy',
    certs: [
      { name: 'Digital Literacy Certification', issuer: 'Bangladesh Computer Council', date: 'Nov 2023' },
      { name: 'HTML5, CSS3 & Bootstrap4', issuer: 'Bohubrihi', date: 'Dec 2020', isFoundational: true },
    ],
  },
]

// ─── COMMUNITY ROLES ─────────────────────────────────────────────────────────

const communityRoles = [
  {
    title: 'Open Troop Member',
    org: 'Bangladesh Red Crescent Society (BDRCS)',
    period: 'Jun 2022 – Present',
    category: 'Disaster & Humanitarian Relief',
    ongoing: true,
  },
  {
    title: 'Event Organizer',
    org: 'Failed Camera Stories',
    period: 'Dec 2024 – Feb 2025',
    category: 'Arts & Culture',
    ongoing: false,
  },
  {
    title: 'Cadet Sergeant — BNCC',
    org: 'Bangladesh National Cadet Corps (BNCC)',
    period: '2017 – 2024',
    category: 'Social Services',
    ongoing: false,
    details: [
      'Junior Division · 2017–21 · GMHS Platoon',
      'Senior Division · 2022–24',
      '1× Regimental Camp',
      'Call-sign: Black bird',
      'Best Shooter Badge — 2017',
    ],
  },
  {
    title: 'Deputy Youth Chief',
    org: 'Red Crescent Youth, GMHS Unit Chattogram',
    period: 'Mar 2019 – 2021',
    category: 'Environment & Youth',
    ongoing: false,
  },
]

// ─── NOTABLE CONTRIBUTIONS ────────────────────────────────────────────────────

const contributions = [
  {
    title: 'Lubuntu Official Contributor',
    releases: 'Lubuntu 21.10 + 22.04 LTS',
    desc: 'Contributed wallpaper and greeter artwork that shipped as official defaults in two consecutive Ubuntu family releases.',
    link: 'https://lubuntu.me',
    linkLabel: 'lubuntu.me',
  },
  {
    title: 'Zen Browser — More Better Toast',
    releases: 'Accepted into Zen Browser Store',
    desc: 'CSS mod for frosted-glass pill-shaped toast notifications using -moz-pref() media query syntax. Shipped as a community mod.',
    link: 'https://zen-browser.app',
    linkLabel: 'zen-browser.app',
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function typeLabel(type: TimelineType) {
  if (type === 'work') return { label: 'WORK', color: 'text-[#3DF49A]' }
  if (type === 'education') return { label: 'EDUCATION', color: 'text-[#8A938E]' }
  return { label: 'MILESTONE', color: 'text-[#5C615E]' }
}

function clusterIcon(id: string) {
  const cls = 'w-4 h-4 text-[#3DF49A]'
  if (id === 'ai') return <Cpu className={cls} />
  if (id === 'webdev') return <Code2 className={cls} />
  if (id === 'design') return <Palette className={cls} />
  if (id === 'humanitarian') return <Globe className={cls} />
  return <BookOpen className={cls} />
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function CredentialsPage() {
  const totalEcts = credentialClusters
    .find(c => c.id === 'ai')!
    .certs.reduce((sum, c) => sum + (c.ects ?? 0), 0)

  const totalCerts = credentialClusters.reduce((sum, c) => sum + c.certs.length, 0)

  return (
    <>
      <Navbar />
      <main className="pt-32">

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <p
            className="text-[#3DF49A] text-xs tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-jetbrains)' }}
          >
            Credentials & Journey
          </p>
          <h1
            className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight text-[#F3F6F4] mb-8"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            The Long Game.
          </h1>
          <p
            className="text-[#8A938E] text-xl max-w-2xl leading-relaxed mb-12"
            style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 300 }}
          >
            5+ years designing. 4+ years building. Every cert, role, and field 
            experience — in one place.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-px bg-[#1F2421] w-fit">
            {[
              { num: '5+', label: 'Years designing' },
              { num: `${totalEcts}`, label: 'ECTS from Helsinki' },
              { num: `${totalCerts}+`, label: 'Certifications' },
              { num: '6', label: 'Orgs designed for' },
            ].map((s) => (
              <div key={s.label} className="bg-[#070807] px-8 py-5">
                <p
                  className="text-[#F3F6F4] text-2xl font-bold mb-0.5"
                  style={{ fontFamily: 'var(--font-clash)' }}
                >
                  {s.num}
                </p>
                <p
                  className="text-[#8A938E] text-xs tracking-wide"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Location tag */}
          <div className="flex items-center gap-1.5 mt-8">
            <MapPin className="w-3.5 h-3.5 text-[#8A938E]" />
            <span
              className="text-[#8A938E] text-sm"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Chattogram, Bangladesh
            </span>
          </div>
        </section>

        {/* ── JOURNEY TIMELINE ──────────────────────────────────────── */}
        <section className="bg-[#090A09] border-t border-b border-[#1F2421]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="flex items-center gap-3 mb-4">
              <h2
                className="text-4xl font-bold text-[#F3F6F4]"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                Experience & Education
              </h2>
            </div>
            <p
              className="text-[#8A938E] text-sm mb-16"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Reverse-chronological. Work and education interleaved as they actually happened.
            </p>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[52px] top-0 bottom-0 w-px bg-[#1F2421] hidden md:block" />

              <div className="space-y-10">
                {timelineEvents.map((event, i) => {
                  const { label, color } = typeLabel(event.type)
                  const isLast = i === timelineEvents.length - 1

                  return (
                    <div key={`${event.year}-${event.title}`} className="flex gap-8 items-start group">
                      {/* Year */}
                      <div className="shrink-0 w-24 text-right hidden md:block pt-0.5">
                        <span
                          className="text-sm font-medium"
                          style={{
                            fontFamily: 'var(--font-jetbrains)',
                            color: event.isCurrent ? '#3DF49A' : '#5C615E',
                          }}
                        >
                          {event.year}
                        </span>
                      </div>

                      {/* Dot */}
                      <div className="relative z-10 shrink-0 hidden md:block mt-1.5">
                        <div
                          className="w-3 h-3 rounded-full border-2 transition-all duration-200 group-hover:scale-125"
                          style={{
                            borderColor: event.isCurrent ? '#3DF49A' : isLast ? '#2B302D' : '#2B302D',
                            background: event.isCurrent ? '#3DF49A' : '#070807',
                            boxShadow: event.isCurrent ? '0 0 8px rgba(61,244,154,0.4)' : 'none',
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 border-l-2 border-transparent hover:border-[#1F2421] transition-colors duration-200 pl-0 md:pl-0 md:border-0">
                        {/* Mobile year */}
                        <p
                          className="text-xs text-[#5C615E] mb-1 md:hidden"
                          style={{ fontFamily: 'var(--font-jetbrains)' }}
                        >
                          {event.year}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3
                            className="text-[#F3F6F4] font-semibold text-base"
                            style={{ fontFamily: 'var(--font-clash)' }}
                          >
                            {event.title}
                          </h3>
                          <span
                            className={`text-[10px] tracking-[0.15em] uppercase ${color} hidden md:inline`}
                            style={{ fontFamily: 'var(--font-jetbrains)' }}
                          >
                            {label}
                          </span>
                          {event.isCurrent && (
                            <span
                              className="text-[10px] tracking-[0.12em] uppercase bg-[#3DF49A]/10 text-[#3DF49A] px-2 py-0.5 rounded-full"
                              style={{ fontFamily: 'var(--font-jetbrains)' }}
                            >
                              Current
                            </span>
                          )}
                        </div>

                        <p
                          className="text-sm text-[#3DF49A] mb-1.5"
                          style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 500 }}
                        >
                          {event.org}
                        </p>

                        <p
                          className="text-xs text-[#5C615E] mb-2"
                          style={{ fontFamily: 'var(--font-jetbrains)' }}
                        >
                          {event.period}
                        </p>

                        <p
                          className="text-[#8A938E] text-sm leading-relaxed mb-3 max-w-2xl"
                          style={{ fontFamily: 'var(--font-jakarta)' }}
                        >
                          {event.desc}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {event.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] text-[#5C615E] border border-[#1F2421] px-2 py-0.5 rounded"
                              style={{ fontFamily: 'var(--font-jetbrains)' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── CREDENTIAL CLUSTERS ───────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2
            className="text-4xl font-bold text-[#F3F6F4] mb-4"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Certifications
          </h2>
          <p
            className="text-[#8A938E] text-sm mb-16"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Grouped by domain. Not a flat list — because context matters.
          </p>

          <div className="space-y-16">
            {credentialClusters.map((cluster) => (
              <div key={cluster.id}>
                {/* Cluster header */}
                <div className="flex flex-wrap items-start gap-4 mb-6 pb-4 border-b border-[#1F2421]">
                  <div className="flex items-center gap-2.5">
                    {clusterIcon(cluster.id)}
                    <h3
                      className="text-xl font-bold text-[#F3F6F4]"
                      style={{ fontFamily: 'var(--font-clash)' }}
                    >
                      {cluster.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    {cluster.badge && (
                      <span
                        className="text-[10px] text-[#3DF49A] border border-[#3DF49A]/30 bg-[#3DF49A]/5 px-2.5 py-1 rounded-full tracking-wide"
                        style={{ fontFamily: 'var(--font-jetbrains)' }}
                      >
                        {cluster.badge}
                      </span>
                    )}
                    <span
                      className="text-[10px] text-[#5C615E] border border-[#1F2421] px-2 py-1 rounded-full"
                      style={{ fontFamily: 'var(--font-jetbrains)' }}
                    >
                      {cluster.certs.length} certs
                    </span>
                  </div>
                </div>

                {/* Cert cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cluster.certs.map((cert) => (
                    <div
                      key={cert.name}
                      className={`border border-[#1F2421] rounded-lg p-4 hover:border-[#3DF49A]/25 transition-colors duration-200 ${
                        cert.isFoundational ? 'opacity-50 hover:opacity-70' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p
                          className="text-[#F3F6F4] text-sm font-semibold leading-snug flex-1"
                          style={{ fontFamily: 'var(--font-clash)' }}
                        >
                          {cert.name}
                        </p>
                        {cert.ects && (
                          <span
                            className="shrink-0 text-[10px] text-[#3DF49A] bg-[#3DF49A]/10 border border-[#3DF49A]/20 px-1.5 py-0.5 rounded"
                            style={{ fontFamily: 'var(--font-jetbrains)' }}
                          >
                            {cert.ects} ECTS
                          </span>
                        )}
                      </div>
                      <p
                        className="text-[#8A938E] text-xs mb-1.5"
                        style={{ fontFamily: 'var(--font-jakarta)' }}
                      >
                        {cert.issuer}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[#5C615E] text-[10px]"
                          style={{ fontFamily: 'var(--font-jetbrains)' }}
                        >
                          {cert.date}
                        </span>
                        {cert.credentialId && (
                          <span
                            className="text-[#3B3F3D] text-[10px]"
                            style={{ fontFamily: 'var(--font-jetbrains)' }}
                          >
                            · {cert.credentialId}
                          </span>
                        )}
                        {cert.isFoundational && (
                          <span
                            className="text-[10px] text-[#3B3F3D] italic"
                            style={{ fontFamily: 'var(--font-jakarta)' }}
                          >
                            foundational
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMMUNITY & SERVICE ───────────────────────────────────── */}
        <section className="bg-[#090A09] border-t border-b border-[#1F2421]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2
              className="text-4xl font-bold text-[#F3F6F4] mb-4"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              Community & Service
            </h2>
            <p
              className="text-[#8A938E] text-sm mb-12"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Beyond the screen.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communityRoles.map((role) => (
                <div
                  key={role.title}
                  className="border border-[#1F2421] rounded-lg p-6 hover:border-[#3DF49A]/20 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      className="text-[#F3F6F4] font-semibold"
                      style={{ fontFamily: 'var(--font-clash)' }}
                    >
                      {role.title}
                    </h3>
                    {role.ongoing && (
                      <span className="shrink-0 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3DF49A] animate-pulse" />
                        <span
                          className="text-[10px] text-[#3DF49A]"
                          style={{ fontFamily: 'var(--font-jetbrains)' }}
                        >
                          Active
                        </span>
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm text-[#3DF49A] mb-1"
                    style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 500 }}
                  >
                    {role.org}
                  </p>
                  <p
                    className="text-xs text-[#5C615E] mb-3"
                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                  >
                    {role.period}
                  </p>
                  <span
                    className="text-[10px] text-[#5C615E] border border-[#1F2421] px-2 py-0.5 rounded"
                    style={{ fontFamily: 'var(--font-jetbrains)' }}
                  >
                    {role.category}
                  </span>
                  {'details' in role && Array.isArray((role as { details?: string[] }).details) && (
                    <ul className="mt-3 space-y-1">
                      {(role as { details: string[] }).details.map((d) => (
                        <li
                          key={d}
                          className="text-[11px] text-[#5C615E] flex items-center gap-1.5"
                          style={{ fontFamily: 'var(--font-jetbrains)' }}
                        >
                          <span className="w-1 h-1 rounded-full bg-[#2B302D] shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NOTABLE CONTRIBUTIONS ─────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-[#3DF49A]" />
            <h2
              className="text-4xl font-bold text-[#F3F6F4]"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              Notable Contributions
            </h2>
          </div>
          <p
            className="text-[#8A938E] text-sm mb-12"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            Third-party shipped work. Not portfolio pieces — actual releases.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributions.map((item) => (
              <div
                key={item.title}
                className="border border-[#1F2421] rounded-xl p-8 hover:border-[#3DF49A]/30 transition-all duration-300 group"
              >
                <p
                  className="text-[10px] text-[#3DF49A] tracking-[0.15em] uppercase mb-3"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  {item.releases}
                </p>
                <h3
                  className="text-xl font-bold text-[#F3F6F4] mb-3 group-hover:text-[#3DF49A] transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-clash)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[#8A938E] text-sm leading-relaxed mb-6"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  {item.desc}
                </p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8A938E] hover:text-[#3DF49A] transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  <ExternalLink className="w-3 h-3" />
                  {item.linkLabel}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border border-[#1F2421] rounded-xl p-8">
            <div>
              <h3
                className="text-2xl font-bold text-[#F3F6F4] mb-1"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                Want to work together?
              </h3>
              <p
                className="text-[#8A938E] text-sm"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                I&apos;m selective about what I take on — which means I care about what you&apos;re building.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-[#3DF49A] text-[#06160E] text-sm font-semibold rounded-full
                           hover:bg-[#5BFBA8] transition-all duration-200"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Get in touch
              </Link>
              <a
                href="https://linkedin.com/in/mahtamun-hoque-fahim"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 border border-[#1F2421] text-[#F3F6F4] text-sm rounded-full
                           hover:border-[#8A938E] transition-all duration-200 inline-flex items-center gap-1.5"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                LinkedIn
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
