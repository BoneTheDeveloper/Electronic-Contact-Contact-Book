# Parent UI Consistency Research Report
**Date:** 2026-01-23
**Focus:** Parent screens analysis vs student wireframe design consistency

## Current Parent UI Analysis

### Navigation Structure
**Parent has 3 tabs:** Trang chủ, Tin nhắn, Cá nhân
**Student has 2 tabs:** Trang chủ, Cá nhân

**Parent Screens in Home Stack:**
- Dashboard (9 service icons grid)
- Schedule, Grades, Attendance, Teacher Feedback, Leave Request, Summary, Teacher Directory, News, Payment Overview

**Student Screens in Home Stack:**
- Dashboard (different structure)
- Schedule, Grades, Attendance, Study Materials, Leave Request, Teacher Feedback, News, Summary, Payment

### UI Inconsistencies Found

#### 1. **Tab Bar Inconsistencies**
- **Parent:** 3 tabs with Tin nhắn (Messages)
- **Student:** 2 tabs only
- **Issue:** Inconsistent tab structure between user types

#### 2. **Shared Screen Names - Different Implementations**
Both parent and student have screens with same names but different implementations:

**Schedule Screen:**
- Parent: Uses Tailwind classes (className), simple list view
- Student: Not checked yet, but likely different styling
- File: `apps/mobile/src/screens/parent/Schedule.tsx`

**Grades Screen:**
- Parent: Uses Tailwind, grade color coding
- Student: Likely different approach
- File: `apps/mobile/src/screens/parent/Grades.tsx`

**Dashboard Screen:**
- Parent: 9-grid service icons with news preview
- Student: Different structure expected
- File: `apps/mobile/src/screens/parent/Dashboard.tsx`

#### 3. **Header/Top Bar Inconsistencies**
- Parent: Blue gradient header (#0284C7)
- Student: Uses theme.colors.primary (different value)
- Different styling approaches in codebases

#### 4. **Child Selector Feature**
- Parent has child selector in dashboard
- Student does not need this feature
- This is expected but creates visual complexity

## Required UI Updates for Consistency

### Immediate Actions Needed:

1. **Standardize Tab Bar**
   - Either remove Tin nhắn from parent OR add it to student
   - Use consistent styling approach (SVG icons, colors, sizes)
   - Current: Parent uses #0284C7, Student uses theme.colors.primary

2. **Header Consistency**
   - Update parent to use theme.colors.primary instead of hardcoded #0284C7
   - Standardize header height and padding
   - Match rounded corners and shadow effects

3. **Shared Screen Styling**
   - Schedule screen: Convert to StyleSheet for consistency
   - Grades screen: Align with student wireframe styling
   - Maintain same card designs, spacing, typography

4. **Dashboard Grid**
   - Parent uses 3-column grid (80px icons)
   - Student likely needs different grid layout
   - Ensure consistent spacing and sizing

5. **Typography Standards**
   - Parent uses various font sizes inconsistently
   - Student likely uses more standardized approach
   - Need to define consistent font scale

### Files to Update:

1. `apps/mobile/src/navigation/ParentTabs.tsx`
   - Use theme.colors.primary instead of #0284C7
   - Consider tab structure unification

2. `apps/mobile/src/screens/parent/Dashboard.tsx`
   - Convert StyleSheet approach for consistency
   - Update header styling
   - Standardize child selector component

3. `apps/mobile/src/screens/parent/Schedule.tsx`
   - Convert Tailwind classes to StyleSheet
   - Match student wireframe header styling

4. `apps/mobile/src/screens/parent/Grades.tsx`
   - Convert to StyleSheet approach
   - Align grade badge styling with student design

5. `apps/mobile/src/theme/colors.ts`
   - Verify primary color consistency
   - Define grade colors if not already defined

## Next Steps

1. Review student wireframe designs to establish baseline
2. Create shared UI component library
3. Apply consistent styling patterns across all screens
4. Test with both user types to ensure UX parity

## Unresolved Questions

1. What is the final decision on tab structure (2 vs 3 tabs)?
2. Should parent have access to student Study Materials screen?
3. Are there any parent-only screens that should be visually distinct?