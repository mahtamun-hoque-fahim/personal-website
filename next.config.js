/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ltyzobowjzwrwcacairz.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // Cloudflare Pages doesn't have an image optimisation server
    unoptimized: process.env.CF_PAGES === '1',
  },
}

module.exports = nextConfig
