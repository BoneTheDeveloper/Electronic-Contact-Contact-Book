---
title: "Fix pnpm ENOTDIR Error on Vercel Deployment"
description: "Enable shamefully-hoist and simplify Vercel configuration to resolve deployment errors"
status: pending
priority: P1
effort: 3h
branch: master
tags: [vercel, pnpm, deployment, bugfix]
created: 2026-01-24
---

# Fix pnpm ENOTDIR Error on Vercel Deployment

## Problem Summary

Vercel deployment fails with pnpm ENOTDIR error due to:
1. Symlink conflicts between pnpm's isolated linker and Vercel's build environment
2. `shamefully-hoist=true` disabled in .npmrc (commented out)
3. Complex custom install script that modifies workspace and removes node_modules

## Solution Approach

Based on research findings, apply the **minimal-change** solution:
1. Enable `shamefully-hoist=true` in root .npmrc
2. Simplify vercel.json to use standard pnpm install
3. Remove the custom vercel-install.cjs script (no longer needed)
4. Keep .vercelignore to exclude mobile from deployment context

## Files to Modify

### 1. Root .npmrc
**Path:** `C:\Project\electric_contact_book\.npmrc`

**Change:** Uncomment `shamefully-hoist=true`

```diff
 engine-strict=true
 node-linker=hoisted
 # Allow peer dependency conflicts for React 18/19 coexistence
 strict-peer-dependencies=false
 # Hoist Next.js and its dependencies for Vercel deployment
 public-hoist-pattern[]=*
-# DISABLE shamefully-hoist to reduce symlink complexity on Vercel and prevent ENOTDIR errors
-# shamefully-hoist=true
+# Enable shamefully-hoist for flat node_modules structure (Vercel compatibility)
+shamefully-hoist=true
```

### 2. vercel.json
**Path:** `C:\Project\electric_contact_book\vercel.json`

**Change:** Use standard pnpm install with filter syntax

```diff
 {
-  "buildCommand": "pnpm build --filter=web",
+  "buildCommand": "pnpm build --filter=web",
   "outputDirectory": "apps/web/.next",
-  "installCommand": "node scripts/vercel-install.cjs",
+  "installCommand": "pnpm install --frozen-lockfile",
   "framework": null
 }
```

### 3. Delete vercel-install.cjs
**Path:** `C:\Project\electric_contact_book\scripts\vercel-install.cjs`

**Action:** DELETE this file

The custom script is no longer needed because:
- .vercelignore already excludes mobile from deployment
- `shamefully-hoist=true` eliminates symlink conflicts
- pnpm filter syntax handles web-only builds

### 4. Verify .vercelignore
**Path:** `C:\Project\electric_contact_book\.vercelignore`

**Action:** NO CHANGE (already correct)

```
apps/mobile
apps/web/.next
apps/web/out
node_modules
.turbo
*.ipa
*.apk
```

## Implementation Order

```
Step 1: Modify .npmrc
  - Enable shamefully-hoist=true

Step 2: Update vercel.json
  - Replace custom install command with standard pnpm install

Step 3: Delete vercel-install.cjs
  - Remove scripts/vercel-install.cjs file

Step 4: Validate locally
  - Test build: pnpm build --filter=web
  - Test install: pnpm install --frozen-lockfile
  - Verify mobile still works locally

Step 5: Deploy to Vercel
  - Push changes
  - Monitor build logs
```

## Validation Steps

### Local Validation
```bash
# 1. Clean install with new config
rm -rf node_modules apps/*/node_modules
pnpm install

# 2. Verify web builds
pnpm build --filter=web

# 3. Verify mobile still works (local dev only)
cd apps/mobile
pnpm install
pnpm dev

# 4. Type check both apps
pnpm typecheck
```

### Vercel Deployment Validation
```bash
# Push to trigger deployment
git add .
git commit -m "fix: enable shamefully-hoist for Vercel pnpm compatibility"
git push

# Monitor build logs for:
# - pnpm install success (no ENOTDIR errors)
# - Next.js build completion
# - Successful deployment
```

## Rollback Plan

If deployment fails after changes:

1. **Quick Rollback:**
   ```bash
   git revert HEAD
   git push
   ```

2. **Alternative Approach** (if rollback still fails):
   - Re-enable vercel-install.cjs with improvements
   - Add `--no-strict-peer-dependencies` flag
   - Consider `node-linker=isolated` with workspace filters

## Benefits

1. **Simpler Configuration**: Standard pnpm install, no custom scripts
2. **Mobile Intact**: Local development unaffected
3. **Future-Proof**: Uses pnpm best practices for monorepos
4. **Faster Builds**: No workspace modification overhead

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| shamefully-hoist breaks local mobile dev | .vercelignore ensures Vercel-only config impact |
| pnpm version mismatch | packageManager field already pinned to 9.15.0 |
| Dependency conflicts | strict-peer-dependencies=false already enabled |

## Unresolved Questions

1. Will shamefully-hoist affect Expo Metro bundler behavior locally? (Unlikely - Metro doesn't use node_modules structure same way)
2. Should we add app-specific .npmrc files for mobile/web divergence? (Only if issues arise)
3. Does this impact EAS build for mobile? (No - EAS doesn't use .npmrc from root)

## References

- Research Report: `plans/reports/researcher-260124-2252-pnpm-enotdir-vercel.md`
- Development Rules: `.claude/workflows/development-rules.md`
- Project README: `README.md`
