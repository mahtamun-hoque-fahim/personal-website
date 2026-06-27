/**
 * Admin email allowlist.
 *
 * Set ADMIN_EMAILS in .env (comma-separated) to control who can sign in to
 * the admin area. Public signup is disabled; this list is the single source
 * of truth for who is allowed in.
 *
 *   ADMIN_EMAILS=mahtamun@example.com,backup@example.com
 */
function parseAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const allowed = parseAdminEmails()
  if (allowed.length === 0) {
    // Fail closed: if nothing is configured, nobody gets in.
    return false
  }
  return allowed.includes(email.toLowerCase())
}

export function getAdminEmails(): string[] {
  return parseAdminEmails()
}
