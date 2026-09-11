import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  serverExternalPackages: ['better-auth', '@better-auth/core'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
    serverActions: {
      // Default is 1MB — too small for a real photo upload (avatar).
      // Kept at 4mb, not 5mb, to stay under Vercel's ~4.5MB serverless
      // function request-body ceiling (a hard platform limit this
      // setting can't raise) — MAX_AVATAR_BYTES in lib/cloudinary.ts
      // matches this.
      bodySizeLimit: '4mb',
    },
  },
}

export default nextConfig

// Cloudflare/OpenNext dev integration. Safe no-op on Vercel/Node — only
// activates `next dev` bindings hookup when running with Cloudflare context.
//
// Guarded: this function (despite its name) attempts unawaited async work
// that crashes Vercel's build with EPIPE. Only invoke during `next dev`.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NEXT_PHASE !== 'phase-production-build'
) {
  initOpenNextCloudflareForDev()
}
