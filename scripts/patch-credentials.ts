import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local' })
import { db } from '../lib/db'
import { eq } from 'drizzle-orm'
import {
  credentialClusters,
  credentialCerts,
  credentialCommunity,
  credentialContributions,
} from '../lib/db/schema'

async function patch() {
  console.log('Patching credentials...')

  // ── Fix cluster names ────────────────────────────────────
  await db.update(credentialClusters)
    .set({ title: 'Design & Marketing', updatedAt: new Date() })
    .where(eq(credentialClusters.title, 'Design & Creative'))
  await db.update(credentialClusters)
    .set({ title: 'Humanitarian & Global', updatedAt: new Date() })
    .where(eq(credentialClusters.title, 'Humanitarian & Social Impact'))
  await db.update(credentialClusters)
    .set({ title: 'Digital Literacy', updatedAt: new Date() })
    .where(eq(credentialClusters.title, 'Foundational'))
  console.log('  ✓ Cluster names fixed')

  // ── Get cluster IDs ──────────────────────────────────────
  const clusters = await db.select().from(credentialClusters)
  const cl = Object.fromEntries(clusters.map(c => [c.iconId, c.id]))

  // ── Remove wrong cert (Google Digital Garage was under webdev, should be design) ──
  await db.delete(credentialCerts).where(eq(credentialCerts.name, 'Fundamentals of Digital Marketing'))
  console.log('  ✓ Removed misplaced cert')

  // ── Add missing Web Engineering certs ───────────────────
  const webCerts = [
    { clusterId: cl.webdev, name: 'Next.js App Router Fundamentals', issuer: 'Vercel', date: 'Nov 2025', credentialId: 'dashboard-app', isFoundational: false, sortOrder: 0 },
    { clusterId: cl.webdev, name: 'Client-side Web Development with React.js', issuer: 'CodeSignal', date: 'Oct 2025', isFoundational: false, sortOrder: 1 },
    { clusterId: cl.webdev, name: 'React Foundations for Next.js', issuer: 'Vercel', date: 'Jul 2025', credentialId: 'react-foundations', isFoundational: false, sortOrder: 2 },
    { clusterId: cl.webdev, name: 'Getting Into JavaScript Fundamentals', issuer: 'CodeSignal', date: 'Jun 2025', isFoundational: false, sortOrder: 3 },
    { clusterId: cl.webdev, name: 'Web Development with HTML, CSS & JavaScript', issuer: 'CodeSignal', date: 'Jun 2025', isFoundational: false, sortOrder: 4 },
    { clusterId: cl.webdev, name: 'Responsive Web Design', issuer: 'freeCodeCamp', date: 'Dec 2020', isFoundational: true, sortOrder: 5 },
  ]
  await db.insert(credentialCerts).values(webCerts).onConflictDoNothing()
  console.log('  ✓ Web Engineering certs added')

  // ── Add missing Design & Marketing certs ────────────────
  const designCerts = [
    { clusterId: cl.design, name: 'Digital Skills: User Experience', issuer: 'Accenture / FutureLearn', date: 'Sep 2025', isFoundational: false, sortOrder: 0 },
    { clusterId: cl.design, name: 'Fundamentals of Digital Marketing', issuer: 'Google Career Certificates', date: 'Aug 2022', credentialId: 'RLY UVE 73T', isFoundational: false, sortOrder: 1 },
    { clusterId: cl.design, name: 'Mobile Photography', issuer: '10 Minute School', date: 'Apr 2022', isFoundational: false, sortOrder: 2 },
  ]
  await db.insert(credentialCerts).values(designCerts).onConflictDoNothing()
  console.log('  ✓ Design & Marketing certs added')

  // ── Add missing Humanitarian certs ───────────────────────
  const humanCerts = [
    { clusterId: cl.humanitarian, name: 'Introduction to Emergency Operations Center', issuer: 'World Bank Group', date: 'Nov 2025', isFoundational: false, sortOrder: 0 },
    { clusterId: cl.humanitarian, name: 'Green Skills for Future Employability', issuer: 'UNDP Bangladesh / Grameenphone', date: 'Sep 2025', isFoundational: false, sortOrder: 1 },
    { clusterId: cl.humanitarian, name: 'Green Skills for SDG: Green Start-Ups', issuer: 'UNDP Bangladesh / Grameenphone', date: 'Sep 2025', isFoundational: false, sortOrder: 2 },
    { clusterId: cl.humanitarian, name: 'Green Skills for SDG: SDG Primer', issuer: 'UNDP Bangladesh / Grameenphone', date: 'Sep 2025', isFoundational: false, sortOrder: 3 },
    { clusterId: cl.humanitarian, name: 'Foundation & Basic First Aid Training — 7 Days, Passed', issuer: 'BDRCS / Red Crescent Youth, Chattogram', date: '2016', isFoundational: false, sortOrder: 4 },
  ]
  await db.insert(credentialCerts).values(humanCerts).onConflictDoNothing()
  console.log('  ✓ Humanitarian & Global certs added')

  // ── Add missing Digital Literacy certs ──────────────────
  const foundCerts = [
    { clusterId: cl.foundational, name: 'Digital Literacy Certification', issuer: 'Bangladesh Computer Council', date: 'Nov 2023', isFoundational: false, sortOrder: 0 },
    { clusterId: cl.foundational, name: 'HTML5, CSS3 & Bootstrap4', issuer: 'Bohubrihi', date: 'Dec 2020', isFoundational: true, sortOrder: 1 },
  ]
  await db.insert(credentialCerts).values(foundCerts).onConflictDoNothing()
  console.log('  ✓ Digital Literacy certs added')

  // ── Remove wrong Lubuntu cert from design cluster (it was a cert not a contribution) ──
  await db.delete(credentialCerts).where(eq(credentialCerts.name, 'Default Wallpaper Contributor'))
  console.log('  ✓ Removed misplaced Lubuntu cert')

  // ── Remove wrong Cisco cert from foundational (already in foundational cluster) ──
  await db.delete(credentialCerts).where(eq(credentialCerts.name, 'Introduction to Cybersecurity'))
  console.log('  ✓ Removed Cisco cert (not in original page)')

  // ── Add missing community roles ──────────────────────────
  const communityPatch = [
    { title: 'Open Troop Member', org: 'Bangladesh Red Crescent Society (BDRCS)', period: 'Jun 2022 – Present', category: 'Disaster & Humanitarian Relief', ongoing: false, details: ['Crowd Control Management Team — Sitakunda Container Depot Fire Outbreak (Jun 2022)'], sortOrder: 3 },
    { title: 'Event Organizer', org: 'Failed Camera Stories', period: 'Dec 2024 – Feb 2025', category: 'Arts & Culture', ongoing: false, details: ['First lead designer role', 'Lead volunteer — citywide awareness campaign', 'First official approach to City Corporation office'], sortOrder: 4 },
    { title: 'Cadet Sergeant', org: 'Bangladesh National Cadet Corps (BNCC)', period: '2017 – 2024', category: 'Social Services', ongoing: false, details: ['Junior Division · 2017–21 · GMHS Platoon', 'Senior Division · 2022–24 · PGC Platoon', '1× Regimental Camp', 'Best Shooter Badge — 2017'], sortOrder: 5 },
    { title: 'Deputy Youth Chief', org: 'Red Crescent Youth, GMHS Unit Chattogram', period: 'Mar 2019 – 2021', category: 'Environment & Youth', ongoing: false, details: ['1× Tree Plantation Program', '4× School Cleaning Program', '1× Pedestrian Drinking Water Program', '1× Divisional Youth Camp'], sortOrder: 6 },
  ]
  await db.insert(credentialCommunity).values(communityPatch).onConflictDoNothing()
  console.log('  ✓ Community roles added')

  // ── Add missing Zen Browser contribution ─────────────────
  await db.insert(credentialContributions).values([
    { title: 'Zen Browser — More Better Toast', releases: 'Accepted into Zen Browser Store', desc: 'CSS mod for frosted-glass pill-shaped toast notifications using -moz-pref() media query syntax. Shipped as a community mod.', link: 'https://zen-browser.app', linkLabel: 'zen-browser.app', sortOrder: 1 },
  ]).onConflictDoNothing()
  console.log('  ✓ Zen Browser contribution added')

  console.log('Patch complete.')
  process.exit(0)
}

patch().catch(err => { console.error(err); process.exit(1) })
