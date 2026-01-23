---
title: "Parent-Child Selection Implementation"
description: "Implement real parent-child relationship database, API integration, and child selection UI"
status: pending
priority: P1
effort: 6h
branch: master
tags: [mobile, parent, database, api, ui]
created: 2026-01-23
---

## Overview

Implement real parent-child selection functionality replacing mock data with actual database queries. This enables parents with multiple children to switch between child contexts in the mobile app.

**Current State:**
- UI components exist (`ChildSelection.tsx`, `Dashboard.tsx`)
- Parent store uses mock data
- `student_guardians` junction table exists but empty
- No API to fetch parent's children

**Target State:**
- Real parent-child relationships in database
- API queries fetch parent's children from Supabase
- Child selection persists across app sessions
- All parent screens filter data by selected child

## Phase Breakdown

| Phase | Description | Effort | Status |
|-------|-------------|--------|--------|
| [Phase 1: Database Setup](./phase-01-database-setup.md) | Create parent-child relationships | 1h | pending |
| [Phase 2: API Integration](./phase-02-api-integration.md) | Create Supabase queries | 1.5h | pending |
| [Phase 3: UI Integration](./phase-03-ui-integration.md) | Connect real data to UI | 2h | pending |
| [Phase 4: Testing](./phase-04-testing.md) | Test and validate | 1.5h | pending |

## Architecture Decisions

### Database Approach
**Decision:** Use `student_guardians` junction table exclusively
- Supports multiple guardians per student
- Better for future scalability
- More normalized schema

### Child Selection Persistence
**Decision:** Store in AsyncStorage
- Persists across app sessions
- Defaults to first child if none selected
- Updates on child switch

### API Strategy
**Decision:** Create mobile-side Supabase queries
- No backend API routes needed
- Direct Supabase client usage
- RLS policies for security

## Success Criteria

- [x] Test parent (0901234569) linked to 2+ students
- [x] `loadChildren()` fetches real data from Supabase
- [x] Child selection persists across app restarts
- [x] Dashboard displays correct child info
- [x] All parent screens filter by selected child
- [x] Tests pass: parent login, child switch, screen data

## Dependencies

- Supabase project configured
- Mobile auth working (parent login)
- Test data: parent profile (0901234569)

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Empty student_guardians table | High | Phase 1 populates sample data |
| RLS policies block access | Medium | Verify parent can query junction |
| Child selection not persisting | Medium | AsyncStorage verification |
| Mock data still being used | Low | Remove mock code in Phase 3 |

## Implementation Order

1. **Phase 1** - Database (foundation for all else)
2. **Phase 2** - API (enables data fetching)
3. **Phase 3** - UI (visible to users)
4. **Phase 4** - Testing (validates end-to-end)

## Unresolved Questions

1. Should we migrate existing `guardian_id` relationships to `student_guardians`? → Decision: Populate junction table with fresh test data for now
2. How to handle parent with no children? → Decision: Show empty state, prompt to contact admin
3. Should child selection sync across devices? → Decision: Out of scope (local-only for now)
