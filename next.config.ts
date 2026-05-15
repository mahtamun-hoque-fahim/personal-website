import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ltyzobowjzwrwcacairz.supabase.co' },
    ],
  },
  serverExternalPackages: ['better-auth'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
}

export default nextConfig
