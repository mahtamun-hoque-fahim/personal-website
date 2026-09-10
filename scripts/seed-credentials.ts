import 'dotenv/config'
import { getDb } from '../lib/db'
import {
  credentialTimeline,
  credentialClusters,
  credentialCerts,
  credentialCommunity,
  credentialContributions,
} from '../lib/db/schema'

async function seed() {
  const db = await getDb()
  console.log('Seeding credentials...')

  // ── Timeline ────────────────────────────────────────────
  const timelineData = [
    { year: '2026', period: 'Jul 2026 – Sep 2026', title: 'Front-end AI Engineering Intern', org: 'FlyRank AI', desc: 'Built production-grade AI-powered frontend systems. 14 assignments, 93+ verified hours. Capstone "Send the Link: Launch, Demo & Story" accepted by lead track mentor. Verified: internship.flyrank.ai', tags: ['AI Engineering', 'Remote', 'Completed'], type: 'work', isCurrent: false, sortOrder: 0 },
    { year: '2025', period: 'Nov 2025 – Jun 2026', title: 'Lead Designer', org: 'Interting Digital', desc: 'Rebranded a growing digital agency end-to-end — visual identity, design system, and social content direction.', tags: ['Brand Direction', 'Lead Role', 'Hybrid'], type: 'work', isCurrent: false, sortOrder: 1 },
    { year: '2025', period: 'Jul 2025 – Present', title: 'B.Sc (Hons.) Computer Science & Engineering', org: 'BGC Trust University Bangladesh', desc: 'CGPA 3.14 / 4.0. Media & IT Subcommittee — BGCTUB Debating Club. ACS Subcommittee Member. Captain, 45 Central Football Team. Active debater.', tags: ['CSE', 'Active', 'CGPA 3.14'], type: 'education', isCurrent: true, sortOrder: 2 },
    { year: '2023', period: 'Nov 2023 – Nov 2025', title: 'Graphic Designer', org: 'Interting Digital', desc: 'Delivered brand identity systems, social media creatives, and print-ready materials for a range of clients across digital formats.', tags: ['Graphic Design', 'Part-Time'], type: 'work', isCurrent: false, sortOrder: 3 },
    { year: '2021', period: '2021 – 2022', title: 'Default Wallpaper & Greeter Art Contributor', org: 'Lubuntu / Ubuntu', desc: 'Created artwork shipped as the default wallpaper and login greeter in Lubuntu 21.10 and 22.04 LTS — reaching hundreds of thousands of users worldwide.', tags: ['Open Source', 'Shipped'], type: 'milestone', isCurrent: false, sortOrder: 4 },
    { year: '2016', period: '2016 – Present', title: 'Independent Designer', org: 'Self-employed (Mahtamun)', desc: 'Designing since 2016 across logos, brand identity, edtech, print, and YouTube thumbnails. Former lead designer at multiple agencies and brands.', tags: ['Design', 'Freelance', '7+ Years'], type: 'work', isCurrent: true, sortOrder: 5 },
  ]
  await db.insert(credentialTimeline).values(timelineData).onConflictDoNothing()
  console.log(`  ✓ ${timelineData.length} timeline entries`)

  // ── Clusters ────────────────────────────────────────────
  const clusterRows = await db.insert(credentialClusters).values([
    { title: 'AI & Machine Intelligence', iconId: 'ai', badge: '8.5 ECTS · 6 Anthropic Courses · FlyRank Certified', sortOrder: 0 },
    { title: 'Web Engineering', iconId: 'webdev', badge: null, sortOrder: 1 },
    { title: 'Design & Creative', iconId: 'design', badge: null, sortOrder: 2 },
    { title: 'Humanitarian & Social Impact', iconId: 'humanitarian', badge: null, sortOrder: 3 },
    { title: 'Foundational', iconId: 'foundational', badge: null, sortOrder: 4 },
  ]).returning().onConflictDoNothing()
  console.log(`  ✓ ${clusterRows.length} clusters`)

  const [ai, webdev, design, humanitarian, foundational] = clusterRows

  // ── Certs ───────────────────────────────────────────────
  const certsData = [
    // AI cluster
    { clusterId: ai.id, name: 'Front-end AI Engineering — Certificate of Completion', issuer: 'FlyRank AI', date: 'Sep 2026', credentialId: 'FR-D11-94C62-B67D8', isFoundational: false, sortOrder: 0 },
    { clusterId: ai.id, name: 'Model Context Protocol: Advanced Topics', issuer: 'Anthropic', date: 'Aug 2026', credentialId: 'xafu9rr7h4yy', isFoundational: false, sortOrder: 1 },
    { clusterId: ai.id, name: 'Introduction to Model Context Protocol', issuer: 'Anthropic', date: 'Jul 2026', credentialId: 's9kjg6ztedp8', isFoundational: false, sortOrder: 2 },
    { clusterId: ai.id, name: 'AI Fluency for Students', issuer: 'Anthropic', date: 'Jul 2026', credentialId: '4wixsbgsdcmz', isFoundational: false, sortOrder: 3 },
    { clusterId: ai.id, name: 'AI Fluency for Builders', issuer: 'Anthropic', date: 'Jul 2026', credentialId: '6hjywmoxkn2k', isFoundational: false, sortOrder: 4 },
    { clusterId: ai.id, name: 'AI Capabilities and Limitations', issuer: 'Anthropic', date: 'Jul 2026', credentialId: 'ysz59m5pq2ah', isFoundational: false, sortOrder: 5 },
    { clusterId: ai.id, name: 'AI Fluency: Framework & Foundations', issuer: 'Anthropic', date: 'Jul 2026', credentialId: 's2c6v8z53vgc', isFoundational: true, sortOrder: 6 },
    { clusterId: ai.id, name: 'Elements of AI', issuer: 'University of Helsinki', date: 'Mar 2026', ects: 2.0, isFoundational: true, sortOrder: 7 },
    { clusterId: ai.id, name: 'Building AI', issuer:'University of Helsinki', date: 'Apr 2026', ects: 1.0, isFoundational: false, sortOrder: 8 },
    // Web Engineering cluster
    { clusterId: webdev.id, name: 'Fundamentals of Digital Marketing', issuer: 'Google Digital Garage', date: '2024', credentialId: null, isFoundational: true, sortOrder: 0 },
    // Design cluster
    { clusterId: design.id, name: 'Default Wallpaper Contributor', issuer: 'Lubuntu / Ubuntu', date: '2021', credentialId: null, isFoundational: false, sortOrder: 0 },
    // Foundational cluster
    { clusterId: foundational.id, name: 'Introduction to Cybersecurity', issuer: 'Cisco NetAcad', date: '2024', credentialId: null, isFoundational: true, sortOrder: 0 },
  ]
  await db.insert(credentialCerts).values(certsData).onConflictDoNothing()
  console.log(`  ✓ ${certsData.length} certs`)

  // ── Community ───────────────────────────────────────────
  const communityData = [
    { title: 'Media & IT Subcommittee Member', org: 'BGCTUB Debating Club', period: 'Jul 2025 – Present', category: 'Academic', ongoing: true, details: ['Manages digital presence and content for the debating club', 'Coordinates media coverage of inter-university debate events'], sortOrder: 0 },
    { title: 'ACS Subcommittee Member', org: 'BGCTUB', period: 'Jul 2025 – Present', category: 'Academic', ongoing: true, details: ['Active member of the Academic & Cultural Society subcommittee'], sortOrder: 1 },
    { title: 'Team Captain', org: '45 Central Football Team', period: '2025 – Present', category: 'Sports', ongoing: true, details: ['Captains the 45 Central football team for inter-hall tournaments'], sortOrder: 2 },
  ]
  await db.insert(credentialCommunity).values(communityData).onConflictDoNothing()
  console.log(`  ✓ ${communityData.length} community roles`)

  // ── Contributions ───────────────────────────────────────
  const contributionsData = [
    { title: 'Lubuntu Default Wallpaper & Greeter Art', releases: 'Lubuntu 21.10 + 22.04 LTS', desc: 'Designed and shipped the default wallpaper and login greeter artwork included in two official Lubuntu releases — reaching hundreds of thousands of users worldwide as part of the Ubuntu ecosystem.', link: 'https://lubuntu.me', linkLabel: 'lubuntu.me', sortOrder: 0 },
  ]
  await db.insert(credentialContributions).values(contributionsData).onConflictDoNothing()
  console.log(`  ✓ ${contributionsData.length} contributions`)

  console.log('Seed complete.')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
