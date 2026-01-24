# Vercel Build Failure Analysis Report

**Date:** 2026-01-24
**Deployment:** dpl_GK27AgY7NQQfQgttXLgnnvzUYgN3
**Commit:** 81cefc30 "fix: set turbopack.root for monorepo workspace"

## Root Cause

Vercel detects Turborepo and **overrides the custom `buildCommand`** in `vercel.json`, automatically running `turbo run build` instead of `pnpm build --filter=web`.

When `turbo run build` executes, it runs `next build` from within `/vercel/path0/apps/web`, but Turbopack cannot find the Next.js package because:

1. `turbopack.root: process.cwd()` resolves to `/vercel/path0/apps/web` (the app directory)
2. Next.js package is at `/vercel/path0/node_modules/next` (monorepo root)
3. Turbopack needs the root to be set to the **monorepo root**, not the app directory

## Error Message

```
Error: Next.js inferred your workspace root, but it may not be correct.
We couldn't find the Next.js package (next/package.json) from the project directory: /vercel/path0/apps/web/app
To fix this, set turbopack.root in your Next.js config, or ensure the Next.js package is resolvable from this directory.
```

## Secondary Issues

1. **Deprecated `eslint` config** in `next.config.mjs` - ESLint config inside next.config.js is no longer supported in Next.js 16

## Solution Options

### Option A: Fix Turbopack Root (Recommended)

Change `turbopack.root` in `apps/web/next.config.mjs` to point to monorepo root:

```javascript
import path from 'path'

const nextConfig = {
  turbopack: {
    root: path.resolve(process.cwd(), '../..'), // Monorepo root
  },
  // Remove deprecated eslint config
}
```

Also remove the deprecated `eslint` config block.

### Option B: Disable Turbo Detection (Fallback)

Tell Vercel to not auto-detect Turbo by adding to `vercel.json`:

```json
{
  "buildCommand": "pnpm build --filter=web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install --filter=!mobile --frozen-lockfile",
  "framework": null,
  "turbo": {}
}
```

### Option C: Use framework: Next.js

```json
{
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

This tells Vercel to use Next.js preset instead of Turbo.

## Recommended Fix

Use **Option A** - it's the proper solution for Turborepo + Next.js 16 with Turbopack:

1. Fix `turbopack.root` to point to monorepo root
2. Remove deprecated `eslint` config

## Files to Modify

1. `apps/web/next.config.mjs` - Fix turbopack.root, remove eslint config

## Unresolved Questions

None.
