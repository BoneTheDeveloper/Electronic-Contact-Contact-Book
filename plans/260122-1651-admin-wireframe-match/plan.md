---
title: "Admin UI Wireframe Match - Full Implementation"
description: "Implement missing admin UI features to match wireframes exactly"
status: pending
priority: P1
effort: 16h
branch: master
tags: [admin, ui, wireframe, parallel]
created: 2026-01-22
---

## Overview

Implement missing admin UI features to match wireframes exactly. This plan adds 6 modals, CRUD operations, and enhanced workflows across 3 feature domains: User Management, Academic Structure, and Payment/Invoice tracking.

### Scope

| Feature | Missing Components | Files to Modify |
|---------|-------------------|-----------------|
| User Management | Add/Edit User Modal, User Actions Modal, Link Parent Modal, Import Excel Modal | `UsersManagement.tsx` + 4 new modal files |
| Academic Structure | Year/Grade/Class/Subject CRUD modals, Teacher Assignment | `AcademicStructure.tsx` + 5 new modal files |
| Payment/Invoice | Fee Item Add/Edit, Payment Confirm, Invoice Detail, Send Reminder, Export | `PaymentsManagement.tsx`, `FeeAssignmentWizard.tsx` + 6 new modal files |

### Dependency Graph

```
Phase 00: Shared Components (Foundation)
    ↓
Phase 01: User Management Modals ────┐
Phase 02: Academic Structure Modals ├───→ Phase 04: Integration & Testing
Phase 03: Payment/Invoice Modals ────┘
```

### Parallelization Strategy

**Group A - Parallel Execution (Phases 01-03)**
- Independent feature domains
- Separate file ownership (no overlaps)
- Shared components from Phase 00

**Group B - Sequential (Phase 04)**
- Integration testing
- Cross-feature validation
- End-to-end workflows

### File Ownership Matrix

| Phase | Owner | Files (Exclusive) |
|-------|-------|-------------------|
| 00 | fullstack-developer | `shared/modals/BaseModal.tsx`, `shared/modals/ModalContext.tsx` |
| 01 | fullstack-developer | `users/modals/*`, `UsersManagement.tsx` |
| 02 | fullstack-developer | `academic/modals/*`, `AcademicStructure.tsx` |
| 03 | fullstack-developer | `payments/modals/*`, `PaymentsManagement.tsx` |
| 04 | fullstack-developer | Integration tests, API route updates |

## Execution Strategy

1. **Phase 00**: Build shared modal infrastructure (0.5h)
2. **Phase 01-03**: Execute in parallel by 3 agents (4h each)
3. **Phase 04**: Integration and testing (1.5h)

**Total Time**: ~16h (parallelizable to 6h with 3 agents)

---

## Phase Files

- [Phase 00: Shared Modal Infrastructure](phase-00-shared-infrastructure.md)
- [Phase 01: User Management Modals](phase-01-user-modals.md)
- [Phase 02: Academic Structure Modals](phase-02-academic-modals.md)
- [Phase 03: Payment/Invoice Modals](phase-03-payment-modals.md)
- [Phase 04: Integration & Testing](phase-04-integration-testing.md)

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| API route missing | High | Mock in component, flag for API |
| File conflicts | Medium | Strict ownership matrix |
| State sync issues | Medium | Use React Query for cache |
| Design token drift | Low | Use existing tokens in `shared/buttons` |

---

## Validation Summary

**Validated:** 2026-01-22
**Questions asked:** 4

### Confirmed Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| User Modal Design | **Single modal with tabs** | Cleaner UX, matches wireframe pattern |
| API Strategy | **Mock in components** | Faster iteration, flag with `// TODO: API` comments |
| Permission System | **Admin only** | Secure - only admins can confirm payments/send reminders |
| Data Refresh | **Refresh on close** | Simpler state management, refresh tables after modal closes |

### Action Items
- [x] Update Phase 01 to use single modal with role tabs
- [x] Add `// TODO: API` comments for missing endpoints
- [x] Add permission check: `user.role === 'admin'` for payment actions
- [x] Implement refresh callback pattern: `onSuccess` triggers table refresh

---

## Unresolved Questions

*All previously unresolved questions have been addressed through validation.*
