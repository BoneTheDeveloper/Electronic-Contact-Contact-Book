---
title: "Phase 04B: Admin Portal Features"
description: "Admin dashboard, user management, academic structure, payments"
status: pending
priority: P1
effort: 5h
created: 2026-01-12
---

# Phase 04B: Admin Portal Features

## Context Links
- Parent: [plan.md](./plan.md)
- Depends: [phase-02b](./phase-02b-web-core.md), [phase-03](./phase-03-shared-ui-design-system.md)
- Wireframes: [Admin dashboard](../../docs/wireframe/Web_app/Admin/dashboard.html)

## Parallelization Info
- **Can run with**: Phases 04A, 04C, 04D (different platforms/features)
- **Must complete after**: Phases 02B, 03
- **Exclusive files**: `apps/web/app/(admin)/*`, `apps/web/components/admin/*`

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | Pending |
| Description | Admin portal screens with dashboard, users, classes, payments |
| Review Status | Not Started |

## Key Insights
- Admin needs overview stats + management screens
- Sidebar navigation with role-based access
- Charts and tables for data visualization

## Requirements
- Next.js server components
- shadcn/ui components
- Recharts for charts
- Mock data from JSON files

## Architecture

### Page Structure
```
app/(admin)/
├── page.tsx              # Dashboard (stats, charts, activity log)
├── users/
│   ├── page.tsx          # User list with filters
│   └── [id]/page.tsx     # User detail/edit
├── classes/
│   ├── page.tsx          # Class list
│   └── [id]/page.tsx     # Class detail + student list
├── payments/
│   ├── page.tsx          # Payment overview
│   └── invoice-tracker/  # Invoice tracking (wireframe)
├── academic-structure/   # Class/Subject management
└── notifications/
    └── page.tsx          # Create/send notifications
```

## File Ownership

### Files to Create (Exclusive to 04B)
| File | Owner |
|------|-------|
| `apps/web/app/(admin)/page.tsx` | Phase 04B |
| `apps/web/app/(admin)/users/*` | Phase 04B |
| `apps/web/app/(admin)/classes/*` | Phase 04B |
| `apps/web/app/(admin)/payments/*` | Phase 04B |
| `apps/web/app/(admin)/notifications/*` | Phase 04B |
| `apps/web/components/admin/*` | Phase 04B |

## Implementation Steps

1. **Build Admin Dashboard**
   ```typescript
   // app/(admin)/page.tsx
   import { getDashboardStats, getAttendanceStats, getFeeStats } from '@/lib/mock-data'
   import { StatsGrid } from '@/components/admin/StatsGrid'
   import { AttendanceChart } from '@/components/admin/AttendanceChart'
   import { FeeCollectionChart } from '@/components/admin/FeeCollectionChart'
   import { ActivityLogTable } from '@/components/admin/ActivityLogTable'

   export default async function AdminDashboard() {
     const stats = await getDashboardStats()
     const attendance = await getAttendanceStats()
     const fees = await getFeeStats()

     return (
       <div className="p-8 space-y-8">
         <h1 className="text-2xl font-extrabold">Bảng điều khiển</h1>

         {/* Stats Cards - 5 columns */}
         <StatsGrid
           stats={[
             { label: 'Học sinh', value: stats.students, change: '+2.5%' },
             { label: 'Phụ huynh', value: stats.parents, change: '+1.8%' },
             { label: 'Giáo viên', value: stats.teachers, change: 'Ổn định' },
             { label: 'Chuyên cần', value: stats.attendance, change: '-0.8%' },
             { label: 'Thu học phí', value: stats.feesCollected, change: '+12%' },
           ]}
         />

         <div className="grid lg:grid-cols-3 gap-8">
           {/* Attendance Statistics */}
           <AttendanceChart data={attendance} />

           {/* Fee Collection */}
           <FeeCollectionChart data={fees} />

           {/* Grade Distribution */}
           <GradeDistribution />
         </div>

         {/* Activity Log Table */}
         <ActivityLogTable />
       </div>
     )
   }
   ```

2. **Create User Management**
   ```typescript
   // app/(admin)/users/page.tsx
   import { getUsers } from '@/lib/mock-data'
   import { UserTable } from '@/components/admin/UserTable'
   import { UserFilters } from '@/components/admin/UserFilters'

   export default async function UsersPage({
     searchParams,
   }: {
     searchParams: { role?: string; search?: string }
   }) {
     const users = await getUsers()
     const filtered = users.filter(u =>
       !searchParams.role || u.role === searchParams.role
     )

     return (
       <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">Quản lý Người dùng</h1>
         <UserFilters />
         <UserTable users={filtered} />
       </div>
     )
   }
   ```

3. **Create Class Management**
   ```typescript
   // app/(admin)/classes/page.tsx
   import { getClasses } from '@/lib/mock-data'

   export default async function ClassesPage() {
     const classes = await getClasses()

     return (
       <div className="p-8">
         <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold">Cơ cấu tổ chức</h1>
           <Button>Thêm lớp mới</Button>
         </div>
         <div className="grid md:grid-cols-3 gap-6">
           {classes.map(cls => (
             <ClassCard key={cls.id} class={cls} />
           ))}
         </div>
       </div>
     )
   }

   // app/(admin)/classes/[id]/page.tsx
   export default async function ClassDetailPage({ params }) {
     const cls = await getClass(params.id)
     const students = await getClassStudents(params.id)

     return (
       <div className="p-8">
         <h1>{cls.name} - Danh sách học sinh</h1>
         <StudentTable students={students} />
       </div>
     )
   }
   ```

4. **Create Payment Management**
   ```typescript
   // app/(admin)/payments/page.tsx
   import { getFees } from '@/lib/mock-data'

   export default async function PaymentsPage() {
     const fees = await getFees()

     return (
       <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">Học phí & Tài chính</h1>
         <PaymentSummary fees={fees} />
         <InvoiceTable invoices={fees.invoices} />
       </div>
     )
   }

   // app/(admin)/payments/invoice-tracker/page.tsx
   export default async function InvoiceTrackerPage() {
     const invoices = await getInvoices()

     return (
       <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">Theo dõi Học phí</h1>
         <InvoiceTracker invoices={invoices} />
       </div>
     )
   }
   ```

5. **Create Notification Manager**
   ```typescript
   // app/(admin)/notifications/page.tsx
   import { NotificationForm } from '@/components/admin/NotificationForm'
   import { NotificationList } from '@/components/admin/NotificationList'

   export default function NotificationsPage() {
     return (
       <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">Thông báo</h1>
         <div className="grid lg:grid-cols-2 gap-8">
           <NotificationForm />
           <NotificationList />
         </div>
       </div>
     )
   }
   ```

6. **Create Admin Components**
   ```typescript
   // components/admin/StatsGrid.tsx
   export function StatsGrid({ stats }: { stats: Stats[] }) {
     return (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
         {stats.map(stat => (
           <StatCard key={stat.label} {...stat} />
         ))}
       </div>
     )
   }

   // components/admin/ActivityLogTable.tsx
   export function ActivityLogTable() {
     const activities = await getActivities()

     return (
       <div className="bg-white rounded-3xl shadow-sm border border-slate-100">
         <table className="w-full">
           <thead>
             <tr className="bg-slate-50">
               <th>Người dùng</th>
               <th>Hành động</th>
               <th>Thời gian</th>
               <th>Ghi chú</th>
             </tr>
           </thead>
           <tbody>
             {activities.map(a => (
               <tr key={a.id}>
                 <td>{a.user}</td>
                 <td>{a.action}</td>
                 <td>{a.time}</td>
                 <td>{a.note}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     )
   }
   ```

## Todo List
- [ ] Build admin dashboard page
- [ ] Create StatsGrid component
- [ ] Create AttendanceChart component
- [ ] Create FeeCollectionChart component
- [ ] Create ActivityLogTable component
- [ ] Build users list page
- [ ] Build user detail page
- [ ] Build classes list page
- [ ] Build class detail page
- [ ] Build payments overview page
- [ ] Build invoice tracker page
- [ ] Build notifications page

## Success Criteria
- Dashboard displays all 5 stats cards
- Charts render with mock data
- User table filters by role
- Class cards show student counts
- Payment tracker shows invoice status
- Navigation between all admin pages works

## Conflict Prevention
- Exclusive ownership of `apps/web/app/(admin)/*`
- No overlap with Phase 02B (that was setup only)
- No overlap with Phase 04C (teacher is separate route group)

## Risk Assessment
| Risk | Mitigation |
|------|-----------|
| Too much data on dashboard | Use pagination and filters |
| Chart library size | Use Recharts (tree-shakeable) |
| Server component hydration | Test client components separately |

## Security Considerations
- Mock auth only (document this)
- No real authorization checks
- Assume admin access for demo

## Next Steps
- Phase 05 (Integration) - test admin workflows
- Phase 05 (Testing) - verify all admin features
