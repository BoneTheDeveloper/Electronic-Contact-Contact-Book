# Data Flow Analysis Report
## Middle School Conversion (Grades 10-12 → 6-9)

### Executive Summary
The web application uses a three-tier architecture with mock data simulating a high school (grades 10-12). To convert to middle school (grades 6-9), all grade references must be updated across 83 files. Data flows from mock-data.ts → API routes → UI components.

### Current Grade References in Mock Data
**Grade IDs**: 10A, 10B, 11A, 11B, 12A, 9A, 8A
**Grade Levels**: 10, 11, 12, 9, 8

### Data Flow Architecture

#### **Data Layer**
- `apps/web/lib/mock-data.ts` - Single source of truth for all mock data
  - Students: 8 students across grades 8-12
  - Classes: 7 classes (grades 8-12)
  - Teachers: 5 teachers assigned to classes
  - Grade distribution: Performance categories (Giỏi, Khá, Trung bình, Yếu)

#### **API Layer**
- `/api/classes` - Returns classes filtered by grade/teacher
- `/api/grades` - Handles grade records with A-F letter grades
- `/api/teacher/dashboard` - Teacher-specific data with hardcoded class ID '10A1'

#### **UI Layer**
- Admin components manage classes, students, grades
- Teacher components handle grade entry, attendance, assessments
- Grade display components show academic performance

### Files Requiring Changes by Layer

#### **DATA LAYER** (Core Data Source)
1. `apps/web/lib/mock-data.ts`
   - Update all student grade references (10A→6A, 11A→7A, 12A→8A, 9A→5A, 8A→4A)
   - Update class data (134-141 lines)
   - Update teacher class assignments (411-463 lines)
   - Update mock data functions to use grades 6-9

#### **API ROUTES**
2. `apps/web/app/api/classes/route.ts`
   - Update mock class data (lines 6-12)
   - Grade filters need to handle 6-9
3. `apps/web/app/api/grades/route.ts`
   - Update mock grade data (lines 16-26)
   - Letter grade calculation remains same
4. `apps/web/app/api/teacher/dashboard/route.ts`
   - Update hardcoded class ID '10A1' → '6A1' (line 23)

#### **ADMIN UI COMPONENTS**
5. `apps/web/components/admin/classes/AcadademicStructure.tsx`
   - Update grade filter buttons (line 166): ['Khối 10','11','12'] → ['Khối 6','7','8','9']
   - Update grade display in class cards (line 185)
6. `apps/web/components/admin/StudentTable.tsx`
   - Display student grades
7. `apps/web/components/admin/ClassCard.tsx`
   - Show class grade information
8. `apps/web/components/admin/UserTable.tsx`
   - User class assignments
9. `apps/web/components/admin/GradeDistribution.tsx`
   - Performance distribution display
10. `apps/web/components/admin/ActivityLogTable.tsx`
    - Grade-related activities

#### **TEACHER UI COMPONENTS**
11. `apps/web/components/teacher/GradeEntryForm.tsx`
    - Grade calculation formula (already generic)
    - Grade statistics display
12. `apps/web/components/teacher/AttendanceForm.tsx`
    - Student class selection
13. `apps/web/components/teacher/GradeInputCell.tsx`
    - Individual grade input
14. `apps/web/components/teacher/StudentAssessmentCard.tsx`
    - Student performance display
15. `apps/web/components/teacher/ConversationList.tsx`
    - Class-based conversations

#### **PAGE COMPONENTS**
16. All pages in `/apps/web/app/admin/*`
    - Dashboard stats
    - Class management pages
    - Grade management pages
    - User management pages
17. All pages in `/apps/web/app/teacher/*`
    - Grade entry pages
    - Attendance pages
    - Assessment pages
    - Class management pages

#### **SHARED COMPONENTS**
18. `apps/web/components/admin/shared/filters/filter-bar.tsx`
    - Grade filtering options
19. `apps/web/components/admin/shared/tables/data-table.tsx`
    - Table grade column rendering
20. Form components with grade selection

### Key Dependencies
- Grade data flows through: mock-data.ts → API → UI components
- Class names follow pattern: `{grade}{letter}{number}` (e.g., 10A1 → 6A1)
- Teacher assignments tied to specific class IDs
- Performance calculations based on numeric grades (0-10 scale)

### Impact Areas
1. **Data Integrity**: All class IDs must be consistently updated
2. **Teacher Workflow**: Hardcoded class IDs in API routes
3. **UI Filters**: Grade selection components need grade lists 6-9
4. **Performance Metrics**: Grade distribution calculations remain valid
5. **Navigation**: Sidebar and routing may need grade-level updates

### Recommendations
1. Update mock-data.ts first (single source of truth)
2. Then update API routes to use new grade structure
3. Finally update UI components to display grades 6-9
4. Maintain existing grade calculation formulas
5. Update any hardcoded class references in teacher workflows

### Unresolved Questions
1. Are there any grade-specific business rules that change for middle school?
2. Should grade naming convention change (e.g., 6A → Lớp 6A)?
3. Are there any middle school-specific features to add?