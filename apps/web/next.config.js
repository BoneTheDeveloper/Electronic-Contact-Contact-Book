/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable ESLint during production build
  // Warning: This allows production builds to successfully complete even if
  // your project has ESLint errors.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checking enabled
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
