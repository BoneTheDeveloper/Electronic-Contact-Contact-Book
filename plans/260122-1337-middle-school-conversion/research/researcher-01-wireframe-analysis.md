# Middle School (THCS) Wireframe Analysis Report

## Executive Summary
This document analyzes the current High School (THPT) wireframes and identifies requirements for conversion to Middle School (THCS - grades 6-9) management system.

## Current System Analysis

### Grade Structure (THPT → THCS Conversion)
**Current (High School):**
- Grades 10, 11, 12
- Class naming: 10A, 10B, 11A, 11B, 12A, 12B
- Vietnamese: "Khối 10", "Khối 11", "Khối 12"

**Target (Middle School):**
- Grades 6, 7, 8, 9
- Class naming: 6A, 6B, 6C, 7A, 7B, 8A, 8B, 9A, 9B
- Vietnamese: "Khối 6", "Khối 7", "Khối 8", "Khối 9"

### Wireframe Components Requiring Updates

#### 1. Academic Structure Module (Web App)
**File:** `Web_app/Admin/academic-structure.html`

**Key Changes:**
```javascript
// Current grades array
grades: [
    { id: 10, name: 'Khối 10', active: true },
    { id: 11, name: 'Khối 11', active: false },
    { id: 12, name: 'Khối 12', active: false }
]

// Target grades array
grades: [
    { id: 6, name: 'Khối 6', active: true },
    { id: 7, name: 'Khối 7', active: false },
    { id: 8, name: 'Khối 8', active: false },
    { id: 9, name: 'Khối 9', active: false }
]
```

**UI Updates:**
- Grade selector sidebar: Khối 6-9
- Class grid display: 6A, 6B, 6C instead of 10A, 10B, 10C
- Statistics cards: Update grade ranges from 10-12 to 6-9

#### 2. Grade Entry Module (Teacher Portal)
**File:** `Web_app/Teacher/grade-entry.html`

**Key Changes:**
- Class dropdown options: 6A, 6B, 7A, 7B, 8A, 8B, 9A, 9B
- Remove grade 10, 11, 12 options
- Student data mocking: Update class names to reflect middle school

**Grade Statistics Categories (Middle School specific):**
- Giỏi (≥ 8.0) - Excellent
- Khá (6.5 - 7.9) - Good
- Trung bình (5.0 - 6.4) - Average
- Yếu (< 5.0) - Poor

#### 3. Parent Mobile Dashboard
**File:** `Mobile/parent/dashboard.html`

**Key Changes:**
- Student class display: "Nguyễn Hoàng B • 6A" instead of "9A"
- Navigation to grade views must support grades 6-9

## Mock Data Pattern Changes

### Class Naming Convention
**High School:** [10-12][A-D] (e.g., 10A, 11B, 12C)
**Middle School:** [6-9][A-D] (e.g., 6A, 7B, 8C, 9D)

### Student Code Pattern
- Current prefix: HS2024XXX (for grade 10-12)
- Target prefix: HS2024XXX (maintain same pattern, but assign to grades 6-9)

### Subject Structure (Unchanged)
Subjects remain the same but may need period adjustments:
- Mathematics (Toán): 5 periods/week
- Literature (Ngữ văn): 4 periods/week
- English (Tiếng Anh): 4 periods/week
- Science subjects reduced frequency for middle school

## Vietnamese Terminology

### Academic Terms
- **High School:** "THPT" (Trung học Phổ thông)
- **Middle School:** "THCS" (Trung học Cơ sở)
- **Grade:** "Khối" (both systems)
- **Class:** "Lớp" (both systems)

### Educational Context Terms
- **Homeroom Teacher:** "Giáo viên chủ nhiệm" (GVCN)
- **Subject Teacher:** "Giáo viên bộ môn" (GVBM)
- **Semester:** "Học kỳ"
- **Academic Year:** "Năm học"

## Implementation Checklist

### Frontend Changes
1. [ ] Update academic structure grade selector
2. [ ] Modify class naming in all dropdowns
3. [ ] Update parent dashboard class display
4. [ ] Adjust grade entry filters for grades 6-9
5. [ ] Update mobile app class navigation

### Backend Changes
1. [ ] Modify grade validation (6-9 instead of 10-12)
2. [ ] Update class naming convention database
3. [ ] Adjust class size limits (middle school typically 35-40 students)
4. [ ] Update reporting filters for grade ranges

### Mock Data Updates
1. [ ] Generate sample classes for grades 6, 7, 8, 9
2. [ ] Create sample student data for new grade structure
3. [ ] Update teacher assignments for middle school classes
4. [ ] Adjust subject period allocations for grade levels

## Grade-Specific Considerations

### Grade 6 (Elementary Transition)
- More intensive subject foundations
- Higher teacher supervision ratio
- Simplified assessment criteria

### Grades 7-8 (Middle School Core)
- Standard curriculum delivery
- Increased subject complexity
- Standard assessment weighting

### Grade 9 (Pre-High School)
- Preparation for high school entrance
- Advanced subject options
- Career orientation elements

## Unresolved Questions
1. Should subject period allocations differ between grade levels (e.g., more math periods for grade 6)?
2. Are there specific middle school assessment requirements not present in high school?
3. Should class size limits be adjusted for middle school (typically 35 vs 40 students)?
4. Are there additional parent dashboard features specific to middle school age group?

## Recommendations
1. Maintain consistent UI/UX across grade levels
2. Implement grade-specific subject period configurations
3. Consider middle school-specific assessment rubrics
4. Update all navigation elements to reflect new grade structure
5. Ensure mobile app responsive design for smaller class sizes

---
*Report generated: 2026-01-22*
*Researcher: AI Technology Expert*