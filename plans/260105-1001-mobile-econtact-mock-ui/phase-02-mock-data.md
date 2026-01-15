# Phase 2: Mock Data

**Context**: [plan.md](plan.md)
**Date**: 2025-01-05
**Priority**: High
**Status**: Pending

## Overview
Create JSON mock data files for users, academic records, attendance, grades, notifications, and fees.

## Key Insights
- Use UUIDs for entity IDs
- Include timestamps for all records
- Create realistic relationships between entities
- Small prototype: 20-30 students, 2-3 classes

## Requirements
- Create 6 JSON files with proper schema
- Use TypeScript interfaces for type safety
- Ensure data relationships are consistent

## Implementation Steps

1. **Create TypeScript types** (`src/types/data.ts`)
   - User, Student, Class, Subject
   - Attendance, Grade, Notification, Fee

2. **Create JSON files** (`mock_data/`)
   - `users.json` - 30 users (students, parents, teachers)
   - `academic.json` - 2 classes, 5 subjects
   - `attendance.json` - Attendance records for current month
   - `grades.json` - Grades for all subjects
   - `notifications.json` - 15-20 notifications
   - `fees.json` - Fee records for students

3. **Create data service** (`src/services/mockDataService.ts`)
   - Functions to load and parse JSON
   - Helper functions for filtering data

## Data Schema

```typescript
// User: { id, role, email, firstName, lastName, phone }
// Student: { id, userId, classId, admissionNumber, ... }
// Class: { id, name, grade, section, academicYear }
// Subject: { id, name, code, classId }
// Attendance: { id, studentId, date, status }
// Grade: { id, studentId, subjectId, obtainedMarks, maxMarks }
// Notification: { id, title, message, type, priority }
// Fee: { id, studentId, type, amount, status, dueDate }
```

## Success Criteria
- [ ] All JSON files created with valid data
- [ ] TypeScript types defined
- [ ] Data service loads files correctly
- [ ] Relationships consistent (no orphaned references)

## Next Steps
Proceed to [phase-03-design-system.md](phase-03-design-system.md)
