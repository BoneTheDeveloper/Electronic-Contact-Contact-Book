---
phase: 02A
title: "New Pages Implementation"
description: "Create 5 NEW pages: Teaching Schedule, Class Management, Regular Assessment, Homeroom Management, Leave Approval"
estimated_time: 8h
parallel_with: [02B, 02C]
depends_on: [01]
exclusive_ownership: true
---

## Phase 02A: New Pages Implementation

**Status:** PARALLEL with Phase 02B and 02C
**Group:** GROUP A
**Execution Order:** After Phase 01 completes

---

## Context Links

- [Main Plan](./plan.md)
- [Phase 01: Foundation](./phase-01-foundation.md) - PREREQUISITE
- [Wireframe Analysis](./research/wireframe-analysis.md)
- [Development Rules](../../../.claude/workflows/development-rules.md)

---

## Overview

Implement 5 NEW pages from wireframe specifications:

1. **Teaching Schedule** (Lịch giảng dạy) - Timeline view of daily schedule
2. **Class Management** (Quản lý lớp dạy) - Student roster management for subject classes
3. **Regular Assessment** (Đánh giá nhận xét) - Student evaluation with 3-state cards
4. **Homeroom Management** (Quản lý lớp CN) - Homeroom class roster and details
5. **Leave Approval** (Phê duyệt nghỉ phép) - Student leave request approval workflow

**Parallelization:** These pages are NEW - no conflicts with Phase 02B/02C which update existing pages.

---

## Parallelization Info

**Can Run With:** Phase 02B, Phase 02C
**Blocked By:** Phase 01
**Exclusive Ownership:** YES - New directories only

**Conflict Prevention:**
- Phase 02A creates NEW directories (schedule, class-management, etc.)
- Phase 02B updates EXISTING directories (dashboard, attendance, grades)
- Phase 02C updates EXISTING directories (assessments, conduct, messages)
- **Zero file overlap**

---

## Requirements

### 1. Teaching Schedule (Lịch giảng dạy)

**Reference:** Wireframe dashboard.html - "Today's Schedule" section

**Features:**
- Timeline view of daily teaching schedule
- Filter by date/week
- Show: Period, Time, Class, Subject, Room
- Color-coded by subject or grade level
- Empty states for free periods

**Data Source:** `getTeacherSchedule()` from Phase 01

### 2. Class Management (Quản lý lớp dạy)

**Reference:** Wireframe patterns for student lists

**Features:**
- Student roster for subject classes
- Filter by class
- Show: Student code, name, email, phone, status
- Search functionality
- Export to Excel
- Quick actions: View details, Send message

**Data Source:** `getClassManagementData(classId)` from Phase 01

### 3. Regular Assessment (Đánh giá nhận xét)

**Reference:** Wireframe regular-assessment.html

**Features:**
- **Filter Bar:** Class, Subject, Status (All/Pending/Evaluated/Needs Attention), Search
- **Summary Stats:** 4 gradient cards (evaluated count, pending, positive, needs attention)
- **Student Cards:**
  - **Evaluated (green border):** Comment, rating stars, date, edit button
  - **Pending (amber dashed border):** "Evaluate now" CTA
  - **Needs Attention (red border):** Warning, "Contact Parent" button
- **Rating Stars:** 1-5 interactive stars
- **Comment Categories:** Bài tập về nhà, Tiến bộ học tập, etc.

**Data Source:** `getRegularAssessments(teacherId, filters)` from Phase 01

### 4. Homeroom Management (Quản lý lớp CN)

**Reference:** Wireframe patterns for class rosters

**Features:**
- Class overview: Student count, male/female split, class monitor
- Student list with detailed info
- Show: Code, Name, DOB, Parent Name, Parent Phone, Address
- Search and filter
- Quick actions: Call parent, Send message, View student profile

**Data Source:** `getHomeroomClassData(classId)` from Phase 01

### 5. Leave Approval (Phê duyệt nghỉ phép)

**Reference:** Wireframe dashboard.html - "Leave Requests" section

**Features:**
- Pending leave requests list
- Request details: Student, dates, reason, parent contact
- Action buttons: Approve, Reject
- Approved/Rejected history
- Filter by status
- Notification to parents on approval/rejection

**Data Source:** `getLeaveApprovalRequests(classId, status)` from Phase 01

---

## Architecture

### New Directory Structure

```
apps/web/app/teacher/
├── schedule/
│   └── page.tsx                  # NEW - Teaching Schedule
├── class-management/
│   └── page.tsx                  # NEW - Class Management
├── regular-assessment/
│   └── page.tsx                  # NEW - Regular Assessment
├── homeroom/
│   └── page.tsx                  # NEW - Homeroom Management
└── leave-approval/
    └── page.tsx                  # NEW - Leave Approval
```

### Component Reusability

**Reuse Existing Patterns:**
- Dashboard stats card pattern
- Table layout from existing pages
- Filter bar pattern
- Card grid layout

**New Components Needed:**
- `ScheduleTimeline` - Timeline view for teaching schedule
- `StudentAssessmentCard` - 3-state evaluation card
- `RatingStars` - 1-5 star display/input
- `LeaveRequestCard` - Leave request with approve/reject actions

---

## Related Code Files (EXCLUSIVE OWNERSHIP)

### Created By Phase 02A ONLY

| File | Type | Purpose |
|------|------|---------|
| `apps/web/app/teacher/schedule/page.tsx` | NEW | Teaching schedule timeline |
| `apps/web/app/teacher/class-management/page.tsx` | NEW | Class roster management |
| `apps/web/app/teacher/regular-assessment/page.tsx` | NEW | Student evaluations |
| `apps/web/app/teacher/homeroom/page.tsx` | NEW | Homeroom class details |
| `apps/web/app/teacher/leave-approval/page.tsx` | NEW | Leave approval workflow |

**NO OTHER PHASE touches these directories.**

**Data Access (READ-ONLY):**
- `apps/web/lib/mock-data.ts` - Phase 01 extended functions

---

## File Ownership

### Exclusive to Phase 02A

**New Directories:**
- `/teacher/schedule/` - Only Phase 02A creates
- `/teacher/class-management/` - Only Phase 02A creates
- `/teacher/regular-assessment/` - Only Phase 02A creates
- `/teacher/homeroom/` - Only Phase 02A creates
- `/teacher/leave-approval/` - Only Phase 02A creates

**No Overlap:**
- Phase 02B updates `/teacher/dashboard/`, `/teacher/attendance/`, `/teacher/grades/`
- Phase 02C updates `/teacher/assessments/`, `/teacher/conduct/`, `/teacher/messages/`
- **Zero file conflicts possible**

---

## Implementation Steps

### Step 1: Teaching Schedule (1.5h)

**File:** `apps/web/app/teacher/schedule/page.tsx`

**Layout Structure:**
```tsx
export default async function TeachingSchedulePage() {
  const schedule = await getTeacherSchedule()

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Lịch giảng dạy</h1>
        <p className="text-gray-500">Xem lịch dạy theo tuần</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select>
              <Option>Tuần này</Option>
              <Option>Tuần tới</Option>
            </Select>
            <DatePicker />
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Thời khóa biểu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedule.map((item) => (
              <div key={item.period} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 text-center">
                  <div className="text-2xl font-bold text-sky-600">{item.period}</div>
                  <div className="text-xs text-gray-500">Tiết</div>
                </div>
                <div className="flex-1">
                  <div className="font-bold">{item.time}</div>
                  <div className="text-sm text-gray-500">{item.className} - {item.subject}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{item.room}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Validation:**
- [ ] Schedule displays in timeline format
- [ ] Period numbers prominent
- [ ] Time ranges clear
- [ ] Class and subject visible
- [ ] Room information shown

### Step 2: Class Management (1.5h)

**File:** `apps/web/app/teacher/class-management/page.tsx`

**Layout Structure:**
```tsx
export default async function ClassManagementPage() {
  const classes = await getTeacherClasses()

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">Quản lý lớp dạy</h1>
        <p className="text-gray-500">Quản lý danh sách học sinh các lớp giảng dạy</p>
      </div>

      {/* Class Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-600">{cls.name}</div>
                <div className="text-sm text-gray-500">{cls.subject}</div>
                <div className="text-xs text-gray-400 mt-2">{cls.studentCount} học sinh</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student List for Selected Class */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MSSV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Students from getClassManagementData(cls.id) */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Validation:**
- [ ] Class cards display
- [ ] Student list shows for selected class
- [ ] All columns render correctly
- [ ] Status badges visible

### Step 3: Regular Assessment (2.5h)

**File:** `apps/web/app/teacher/regular-assessment/page.tsx`

**Layout Structure:**
```tsx
export default async function RegularAssessmentPage() {
  const assessments = await getRegularAssessments()

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">Đánh giá nhận xét</h1>
        <p className="text-gray-500">Nhận xét học tập của học sinh</p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select placeholder="Lớp" />
            <Select placeholder="Môn học" />
            <Select placeholder="Trạng thái">
              <Option>Tất cả</Option>
              <Option>Đã đánh giá</Option>
              <Option>Chưa đánh giá</Option>
              <Option>Cần lưu ý</Option>
            </Select>
            <Input placeholder="Tìm kiếm học sinh..." />
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-green-500">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600">
              {assessments.filter(a => a.status === 'evaluated').length}
            </div>
            <div className="text-sm text-gray-500">Đã đánh giá</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-amber-500">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-amber-600">
              {assessments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">Chưa đánh giá</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-blue-500">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600">
              {assessments.filter(a => a.rating && a.rating >= 4).length}
            </div>
            <div className="text-sm text-gray-500">Tiếp tục cố gắng</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-red-500">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-600">
              {assessments.filter(a => a.status === 'needs-attention').length}
            </div>
            <div className="text-sm text-gray-500">Cần lưu ý</div>
          </CardContent>
        </Card>
      </div>

      {/* Student Cards */}
      <div className="space-y-4">
        {assessments.map((assessment) => (
          <StudentAssessmentCard key={assessment.studentId} assessment={assessment} />
        ))}
      </div>
    </div>
  )
}

// StudentAssessmentCard component
function StudentAssessmentCard({ assessment }: { assessment: RegularAssessment }) {
  if (assessment.status === 'evaluated') {
    return (
      <Card className="border-2 border-green-200">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-lg">{assessment.studentName}</div>
              <div className="text-sm text-gray-500">{assessment.className} - {assessment.subject}</div>
            </div>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(star => (
                <Star key={star} filled={star <= (assessment.rating || 0)} />
              ))}
            </div>
          </div>
          <div className="mt-4 p-4 bg-purple-50 rounded-xl">
            <div className="text-xs font-bold text-purple-600 uppercase">
              {assessment.comment?.category}
            </div>
            <div className="text-sm text-gray-700 mt-1">
              {assessment.comment?.content}
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Đánh giá ngày {assessment.createdAt}
            </div>
            <Button size="sm" variant="outline">Chỉnh sửa</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (assessment.status === 'pending') {
    return (
      <Card className="border-2 border-dashed border-amber-300">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-lg">{assessment.studentName}</div>
              <div className="text-sm text-gray-500">{assessment.className} - {assessment.subject}</div>
            </div>
            <Button size="sm">Đánh giá ngay</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // needs-attention state
  return (
    <Card className="border-2 border-red-200">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-bold text-lg text-red-600">{assessment.studentName}</div>
            <div className="text-sm text-gray-500">{assessment.className} - {assessment.subject}</div>
          </div>
          <Button size="sm" variant="destructive">Liên hệ PH</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Validation:**
- [ ] Summary stats cards render
- [ ] Evaluated cards show green border
- [ ] Pending cards show amber dashed border
- [ ] Needs attention cards show red border
- [ ] Star ratings display correctly
- [ ] Comment sections show

### Step 4: Homeroom Management (1h)

**File:** `apps/web/app/teacher/homeroom/page.tsx`

**Layout Structure:**
```tsx
export default async function HomeroomPage() {
  const homeroomData = await getHomeroomClassData('10A1')

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">Quản lý lớp chủ nhiệm</h1>
        <p className="text-gray-500">{homeroomData.className}</p>
      </div>

      {/* Class Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-sky-600">{homeroomData.studentCount}</div>
            <div className="text-sm text-gray-500">Tổng số</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600">{homeroomData.maleCount}</div>
            <div className="text-sm text-gray-500">Nam</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-pink-600">{homeroomData.femaleCount}</div>
            <div className="text-sm text-gray-500">Nữ</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-lg font-bold text-purple-600">{homeroomData.classMonitor}</div>
            <div className="text-sm text-gray-500">Lớp trưởng</div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MSSV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Phụ huynh</TableHead>
                <TableHead>SĐT PH</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homeroomData.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.code}</TableCell>
                  <TableCell className="font-bold">{student.name}</TableCell>
                  <TableCell>{student.dob}</TableCell>
                  <TableCell>{student.parentName}</TableCell>
                  <TableCell>{student.parentPhone}</TableCell>
                  <TableCell>{student.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Gọi</Button>
                      <Button size="sm" variant="outline">Nhắn tin</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Validation:**
- [ ] Class overview stats display
- [ ] Student list table renders
- [ ] All columns visible
- [ ] Action buttons present

### Step 5: Leave Approval (1.5h)

**File:** `apps/web/app/teacher/leave-approval/page.tsx`

**Layout Structure:**
```tsx
export default async function LeaveApprovalPage() {
  const pendingRequests = await getLeaveApprovalRequests('10A1', 'pending')
  const allRequests = await getLeaveApprovalRequests('10A1')

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">Phê duyệt nghỉ phép</h1>
        <p className="text-gray-500">Xét duyệt đơn xin nghỉ của học sinh</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button variant="default">Chờ phê duyệt ({pendingRequests.length})</Button>
        <Button variant="outline">Lịch sử</Button>
      </div>

      {/* Leave Request Cards */}
      <div className="space-y-4">
        {pendingRequests.map((request) => (
          <Card key={request.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-lg">{request.studentName}</div>
                  <div className="text-sm text-gray-500">{request.className}</div>
                  <div className="mt-2 text-sm">
                    <span className="font-bold">Thời gian:</span> {request.startDate} - {request.endDate}
                  </div>
                  <div className="text-sm">
                    <span className="font-bold">Lý do:</span> {request.reason}
                  </div>
                  <div className="text-sm">
                    <span className="font-bold">Liên hệ:</span> {request.parentContact}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-red-600">
                    Từ chối
                  </Button>
                  <Button size="sm">
                    Phê duyệt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {pendingRequests.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-gray-400">Không có đơn chờ phê duyệt</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

**Validation:**
- [ ] Pending requests display
- [ ] Request details show correctly
- [ ] Approve/Reject buttons work
- [ ] Empty state displays
- [ ] Tab switching works

---

## Conflict Prevention

### How Phase 02A Prevents Conflicts

1. **New Directories Only:**
   - Phase 02A creates NEW directories
   - Phase 02B/02C update EXISTING directories
   - Zero file overlap

2. **Mock Data READ-ONLY:**
   - Phase 02A reads from mock-data.ts (extended by Phase 01)
   - Does not modify mock-data.ts
   - Other phases also read-only

3. **Independent Navigation:**
   - Each page has unique route
   - No shared components between phases
   - Navigation updated by Phase 01 only

---

## Risk Assessment

### Low Risk

**Reason:** New pages only, no existing code to break

**Potential Issues:**
- **Type errors** - TypeScript catches immediately
- **Missing mock data** - Phase 01 provides all functions
- **Styling inconsistency** - Follow existing patterns

### Mitigation

- Use existing page structure as template
- Copy styling from similar pages
- Run `npm run typecheck` frequently

---

## Testing Checklist

### Pre-Phase 02A Completion
- [ ] All 5 pages render without errors
- [ ] Navigation links to new pages work
- [ ] Mock data displays correctly
- [ ] All filters/buttons functional
- [ ] No TypeScript errors
- [ ] Responsive design works
- [ ] Wireframe patterns matched

### Integration Testing (Phase 03)
- [ ] Navigation from sidebar to all 5 pages
- [ ] Links from dashboard to new pages work
- [ ] No broken images or icons
- [ ] All filters functional
- [ ] Data displays correctly

---

## Component Library

### New Components to Create

**1. ScheduleTimeline**
```tsx
interface ScheduleTimelineProps {
  schedule: ScheduleItem[]
}
```

**2. StudentAssessmentCard**
```tsx
interface StudentAssessmentCardProps {
  assessment: RegularAssessment
  onEvaluate?: (studentId: string) => void
  onEdit?: (studentId: string) => void
  onContactParent?: (studentId: string) => void
}
```

**3. RatingStars**
```tsx
interface RatingStarsProps {
  rating: number
  interactive?: boolean
  onChange?: (rating: number) => void
}
```

**4. LeaveRequestCard**
```tsx
interface LeaveRequestCardProps {
  request: LeaveRequestApproval
  onApprove?: (requestId: string) => void
  onReject?: (requestId: string) => void
}
```

---

## Handoff to Phase 03

**Git Commit:** "feat(teacher): add 5 new pages - schedule, class-management, regular-assessment, homeroom, leave-approval"

**Ready for merge:**
- All 5 pages functional
- Navigation links work
- Mock data integrated
- No conflicts with 02B/02C expected

---

## Unresolved Questions

1. Should evaluation modal be inline or separate page?
2. Rating stars - click to rate or display only?
3. Leave approval - should send notification to parent?
4. Export to Excel functionality needed?
