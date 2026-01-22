/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Set output file tracing root to avoid lockfile warnings
  outputFileTracingRoot: process.cwd(),
  // Disable ESLint during production build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checking enabled
    ignoreBuildErrors: false,
  },
  // Note: instrumentationHook deprecated in Next.js 15
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig
