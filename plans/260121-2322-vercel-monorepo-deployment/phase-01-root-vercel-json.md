# Phase 01: Root vercel.json Fix

**Date**: 2026-01-21
**Priority**: High
**Status**: Pending

## Context

- [Parent Plan](../260121-2322-vercel-monorepo-deployment/plan.md)
- [Research Report](../reports/researcher-260121-2319-vercel-monorepo-deployment.md)

## Overview

Simplify root `vercel.json` to use `rootDirectory` approach, removing `cd` commands.

## Current State

**File**: `C:\Project\electric_contact_book\vercel.json`
```json
{
  "framework": "nextjs",
  "installCommand": "cd apps/web && pnpm install",
  "buildCommand": "cd apps/web && pnpm build",
  "outputDirectory": "apps/web/.next"
}
```

**File**: `C:\Project\electric_contact_book\.vercel\project.json`
```json
{
  "projectId": "prj_wWSY13W2bB3x2AsgbFTVJyI0SlH0",
  "orgId": "team_SP7FhTrPKbQNbVLmBI5vx2vP",
  "settings": {
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "installCommand": "npm install --legacy-peer-deps"
  }
}
```

## Target State

**File**: `C:\Project\electric_contact_book\vercel.json`
```json
{
  "framework": "nextjs",
  "rootDirectory": "apps/web"
}
```

**File**: `C:\Project\electric_contact_book\.vercel\project.json`
```json
{
  "projectId": "prj_wWSY13W2bB3x2AsgbFTVJyI0SlH0",
  "orgId": "team_SP7FhTrPKbQNbVLmBI5vx2vP"
}
```

## Implementation Steps

1. Update `vercel.json` at repository root
2. Update `.vercel/project.json` to remove redundant settings
3. Commit and push changes
4. Verify Vercel deployment succeeds

## Todo List

- [ ] Update root `vercel.json` with rootDirectory configuration
- [ ] Clean up `.vercel/project.json` settings
- [ ] Test local build with `vercel build`
- [ ] Push to git and verify deployment

## Success Criteria

- [ ] `vercel.json` contains only `framework` and `rootDirectory`
- [ ] `.vercel/project.json` has no redundant `settings` key
- [ ] Vercel deployment builds only `apps/web`
- [ ] Build succeeds without errors
