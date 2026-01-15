# Next.js + PostgreSQL School Management System Architecture

## Recommended Next.js Structure

### App Router Organization
```
app/
├── (auth)/                    # Auth pages (login, register)
├── (admin)/                   # Admin portal - dashboard, users, payments
│   ├── layout.tsx
│   ├── page.tsx
│   ├── users/
│   ├── classes/
│   ├── payments/
│   └── reports/
├── (teacher)/                 # Teacher portal - attendance, grades, chat
│   ├── layout.tsx
│   ├── page.tsx
│   ├── attendance/
│   ├── grades/
│   └── messages/
├── (shared)/                  # Common components
│   ├── layout.tsx
│   └── components/
└── api/                       # API routes
    ├── auth/
    ├── users/
    ├── classes/
    └── [...nextauth]/
```

### Key Architecture Decisions
- **Separate portals**: `(admin)` and `(teacher)` route groups for isolation
- **Shared base**: Common layout in `(shared)` with role-aware navigation
- **Server-first**: Default to server components for performance
- **API routes**: RESTful endpoints for external integrations

## Prisma Schema Outline

### Core Tables
```prisma
// Users with role-based access
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      UserRole // ADMIN, TEACHER, STUDENT, PARENT
  // ... other fields
}

// Academic structure
model Class {
  id          String    @id @default(cuid())
  name        String
  gradeLevel  Int
  academicYear String
  // ... relations
}

model Subject {
  id   String @id @default(cuid())
  name String
  // ... relations
}

// Academic records
model Attendance {
  id        String   @id @default(cuid())
  studentId String
  classId   String
  date      DateTime
  status    AttendanceStatus
  // ... relations
}

model Grade {
  id        String    @id @default(cuid())
  studentId String
  subjectId String
  classId   String
  term      String
  score     Float
  // ... relations
}

// Administrative
model Fee {
  id          String    @id @default(cuid())
  studentId   String
  amount      Float
  dueDate     DateTime
  status      PaymentStatus
  // ... relations
}

model Notification {
  id        String   @id @default(cuid())
  title     String
  message   String
  type      NotificationType
  recipient String   // role-specific or user-specific
  // ... relations
}
```

## Component Organization

### UI Layer (shadcn/ui + Tailwind)
- **Layout Components**: Sidebar, header, dashboard grid
- **Form Components**: Reusable forms with validation
- **Data Display**: Tables, cards, charts (recharts)
- **Shared**: Theme provider, auth wrapper

### Component Structure
```
components/
├── ui/                    # shadcn/ui components
├── layout/                # Layout components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── Navigation.tsx
├── forms/                 # Reusable form components
├── charts/                # Data visualization
└── shared/                # Common utilities
```

## Mock Data Strategy

### JSON Files Approach
```
mock-data/
├── users.json
├── classes.json
├── subjects.json
├── attendance.json
├── grades.json
├── fees.json
└── notifications.json
```

### Benefits
- Quick setup for development
- Easy to modify test scenarios
- No database dependency
- Can be replaced with Prisma seed scripts later

## API Routes vs Server Actions

### Recommended Mix
1. **Server Actions** for:
   - Simple CRUD operations
   - Form submissions
   - Direct database mutations

2. **API Routes** for:
   - External integrations
   - Complex queries
   - WebSocket connections
   - File uploads

### Implementation Pattern
```typescript
// Server action example
'use server'
import { createGrade } from '@/lib/actions'

export async function createGradeAction(data: GradeFormData) {
  return await createGrade(data)
}

// API route example
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  // Handle complex query logic
}
```

## Key Design Patterns

### Authentication
- Role-based middleware protecting route groups
- JWT sessions with NextAuth.js
- Permission checks at component level

### Data Fetching
- Server components for initial data
- React Query for client-side data
- Streaming for large datasets

### State Management
- Zustand for global state (theme, user)
- React Query for server state
- Local state for forms and UI interactions