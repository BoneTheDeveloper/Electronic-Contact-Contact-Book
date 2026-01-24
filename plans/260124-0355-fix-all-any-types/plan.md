# Plan: Fix All TypeScript `any` Type Errors

**Date:** 2026-01-24
**Issue:** 300 `any` type errors blocking deployment
**Total Files:** 77 (51 web + 26 mobile)

## Overview
After enabling `@typescript-eslint/no-explicit-any` as error, ESLint now reports 300 `any` type violations across the monorepo. These need proper TypeScript types instead of `any`.

## Phase 1: Critical Core Libraries (Priority: HIGH)
*Files with highest impact, used throughout the app*

### Web App (17 files)
1. `lib/supabase/queries.ts` - 14 errors
2. `lib/services/notification-service.ts` - 5 errors
3. `lib/supabase/realtime.ts` - 1 error
4. `lib/middleware/session-validation.ts` - 1 error
5. `components/ui/button.tsx` - 1 error

### Mobile App (6 files)
1. `lib/supabase/client.ts` - 1 error
2. `src/lib/supabase/client.ts` - 1 error
3. `src/lib/supabase/queries.ts` - 3 errors
4. `src/lib/logger.ts` - 10 errors
5. `src/stores/auth.ts` - 3 errors

## Phase 2: API Routes (Priority: HIGH)
*Backend API endpoints requiring proper request/response types*

1. `app/api/attendance/route.ts` - 8 errors
2. `app/api/grades/route.ts` - 10 errors
3. `app/api/payments/route.ts` - 7 errors
4. `app/api/invoices/route.ts` - 2 errors
5. `app/api/invoices/export/route.ts` - 6 errors
6. `app/api/notifications/route.ts` - 3 errors
7. `app/api/notifications/my/route.ts` - 2 errors
8. `app/api/users/route.ts` - 3 errors
9. `app/api/user/sessions/route.ts` - 2 errors
10. `app/api/fee-assignments/route.ts` - 2 errors
11. `app/api/student-guardians/route.ts` - 6 errors
12. `app/api/teacher/dashboard/route.ts` - 6 errors
13. `app/api/teacher/assessments/route.ts` - 2 errors
14. `app/api/teacher/classes/route.ts` - 1 error
15. `app/api/teacher/leave-requests/route.ts` - 1 error
16. `app/api/cron/retry-notifications/route.ts` - 5 errors

## Phase 3: Feature Components (Priority: MEDIUM)
*UI components for specific features*

### Admin Components (11 files)
1. `components/admin/users/UsersManagement.tsx` - 14 errors
2. `components/admin/users/UsersManagementServer.tsx` - 9 errors
3. `components/admin/users/modals/AddUserModal.tsx` - 7 errors
4. `components/admin/users/modals/UserActionsModal.tsx` - 1 error
5. `components/admin/payments/FeeAssignmentWizard.tsx` - 8 errors
6. `components/admin/payments/PaymentsManagement.tsx` - 2 errors
7. `components/admin/payments/modals/AddFeeItemModal.tsx` - 2 errors
8. `components/admin/payments/modals/SendReminderModal.tsx` - 1 error
9. `components/admin/grades/GradesManagement.tsx` - 5 errors
10. `components/admin/attendance/AttendanceManagement.tsx` - 4 errors
11. `components/admin/classes/AcademicStructure.tsx` - 1 error

### Teacher Components (5 files)
1. `components/teacher/GradeEntryForm.tsx` - 12 errors
2. `components/teacher/AttendanceForm.tsx` - 4 errors
3. `app/teacher/conduct/ConductClient.tsx` - 14 errors
4. `app/teacher/assessments/AssessmentsClient.tsx` - 7 errors
5. `components/admin/shared/filters/filter-bar.tsx` - 3 errors

### Other Components (2 files)
1. `components/notifications/NotificationInbox.tsx` - 2 errors
2. `components/admin/shared/tables/data-table.tsx` - 2 errors

## Phase 4: Page Components (Priority: MEDIUM)
*Page-level components*

1. `app/(auth)/login/page.tsx` - 1 error
2. `app/teacher/regular-assessment/page.tsx` - 5 errors
3. `app/teacher/leave-approval/page.tsx` - 2 errors
4. `app/teacher/assessments/[id]/page.tsx` - 1 error
5. `app/teacher/attendance/[classId]/page.tsx` - 1 error

## Phase 5: Test Files (Priority: LOW)
*Test files can use mock types*

1. `__tests__/middleware.flow.test.ts` - 10 errors
2. `lib/__tests__/auth.error-handling.test.ts` - 6 errors
3. `lib/__tests__/auth.security.test.ts` - 6 errors
4. `lib/__tests__/auth.session.test.ts` - 4 errors
5. `lib/__tests__/auth.csrf.test.ts` - 3 errors
6. `lib/__tests__/auth.sql-injection.test.ts` - 3 errors
7. `lib/__tests__/auth.xss.test.ts` - 3 errors

## Phase 6: Mobile Navigation & Screens (Priority: MEDIUM)
*Mobile app navigation and screen components*

### Navigation (4 files)
1. `src/navigation/StudentTabs.tsx` - 16 errors
2. `src/navigation/RootNavigator.tsx` - 4 errors
3. `src/navigation/AuthNavigator.tsx` - 2 errors
4. `src/navigation/ParentTabs.tsx` - 1 error

### Screens (13 files)
1. `src/screens/parent/Dashboard.tsx` - 3 errors
2. `src/screens/student/Dashboard.tsx` - 2 errors
3. `src/screens/auth/CustomLoginScreen.tsx` - 1 error
4. `src/screens/parent/Messages.tsx` - 1 error
5. `src/screens/parent/Notifications.tsx` - 1 error
6. `src/screens/parent/PaymentOverview.tsx` - 1 error
7. `src/screens/profile/BiometricAuthScreen.tsx` - 1 error
8. `src/screens/profile/ChangePasswordScreen.tsx` - 1 error
9. `src/screens/profile/FAQScreen.tsx` - 1 error
10. `src/screens/profile/ProfileScreen.tsx` - 1 error
11. `src/screens/profile/SupportScreen.tsx` - 1 error
12. `src/screens/profile/UpdateProfileScreen.tsx` - 1 error

### Mobile Components (2 files)
1. `src/components/ui/Button.tsx` - 1 error
2. `src/components/ui/Card.tsx` - 1 error

### Dev Utilities (3 files)
1. `src/utils/devOnly/performanceTest.ts` - 5 errors
2. `src/utils/devOnly/verifyNewArchitecture.ts` - 5 errors
3. `src/utils/devOnly/screenChecklist.ts` - 1 error

## Implementation Strategy

### Type Patterns to Apply:
1. **Supabase queries**: Use `Database['public']['Tables']['<table>']['Row/<Insert>/<Update>']`
2. **API requests**: Create proper Request/Response type interfaces
3. **Event handlers**: Use proper event types (React.FormEvent, MouseEvent, etc.)
4. **Navigation**: Use proper navigation prop types from React Navigation
5. **Logger**: Use generic `Record<string, unknown>` instead of `any`
6. **Test mocks**: Create proper mock types or use `Partial<Type>` for partial mocks

### Common Fixes:
- `any` → `unknown` (for truly unknown data from API)
- `any` → `Record<string, unknown>` (for flexible objects)
- `any` → Specific type from Database schema
- `any` → Proper React event types
- `any` → Proper Supabase types

## Execution Order
Execute phases in parallel where possible:
- **Phase 1**: Core libs (must complete first)
- **Phase 2-6**: Can run in parallel after Phase 1 completes
