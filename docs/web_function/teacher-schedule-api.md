# Teacher Schedule API Documentation

## Overview

Get teacher schedule by date. Returns class periods, times, subjects, and room assignments.

## API Endpoint

```
GET /api/teacher/schedule
```

## Query Parameters

| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| teacherId | string | No       | Teacher UUID. Returns empty array if omitted |
| date      | string | No       | Date in ISO format (YYYY-MM-DD). Defaults to today |

## Response

```typescript
{
  success: true,
  data: TeacherScheduleItem[]
}
```

### TeacherScheduleItem Type

```typescript
interface TeacherScheduleItem {
  period: number      // Period ID (1-8)
  time: string        // Time range (e.g. "07:30:00 - 08:15:00")
  className: string   // Class name (e.g. "10A1")
  subject: string     // Subject name (e.g. "Toán")
  room: string        // Room number (e.g. "201")
  date: string        // Date in ISO format (YYYY-MM-DD)
}
```

## Usage Examples

### Fetch Schedule for Today

```typescript
const response = await fetch('/api/teacher/schedule?teacherId=abc-123')
const { data } = await response.json()
```

### Fetch Schedule for Specific Date

```typescript
const response = await fetch('/api/teacher/schedule?teacherId=abc-123&date=2026-01-25')
const { data } = await response.json()
```

### Using the Query Function Directly

```typescript
import { getTeacherSchedule } from '@/lib/supabase/queries'

// Get today's schedule
const schedule = await getTeacherSchedule('teacher-id-123')

// Get schedule for specific date
const schedule = await getTeacherSchedule('teacher-id-123', '2026-01-25')
```

## Implementation Details

- **Location**: `apps/web/app/api/teacher/schedule/route.ts`
- **Query Function**: `apps/web/lib/supabase/queries.ts:1004`
- **Database Tables**: `schedules`, `periods`, `classes`, `subjects`
- **Caching**: Uses React `cache()` for performance

## Database Query

```typescript
const { data } = await supabase
  .from('schedules')
  .select(`
    period_id,
    room,
    day_of_week,
    periods!inner(id, name, start_time, end_time),
    classes!inner(id, name),
    subjects!inner(id, name)
  `)
  .eq('teacher_id', teacherId)
  .eq('day_of_week', dayOfWeek)
  .order('period_id')
```

## Day of Week Mapping

| Date Day | day_of_week Value |
|----------|-------------------|
| Sunday   | 0                 |
| Monday   | 1                 |
| Tuesday  | 2                 |
| Wednesday| 3                 |
| Thursday | 4                 |
| Friday   | 5                 |
| Saturday | 6                 |

## Error Handling

Returns empty array `[]` when:
- `teacherId` is not provided
- No schedule found for the given date/day

## Related Functions

- `getTeacherStats()` - Includes today's schedule in teacher stats
- `getTeacherClasses()` - Get all classes assigned to a teacher
