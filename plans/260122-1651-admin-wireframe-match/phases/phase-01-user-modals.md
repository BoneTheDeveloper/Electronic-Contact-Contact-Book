# Phase 01: User Management Modals

**Parent Plan**: [plan.md](../plan.md)
**Dependencies**: [Phase 00](phase-00-shared-infrastructure.md)
**Parallel With**: Phase 02, Phase 03

## Context Links
- Wireframe: `docs/wireframe/Web_app.Admin/user-management.html`
- Research: `../research/researcher-user-academic-report.md`
- Implementation: `apps/web/components/admin/users/UsersManagement.tsx`

## Parallelization Info

| Aspect | Details |
|--------|---------|
| **Can Run Parallel With** | Phase 02 (Academic), Phase 03 (Payment) |
| **Must Wait For** | Phase 00 (Shared Infrastructure) |
| **Blocks** | None (independent feature) |
| **Conflicts With** | None (separate files) |

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-22 |
| Description | Implement Add/Edit User, User Actions, Link Parent, Import Excel modals |
| Priority | P1 |
| Implementation Status | pending |
| Review Status | pending |

## Key Insights

1. Wireframe uses **single modal with role tabs** (not 3 separate modals)
2. User code auto-generation: `[PREFIX][YEAR][####]` (HS2026, GV2026, PH2026)
3. Parent-student linking is many-to-many with "primary contact" flag
4. Import Excel needs template download + file validation

## Requirements

### 1. AddUserModal (Single Modal, Role Tabs)
**Fields per role:**
- **Student**: name, dob, gender, grade (6-9), class, enrollmentDate
- **Teacher**: name, phone, email, subject specialization
- **Parent**: name, phone (as login), email (for receipts)

**Auto-generated codes:**
- Student: `HS2026` + sequence
- Teacher: `GV2026` + sequence
- Parent: `PH2026` + sequence

**Account settings:**
- Send password via SMS/Email (checkbox)
- Force password change on first login (checkbox)

### 2. UserActionsModal (Slide-in Actions)
- Reset password (send new via SMS/Email)
- Lock/Unlock account (toggle)
- Manage trusted devices
- Edit user (opens edit form)
- Link parent (student only, opens link modal)
- Delete user (with confirmation)

### 3. LinkParentModal
- Search parent by phone/code
- Select relationship (father/mother/guardian)
- Set primary contact flag
- Display linked student info

### 4. ImportExcelModal
- Drag-drop file upload
- Template download button
- Column validation
- Progress indicator
- Error summary

## Architecture

```
users/
├── modals/
│   ├── AddUserModal.tsx        # Role-based form with tabs
│   ├── UserActionsModal.tsx    # Action buttons + sub-modals
│   ├── LinkParentModal.tsx     # Parent linking search
│   └── ImportExcelModal.tsx    # File upload + validation
└── UsersManagement.tsx         # Main table + triggers
```

## Related Code Files (Exclusive Ownership)

### Files to Modify
```
apps/web/components/admin/users/
└── UsersManagement.tsx          # ADD: Modal triggers, action buttons
```

### Files to Create (Phase 01 only)
```
apps/web/components/admin/users/modals/
├── AddUserModal.tsx
├── UserActionsModal.tsx
├── LinkParentModal.tsx
└── ImportExcelModal.tsx
```

### Files to Read (Not Modify)
- `apps/web/lib/mock-data.ts` (User type definitions)
- `apps/web/components/admin/shared/*` (BaseModal, buttons, forms)

## File Ownership

| File | Owner | Phase |
|------|-------|-------|
| `users/modals/AddUserModal.tsx` | Phase 01 | 01 (only) |
| `users/modals/UserActionsModal.tsx` | Phase 01 | 01 (only) |
| `users/modals/LinkParentModal.tsx` | Phase 01 | 01 (only) |
| `users/modals/ImportExcelModal.tsx` | Phase 01 | 01 (only) |
| `users/UsersManagement.tsx` | Phase 01 | 01 (modifies only) |

## Implementation Steps

1. **Create `users/modals/` directory** (2min)

2. **Implement AddUserModal** (90min)
   - Set up role tab state
   - Create role-specific form sections
   - Implement auto-code generation logic
   - Add form validation (react-hook-form)
   - Wire up to `POST /api/users` (mock if missing)

3. **Implement UserActionsModal** (45min)
   - Create action button grid
   - Implement reset password function
   - Implement lock/unlock toggle
   - Add delete confirmation
   - Wire up to `PUT /api/users/:id/*` endpoints

4. **Implement LinkParentModal** (40min)
   - Create parent search input
   - Implement search results display
   - Add relationship selection
   - Add primary contact toggle
   - Wire up to `POST /api/users/:studentId/parents`

5. **Implement ImportExcelModal** (35min)
   - Create drag-drop zone
   - Add template download button
   - Implement file validation (.xlsx/.xls)
   - Add progress indicator
   - Wire up to `POST /api/users/import`

6. **Update UsersManagement.tsx** (30min)
   - Add "Add User" button → open AddUserModal
   - Add row actions menu → open UserActionsModal
   - Add "Import Excel" button → open ImportExcelModal
   - Update table columns to include actions

## Todo List

- [ ] Create `users/modals/` directory
- [ ] Implement AddUserModal with role tabs
- [ ] Implement UserActionsModal with action grid
- [ ] Implement LinkParentModal with search
- [ ] Implement ImportExcelModal with drag-drop
- [ ] Update UsersManagement.tsx with modal triggers
- [ ] Test all modals open/close correctly
- [ ] Test form validation
- [ ] Test API calls (or mock responses)

## Success Criteria

1. AddUserModal switches between 3 role forms
2. Auto-generated codes follow pattern: `[PREFIX][YEAR][####]`
3. UserActionsModal shows all 6 actions
4. LinkParentModal searches and selects parents
5. ImportExcelModal accepts .xlsx files
6. No console errors during modal flow

## Conflict Prevention

- **No other phases** create files in `users/modals/`
- **No other phases** modify `UsersManagement.tsx`
- Use `BaseModal` from Phase 00 (don't create own modal wrapper)
- Import types from `lib/mock-data.ts` (don't redefine)

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| API routes missing | Mock responses in component, flag with `// TODO: API` |
| Code collision | Use sequence counter from API (fallback to local counter) |
| File upload validation | Use `xlsx` library for .xlsx validation |
| Parent search performance | Debounce search input (300ms) |

## Security Considerations

- Sanitize file uploads (accept .xlsx/.xls only)
- Validate phone number format (Vietnam: +84 or 0...)
- Rate limit password reset
- Log all user actions (delete, lock, reset)

## API Integration Points

```
POST   /api/users                 # Create user
PUT    /api/users/:id             # Update user
DELETE /api/users/:id             # Delete user
POST   /api/users/:id/reset-password   # Reset password
PUT    /api/users/:id/lock        # Lock/unlock
POST   /api/users/:id/parents     # Link parent
POST   /api/users/import          # Bulk import
GET    /api/parents?search=       # Search parents
```

## Next Steps

After Phase 01 completes:
1. UsersManagement.tsx has full CRUD
2. Phase 04 validates user workflows end-to-end

---

**Estimated Effort**: 4 hours
**Parallelizable**: Yes (with Phase 02, 03)
