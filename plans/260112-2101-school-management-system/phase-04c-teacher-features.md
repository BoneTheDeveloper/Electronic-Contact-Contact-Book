---
title: "Phase 04C: Teacher Portal Features"
description: "Teacher dashboard, attendance, grades, chat functionality"
status: pending
priority: P1
effort: 4h
created: 2026-01-12
---

# Phase 04C: Teacher Portal Features

## Context Links
- Parent: [plan.md](./plan.md)
- Depends: [phase-02b](./phase-02b-web-core.md), [phase-03](./phase-03-shared-ui-design-system.md)
- Wireframes: [Teacher dashboard](../../docs/wireframe/Web_app/Teacher/dashboard.html)

## Parallelization Info
- **Can run with**: Phases 04A, 04B, 04D (different platforms/features)
- **Must complete after**: Phases 02B, 03
- **Exclusive files**: `apps/web/app/(teacher)/*`, `apps/web/components/teacher/*`

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | Pending |
| Description | Teacher portal with attendance, grades, assessments, chat |
| Review Status | Not Started |

## Key Insights
- Teacher needs class-specific views
- Grade entry with form validation
- Attendance marking by date
- Chat with parents

## Requirements
- Next.js server components
- shadcn/ui form components
- Recharts for class analytics

## Architecture

### Page Structure
```
app/(teacher)/
├── page.tsx              # Teacher dashboard (classes, stats)
├── attendance/
│   ├── page.tsx          # Class list for attendance
│   └── [classId]/page.tsx # Mark attendance by date
├── grades/
│   ├── page.tsx          # Grade entry list
│   └── [classId]/page.tsx # Enter grades for class
├── assessments/
│   ├── page.tsx          # Assessment list
│   └── [id]/page.tsx     # Create/edit assessment
├── conduct/
│   └── page.tsx          # Academic conduct ratings
└── messages/
    └── page.tsx          # Chat with parents
```

## File Ownership

### Files to Create (Exclusive to 04C)
| File | Owner |
|------|-------|
| `apps/web/app/(teacher)/page.tsx` | Phase 04C |
| `apps/web/app/(teacher)/attendance/*` | Phase 04C |
| `apps/web/app/(teacher)/grades/*` | Phase 04C |
| `apps/web/app/(teacher)/assessments/*` | Phase 04C |
| `apps/web/app/(teacher)/conduct/*` | Phase 04C |
| `apps/web/app/(teacher)/messages/*` | Phase 04C |
| `apps/web/components/teacher/*` | Phase 04C |

## Implementation Steps

1. **Build Teacher Dashboard**
   ```typescript
   // app/(teacher)/page.tsx
   import { getTeacherClasses, getTeacherStats } from '@/lib/mock-data'

   export default async function TeacherDashboard() {
     const classes = await getTeacherClasses()
     const stats = await getTeacherStats()

     return (
       <div className="p-8 space-y-8">
         <h1 className="text-2xl font-extrabold">Teacher Dashboard</h1>

         {/* Teacher Stats */}
         <div className="grid grid-cols-4 gap-6">
           <StatCard label="Lớp chủ nhiệm" value={stats.homeroom} />
           <StatCard label="Lớp dạy" value={stats.teaching} />
           <StatCard label="Học sinh" value={stats.students} />
           <StatCard label="Điểm danh chưa làm" value={stats.pendingAttendance} />
         </div>

         {/* Class Cards */}
         <div className="grid md:grid-cols-3 gap-6">
           {classes.map(cls => (
             <TeacherClassCard key={cls.id} class={cls} />
           ))}
         </div>

         {/* Today's Schedule */}
         <TodaySchedule schedule={stats.todaySchedule} />
       </div>
     )
   }
   ```

2. **Create Attendance Management**
   ```typescript
   // app/(teacher)/attendance/page.tsx
   import { getTeacherClasses } from '@/lib/mock-data'

   export default async function AttendanceListPage() {
     const classes = await getTeacherClasses()

     return (
       <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">Điểm danh</h1>
         <div className="grid md:grid-cols-3 gap-6">
           {classes.map(cls => (
             <AttendanceClassCard
               key={cls.id}
               class={cls}
               href={`/teacher/attendance/${cls.id}`}
             />
           ))}
         </div>
       </div>
     )
   }
   ```

   ```typescript
   // app/(teacher)/attendance/[classId]/page.tsx
   import { getClassStudents } from '@/lib/mock-data'
   import { AttendanceForm } from '@/components/teacher/AttendanceForm'

   export default async function ClassAttendancePage({ params }) {
     const students = await getClassStudents(params.classId)
     const cls = await getClass(params.classId)

     return (
       <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">
           Điểm danh - {cls.name}
         </h1>
         <AttendanceForm students={students} date={new Date()} />
       </div>
     )
   }
   ```

3. **Create Grade Entry**
   ```typescript
   // app/(teacher)/grades/page.tsx
   export default async function GradesListPage() {
     const classes = await getTeacherClasses()

     return (
       <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">Quản lý Điểm số</h1>
         <div className="grid md:grid-cols-3 gap-6">
           {classes.map(cls => (
             <GradeClassCard
               key={cls.id}
               class={cls}
               subject="Toán"
               href={`/teacher/grades/${cls.id}`}
             />
           ))}
         </div>
       </div>
     )
   }
   ```

   ```typescript
   // app/(teacher)/grades/[classId]/page.tsx
   import { getGradeEntrySheet } from '@/lib/mock-data'
   import { GradeEntryForm } from '@/components/teacher/GradeEntryForm'

   export default async function ClassGradesPage({ params }) {
     const { students, subject } = await getGradeEntrySheet(params.classId)

     return (
       <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">
           Nhập điểm - {subject}
         </h1>
         <GradeEntryForm students={students} />
       </div>
     )
   }
   ```

4. **Create Assessments**
   ```typescript
   // app/(teacher)/assessments/page.tsx
   import { getAssessments } from '@/lib/mock-data'

   export default async function AssessmentsPage() {
     const assessments = await getAssessments()

     return (
       <div className="p-8">
         <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold">Đánh giá thường xuyên</h1>
           <Button>Tạo bài kiểm tra mới</Button>
         </div>
         <AssessmentTable assessments={assessments} />
       </div>
     )
   }
   ```

5. **Create Conduct Ratings**
   ```typescript
   // app/(teacher)/conduct/page.tsx
   import { getTeacherClasses } from '@/lib/mock-data'

   export default async function ConductPage() {
     const classes = await getTeacherClasses()

     return (
       <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">Rèn luyện</h1>
         <div className="grid md:grid-cols-2 gap-6">
           {classes.map(cls => (
             <ConductCard key={cls.id} class={cls} />
           ))}
         </div>
       </div>
     )
   }
   ```

6. **Create Messages/Chat**
   ```typescript
   // app/(teacher)/messages/page.tsx
   import { getTeacherConversations } from '@/lib/mock-data'
   import { ConversationList } from '@/components/teacher/ConversationList'
   import { ChatWindow } from '@/components/teacher/ChatWindow'

   export default async function MessagesPage() {
     const conversations = await getTeacherConversations()

     return (
       <div className="flex h-screen">
         <ConversationList conversations={conversations} />
         <ChatWindow />
       </div>
     )
   }
   ```

7. **Create Teacher Components**
   ```typescript
   // components/teacher/AttendanceForm.tsx
   'use client'

   export function AttendanceForm({ students, date }) {
     const [attendance, setAttendance] = useState(
       students.map(s => ({ studentId: s.id, status: 'present' }))
     )

     const handleSubmit = async () => {
       // Save attendance
     }

     return (
       <form action={handleSubmit}>
         <table className="w-full">
           {students.map(student => (
             <tr key={student.id}>
               <td>{student.name}</td>
               <td>
                 <select onChange={(e) => updateStatus(student.id, e.target.value)}>
                   <option value="present">Có mặt</option>
                   <option value="absent">Vắng</option>
                   <option value="late">Trễ</option>
                   <option value="excused">Vắng có phép</option>
                 </select>
               </td>
             </tr>
           ))}
         </table>
         <Button type="submit">Lưu điểm danh</Button>
       </form>
     )
   }
   ```

   ```typescript
   // components/teacher/GradeEntryForm.tsx
   'use client'

   export function GradeEntryForm({ students }) {
     const [grades, setGrades] = useState(
       students.map(s => ({ studentId: s.id, score: '' }))
     )

     return (
       <form>
         <table className="w-full">
           <thead>
             <tr>
               <th>Học sinh</th>
               <th>Điểm miệng</th>
               <th>Điểm 15 phút</th>
               <th>Điểm 1 tiết</th>
               <th>Điểm học kỳ</th>
             </tr>
           </thead>
           <tbody>
             {students.map(student => (
               <tr key={student.id}>
                 <td>{student.name}</td>
                 <td><GradeInput studentId={student.id} type="oral" /></td>
                 <td><GradeInput studentId={student.id} type="quiz" /></td>
                 <td><GradeInput studentId={student.id} type="midterm" /></td>
                 <td><GradeInput studentId={student.id} type="final" /></td>
               </tr>
             ))}
           </tbody>
         </table>
         <Button type="submit">Lưu điểm</Button>
       </form>
     )
   }
   ```

## Todo List
- [ ] Build teacher dashboard page
- [ ] Create StatsGrid for teacher
- [ ] Build attendance list page
- [ ] Build attendance marking page
- [ ] Build grades list page
- [ ] Build grade entry page
- [ ] Build assessments page
- [ ] Build conduct ratings page
- [ ] Build messages/chat page
- [ ] Create AttendanceForm component
- [ ] Create GradeEntryForm component
- [ ] Create ChatWindow component

## Success Criteria
- Teacher dashboard shows their classes
- Attendance form saves mock data
- Grade entry form validates inputs (0-10)
- Chat displays message history
- Navigation between teacher pages works

## Conflict Prevention
- Exclusive ownership of `apps/web/app/(teacher)/*`
- No overlap with Phase 02B (that was setup only)
- No overlap with Phase 04B (admin is separate route group)

## Risk Assessment
| Risk | Mitigation |
|------|-----------|
| Form state complexity | Use React Hook Form |
| Grade validation | Client-side + server validation |
| Chat real-time needs | Mock static messages for MVP |

## Security Considerations
- Teachers can only access their classes
- Grade changes should be logged (mock for MVP)
- Chat messages should be filtered

## Next Steps
- Phase 05 (Integration) - test teacher workflows
- Phase 05 (Testing) - verify all teacher features
