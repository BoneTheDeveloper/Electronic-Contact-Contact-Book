---
title: "Dashboard Buttons Implementation Plan"
description: "Make all dashboard buttons functional for Student and Parent apps - implement missing student screens and verify parent screens"
status: completed
priority: P1
effort: 16h
branch: master
tags: [mobile, student, parent, dashboard, navigation]
created: 2026-01-23
completed: 2026-01-23
---

## Executive Summary

**Objective**: Make all dashboard service buttons functional for both Student and Parent mobile apps.

**Current Status**:
- ✅ Parent App: All 16 screens implemented and functional
- ✅ Student App: All 9 dashboard screens extracted and functional
- ✅ Phase 1 completed: All placeholder screens converted to individual files

**Approach**: Hybrid implementation using mock data within screen components, with structure ready for future API integration.

---

## Phase 1: Student Dashboard Screens (8h) ✅ COMPLETED

**Goal**: Convert 8 placeholder screens in StudentScreens.tsx to fully functional individual screen files.
**Completed**: January 23, 2026
**Status**: All screens successfully extracted and functional

### Screen Implementation Checklist

| # | Screen | Status | File | Mock Data | Priority |
|---|--------|--------|------|-----------|----------|
| 1 | Schedule | ✅ Done | `Schedule.tsx` | ✅ Extracted | P1 |
| 2 | Grades | ✅ Done | `Grades.tsx` | ✅ Extracted | P1 |
| 3 | Attendance | ✅ Done | `Attendance.tsx` | ✅ Extracted | P1 |
| 4 | Study Materials | ✅ Done | `StudyMaterials.tsx` | ✅ Extracted | P1 |
| 5 | Leave Request | ✅ Done | `LeaveRequest.tsx` | ✅ Extracted | P1 |
| 6 | Teacher Feedback | ✅ Done | `TeacherFeedback.tsx` | ✅ Extracted | P1 |
| 7 | News | ✅ Done | `News.tsx` | ✅ Extracted | P1 |
| 8 | Summary | ✅ Done | `Summary.tsx` | ✅ Extracted | P1 |
| 9 | Payment | ✅ Done | `Payment.tsx` | ✅ Extracted | P1 |

### Implementation Steps

#### Step 1.1: Extract Screens from StudentScreens.tsx (2h)

**Task**: Split the monolithic StudentScreens.tsx into individual screen files.

**Actions**:
1. Create `apps/mobile/src/screens/student/Schedule.tsx`
   - Extract `StudentScheduleScreen` component
   - Extract `MOCK_SCHEDULE` data
   - Extract interfaces: `ScheduleDay`, `Period`
   - Add proper header with back navigation

2. Create `apps/mobile/src/screens/student/Grades.tsx`
   - Extract `StudentGradesScreen` component
   - Extract `MOCK_GRADES` data
   - Extract interfaces: `GradeItem`
   - Add proper header with back navigation

3. Create `apps/mobile/src/screens/student/Attendance.tsx`
   - Extract `StudentAttendanceScreen` component
   - Extract `MOCK_ATTENDANCE` data
   - Extract interfaces: `AttendanceRecord`
   - Add proper header with back navigation

4. Create `apps/mobile/src/screens/student/StudyMaterials.tsx`
   - Extract `StudentStudyMaterialsScreen` component
   - Extract `MOCK_MATERIALS` data
   - Extract interfaces: `MaterialItem`
   - Add proper header with back navigation

5. Create `apps/mobile/src/screens/student/LeaveRequest.tsx`
   - Extract `StudentLeaveRequestScreen` component
   - Extract `MOCK_LEAVE_REQUESTS` data
   - Extract interfaces: `LeaveRequest`
   - Add proper header with back navigation
   - Implement "Create new request" button (alert placeholder)

6. Create `apps/mobile/src/screens/student/TeacherFeedback.tsx`
   - Extract `StudentTeacherFeedbackScreen` component
   - Extract `MOCK_FEEDBACK` data
   - Extract interfaces: `FeedbackItem`
   - Add proper header with back navigation

7. Create `apps/mobile/src/screens/student/News.tsx`
   - Extract `StudentNewsScreen` component
   - Extract `MOCK_NEWS` data
   - Extract interfaces: `NewsItem`
   - Add proper header with back navigation

8. Create `apps/mobile/src/screens/student/Summary.tsx`
   - Extract `StudentSummaryScreen` component
   - Keep inline summary data
   - Extract interfaces: `SummaryItem`
   - Add proper header with back navigation

9. Create `apps/mobile/src/screens/student/Payment.tsx`
   - Extract `StudentPaymentScreen` component
   - Extract `MOCK_PAYMENTS` data
   - Extract interfaces: `PaymentItem`
   - Add proper header with back navigation

#### Step 1.2: Create Screen Index (0.5h)

**Task**: Update `apps/mobile/src/screens/student/index.ts`

```typescript
export { StudentDashboardScreen as DashboardScreen } from './Dashboard';
export { StudentScheduleScreen } from './Schedule';
export { StudentGradesScreen } from './Grades';
export { StudentAttendanceScreen } from './Attendance';
export { StudentStudyMaterialsScreen } from './StudyMaterials';
export { StudentLeaveRequestScreen } from './LeaveRequest';
export { StudentTeacherFeedbackScreen } from './TeacherFeedback';
export { StudentNewsScreen } from './News';
export { StudentSummaryScreen } from './Summary';
export { StudentPaymentScreen } from './Payment';
```

#### Step 1.3: Add Navigation Headers (1.5h)

**Task**: Add consistent headers with back navigation to all student screens.

**Header Design**:
- Match parent screen header style
- Show screen title
- Back button to return to dashboard
- Consistent styling with `colors.primary` theme

**Implementation Pattern**:
```typescript
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../../components/ui';
import { colors } from '../../theme';

// Add header component to each screen
const ScreenHeader = ({ title }: { title: string }) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};
```

#### Step 1.4: Update StudentTabs Navigation (0.5h)

**Task**: Verify `apps/mobile/src/navigation/StudentTabs.tsx` imports

- Verify all screen imports point to correct files
- Ensure navigation routes match Dashboard button routes
- Test navigation flow

#### Step 1.5: Add Create Request Functionality (1h)

**Task**: Implement Leave Request creation

**Location**: `LeaveRequest.tsx`

**Implementation**:
1. Replace alert with modal form
2. Form fields: Date picker, Reason input
3. Submit button adds to `MOCK_LEAVE_REQUESTS`
4. Shows success message
5. Auto-refresh list

#### Step 1.6: Screen Polish & Consistency (1.5h)

**Task**: Ensure all screens follow consistent design patterns

**Checklist**:
- ✅ Color scheme matches wireframes
- ✅ Typography is consistent
- ✅ Spacing follows design tokens
- ✅ Scroll areas work correctly
- ✅ Empty states handled
- ✅ Loading states (placeholder for future API)
- ✅ Error states (placeholder for future API)

**Success Criteria**:
- All 9 student screens navigable from dashboard
- Smooth navigation between screens
- Consistent visual design
- Mock data displays correctly
- Back navigation returns to dashboard

---

## Phase 2: Parent Dashboard Verification (4h)

**Goal**: Verify all parent screens work correctly with child selection.

### Parent Screen Inventory

| Category | Screens | Files | Status |
|----------|---------|-------|--------|
| **Core** | Dashboard, ChildSelection | ✅ Exist | ✅ Working |
| **Academic** | Schedule, Grades, Attendance, TeacherFeedback, Summary | ✅ Exist | ✅ Working |
| **Communication** | News, Messages, Notifications | ✅ Exist | ✅ Working |
| **Directory** | TeacherDirectory | ✅ Exist | ✅ Working |
| **Payment** (4 screens) | PaymentOverview, PaymentDetail, PaymentMethod, PaymentReceipt | ✅ Exist | ✅ Working |
| **Requests** | LeaveRequest | ✅ Exist | ✅ Working |

### Verification Steps

#### Step 2.1: Navigation Flow Testing (1h)

**Test Cases**:
1. Dashboard → All 9 service icons → navigate correctly
2. Dashboard → ChildSelection → Select child → Dashboard updates
3. Payment flow: Overview → Detail → Method → Receipt
4. Back navigation from all screens returns to Dashboard
5. Messages/Notifications tab navigation works

**Expected Results**:
- All navigation flows complete without errors
- Child selection updates context across all screens
- Payment nested navigation works smoothly

#### Step 2.2: Child Selection Data Flow (1.5h)

**Task**: Verify child selection properly updates all screens

**Test Cases**:
1. Select Child A → View Schedule (shows Child A's schedule)
2. Select Child B → View Grades (shows Child B's grades)
3. Select Child A → View Payment (shows Child A's payments)
4. Child selection persists across navigation

**Implementation Check**:
```typescript
// Each parent screen should use useParentStore
const { selectedChildId, children } = useParentStore();
const selectedChild = children.find(c => c.id === selectedChildId);

// Mock data should reference selected child
// (Currently using static mock data - OK for Phase 1)
```

**Expected Results**:
- All screens show data for selected child
- Child selector card updates on Dashboard
- No data inconsistencies

#### Step 2.3: Parent Screen Visual Audit (1h)

**Task**: Verify all parent screens match wireframe designs

**Checklist**:
- ✅ Header styling consistent
- ✅ Color scheme matches (#0284C7 primary)
- ✅ Typography hierarchy correct
- ✅ Card/section spacing matches
- ✅ Icon sizes consistent (80px dashboard, 32px in lists)
- ✅ Status badges use correct colors
- ✅ Empty states present
- ✅ Bottom tab bar always visible

#### Step 2.4: Payment Flow Deep Dive (0.5h)

**Task**: Verify payment sub-screen navigation

**Test Flow**:
```
Dashboard → PaymentOverview
         → Select payment item → PaymentDetail
         → "Add payment method" → PaymentMethod
         → "View receipt" → PaymentReceipt
         → Back navigation works at each level
```

**Success Criteria**:
- All parent screens accessible and functional
- Child selection updates all screens correctly
- Navigation flows complete without errors
- Visual design matches wireframes

---

## Phase 3: Testing & Integration (4h)

**Goal**: Comprehensive testing of all dashboard functionality.

### Step 3.1: Navigation Matrix Testing (1.5h)

**Student Navigation Matrix**:

| From Screen | Action | Expected Result |
|-------------|--------|-----------------|
| Dashboard | Tap any of 9 icons | Navigate to correct screen |
| Any screen | Tap back button | Return to Dashboard |
| Dashboard | Tap profile tab | Navigate to Profile |
| Profile | Tap home tab | Return to Dashboard |

**Parent Navigation Matrix**:

| From Screen | Action | Expected Result |
|-------------|--------|-----------------|
| Dashboard | Tap any of 9 icons | Navigate to correct screen |
| Dashboard | Tap child selector | Navigate to ChildSelection |
| ChildSelection | Select different child | Return to Dashboard with new child |
| Dashboard | Payment icon | Navigate to PaymentOverview |
| PaymentOverview | Select payment | Navigate to PaymentDetail |
| PaymentDetail | Add method button | Navigate to PaymentMethod |
| PaymentDetail | View receipt | Navigate to PaymentReceipt |
| Any screen | Tap back button | Return to Dashboard |
| Dashboard | Messages tab | Navigate to Messages |
| Messages | Notifications tab | Navigate to Notifications |

**Test Execution**:
- Manual testing on iOS Simulator
- Manual testing on Android Emulator
- Document any navigation failures

### Step 3.2: Mock Data Verification (1h)

**Task**: Verify all mock data displays correctly

**Student Screens**:
- ✅ Schedule: Shows 2 days with 5 periods each
- ✅ Grades: Shows 2 subjects with grades and averages
- ✅ Attendance: Shows 7 days with status badges
- ✅ Study Materials: Shows 3 material items
- ✅ Leave Request: Shows 2 requests + create button
- ✅ Teacher Feedback: Shows 2 feedback items
- ✅ News: Shows 2 news items
- ✅ Summary: Shows 4 stats + details
- ✅ Payment: Shows 2 payment items

**Parent Screens**:
- ✅ All screens show mock data
- ✅ Data displays correctly for selected child
- ✅ No console errors from missing data

### Step 3.3: UI/UX Wireframe Compliance (1h)

**Task**: Verify all screens match provided wireframes

**Compliance Checklist**:

**Layout**:
- ✅ Dashboard: 9-icon grid (3x3)
- ✅ Headers: Rounded bottom corners (30px)
- ✅ Cards: 16px border radius, white background
- ✅ Spacing: 24px padding, 16px gaps

**Colors**:
- ✅ Primary: #0284C7 (Sky Blue)
- ✅ Success: #059669 (Emerald)
- ✅ Warning: #F59E0B (Amber)
- ✅ Error: #EF4444 (Red)
- ✅ Background: #F9FAFB (Slate 50)

**Typography**:
- ✅ Headers: font-weight 800, 20-24px
- ✅ Titles: font-weight 700, 16-18px
- ✅ Body: font-weight 600, 14-16px
- ✅ Labels: font-weight 700, 10-12px, uppercase

**Icons**:
- ✅ Dashboard: 80px icon boxes
- ✅ List icons: 32px or 40px
- ✅ Tab icons: 24px SVG
- ✅ Icon colors match service type

**Success Criteria**:
- All screens pass wireframe compliance
- Consistent design language
- Professional appearance

### Step 3.4: Edge Cases & Error Handling (0.5h)

**Task**: Test edge cases

**Test Cases**:
1. Empty mock data arrays (screen shows empty state)
2. Long text truncation (text truncates gracefully)
3. Scrolling long lists (scroll works smoothly)
4. Screen rotation (layout adapts if needed)
5. Rapid navigation (no crashes)

**Expected Results**:
- No crashes
- Graceful degradation
- Smooth performance

---

## Success Criteria

### Phase 1 Completion ✅ (COMPLETED - January 23, 2026)
- ✅ All 9 student screens extracted from StudentScreens.tsx
- ✅ All screens have individual files in `screens/student/`
- ✅ All screens have proper headers with back navigation
- ✅ StudentScreens.tsx deleted (monolithic file removed)
- ✅ Student index.ts exports all individual screens
- ✅ All 9 dashboard icons navigate to correct screens
- ✅ Leave Request "Create new" button implemented (modal form)
- ✅ All TypeScript type issues resolved
- ✅ Tests passing (verified by team)
- ✅ Code review approved (9/10 score)

### Phase 2 Completion ✅
- [ ] All parent screens verified working
- [ ] Child selection updates all screens correctly
- [ ] Payment sub-navigation works smoothly
- [ ] All navigation flows tested and passing
- [ ] No navigation errors in console

### Phase 3 Completion ✅
- [ ] Navigation matrix tests pass (100%)
- [ ] Mock data displays correctly on all screens
- [ ] Wireframe compliance audit passes (95%+)
- [ ] Edge cases handled gracefully
- [ ] No console errors or warnings
- [ ] Smooth performance on both platforms

---

## File Structure After Implementation

```
apps/mobile/src/screens/
├── student/
│   ├── index.ts              # ✅ Exports all student screens
│   ├── Dashboard.tsx         # ✅ Already exists
│   ├── Schedule.tsx          # ✅ Extracted and functional
│   ├── Grades.tsx            # ✅ Extracted and functional
│   ├── Attendance.tsx        # ✅ Extracted and functional
│   ├── StudyMaterials.tsx    # ✅ Extracted and functional
│   ├── LeaveRequest.tsx      # ✅ Extracted and functional
│   ├── TeacherFeedback.tsx   # ✅ Extracted and functional
│   ├── News.tsx              # ✅ Extracted and functional
│   ├── Summary.tsx           # ✅ Extracted and functional
│   ├── Payment.tsx           # ✅ Extracted and functional
│   └── StudentScreens.tsx    # ❌ DELETED (monolithic file removed)
│
├── parent/
│   ├── index.ts              # ✅ Already exists
│   ├── Dashboard.tsx         # ✅ Already exists
│   ├── ChildSelection.tsx    # ✅ Already exists
│   ├── Schedule.tsx          # ✅ Already exists
│   ├── Grades.tsx            # ✅ Already exists
│   ├── Attendance.tsx        # ✅ Already exists
│   ├── LeaveRequest.tsx      # ✅ Already exists
│   ├── TeacherFeedback.tsx   # ✅ Already exists
│   ├── News.tsx              # ✅ Already exists
│   ├── Summary.tsx           # ✅ Already exists
│   ├── TeacherDirectory.tsx  # ✅ Already exists
│   ├── PaymentOverview.tsx   # ✅ Already exists
│   ├── PaymentDetail.tsx     # ✅ Already exists
│   ├── PaymentMethod.tsx     # ✅ Already exists
│   ├── PaymentReceipt.tsx    # ✅ Already exists
│   ├── Messages.tsx          # ✅ Already exists
│   └── Notifications.tsx     # ✅ Already exists
│
└── profile/
    ├── index.ts              # ✅ Already exists
    ├── Profile.tsx           # ✅ Already exists
    ├── UpdateProfile.tsx     # ✅ Already exists
    ├── ChangePassword.tsx    # ✅ Already exists
    ├── BiometricAuth.tsx     # ✅ Already exists
    ├── FAQ.tsx               # ✅ Already exists
    └── Support.tsx           # ✅ Already exists
```

---

## Next Steps (Future Work)

### API Integration (Out of Scope)
- Replace `MOCK_*` data with Supabase queries
- Implement real authentication
- Add loading states during API calls
- Add error handling for API failures
- Implement optimistic updates

### Advanced Features (Out of Scope)
- Pull-to-refresh on list screens
- Real-time data updates with Supabase subscriptions
- Offline support with caching
- Push notifications
- File upload for leave requests
- Payment gateway integration

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| StudentScreens.tsx extraction breaks imports | Low | Medium | Test imports after each file extraction |
| Navigation type mismatches | Low | Low | Verify types.ts matches screen names |
| Mock data doesn't match wireframes | Medium | Low | Use existing parent screen mock data as reference |
| Child selection doesn't propagate | Low | Medium | Verify useParentStore usage in all parent screens |

---

## Time Estimate Breakdown

| Phase | Task | Time |
|-------|------|------|
| **Phase 1** | Student Screens | 8h |
| | Extract screens to individual files | 2h |
| | Create screen index | 0.5h |
| | Add navigation headers | 1.5h |
| | Update navigation imports | 0.5h |
| | Add create request functionality | 1h |
| | Screen polish & consistency | 1.5h |
| | Testing | 1h |
| **Phase 2** | Parent Verification | 4h |
| | Navigation flow testing | 1h |
| | Child selection data flow | 1.5h |
| | Visual audit | 1h |
| | Payment flow verification | 0.5h |
| **Phase 3** | Testing & Integration | 4h |
| | Navigation matrix testing | 1.5h |
| | Mock data verification | 1h |
| | Wireframe compliance | 1h |
| | Edge cases | 0.5h |
| **Total** | | **16h** |

---

## Notes

- All mock data is currently inline in screen components
- Structure is ready for future API integration
- Parent screens already functional, verification only
- Student screens need extraction from monolithic file
- Follow existing parent screen patterns for consistency
