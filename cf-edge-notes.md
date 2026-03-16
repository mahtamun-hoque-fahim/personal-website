# Cloudflare Pages — Route Runtime Notes
#
# next-on-pages compiles Next.js for Cloudflare Workers (Edge Runtime).
# All routes that use `cookies()` from next/headers need to export:
#   export const runtime = 'edge'
#
# The following files already have this set or are pure Client Components:
#   - app/admin/login/page.tsx  → server action, needs edge
#   - app/admin/page.tsx        → reads cookies, needs edge
#   - app/admin/posts/page.tsx  → reads cookies, needs edge
#   - app/admin/messages/page.tsx → reads cookies, needs edge
#
# These are patched in cf-edge-patch.ts (auto-applied by build:cf script)
