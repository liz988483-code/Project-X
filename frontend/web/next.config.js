/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'api.soko.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Server Actions are enabled by default in Next.js 14, remove the experimental flag
  // experimental: {
  //   serverActions: true, // Remove this line
  // },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  // Optional: Add other experimental features if needed
  experimental: {
    // Add only the experimental features you actually need
    // serverComponentsExternalPackages: ['some-package'],
  }
}

module.exports = nextConfig
