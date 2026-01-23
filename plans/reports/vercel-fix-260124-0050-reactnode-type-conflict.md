# ReactNode Type Conflict Fix Plan

**Date:** 2026-01-24
**Priority:** CRITICAL (Blocking Vercel Deployment)
**Status:** Analysis Complete

## Error

```
Type 'React.ReactNode' is not assignable to type 'import("@types/react").ReactNode'.
Type 'bigint' is not assignable to type 'ReactNode'.

at apps/web/app/layout.tsx:24
<AuthProvider>{children}</AuthProvider>
```

## Root Cause

**Duplicate `@types/react` versions** in monorepo causing TypeScript type confusion:

| Package | Web App | Mobile App | Resolution |
|---------|---------|------------|------------|
| `react` | `^18.3.0` | `19.1.0` | CONFLICT |
| `@types/react` | `^18.2.55` | `~19.1.17` | CONFLICT |

### Why This Happens

1. **Monorepo Type Hoisting**: pnpm hoists dependencies to root `node_modules`
2. **TypeScript Resolution**: During web build, TS picks up React 19 types from mobile app
3. **Vercel Build Cache**: Cached types from previous builds can persist
4. **Next.js Expectations**: Next.js 15 expects React 18 types, not React 19

## Solution Options

### Option 1: Downgrade Mobile to React 18 (RECOMMENDED)
**Pros:**
- Single React version across monorepo
- No type conflicts
- Shared types work correctly

**Cons:**
- Expo 54 prefers React 19
- May need to downgrade Expo

### Option 2: pnpm Overlays to Isolate Types
**Pros:**
- Keep React 19 for mobile
- Keep React 18 for web
- No version downgrades

**Cons:**
- Complex configuration
- May have shared type issues

### Option 3: Remove @types/react from Web (ALTERNATIVE)
**Pros:**
- Quick fix
- Next.js 15 includes built-in React types

**Cons:**
- Testing library may need adjustments

## Recommended Fix: Option 1

Downgrade mobile to React 18 to match web app:

```json
// apps/mobile/package.json
{
  "dependencies": {
    "react": "^18.3.0",           // from "19.1.0"
    "react-dom": "^18.3.0",       // from "^19.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",   // from "~19.1.17"
  }
}
```

Then run:
```bash
rm -rf node_modules apps/*/node_modules
pnpm install
```

## Implementation Steps

1. Update `apps/mobile/package.json` with React 18 versions
2. Delete `pnpm-lock.yaml`
3. Clean all `node_modules`
4. Run `pnpm install`
5. Verify types: `cd apps/web && npx tsc --noEmit`
6. Commit and push

## Unresolved Questions

- Will Expo 54 work with React 18?
- Any mobile-specific features require React 19?
- Testing library compatibility after change?
