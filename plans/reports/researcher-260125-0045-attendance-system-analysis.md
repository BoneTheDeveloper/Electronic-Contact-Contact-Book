# Attendance System Research Report

## Database Schema Analysis

### Core Attendance Table Structure
The attendance system is built around a well-structured `attendance` table with the following key columns:

```sql
attendance (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  class_id TEXT REFERENCES classes(id),
  date DATE NOT NULL,
  period_id INTEGER REFERENCES periods(id), -- NULL = full day
  status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  recorded_by UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, class_id, date, period_id)
)
```

### Related Tables Structure

#### 1. **Students Table**
- Contains student profiles linked to auth.users
- Has `student_code` for unique identification
- Connected to `profiles` table via foreign key

#### 2. **Classes Table**
- Contains class information (grade, room, capacity)
- Linked to `grades` table for grade level
- Has `current_students` counter

#### 3. **Teachers Table**
- Contains teacher profiles with `employee_code`
- Simple structure with basic info

#### 4. **Schedules Table** (Subject Teachers)
- Links teachers to classes for specific subjects
- Includes period, day_of_week, semester information
- Used for determining which subject teacher teaches which class

#### 5. **Class Teachers Table** (Homeroom Teachers)
- Designates homeroom teachers (GVCN) for classes
- Supports multiple semesters and academic years
- Has `is_primary` flag for main homeroom teacher

#### 6. **Enrollments Table**
- Links students to classes
- Tracks enrollment status and dates
- Used for determining which students belong to which class

#### 7. **Periods Table**
- Defines time slots (period 1, period 2, etc.)
- Includes start_time and end_time
- Used for period-specific attendance tracking

## Current Implementation Status

### ✅ Completed Components

1. **Database Schema**
   - Full attendance table with proper relationships
   - RLS (Row Level Security) policies implemented
   - Views for attendance summaries

2. **Web UI Components**
   - Teacher attendance list page (`/teacher/attendance`)
   - Class-specific attendance page (`/teacher/attendance/[classId]`)
   - Attendance form with status buttons
   - Summary cards showing attendance statistics

3. **Mock API**
   - Attendance API route at `/api/attendance`
   - Supports GET, POST, and PATCH operations
   - Returns mock data with Vietnamese localization

### ❌ Missing Components

1. **Real Database Integration**
   - Current implementation uses mock data
   - No actual Supabase queries for attendance operations
   - API routes not connected to real database

2. **Teacher Assignment Logic**
   - No API to determine teacher's assigned classes
   - Missing logic to differentiate homeroom vs subject teachers
   - No authentication-based class filtering

3. **Attendance Persistence**
   - Form submissions don't save to database
   - No real attendance marking functionality
   - No attendance history retrieval

## Teacher-Student Relationship Analysis

### Homeroom Teachers (GVCN)
- Assigned via `class_teachers` table
- Have primary responsibility for class attendance
- Can mark attendance for their entire class
- Identified by `is_primary = true`

### Subject Teachers (GVBM)
- Assigned via `schedules` table
- Teach specific subjects to specific classes
- Can mark attendance for their subject periods
- Limited to classes they are scheduled to teach

### Current Implementation Gap
The code shows `isHomeroom` flag in UI, but the database query in `getTeacherClasses()` doesn't actually check homeroom assignments:

```typescript
// Current implementation doesn't check homeroom status
export const getTeacherClasses = cache(async (teacherId?: string): Promise<TeacherClass[]> => {
  // Query only uses schedules table, not class_teachers
  // Missing homeroom teacher detection logic
})
```

## RLS (Row Level Security) Policies

### Teacher Access Controls
- Teachers can view attendance for classes they teach
- Teachers can manage class attendance (ALL operations)
- Admins have full access to all attendance data

### Parent/Student Access
- Students can view own attendance
- Parents can view children's attendance
- Limited read-only access

## Technical Gaps Identified

### 1. Authentication Integration
- Current code uses hardcoded 'current-teacher-id'
- No real user authentication integration
- Missing role-based access control implementation

### 2. API Routes Missing
- No `/api/teacher/attendance` routes
- No attendance submission endpoints
- No attendance retrieval by teacher/class

### 3. Data Flow Issues
- UI shows mock data only
- Form submissions don't persist
- No real-time attendance updates

### 4. Business Logic Missing
- No handling of leave requests affecting attendance
- No integration with approved absences
- No attendance calculation rules

## Recommended Next Steps

### Phase 1: Database Integration
1. Implement real Supabase queries for attendance operations
2. Create API routes for teacher attendance management
3. Connect UI to real database instead of mock data

### Phase 2: Teacher Assignment Logic
1. Implement proper `getTeacherClasses()` with homeroom detection
2. Create helper functions to determine teacher permissions
3. Implement class filtering based on teacher assignments

### Phase 3: Enhanced Features
1. Add leave request integration
2. Implement attendance history and reports
3. Add parent notifications for attendance changes

### Phase 4: Optimization
1. Add caching for frequently accessed data
2. Implement bulk attendance operations
3. Add attendance analytics and trends

## Summary

The attendance system has a solid database foundation and UI components, but lacks real database integration and proper teacher assignment logic. The main gap is connecting the existing UI to actual Supabase operations and implementing proper authentication-based class filtering for teachers.

The architecture supports both homeroom and subject teacher roles, but the current implementation doesn't differentiate between them in practice. The system needs real API endpoints and proper authentication integration to become fully functional.