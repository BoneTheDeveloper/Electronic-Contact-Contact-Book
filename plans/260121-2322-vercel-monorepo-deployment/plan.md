# Vercel Monorepo Deployment Fix

**Date**: 2026-01-21
**Priority**: High
**Status**: In Progress

## Overview

Fix Vercel deployment to deploy only `@apps/web` from monorepo, removing `cd` commands and leveraging Vercel's native monorepo support.

## Problem

Current `vercel.json` uses inefficient `cd` commands:
- `"installCommand": "cd apps/web && pnpm install"`
- `"buildCommand": "cd apps/web && pnpm build"`

This breaks workspace dependency resolution and doesn't leverage Vercel's monorepo optimizations.

## Solution

Use `rootDirectory` configuration at repository root:

```json
{
  "framework": "nextjs",
  "rootDirectory": "apps/web"
}
```

Let Vercel auto-detect `installCommand`, `buildCommand`, and `outputDirectory` from `apps/web/package.json`.

## Phases

| Phase | Status | Link |
|-------|--------|------|
| 01. Root vercel.json fix | Pending | [phase-01-root-vercel-json.md](phase-01-root-vercel-json.md) |

## Reports

- [Research Report](../reports/researcher-260121-2319-vercel-monorepo-deployment.md)
- [Scout Report](../reports/scout-260121-2319-vercel-config-files.md)

## Success Criteria

- [ ] Vercel deploys only `apps/web` from monorepo
- [ ] No `cd` commands in build configuration
- [ ] Workspace dependencies resolve correctly
- [ ] Build succeeds on Vercel
