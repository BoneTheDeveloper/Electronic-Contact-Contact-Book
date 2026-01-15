---
title: "Phase 04A: Mobile Feature Screens"
description: "Parent and Student screens - dashboard, grades, attendance, payments"
status: pending
priority: P1
effort: 6h
created: 2026-01-12
---

# Phase 04A: Mobile Feature Screens

## Context Links
- Parent: [plan.md](./plan.md)
- Depends: [phase-02a](./phase-02a-mobile-core.md), [phase-03](./phase-03-shared-ui-design-system.md)
- Wireframes: [Parent dashboard](../../docs/wireframe/Mobile/parent/dashboard.html)

## Parallelization Info
- **Can run with**: Phases 04B, 04C, 04D (different platforms)
- **Must complete after**: Phases 02A, 03
- **Exclusive files**: `apps/mobile/src/screens/*` (not auth)

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | Pending |
| Description | All 9+ parent screens + student dashboard |
| Review Status | Not Started |

## Key Insights
- 9 service icons from wireframe → 9 feature screens
- Bottom tab nav groups related screens
- Student app much simpler (dashboard only)

## Requirements
- React Native Paper components
- Zustand stores for data
- Mock data from JSON files

## Architecture

### Screen List
```
Parent App (9 screens):
├── Dashboard             # Main dashboard with 9 icons
├── ChildSelection        # Switch between children
├── Schedule              # Class timetable
├── Grades                # Subject grades
├── Attendance            # Attendance history
├── TeacherFeedback       # Comments from teachers
├── News                  # School announcements
├── Messages              # Chat/notifications
├── Notifications         # Alert list
├── TeacherDirectory      # Contact list
├── PaymentOverview       # Fee summary
├── PaymentDetail         # Single invoice
├── PaymentMethod         # Payment options
├── PaymentReceipt        # Payment confirmation
├── LeaveRequest          # Submit absence request
└── Summary               # Academic summary

Student App (1 screen):
└── Dashboard             # Simplified view
```

### Navigation Structure
```
ParentTabs:
├── Home: Dashboard, ChildSelection, Summary
├── Academic: Schedule, Grades, Attendance, TeacherFeedback
├── Payments: PaymentOverview, PaymentDetail, PaymentMethod, PaymentReceipt
├── Comm: Messages, Notifications, News
└── More: TeacherDirectory, LeaveRequest, Profile

StudentTabs:
└── Dashboard
```

## File Ownership

### Files to Create (Exclusive to 04A)
| File | Owner |
|------|-------|
| `apps/mobile/src/screens/parent/*` | Phase 04A |
| `apps/mobile/src/screens/student/*` | Phase 04A |
| `apps/mobile/src/navigation/ParentTabs.tsx` | Phase 04A |
| `apps/mobile/src/navigation/StudentTabs.tsx` | Phase 04A |

## Implementation Steps

1. **Create Parent Dashboard**
   ```typescript
   // screens/parent/Dashboard.tsx
   import { ScrollView, View } from 'react-native'
   import { Card, Text, Avatar } from 'react-native-paper'

   export function ParentDashboard() {
     const { user } = useAuthStore()
     const { selectedChild, setSelectedChild } = useParentStore()

     return (
       <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
         {/* Header with user greeting */}
         <View style={{ padding: 24, backgroundColor: '#0284C7' }}>
           <Text style={{ color: 'white', fontSize: 12 }}>Xin chào,</Text>
           <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>
             {user?.name}
           </Text>
         </View>

         {/* Child selector */}
         <Card style={{ margin: 16, borderRadius: 24 }}>
           <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
             <Avatar.Text size={44} label="HB" />
             <View style={{ marginLeft: 12 }}>
               <Text style={{ fontSize: 9, color: '#9CA3AF' }}>Đang theo dõi</Text>
               <Text style={{ fontSize: 14, fontWeight: '700' }}>
                 {selectedChild?.name}
               </Text>
             </View>
           </Card.Content>
         </Card>

         {/* 9 Service Icons Grid */}
         <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 }}>
           {serviceIcons.map(icon => (
             <ServiceIcon key={icon.id} {...icon} />
           ))}
         </View>
       </ScrollView>
     )
   }
   ```

2. **Create Schedule Screen**
   ```typescript
   // screens/parent/Schedule.tsx
   import { useLocalSearchParams } from 'expo-router'

   export function ScheduleScreen() {
     const schedule = useScheduleStore(state => state.schedule)

     return (
       <View style={{ flex: 1, padding: 16 }}>
         <Text style={{ fontSize: 24, fontWeight: '700' }}>Thời khóa biểu</Text>
         {schedule.map(day => (
           <ScheduleCard key={day.date} day={day} />
         ))}
       </View>
     )
   }
   ```

3. **Create Grades Screen**
   ```typescript
   // screens/parent/Grades.tsx
   export function GradesScreen() {
     const grades = useStudentStore(state => state.grades)

     return (
       <ScrollView style={{ flex: 1 }}>
         {grades.map(grade => (
           <Card key={grade.id} style={{ margin: 12 }}>
             <Card.Content>
               <Text>{grade.subject}</Text>
               <GradeBadge score={grade.score} />
             </Card.Content>
           </Card>
         ))}
       </ScrollView>
     )
   }
   ```

4. **Create Attendance Screen**
   ```typescript
   // screens/parent/Attendance.tsx
   export function AttendanceScreen() {
     const attendance = useStudentStore(state => state.attendance)

     const stats = {
       present: attendance.filter(a => a.status === 'present').length,
       absent: attendance.filter(a => a.status === 'absent').length,
       late: attendance.filter(a => a.status === 'late').length,
     }

     return (
       <View style={{ flex: 1 }}>
         <StatsGrid present={stats.present} absent={stats.absent} late={stats.late} />
         <AttendanceList attendance={attendance} />
       </View>
     )
   }
   ```

5. **Create Payment Screens**
   ```typescript
   // screens/parent/PaymentOverview.tsx
   export function PaymentOverview() {
     const fees = useParentStore(state => state.fees)

     return (
       <ScrollView>
         <SummaryCard total={fees.total} paid={fees.paid} pending={fees.pending} />
         {fees.invoices.map(invoice => (
           <InvoiceCard key={invoice.id} invoice={invoice} />
         ))}
       </ScrollView>
     )
   }

   // screens/parent/PaymentDetail.tsx
   export function PaymentDetail() {
     const { id } = useLocalSearchParams()
     const invoice = useParentStore(state =>
       state.fees.invoices.find(i => i.id === id)
     )

     return (
       <View>
         <InvoiceHeader invoice={invoice} />
         <InvoiceItems items={invoice.items} />
         <PaymentActions onPay={handlePayment} />
       </View>
     )
   }
   ```

6. **Create Teacher Directory**
   ```typescript
   // screens/parent/TeacherDirectory.tsx
   export function TeacherDirectory() {
     const teachers = useMockData('teachers.json')

     return (
       <FlatList
         data={teachers}
         renderItem={({ item }) => (
           <TeacherCard
             name={item.name}
             subject={item.subject}
             phone={item.phone}
             email={item.email}
           />
         )}
       />
     )
   }
   ```

7. **Create Leave Request Form**
   ```typescript
   // screens/parent/LeaveRequest.tsx
   export function LeaveRequest() {
     const [reason, setReason] = useState('')
     const [dates, setDates] = useState([])

     const handleSubmit = () => {
       // Create leave request
       router.back()
     }

     return (
       <View style={{ padding: 16 }}>
         <TextInput
           label="Lý do nghỉ"
           value={reason}
           onChangeText={setReason}
           multiline
         />
         <DatePicker onDateChange={setDates} />
         <Button mode="contained" onPress={handleSubmit}>Gửi đơn</Button>
       </View>
     )
   }
   ```

8. **Create Student Dashboard** (simpler)
   ```typescript
   // screens/student/Dashboard.tsx
   export function StudentDashboard() {
     const { user } = useAuthStore()

     return (
       <View style={{ padding: 16 }}>
         <Text style={{ fontSize: 24 }}>Xin chào, {user?.name}</Text>
         <QuickStats grades={user.grades} attendance={user.attendance} />
         <UpcomingAssignments assignments={user.assignments} />
       </View>
     )
   }
   ```

## Todo List
- [ ] Create ParentTabs navigator
- [ ] Create StudentTabs navigator
- [ ] Build Dashboard screen (9 icons)
- [ ] Build ChildSelection modal
- [ ] Build Schedule screen
- [ ] Build Grades screen
- [ ] Build Attendance screen
- [ ] Build TeacherFeedback screen
- [ ] Build News screen
- [ ] Build Messages screen
- [ ] Build Notifications screen
- [ ] Build TeacherDirectory screen
- [ ] Build PaymentOverview screen
- [ ] Build PaymentDetail screen
- [ ] Build PaymentMethod screen
- [ ] Build PaymentReceipt screen
- [ ] Build LeaveRequest screen
- [ ] Build Summary screen
- [ ] Build Student Dashboard

## Success Criteria
- All 9+ parent screens render
- Student dashboard renders
- Navigation flows work between all screens
- Mock data displays correctly
- Bottom tabs switch contexts

## Conflict Prevention
- Exclusive ownership of `apps/mobile/src/screens/*`
- No overlap with Phase 02A (that was setup only)
- No web code in mobile directory

## Risk Assessment
| Risk | Mitigation |
|------|-----------|
| Navigation complexity | Test all routes thoroughly |
| State synchronization | Use Zustand persist middleware |
| Too many screens | Group by navigation tab |

## Security Considerations
- Mock data is public (no secrets)
- Validate user can only see their data
- Sanitize all user inputs

## Next Steps
- Phase 05 (Integration) - test navigation flows
- Phase 05 (Testing) - verify all screens work
