import 'dotenv/config'
import { config } from 'dotenv'
config({ path: '.env.local' })
import { db } from '../lib/db'
import {
  credentialTimeline,
  credentialClusters,
  credentialCerts,
  credentialCommunity,
  credentialContributions,
} from '../lib/db/schema'

async function sync() {
  console.log('Syncing credentials — clearing and reseeding from PDF reference...')

  // ── Clear all existing data ────────────────────────────────
  await db.delete(credentialContributions)
  await db.delete(credentialCommunity)
  await db.delete(credentialCerts)
  await db.delete(credentialClusters)
  await db.delete(credentialTimeline)
  console.log('  ✓ Cleared existing data')

  // ── Timeline ───────────────────────────────────────────────
  await db.insert(credentialTimeline).values([
    { year: '2026', period: 'Jul 2026 – Sep 2026', title: 'Front-end AI Engineering Intern', org: 'FlyRank AI', desc: 'Built production-grade AI-powered frontend systems. 14 assignments, 93+ verified hours. Capstone "Send the Link: Launch, Demo & Story" accepted by lead track mentor. Verified: internship.flyrank.ai', tags: ['AI Engineering', 'Remote', 'Completed'], type: 'work', isCurrent: false, sortOrder: 0 },
    { year: '2025', period: 'Jul 2025 – Present', title: 'B.Sc (Hons.) Computer Science & Engineering', org: 'BGC Trust University Bangladesh', desc: 'CGPA 3.14 / 4.0. Media & IT Subcommittee — BGCTUB Debating Club. ACS Subcommittee Member. Captain, 45 Central Football Team. Active debater.', tags: ['CSE', 'Active', 'CGPA 3.14'], type: 'education', isCurrent: true, sortOrder: 1 },
    { year: '2025', period: 'Nov 2025 – Jun 2026', title: 'Lead Designer', org: 'Interting Digital', desc: 'Rebranded a growing digital agency end-to-end — visual identity, design system, and social content direction.', tags: ['Brand Direction', 'Lead Role', 'Hybrid'], type: 'work', isCurrent: false, sortOrder: 2 },
    { year: '2025', period: 'Jan 2025 – Feb 2025', title: 'Graphic Designer — Contract', org: 'Failed Camera Stories', desc: '6th Book Exchange Festival Chattogram. Designed social media visuals, posters, banners, and print flyers for a city-wide cultural event.', tags: ['Print Media', 'Events', 'Contract'], type: 'work', isCurrent: false, sortOrder: 3 },
    { year: '2023', period: 'Nov 2023 – Nov 2025', title: 'Graphic Designer', org: 'Interting Digital', desc: 'Built the brand identity from zero for a brand-new agency. Led daily visual content and shaped the design language that defined the brand.', tags: ['Brand Identity', '2 Years', 'Remote'], type: 'work', isCurrent: false, sortOrder: 4 },
    { year: '2022', period: 'Mar 2022 – Oct 2023', title: 'HSC — Science', org: 'Patiya Govt. College', desc: 'GPA 4 / 5. BNCC Cadet Corporal. Red Crescent Volunteer. 1× Team Championship — Prottoy Debate Fest. 1× Runner-up, Patiya Upazilla Football Fest.', tags: ['Science', 'BNCC', 'Debate Champion'], type: 'education', isCurrent: false, sortOrder: 5 },
    { year: '2022', period: 'Sep 2022 – Sep 2023', title: 'Graphic Designer', org: 'Datos Marketing Tour', desc: 'Social media design and marketing content for a growing tour marketing agency. Remote, 1 year.', tags: ['Social Media', 'Marketing', 'Remote'], type: 'work', isCurrent: false, sortOrder: 6 },
    { year: '2021', period: 'Feb 2021 – Jul 2022', title: 'Graphic Designer', org: 'Loraz', desc: 'Part-time design work covering brand assets, social content, and digital collateral.', tags: ['Design', 'Part-time'], type: 'work', isCurrent: false, sortOrder: 7 },
    { year: '2021', period: 'Feb 2021 – Sep 2021', title: 'Graphic Designer', org: 'Sulphuric Bench', desc: 'Logo design and brand identity work. First remote client-facing design role.', tags: ['Logo Design', 'Remote'], type: 'work', isCurrent: false, sortOrder: 8 },
    { year: '2019', period: '2019 – 2021', title: 'SSC — Science — GPA 5 / 5', org: 'Govt. Muslim High School, Chattogram', desc: 'Perfect score. BNCC Cadet Sergeant. Deputy Youth Chief, Red Crescent Youth GMHS Unit. 1× BNCC Regimental Camp. 1× Red Crescent Youth Divisional Camp.', tags: ['Perfect Score', 'BNCC Sergeant', 'Red Crescent'], type: 'education', isCurrent: false, sortOrder: 9 },
    { year: '2016', period: '2016', title: 'Foundation & Basic First Aid Training — Passed', org: 'BDRCS / Red Crescent Youth, Chattogram', desc: '7-day residential training. The first formal certification of any kind — humanitarian before digital.', tags: ['BDRCS', '7-Day Training', 'First Cert'], type: 'milestone', isCurrent: false, sortOrder: 10 },
  ])
  console.log('  ✓ 11 timeline entries')

  // ── Clusters ───────────────────────────────────────────────
  const clusterRows = await db.insert(credentialClusters).values([
    { title: 'AI & Machine Intelligence', iconId: 'ai',           badge: '8.5 ECTS · 6 Anthropic Courses · FlyRank Certified', sortOrder: 0 },
    { title: 'Web Engineering',           iconId: 'webdev',       badge: null, sortOrder: 1 },
    { title: 'Design & Marketing',        iconId: 'design',       badge: null, sortOrder: 2 },
    { title: 'Humanitarian & Global',     iconId: 'humanitarian', badge: null, sortOrder: 3 },
    { title: 'Digital Literacy',          iconId: 'foundational', badge: null, sortOrder: 4 },
  ]).returning()

  const cl: Record<string, string> = Object.fromEntries(clusterRows.map(c => [c.iconId, c.id]))
  console.log('  ✓ 5 clusters')

  // ── Certs ──────────────────────────────────────────────────
  await db.insert(credentialCerts).values([

    // AI & Machine Intelligence (16 certs, 8.5 ECTS)
    { clusterId: cl.ai, name: 'Front-end AI Engineering — Certificate of Completion', issuer: 'FlyRank AI',                    date: 'Sep 2026', ects: null, credentialId: 'FR-D11-94C62-B67D8', isFoundational: false, sortOrder: 0 },
    { clusterId: cl.ai, name: 'Model Context Protocol: Advanced Topics',               issuer: 'Anthropic',                    date: 'Aug 2026', ects: null, credentialId: 'xafu9rr7h4yy',      isFoundational: false, sortOrder: 1 },
    { clusterId: cl.ai, name: 'Introduction to Model Context Protocol',                issuer: 'Anthropic',                    date: 'Jul 2026', ects: null, credentialId: 's9kjg6ztedp8',      isFoundational: false, sortOrder: 2 },
    { clusterId: cl.ai, name: 'AI Fluency for Students',                               issuer: 'Anthropic',                    date: 'Jul 2026', ects: null, credentialId: '4wixsbgsdcmz',      isFoundational: false, sortOrder: 3 },
    { clusterId: cl.ai, name: 'AI Fluency for Builders',                               issuer: 'Anthropic',                    date: 'Jul 2026', ects: null, credentialId: '6hjywmoxkn2k',      isFoundational: false, sortOrder: 4 },
    { clusterId: cl.ai, name: 'AI Capabilities and Limitations',                       issuer: 'Anthropic',                    date: 'Jul 2026', ects: null, credentialId: 'ysz59m5pq2ah',      isFoundational: false, sortOrder: 5 },
    { clusterId: cl.ai, name: 'AI Fluency: Framework & Foundations',                   issuer: 'Anthropic',                    date: 'Jul 2026', ects: null, credentialId: 's2c6v8z53vgc',      isFoundational: true,  sortOrder: 6 },
    { clusterId: cl.ai, name: 'AI in Society: Introduction',                           issuer: 'University of Helsinki',       date: 'Apr 2026', ects: 1.5,  credentialId: null,                isFoundational: false, sortOrder: 7 },
    { clusterId: cl.ai, name: 'AI in Society: AI and Privacy',                         issuer: 'University of Helsinki',       date: 'Apr 2026', ects: 0.5,  credentialId: null,                isFoundational: false, sortOrder: 8 },
    { clusterId: cl.ai, name: 'AI in Society: AI and Disinformation',                  issuer: 'University of Helsinki',       date: 'Apr 2026', ects: 0.5,  credentialId: null,                isFoundational: false, sortOrder: 9 },
    { clusterId: cl.ai, name: 'AI in Society: AI and One Health',                      issuer: 'University of Helsinki',       date: 'Apr 2026', ects: 0.5,  credentialId: null,                isFoundational: false, sortOrder: 10 },
    { clusterId: cl.ai, name: 'AI in Society: AI and Democracy',                       issuer: 'University of Helsinki',       date: 'Apr 2026', ects: 0.5,  credentialId: null,                isFoundational: false, sortOrder: 11 },
    { clusterId: cl.ai, name: 'AI in Society: AI and Justice',                         issuer: 'University of Helsinki',       date: 'Apr 2026', ects: 0.5,  credentialId: null,                isFoundational: false, sortOrder: 12 },
    { clusterId: cl.ai, name: 'AI in Society: AI and Discrimination',                  issuer: 'University of Helsinki',       date: 'Apr 2026', ects: 0.5,  credentialId: null,                isFoundational: false, sortOrder: 13 },
    { clusterId: cl.ai, name: 'Ethics of AI',                                          issuer: 'University of Helsinki',       date: 'Mar 2026', ects: 2.0,  credentialId: null,                isFoundational: false, sortOrder: 14 },
    { clusterId: cl.ai, name: 'Elements of AI',                                        issuer: 'University of Helsinki / MinnaLearn', date: 'Mar 2026', ects: 2.0, credentialId: null,          isFoundational: true,  sortOrder: 15 },

    // Web Engineering (6 certs)
    { clusterId: cl.webdev, name: 'Next.js App Router Fundamentals',              issuer: 'Vercel',       date: 'Nov 2025', credentialId: 'dashboard-app',      isFoundational: false, sortOrder: 0 },
    { clusterId: cl.webdev, name: 'Client-side Web Development with React.js',   issuer: 'CodeSignal',   date: 'Oct 2025', credentialId: null,                  isFoundational: false, sortOrder: 1 },
    { clusterId: cl.webdev, name: 'React Foundations for Next.js',               issuer: 'Vercel',       date: 'Jul 2025', credentialId: 'react-foundations',   isFoundational: false, sortOrder: 2 },
    { clusterId: cl.webdev, name: 'Getting Into JavaScript Fundamentals',         issuer: 'CodeSignal',   date: 'Jun 2025', credentialId: null,                  isFoundational: false, sortOrder: 3 },
    { clusterId: cl.webdev, name: 'Web Development with HTML, CSS & JavaScript', issuer: 'CodeSignal',   date: 'Jun 2025', credentialId: null,                  isFoundational: false, sortOrder: 4 },
    { clusterId: cl.webdev, name: 'Responsive Web Design',                       issuer: 'freeCodeCamp', date: 'Dec 2020', credentialId: null,                  isFoundational: true,  sortOrder: 5 },

    // Design & Marketing (3 certs)
    { clusterId: cl.design, name: 'Digital Skills: User Experience',      issuer: 'Accenture / FutureLearn',    date: 'Sep 2025', credentialId: null,           isFoundational: false, sortOrder: 0 },
    { clusterId: cl.design, name: 'Fundamentals of Digital Marketing',    issuer: 'Google Career Certificates', date: 'Aug 2022', credentialId: 'RLY UVE 73T', isFoundational: false, sortOrder: 1 },
    { clusterId: cl.design, name: 'Mobile Photography',                   issuer: '10 Minute School',           date: 'Apr 2022', credentialId: null,           isFoundational: false, sortOrder: 2 },

    // Humanitarian & Global (5 certs)
    { clusterId: cl.humanitarian, name: 'Introduction to Emergency Operations Center',        issuer: 'World Bank Group',                     date: 'Nov 2025', credentialId: null, isFoundational: false, sortOrder: 0 },
    { clusterId: cl.humanitarian, name: 'Green Skills for Future Employability',              issuer: 'UNDP Bangladesh / Grameenphone',        date: 'Sep 2025', credentialId: null, isFoundational: false, sortOrder: 1 },
    { clusterId: cl.humanitarian, name: 'Green Skills for SDG: Green Start-Ups',             issuer: 'UNDP Bangladesh / Grameenphone',        date: 'Sep 2025', credentialId: null, isFoundational: false, sortOrder: 2 },
    { clusterId: cl.humanitarian, name: 'Green Skills for SDG: SDG Primer',                  issuer: 'UNDP Bangladesh / Grameenphone',        date: 'Sep 2025', credentialId: null, isFoundational: false, sortOrder: 3 },
    { clusterId: cl.humanitarian, name: 'Foundation & Basic First Aid Training — 7 Days, Passed', issuer: 'BDRCS / Red Crescent Youth, Chattogram', date: '2016', credentialId: null, isFoundational: false, sortOrder: 4 },

    // Digital Literacy (2 certs)
    { clusterId: cl.foundational, name: 'Digital Literacy Certification', issuer: 'Bangladesh Computer Council', date: 'Nov 2023', credentialId: null, isFoundational: false, sortOrder: 0 },
    { clusterId: cl.foundational, name: 'HTML5, CSS3 & Bootstrap4',       issuer: 'Bohubrihi',                  date: 'Dec 2020', credentialId: null, isFoundational: true,  sortOrder: 1 },
  ])
  console.log('  ✓ 32 certs across 5 clusters')

  // ── Community ──────────────────────────────────────────────
  await db.insert(credentialCommunity).values([
    { title: 'Media & IT Subcommittee Member', org: 'BGCTUB Debating Club',                    period: 'Jul 2025 – Present',  category: 'Academic',                     ongoing: true,  details: ['Manages digital presence and content for the debating club', 'Coordinates media coverage of inter-university debate events'],                                                                                            sortOrder: 0 },
    { title: 'ACS Subcommittee Member',        org: 'BGCTUB',                                  period: 'Jul 2025 – Present',  category: 'Academic',                     ongoing: true,  details: ['Active member of the Academic & Cultural Society subcommittee'],                                                                                                                                                              sortOrder: 1 },
    { title: 'Team Captain',                   org: '45 Central Football Team',                period: '2025 – Present',      category: 'Sports',                       ongoing: true,  details: ['Captains the 45 Central football team for inter-hall tournaments'],                                                                                                                                                           sortOrder: 2 },
    { title: 'Open Troop Member',              org: 'Bangladesh Red Crescent Society (BDRCS)', period: 'Jun 2022 – Present',  category: 'Disaster & Humanitarian Relief', ongoing: false, details: ['Crowd Control Management Team — Sitakunda Container Depot Fire Outbreak (Jun 2022)'],                                                                                                                                       sortOrder: 3 },
    { title: 'Event Organizer',                org: 'Failed Camera Stories',                   period: 'Dec 2024 – Feb 2025', category: 'Arts & Culture',               ongoing: false, details: ['First lead designer role', 'Lead volunteer — citywide awareness campaign', 'First official approach to City Corporation office'],                                                                                                sortOrder: 4 },
    { title: 'Cadet Sergeant — BNCC',          org: 'Bangladesh National Cadet Corps (BNCC)', period: '2017 – 2024',         category: 'Social Services',              ongoing: false, details: ['Junior Division · 2017–21 · GMHS Platoon', 'Senior Division · 2022–24 · PGC Platoon', '1× Regimental Camp', 'Best Shooter Badge — 2017'],                                                                                    sortOrder: 5 },
    { title: 'Deputy Youth Chief',             org: 'Red Crescent Youth, GMHS Unit Chattogram', period: 'Mar 2019 – 2021',   category: 'Environment & Youth',          ongoing: false, details: ['1× Tree Plantation Program', '4× School Cleaning Program', '1× Pedestrian Drinking Water Program', '1× Divisional Youth Camp'],                                                                                              sortOrder: 6 },
  ])
  console.log('  ✓ 7 community roles')

  // ── Contributions ──────────────────────────────────────────
  await db.insert(credentialContributions).values([
    { title: 'Lubuntu Official Contributor',       releases: 'Lubuntu 21.10 + 22.04 LTS',    desc: 'Contributed wallpaper and greeter artwork that shipped as official defaults in two consecutive Ubuntu family releases.',                                   link: 'https://lubuntu.me',        linkLabel: 'lubuntu.me',        sortOrder: 0 },
    { title: 'Zen Browser — More Better Toast',    releases: 'Accepted into Zen Browser Store', desc: 'CSS mod for frosted-glass pill-shaped toast notifications using -moz-pref() media query syntax. Shipped as a community mod.', link: 'https://zen-browser.app',   linkLabel: 'zen-browser.app',   sortOrder: 1 },
  ])
  console.log('  ✓ 2 contributions')

  console.log('\nSync complete. DB now matches reference PDF exactly.')
  process.exit(0)
}

sync().catch(err => { console.error(err); process.exit(1) })
