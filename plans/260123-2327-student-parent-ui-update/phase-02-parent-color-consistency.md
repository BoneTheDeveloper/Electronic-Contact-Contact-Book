# Phase 02: Parent Color Consistency

## Context
- **Parent Plan:** [plan.md](./plan.md)
- **Dependencies:** None (can run parallel with Phase 01, 03)
- **Docs:** [researcher-02-parent-ui-report.md](./research/researcher-02-parent-ui-report.md)

## Parallelization Info
**Can run concurrently with:** Phase 01, Phase 03
**File Overlap Risk:** None (exclusive ownership of parent Dashboard.tsx and colors.ts)

## Overview
- **Date:** 2026-01-23
- **Description:** Replace hardcoded #0284C7 with theme.colors.primary across parent UI
- **Priority:** P2 (High)
- **Implementation Status:** Pending
- **Review Status:** Pending

## Key Insights

From research report:
1. Parent UI uses hardcoded #0284C7 instead of theme.colors.primary
2. Inconsistent color usage creates maintenance issues
3. Need centralized color management
4. Grade colors need standardization

## Requirements

### 1. Replace Hardcoded Colors
- Find all instances of `#0284C7` in parent screens
- Replace with `theme.colors.primary`
- Ensure consistency across all parent UI files

### 2. Theme Color Verification
- Verify `colors.ts` has correct primary color definition
- Add grade-related colors if missing
- Document color usage conventions

### 3. Parent Dashboard Updates
- Update header gradient to use theme colors
- Standardize child selector styling
- Ensure service icon colors use theme

## Architecture

**Color System:**
```
theme/colors.ts
├── primary: #0284C7
├── secondary: #0369A1
└── grade colors (add if missing)
    ├── A: green
    ├── B: blue
    ├── C: yellow
    ├── D: orange
    └── F: red
```

**Parent screens import:** `import { theme } from '../../theme/colors'`

## Related Code Files

**Primary Files (Exclusive Ownership):**
- `apps/mobile/src/theme/colors.ts`
  - ONLY phase that modifies this file
  - Add missing grade colors
  - Document color usage
  - Verify primary color is #0284C7

- `apps/mobile/src/screens/parent/Dashboard.tsx`
  - ONLY phase that modifies this file (for colors)
  - Replace hardcoded #0284C7 with theme.colors.primary
  - Update gradient to use theme values
  - Standardize child selector colors

**Scope Boundaries:**
- Phase 01 owns student/Dashboard.tsx (NOT this phase)
- Phase 03 owns navigation files (NOT this phase)
- Phase 04 owns other parent screens (NOT this phase)

## File Ownership

**This Phase EXCLUSIVELY Owns:**
- ✅ `apps/mobile/src/theme/colors.ts` (FULL OWNERSHIP)
- ✅ `apps/mobile/src/screens/parent/Dashboard.tsx` (color updates only)

**Read-Only Access:**
- Other parent screens (Schedule, Grades, etc.) - Phase 04 handles these
- Navigation files - Phase 03 handles these

## Implementation Steps

1. **Verify Theme Colors**
   - Check `apps/mobile/src/theme/colors.ts`
   - Ensure primary color is `#0284C7`
   - Add secondary color `#0369A1` if missing
   - Add grade color constants if missing:
     ```typescript
     gradeA: '#22C55E',  // green
     gradeB: '#3B82F6',  // blue
     gradeC: '#EAB308',  // yellow
     gradeD: '#F97316',  // orange
     gradeF: '#EF4444',  // red
     ```

2. **Search Hardcoded Colors**
   - Search all parent screens for `#0284C7`
   - Document all instances found
   - Identify which files Phase 02 vs Phase 04 should update

3. **Update Parent Dashboard**
   - Replace hardcoded `#0284C7` with `theme.colors.primary`
   - Update gradient if present to use theme colors
   - Update child selector styling to use theme
   - Ensure service icon colors use theme constants

4. **Test Color Consistency**
   - Verify visual appearance unchanged
   - Check all parent dashboard screens
   - Ensure proper contrast
   - Test in light/dark mode if applicable

5. **Document Color Usage**
   - Add comments to colors.ts explaining usage
   - Document when to use primary vs secondary
   - Add examples for other developers

## Todo List

- [ ] 2.1 Verify colors.ts has primary #0284C7
- [ ] 2.2 Add secondary color #0369A1 if missing
- [ ] 2.3 Add grade color constants if missing
- [ ] 2.4 Search parent/ for hardcoded #0284C7
- [ ] 2.5 Update parent/Dashboard.tsx colors
- [ ] 2.6 Replace gradient colors with theme values
- [ ] 2.7 Test color rendering in simulator
- [ ] 2.8 Document color usage conventions

## Success Criteria

✅ No hardcoded #0284C7 in parent/Dashboard.tsx
✅ All colors use theme.colors.primary
✅ Grade colors defined in colors.ts
✅ Visual appearance unchanged (values are same)
✅ No TypeScript errors
✅ Documented color usage
✅ Ready for Phase 04 to use in other parent screens

## Conflict Prevention

**How this phase avoids conflicts:**
- **Exclusive files:** Only Phase 02 modifies colors.ts and parent/Dashboard.tsx
- **No student files:** Phase 01 handles student screens
- **No navigation files:** Phase 03 handles navigation
- **No other parent screens:** Phase 04 handles those

**Risk Mitigation:**
- Phase 01 may reference colors.ts - ensure primary color value unchanged
- Phase 03 navigation may use colors - verify compatibility
- Phase 04 will use updated theme - document any new color constants

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking existing color usage | Low | Medium | Search all usages first, test thoroughly |
| Grade colors already exist elsewhere | Medium | Low | Search codebase before adding |
| Theme structure differs from expected | Low | Medium | Read current colors.ts before modifying |
| Visual regression | Low | High | Keep color values same, only change source |

## Security Considerations

- No security changes (theme-only update)
- No data handling changes
- No authentication logic affected
- Color values are constants (no user input)

## Next Steps

1. **After Phase 02 Complete:**
   - Phase 04 can use theme.colors.primary in other parent screens
   - Phase 03 navigation can reference updated theme
   - Phase 01 student Dashboard unaffected

2. **Testing:**
   - Verify parent dashboard renders correctly
   - Check child selector styling
   - Test service icon colors

3. **Integration:**
   - Document new grade colors for Phase 04
   - Ensure Phase 04 knows to use theme instead of hardcoded values
