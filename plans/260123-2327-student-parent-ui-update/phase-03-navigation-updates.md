# Phase 03: Navigation Updates

## Context
- **Parent Plan:** [plan.md](./plan.md)
- **Dependencies:** None (can run parallel with Phase 01-02)
- **Docs:** [researcher-02-parent-ui-report.md](./research/researcher-02-parent-ui-report.md)

## Parallelization Info
**Can run concurrently with:** Phase 01, Phase 02
**File Overlap Risk:** None (exclusive ownership of navigation files)

## Overview
- **Date:** 2026-01-23
- **Description:** Standardize tab bar styling between parent/student navigation
- **Priority:** P2 (High)
- **Implementation Status:** Pending
- **Review Status:** Pending

## Key Insights

From research report:
1. Parent has 3 tabs (Trang chủ, Tin nhắn, Cá nhân)
2. Student has 2 tabs (Trang chủ, Cá nhân) - correct per wireframe
3. Inconsistent color usage (hardcoded vs theme)
4. Need unified styling approach

## Requirements

### 1. Tab Bar Styling
- Standardize background: `bg-white/90 backdrop-blur-md`
- Use theme.colors.primary for active state
- Gray out inactive tabs
- Consistent icon sizing and spacing

### 2. Color Consistency
- ParentTabs: Replace hardcoded #0284C7 with theme.colors.primary
- StudentTabs: Verify using theme.colors.primary
- Ensure both use same color reference

### 3. Icon Styling
- Active tab: Colored icon (theme.colors.primary)
- Inactive tab: Gray icon
- Consistent SVG icon sizing
- Proper spacing between tabs

### 4. Tab Structure Verification
- Parent: 3 tabs (correct)
- Student: 2 tabs (correct)
- No structural changes needed

## Architecture

**Navigation Structure:**
```
RootNavigator
├── AuthNavigator (login screens)
└── MainNavigator
    ├── ParentTabs (3 tabs)
    │   ├── HomeStack
    │   ├── MessagesStack
    │   └── ProfileStack
    └── StudentTabs (2 tabs)
        ├── HomeStack
        └── ProfileStack
```

**Tab Bar Component:**
- Uses BottomTabNavigator from React Navigation
- Custom screenOptions for styling
- Icon component with color state management

## Related Code Files

**Primary Files (Exclusive Ownership):**
- `apps/mobile/src/navigation/ParentTabs.tsx`
  - ONLY phase that modifies this file
  - Update tab bar styling
  - Replace hardcoded colors with theme
  - Standardize icon rendering

- `apps/mobile/src/navigation/StudentTabs.tsx`
  - ONLY phase that modifies this file
  - Verify theme usage
  - Match styling with ParentTabs
  - Ensure consistency

**Supporting Files (Read-only):**
- `apps/mobile/src/navigation/RootNavigator.tsx` - Verify structure (NO MODIFICATIONS)
- `apps/mobile/src/navigation/AuthNavigator.tsx` - Out of scope (NO MODIFICATIONS)
- `apps/mobile/src/theme/colors.ts` - Reference for theme (Phase 02 owns this)

## File Ownership

**This Phase EXCLUSIVELY Owns:**
- ✅ `apps/mobile/src/navigation/ParentTabs.tsx` (FULL OWNERSHIP)
- ✅ `apps/mobile/src/navigation/StudentTabs.tsx` (FULL OWNERSHIP)

**Read-Only Access:**
- `apps/mobile/src/navigation/RootNavigator.tsx` (verify only)
- `apps/mobile/src/theme/colors.ts` (reference only, Phase 02 modifies)

## Implementation Steps

1. **Analyze Current Navigation Files**
   - Read ParentTabs.tsx to understand current styling
   - Read StudentTabs.tsx to understand current styling
   - Identify differences between the two
   - Document all hardcoded colors

2. **Update ParentTabs.tsx**
   - Replace hardcoded #0284C7 with theme.colors.primary
   - Update tab bar background to `bg-white/90 backdrop-blur-md`
   - Ensure active tabs use theme color
   - Ensure inactive tabs are gray
   - Standardize icon sizing

3. **Update StudentTabs.tsx**
   - Verify using theme.colors.primary (not hardcoded)
   - Match styling with ParentTabs.tsx
   - Update tab bar background if needed
   - Ensure consistent icon rendering

4. **Standardize Tab Bar Options**
   - Create consistent screenOptions for both navigators
   - Match padding, heights, and spacing
   - Ensure same typography for labels
   - Test visual consistency

5. **Test Navigation**
   - Test parent navigation (all 3 tabs)
   - Test student navigation (both 2 tabs)
   - Verify active/inactive states
   - Check color consistency

6. **Verify Against Wireframe**
   - Parent: 3 tabs with correct styling
   - Student: 2 tabs with correct styling
   - Active tab colored, inactive gray
   - Proper spacing and sizing

## Todo List

- [ ] 3.1 Read and analyze ParentTabs.tsx
- [ ] 3.2 Read and analyze StudentTabs.tsx
- [ ] 3.3 Document styling differences
- [ ] 3.4 Update ParentTabs.tsx with theme.colors.primary
- [ ] 3.5 Update ParentTabs.tsx tab bar styling
- [ ] 3.6 Update StudentTabs.tsx to match ParentTabs styling
- [ ] 3.7 Test parent navigation (3 tabs)
- [ ] 3.8 Test student navigation (2 tabs)
- [ ] 3.9 Verify against wireframe specs

## Success Criteria

✅ ParentTabs uses theme.colors.primary (no hardcoded colors)
✅ StudentTabs uses theme.colors.primary (no hardcoded colors)
✅ Both have consistent tab bar styling
✅ Active tabs colored, inactive grayed out
✅ Parent has 3 tabs, Student has 2 tabs (correct)
✅ No TypeScript errors
✅ Visual consistency between parent/student
✅ Matches wireframe design specs

## Conflict Prevention

**How this phase avoids conflicts:**
- **Exclusive files:** Only Phase 03 modifies navigation files
- **No screen files:** Phase 01 handles student screens, Phase 04 handles parent screens
- **No theme modifications:** Phase 02 handles colors.ts, this phase only references it
- **No state changes:** Navigation structure unchanged

**Risk Mitigation:**
- Phase 02 may update colors.ts - verify theme import still works
- If theme.colors.primary changes, navigation automatically updates
- Screen components may reference navigation props - verify compatibility

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking navigation flow | Low | Critical | Test all navigation paths thoroughly |
| Theme import errors | Low | High | Verify theme structure before updating |
| Visual inconsistency | Medium | Medium | Compare parent/student side-by-side |
| Tab count confusion | Low | Low | Keep parent=3, student=2 (correct per wireframe) |

## Security Considerations

- No security changes (navigation-only update)
- No authentication logic affected (AuthNavigator unchanged)
- No route protection changes
- No data handling changes

## Next Steps

1. **After Phase 03 Complete:**
   - Navigation is standardized for both user types
   - Phase 04 can reference navigation styling for screens
   - Both parent and student have consistent tab experience

2. **Testing:**
   - Test all navigation paths
   - Verify deep linking if applicable
   - Check tab switching smoothness
   - Test on iOS and Android

3. **Integration:**
   - Document tab bar styling for future screens
   - Ensure new screens follow same patterns
   - Consider creating reusable TabBar component if needed
