---
phase: 02B
title: "Core Pages Update"
description: "Update Dashboard, Attendance, Grades pages to match wireframe specifications with new features"
estimated_time: 8h
parallel_with: [02A, 02C]
depends_on: [01]
exclusive_ownership: true
---

## Phase 02B: Core Pages Update

**Status:** PARALLEL with Phase 02A and 02C
**Group:** GROUP B
**Execution Order:** After Phase 01 completes

---

## Context Links

- [Main Plan](./plan.md)
- [Phase 01: Foundation](./phase-01-foundation.md) - PREREQUISITE
- [Wireframe Analysis](./research/wireframe-analysis.md)
- [Existing Implementation](./research/existing-implementation.md)
- [Development Rules](../../../.claude/workflows/development-rules.md)

---

## Overview

Update 3 core existing pages to match wireframe specifications:

1. **Dashboard** - Add grade review section, regular assessment summary, academic/conduct section, leave requests table, today's schedule sidebar
2. **Attendance** - Add status buttons (P/A/L/E), bulk actions, save/confirm workflow, auto-fill excused
3. **Grades** - Add grade formula display, TX1/TX2/TX3/GK/CK columns, average calculation, color coding, lock mechanism

**Parallelization:** These pages exist already - Phase 02B updates them exclusively. No overlap with 02A (new pages) or 02C (other existing pages).

---

## Parallelization Info

**Can Run With:** Phase 02A, Phase 02C
**Blocked By:** Phase 01
**Exclusive Ownership:** YES - Core page directories only

**Conflict Prevention:**
- Phase 02B updates `/teacher/dashboard/`, `/teacher/attendance/`, `/teacher/grades/`
- Phase 02A creates NEW directories (schedule, class-management, etc.)
- Phase 02C updates `/teacher/assessments/`, `/teacher/conduct/`, `/teacher/messages/`
- **Zero file overlap**

---

## Requirements

### 1. Dashboard Update

**Current:** Basic stats + schedule
**Target:** Full wireframe dashboard.html

**New Sections to Add:**
- **Grade Review Section:** Pending re-evaluation requests (GVBM) with student info, exam type, current score, reason, action button
- **Regular Assessment Section:** 4 stats cards (evaluated, pending, positive, needs attention) + quick link to assessment page
- **Academic & Conduct Rating Section:** Class rating summary (GVCN) with distribution
- **Leave Requests Table:** Pending leave approvals with student, dates, reason, approve/reject buttons
- **Today's Schedule:** Dark-themed sidebar showing teaching schedule

**Data Sources:**
- `getGradeReviewRequests()` - existing in mock-data.ts
- `getRegularAssessments()` - Phase 01
- `getLeaveRequests()` - existing in mock-data.ts
- `getTeacherSchedule()` - Phase 01

### 2. Attendance Update

**Current:** Basic class list
**Target:** Full wireframe attendance.html

**New Features:**
- **Status Buttons:** P (Present), A (Absent), L (Late), E (Excused) with color coding
- **Status Legend:** Show what each status means
- **Bulk Actions:** "Mark all present", "Auto-fill excused absences"
- **Notes Field:** Add notes for each student
- **Save/Confirm Workflow:** Save draft vs Confirm & Complete
- **Auto-fill Excused:** Fill E for students with approved leaves

**Data Source:** `getClassStudents()` - existing in mock-data.ts

### 3. Grades Update

**Current:** Basic grade entry
**Target:** Full wireframe grade-entry.html

**New Features:**
- **Grade Formula Display:** Show "ĐTB = (TX1 + TX2 + TX3) × 1 + GK × 2 + CK × 3 ÷ 8"
- **Grade Columns:** TX1, TX2, TX3 (1x weight), GK (2x weight), CK (3x weight)
- **Average Calculation:** Auto-calculate with real-time updates
- **Color Coding:** Excellent (≥8.0 green), Good (6.5-7.9 blue), Average (5.0-6.4 amber), Poor (<5.0 red)
- **Lock Status:** Show if grades are locked (admin only can unlock)
- **Class Statistics:** Excellent/Good/Average/Poor counts with percentages
- **Action Buttons:** Save draft, Download template, Import Excel, Lock grades

**Data Source:** `getGradeEntrySheet()` - existing in mock-data.ts

---

## Architecture

### Updated Directory Structure

```
apps/web/app/teacher/
├── dashboard/
│   └── page.tsx                  # UPDATE - Add new sections
├── attendance/
│   ├── page.tsx                  # UPDATE - Class list
│   └── [classId]/
│       └── page.tsx              # UPDATE - Status buttons + bulk actions
└── grades/
    ├── page.tsx                  # UPDATE - Class list with lock status
    └── [classId]/
        └── page.tsx              # UPDATE - Formula + columns + average + lock
```

### Component Reusability

**Reuse Existing:**
- Dashboard stats card pattern
- Table layouts
- Filter bar pattern
- Card components

**New Components Needed:**
- `AttendanceStatusButton` - P/A/L/E toggle with color coding
- `GradeInputCell` - Number input with validation (0-10, step 0.25)
- `GradeAverageDisplay` - Color-coded average badge
- `GradeLockStatus` - Lock/unlock indicator
- `GradeFormulaDisplay` - Show calculation formula

---

## Related Code Files (EXCLUSIVE OWNERSHIP)

### Modified By Phase 02B ONLY

| File | Type | Changes |
|------|------|---------|
| `apps/web/app/teacher/dashboard/page.tsx` | UPDATE | Add grade review, regular assessment, leave requests sections |
| `apps/web/app/teacher/attendance/page.tsx` | UPDATE | Class list (minor changes) |
| `apps/web/app/teacher/attendance/[classId]/page.tsx` | UPDATE | Add status buttons, bulk actions, save/confirm |
| `apps/web/app/teacher/grades/page.tsx` | UPDATE | Class list with lock status indicator |
| `apps/web/app/teacher/grades/[classId]/page.tsx` | UPDATE | Add formula, grade columns, average, statistics, lock mechanism |

**NO OTHER PHASE touches these directories.**

**Data Access (READ-ONLY):**
- `apps/web/lib/mock-data.ts` - Phase 01 extended functions

---

## File Ownership

### Exclusive to Phase 02B

**Updated Directories:**
- `/teacher/dashboard/` - Only Phase 02B updates
- `/teacher/attendance/` - Only Phase 02B updates
- `/teacher/grades/` - Only Phase 02B updates

**No Overlap:**
- Phase 02A creates NEW directories (schedule, class-management, etc.)
- Phase 02C updates `/teacher/assessments/`, `/teacher/conduct/`, `/teacher/messages/`
- **Zero file conflicts possible**

---

## Implementation Steps

### Step 1: Dashboard Update (3h)

**File:** `apps/web/app/teacher/dashboard/page.tsx`

**Current Structure:**
```tsx
export default async function TeacherDashboard() {
  const stats = await getTeacherStats()
  // ... existing code
}
```

**Add New Sections:**

```tsx
export default async function TeacherDashboard() {
  const stats = await getTeacherStats()
  const gradeReviews = await getGradeReviewRequests()
  const regularAssessments = await getRegularAssessments()
  const leaveRequests = await getLeaveRequests(stats.homeroomClassId)
  const schedule = await getTeacherSchedule()

  return (
    <div className="space-y-6 p-8">
      {/* Existing header */}
      <div>
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <p className="text-gray-500">Chào mừng giáo viên trở lại!</p>
      </div>

      {/* Existing stats grid - KEEP */}

      {/* NEW: Grade Review Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Phúc khảo điểm</CardTitle>
            <Badge variant="secondary">{gradeReviews.length} chờ xử lý</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {gradeReviews.length > 0 ? (
            <div className="space-y-3">
              {gradeReviews.map((review) => (
                <div key={review.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-bold">{review.studentName}</div>
                    <div className="text-sm text-gray-500">{review.className} - {review.examType}</div>
                    <div className="text-sm">Điểm hiện tại: <span className="font-bold">{review.currentScore}</span></div>
                    {review.reason && (
                      <div className="text-sm text-gray-600 mt-1">Lý do: {review.reason}</div>
                    )}
                  </div>
                  <Button size="sm">Xem chi tiết</Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">Không có phúc khảo nào</div>
          )}
        </CardContent>
      </Card>

      {/* NEW: Regular Assessment Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Đánh giá nhận xét</CardTitle>
            <Link href="/teacher/regular-assessment">
              <Button size="sm" variant="outline">Xem tất cả</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">
                  {regularAssessments.filter(a => a.status === 'evaluated').length}
                </div>
                <div className="text-sm text-green-700 font-bold">Đã đánh giá</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-amber-600">
                  {regularAssessments.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-sm text-amber-700 font-bold">Chưa đánh giá</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600">
                  {regularAssessments.filter(a => a.rating && a.rating >= 4).length}
                </div>
                <div className="text-sm text-blue-700 font-bold">Tiếp tục cố gắng</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600">
                  {regularAssessments.filter(a => a.status === 'needs-attention').length}
                </div>
                <div className="text-sm text-red-700 font-bold">Cần lưu ý</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* NEW: Leave Requests Table (GVCN only) */}
      {stats.homeroomClassId && (
        <Card>
          <CardHeader>
            <CardTitle>Đơn xin nghỉ phép</CardTitle>
          </CardHeader>
          <CardContent>
            {leaveRequests.filter(r => r.status === 'pending').length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Ngày nghỉ</TableHead>
                    <TableHead>Lý do</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests
                    .filter(r => r.status === 'pending')
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-bold">{request.studentName}</TableCell>
                        <TableCell>
                          {request.startDate} - {request.endDate}
                        </TableCell>
                        <TableCell>{request.reason}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Phê duyệt
                            </Button>
                            <Button size="sm" variant="destructive">
                              Từ chối
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-gray-400 py-8">Không có đơn chờ phê duyệt</div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Existing: My Classes, Messages, Quick Actions - KEEP */}

      {/* NEW: Today's Schedule Sidebar */}
      <Card className="bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-white">Lịch dạy hôm nay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedule.map((item) => (
              <div key={item.period} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center">
                  <div className="text-xl font-bold">{item.period}</div>
                </div>
                <div className="flex-1">
                  <div className="font-bold">{item.className}</div>
                  <div className="text-sm text-gray-400">{item.subject} - {item.room}</div>
                </div>
                <div className="text-sm text-gray-400">{item.time}</div>
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
- [ ] Grade review section displays
- [ ] Regular assessment stats cards show
- [ ] Leave requests table renders (GVCN)
- [ ] Today's schedule sidebar shows
- [ ] All sections use correct mock data
- [ ] Links to new pages work

### Step 2: Attendance Update (2.5h)

**File:** `apps/web/app/teacher/attendance/[classId]/page.tsx`

**New Features:**

```tsx
'use client'

import { useState } from 'react'

export default function AttendanceDetailPage({ params }: { params: { classId: string } }) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(/* fetch from API */)
  const [hasChanges, setHasChanges] = useState(false)

  // Status button colors
  const statusColors = {
    P: 'bg-green-100 text-green-700 border-green-300',
    A: 'bg-red-100 text-red-700 border-red-300',
    L: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    E: 'bg-blue-100 text-blue-700 border-blue-300',
  }

  const setStatus = (studentId: string, status: 'P' | 'A' | 'L' | 'E') => {
    setAttendance(prev =>
      prev.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      )
    )
    setHasChanges(true)
  }

  const markAllPresent = () => {
    setAttendance(prev => prev.map(record => ({ ...record, status: 'P' as const })))
    setHasChanges(true)
  }

  const autoFillExcused = () => {
    // Fill E for students with approved leaves
    setAttendance(prev =>
      prev.map(record =>
        record.approvedLeave ? { ...record, status: 'E' as const } : record
      )
    )
    setHasChanges(true)
  }

  const saveDraft = () => {
    // Save without confirming
    console.log('Saving draft...', attendance)
    setHasChanges(false)
  }

  const confirmAttendance = () => {
    // Finalize and send notifications
    console.log('Confirming attendance...', attendance)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">Điểm danh</h1>
        <p className="text-gray-500">{params.classId}</p>
      </div>

      {/* Filter Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select>
              <Option>10A1</Option>
              <Option>10A2</Option>
            </Select>
            <DatePicker />
            <Select>
              <Option>Sáng</Option>
              <Option>Chiều</Option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Status Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">P</div>
              <span className="text-sm">Có mặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">A</div>
              <span className="text-sm">Vắng mặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold">L</div>
              <span className="text-sm">Muộn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">E</div>
              <span className="text-sm">Có phép</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={markAllPresent}>
          Điểm danh tất cả có mặt
        </Button>
        <Button variant="outline" onClick={autoFillExcused}>
          Tự động điền có phép
        </Button>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MSSV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((record) => (
                <TableRow key={record.studentId}>
                  <TableCell>{record.studentCode}</TableCell>
                  <TableCell className="font-bold">{record.studentName}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {(['P', 'A', 'L', 'E'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatus(record.studentId, status)}
                          className={`w-10 h-10 rounded-lg font-bold transition-all ${
                            record.status === status
                              ? statusColors[status]
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Ghi chú..."
                      value={record.note || ''}
                      onChange={(e) => {
                        setAttendance(prev =>
                          prev.map(r =>
                            r.studentId === record.studentId
                              ? { ...r, note: e.target.value }
                              : r
                          )
                        )
                        setHasChanges(true)
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={saveDraft} disabled={!hasChanges}>
          Lưu nháp
        </Button>
        <Button onClick={confirmAttendance} disabled={!hasChanges}>
          Xác nhận hoàn thành
        </Button>
      </div>
    </div>
  )
}
```

**Validation:**
- [ ] Status buttons toggle correctly
- [ ] Color coding matches wireframe
- [ ] Bulk actions work
- [ ] Notes field saves
- [ ] Save/Confirm workflow functional
- [ ] Auto-fill excused works

### Step 3: Grades Update (2.5h)

**File:** `apps/web/app/teacher/grades/[classId]/page.tsx`

**New Features:**

```tsx
'use client'

import { useState } from 'react'

export default function GradeEntryPage({ params }: { params: { classId: string } }) {
  const [gradeSheet, setGradeSheet] = useState<GradeEntrySheet>(/* fetch from API */)
  const [isLocked, setIsLocked] = useState(false)

  // Calculate average
  const calculateAverage = (grades: GradeEntry['grades'][string]) => {
    const values = [grades.tx1, grades.tx2, grades.tx3, grades.gk, grades.ck]
    if (values.some(v => v === undefined || v === null)) return '--'

    const weights = [1, 1, 1, 2, 3]
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    const weightedSum = values.reduce((sum, val, i) => sum + (val! * weights[i]), 0)

    return (weightedSum / totalWeight).toFixed(2)
  }

  // Get color class for average
  const getAverageColor = (avg: string | number) => {
    if (avg === '--') return 'bg-gray-100 text-gray-400'
    const num = parseFloat(avg as string)
    if (num >= 8.0) return 'bg-green-100 text-green-700'
    if (num >= 6.5) return 'bg-blue-100 text-blue-700'
    if (num >= 5.0) return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-700'
  }

  // Calculate statistics
  const calculateStatistics = () => {
    const averages = gradeSheet.students
      .map(s => calculateAverage(s.grades))
      .filter(a => a !== '--')
      .map(a => parseFloat(a as string))

    return {
      excellent: averages.filter(a => a >= 8.0).length,
      good: averages.filter(a => a >= 6.5 && a < 8.0).length,
      average: averages.filter(a => a >= 5.0 && a < 6.5).length,
      poor: averages.filter(a => a < 5.0).length,
      classAverage: (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(2),
    }
  }

  const stats = calculateStatistics()

  const updateGrade = (studentId: string, field: string, value: string) => {
    const num = parseFloat(value)
    if (isNaN(num) || num < 0 || num > 10) return

    setGradeSheet(prev => ({
      ...prev,
      students: prev.students.map(student =>
        student.id === studentId
          ? {
              ...student,
              grades: {
                ...student.grades,
                [field]: num,
              },
            }
          : student
      ),
    }))
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">Nhập điểm số</h1>
        <p className="text-gray-500">{params.classId} - {gradeSheet.subject}</p>
      </div>

      {/* Filter Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select>
              <Option>Năm học 2024-2025</Option>
            </Select>
            <Select>
              <Option>Học kỳ 1</Option>
              <Option>Học kỳ 2</Option>
            </Select>
            <Select>
              <Option>10A1</Option>
            </Select>
            <Select>
              <Option>Toán</Option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Formula Display */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-sm font-bold text-blue-900">
            CÔNG THỨC TÍNH ĐIỂM TRUNG BÌNH
          </div>
          <div className="text-lg text-blue-800 mt-2">
            ĐTB = (TX1 + TX2 + TX3) × 1 + GK × 2 + CK × 3 ÷ 8
          </div>
        </CardContent>
      </Card>

      {/* Class Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-green-500">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600">{stats.excellent}</div>
            <div className="text-sm text-gray-500">Giỏi (≥8.0)</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-blue-500">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600">{stats.good}</div>
            <div className="text-sm text-gray-500">Khá (6.5-7.9)</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-amber-500">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-amber-600">{stats.average}</div>
            <div className="text-sm text-gray-500">Trung bình (5.0-6.4)</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-red-500">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-600">{stats.poor}</div>
            <div className="text-sm text-gray-500">Yếu (&lt;5.0)</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-purple-500">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600">{stats.classAverage}</div>
            <div className="text-sm text-gray-500">Điểm TB lớp</div>
          </CardContent>
        </Card>
      </div>

      {/* Lock Status */}
      <div className="flex justify-between items-center">
        <Badge variant={isLocked ? "destructive" : "default"}>
          {isLocked ? 'Đã khóa điểm' : 'Chưa khóa điểm'}
        </Badge>
        <Button
          variant={isLocked ? "outline" : "default"}
          onClick={() => setIsLocked(!isLocked)}
        >
          {isLocked ? 'Mở khóa điểm' : 'Khóa điểm'}
        </Button>
      </div>

      {/* Grade Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase sticky left-0 bg-gray-50">
                    MSSV
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase sticky left-24 bg-gray-50">
                    Họ và tên
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase">
                    TX1
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase">
                    TX2
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase">
                    TX3
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase">
                    GK (x2)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase">
                    CK (x3)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase">
                    ĐTB
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {gradeSheet.students.map((student) => {
                  const avg = calculateAverage(student.grades)
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-bold sticky left-0 bg-white">
                        {student.code}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold sticky left-24 bg-white">
                        {student.name}
                      </td>
                      {['tx1', 'tx2', 'tx3', 'gk', 'ck'].map((field) => (
                        <td key={field} className="px-2 py-4">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.25"
                            value={student.grades[field] || ''}
                            onChange={(e) => updateGrade(student.id, field, e.target.value)}
                            disabled={isLocked}
                            className={`w-full px-2 py-2 text-center font-bold rounded-lg border-2 ${
                              student.grades[field]
                                ? 'bg-green-50 border-green-300'
                                : 'bg-gray-50 border-gray-200'
                            } ${isLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          />
                        </td>
                      ))}
                      <td className="px-4 py-4">
                        <div className={`px-3 py-2 rounded-lg text-center font-bold ${getAverageColor(avg)}`}>
                          {avg}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline">Lưu nháp</Button>
        <Button variant="outline">Tải mẫu</Button>
        <Button variant="outline">Nhập Excel</Button>
        <Button>Lưu điểm</Button>
      </div>
    </div>
  )
}
```

**Validation:**
- [ ] Formula displays correctly
- [ ] Grade columns show (TX1, TX2, TX3, GK, CK)
- [ ] Average calculates correctly
- [ ] Color coding works (green/blue/amber/red)
- [ ] Statistics display accurately
- [ ] Lock mechanism prevents editing
- [ ] All inputs validate 0-10 range

---

## Conflict Prevention

### How Phase 02B Prevents Conflicts

1. **Exclusive Directory Ownership:**
   - Only Phase 02B modifies dashboard, attendance, grades
   - Phase 02A creates new directories only
   - Phase 02C modifies assessments, conduct, messages only

2. **Mock Data READ-ONLY:**
   - Phase 02B reads from mock-data.ts
   - Does not modify data structures

3. **Independent Features:**
   - Each page is self-contained
   - No shared components between phases
   - Navigation handled by Phase 01

---

## Risk Assessment

### Medium Risk

**Reason:** Updating existing pages could break current functionality

**Potential Issues:**
- **Breaking changes** to existing features
- **State management** complexity with new interactive features
- **Calculation errors** in grade averages

### Mitigation

- Keep existing features intact, only ADD new ones
- Test all existing functionality after updates
- Verify calculations with test data
- Run `npm run typecheck` frequently

---

## Testing Checklist

### Pre-Phase 02B Completion
- [ ] Dashboard has all new sections
- [ ] Attendance status buttons work
- [ ] Grade calculation accurate
- [ ] Lock mechanism functional
- [ ] No TypeScript errors
- [ ] Existing features still work
- [ ] Responsive design maintained

### Integration Testing (Phase 03)
- [ ] Dashboard links work
- [ ] Attendance save/confirm workflow
- [ ] Grade inputs validate correctly
- [ ] Statistics calculate accurately
- [ ] No broken navigation

---

## Component Library

### New Components to Create

**1. AttendanceStatusButton**
```tsx
interface AttendanceStatusButtonProps {
  status: 'P' | 'A' | 'L' | 'E'
  active: boolean
  onClick: () => void
}
```

**2. GradeInputCell**
```tsx
interface GradeInputCellProps {
  value?: number
  onChange: (value: number) => void
  disabled?: boolean
  min?: number
  max?: number
  step?: number
}
```

**3. GradeAverageDisplay**
```tsx
interface GradeAverageDisplayProps {
  average: string | number
}
```

**4. GradeLockStatus**
```tsx
interface GradeLockStatusProps {
  isLocked: boolean
  onToggle: () => void
}
```

---

## Handoff to Phase 03

**Git Commit:** "feat(teacher): update dashboard, attendance, grades to match wireframe specifications"

**Ready for merge:**
- All 3 pages updated with new features
- Existing features preserved
- No conflicts with 02A/02C expected

---

## Unresolved Questions

1. Grade lock - admin only or teacher can unlock?
2. Attendance confirm - should send notifications to parents?
3. Grade auto-save or manual save only?
4. Statistics calculation - real-time or on save?
