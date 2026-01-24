# Phase 06: Communication Screens

**Status:** Pending
**Priority:** Medium
**Dependencies:** Phase 01, Phase 02

## Overview

Implement screens for student communication: News & Events, Notifications, and Teacher Feedback. These keep students informed about school activities and their progress.

## Context Links

- [News Wireframe](../../../docs/wireframe/Mobile/student/news.html)
- [Notifications Wireframe](../../../docs/wireframe/Mobile/student/notifications.html)
- [Teacher Feedback Wireframe](../../../docs/wireframe/Mobile/student/teacher-feedback.html)
- [Design Guidelines](../../../docs/mobile_function/web-student-portal-design.md)

## Key Insights

1. News: Featured card + list with categories
2. Notifications: Grouped by date, filterable by type
3. Feedback: Positive/Needs improvement, star ratings

## Requirements

### News Screen (`/student/news`)
- Category tabs (All, School, Class, Activities)
- Featured news card (large, gradient)
- News list with view counts

### Notifications (Header Bell)
- Filter chips (All, School, Class, Fees, Attendance)
- Grouped by date (Today, Yesterday, Earlier)
- Notification cards with icons

### Teacher Feedback (`/student/feedback`)
- Filter tabs (All, Positive, Needs improvement)
- Stats cards (counts)
- Feedback cards with star ratings

## Implementation Steps

### Step 1: News Screen

**Data Structure:**
```tsx
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'school' | 'class' | 'activity';
  isFeatured: boolean;
  publishDate: Date;
  viewCount: number;
  content?: string;
  imageUrl?: string;
}
```

**Components:**
1. `CategoryTabs` - Horizontal scrollable
2. `FeaturedNewsCard` - Large gradient card
3. `NewsCard` - List item with category badge

**Category Colors:**
- School: blue
- Class: purple
- Activities: emerald

### Step 2: Notifications (Header Dropdown)

**Data Structure:**
```tsx
interface Notification {
  id: string;
  type: 'school' | 'class' | 'fee' | 'attendance' | 'feedback';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  priority: 'normal' | 'important';
}
```

**Components:**
1. `NotificationBell` - Header icon with badge
2. `NotificationDropdown` - Popover menu
3. `FilterChips` - Filter by type
4. `NotificationCard` - Individual notification
5. `DateGroupHeader` - "Today", "Yesterday", etc.

**Notification Types & Icons:**
- School: Calendar (blue)
- Class: Users (purple)
- Fee: Dollar (amber)
- Attendance: CheckCircle (green)
- Feedback: Message (pink)

**Important Notification:**
- Gradient blue background card
- "Quan trọng" badge
- Shows at top of list

### Step 3: Teacher Feedback Screen

**Data Structure:**
```tsx
interface TeacherFeedback {
  id: string;
  teacher: {
    id: string;
    name: string;
    subject: string;
    initials: string;
  };
  type: 'positive' | 'improvement';
  rating: number;  // 1-5 stars
  content: string;
  date: Date;
}
```

**Components:**
1. `FilterTabs` - All, Positive, Needs improvement
2. `StatsCards` - 2-card grid (positive, attention counts)
3. `FeedbackCard` - Individual feedback with stars

**Star Rating:**
- 5 stars max
- Gold color for filled
- Gray for empty
- Click to view (if details available)

## Related Code Files

- `apps/web/app/admin/notifications/page.tsx` - Admin notifications
- `apps/web/components/admin/` - Similar card components

## Todo List

### News
- [ ] Create news page structure
- [ ] Build CategoryTabs component
- [ ] Build FeaturedNewsCard component
- [ ] Build NewsCard component
- [ ] Implement news fetch from API
- [ ] Add category filtering
- [ ] Add loading/empty states

### Notifications
- [ ] Create NotificationDropdown component
- [ ] Build NotificationBell with badge
- [ ] Build FilterChips component
- [ ] Build NotificationCard component
- [ ] Add date grouping logic
- [ ] Implement mark as read
- [ ] Add "View all" link to dedicated page

### Feedback
- [ ] Create feedback page structure
- [ ] Build FilterTabs component
- [ ] Build StatsCards (2-card grid)
- [ ] Build FeedbackCard with star rating
- [ ] Implement feedback fetch from API
- [ ] Add filter functionality
- [ ] Add loading/empty states

### Testing
- [ ] Test news category filtering
- [ ] Test notification dropdown
- [ ] Test notification filtering
- [ ] Test feedback filter tabs
- [ ] Test star rating display

## Success Criteria

- [ ] News displays featured and list items
- [ ] News categories filter correctly
- [ ] Notification dropdown opens/closes
- [ ] Notification badge shows correct count
- [ ] Notification types filter correctly
- [ ] Feedback displays with correct star ratings
- [ ] All filters work as expected
- [ ] Responsive layout on all screens

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| No news items | Low | Show empty state |
| Notification overflow | Medium | Limit to 20, add pagination |
| Missing feedback | Low | Show "No feedback yet" message |

## Security Considerations

1. Students only see their own feedback
2. News/notifications filtered by student's class
3. No XSS in user-generated content

## Next Steps

Once this phase is complete, proceed to [Phase 07: Additional Screens](phase-07-additional-screens.md)
