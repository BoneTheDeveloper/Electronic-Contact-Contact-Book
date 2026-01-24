# Implementation Plan: Fix Vercel pnpm ENOTDIR Error

**Plan Location:** `C:\Project\electric_contact_book\plans\260124-2237-fix-vercel-pnpm-enotdir\plan.md`

## Summary

Created comprehensive plan to resolve `ERR_PNPM_ENOTDIR` error during Vercel deployment. The error occurs when pnpm encounters file system race conditions and existing `apps/mobile/node_modules` directory during dependency installation.

## Root Causes Identified

1. **Existing node_modules** - `apps/mobile/node_modules` exists locally but causes conflicts on Vercel
2. **Symlink complexity** - `shamefully-hoist=true` creates complex symlinks that fail on Vercel's filesystem
3. **No cleanup** - Custom install script doesn't clean before installing
4. **Race conditions** - Vercel's build environment has timing issues with file renames

## Solution: 3-Phase Approach

### Phase 1: Clean Install (Primary Fix)
- **File:** `scripts/vercel-install.cjs`
- **Changes:**
  1. Remove `apps/mobile/node_modules` before install
  2. Add `--force` flag to pnpm install command

### Phase 2: Reduce Symlink Complexity
- **File:** `.npmrc`
- **Changes:** Comment out `shamefully-hoist=true` to reduce symlink complexity

### Phase 3: Prevent Upload
- **File:** `.vercelignore` (new)
- **Purpose:** Prevent mobile app files from being uploaded to Vercel

## Code Changes Required

### 1. scripts/vercel-install.cjs

```javascript
// ADD after line 19 (after writing minimal workspace):
// CLEAN UP: Remove mobile node_modules if exists
const mobileNodeModules = path.join(__dirname, '..', 'apps', 'mobile', 'node_modules');
if (fs.existsSync(mobileNodeModules)) {
  console.log('🧹 Removing apps/mobile/node_modules...');
  fs.rmSync(mobileNodeModules, { recursive: true, force: true });
}

// MODIFY line 24 - add --force flag:
execSync('pnpm install --no-frozen-lockfile --ignore-scripts --no-strict-peer-dependencies --force', {
```

### 2. .npmrc

```ini
# COMMENT OUT line 7:
# shamefully-hoist=true
```

### 3. .vercelignore (NEW FILE)

```
# Ignore mobile app files from Vercel deployment
apps/mobile/
# Ignore other mobile build artifacts
*.ipa
*.apk
```

## Implementation Steps

1. Update `scripts/vercel-install.cjs` (15 min)
2. Optimize `.npmrc` (5 min)
3. Create `.vercelignore` (5 min)
4. Local testing (20 min)
5. Vercel deployment (15 min)

**Total estimated time:** 1 hour

## Fallback Options (if primary fails)

### Fallback A: Use Vercel's Built-in Install
Remove custom script, use pnpm's `--filter`:
```json
"installCommand": "pnpm install --no-frozen-lockfile --filter=web"
```

### Fallback B: Pre-build Dependencies
Use `pnpm fetch` with cache strategy

### Fallback C: Switch to npm
Last resort - change to npm for Vercel only

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking local dev | Low | Medium | Changes only affect Vercel |
| Increased build time | Low | Low | Force flag may slow slightly |
| Dependency conflicts | Medium | High | Keep `no-strict-peer-dependencies` |
| Mobile app affected | None | None | Changes isolated to Vercel |

## Success Criteria

- ✅ Vercel build completes without ENOTDIR error
- ✅ Web app deploys and functions correctly
- ✅ No mobile dependencies in web build
- ✅ Build time remains acceptable (<5 min install)

## Unresolved Questions

- None

---

**Status:** ✅ Plan created and ready for implementation
**Next Action:** Execute Phase 1 - Update install script
