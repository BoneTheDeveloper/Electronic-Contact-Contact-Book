# Vercel Monorepo Deployment Research Report

## Current Problem Analysis

Current vercel.json configuration uses cd commands which:
- Are inefficient and not idiomatic for Vercel
- Don't leverage Vercel's monorepo optimizations
- Break dependency resolution for workspace packages
- Root package.json build script runs turbo build for all apps

## Recommended Approach

### 1. Use rootDirectory Configuration

Replace cd commands with rootDirectory:

```json
{
  "framework": "nextjs",
  "rootDirectory": "apps/web",
  "buildCommand": "pnpm build",
  "outputDirectory": ".next"
}
```

### 2. Create apps/web/vercel.json

Place vercel.json in apps/web with Next.js config:

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "outputDirectory": ".next"
}
```

### 3. Configure .vercel/project.json at Root

Ensure project-level configuration:

```json
{
  "orgId": "team_SP7FhTrPKbQNbVLmBI5vx2vP",
  "projectId": "prj_OUFspSn4gkNV0hboy5ir0JhIqMvd"
}
```

## Key Configuration Patterns

### rootDirectory vs buildCommand
- **rootDirectory**: Better for monorepos, Vercel understands workspace structure
- **buildCommand**: Use for app-specific builds when rootDirectory isn't possible

### Turborepo Integration
- Vercel automatically detects Turborepo
- Can run `turbo run build --filter=apps/web` from root
- Use `turbo.json` outputs configuration for build artifacts

### pnpm Workspace Configuration
- Vercel automatically detects pnpm workspaces
- Dependencies resolved correctly with workspace:*
- No need for cd commands in install/build commands

## Examples

### Optimal vercel.json (at root for apps/web deployment):
```json
{
  "framework": "nextjs",
  "rootDirectory": "apps/web",
  "buildCommand": "pnpm build",
  "outputDirectory": ".next"
}
```

### Alternative (apps/web/vercel.json):
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "outputDirectory": ".next"
}
```

### With Turbo (if needed):
```json
{
  "framework": "nextjs",
  "rootDirectory": "apps/web",
  "buildCommand": "cd ../.. && turbo run build --filter=apps/web",
  "outputDirectory": ".next"
}
```

## Benefits of rootDirectory Approach
1. Vercel understands monorepo structure natively
2. Proper workspace dependency resolution
3. Better caching and build optimization
4. Cleaner configuration without shell commands
5. Support for multiple apps from same monorepo

## Action Items
1. Move vercel.json to apps/web or update with rootDirectory
2. Remove cd commands from build/install commands
3. Ensure .vercel/project.json exists at root
4. Test deployment with single app build