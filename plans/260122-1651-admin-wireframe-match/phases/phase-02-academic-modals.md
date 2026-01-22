# Phase 02: Academic Structure Modals

**Parent Plan**: [plan.md](../plan.md)
**Dependencies**: [Phase 00](phase-00-shared-infrastructure.md)
**Parallel With**: Phase 01, Phase 03

## Context Links
- Wireframe: `docs/wireframe/Web_app.Admin/academic-structure.html`
- Research: `../research/researcher-user-academic-report.md`
- Implementation: `apps/web/components/admin/classes/AcademicStructure.tsx`

## Parallelization Info

| Aspect | Details |
|--------|---------|
| **Can Run Parallel With** | Phase 01 (User), Phase 03 (Payment) |
| **Must Wait For** | Phase 00 (Shared Infrastructure) |
| **Blocks** | None (independent feature) |
| **Conflicts With** | None (separate files) |

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-22 |
| Description | Implement Year/Grade/Class/Subject CRUD modals with teacher assignment |
| Priority | P1 |
| Implementation Status | pending |
| Review Status | pending |

## Key Insights

1. Wireframe has **3 tabs**: Years, Classes, Subjects
2. Classes view needs **grade sidebar** + class grid with capacity progress
3. Teacher assignment includes **homeroom teacher** (GVCN) + subject teachers
4. Structure differs from implementation: Wireframe uses tree view, code uses simple tabs

## Requirements

### 1. Year Management (Tab 1)
- Add/Edit Year modal
- Fields: name (e.g., "2025-2026"), startDate, endDate
- Semester configuration: HK1 dates, HK2 dates
- Toggle "current year" (only one active)

### 2. Class Management (Tab 2)
- Add/Edit Class modal
- Fields: name (6A, 6B...), room, maxStudents, homeroomTeacher
- Grade selection (6, 7, 8, 9)
- Capacity tracking with progress bar
- Delete class (with confirmation)

### 3. Subject Management (Tab 3)
- Add/Edit Subject modal
- Fields: code (TOAN, VAN...), name, periodsPerWeek, category, coefficient
- Categories: Tự nhiên, Xã hội, Ngoại ngữ, Kỹ thuật, Năng khiếu
- Delete subject (with confirmation)

### 4. Teacher Assignment (Integrated into Class Modal)
- Homeroom teacher selection
- Subject teacher assignments (multi-select)
- Display current assignments

## Architecture

```
classes/
├── modals/
│   ├── AddYearModal.tsx         # Year + semester config
│   ├── AddClassModal.tsx        # Class + teacher assignment
│   ├── AddSubjectModal.tsx      # Subject + category
│   └── EditClassModal.tsx       # Edit existing class
└── AcademicStructure.tsx        # Main tabs + triggers
```

## Related Code Files (Exclusive Ownership)

### Files to Modify
```
apps/web/components/admin/classes/
└── AcademicStructure.tsx         # ADD: Modal triggers, refresh handlers
```

### Files to Create (Phase 02 only)
```
apps/web/components/admin/classes/modals/
├── AddYearModal.tsx
├── AddClassModal.tsx
├── AddSubjectModal.tsx
└── EditClassModal.tsx
```

### Files to Read (Not Modify)
- `apps/web/lib/mock-data.ts` (Class/Subject type definitions)
- `apps/web/components/admin/shared/*` (BaseModal, buttons, forms)

## File Ownership

| File | Owner | Phase |
|------|-------|-------|
| `classes/modals/AddYearModal.tsx` | Phase 02 | 02 (only) |
| `classes/modals/AddClassModal.tsx` | Phase 02 | 02 (only) |
| `classes/modals/AddSubjectModal.tsx` | Phase 02 | 02 (only) |
| `classes/modals/EditClassModal.tsx` | Phase 02 | 02 (only) |
| `classes/AcademicStructure.tsx` | Phase 02 | 02 (modifies only) |

## Implementation Steps

1. **Create `classes/modals/` directory** (2min)

2. **Implement AddYearModal** (40min)
   - Create year name + date range inputs
   - Add semester date sections
   - Implement "current year" toggle
   - Add form validation (end > start)
   - Wire up to `POST /api/years`

3. **Implement AddClassModal** (60min)
   - Create class name + room inputs
   - Add grade selection dropdown (6, 7, 8, 9)
   - Add max students input
   - Add homeroom teacher dropdown (from `/api/teachers`)
   - Add capacity preview (progress bar)
   - Wire up to `POST /api/classes`

4. **Implement AddSubjectModal** (35min)
   - Create subject code + name inputs
   - Add category dropdown
   - Add periods/week input
   - Add coefficient input
   - Wire up to `POST /api/subjects`

5. **Implement EditClassModal** (50min)
   - Similar to AddClassModal but pre-populated
   - Add current students display
   - Add warning if reducing capacity below current
   - Wire up to `PUT /api/classes/:id`

6. **Update AcademicStructure.tsx** (40min)
   - Add "Add Year" button → open AddYearModal
   - Add "Add Class" button → open AddClassModal
   - Add "Add Subject" button → open AddSubjectModal
   - Add edit button on class cards → open EditClassModal
   - Add delete button on subjects
   - Implement refresh handler (for after modal save)

## Todo List

- [ ] Create `classes/modals/` directory
- [ ] Implement AddYearModal with semester config
- [ ] Implement AddClassModal with teacher assignment
- [ ] Implement AddSubjectModal with categories
- [ ] Implement EditClassModal with capacity warning
- [ ] Update AcademicStructure.tsx with modal triggers
- [ ] Test all modals open/close correctly
- [ ] Test form validation
- [ ] Test API calls (or mock responses)
- [ ] Test capacity progress bar calculation

## Success Criteria

1. AddYearModal saves year + semester dates
2. AddClassModal shows teacher dropdown + capacity preview
3. AddSubjectModal validates subject code uniqueness
4. EditClassModal warns when capacity < current students
5. No console errors during modal flow

## Conflict Prevention

- **No other phases** create files in `classes/modals/`
- **No other phases** modify `AcademicStructure.tsx`
- Use `BaseModal` from Phase 00
- Import types from `lib/mock-data.ts`

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| API routes missing | Mock responses in component |
| Teacher list not loaded | Fallback to static list in modal |
| Subject code collision | Validate code uniqueness before submit |
| Capacity tracking sync | Re-fetch class data after edit |

## Security Considerations

- Validate room number format
- Validate maxStudents range (10-50)
- Restrict homeroom teacher assignment to active teachers
- Log all structural changes (year/class/subject CRUD)

## API Integration Points

```
POST   /api/years                 # Create year
PUT    /api/years/:id             # Update year
POST   /api/classes               # Create class
PUT    /api/classes/:id           # Update class
DELETE /api/classes/:id           # Delete class
POST   /api/subjects              # Create subject
PUT    /api/subjects/:id          # Update subject
DELETE /api/subjects/:id          # Delete subject
GET    /api/teachers?active=      # Get active teachers for dropdown
```

## Next Steps

After Phase 02 completes:
1. AcademicStructure.tsx has full CRUD
2. Phase 04 validates academic workflows end-to-end

---

**Estimated Effort**: 4 hours
**Parallelizable**: Yes (with Phase 01, 03)
