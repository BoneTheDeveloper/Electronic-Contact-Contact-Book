# Phase 02: API Routes Conversion

## Context Links
- **Parent Plan:** `plans/260122-1337-middle-school-conversion/plan.md`
- **Research:** `research/researcher-02-data-flow-analysis.md`
- **Phase 01:** `phase-01-mock-data-layer.md` (defines data contract)

## Parallelization Info
- **Execution Wave:** 1 (Can run in parallel with Phase 03)
- **Dependencies:** Phase 01 data contract (mock-data.ts exports)
- **Dependents:** Phases 03, 04, 05 (consume API routes)
- **Estimated Time:** 1 hour

## Overview
- **Date:** 2026-01-22
- **Description:** Update API routes to return middle school (grades 6-9) data
- **Priority:** P1 (Critical path - exposes data contract to UI)
- **Implementation Status:** pending
- **Review Status:** pending

## Key Insights
From research reports:
- API routes read from `mock-data.ts` (Phase 01 contract)
- 3 main API endpoints need updates: `/api/classes`, `/api/grades`, `/api/teacher/dashboard`
- Hardcoded class ID in teacher dashboard: '10A1' → '6A1'
- Grade filters need to handle 6-9 range

## Requirements
Update API route files to expose grade 6-9 data:
- Remove hardcoded grade 10-12 references
- Update class ID hardcodes
- Ensure grade filters support 6-9
- Maintain API contract stability

## Architecture

### API Layer Data Flow
```
mock-data.ts (Phase 01)
    ↓ (reads data contract)
API Routes (Phase 02)
    ↓ /api/classes, /api/grades, /api/teacher/*
UI Components (Phases 03, 04, 05)
```

### API Endpoints to Update
```
/api/classes
    ├── GET /api/classes
    └── GET /api/classes/[id]

/api/grades
    ├── GET /api/grades
    └── POST /api/grades

/api/teacher/*
    ├── GET /api/teacher/dashboard (CRITICAL: hardcoded '10A1')
    ├── GET /api/teacher/classes
    ├── GET /api/teacher/schedule
    └── GET /api/teacher/homeroom
```

## Related Code Files

### **EXCLUSIVE OWNERSHIP - Phase 02 ONLY**

| File | Lines | Changes | Ownership |
|------|-------|---------|-----------|
| `apps/web/app/api/classes/route.ts` | All | Update class data refs | **Phase 02 ONLY** |
| `apps/web/app/api/grades/route.ts` | All | Update grade data refs | **Phase 02 ONLY** |
| `apps/web/app/api/teacher/dashboard/route.ts` | All | Update hardcoded class ID | **Phase 02 ONLY** |
| `apps/web/app/api/teacher/classes/route.ts` | All | Validate grade 6-9 | **Phase 02 ONLY** |
| `apps/web/app/api/teacher/schedule/route.ts` | All | Update class names | **Phase 02 ONLY** |
| `apps/web/app/api/teacher/homeroom/route.ts` | All | Update class IDs | **Phase 02 ONLY** |

**NO OTHER PHASE modifies these files**

## File Ownership

### **Phase 02 owns:**
- `apps/web/app/api/classes/route.ts`
- `apps/web/app/api/grades/route.ts`
- `apps/web/app/api/teacher/dashboard/route.ts`
- `apps/web/app/api/teacher/classes/route.ts`
- `apps/web/app/api/teacher/schedule/route.ts`
- `apps/web/app/api/teacher/homeroom/route.ts`

### **Data Contract (from Phase 01):**
```typescript
// Phase 01 guarantees:
import { getClasses, getStudents, Class, Student } from '@/lib/mock-data'

// Phase 02 exposes via API:
export interface ClassDTO {
  id: string      // '6A', '7A', etc.
  name: string    // '6A', '7A', etc.
  grade: string   // '6', '7', '8', '9'
  teacher: string
  studentCount: number
  room: string
}
```

## Implementation Steps

### **Step 1: Update /api/classes/route.ts** (15 min)
```typescript
// apps/web/app/api/classes/route.ts
import { NextResponse } from 'next/server'
import { getClasses } from '@/lib/mock-data'

export async function GET() {
  const classes = await getClasses()
  // Phase 01 now returns classes with grades 6-9
  // No changes needed - data contract handles it
  return NextResponse.json(classes)
}

// If there's hardcoded class data, update:
// OLD: { id: '10A', name: '10A', grade: '10', ... }
// NEW: Data comes from Phase 01, no hardcodes
```

### **Step 2: Update /api/grades/route.ts** (15 min)
```typescript
// apps/web/app/api/grades/route.ts
import { NextResponse } from 'next/server'
import { getGradeDistribution, getStudents } from '@/lib/mock-data'

export async function GET() {
  // Grade distribution uses labels (Giỏi, Khá, etc.) - no change needed
  const distribution = await getGradeDistribution()

  // Student grades come from Phase 01 as 6A, 7A, etc.
  const students = await getStudents()

  return NextResponse.json({ distribution, students })
}

export async function POST(request: Request) {
  const body = await request.json()
  // Validate grade is 6-9 (was 10-12)
  const { studentId, grade } = body

  // Grade calculation remains same (0-10 scale)
  // Only validation changes:
  const validGrades = ['6', '7', '8', '9']
  // ... validation logic
}
```

### **Step 3: Update /api/teacher/dashboard/route.ts** (CRITICAL) (20 min)
```typescript
// apps/web/app/api/teacher/dashboard/route.ts
import { NextResponse } from 'next/server'
import { getTeacherStats, getTeacherClasses } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacherId') || '2'

  // CRITICAL: Remove hardcoded class ID
  // OLD: const classId = '10A1'  // Hardcoded!
  // NEW: Use dynamic class from teacher data
  const classes = await getTeacherClasses(teacherId)
  const homeroomClass = classes.find(c => c.isHomeroom)
  const classId = homeroomClass?.id || '6A'  // Dynamic fallback

  const stats = await getTeacherStats(teacherId)

  return NextResponse.json({
    classId,      // Now dynamic: '6A', '7A', etc.
    stats,
    classes
  })
}
```

### **Step 4: Update /api/teacher/classes/route.ts** (10 min)
```typescript
// apps/web/app/api/teacher/classes/route.ts
import { NextResponse } from 'next/server'
import { getTeacherClasses } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacherId') || '2'

  const classes = await getTeacherClasses(teacherId)

  // Phase 01 returns classes with grades 6-9
  // Validate that all classes are grades 6-9
  const validClasses = classes.filter(c =>
    ['6', '7', '8', '9'].includes(c.grade)
  )

  return NextResponse.json(validClasses)
}
```

### **Step 5: Update /api/teacher/schedule/route.ts** (10 min)
```typescript
// apps/web/app/api/teacher/schedule/route.ts
import { NextResponse } from 'next/server'
import { getTeacherSchedule } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacherId') || '2'
  const date = searchParams.get('date')

  const schedule = await getTeacherSchedule(teacherId, date)

  // Phase 01 updates schedule with class names 6A, 7A, etc.
  // No changes needed - data contract handles it
  return NextResponse.json(schedule)
}
```

### **Step 6: Update /api/teacher/homeroom/route.ts** (10 min)
```typescript
// apps/web/app/api/teacher/homeroom/route.ts
import { NextResponse } from 'next/server'
import { getHomeroomClassData } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('classId') || '6A'  // Default to 6A

  const classData = await getHomeroomClassData(classId)

  // Phase 01 returns class data with grade 6-9
  // Validate grade is 6-9
  if (!['6', '7', '8', '9'].includes(classData.grade)) {
    return NextResponse.json(
      { error: 'Invalid grade level' },
      { status: 400 }
    )
  }

  return NextResponse.json(classData)
}
```

## Todo List
- [ ] Update `/api/classes/route.ts` - verify data contract (Step 1)
- [ ] Update `/api/grades/route.ts` - update grade validation (Step 2)
- [ ] Update `/api/teacher/dashboard/route.ts` - remove hardcoded class ID (Step 3)
- [ ] Update `/api/teacher/classes/route.ts` - add grade validation (Step 4)
- [ ] Update `/api/teacher/schedule/route.ts` - verify data contract (Step 5)
- [ ] Update `/api/teacher/homeroom/route.ts` - update default class ID (Step 6)
- [ ] Test all API endpoints return grade 6-9 data
- [ ] Verify no hardcoded grade 10-12 references

## Success Criteria
- [ ] All API endpoints return grade 6-9 data
- [ ] No hardcoded '10A', '11A', '12A' class IDs remain
- [ ] Teacher dashboard uses dynamic class IDs
- [ ] Grade validation enforces 6-9 range
- [ ] API contract remains stable (no breaking changes)
- [ ] All API tests pass

## Conflict Prevention

### **How Phase 02 Avoids Conflicts:**
1. **Exclusive file ownership** - Only Phase 02 modifies API route files
2. **Read-only from Phase 01** - Does not modify `mock-data.ts`
3. **Stable API contract** - Maintains existing response formats
4. **Clear interface** - Exposes data, doesn't consume UI

### **API Contract Guarantees:**
```typescript
// Phase 02 guarantees stable API responses:
GET /api/classes → ClassDTO[]  // { id: '6A', grade: '6', ... }
GET /api/grades → { distribution, students }
GET /api/teacher/dashboard → { classId, stats, classes }
```

### **Integration with Other Phases:**
- **Phase 03 (Admin UI):** Reads API, doesn't modify routes
- **Phase 04 (Teacher UI):** Reads API, doesn't modify routes
- **Phase 05 (Pages):** Reads API, doesn't modify routes

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Hardcoded class ID missed | Medium | High | Teacher dashboard critical |
| API contract break | Low | High | Maintain response format |
| Grade validation missed | Low | Medium | Add validation layer |
| Data contract mismatch | Low | High | Verify Phase 01 output |

## Security Considerations
- Maintain existing authentication checks
- Preserve authorization rules
- No new security changes (data transformation only)

## Next Steps
1. Complete all implementation steps
2. Test API endpoints with curl/Postman
3. Verify responses contain grade 6-9 data
4. Mark phase complete for Phases 03-05 to consume
