# Teacher Portal - Existing Implementation Research

**Date:** 2026-01-15
**Status:** Complete
**Focus:** Analyze teacher-temp implementation for reuse/extension

---

## Directory Structure

```
apps/web/app/teacher-temp/
├── layout.tsx                 # Teacher layout wrapper
├── dashboard/
│   └── page.tsx              # Dashboard with stats, schedule, quick actions
├── attendance/
│   ├── page.tsx              # Class list for attendance
│   └── [classId]/page.tsx    # Attendance marking for specific class
├── grades/
│   ├── page.tsx              # Class list for grade entry
│   └── [classId]/page.tsx    # Grade entry sheet
├── assessments/
│   ├── page.tsx              # Assessment list
│   └── [id]/page.tsx         # Assessment detail
├── conduct/
│   └── page.tsx              # Conduct ratings (GVCN only)
└── messages/
    └── page.tsx              # Parent conversations
```

---

## Components Available

### UI Components (`apps/web/components/ui/`)
- **Card** - Container with variants (Card, CardHeader, CardTitle, CardContent, CardFooter)
- **Button** - Variants: default, destructive, outline, secondary, ghost, link; Sizes: sm, default, lg, icon
- **Badge** - Status indicators
- **Input** - Form inputs
- **Textarea** - Multi-line inputs
- **Table** - Data tables

### Layout Components (`apps/web/components/layout/`)
- **Sidebar** - Role-based navigation (admin/teacher), 280px width, sticky
- **Header** - Top bar with user info

### Icons Used
- Lucide React icons: Users, Calendar, FileText, Clock, CheckCircle, AlertCircle, BookOpen, TrendingUp, MessageSquare

---

## Mock Data Available (`lib/mock-data.ts`)

### Teacher-Specific Functions (Lines 302-761)

| Function | Returns | Usage |
|----------|---------|-------|
| `getTeacherClasses(teacherId?)` | TeacherClass[] | All classes taught by teacher |
| `getTeacherStats(teacherId?)` | TeacherStats | Dashboard stats + today's schedule |
| `getClassStudents(classId)` | AttendanceRecord[] | Students for attendance marking |
| `getGradeEntrySheet(classId, subject)` | {students, subject} | Grade entry data |
| `getAssessments(teacherId?)` | Assessment[] | Teacher's assessments |
| `getConductRatings(classId, semester)` | ConductRating[] | Conduct ratings (GVCN) |
| `getTeacherConversations(teacherId?)` | Conversation[] | Parent message threads |
| `getConversationMessages(conversationId)` | Message[] | Messages in thread |
| `getGradeReviewRequests(teacherId?)` | GradeReview[] | Re-grade requests |
| `getLeaveRequests(classId, status?)` | LeaveRequest[] | Student leave requests |

### Data Types Defined
- **TeacherClass**: id, name, subject, grade, room, studentCount, schedule, isHomeroom
- **TeacherStats**: teaching count, homeroom count, students, pending items, todaySchedule
- **ScheduleItem**: period, time, className, subject, room
- **AttendanceRecord**: studentId, studentName, status (present/absent/late/excused), note
- **GradeEntry**: studentId, studentName, oral[], quiz[], midterm, final
- **Assessment**: id, classId, className, subject, type (quiz/midterm/final/oral), name, date, maxScore, submittedCount, totalCount, status
- **ConductRating**: studentId, studentName, academicRating, conductRating, semester, notes
- **Conversation**: id, parentName, studentName, lastMessage, timestamp, unreadCount
- **LeaveRequest**: id, studentId, studentName, startDate, endDate, reason, status, submittedDate

---

## Implementation Patterns

### Page Structure Pattern
```tsx
// All pages follow same pattern:
export default async function PageName() {
  const data = await getMockDataFunction()

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Page Title</h1>
        <p className="text-gray-500">Subtitle/description</p>
      </div>

      {/* Content with Cards */}
      <Card>
        <CardHeader><CardTitle>Section Title</CardTitle></CardHeader>
        <CardContent>{/* Content */}</CardContent>
      </Card>
    </div>
  )
}
```

### Styling Patterns
- **Primary color:** Sky/Blue (#0284C7)
- **Typography:** font-black for headings, font-bold for emphasis, font-medium for labels
- **Spacing:** space-y-6 for sections, p-8 for page padding, gap-4/6 for grids
- **Cards:** rounded-xl border bg-white shadow-sm with border-l-4 for emphasis
- **Buttons:** Sky-600 for primary, outline for secondary
- **Text sizes:** text-2xl (page title), text-lg (section title), text-sm (content), text-xs (labels)

### Navigation Pattern
- Role-based via `Sidebar` component
- Active state: bg-[rgba(2,132,199,0.1)] text-[#0284C7] with left border indicator
- Sections: "Chính" (Main), "Lớp học" (Classes), "Giao tiếp" (Communication)

---

## Files Requiring Rename (teacher-temp → teacher)

### Directories
- `apps/web/app/teacher-temp/` → `apps/web/app/teacher/`

### Sidebar Navigation
- `apps/web/components/layout/Sidebar.tsx` (lines 37-59)
  - Update all hrefs from `/teacher-temp/*` to `/teacher/*`

### Internal Links in Pages
- Dashboard: links to `/teacher/assessments`, `/teacher/grades`, `/teacher/attendance`, `/teacher/messages`
- Attendance: links to `/teacher/attendance/${cls.id}`
- Grades: links to `/teacher/grades/${cls.id}`

---

## Features Already Implemented

### ✅ Dashboard
- Stats cards (teaching classes, grade reviews, leave requests, grades entered)
- Today's schedule (timeline view)
- Grade review requests list
- Leave requests table (GVCN)
- My classes grid
- Messages widget
- Quick actions

### ✅ Attendance
- Class list with cards
- Class detail view (assumed in [classId]/page.tsx)

### ✅ Grades
- Class list for grade entry
- Grade entry sheet (assumed in [classId]/page.tsx)

### ✅ Assessments
- Assessment list view
- Assessment detail (assumed in [id]/page.tsx)

### ✅ Conduct
- Conduct ratings page (GVCN feature)

### ✅ Messages
- Parent conversation list

---

## Reusable Patterns for New Features

### Card Layouts
1. **Stat cards** with border-l-4 color coding + icon
2. **Section cards** with CardHeader title + CardContent body
3. **Grid cards** for class/item lists with hover effects
4. **Dark cards** for schedule/timeline views

### Table Pattern
```tsx
<table className="w-full text-left">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        Column Name
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-100">
    {items.map(item => (
      <tr key={item.id}>
        <td className="px-4 py-4 font-bold text-sm text-gray-700">{item.value}</td>
      </tr>
    ))}
  </tbody>
</table>
```

### List Item Pattern
```tsx
<div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-all border border-transparent hover:border-blue-200">
  <div className="flex items-center gap-4">
    {/* Avatar/icon */}
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-gray-400 border border-gray-200 shadow-sm">
      {initials}
    </div>
    {/* Info */}
    <div>
      <p className="text-sm font-bold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
  {/* Actions */}
  <div className="flex items-center gap-3">
    <Button variant="outline" size="sm">Secondary</Button>
    <Button size="sm">Primary</Button>
  </div>
</div>
```

---

## Unresolved Questions

1. **Authentication:** How is `requireAuth()` implemented? What's the auth flow?
2. **API Integration:** When will mock data be replaced with real API calls?
3. **State Management:** How will form submissions be handled? Server actions?
4. **Role Permissions:** How to differentiate GVCN vs GVBM permissions?
5. **Real-time Updates:** Will messages/attendance need real-time features?
6. **Date Handling:** Library choice for date formatting (currently using native Date)?
7. **Form Validation:** Validation library choice (zod? react-hook-form?)?

---

## Recommendations

### For Rename (teacher-temp → teacher)
1. Rename directory first
2. Update Sidebar.tsx navigation hrefs
3. Update all internal links in pages
4. Test navigation flow

### For New Features
1. Follow existing page structure pattern
2. Extend mock data functions in lib/mock-data.ts
3. Reuse Card components with established styling
4. Add new icons from lucide-react as needed
5. Maintain consistent color scheme (sky-600 primary)
6. Use grid layouts for responsive design

### Data Extensions Needed
- Teacher profile/settings data
- Subject-specific data structure
- Period/semester configuration
- School calendar data
- Document/file storage references
