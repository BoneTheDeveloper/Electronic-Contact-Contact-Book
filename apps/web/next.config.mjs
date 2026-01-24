import path from 'path'

// Monorepo root - same for both outputFileTracingRoot and turbopack.root
// They MUST have the same value or Next.js will use outputFileTracingRoot
const monorepoRoot = path.resolve(process.cwd(), '../..')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Set output file tracing root to monorepo root for Vercel deployment
  outputFileTracingRoot: monorepoRoot,
  // Set Turbopack root directory to monorepo root (must match outputFileTracingRoot)
  turbopack: {
    root: monorepoRoot,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

export default nextConfig
