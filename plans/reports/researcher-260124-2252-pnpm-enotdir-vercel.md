# pnpm ENOTDIR Error on Vercel Deployment - Research Report

## Root Cause Explanation

The pnpm ENOTDIR error on Vercel deployment occurs due to several interconnected issues:

### 1. **Symlink Handling Issues**
- pnpm's default `isolated` linker uses symlinks from a virtual store at `node_modules/.pnpm`
- Vercel's build environment can have permission/symlink limitations that cause ENOTDIR errors
- The error "rename tmp file -> directory" suggests a conflict when pnpm tries to create symlinks but existing files block the operation

### 2. **Package Manager Version Mismatch**
- Vercel detects pnpm version from `pnpm-lock.yaml` `lockfileVersion`
- Corepack (when enabled) uses the `packageManager` field in `package.json`
- Version mismatches between local and Vercel cause dependency resolution failures

### 3. **Monorepo Build Context**
- Vercel sometimes runs `pnpm install` in individual app folders instead of monorepo root
- This breaks workspace dependencies and causes symlink resolution failures
- Mobile apps (Expo/React Native) have different dependency structures that can trigger conflicts

### 4. **Shamefully-Hoist Configuration**
- Default pnpm structure is semistrict - allows internal access but blocks external access
- Some tools require full hoisting (`shamefully-hoist=true`)
- Hoisting can cause file system conflicts on Vercel's build system

## Recommended .npmrc Configuration for Vercel

### Root .npmrc (monorepo level)
```ini
# Use hoisted linker for better Vercel compatibility
node-linker=hoisted

# Enable shamefully hoist for tools that require flat node_modules
shamefully-hoist=true

# Ensure strict peer dependencies
strict-peer-dependencies=false

# Disable package manager strict mode
package-manager-strict=false

# Set workspace protocol
save-workspace-protocol=true

# Store configuration
store-dir=.pnpm-store
```

### App-specific .npmrc (for web app)
```ini
node-linker=hoisted
shamefully-hoist=true
```

### Mobile app .npmrc (if needed)
```ini
# Mobile apps may need different configuration
node-linker=isolated
shamefully-hoist=false
```

## Vercel-Specific Configuration Needed

### 1. vercel.json
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build --filter=!mobile",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "github": {
    "silent": true
  }
}
```

### 2. .vercelignore
```
# Exclude mobile app from deployment
apps/mobile/
packages/mobile/
```

### 3. Corepack Configuration
- Ensure `packageManager` field in root package.json:
  ```json
  {
    "packageManager": "pnpm@9.x.x"
  }
  ```
- Run `corepack enable` in local development

## Solutions for Excluding Mobile Apps from Vercel Builds

### 1. Using pnpm Filter Syntax
```json
// vercel.json
"buildCommand": "pnpm build --filter=!@org/mobile"
```

### 2. Separate Projects
- Configure web app as separate Vercel project
- Point root directory to `apps/web`
- Exclude mobile apps entirely

### 3. Multi-Project Deployment
```json
// vercel.json (multi-project setup)
{
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next.js",
      "dist": "apps/web/.next"
    }
  ]
}
```

### 4. Conditional Scripts
```json
// package.json
"scripts": {
  "build:vercel": "pnpm build --filter=!mobile"
}
```

## Alternative Approaches

### 1. Switch to npm for Vercel Deployment
- Temporarily switch to npm for Vercel builds only
- Use `npm install` in `vercel.json` installCommand
- Keep pnpm for local development

### 2. Use Turborepo
- Configure Turborepo for monorepo builds
- Define pipelines that exclude mobile apps
- Use Turborepo's caching on Vercel

### 3. Separate Git Branches
- Deploy web app from main branch
- Keep mobile app in separate branch
- Configure Vercel to deploy from specific branch

### 4. Use Docker Build
- Create custom Dockerfile for pnpm setup
- Build in isolated environment
- Deploy artifact instead of source

## Additional Recommendations

### Vercel Environment Variables
```bash
ENABLE_EXPERIMENTAL_COREPACK=1
PNPM_VERSION=9.x.x
```

### pnpm Version Pinning
- Pin pnpm version in package.json
- Use `corepack use pnpm@9.12.0` to ensure consistency
- Test locally before deploying

### Build Debugging
- Use `vercel build --debug` for detailed logs
- Check build container Node.js version
- Verify pnpm version in build logs

## Unresolved Questions

1. Does the hoisted linker impact performance on Vercel?
2. Are there specific pnpm versions that work better with Vercel's Windows containers?
3. How does Expo's Metro bundler interact with pnpm's hoisted configuration?

## Sources

- [pnpm node-linker documentation](https://pnpm.io/npmrc#node-linker)
- [Vercel Package Managers Documentation](https://vercel.com/docs/package-managers)
- [pnpm Symlink Issues](https://github.com/pnpm/pnpm/issues/7690)
- [Vercel + pnpm Monorepo Guide](https://medium.com/@brianonchain/monorepo-using-pnpm-and-deploying-to-vercel-0490e244d9fc)
- [Corepack Configuration](https://vercel.com/docs/package-managers#corepack)