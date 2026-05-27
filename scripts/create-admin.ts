// Run with: npm run admin:create -- you@example.com 'your-strong-password' "Your Name"
//
// One-time admin bootstrap. Since public signup is disabled, this is how
// you create the very first admin account (and any future ones, if you
// add more emails to ADMIN_EMAILS).
//
// Requirements:
//   - The email MUST be present in ADMIN_EMAILS in your .env, otherwise
//     the Better Auth hook will reject the creation.
//   - DATABASE_URL and BETTER_AUTH_SECRET must be set.
//
// After your account exists, sign in at /admin/login like normal.

import { loadEnvConfig } from '@next/env'

// Load .env.local, .env.development, .env exactly the way Next.js does.
loadEnvConfig(process.cwd())

async function main() {
  const [, , emailArg, passwordArg, ...nameParts] = process.argv

  if (!emailArg || !passwordArg) {
    console.error('Usage: npm run admin:create -- <email> <password> [name]')
    process.exit(1)
  }

  const email = emailArg.trim().toLowerCase()
  const password = passwordArg
  const name = nameParts.join(' ').trim() || email.split('@')[0]

  if (password.length < 8) {
    console.error('Password must be at least 8 characters.')
    process.exit(1)
  }

  // Import after env is loaded so DATABASE_URL etc. are present.
  const { auth } = await import('../lib/auth')
  const { getAdminEmails } = await import('../lib/admin-allowlist')

  const allowed = getAdminEmails()
  if (allowed.length === 0) {
    console.error(
      'ADMIN_EMAILS is empty. Set it in .env first, e.g.\n' +
        `  ADMIN_EMAILS=${email}`,
    )
    process.exit(1)
  }
  if (!allowed.includes(email)) {
    console.error(
      `Email "${email}" is not in ADMIN_EMAILS.\n` +
        `Allowed: ${allowed.join(', ')}\n` +
        `Add it to .env first, then re-run.`,
    )
    process.exit(1)
  }

  try {
    const result = await auth.api.signUpEmail({
      body: { email, password, name },
    })
    console.log(`✓ Admin user created: ${result.user?.email}`)
    console.log('  Sign in at /admin/login.')
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.toLowerCase().includes('already')) {
      console.log(
        `User "${email}" already exists. If you forgot the password, use /admin/forgot-password.`,
      )
      return
    }
    console.error('Failed to create admin:', msg)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
