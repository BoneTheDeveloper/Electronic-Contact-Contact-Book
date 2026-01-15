# Teacher Portal Wireframe Analysis

**Date:** 2026-01-15
**Location:** `docs/wireframe/Web_app/Teacher/`
**Files Analyzed:** 6 HTML files

---

## 1. File Inventory

| File | Purpose | Status |
|------|---------|--------|
| `dashboard.html` | Main teacher dashboard | ✅ Complete |
| `attendance.html` | Attendance marking system | ✅ Complete |
| `grade-entry.html` | Grade entry & management | ✅ Complete |
| `regular-assessment.html` | Student assessment comments | ✅ Complete |
| `academic-conduct-rating.html` | Academic/conduct ratings (GVCN) | ✅ Complete |
| `chat.html` | Parent-teacher messaging | ✅ Complete |

---

## 2. Navigation Structure (from dashboard.html)

### Sidebar Organization

**Group 1: Cá nhân (Personal)**
- `dashboard.html` - Tổng quan (Overview)

**Group 2: Giảng dạy (GVBM - Subject Teacher)**
- Lịch giảng dạy (Teaching Schedule)
- `attendance.html` - Điểm danh (Attendance)
- Quản lý lớp dạy (Class Management)
- `grade-entry.html` - Nhập điểm số (Grade Entry)
- `regular-assessment.html` - Đánh giá nhận xét (Regular Assessment)
- Phúc khảo điểm (Grade Review) - **Badge: 2 pending**

**Group 3: Chủ nhiệm (GVCN - Homeroom Teacher)**
- `academic-conduct-rating.html` - Học tập & Hạnh kiểm (Academic & Conduct)
- Quản lý lớp CN (Homeroom Class Management)
- Phê duyệt nghỉ phép (Leave Approval) - **Badge: 3 pending**

### Navigation Active State Pattern
```css
.nav-item.active {
    background-color: rgba(2, 132, 199, 0.1);
    color: var(--primary);
    border-right: 4px solid var(--primary);
}
```

---

## 3. Core UI Patterns & Components

### 3.1 Card Styles

**Main Card Container**
```css
bg-white rounded-[32px] card-shadow border border-slate-100
```
- Border radius: 32px (extra rounded)
- Shadow: `box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- Border: `border-slate-100`

**Stats Cards**
```html
<div class="bg-gradient-to-br from-{color}-50 to-{color}-100 p-4 rounded-xl border border-{color}-200">
```
- Gradient backgrounds for visual hierarchy
- Color-coded: green (success), amber (warning), red (danger), blue (info)

### 3.2 Button Patterns

**Primary Button**
```html
<button class="px-6 py-3 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1]">
```

**Secondary Button**
```html
<button class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50">
```

**Status Buttons (Attendance)**
```css
.status-btn.P { background: #dcfce7; color: #16a34a; } /* Present */
.status-btn.A { background: #fee2e2; color: #dc2626; } /* Absent */
.status-btn.L { background: #fef9c3; color: #ca8a04; } /* Late */
.status-btn.E { background: #dbeafe; color: #2563eb; } /* Excused */
```

### 3.3 Badge Styles

**Notification Badge**
```html
<span class="w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">2</span>
```

**Status Badge**
```html
<span class="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Đã đánh giá</span>
```

### 3.4 Form Elements

**Select Dropdowns**
```html
<select class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none">
```

**Inputs**
```html
<input type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none">
```

**Grade Inputs (Special)**
```css
.grade-input {
    width: 100%;
    padding: 8px;
    text-align: center;
    font-weight: 600;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
}
.grade-input.filled { background-color: #f0fdf4; border-color: #86efac; }
.grade-input.locked { background-color: #f1f5f9; cursor: not-allowed; }
```

### 3.5 Table Styles

**Standard Table**
```html
<table class="w-full text-left">
<thead class="bg-slate-50">
<th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
```

**Grade Table (Sticky Headers)**
```css
.grade-table th {
    position: sticky;
    top: 0;
    z-index: 10;
}
.grade-table tbody tr:hover { background-color: #f8fafc; }
```

---

## 4. Page-by-Page Analysis

### 4.1 dashboard.html

**Purpose:** Main overview dashboard for teachers

**Key Sections:**
- **Stats Grid (4 cards):** Teaching classes, Grade reviews, Leave requests, Grade completion rate
- **Grade Review Section:** Pending grade re-evaluation requests (GVBM)
- **Regular Assessment Section:** Student evaluation summary with 4 stats cards (evaluated, pending, positive, needs attention)
- **Academic & Conduct Rating Section:** Class rating summary (GVCN)
- **Leave Requests Table:** Pending leave approvals with action buttons
- **Today's Schedule:** Dark-themed sidebar showing teaching schedule
- **Notifications:** Quick notification widget

**Data Structures Implied:**
```typescript
interface DashboardStats {
  teachingClasses: number;
  gradeReviews: number;
  leaveRequests: number;
  gradeCompletionRate: percentage;
}

interface GradeReview {
  studentId: string;
  studentName: string;
  class: string;
  examType: string;
  currentScore: number;
  reason?: string;
}

interface RegularAssessment {
  studentId: string;
  studentName: string;
  class: string;
  subject: string;
  status: 'evaluated' | 'pending' | 'needs-attention';
  comment?: string;
  rating?: number; // 1-5 stars
  date: string;
}

interface AcademicRating {
  studentId: string;
  studentName: string;
  mssv: string;
  academicRating: 'excellent' | 'good' | 'fair' | 'average' | 'poor';
  academicScore: number;
  conductRating: 'good' | 'fair' | 'average' | 'poor';
}

interface LeaveRequest {
  studentId: string;
  studentName: string;
  leaveDates: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}
```

---

### 4.2 attendance.html

**Purpose:** Mark and manage student attendance

**Key Sections:**
- **Filter Card:** Class selection, Date picker, Session (morning/afternoon)
- **Status Legend:** P (Present), A (Absent), L (Late), E (Excused)
- **Attendance Table:** Student list with status buttons and notes
- **Bulk Actions:** "Mark all present", "Auto-fill excused absences"
- **Action Buttons:** Save draft, Confirm & Complete

**Interactive Elements:**
```javascript
// Status selection
setStatus(studentId, status) // P, A, L, E

// Bulk operations
markAllPresent() // Sets all students to Present
autoFillExcused() // Fills E for students with approved leaves

// Persistence
saveDraft() // Saves without confirming
confirmAttendance() // Finalizes and sends notifications to parents
```

**Data Structures Implied:**
```typescript
interface AttendanceRecord {
  classId: string;
  date: string;
  session: 'morning' | 'afternoon';
  students: {
    [studentId: string]: {
      status: 'P' | 'A' | 'L' | 'E';
      note?: string;
    };
  };
  status: 'pending' | 'completed';
  lastSaved?: string;
}

interface Student {
  id: number;
  name: string;
  code: string; // MSSV
  seat: number;
  approvedLeave: boolean; // Has approved leave request
}
```

---

### 4.3 grade-entry.html

**Purpose:** Enter and manage student grades

**Key Sections:**
- **Filter Card:** School year, Semester, Class, Subject
- **Formula Legend:** Displays grade calculation formula
- **Grade Table:**
  - Sticky first column (student info)
  - Columns: TX1, TX2, TX3 (1x weight), GK (2x weight), CK (3x weight), Average
  - Average auto-calculated with color coding
- **Class Statistics:** Excellent (≥8.0), Good (6.5-7.9), Average (5.0-6.4), Poor (<5.0)
- **Lock Status:** Shows if grades are locked (admin only can unlock)
- **Action Buttons:** Save draft, Download template, Import Excel, Lock grades

**Grade Average Calculation:**
```javascript
// Formula displayed in UI: ĐTB = (TX1 + TX2 + TX3) × 1 + GK × 2 + CK × 3 ÷ 8
function calcAverage(tx1, tx2, tx3, gk, ck) {
  const values = [tx1, tx2, tx3, gk, ck].map(v => parseFloat(v));
  if (values.some(v => isNaN(v))) return '--';

  const weights = [1, 1, 1, 2, 3];
  const totalWeight = weights.reduce((a, b) => a + b, 0); // 8

  const weightedSum = values.reduce((sum, val, i) => sum + (val * weights[i]), 0);
  return weightedSum / totalWeight;
}
```

**Average Color Coding:**
```css
.average-display.excellent { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.average-display.good { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
.average-display.average { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.average-display.poor { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
```

**Data Structures Implied:**
```typescript
interface GradeEntry {
  classId: string;
  subjectId: string;
  semester: 1 | 2;
  schoolYear: string; // "2024-2025"
  locked: boolean;
  grades: {
    [studentId: string]: {
      tx1: number;
      tx2: number;
      tx3: number;
      gk: number; // Midterm
      ck: number; // Final
    };
  };
}

interface GradeStatistics {
  excellent: number; // ≥ 8.0
  good: number; // 6.5 - 7.9
  average: number; // 5.0 - 6.4
  poor: number; // < 5.0
  classAverage: number;
}
```

---

### 4.4 regular-assessment.html

**Purpose:** Write qualitative assessments for students

**Key Sections:**
- **Filter Bar:** Class, Subject, Status (All/Pending/Evaluated/Needs Attention), Search
- **Summary Stats:** 4 gradient cards (evaluated count, pending, positive, needs attention)
- **Student Cards:**
  - Evaluated (green border): Shows comment, rating stars, date
  - Pending (amber dashed border): "Evaluate now" CTA
  - Needs Attention (red border): Warning comment, "Contact Parent" button

**Rating Stars Display:**
```html
<svg fill="#F59E0B" /> <!-- Filled star (amber) -->
<svg fill="#D1D5DB" /> <!-- Empty star (gray) -->
```

**Student Card Variants:**

1. **Evaluated (Positive)**
```html
<div class="student-card bg-white p-6 rounded-2xl border border-slate-200">
  <!-- Student info, 5 stars, purple comment box, date, action buttons -->
</div>
```

2. **Not Evaluated**
```html
<div class="student-card bg-white p-6 rounded-2xl border-2 border-dashed border-amber-300">
  <!-- Amber warning, empty stars, "Evaluate now" CTA button -->
</div>
```

3. **Needs Attention**
```html
<div class="student-card bg-white p-6 rounded-2xl border border-red-200">
  <!-- Red border, warning comment, "Contact Parent" button -->
</div>
```

**Data Structures Implied:**
```typescript
interface RegularAssessment {
  studentId: string;
  studentName: string;
  classId: string;
  subjectId: string;
  status: 'evaluated' | 'pending' | 'needs-attention';
  comment: {
    category: string; // "Bài tập về nhà", "Tiến bộ học tập", etc.
    content: string;
  };
  rating: number; // 1-5 stars
  createdAt: string;
  updatedAt: string;
}
```

---

### 4.5 academic-conduct-rating.html

**Purpose:** Homeroom teacher rates academic & conduct performance (GVCN only)

**Key Sections:**
- **Filter Bar:** Semester, Academic Rating filter, Conduct Rating filter, Search
- **Academic Rating Summary:** 5 cards (Giỏi xuất sắc, Giỏi, Khá, Trung bình, Cần cố gắng)
- **Conduct Rating Summary:** 4 cards with colored dots (Tốt, Khá, Trung bình, Yếu)
- **Student List:**
  - Avatar initials with color coding
  - Academic badge + average score
  - Conduct dot + rating text
  - Action buttons: "Chi tiết", "Sửa xếp loại", "Liên hệ PH"

**Academic Rating Scale:**
- Giỏi xuất sắc: ≥ 9.0 (green)
- Giỏi: 8.0 - 8.9 (blue)
- Khá: 6.5 - 7.9 (yellow)
- Trung bình: 5.0 - 6.4 (orange)
- Cần cố gắng: < 5.0 (red)

**Conduct Rating Scale:**
```html
<div class="w-3 h-3 rounded-full bg-emerald-500"></div> <!-- Tốt (Good) -->
<div class="w-3 h-3 rounded-full bg-blue-500"></div>   <!-- Khá (Fair) -->
<div class="w-3 h-3 rounded-full bg-yellow-500"></div> <!-- Trung bình (Average) -->
<div class="w-3 h-3 rounded-full bg-red-500"></div>    <!-- Yếu (Poor) -->
```

**Pagination:**
```html
<button disabled>Trước</button>
<button class="bg-[#0284C7] text-white">1</button>
<button>2</button>
<button>3</button>
<button>...</button>
<button>7</button>
<button>Sau</button>
```

**Data Structures Implied:**
```typescript
interface AcademicConductRating {
  studentId: string;
  studentName: string;
  mssv: string;
  semester: 1 | 2;
  schoolYear: string;
  academicRating: 'excellent-plus' | 'excellent' | 'good' | 'average' | 'needs-improvement';
  academicScore: number; // 0-10
  conductRating: 'good' | 'fair' | 'average' | 'poor';
  classId: string; // Homeroom class
}

interface ConductRatingScale {
  good: number;      // Tốt
  fair: number;      // Khá
  average: number;   // Trung bình
  poor: number;      // Yếu
}
```

---

### 4.6 chat.html

**Purpose:** Real-time messaging with parents

**Layout:** 3-column layout
- **Left (320px):** Chat list with search & tabs
- **Center (flex-1):** Active conversation
- **Right (320px, hidden on mobile):** Contact info & shared files

**Key Features:**
- **Online Indicators:** Green dot (online), gray dot (offline)
- **Unread Badges:** Red circle with count
- **Message Bubbles:**
  - Sent: Blue gradient, right-aligned
  - Received: Gray, left-aligned
- **Typing Indicator:** Animated dots
- **Message Actions:** Phone call, video call, info
- **File Sharing:** PDF, images, etc.
- **Timestamps:** Relative (2p, 15p, Hôm qua, etc.)

**Message Bubble Styles:**
```css
.message-bubble.sent {
  background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
  color: white;
  border-radius: 1rem 1rem 0.25rem 1rem; /* rounded-br-sm */
}

.message-bubble.received {
  background-color: #f1f5f9;
  color: slate-700;
  border-radius: 1rem 1rem 1rem 0.25rem; /* rounded-bl-sm */
}
```

**Typing Animation:**
```css
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}
```

**Data Structures Implied:**
```typescript
interface ChatConversation {
  conversationId: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  classId: string;
  online: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  messageId: string;
  conversationId: string;
  senderId: string; // teacher or parent
  senderType: 'teacher' | 'parent';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
}

interface ContactInfo {
  parentName: string;
  phone: string;
  email: string;
  studentName: string;
  mssv: string;
  sharedFiles: SharedFile[];
}
```

---

## 5. Color Scheme & Spacing

### Primary Colors
```css
--primary: #0284C7; /* Sky Blue */
--primary-dark: #0369a1;
```

### Status Colors
```css
/* Success */
--success-light: #dcfce7;
--success: #16a34a;
--success-dark: #059669;

/* Warning */
--warning-light: #fef9c3;
--warning: #ca8a04;

/* Danger */
--danger-light: #fee2e2;
--danger: #dc2626;

/* Info */
--info-light: #dbeafe;
--info: #2563eb;
```

### Spacing Scale
```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 0.75rem;  /* 12px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
```

### Typography
```css
font-family: 'Inter', sans-serif;

/* Text Sizes */
text-[10px]  /* Labels, badges */
text-xs      /* 12px - Secondary text */
text-sm      /* 14px - Body text */
text-base    /* 16px - Normal text */
text-lg      /* 18px - Subheadings */
text-xl      /* 20px - Headings */
text-2xl     /* 24px - Large headings */
text-3xl     /* 30px - Stats */

/* Font Weights */
font-medium  /* 500 */
font-bold    /* 700 */
font-black   /* 900 - Often used with uppercase */
```

---

## 6. Key Interactive Patterns

### 6.1 Toast Notifications
```javascript
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3000);
}
```

### 6.2 Hover Effects
```css
.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.chat-item:hover {
  background-color: #f8fafc;
}
```

### 6.3 Status Badges (Dynamic)
```javascript
// Lock status badge (Grade Entry)
if (isGradesLocked) {
  badge.className = 'bg-red-100 text-red-700';
  text.textContent = 'Đã khóa điểm';
} else {
  badge.className = 'bg-green-100 text-green-700';
  text.textContent = 'Chưa khóa điểm';
}
```

---

## 7. Responsive Design Notes

- **Sidebar:** Fixed 280px width on desktop, hidden on mobile
- **Stats Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **Tables:** Horizontal scroll on mobile (`overflow-x-auto`)
- **Chat:** Right sidebar hidden on mobile (`hidden lg:block`)
- **Buttons:** Full width on mobile, auto on desktop

---

## 8. Implementation Recommendations

### 8.1 Component Library
Build reusable components for:
- `Card` - with variants (stats, standard, gradient)
- `Button` - with variants (primary, secondary, status)
- `Badge` - with status colors
- `Table` - with sticky headers option
- `Select`/`Input` - with consistent styling
- `Avatar` - with initials and online indicators
- `MessageBubble` - for chat

### 8.2 State Management
Consider Zustand for:
- `useAttendanceStore` - attendance records
- `useGradeStore` - grade entries & locking
- `useAssessmentStore` - student assessments
- `useChatStore` - conversations & messages

### 8.3 Data Validation
- Grade inputs: 0-10, step 0.25
- Attendance: required status before confirm
- Dates: prevent future dates for attendance
- Required fields before form submission

### 8.4 Accessibility
- All form inputs have labels
- Button focus states
- Keyboard navigation for status buttons
- ARIA labels for icons
- Color contrast ratios meet WCAG AA

---

## 9. Open Questions

1. **Real-time updates:** Should chat use WebSockets or polling?
2. **File uploads:** What file types/sizes allowed in chat?
3. **Offline support:** Should attendance/grades work offline?
4. **Permission model:** Can GVCN see all subject grades?
5. **Notification preferences:** How do teachers configure alerts?
6. **Export formats:** PDF, Excel for grades/attendance?

---

## Summary

The wireframes demonstrate a well-structured teacher portal with:
- **Clear role separation** (GVBM vs GVCN features)
- **Consistent UI patterns** across all pages
- **Comprehensive grade management** with locking mechanism
- **Rich assessment tools** (quantitative + qualitative)
- **Real-time communication** with parents
- **Strong visual hierarchy** using color coding and badges

All pages follow the same design system with Tailwind CSS, making implementation straightforward with shadcn/ui components.
