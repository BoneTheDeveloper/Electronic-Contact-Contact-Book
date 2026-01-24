# Mobile Student App - Functional Design

**Date:** 2026-01-24
**Status:** Design Complete
**Reference Wireframes:** `docs/wireframe/Mobile/student/`

---

## Overview

Mobile-first React Native/Expo app for students with 9 functional screens. Design follows the wireframes with consistent styling, smooth animations, and Vietnamese localization.

---

## Design System

### Color Palette
```css
/* Primary */
--primary: #0284C7;           /* Main brand blue */
--primary-dark: #0369A1;      /* Gradient end */
--primary-light: #E0F2FE;     /* Light backgrounds */

/* Backgrounds */
--bg-app: #F8FAFC;            /* Slate-50 app background */
--bg-card: #FFFFFF;           /* White cards */
--bg-muted: #F1F5F9;          /* Slate-100 muted */

/* Text */
--text-primary: #1F2937;      /* Gray-800 */
--text-secondary: #6B7280;     /* Gray-500 */
--text-muted: #9CA3AF;         /* Gray-400 */
--text-light: #DBEAFE;         /* Blue-100 for headers */

/* Semantic */
--success: #10B981;           /* Emerald-500 */
--warning: #F59E0B;           /* Amber-500 */
--danger: #EF4444;            /* Red-500 */
--info: #0284C7;              /* Blue-500 */

/* Subject Colors */
--math: #F97316;              /* Orange */
--literature: #A855F7;        /* Purple */
--english: #10B981;           /* Emerald */
--physics: #6366F1;           /* Indigo */
--chemistry: #F59E0B;         /* Amber */
--history: #E11D48;           /* Rose */
```

### Typography
```css
font-family: 'Inter', sans-serif;

/* Headers */
--h1: 28px / 800 (ExtraBold)   /* Screen titles */
--h2: 20px / 800 (ExtraBold)   /* Subsection titles */
--h3: 18px / 800 (ExtraBold)   /* Card titles */

/* Body */
--body: 14px / 500 (Medium)    /* Regular text */
--caption: 12px / 600 (SemiBold)
--label: 10px / 900 (Black)

/* Buttons */
--btn: 14px / 800 (ExtraBold)
```

### Spacing & Layout
```css
/* Border Radius */
--radius-sm: 8px;             /* Small elements */
--radius-md: 12px;            /* Buttons, inputs */
--radius-lg: 16px;            /* Cards */
--radius-xl: 24px;            /* Large cards */
--radius-2xl: 28px;           /* Featured cards */
--radius-full: 9999px;        /* Circle, pill */

/* Padding */
--p-screen: 24px;             /* Screen horizontal padding */
--p-card: 16px-20px;          /* Card internal padding */
--p-sm: 12px;                 /* Small spacing */

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow: 0 1px 3px rgba(0,0,0,0.1);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--shadow-blue: 0 10px 15px rgba(2,132, 199, 0.2);
```

### Components

#### Screen Header
```tsx
<ScreenHeader
  title="Screen Title"
  subtitle="Additional info"
  showBack={true}
  showNotification={true}
/>
```

#### Card
```tsx
<Card variant="white|blue|dark" padding="md|lg">
  {/* Content */}
</Card>
```

#### Button
```tsx
<Button
  variant="primary|secondary|ghost"
  size="sm|md|lg"
  fullWidth={boolean}
>
  Button Text
</Button>
```

---

## Screen Specifications

### 1. Dashboard (`/student/dashboard`)

**Layout:**
- Gradient header (140px) with student info
- Notification bell with badge
- 3x3 function grid (9 icons)
- Bottom navigation (3 tabs)

**Components:**
```tsx
<StudentHeader />      // Avatar + Name + Class
<FunctionGrid />       // 3x3 grid
<BottomNav />          // Home | Messages | Profile
```

**Function Grid Items:**
1. Thời khóa biểu (Schedule) - Orange
2. Bảng điểm (Grades) - Blue
3. Điểm danh (Attendance) - Emerald
4. Tài liệu (Materials) - Rose
5. Xin nghỉ (Leave) - Rose
6. Nhận xét (Feedback) - Purple
7. Tin tức (News) - Sky
8. Tổng hợp (Summary) - Indigo
9. Học phí (Payments) - Amber

---

### 2. Grades (`/student/grades`) ✅ DONE

- Semester tabs
- GPA summary card
- Subject cards with color-coded grades
- Appeal modal with custom picker

---

### 3. Schedule (`/student/schedule`)

**Layout:**
- Header with week range
- Day selector (T2-T7 horizontal scroll)
- Morning/Afternoon sections
- Period cards

**Data:**
```tsx
interface Period {
  id: string;
  period: number;        // 1-10
  dayOfWeek: number;     // 1-7
  subject: Subject;
  teacher: Teacher;
  room: string;
  startTime: string;     // "07:00"
  endTime: string;       // "07:45"
}
```

---

### 4. Attendance (`/student/attendance`)

**Layout:**
- Month selector
- Calendar view grid
- Stats cards (Present, Absent, Late, Excused)
- Status colors for each day

---

### 5. Leave Request (`/student/leave`)

**Layout:**
- Tab switcher (Create | History)
- Form with leave type picker
- Date range picker
- Recent requests with appeal option

**Leave Types:**
- Gia đình (Family)
- Ốm đau (Sick)
- Lễ tết (Holiday)
- Cá nhân (Personal)
- Khác (Other)

---

### 6. Teacher Feedback (`/student/feedback`)

**Layout:**
- Filter tabs (All | Positive | Improve)
- Feedback cards with star rating
- Teacher avatar with initials
- Date and subject tag

---

### 7. News (`/student/news`)

**Layout:**
- Category tabs (All | School | Class | Activities)
- Featured news card (large, gradient)
- News list cards with thumbnails

---

### 8. Payments

**Overview (`/student/payments`):**
- Student info card
- Total debt card (dark gradient)
- Filter tabs (All | Unpaid | Partial | Paid)
- Invoice list with status badges

**Detail (`/student/payments/[id]`):**
- Invoice header info
- Fee items breakdown
- Payment type toggle (Full | Partial)
- Amount input
- Payment methods

---

### 9. Summary (`/student/summary`)

**Layout:**
- Semester selector
- Overall score card (circular progress)
- Stats grid (Attendance, Conduct)
- Subject breakdown with progress bars

---

### 10. Notifications (Bell Header)

**Layout:**
- Filter chips (All | School | Class | Fees | Attendance)
- Grouped by date (Today, Yesterday, Earlier)
- Notification cards with icons

---

## Navigation

### Bottom Navigation (3 Tabs)
```
┌─────────────────────────┐
│  🏠 Home   💬 Chat   👤  │
└─────────────────────────┘
```

### Stack Navigation
- Main tab contains all 9 functions as stack screens
- Each function has its own header with back button

---

## Interactions & Animations

### Touch Feedback
```css
icon-card:active { transform: scale(0.92); }
schedule-card:active { transform: scale(0.98); }
button:active { transform: scale(0.97); }
```

### Modal Animations
- Fade in backdrop
- Slide up from bottom (250ms cubic-bezier)

### Loading States
- Skeleton screens
- Activity indicators
- Smooth transitions

---

## API Endpoints Required

```
GET    /api/student/profile
GET    /api/student/grades?semester=
GET    /api/student/schedule?week=
GET    /api/student/attendance?month=
GET    /api/student/leave-requests
POST   /api/student/leave-requests
GET    /api/student/feedback
GET    /api/student/news
GET    /api/student/payments
GET    /api/student/payments/:id
POST   /api/student/payments/:id/pay
GET    /api/student/notifications
GET    /api/student/summary?semester=
POST   /api/student/grade-appeals
```

---

## Icon System

Using Lucide React Native or Feather Icons:
- 32px for function grid icons
- 20px for buttons/headers
- 16px for inline icons
- 2.5px stroke width

---

## Accessibility

- All touch targets ≥ 44x44px
- Focus indicators visible
- Screen reader labels
- Color contrast ≥ 4.5:1
- Semantic HTML in web views

---

**Status:** Ready for Implementation
**Wireframes:** 10 HTML files in `docs/wireframe/Mobile/student/`
