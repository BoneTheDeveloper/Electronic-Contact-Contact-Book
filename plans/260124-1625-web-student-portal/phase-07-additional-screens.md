# Phase 07: Additional Screens

**Status:** Pending
**Priority:** Low
**Dependencies:** Phase 01, Phase 02

## Overview

Implement the remaining student screens: Leave Request, Study Materials, and Summary. These complete the full student portal feature set.

## Context Links

- [Leave Request Wireframe](../../../docs/wireframe/Mobile/student/leave-request.html)
- [Summary Wireframe](../../../docs/wireframe/Mobile/student/summary.html)
- [Design Guidelines](../../../docs/mobile_function/web-student-portal-design.md)

## Key Insights

1. Leave Request has form + history with appeal flow
2. Summary aggregates data from other screens
3. Study Materials is document download list

## Requirements

### Leave Request (`/student/leave`)
- Tab switcher (Create New | History)
- Form: Leave type, reason, date range
- Request history with status badges
- Appeal modal for approved requests

### Summary (`/student/summary`)
- Semester selector
- Overall score with circular progress
- Stats grid (attendance, conduct)
- Subject breakdown with progress bars

### Study Materials (`/student/materials`)
- Subject/grouped list
- Downloadable files
- File type icons

## Implementation Steps

### Step 1: Leave Request Screen

**Data Structure:**
```tsx
interface LeaveRequest {
  id: string;
  studentId: string;
  leaveType: 'family' | 'sick' | 'holiday' | 'personal' | 'other';
  reason: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  processedAt?: Date;
  canAppeal: boolean;
}
```

**Components:**
1. `TabSwitcher` - Create New | History
2. `LeaveRequestForm` - Type, reason, dates
3. `RequestHistoryCard` - With status badge
4. `AppealModal` - For approved requests

**Leave Types:**
- Đi gia đình (family)
- Ốm đau (sick)
- Lễ tết (holiday)
- Việc cá nhân (personal)
- Khác (other)

**Status Badges:**
- Pending: amber
- Approved: emerald
- Rejected: red

**Appeal Flow:**
1. Click "Phúc khảo" on approved request
2. Modal opens with appeal form
3. Select appeal reason, enter details
4. Submit appeal request

### Step 2: Summary Screen

**Data Structure:**
```tsx
interface Summary {
  studentId: string;
  semester: string;
  overallGPA: number;
  rank: number;
  totalStudents: number;
  classification: string;  // 'Giỏi', 'Khá', etc.
  attendanceRate: number;
  attendanceTotal: number;
  attendancePresent: number;
  conductScore: number;
  conductClassification: string;
  subjects: SubjectSummary[];
}

interface SubjectSummary {
  subjectId: string;
  subjectName: string;
  shortName: string;
  color: string;
  average: number;
  classification: string;
}
```

**Components:**
1. `SemesterSelector` - HK I | Cả năm
2. `OverallScoreCard` - Circular progress
3. `StatsGrid` - 2x2 cards
4. `SubjectProgressCard` - With progress bar

**Circular Progress:**
- SVG with stroke-dasharray animation
- Center shows percentage
- Gradient stroke (indigo)

**Progress Bar:**
- Gray background
- Colored fill (width = %)
- Rounded caps

### Step 3: Study Materials Screen

**Data Structure:**
```tsx
interface Material {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  subjectName: string;
  fileType: 'pdf' | 'doc' | 'ppt' | 'xls' | 'zip';
  fileSize: string;
  uploadDate: Date;
  downloadUrl: string;
}
```

**Components:**
1. `MaterialList` - Grouped by subject
2. `MaterialCard` - File info + download button
3. `FileIcon` - Based on file type

**File Type Icons:**
- PDF: Red document
- DOC: Blue document
- PPT: Orange presentation
- XLS: Green spreadsheet
- ZIP: Gray archive

## Related Code Files

- `apps/mobile/src/screens/student/LeaveRequest.tsx`
- `apps/mobile/src/screens/student/Summary.tsx`
- `apps/web/components/admin/` - Similar form components

## Todo List

### Leave Request
- [ ] Create leave request page structure
- [ ] Build TabSwitcher component
- [ ] Build LeaveRequestForm with validation
- [ ] Build RequestHistoryCard component
- [ ] Build AppealModal component
- [ ] Implement form submission
- [ ] Implement appeal submission
- [ ] Add loading/empty states

### Summary
- [ ] Create summary page structure
- [ ] Build SemesterSelector component
- [ ] Build OverallScoreCard with circular progress
- [ ] Build StatsGrid component
- [ ] Build SubjectProgressCard
- [ ] Implement summary fetch from API
- [ ] Add loading/empty states

### Study Materials
- [ ] Create materials page structure
- [ ] Build MaterialList grouped by subject
- [ ] Build MaterialCard component
- [ ] Build FileIcon component (5 types)
- [ ] Implement material fetch from API
- [ ] Add download functionality
- [ ] Add loading/empty states

### Testing
- [ ] Test leave request form submission
- [ ] Test leave request appeal flow
- [ ] Test summary semester toggle
- [ ] Test material download
- [ ] Test responsive layouts

## Success Criteria

- [ ] Leave request form submits successfully
- [ ] Leave history shows correct status
- [ ] Appeal flow works end-to-end
- [ ] Summary displays aggregated data correctly
- [ ] Circular progress animates correctly
- [ ] Materials list shows by subject
- [ ] File icons match file types
- [ ] Download buttons work
- [ ] All screens are responsive

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Form validation errors | Medium | Client + server validation |
| Missing summary data | Low | Show N/A for missing values |
| Broken file links | Medium | Validate URLs before display |

## Security Considerations

1. Students can only create requests for themselves
2. File downloads validated for permissions
3. Form submissions rate-limited
4. No file upload vulnerabilities

## Next Steps

Once this phase is complete, proceed to [Phase 08: Testing & Deployment](phase-08-testing-deployment.md)
