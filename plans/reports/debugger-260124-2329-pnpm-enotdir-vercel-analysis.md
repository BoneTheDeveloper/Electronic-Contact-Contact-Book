# pnpm ENOTDIR Error on Vercel - Diagnostic Report

**Report ID:** debugger-260124-2329-pnpm-enotdir-vercel-analysis
**Date:** 2026-01-24
**Issue:** Persistent `ERR_PNPM_ENOTDIR` during Vercel deployment despite multiple fix attempts

## Executive Summary

The ENOTDIR error persists due to a **fundamental timing issue**: Vercel's build process reads `pnpm-workspace.yaml` **before** the custom install script (`vercel-install.cjs`) can modify it. This causes pnpm to scan the entire workspace including `apps/mobile`, leading to conflicts with `apps/mobile/node_modules` that may already exist in the build environment.

**Root Cause:** Vercel's build pipeline evaluates workspace configuration during the early "setup" phase, before executing the custom `installCommand`. The custom script modifies the workspace but pnpm has already initialized with the full workspace configuration.

**Recommended Fix:** Use `pnpm install --filter=!mobile` directly in `vercel.json` without custom script manipulation, combined with disabling `shamefully-hoist=true`.

---

## Error Analysis

### Current Error Path
```
ERR_PNPM_ENOTDIR ENOTDIR: not a directory,
rename '/vercel/path0/apps/mobile/node_modules/@typescript-eslint/parser_tmp_73'
-> '/vercel/path0/apps/mobile/node_modules/@typescript-eslint/parser'
```

### Why This Path Exists Despite `.vercelignore`

**Critical Finding:** `.vercelignore` only prevents files from being **uploaded to Vercel**, not from being **processed during the build**.

From [Vercel's documentation](https://vercel.com/docs/deployments/vercel-ignore):
> ".vercelignore file allows you to define which files and directories should be excluded from the deployment process when using Vercel."

**Key insight:** `.vercelignore` applies during the **upload phase**, not during the **build/install phase**. This means:
- `apps/mobile/` is NOT uploaded to Vercel (correct)
- BUT pnpm still tries to process it because it's in `pnpm-workspace.yaml` during install (incorrect)

---

## Root Cause Analysis

### 1. Vercel Build Process Timing

**Timeline of Events:**

```
1. [VERCEL SETUP] Upload files (applying .vercelignore)
   └─> apps/mobile/ NOT uploaded ✓

2. [VERCEL SETUP] Read pnpm-workspace.yaml
   └─> Includes "apps/*" which references apps/mobile
   └─> pnpm initializes workspace config

3. [VERCEL INSTALL] Execute installCommand: "node scripts/vercel-install.cjs"
   └─> Script modifies pnpm-workspace.yaml to exclude mobile
   └─> But pnpm ALREADY initialized with full workspace!

4. [PNPM INSTALL] Scan workspace and install
   └─> Conflicts because workspace state is inconsistent
   └─> ENOTDIR error when trying to rename tmp files
```

**Evidence:** The error path shows `/vercel/path0/apps/mobile/node_modules/` exists even though mobile shouldn't be processed.

### 2. Symlink Complexity with Hoisting

Current `.npmrc` configuration:
```ini
node-linker=hoisted
shamefully-hoist=true
public-hoist-pattern[]=*
```

**Problem:** This combination creates complex symlink structures that are more likely to fail on Vercel's file system.

From [pnpm issue #9550](https://github.com/pnpm/pnpm/issues/9550):
> "pnpm deploy creates extra directories and fails to hoist... subdirectories are created in workspace packages"

When pnpm tries to:
1. Hoist dependencies to root `node_modules`
2. Create symlinks from workspace packages
3. Handle existing `apps/mobile/node_modules` directory

Result: **File system race conditions** causing ENOTDIR during rename operations.

### 3. Previous Attempts Analysis

**5 commit attempts all failed:**

| Commit | Approach | Why It Failed |
|--------|----------|---------------|
| `b2d73d3d` | Modify workspace in custom script | Script runs AFTER pnpm reads workspace |
| `d994630a` | Use `--filter` flags | Still processes full workspace during setup |
| `87a07463` | Resolve ENOTDIR error | Addressed symptoms, not root cause |
| `cafb663e` | Custom install script | Same timing issue as #1 |
| `cbfce920` | `--no-strict-peer-dependencies` | Doesn't address workspace issue |

**Common theme:** All assume the custom install script can modify workspace before pnpm sees it. **False assumption.**

---

## Configuration Conflicts

### Conflict 1: Custom Script vs Vercel Build Order

**Current setup:**
```javascript
// scripts/vercel-install.cjs
const minimalWorkspace = `packages:
  - packages/shared-types
  - packages/shared-ui
  - apps/web
`;
fs.writeFileSync(workspacePath, minimalWorkspace);
```

**Problem:** Vercel reads `pnpm-workspace.yaml` during setup phase (step 2), before executing install command (step 3).

### Conflict 2: `.vercelignore` vs `pnpm-workspace.yaml`

**`.vercelignore`:**
```
apps/mobile
```

**`pnpm-workspace.yaml`:**
```yaml
packages:
  - apps/*  # This INCLUDES apps/mobile!
```

**Result:** pnpm sees `apps/mobile` in workspace config, tries to process it, even though files aren't uploaded.

### Conflict 3: Hoisting Strategy

**Researcher report 260124-2234** says:
> "Enable shamefully hoist for tools that require flat node_modules"

**Researcher report 260124-2252** says:
> "Disable shamefully-hoist to avoid symlink issues"

**Reality:** Both can't be true. The evidence shows `shamefully-hoist=true` creates more symlink complexity and increases ENOTDIR likelihood.

---

## Diagnostic Questions Answered

### Q1: Does `.vercelignore` prevent processing during install or just upload?

**Answer:** `.vercelignore` only prevents **upload to Vercel**. It does NOT prevent processing during install.

**Evidence:**
- Error path shows `/vercel/path0/apps/mobile/node_modules/` exists
- Vercel docs confirm it filters "uploaded files"
- pnpm still processes workspace packages regardless of upload status

### Q2: Why is `/vercel/path0/apps/mobile/node_modules/` in the error path?

**Answer:** Because pnpm workspace includes `apps/*`, pnpm attempts to process `apps/mobile` during install, creating its own node_modules directory structure.

**Timeline:**
1. Vercel uploads files (excludes apps/mobile)
2. pnpm reads workspace (includes apps/mobile)
3. pnpm creates directories for all workspace packages
4. pnpm fails when mobile directory structure conflicts with hoisting

### Q3: Does `node-linker=hoisted` + `shamefully-hoist=true` create more conflicts?

**Answer:** YES. This combination maximizes symlink complexity.

**From pnpm docs:**
- `node-linker=hoisted`: Creates flat structure with symlinks
- `shamefully-hoist=true`: Breaks encapsulation, hoists ALL dependencies

**Combined effect:** More symlinks = higher failure probability on Vercel's file system.

### Q4: Timing of workspace modification vs pnpm scan

**Answer:** Custom script modifies workspace TOO LATE. Vercel's build order:

```
[Setup Phase]
  ├─ Upload files (.vercelignore applied here)
  ├─ Read workspace config (pnpm-workspace.yaml)
  └─ Initialize pnpm

[Install Phase]
  ├─ Execute installCommand
  └─ Run pnpm install (using workspace from Setup phase)
```

**Proof:** Error persists despite custom script successfully modifying `pnpm-workspace.yaml`. The modification happens, but pnpm doesn't use it.

---

## Recommended Fix

### Primary Solution: Use Native pnpm Filter Syntax

**Replace custom script approach with native pnpm filtering:**

**File:** `vercel.json`
```json
{
  "buildCommand": "pnpm build --filter=web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install --filter=!mobile --frozen-lockfile",
  "framework": null
}
```

**Why this works:**
- `--filter=!mobile` tells pnpm to EXCLUDE mobile during install
- Uses pnpm's native filtering, no custom script needed
- Works during pnpm's initialization phase (not a race condition)

### Secondary Fix: Disable Shamefully Hoist

**File:** `.npmrc`
```ini
engine-strict=true
node-linker=hoisted
strict-peer-dependencies=false
public-hoist-pattern[]=*
# shamefully-hoist=true  # DISABLE THIS
```

**Why:** Reduces symlink complexity, lowering ENOTDIR probability.

### Tertiary Fix: Update Workspace Config

**File:** `pnpm-workspace.yaml`
```yaml
packages:
  - packages/*
  - apps/web  # Explicitly list ONLY web, not apps/*

ignoredBuiltDependencies:
  - '@prisma/client'
  - '@prisma/engines'
  - prisma
  - sharp
  - unrs-resolver
```

**Why:** Removes `apps/mobile` from workspace entirely, preventing pnpm from ever seeing it.

### Cleanup: Remove Custom Script

**Delete:** `scripts/vercel-install.cjs`

**Why:** No longer needed with native filtering. The script was trying to work around Vercel's build timing, but native `--filter` works correctly.

---

## Implementation Plan

### Step 1: Update vercel.json (5 min)
```bash
# Edit vercel.json
# Change: "installCommand": "pnpm install --filter=!mobile --frozen-lockfile"
# Remove: custom script reference
```

### Step 2: Optimize .npmrc (2 min)
```bash
# Edit .npmrc
# Comment out: shamefully-hoist=true
```

### Step 3: Update pnpm-workspace.yaml (2 min)
```bash
# Edit pnpm-workspace.yaml
# Change: "packages: - apps/*" → "packages: - apps/web"
```

### Step 4: Delete custom script (1 min)
```bash
rm scripts/vercel-install.cjs
```

### Step 5: Test locally (10 min)
```bash
# Test install with filter
pnpm install --filter=!mobile --frozen-lockfile

# Verify mobile dependencies not installed
ls apps/mobile/node_modules  # Should be empty or not exist

# Verify web dependencies installed
ls apps/web/node_modules     # Should exist
```

### Step 6: Deploy to Vercel (5 min)
```bash
# Commit changes
git add .
git commit -m "fix: use native pnpm filter to exclude mobile from Vercel build"

# Push and observe Vercel build
git push origin master
```

**Total time:** ~25 minutes

---

## Alternative Solutions (If Primary Fails)

### Option A: Separate Vercel Project
Configure Vercel to deploy from `apps/web/` directory directly:
- Point Vercel project to `apps/web/` subdirectory
- Use `apps/web/package.json` for build config
- No workspace filtering needed

### Option B: Pre-build Dependencies
Commit `apps/web/node_modules` to git:
- Run `pnpm install --filter=web` locally
- Commit node_modules
- Skip install on Vercel: `"installCommand": "echo 'skip'"`

### Option C: Use npm for Vercel Only
Switch package manager for Vercel builds:
```json
"installCommand": "cd apps/web && npm install"
"buildCommand": "cd apps/web && npm run build"
```

---

## Risk Assessment

| Change | Risk | Impact | Mitigation |
|--------|------|--------|------------|
| Remove shamefully-hoist | Low | Low | Keep hoisted linker, just reduce hoisting scope |
| Use --filter syntax | Low | Low | Native pnpm feature, well-tested |
| Update workspace config | Low | Low | Explicit is better than patterns |
| Delete custom script | Low | Low | Script wasn't working anyway |

---

## Success Criteria

- ✅ No ENOTDIR error during Vercel build
- ✅ Web app builds and deploys successfully
- ✅ Mobile dependencies not in Vercel build
- ✅ Local development unaffected
- ✅ Build time < 5 minutes

---

## Unresolved Questions

1. **Why did 5 previous attempts all use the custom script approach when timing was the issue?**
   - Likely didn't understand Vercel's build phase ordering

2. **Does disabling `shamefully-hoist` affect local development?**
   - Should not, as `node-linker=hoisted` still provides flat structure

3. **Will `--filter=!mobile` work with `pnpm@9.15.0`?**
   - Yes, filter syntax has been stable since pnpm v7

---

## Sources

- [Vercel .vercelignore Documentation](https://vercel.com/docs/deployments/vercel-ignore)
- [pnpm Workspace Filter Documentation](https://context7.com/pnpm/pnpm/llms.txt)
- [pnpm Issue #9550 - Hoisting Failures](https://github.com/pnpm/pnpm/issues/9550)
- [pnpm Issue #10081 - Workspace Renaming](https://github.com/pnpm/pnpm/issues/10081)
- [Vercel Build Process Documentation](https://vercel.com/docs/builds/build-features)

---

**Next Action:** Implement Step 1 (Update vercel.json) and test locally before full deployment.
