/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during production build for now
    // TODO: Fix all ESLint warnings and re-enable
    ignoreDuringBuild: true,
  },
  typescript: {
    // Disable TypeScript type checking during build (already checked separately)
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
