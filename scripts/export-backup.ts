// Run with: npx tsx scripts/export-backup.ts
// Dumps all app table data to JSON for safekeeping before migrations.
// Requires DATABASE_URL in env.

import { neon } from '@neondatabase/serverless'
import { writeFileSync } from 'fs'

async function main() {
  const sql = neon(process.env.DATABASE_URL!)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

  const tables = ['blog_posts', 'contact_messages', 'projects']

  for (const table of tables) {
    const rows = await sql(`SELECT * FROM ${table} ORDER BY created_at`)
    const filename = `backup_${table}_${timestamp}.json`
    writeFileSync(filename, JSON.stringify(rows, null, 2))
    console.log(`Exported ${rows.length} rows -> ${filename}`)
  }
}

main().catch(console.error)
