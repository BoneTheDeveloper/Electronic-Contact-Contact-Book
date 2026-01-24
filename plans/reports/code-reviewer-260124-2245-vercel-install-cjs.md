# Code Review Report: scripts/vercel-install.cjs

**Date**: 2026-01-24
**Reviewer**: code-reviewer subagent
**File**: scripts/vercel-install.cjs

---

## Scope

- Files reviewed: `scripts/vercel-install.cjs`
- Lines of code analyzed: 54 lines
- Review focus: Error handling improvements for mobile node_modules cleanup
- Review type: Re-review after implementing error handling

---

## Overall Assessment

Code quality improved significantly with error handling. Logging format standardized. However, **critical issue found**: script fails with ENOENT error due to incomplete cleanup of React Native artifacts. Error handling improvements are adequate for surface-level issues but don't address root cause.

---

## Critical Issues

### 1. ENOENT Error from Incomplete Cleanup (CRITICAL)
**Location**: Lines 26, cleanup logic
**Impact**: Script execution fails, deployment broken

```
ERR_PNPM_ENOENT  ENOENT: no such file or directory, scandir 'C:\Project\electric_contact_book\node_modules\@react-native\virtualized-lists_tmp_14804\node_modules'
```

**Root Cause**: Removing `apps/mobile/node_modules` is insufficient. React Native creates temporary artifacts in root `node_modules` with `_tmp_` suffix. These persist after cleanup, causing pnpm to fail.

**Fix Required**:
```javascript
// CLEAN UP: Remove ALL React Native artifacts (mobile + root temp files)
const mobileNodeModules = path.join(__dirname, '..', 'apps', 'mobile', 'node_modules');
const rootNodeModules = path.join(__dirname, '..', 'node_modules');

// 1. Remove mobile node_modules
if (fs.existsSync(mobileNodeModules)) {
  console.log('[cleanup] Removing apps/mobile/node_modules...');
  try {
    fs.rmSync(mobileNodeModules, { recursive: true, force: true });
  } catch (error) {
    console.error('[error] Failed to remove mobile node_modules:', error.message);
  }
}

// 2. Remove React Native temp artifacts from root node_modules
if (fs.existsSync(rootNodeModules)) {
  console.log('[cleanup] Scanning for React Native temp artifacts...');
  const entries = fs.readdirSync(rootNodeModules, { withFileTypes: true });
  const tmpDirs = entries
    .filter(e => e.isDirectory() && e.name.includes('_tmp_'))
    .map(e => path.join(rootNodeModules, e.name));

  if (tmpDirs.length > 0) {
    console.log(`[cleanup] Found ${tmpDirs.length} temp directories, removing...`);
    tmpDirs.forEach(dir => {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch (error) {
        console.error(`[error] Failed to remove ${dir}:`, error.message);
      }
    });
  } else {
    console.log('[cleanup] No temp artifacts found');
  }
}
```

---

## High Priority Findings

### 1. Missing Error Handling for Workspace Restoration
**Location**: Lines 50-51, finally block
**Impact**: If restoration fails, workspace remains in modified state

**Current Code**:
```javascript
} finally {
  fs.writeFileSync(workspacePath, fs.readFileSync(workspaceBackupPath, 'utf8'));
  fs.unlinkSync(workspaceBackupPath);
  console.log('[setup] Workspace configuration restored');
}
```

**Issue**: No try-catch, no verification that restoration succeeded

**Recommended Fix**:
```javascript
} finally {
  try {
    if (fs.existsSync(workspaceBackupPath)) {
      fs.writeFileSync(workspacePath, fs.readFileSync(workspaceBackupPath, 'utf8'));
      fs.unlinkSync(workspaceBackupPath);
      console.log('[setup] Workspace configuration restored');
    }
  } catch (error) {
    console.error('[error] Failed to restore workspace:', error.message);
    console.error('[error] Manual intervention required - workspace still modified');
  }
}
```

### 2. No Validation of Critical File Operations
**Location**: Lines 11-12, workspace backup
**Impact**: Silent failure if backup cannot be created

**Current Code**:
```javascript
const workspaceContent = fs.readFileSync(workspacePath, 'utf8');
fs.writeFileSync(workspaceBackupPath, workspaceContent);
```

**Recommended Fix**:
```javascript
try {
  const workspaceContent = fs.readFileSync(workspacePath, 'utf8');
  fs.writeFileSync(workspaceBackupPath, workspaceContent);
  console.log('[setup] Workspace configuration backed up');
} catch (error) {
  console.error('[error] Failed to backup workspace:', error.message);
  console.error('[error] Cannot proceed safely');
  process.exit(1);
}
```

---

## Medium Priority Improvements

### 1. Verification Logic Redundant
**Location**: Lines 27-31
**Observation**: Verification after `rmSync` with `force: true` is redundant - `force` already suppresses ENOENT, so existence check is nearly impossible unless filesystem race

**Recommendation**: Simplify to:
```javascript
fs.rmSync(mobileNodeModules, { recursive: true, force: true });
console.log('[cleanup] Cleanup completed');
```

### 2. Error Context Incomplete
**Location**: Line 34
**Issue**: Only logs `error.message`, missing stack trace or full error details

**Recommended**:
```javascript
console.error('[error] Failed to remove mobile node_modules:');
console.error('  - Path:', mobileNodeModules);
console.error('  - Error:', error.message);
if (error.code) console.error('  - Code:', error.code);
```

---

## Low Priority Suggestions

### 1. Logging Consistency
**Observation**: Good improvement - removed emojis, added `[type]` prefixes
**Status**: ✓ Pass

### 2. Documentation
**Issue**: No inline comments explaining WHY cleanup is needed
**Recommendation**: Add comment block at top of script:
```javascript
/**
 * Vercel Install Script
 *
 * Purpose: Install only web dependencies for Vercel deployment
 *
 * Why exclude mobile?
 * - Vercel doesn't build React Native apps
 * - Mobile deps cause pnpm workspace conflicts
 * - Mobile deps create temp artifacts in root node_modules
 *
 * Process:
 * 1. Backup workspace
 * 2. Create minimal workspace (web only)
 * 3. Clean mobile artifacts (node_modules + temp files)
 * 4. Run pnpm install with --force
 * 5. Restore original workspace
 */
```

---

## Positive Observations

- ✓ Error handling structure (try-catch) correctly implemented
- ✓ Verification logic demonstrates careful thinking
- ✓ Warning logs allow graceful degradation
- ✓ Logging format standardized (no emojis, clear prefixes)
- ✓ Comments explain cleanup purpose
- ✓ Code structure logical and readable

---

## Recommended Actions

1. **[CRITICAL]** Implement full cleanup (mobile + temp artifacts) - see Critical Issue #1
2. **[HIGH]** Add error handling to workspace restoration finally block
3. **[HIGH]** Validate workspace backup creation before proceeding
4. **[MEDIUM]** Simplify verification logic (redundant with force: true)
5. **[MEDIUM]** Enhance error context (path, code, stack)
6. **[LOW]** Add script documentation header

---

## Test Results

**Execution**: ✗ FAILED
**Error**: `ERR_PNPM_ENOENT` - React Native temp artifacts not cleaned
**Root Cause**: Incomplete cleanup implementation
**Status**: Script broken, must fix Critical Issue #1

---

## Updated Score: 6.5/10

**Breakdown**:
- Error handling structure: 8/10 (good, but incomplete)
- Logging format: 9/10 (excellent improvement)
- Code readability: 8/10 (clear logic)
- Error recovery: 5/10 (present but inadequate for root cause)
- Documentation: 4/10 (minimal)
- **Overall: 6.5/10** (improved from 5/10, but still not functional)

**Previous Score**: 5/10
**Delta**: +1.5 (good progress on error handling, but critical ENOENT issue remains)

---

## Unresolved Questions

1. Should script exit with error code if cleanup fails? (Currently continues with warning)
2. Is `--force` flag in pnpm install masking other issues? (Consider using `--force` only for cleanup failures)
3. Should we add `--ignore-engines` to pnpm install for Vercel compatibility?
4. Why does React Native create temp artifacts in root node_modules? (Architectural question)

---

**Next Steps**: Implement Critical Issue #1 fix for React Native temp artifacts cleanup before testing again.
