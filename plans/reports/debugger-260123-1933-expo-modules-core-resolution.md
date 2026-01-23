# iOS Bundling Failure: expo-modules-core Resolution Error

**Date**: 2026-01-23
**Issue**: Metro bundler unable to resolve `expo-modules-core` in pnpm monorepo
**Severity**: High - Blocks iOS development builds

## Executive Summary

**Root Cause**: pnpm's strict dependency isolation prevents `expo` package from accessing `expo-modules-core` dependency, which is listed as a dependency in `expo`'s package.json but not physically located in `expo`'s isolated `node_modules` directory within the `.pnpm` store.

**Impact**: iOS bundling fails immediately, preventing any development builds

**Fix Priority**: Critical - Required for development

**Solution**: Add `node-linker=hoisted` to `.npmrc` to use traditional hoisted dependency structure

---

## Technical Analysis

### Error Timeline

1. **Initialization**: `expo start --clear` invoked
2. **Bundling**: Metro attempts to bundle `apps/mobile/index.js`
3. **Import Chain**:
   ```
   apps/mobile/index.js
   → imports "expo"
   → expo/src/Expo.ts
   → imports "expo-modules-core" ❌
   ```
4. **Failure**: Metro cannot resolve `expo-modules-core` from expo's context

### Module Resolution Path

Metro's resolver searches in these locations (from error message):
```
node_modules\.pnpm\expo@54.0.32_...\node_modules\expo\node_modules
node_modules\.pnpm\expo@54.0.32_...\node_modules
node_modules\.pnpm\node_modules
node_modules
```

**Actual structure found**:
```
apps/mobile/node_modules/expo → symlink to
node_modules/.pnpm/expo@54.0.32_.../node_modules/expo/

expo package.json declares:
  "expo-modules-core": "3.0.29"

But expo-modules-core is NOT in:
  node_modules/.pnpm/expo@54.0.32_.../node_modules/expo/node_modules/
```

**Instead, expo-modules-core is at**:
```
apps/mobile/node_modules/expo-modules-core → symlink to
node_modules/.pnpm/expo-modules-core@3.0.29_.../node_modules/expo-modules-core/
```

### pnpm Dependency Isolation Issue

**Current Configuration** (pnpm default):
```yaml
# pnpm-workspace.yaml
packages:
  - apps/*
  - packages/*

# .npmrc
engine-strict=true
```

**Problem**:
- pnpm uses **isolated installation** by default
- Each package in `.pnpm` store gets ONLY its declared dependencies
- `expo` expects `expo-modules-core` to be resolvable via Node's module resolution
- Metro bundler follows Node's resolution but hits pnpm's isolation boundary

**Evidence**:
```bash
$ ls node_modules/.pnpm/expo@54.0.32_.../node_modules/expo/node_modules/
# empty - no expo-modules-core

$ pnpm list expo-modules-core
# shows it's installed in mobile app, not in expo's context
```

---

## Root Cause

### Primary Issue

**pnpm's strict dependency isolation** + **Metro's module resolution** = **FAILURE**

Expo SDK 54 packages expect traditional Node.js module resolution (hoisted dependencies), but pnpm's default isolated installation prevents this:

1. `expo/src/Expo.ts` imports: `import ... from 'expo-modules-core'`
2. Metro resolves from `expo` package location in `.pnpm` store
3. Metro searches `expo/node_modules/` - **EMPTY** (pnpm isolation)
4. Metro searches parent directories - **STOPPED** by pnpm's symlink structure
5. Resolution fails

### Contributing Factors

1. **Metro Configuration**: Current config uses default resolver which doesn't account for pnpm's structure
2. **No hoisting**: Project uses pnpm's default `node-linker` (isolated)
3. **SDK 54 changes**: Expo SDK 54 has improved monorepo support but assumes certain dependency structures

### Why This Works in Standard Projects

Standard (non-monorepo) projects with pnpm:
- Have flatter node_modules structure
- pnpm creates symlinks that Metro can follow
- All dependencies accessible from root

Monorepo with pnpm:
- Multiple workspace packages
- Each package has isolated dependencies in `.pnpm` store
- Metro's resolution chain breaks at package boundaries

---

## Recommended Solutions

### Solution 1: Enable Hoisted Installation (RECOMMENDED)

**File**: `.npmrc` (root)

**Change**:
```diff
  engine-strict=true
+ node-linker=hoisted
```

**Rationale**:
- Matches Expo's expectations for dependency structure
- Minimal configuration change
- Officially recommended by Expo for monorepos with issues
- Maintains compatibility with workspace protocol

**Steps**:
1. Add `node-linker=hoisted` to `.npmrc`
2. Remove `node_modules` and `pnpm-lock.yaml`: `rm -rf node_modules pnpm-lock.yaml apps/*/node_modules`
3. Reinstall: `pnpm install`
4. Clear Metro cache: `npx expo start --clear`

**Trade-offs**:
- ✅ Simple fix
- ✅ Expo-approved
- ✅ No Metro config changes needed
- ⚠️ Loses pnpm's strict isolation benefits
- ⚠️ Slightly larger disk usage (duplicated deps)

---

### Solution 2: Custom Metro Resolver (ALTERNATIVE)

**File**: `apps/mobile/metro.config.js`

**Change**:
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add pnpm workspace resolution
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
  // Add all workspace node_modules
  path.resolve(__dirname, '../../apps/web/node_modules'),
  path.resolve(__dirname, '../../apps/server/node_modules'),
];

config.watchFolders = [__dirname];
config.resolver.blockList = /(.*\.next\/.*|.*\/apps\/(web|server)\/.*)/;

module.exports = config;
```

**Rationale**:
- Explicitly tells Metro where to find modules
- Maintains pnpm isolation
- More granular control

**Trade-offs**:
- ✅ Keeps pnpm isolation
- ⚠️ More complex
- ⚠️ May need updates when adding workspaces
- ⚠️ Not tested with all Expo packages

---

### Solution 3: Move expo-modules-core to Root (WORKAROUND)

**File**: Root `package.json`

**Change**:
```diff
{
  "dependencies": {
+   "expo-modules-core": "^3.0.29"
  }
}
```

**Rationale**:
- Ensures expo-modules-core is accessible to all packages
- Root dependencies are always resolvable

**Trade-offs**:
- ✅ Quick workaround
- ⚠️ Not a proper fix (shouldn't need direct deps)
- ⚠️ May need other Expo SDK deps too
- ⚠️ Version management issues

---

## Implementation Plan

### Immediate Fix (Solution 1)

**Priority**: Critical
**Time**: 5 minutes

1. Update `.npmrc`:
   ```bash
   echo "node-linker=hoisted" >> .npmrc
   ```

2. Clean install:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   rm -rf apps/*/node_modules
   pnpm install
   ```

3. Verify structure:
   ```bash
   ls apps/mobile/node_modules/expo/node_modules/
   # Should see expo-modules-core
   ```

4. Test bundling:
   ```bash
   cd apps/mobile
   npx expo start --clear
   ```

### Validation

After fix, confirm:

1. **Module Resolution**:
   ```bash
   $ node -e "console.log(require.resolve('expo-modules-core'))"
   # Should return valid path
   ```

2. **Metro Bundling**:
   ```bash
   $ npx expo export --platform ios
   # Should complete without errors
   ```

3. **iOS Build**:
   ```bash
   $ npx expo run:ios
   # Should build and launch
   ```

---

## Additional Recommendations

### 1. Monitor Expo SDK 54 Updates

Expo is actively improving monorepo support. Watch for:
- Better pnpm isolation support
- Metro resolver improvements
- Documentation updates

**Track**: [Expo SDK 54 Changelog](https://expo.dev/changelog/sdk-54)

### 2. Consider Public-Hoist Patterns

If keeping isolated pnpm, add to `.npmrc`:

```diff
  engine-strict=true
+ node-linker=hoisted
+ public-hoist-pattern[]=*expo*
+ public-hoist-pattern[]=*react-native*
```

This hoists only Expo/React Native packages while keeping others isolated.

### 3. Document Monorepo Setup

Update docs with working configuration:

```markdown
## Monorepo Setup

This project uses pnpm workspaces with Expo SDK 54.

### Important Configuration

`.npmrc` must include:
```
node-linker=hoisted
```

This ensures Expo packages can resolve their dependencies correctly.
```

---

## Prevention

### Pre-commit Checks

Add to `package.json`:

```json
{
  "scripts": {
    "preinstall": "cat .npmrc | grep -q 'node-linker=hoisted' || (echo 'ERROR: node-linker=hoisted required in .npmrc' && exit 1)"
  }
}
```

### Documentation

Add to `README.md`:

```markdown
## Development Setup

1. Install dependencies: `pnpm install`
2. **Important**: This project requires `node-linker=hoisted` in `.npmrc`
3. Start mobile: `cd apps/mobile && expo start`
```

---

## Unresolved Questions

1. **Why does Expo package.json declare expo-modules-core as dependency if it's expected to be hoisted?**
   - May be for documentation/tools, actual resolution relies on hoisting

2. **Will future Expo SDK versions support isolated pnpm installations?**
   - Expo team aware, actively working on improvements

3. **Are there other Expo packages with similar resolution issues?**
   - May discover when bundling completes (expo-dev-client, etc.)

4. **Does this affect Android builds too?**
   - Likely yes, same Metro bundler used

---

## References

- [Expo Monorepos Guide](https://docs.expo.dev/guides/monorepos/)
- [GitHub Issue: Monorepo broken in SDK 54.0.19](https://github.com/expo/expo/issues/40539)
- [GitHub Issue: pnpm not working with Expo](https://github.com/expo/expo/issues/22413)
- [pnpm node-linker documentation](https://pnpm.io/npmrc#node-linker)

---

**Report Generated**: 2026-01-23
**Debugger Subagent**: 9ded5fca
**Status**: Root cause identified, fix provided
