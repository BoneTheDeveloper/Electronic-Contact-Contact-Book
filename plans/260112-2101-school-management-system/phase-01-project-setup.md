---
title: "Phase 01: Project Setup & Monorepo Configuration"
description: "Initialize monorepo with mobile, web, and shared packages"
status: completed
priority: P1
effort: 2h
created: 2026-01-12
completed: 2026-01-12
---

# Phase 01: Project Setup & Monorepo Configuration

## Context Links
- Parent: [plan.md](./plan.md)
- Research: [mobile-architecture](./research/researcher-mobile-architecture.md) | [web-architecture](./research/researcher-web-architecture.md)
- Docs: [tech-stack](../../docs/tech-stack.md) | [design-guidelines](../../docs/design-guidelines.md)

## Parallelization Info
- **Can run with**: None (must run first)
- **Must complete before**: All phases (02A-02C, 03-05)
- **Output dependencies**: Shared types package consumed by all other phases

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 (Foundation) |
| Status | Pending |
| Description | Initialize Turborepo monorepo with package structure |
| Review Status | Not Started |

## Key Insights
- Turborepo preferred over Nx for simpler setup
- Shared types prevent interface drift between apps
- ESLint/Prettier config must be consistent across packages

## Requirements
- Node.js 18+ LTS
- pnpm 8+ (for workspace efficiency)
- Git initialized with .gitignore for React Native

## Architecture

### Directory Structure
```
electric_contact_book/
├── apps/
│   ├── mobile/           # Expo app (Parent + Student)
│   └── web/              # Next.js app (Admin + Teacher)
├── packages/
│   ├── database/         # Prisma schema
│   ├── shared-ui/        # Shared React components
│   ├── shared-types/     # TypeScript types
│   └── tsconfig/         # Shared TS config
├── turbo.json
├── pnpm-workspace.yaml
└── package.json (root)
```

### Package Graph
```
mobile ──> shared-types ──> tsconfig
mobile ──> shared-ui ──────> tsconfig

web ────> shared-types ───> tsconfig
web ────> shared-ui ───────> tsconfig
web ────> database ────────> tsconfig
```

## File Ownership

### Files to Create
| File | Owner |
|------|-------|
| `turbo.json` | Phase 01 |
| `pnpm-workspace.yaml` | Phase 01 |
| `package.json` (root) | Phase 01 |
| `apps/mobile/package.json` | Phase 01 |
| `apps/web/package.json` | Phase 01 |
| `packages/shared-types/package.json` | Phase 01 |
| `packages/tsconfig/package.json` | Phase 01 |
| `packages/tsconfig/base.json` | Phase 01 |
| `.eslintrc.js` (root) | Phase 01 |
| `.prettierrc` (root) | Phase 01 |

### Files to Modify
| File | Change |
|------|--------|
| `package.json` (existing) | Merge with root package.json |

## Implementation Steps

1. **Initialize Turborepo**
   ```bash
   npx create-turbo@latest
   # Select "Basic" template
   # Use pnpm as package manager
   ```

2. **Create Workspace Config**
   ```yaml
   # pnpm-workspace.yaml
   packages:
     - 'apps/*'
     - 'packages/*'
   ```

3. **Setup Root Package**
   ```json
   {
     "name": "school-management-monorepo",
     "private": true,
     "scripts": {
       "dev": "turbo run dev",
       "build": "turbo run build",
       "lint": "turbo run lint",
       "clean": "turbo run clean && rm -rf node_modules"
     },
     "devDependencies": {
       "turbo": "^1.11.0",
       "typescript": "^5.3.3"
     }
   }
   ```

4. **Configure Turbo**
   ```json
   {
     "$schema": "https://turbo.build/schema.json",
     "pipeline": {
       "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
       "dev": { "cache": false, "persistent": true }
     }
   }
   ```

5. **Create Shared Types Package**
   ```bash
   mkdir -p packages/shared-types/src
   ```

6. **Create Shared TSConfig**
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true
     }
   }
   ```

7. **Setup ESLint/Prettier**
   - Create root `.eslintrc.js`
   - Create `.prettierrc` with single quotes, no semicolons

## Todo List
- [ ] Initialize Turborepo
- [ ] Create workspace config
- [ ] Setup root package.json
- [ ] Create apps/mobile directory
- [ ] Create apps/web directory
- [ ] Create packages/shared-types
- [ ] Create packages/tsconfig
- [ ] Configure turbo.json
- [ ] Setup ESLint
- [ ] Setup Prettier
- [ ] Verify `pnpm install` works

## Success Criteria
- `pnpm install` completes without errors
- `turbo build --dry-run` shows all packages
- Shared types package can be imported by apps
- ESLint/Prettier configs load in all packages

## Conflict Prevention
- No file overlap with other phases (initial setup only)
- Other phases reference packages by name, not path

## Risk Assessment
| Risk | Mitigation |
|------|-----------|
| pnpm workspace issues | Use exact pnpm version in CI |
| TypeScript config conflicts | Single source of truth in tsconfig package |
| Path resolution issues | Use workspace protocol (`workspace:*`) |

## Security Considerations
- No external dependencies yet
- Configure `.gitignore` for sensitive files
- Setup npm audit script

## Next Steps
- Phase 02A (Mobile Core) - consumes shared-types
- Phase 02B (Web Core) - consumes shared-types
- Phase 02C (Database) - consumes shared-types
