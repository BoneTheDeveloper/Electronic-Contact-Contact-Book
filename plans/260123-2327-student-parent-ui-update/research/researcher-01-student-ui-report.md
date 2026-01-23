# Student UI Research Report

## Overview
Analyzed wireframe design (docs/wireframe/Mobile/student/dashboard.html) against current student dashboard implementation.

## Key Findings

### 1. Dashboard Simplification Required
**Current Issues:**
- Dashboard includes "Tổng quan" stats section (lines 172-189)
- Includes "Bài tập sắp tới" section (lines 191-227)
- Wireframe requires a clean 3x3 grid with NO additional sections

**Action:**
- Remove statsSection component from Dashboard.tsx (lines 161-189)
- Remove assignmentsSection component from Dashboard.tsx (lines 190-226)
- Keep only header + service icons grid

### 2. Header Design Mismatch
**Current Implementation:**
- Uses solid `colors.primary` background
- Header layout has additional styling

**Wireframe Requirements:**
- Gradient background: `linear-gradient(135deg, #0284C7 0%, #0369A1 100%)`
- Student info format:
  - Avatar with initials (white text, black font)
  - Student name (white, xl font-bold)
  - Class info (blue-100, uppercase, text-xs)
- Notification bell with red badge (showing "3")

**Action:**
- Update header background to gradient
- Adjust typography to match wireframe specs
- Ensure notification badge matches wireframe styling

### 3. Service Icons Layout & Colors
**Current Implementation:**
- Colors match wireframe requirements
- Layout uses grid-based rendering

**Wireframe Requirements (3x3 Grid):**
- Icons sized w-20 h-20 (80x80)
- Rounded-[28px] corners
- Shadow-md and border
- Specific colors:
  - Schedule: orange-500 (#F97316)
  - Grades: blue-500 (#0284C7)
  - Attendance: emerald-600 (#059669)
  - Study Materials: rose-500 (#F43F5E)
  - Leave Request: rose-500 (#F43F5E)
  - Teacher Feedback: purple-600 (#9333EA)
  - News: sky-500 (#0EA5E9)
  - Summary: indigo-600 (#4F46E5)
  - Payment: amber-500 (#F59E0B)

**Action:**
- ✅ Colors already correct
- ✅ Grid layout correct
- Ensure icon dimensions and border radius match

### 4. Navigation Bar
**Current Implementation:**
- 2 tabs: "Trang chủ", "Cá nhân"
- Icons use SVG with proper colors

**Wireframe Requirements:**
- White background with opacity (bg-white/90 backdrop-blur-md)
- Home icon colored (#0284C7), Profile grayed out
- Positioned at bottom with proper spacing

**Action:**
- Navigation already matches requirements
- No changes needed

### 5. Specific Implementation Details
**Typography Changes:**
- Icon labels: text-[10px] font-black uppercase
- Line height: 14px (tight)
- Letter spacing: 0.5px

**Spacing Adjustments:**
- Header padding: pt-16 (64px from top)
- Icon grid spacing: gap-y-12 (48px vertical)
- Bottom padding for scroll view: pb-32 (128px)

## Files to Update

### Primary File:
- `apps/mobile/src/screens/student/Dashboard.tsx`
  - Remove statsSection (lines 161-189)
  - Remove assignmentsSection (lines 190-226)
  - Update header gradient background
  - Adjust typography and spacing

### Secondary Files:
- `apps/mobile/src/theme/colors.ts` - Verify color constants match wireframe
- `apps/mobile/src/components/ui/Icon.tsx` - Check icon rendering

## Unresolved Questions

1. Are the avatar initials supposed to be displayed in all caps (wireframe shows "HB")?
2. Should the notification badge count be dynamically loaded or static (currently hardcoded as "3")?

## Summary
The wireframe requires a simplified dashboard with only the header and service icons grid. The main changes involve removing unnecessary sections and fine-tuning the visual styling to match the design specifications exactly.