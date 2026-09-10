import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local' })
import { db } from '../lib/db'
import { eq } from 'drizzle-orm'
import {
  credentialTimeline,
  credentialClusters,
  credentialCerts,
} from '../lib/db/schema'

async function patch2() {
  console.log('Patch 2: adding missing timeline entries and Helsinki AI certs...')

  // ── Fix Interting Digital Graphic Designer description ───
  await db.update(credentialTimeline)
    .set({
      desc: 'Built the brand identity from zero for a brand-new agency. Led daily visual content and shaped the design language that defined the brand.',
      tags: ['Brand Identity', '2 Years', 'Remote'],
      updatedAt: new Date(),
    })
    .where(eq(credentialTimeline.title, 'Graphic Designer'))
  console.log('  ✓ Interting Digital description fixed')

  // ── Add missing timeline entries ─────────────────────────
  const missing = [
    { year: '2025', period: 'Jan 2025 – Feb 2025', title: 'Graphic Designer — Contract', org: 'Failed Camera Stories', desc: '6th Book Exchange Festival Chattogram. Designed social media visuals, posters, banners, and print flyers for a city-wide cultural event.', tags: ['Print Media', 'Events', 'Contract'], type: 'work', isCurrent: false, sortOrder: 6 },
    { year: '2022', period: 'Mar 2022 – Oct 2023', title: 'HSC — Science', org: 'Patiya Govt. College', desc: 'GPA 4 / 5. BNCC Cadet Corporal. Red Crescent Volunteer. 1× Team Championship — Prottoy Debate Fest. 1× Runner-up, Patiya Upazilla Football Fest.', tags: ['Science', 'BNCC', 'Debate Champion'], type: 'education', isCurrent: false, sortOrder: 7 },
    { year: '2022', period: 'Sep 2022 – Sep 2023', title: 'Graphic Designer', org: 'Datos Marketing Tour', desc: 'Social media design and marketing content for a growing tour marketing agency. Remote, 1 year.', tags: ['Social Media', 'Marketing', 'Remote'], type: 'work', isCurrent: false, sortOrder: 8 },
    { year: '2021', period: 'Feb 2021 – Jul 2022', title: 'Graphic Designer', org: 'Loraz', desc: 'Part-time design work covering brand assets, social content, and digital collateral.', tags: ['Design', 'Part-time'], type: 'work', isCurrent: false, sortOrder: 9 },
    { year: '2021', period: 'Feb 2021 – Sep 2021', title: 'Graphic Designer', org: 'Sulphuric Bench', desc: 'Logo design and brand identity work. First remote client-facing design role.', tags: ['Logo Design', 'Remote'], type: 'work', isCurrent: false, sortOrder: 10 },
    { year: '2019', period: '2019 – 2021', title: 'SSC — Science — GPA 5 / 5', org: 'Govt. Muslim High School, Chattogram', desc: 'Perfect score. BNCC Cadet Sergeant. Deputy Youth Chief, Red Crescent Youth GMHS Unit. 1× BNCC Regimental Camp. 1× Red Crescent Youth Divisional Camp.', tags: ['Perfect Score', 'BNCC Sergeant', 'Red Crescent'], type: 'education', isCurrent: false, sortOrder: 11 },
    { year: '2016', period: '2016', title: 'Foundation & Basic First Aid Training — Passed', org: 'BDRCS / Red Crescent Youth, Chattogram', desc: '7-day residential training. The first formal certification of any kind — humanitarian before digital.', tags: ['BDRCS', '7-Day Training', 'First Cert'], type: 'milestone', isCurrent: false, sortOrder: 12 },
  ]
  await db.insert(credentialTimeline).values(missing).onConflictDoNothing()
  console.log(`  ✓ ${missing.length} timeline entries added`)

  // ── Add missing Helsinki AI in Society certs ─────────────
  const clusters = await db.select().from(credentialClusters)
  const aiCluster = clusters.find(c => c.iconId === 'ai')
  if (!aiCluster) { console.log('  ✗ AI cluster not found'); process.exit(1) }

  // Fix Elements of AI issuer
  await db.update(credentialCerts)
    .set({ issuer: 'University of Helsinki / MinnaLearn', updatedAt: new Date() })
    .where(eq(credentialCerts.name, 'Elements of AI'))
  console.log('  ✓ Elements of AI issuer fixed')

  const helsinkiCerts = [
    { clusterId: aiCluster.id, name: 'AI in Society: Introduction', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 1.5, isFoundational: false, sortOrder: 20 },
    { clusterId: aiCluster.id, name: 'AI in Society: AI and Privacy', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5, isFoundational: false, sortOrder: 21 },
    { clusterId: aiCluster.id, name: 'AI in Society: AI and Disinformation', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5, isFoundational: false, sortOrder: 22 },
    { clusterId: aiCluster.id, name: 'AI in Society: AI and One Health', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5, isFoundational: false, sortOrder: 23 },
    { clusterId: aiCluster.id, name: 'AI in Society: AI and Democracy', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5, isFoundational: false, sortOrder: 24 },
    { clusterId: aiCluster.id, name: 'AI in Society: AI and Justice', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5, isFoundational: false, sortOrder: 25 },
    { clusterId: aiCluster.id, name: 'AI in Society: AI and Discrimination', issuer: 'University of Helsinki', date: 'Apr 2026', ects: 0.5, isFoundational: false, sortOrder: 26 },
    { clusterId: aiCluster.id, name: 'Ethics of AI', issuer: 'University of Helsinki', date: 'Mar 2026', ects: 2, isFoundational: false, sortOrder: 27 },
  ]
  await db.insert(credentialCerts).values(helsinkiCerts).onConflictDoNothing()
  console.log(`  ✓ ${helsinkiCerts.length} Helsinki AI certs added`)

  console.log('Patch 2 complete.')
  process.exit(0)
}

patch2().catch(err => { console.error(err); process.exit(1) })
