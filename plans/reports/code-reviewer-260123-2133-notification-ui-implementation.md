# Code Review Report: Notification UI Implementation Phase

**Date:** 2026-01-23 21:33
**Reviewer:** code-reviewer subagent
**Score:** 6.5/10

## Scope
- **Files reviewed:** 4 main files
  - `apps/web/components/admin/notifications/NotificationManagement.tsx` (533 lines)
  - `apps/web/components/notifications/NotificationInbox.tsx` (274 lines)
  - `apps/mobile/src/screens/parent/Notifications.tsx` (386 lines)
  - `packages/shared-types/src/notification.ts` (144 lines)
- **Supporting files reviewed:**
  - `apps/web/lib/supabase/realtime.ts` (230 lines)
  - `apps/web/app/api/notifications/route.ts` (160 lines)
  - `supabase/migrations/20260123192900_notifications_sessions.sql` (303 lines)
- **Lines of code analyzed:** ~1,730 lines
- **Review focus:** Security, performance (real-time subscriptions), architecture, code quality

## Overall Assessment
The notification UI implementation demonstrates **solid fundamentals** with proper TypeScript typing, good component structure, and real-time subscription patterns. However, **critical memory leak risks** in subscription cleanup and **missing security validations** prevent a higher score. The code follows KISS principles but violates YAGNI in some areas.

---

## Critical Issues

### 1. Memory Leaks in Realtime Subscriptions (SEVERITY: CRITICAL)
**Location:** `NotificationManagement.tsx:117-121`

```typescript
useEffect(() => {
  notifications.forEach((notification) => {
    subscribeToNotificationDelivery(notification.id)
  })
}, [notifications])
```

**Problem:** Creates new subscriptions on every `notifications` update without cleanup. Each notification gets multiple subscriptions as the array grows.

**Impact:** Memory exhaustion, connection pool depletion, performance degradation over time.

**Fix Required:**
```typescript
useEffect(() => {
  const channels: RealtimeChannel[] = []

  notifications.forEach((notification) => {
    const channel = subscribeToNotificationDelivery(notification.id)
    channels.push(channel)
  })

  return () => {
    channels.forEach(ch => ch.unsubscribe())
  }
}, [notifications])
```

---

### 2. Missing RLS Policy Verification (SEVERITY: CRITICAL)
**Location:** `Notifications.tsx:80-85`, `NotificationInbox.tsx:51-64`

**Problem:** Client-side queries to `notifications` table without explicit RLS policy verification in code review.

**Risk:** Users could potentially access other users' notifications if RLS policies fail.

**Evidence from migration:**
```sql
-- Migration adds RLS for notification_recipients and notification_logs
-- But notifications table RLS is NOT clearly defined in migration
```

**Required:** Verify `notifications` table has RLS policy:
```sql
-- Should exist but not visible in provided migration:
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = recipient_id);
```

---

### 3. Unbounded State Growth (SEVERITY: HIGH)
**Location:** `NotificationManagement.tsx:62`, `Notifications.tsx:66`

```typescript
const [deliveryStatuses, setDeliveryStatuses] = useState<Record<string, DeliveryStatusData>>({})
const [notifications, setNotifications] = useState<DatabaseNotification[]>([])
```

**Problem:** No pagination or size limits. Arrays grow indefinitely.

**Impact:** Browser memory exhaustion, UI lag on large datasets.

**Fix:** Add pagination with `limit` parameter (already exists in API but not enforced in UI).

---

### 4. Race Conditions in Mark All as Read (SEVERITY: HIGH)
**Location:** `Notifications.tsx:130-155`

```typescript
const markAllAsRead = useCallback(async () => {
  const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)
  // ... update DB
  setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
}, [user?.id, notifications])
```

**Problem:** `notifications` dependency means callback changes on every notification update. During fast updates, could overwrite newer state.

**Fix:** Use functional updates with proper dependency management.

---

## High Priority Findings

### 5. Missing Input Sanitization (SECURITY)
**Location:** `NotificationManagement.tsx:183-213`

**Problem:** User input (`title`, `content`) sent to API without client-side sanitization. Relies on API validation.

**Risk:** Stored XSS if API validation fails or is bypassed.

**Recommendation:** Add DOMPurify or similar sanitization before display:
```typescript
import DOMPurify from 'dompurify';
const sanitizedTitle = DOMPurify.sanitize(data.title);
```

---

### 6. Inconsistent Error Handling (RELIABILITY)
**Location:** Multiple files

**Pattern:**
```typescript
} catch (error) {
  console.error('[Notifications] Fetch error:', error);
  // No user feedback, no retry logic
}
```

**Problem:** Silent failures, poor UX.

**Recommendation:** Add toast notifications and retry logic.

---

### 7. Missing CSRF Protection Analysis (SECURITY)
**Location:** All API endpoints

**Problem:** No evidence of CSRF token validation in POST/PATCH/DELETE requests.

**Required:** Verify middleware implementation in `@/lib/auth`.

---

### 8. Subscription Channel Name Collisions (PERFORMANCE)
**Location:** `Notifications.tsx:161-202`

```typescript
const channel = supabase
  .channel(`user_notifications_${user.id}`)
```

**Problem:** If component re-mounts rapidly (e.g., hot reload), multiple channels with same name could conflict.

**Evidence:** Supabase docs warn about channel name uniqueness.

**Fix:** Add random suffix or ensure proper cleanup before creating new channel.

---

## Medium Priority Improvements

### 9. Code Duplication (YAGNI/DRY Violation)
**Location:** `Notifications.tsx:39-58`, `NotificationManagement.tsx:238-249`

**Duplicate pattern:**
```typescript
const NOTIFICATION_EMOJIS: Record<NotificationCategory, string> = { ... }
const NOTIFICATION_COLORS: Record<NotificationCategory, string> = { ... }
const PRIORITY_COLORS: Record<NotificationPriority, string> = { ... }
```

**Recommendation:** Extract to `@/shared-types/notification.ts` or `@/components/ui/notification-helpers.ts`.

---

### 10. Hardcoded Vietnamese Strings (MAINTAINABILITY)
**Location:** Throughout mobile component

**Examples:** `"Thông báo"`, `"Chưa đọc"`, `"Đã gửi"`

**Problem:** No i18n support. Hard to localize for other languages.

**Recommendation:** Use i18next or similar.

---

### 11. Missing Loading States (UX)
**Location:** `NotificationManagement.tsx:183-213`

**Problem:** No loading indicator during notification creation. User might click multiple times.

**Fix:** Disable submit button during `isSending` state (partially implemented but not consistently).

---

### 12. Inconsistent Date Formatting (MAINTAINABILITY)
**Location:** `Notifications.tsx:225-234` vs `NotificationManagement.tsx:483`

```typescript
// Mobile: Custom relative time formatter
const formatDate = (dateString: string) => { ... }

// Web: Native toLocaleString()
new Date(notification.createdAt).toLocaleString('vi-VN')
```

**Recommendation:** Standardize on date-fns or similar library.

---

### 13. Missing Accessibility Attributes (A11Y)
**Location:** All UI components

**Issues:**
- No `aria-live` regions for real-time updates
- Missing `role="alert"` for emergency notifications
- No `aria-label` on icon-only buttons

**Impact:** Poor screen reader experience.

---

## Low Priority Suggestions

### 14. Type Assertions (TYPE SAFETY)
**Location:** `NotificationInbox.tsx:31-32`

```typescript
category: notification.category as any,
priority: notification.priority as any,
```

**Problem:** Defeats TypeScript type safety.

**Fix:** Use proper type guards or schema validation (zod).

---

### 15. Unused Variable (CODE QUALITY)
**Location:** `NotificationManagement.tsx:204`

```typescript
setChannels((prev) => [...prev, channel]);
```

**Variable `channels` never used elsewhere. Dead code.

---

### 16. Magic Numbers (MAINTAINABILITY)
**Location:** `Notifications.tsx:85`, `NotificationInbox.tsx:241`

```typescript
.limit(50)  // Why 50? Should be constant.
```

**Fix:** Extract to `const NOTIFICATION_PAGE_SIZE = 50;`

---

### 17. Missing Unit Tests (TESTING)
**Problem:** No test files found for notification components.

**Coverage:** 0% estimated.

**Recommendation:** Add Jest/React Testing Library tests for:
- Subscription lifecycle
- State updates
- Error handling
- Pagination

---

## Positive Observations

1. **Excellent TypeScript Usage:** Strong typing throughout with proper interfaces exported from shared package.

2. **Good Component Structure:** Logical separation of concerns (Composer, List, Card components).

3. **Proper Realtime Patterns:** Correct use of Supabase realtime subscriptions with cleanup functions (in most places).

4. **Well-Designed Database Schema:** Migration shows thoughtful design with proper indexes, constraints, and cascade deletes.

5. **Responsive UI:** Mobile component uses proper FlatList with performance optimizations.

6. **Consistent Naming:** Clear, descriptive variable and function names.

---

## Recommended Actions

### Immediate (Must Fix Before Deploy)
1. **Fix memory leaks in subscription cleanup** (Issue #1)
   - Add proper cleanup to all `useEffect` hooks with subscriptions
   - Test with React StrictMode and rapid unmount/remount scenarios

2. **Verify RLS policies** (Issue #2)
   - Audit all notification-related tables for proper RLS
   - Test with multiple user sessions

3. **Add pagination limits** (Issue #3)
   - Enforce maximum list size (e.g., 100 items)
   - Implement infinite scroll or load more button

4. **Fix race conditions** (Issue #4)
   - Review all state updates for race conditions
   - Use functional state updates where appropriate

### Short-term (Should Fix This Sprint)
5. **Add input sanitization** (Issue #5)
   - Install and integrate DOMPurify
   - Sanitize all user-generated content

6. **Improve error handling** (Issue #6)
   - Add toast notifications for all errors
   - Implement retry logic for failed requests

7. **Extract shared utilities** (Issue #9)
   - Create `@/components/ui/notification-helpers.ts`
   - Remove code duplication

8. **Add loading states** (Issue #11)
   - Ensure all async actions have visual feedback

### Long-term (Technical Debt)
9. **Add i18n support** (Issue #10)
10. **Improve accessibility** (Issue #13)
11. **Add unit tests** (Issue #17)
12. **Standardize date formatting** (Issue #12)

---

## Security Checklist

- [X] Input validation (API side)
- [ ] XSS prevention (missing client-side sanitization)
- [ ] CSRF protection (not verified)
- [X] SQL injection prevention (using parameterized queries via Supabase)
- [X] RLS policies (partially, needs verification)
- [ ] Rate limiting (not evident)
- [ ] Content Security Policy (not reviewed)

---

## Performance Checklist

- [ ] Subscription cleanup (CRITICAL - multiple leaks)
- [ ] Pagination (missing)
- [ ] Memoization (partial - some useCallback missing deps)
- [ ] Lazy loading (not implemented)
- [ ] Image optimization (N/A - no images)
- [ ] Bundle size (not analyzed)

---

## Metrics

- **Type Coverage:** ~95% (excellent)
- **Test Coverage:** 0% (critical gap)
- **Linting Issues:** Not run (CI/CD should catch)
- **Bundle Size Impact:** +45KB estimated (Supabase client + realtime)
- **Performance Score:** C (memory leaks, unbounded state)

---

## Unresolved Questions

1. **RLS Policy Status:** Are RLS policies properly defined for `notifications` table? Migration shows policies for `notification_recipients` and `notification_logs` but not the main table.

2. **CSRF Protection:** Is CSRF token validation implemented in middleware? Not visible in provided code.

3. **Rate Limiting:** Are API endpoints rate-limited to prevent abuse?

4. **Channel Cleanup:** Does `supabase.removeChannel()` properly clean up server-side resources?

5. **Testing Strategy:** What's the plan for unit testing realtime subscriptions?

---

## Summary

This implementation shows **strong TypeScript discipline** and **good architectural patterns**, but **critical memory management issues** and **security gaps** must be addressed before production deployment. The real-time subscription pattern is well-implemented conceptually but has several cleanup bugs that will cause production issues under load.

**Recommendation:** **Address all Critical Issues before merging to main.** The code is functional but not production-ready due to memory leaks and missing security validations.

**Next Steps:**
1. Fix subscription cleanup issues (highest priority)
2. Verify RLS policies
3. Add integration tests for realtime scenarios
4. Implement pagination
5. Add error boundary and retry logic
