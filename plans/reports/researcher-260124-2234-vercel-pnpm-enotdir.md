# pnpm ENOTDIR Error Research Report for Vercel Monorepo Deployment

## Error Summary

- **Error**: `ERR_PNPM_ENOTDIR: not a directory, rename '/vercel/path0/apps/mobile/node_modules/@typescript-eslint/parser_tmp_75' -> '/vercel/path0/apps/mobile/node_modules/@typescript-eslint/parser'`
- **Context**: Occurs during `pnpm install` on Vercel deployment
- **Setup**: pnpm workspace monorepo with custom install script excluding mobile app

## Root Causes

### 1. **File System Race Conditions on Vercel**
- The ENOTDIR error occurs when pnpm tries to rename a temporary file (`_tmp_75`) to final location
- Vercel's ephemeral file system has race conditions between pnpm's parallel processes
- The tmp file exists but the rename operation fails because the target is not recognized as a directory

### 2. **Symlink Issues with Hoisting Configuration**
- Using both `node-linker=hoisted` and `shamefully-hoist=true` creates complex symlink scenarios
- Vercel's build environment may not handle symlinks consistently, especially with hoisted dependencies
- The combination can cause file system operations to fail during dependency installation

### 3. **Custom Install Script Limitations**
- Current script backs up/restores workspace configuration but doesn't handle node_modules properly
- The `apps/mobile/node_modules` may still exist or be partially constructed when install runs
- pnpm tries to modify node_modules while the script is manipulating workspace config

### 4. **Vercel Environment Constraints**
- Vercel's containerized environment has specific file system limitations
- Build processes run with restricted permissions and timing
- Concurrent operations can interfere with each other

## Recommended Solutions

### Immediate Fixes

#### 1. **Modify Install Command with Additional Flags**
```bash
// Update scripts/vercel-install.cjs line 24
pnpm install --no-frozen-lockfile --ignore-scripts --no-strict-peer-dependencies --force
```

#### 2. **Clean Node Modules Before Install**
Add cleanup before install step:
```javascript
// In scripts/vercel-install.cjs before execSync
console.log('🧹 Cleaning existing node_modules...');
const webNodeModules = path.join(__dirname, '..', 'apps', 'web', 'node_modules');
if (fs.existsSync(webNodeModules)) {
  fs.rmSync(webNodeModules, { recursive: true, force: true });
}
```

#### 3. **Configure .npmrc for Vercel**
```bash
// Update .npmrc to reduce symlink complexity
node-linker=hoisted
shamefully-hoist=false  # Disable shamefully-hoist to avoid symlink issues
public-hoist-pattern[]=next
public-hoist-pattern[]=react
public-hoist-pattern[]=react-dom
```

### Advanced Solutions

#### 4. **Alternative Install Strategy**
```json
// In vercel.json
{
  "installCommand": "cd apps/web && pnpm install --no-frozen-lockfile --ignore-scripts"
}
```

#### 5. **Use npm for Vercel Deployment**
If pnpm continues to fail:
```json
// In vercel.json
{
  "installCommand": "cd apps/web && npm install"
}
```

#### 6. **Pre-build Dependencies**
Install dependencies before deployment:
```bash
# Install web dependencies only
cd apps/web && pnpm install
```

## Verification Steps

1. **Test locally**:
   ```bash
   cd apps/web
   pnpm install --no-frozen-lockfile --ignore-scripts --force
   ```

2. **Check pnpm version**:
   ```bash
   pnpm --version
   # Should be v9.x.x (avoid v10+ for now)
   ```

3. **Test workspace configuration**:
   ```bash
   # Verify workspace excludes mobile
   node scripts/vercel-install.cjs
   ```

## Example Fixes from Similar Issues

### Fix 1: Symlink Resolution
From [pnpm issue #3601](https://github.com/pnpm/pnpm/issues/3601):
```bash
# Use absolute symlinks
node-linker=hoisted
symlink=false
```

### Fix 2: Vercel Build Timeout
From [Vercel community discussion](https://community.vercel.com/t/err-pnpm-enotempty-enotempty-directory-not-empty-rmdir/15313):
```json
{
  "builds": [
    {
      "src": "apps/web/**/*.js",
      "use": "@vercel/static-build",
      "config": {
        "distDir": ".next"
      }
    }
  ]
}
```

### Fix 3: Dependency Hoisting Control
From [pnpm docs](https://pnpm.io/npmrc):
```bash
# Control hoisting to reduce conflicts
node-linker=hoisted
shamefully-hoist=false
public-hoist-pattern[]=@types/*
public-hoist-pattern[]=eslint
```

## Unresolved Questions

1. Should we completely abandon pnpm for Vercel deployments?
2. Are there specific Next.js 15 compatibility issues with pnpm?
3. Would using a different file system hoisting strategy help?

## Next Steps

1. Implement the immediate fixes (force flag + cleanup)
2. Test deployment on Vercel
3. If issues persist, try npm fallback approach
4. Monitor for performance impact of changes