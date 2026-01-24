---
title: "Fix Vercel pnpm ENOTDIR Error"
description: "Resolve ENOTDIR error during pnpm install on Vercel deployment"
status: pending
priority: P1
effort: 2h
branch: master
tags: [vercel, pnpm, deployment, bugfix]
created: 2026-01-24
---

# Fix Vercel pnpm ENOTDIR Error

## Problem

`ERR_PNPM_ENOTDIR` occurs when pnpm tries to rename temporary files during dependency installation on Vercel. Root causes:

1. **File system race conditions** on Vercel's build environment
2. **Symlink complexity** with `shamefully-hoist=true`
3. **Existing node_modules** - `apps/mobile/node_modules` exists locally but shouldn't be processed on Vercel
4. **No cleanup** - custom install script doesn't clean before install

## Current Setup Analysis

- `scripts/vercel-install.cjs` - Excludes mobile from workspace by modifying pnpm-workspace.yaml
- `.npmrc` - Has `shamefully-hoist=true` causing symlink complexity
- `pnpm-workspace.yaml` - Includes `apps/*` and `packages/*`
- `apps/mobile/node_modules` - **EXISTS** locally (confirmed), should be ignored on Vercel

## Solution Strategy

### Phase 1: Clean Install (Primary Fix)
**Goal:** Remove existing node_modules and force clean install

**Changes to `scripts/vercel-install.cjs`:**

```javascript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const workspacePath = path.join(__dirname, '..', 'pnpm-workspace.yaml');
const workspaceBackupPath = path.join(__dirname, '..', 'pnpm-workspace.yaml.backup');

// Backup and modify workspace to exclude mobile app
console.log('🔧 Configuring workspace for Vercel deployment...');

const workspaceContent = fs.readFileSync(workspacePath, 'utf8');
fs.writeFileSync(workspaceBackupPath, workspaceContent);

// Write workspace without mobile app
const minimalWorkspace = `packages:
  - packages/shared-types
  - packages/shared-ui
`;
fs.writeFileSync(workspacePath, minimalWorkspace);

// CLEAN UP: Remove mobile node_modules if exists
const mobileNodeModules = path.join(__dirname, '..', 'apps', 'mobile', 'node_modules');
if (fs.existsSync(mobileNodeModules)) {
  console.log('🧹 Removing apps/mobile/node_modules...');
  fs.rmSync(mobileNodeModules, { recursive: true, force: true });
}

try {
  // Install only web app dependencies with --force flag
  console.log('📦 Installing dependencies...');
  execSync('pnpm install --no-frozen-lockfile --ignore-scripts --no-strict-peer-dependencies --force', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
} finally {
  // Restore original workspace
  fs.writeFileSync(workspacePath, fs.readFileSync(workspaceBackupPath, 'utf8'));
  fs.unlinkSync(workspaceBackupPath);
  console.log('✅ Workspace restored');
}
```

**Key changes:**
1. Added cleanup of `apps/mobile/node_modules` before install
2. Added `--force` flag to pnpm install command

### Phase 2: Reduce Symlink Complexity (Secondary Optimization)

**Changes to `.npmrc`:**

```ini
engine-strict=true
node-linker=hoisted
# Allow peer dependency conflicts for React 18/19 coexistence
strict-peer-dependencies=false
# Hoist Next.js and its dependencies for Vercel deployment
public-hoist-pattern[]=*
# DISABLE shamefully-hoist to reduce symlink complexity on Vercel
# shamefully-hoist=true
```

**Key change:**
- Comment out `shamefully-hoist=true` to reduce symlink complexity
- Keep `node-linker=hoisted` for compatibility

### Phase 3: Add .vercelignore (Prevent Upload)

Create `.vercelignore` file:

```
# Ignore mobile app files from Vercel deployment
apps/mobile/
# Ignore other mobile build artifacts
*.ipa
*.apk
```

## Implementation Steps

### Step 1: Update Install Script (15 min)
- [ ] Edit `scripts/vercel-install.cjs`
- [ ] Add mobile node_modules cleanup
- [ ] Add `--force` flag to pnpm install

### Step 2: Optimize .npmrc (5 min)
- [ ] Edit `.npmrc`
- [ ] Comment out `shamefully-hoist=true`

### Step 3: Create .vercelignore (5 min)
- [ ] Create `.vercelignore` file
- [ ] Add mobile app exclusion

### Step 4: Local Testing (20 min)
- [ ] Run install script locally: `node scripts/vercel-install.cjs`
- [ ] Verify web app builds: `pnpm build --filter=web`
- [ ] Check no mobile dependencies in web node_modules

### Step 5: Vercel Deployment & Verification (15 min)
- [ ] Commit changes
- [ ] Push to remote
- [ ] Monitor Vercel build logs
- [ ] Verify deployment succeeds

## Verification Checklist

After deployment, verify:

- [ ] Build completes without ENOTDIR error
- [ ] Web app deploys successfully
- [ ] Web app functions correctly in production
- [ ] No mobile dependencies in web build
- [ ] Build time is reasonable (<5 min for install)

## Fallback Options

If primary solution fails, try in order:

### Fallback A: Use Vercel's Built-in Install
```json
{
  "buildCommand": "pnpm build --filter=web",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install --no-frozen-lockfile --filter=web --no-strict-peer-dependencies",
  "framework": null
}
```
Remove custom install script entirely.

### Fallback B: Pre-build Dependencies
Use `pnpm fetch` + cache strategy in vercel.json

### Fallback C: Switch to npm (Last Resort)
Change package manager to npm for Vercel deployment only

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking local dev | Low | Medium | Changes only affect Vercel |
| Increased build time | Low | Low | Force flag may slow slightly |
| Dependency conflicts | Medium | High | Keep `no-strict-peer-dependencies` |
| Mobile app affected | None | None | Changes isolated to Vercel |

## Success Criteria

1. ✅ Vercel build completes without errors
2. ✅ ENOTDIR error is eliminated
3. ✅ Web app functions correctly
4. ✅ Build time remains acceptable

## Unresolved Questions

- None
