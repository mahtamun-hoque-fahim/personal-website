import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ltyzobowjzwrwcacairz.supabase.co' },
    ],
  },
  serverExternalPackages: ['better-auth', '@better-auth/core'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
}

export default nextConfig

// Cloudflare/OpenNext dev integration. Safe no-op on Vercel/Node — only
// activates `next dev` bindings hookup when running with Cloudflare context.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
initOpenNextCloudflareForDev()
