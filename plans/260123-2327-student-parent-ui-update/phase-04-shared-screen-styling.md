# Phase 04: Shared Screen Styling

## Context
- **Parent Plan:** [plan.md](./plan.md)
- **Dependencies:** Phase 01, 02, 03 (must run AFTER these complete)
- **Docs:** [researcher-01-student-ui-report.md](./research/researcher-01-student-ui-report.md), [researcher-02-parent-ui-report.md](./research/researcher-02-parent-ui-report.md)

## Parallelization Info
**Must run SEQUENTIALLY AFTER:** Phase 01, 02, 03
**Cannot run in parallel** (depends on theme/colors from Phase 02, styling patterns from Phase 01)

## Overview
- **Date:** 2026-01-23
- **Description:** Apply consistent styling to shared parent/student screens using patterns from Phase 01-03
- **Priority:** P2 (High)
- **Implementation Status:** Pending
- **Review Status:** Pending

## Key Insights

From research reports:
1. Shared screen names exist in both parent/student folders
2. Currently have different implementations (Tailwind vs StyleSheet)
3. Need consistent styling based on updated theme
4. Reference Phase 01 student Dashboard as styling template

## Requirements

### 1. Shared Screen Consistency
Screens existing in both parent and student:
- Schedule
- Grades
- Attendance
- Teacher Feedback
- Leave Request
- News
- Summary

### 2. Styling Standards (from Phase 01-03)
- Use `theme.colors.primary` for headers/buttons
- Use gradient from Phase 01: `linear-gradient(135deg, #0284C7 0%, #0369A1 100%)`
- Typography: `text-[10px] font-black uppercase` for labels
- Spacing: Match Phase 01 patterns
- Card styling: Consistent across all screens

### 3. Parent-Specific Screens
Apply same styling patterns to:
- Teacher Directory (parent only)
- Payment Overview/Method (parent only)
- Messages (parent only)

### 4. Student-Specific Screens
- Study Materials (student only) - apply same patterns
- Payment (student only) - apply same patterns

## Architecture

**Screen Styling Pattern:**
```
Each Screen
├── Header (gradient from Phase 01)
│   ├── Title (white, xl font-bold)
│   └── Back button if applicable
├── Content Area
│   ├── Cards (shadow-md, rounded-lg)
│   ├── Lists (consistent spacing)
│   └── Typography (standardized)
└── Bottom spacing (pb-32 for nav clearance)
```

**Theme Usage:**
```typescript
import { theme } from '../../theme/colors';
// Use theme.colors.primary for all primary actions
// Use theme.colors.secondary for gradients
// Use grade colors from Phase 02
```

## Related Code Files

**Primary Files (Exclusive Ownership):**
- `apps/mobile/src/screens/parent/Schedule.tsx`
- `apps/mobile/src/screens/parent/Grades.tsx`
- `apps/mobile/src/screens/parent/Attendance.tsx`
- `apps/mobile/src/screens/parent/TeacherFeedback.tsx`
- `apps/mobile/src/screens/parent/LeaveRequest.tsx`
- `apps/mobile/src/screens/parent/News.tsx`
- `apps/mobile/src/screens/parent/Summary.tsx`
- `apps/mobile/src/screens/parent/TeacherDirectory.tsx`
- `apps/mobile/src/screens/parent/PaymentOverview.tsx`
- `apps/mobile/src/screens/parent/PaymentMethod.tsx`
- `apps/mobile/src/screens/parent/Messages.tsx`
- `apps/mobile/src/screens/parent/ChatDetail.tsx`
- `apps/mobile/src/screens/parent/Notifications.tsx`
- `apps/mobile/src/screens/parent/ChildSelection.tsx`

**Student Screens (Verify/Update):**
- `apps/mobile/src/screens/student/Schedule.tsx`
- `apps/mobile/src/screens/student/Grades.tsx`
- `apps/mobile/src/screens/student/Attendance.tsx`
- `apps/mobile/src/screens/student/TeacherFeedback.tsx`
- `apps/mobile/src/screens/student/LeaveRequest.tsx`
- `apps/mobile/src/screens/student/News.tsx`
- `apps/mobile/src/screens/student/Summary.tsx`
- `apps/mobile/src/screens/student/StudyMaterials.tsx`
- `apps/mobile/src/screens/student/Payment.tsx`

**Reference Files (Read-only):**
- `apps/mobile/src/screens/student/Dashboard.tsx` - Reference for styling patterns (Phase 01 owns this)
- `apps/mobile/src/theme/colors.ts` - Use theme from Phase 02
- `apps/mobile/src/navigation/ParentTabs.tsx` - Reference nav styling (Phase 03 owns this)
- `apps/mobile/src/navigation/StudentTabs.tsx` - Reference nav styling (Phase 03 owns this)

## File Ownership

**This Phase EXCLUSIVELY Owns:**
- ✅ All parent screens EXCEPT Dashboard.tsx (Phase 02 owns Dashboard)
- ✅ All student screens EXCEPT Dashboard.tsx (Phase 01 owns Dashboard)

**Read-Only Access:**
- `apps/mobile/src/screens/student/Dashboard.tsx` (reference only, Phase 01 owns)
- `apps/mobile/src/screens/parent/Dashboard.tsx` (reference only, Phase 02 owns)
- `apps/mobile/src/theme/colors.ts` (reference only, Phase 02 owns)
- `apps/mobile/src/navigation/*.tsx` (reference only, Phase 03 owns)

## Implementation Steps

1. **Reference Phase 01 Dashboard**
   - Read updated student/Dashboard.tsx (from Phase 01)
   - Extract styling patterns (header, cards, typography)
   - Document gradient usage
   - Note spacing patterns

2. **Apply to Parent Screens (Batch 1 - Shared)**
   For each shared screen (Schedule, Grades, Attendance, etc.):
   - Replace hardcoded #0284C7 with theme.colors.primary
   - Add gradient header if missing
   - Update typography to match Phase 01 patterns
   - Standardize card styling
   - Ensure consistent spacing

3. **Apply to Parent Screens (Batch 2 - Parent-Only)**
   For parent-specific screens (TeacherDirectory, Payment*, Messages):
   - Apply same styling patterns
   - Ensure theme usage
   - Match card designs
   - Standardize headers

4. **Verify Student Screens**
   For all student screens (except Dashboard):
   - Verify using theme.colors.primary
   - Check header consistency
   - Ensure card styling matches
   - Update if inconsistent

5. **Create Shared Components (Optional)**
   - If many screens use same header, create Header component
   - If many use same card style, create Card component
   - Follow DRY principle (but avoid over-engineering - YAGNI)

6. **Test All Screens**
   - Navigate to each screen from parent app
   - Navigate to each screen from student app
   - Verify styling consistency
   - Check for visual regressions
   - Ensure no TypeScript errors

## Todo List

- [ ] 4.1 Read Phase 01 Dashboard.tsx for styling patterns
- [ ] 4.2 Document styling standards from Phase 01-03
- [ ] 4.3 Update parent/Schedule.tsx
- [ ] 4.4 Update parent/Grades.tsx (use grade colors from Phase 02)
- [ ] 4.5 Update parent/Attendance.tsx
- [ ] 4.6 Update parent/TeacherFeedback.tsx
- [ ] 4.7 Update parent/LeaveRequest.tsx
- [ ] 4.8 Update parent/News.tsx
- [ ] 4.9 Update parent/Summary.tsx
- [ ] 4.10 Update parent/TeacherDirectory.tsx
- [ ] 4.11 Update parent/PaymentOverview.tsx
- [ ] 4.12 Update parent/PaymentMethod.tsx
- [ ] 4.13 Update parent/Messages.tsx
- [ ] 4.14 Verify student/Schedule.tsx
- [ ] 4.15 Verify student/Grades.tsx
- [ ] 4.16 Verify student/Attendance.tsx
- [ ] 4.17 Verify student/TeacherFeedback.tsx
- [ ] 4.18 Verify student/LeaveRequest.tsx
- [ ] 4.19 Verify student/News.tsx
- [ ] 4.20 Verify student/Summary.tsx
- [ ] 4.21 Verify student/StudyMaterials.tsx
- [ ] 4.22 Verify student/Payment.tsx
- [ ] 4.23 Test all parent screens
- [ ] 4.24 Test all student screens
- [ ] 4.25 Final consistency check

## Success Criteria

✅ All parent screens use theme.colors.primary (no hardcoded colors)
✅ All student screens use theme.colors.primary (no hardcoded colors)
✅ Shared screens (Schedule, Grades, etc.) have consistent styling
✅ All screens use gradient header pattern from Phase 01
✅ Typography matches Phase 01 patterns
✅ Card styling consistent across all screens
✅ Spacing consistent across all screens
✅ No TypeScript errors
✅ Visual consistency between parent/student versions
✅ No merge conflicts with Phase 01-03

## Conflict Prevention

**How this phase avoids conflicts:**
- **Sequential execution:** Runs AFTER Phase 01-03 complete
- **Different files:** Doesn't modify Dashboard (Phase 01/02) or navigation (Phase 03)
- **Reference-only:** Reads from Phase 01-03 files, doesn't modify them
- **Exclusive ownership:** Only this phase modifies non-Dashboard screens

**Risk Mitigation:**
- Phase 02 may have added new grade colors - use them in Grades screen
- Phase 01 header pattern - apply consistently but don't modify Dashboard.tsx
- Phase 03 navigation patterns - ensure screens work with updated tabs

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking screen functionality | Medium | High | Test each screen thoroughly after updates |
| Inconsistent styling application | High | Medium | Create checklist, review each screen |
| Over-engineering shared components | Medium | Low | Follow YAGNI - only extract if truly repeated |
| Merge conflicts with Phase 01-03 | Low | Medium | Sequential execution prevents this |
| Visual regression | Medium | Medium | Compare before/after screenshots |

## Security Considerations

- No security changes (styling-only update)
- No data handling changes
- No authentication logic affected
- Ensure no user input in styling values

## Next Steps

1. **After Phase 04 Complete:**
   - All mobile UI screens are consistent
   - Theme system fully integrated
   - Parent/student apps have unified look

2. **Testing:**
   - Full integration test of parent app
   - Full integration test of student app
   - Cross-reference with wireframe designs
   - User acceptance testing

3. **Documentation:**
   - Document styling patterns for future screens
   - Create component library guide if shared components created
   - Update development guidelines

4. **Future Work:**
   - Consider creating comprehensive UI kit
   - Add storybook for component testing
   - Document theming system

## Dependencies on Other Phases

**Phase 04 DEPENDS ON:**
- **Phase 01:** For header gradient pattern and styling reference
- **Phase 02:** For updated theme colors and grade colors
- **Phase 03:** For navigation styling compatibility

**Phase 04 must NOT:**
- Modify student/Dashboard.tsx (Phase 01 owns this)
- Modify parent/Dashboard.tsx (Phase 02 owns this)
- Modify navigation files (Phase 03 owns these)
- Modify theme/colors.ts (Phase 02 owns this)
