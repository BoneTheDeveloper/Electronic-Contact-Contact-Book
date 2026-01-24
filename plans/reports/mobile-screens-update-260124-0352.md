# Mobile Screens Update Report

**Date:** 2026-01-24  
**Task:** Update 3 parent screens to match wireframes  
**Status:** In Progress - Implementation Plan Complete

## Overview

Need to update 3 screens to match wireframe designs in `docs/wireframe/Mobile/parent/`:
1. **Summary.tsx** - summary.html
2. **TeacherDirectory.tsx** - teacher-directory.html  
3. **Messages.tsx** - messages.html

## Analysis of Required Changes

### 1. Summary.tsx - Key Changes Needed

**Current State:**
- Uses NativeWind (Tailwind) classes
- Basic header with child info
- Standard score display
- Simple subject list

**Wireframe Requirements:**
- Semester selector (Học kỳ I / Cả năm) - toggle buttons
- Overall score card with 82% circular progress indicator
- Indigo gradient card (#6366F1) with shadow
- Attendance + Conduct stats in 2-column grid
- Subject breakdown with colored icons, progress bars
- Back button in header
- "Năm học 2025 - 2026" subtitle

**Implementation Approach:**
- Add `useState` for semester selection
- Add SVG circular progress using `react-native-svg` (already installed)
- Create subject color mapping function
- Add conduct score calculation
- Switch from NativeWind to StyleSheet for complex gradients

### 2. TeacherDirectory.tsx - Key Changes Needed

**Current State:**
- Simple list with avatars
- Basic contact info display
- No search or filters

**Wireframe Requirements:**
- Search bar with icon
- Horizontal scrollable subject filter tabs (Tất cả, GVCN, Toán, Văn, Anh, Lý...)
- Featured homeroom teacher section with star icon
- Teacher cards with:
  - Gradient avatars with initials
  - Online status indicators (green dot)
  - Subject badges with colors
  - Contact buttons (info + message)
- Section header: "Giáo viên bộ môn"

**Implementation Approach:**
- Add `useState` for search query and filter
- Add `ScrollView` horizontal for filter tabs
- Create homeroom teacher featured card
- Add star icon SVG
- Color code subjects matching wireframe

### 3. Messages.tsx - Key Changes Needed

**Current State:**
- Basic chat list
- Avatar with online status
- Unread badges

**Wireframe Requirements:**
- Search bar at top
- "Đang hoạt động" horizontal scroll section with online teachers
- Chat cards with:
  - Gradient avatars (blue, purple, pink, green)
  - Teacher name + subject in parentheses
  - Truncated message preview
  - Time ago + read checkmark
  - Unread count badges (blue or red)
- Rounded cards with shadows

**Implementation Approach:**
- Add search state
- Add online teachers horizontal scroll
- Update message data structure to include subject
- Add gradient avatar colors
- Add read receipt checkmark

## Implementation Notes

### Dependencies
- ✅ `react-native-svg` ~15.12.1 (already installed)
- ✅ `react-native-css` / NativeWind configured
- ✅ Mock data functions available

### Color Scheme
- Primary: #0284C7 (sky-600)
- Indigo card: #6366F1
- Subject gradients mapped per wireframe
- Status colors: green (online), red (unread), blue (unread-some)

### Next Steps

1. **Summary.tsx** - Full rewrite required
   - Create new file with StyleSheet approach
   - Add SVG progress ring
   - Semester selector with state

2. **TeacherDirectory.tsx** - Major updates
   - Add search input component
   - Horizontal filter tabs
   - Featured GVCN card with star

3. **Messages.tsx** - Moderate updates
   - Add search bar
   - Online teachers horizontal scroll
   - Update card styling

## Files to Modify

- `C:/Project/electric_contact_book/apps/mobile/src/screens/parent/Summary.tsx`
- `C:/Project/electric_contact_book/apps/mobile/src/screens/parent/TeacherDirectory.tsx`
- `C:/Project/electric_contact_book/apps/mobile/src/screens/parent/Messages.tsx`

## Questions/Unresolved

1. Should semester filter actually filter data, or is it UI-only for now?
2. Should search functionality be implemented or just UI?
3. Need to confirm exact color codes for all subject gradients
4. Modal for teacher contact info - implement now or later?

