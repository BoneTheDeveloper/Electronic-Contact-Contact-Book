# Phase 01: Student Dashboard Simplification

## Context
- **Parent Plan:** [plan.md](./plan.md)
- **Dependencies:** None (can run parallel with Phase 02-03)
- **Docs:** [researcher-01-student-ui-report.md](./research/researcher-01-student-ui-report.md)

## Parallelization Info
**Can run concurrently with:** Phase 02, Phase 03
**File Overlap Risk:** None (exclusive ownership of student Dashboard.tsx)

## Overview
- **Date:** 2026-01-23
- **Description:** Simplify student dashboard to match wireframe design (remove sections, add gradient header)
- **Priority:** P2 (High)
- **Implementation Status:** Pending
- **Review Status:** Pending

## Key Insights

From research report:
1. Dashboard has unnecessary sections (stats, assignments) not in wireframe
2. Header needs gradient background instead of solid color
3. Typography adjustments needed for icon labels
4. Navigation already correct, no changes needed

## Requirements

### 1. Remove Unnecessary Sections
- Delete `statsSection` component (lines 172-189 in current Dashboard.tsx)
- Delete `assignmentsSection` component (lines 191-227)
- Keep only: header + service icons grid

### 2. Update Header Design
- Change from solid `colors.primary` to gradient: `linear-gradient(135deg, #0284C7 0%, #0369A1 100%)`
- Ensure student info matches wireframe:
  - Avatar initials: white text, black font
  - Name: white, xl font-bold
  - Class: blue-100, uppercase, text-xs
- Notification bell: red badge showing count

### 3. Typography & Spacing
- Icon labels: `text-[10px] font-black uppercase`
- Header padding: `pt-16` (64px)
- Grid spacing: `gap-y-12` (48px vertical)
- Bottom padding: `pb-32` (128px)

### 4. Icon Grid Validation
- Size: `w-20 h-20` (80x80)
- Border radius: `rounded-[28px]`
- Colors already match wireframe (verified)

## Architecture

**Component Structure:**
```
Dashboard.tsx
├── Header (with gradient)
│   ├── Student info
│   └── Notification bell
└── ServiceIconGrid (3x3)
    └── 9 service icons
```

**No state changes needed** - this is purely visual/UI refactoring.

## Related Code Files

**Primary File (Exclusive Ownership):**
- `apps/mobile/src/screens/student/Dashboard.tsx`
  - ONLY phase that modifies this file
  - Remove statsSection and assignmentsSection
  - Update header background gradient
  - Adjust typography and spacing

**Supporting Files (Read-only verification):**
- `apps/mobile/src/theme/colors.ts` - Verify color constants (NO MODIFICATIONS)
- `apps/mobile/src/components/ui/Icon.tsx` - Check icon rendering (NO MODIFICATIONS)

## File Ownership

**This Phase EXCLUSIVELY Owns:**
- ✅ `apps/mobile/src/screens/student/Dashboard.tsx` (FULL OWNERSHIP)

**Read-Only Access:**
- `apps/mobile/src/theme/colors.ts` (verify only, Phase 02 handles updates)
- `apps/mobile/src/components/ui/Icon.tsx` (verify only)

## Implementation Steps

1. **Backup Current Dashboard**
   - Create copy for reference: `Dashboard.tsx.bak`

2. **Remove Sections**
   - Delete statsSection rendering code (lines 172-189)
   - Delete assignmentsSection rendering code (lines 191-227)
   - Remove related imports if any

3. **Update Header**
   - Replace solid background with LinearGradient
   - Import LinearGradient from react-native-linear-gradient (if not already)
   - Apply gradient: `colors={{ start: '#0284C7', end: '#0369A1' }}` with angle 135deg
   - Verify styling matches wireframe specs

4. **Adjust Typography**
   - Update icon label styles to `text-[10px] font-black uppercase`
   - Ensure proper line height (14px) and letter spacing (0.5px)

5. **Update Spacing**
   - Set header padding to `pt-16`
   - Set grid vertical spacing to `gap-y-12`
   - Set bottom scroll padding to `pb-32`

6. **Test Rendering**
   - Verify 3x3 grid displays correctly
   - Check gradient header appearance
   - Ensure no layout issues
   - Confirm removed sections don't cause errors

## Todo List

- [ ] 1.1 Backup current Dashboard.tsx
- [ ] 1.2 Remove statsSection component
- [ ] 1.3 Remove assignmentsSection component
- [ ] 1.4 Update header to gradient background
- [ ] 1.5 Adjust icon label typography
- [ ] 1.6 Update spacing (pt-16, gap-y-12, pb-32)
- [ ] 1.7 Test rendering in simulator
- [ ] 1.8 Verify against wireframe screenshot

## Success Criteria

✅ Dashboard shows only header + 3x3 service icon grid
✅ Header has gradient background (#0284C7 to #0369A1, 135deg)
✅ Icon labels use text-[10px] font-black uppercase
✅ Spacing matches wireframe (pt-16, gap-y-12, pb-32)
✅ No TypeScript errors
✅ No runtime errors
✅ Visual match to wireframe design

## Conflict Prevention

**How this phase avoids conflicts:**
- **Exclusive file ownership:** Only Phase 01 modifies student/Dashboard.tsx
- **No theme changes:** Colors read-only (Phase 02 handles theme updates)
- **No navigation changes:** Tabs handled by Phase 03
- **No parent screens:** All parent files handled by other phases

**Risk Mitigation:**
- If Phase 02 changes theme colors, verify Dashboard.tsx still works correctly
- Gradient colors hardcoded in this file (not dependent on theme)

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| LinearGradient not installed | Low | Medium | Verify package exists, add if needed |
| Breaking student navigation | Low | High | Navigation structure unchanged, only styling |
| Typography doesn't match wireframe | Medium | Low | Use exact Tailwind classes from wireframe |
| Spacing issues on different screen sizes | Medium | Low | Test on multiple screen sizes |

## Security Considerations

- No security changes (UI-only update)
- No data handling changes
- No authentication logic affected
- Ensure gradient values are hardcoded (no user input)

## Next Steps

1. **After Phase 01 Complete:**
   - Phase 04 can reference updated Dashboard.tsx as styling template
   - No dependencies on other phases

2. **Testing:**
   - Test on iOS simulator
   - Test on Android emulator
   - Compare against wireframe screenshot

3. **Integration:**
   - Phase 04 will use this as reference for shared screen styling
