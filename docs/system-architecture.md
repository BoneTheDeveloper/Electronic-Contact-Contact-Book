# System Architecture - School Management System

## Overview

The School Management System is built as a monorepo application with two primary client applications (mobile and web) and a shared backend infrastructure. The architecture is designed for scalability, maintainability, and performance while maintaining separation of concerns across different user roles.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            Load Balancer                                │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API Gateway                                    │
│  - Rate Limiting                                                       │
│  - Authentication                                                     │
│  - Request Logging                                                   │
│  - CORS Management                                                   │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
     ┌─────────────────────────┼─────────────────────────┐
     │                         │                         │
┌────▼─────────┐     ┌────────▼──────────┐     ┌────────▼──────────┐
│   Web App    │     │   Mobile App     │     │   Admin Portal   │
│   (Next.js)  │     │   (React Native) │     │   (Next.js)      │
└────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
     │                         │                         │
     └─────────────────────────┼─────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Backend Services                              │
│  ┌─────────────────────────┐  ┌─────────────────────────┐               │
│  │    Supabase Database    │  │   Supabase Storage    │               │
│  │   - PostgreSQL          │  │   - File Storage      │               │
│  │   - Realtime            │  │   - CDN              │               │
│  │   - Auth                │  │   - Image Processing  │               │
│  └─────────────────────────┘  └─────────────────────────┘               │
│                                                                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐               │
│  │   Edge Functions        │  │   External APIs       │               │
│  │   - Authentication     │  │   - Email Service     │               │
│  │   - Webhooks            │  │   - SMS Gateway       │               │
│  │   - Background Jobs     │  │   - Payment Gateway   │               │
│  └─────────────────────────┘  └─────────────────────────┘               │
└─────────────────────────────────────────────────────────────────────────┘
```

## Monorepo Structure

The project uses a monorepo structure with Turborepo for build orchestration:

```
electric_contact_book/
├── apps/                    # Applications
│   ├── mobile/             # React Native + Expo mobile app
│   │   ├── src/
│   │   │   ├── screens/    # Screen components
│   │   │   ├── navigation/ # Navigation setup
│   │   │   ├── stores/     # Zustand state management
│   │   │   ├── utils/      # Utility functions
│   │   │   └── types/      # TypeScript types
│   │   ├── App.tsx
│   │   └── package.json
│   └── web/                # Next.js web app
│       ├── app/           # App Router
│       │   ├── api/       # API routes
│       │   ├── (auth)/    # Auth routes
│       │   ├── (admin)/   # Admin routes
│       │   └── (teacher)/ # Teacher routes
│       ├── components/    # Reusable components
│       ├── lib/          # Utilities and config
│       └── package.json
│
├── packages/              # Shared packages
│   └── shared-types/      # TypeScript shared types
│
├── docs/                 # Documentation
├── plans/                # Implementation plans
└── .turbo/               # Turborepo configuration
```

## Application Architecture

### Mobile App (React Native + Expo)

#### Technology Stack
- **Framework**: React Native 0.76.9 with Expo SDK 54
- **Navigation**: React Navigation 7.x
- **UI Components**: React Native Paper 5.x (Material Design)
- **State Management**: Zustand
- **Authentication**: Supabase Auth
- **Database**: Supabase Realtime + PostgreSQL
- **Storage**: Supabase Storage
- **Code Quality**: ESLint with custom boolean props rules

#### Phase 1 Student Screen Implementation
The mobile app has been enhanced with a comprehensive set of student screens:

**Architecture Changes:**
- **Before**: Single `StudentScreens.tsx` component with tab-based navigation
- **After**: Dedicated screen components with stack navigation

**Screen Structure:**
- **Home Tab Stack**: 10 individual screens for academic features
- **Profile Tab Stack**: 6 screens for account management
- **Navigation Pattern**: Bottom tabs with headerless stack navigation

**Created Screens:**
- Schedule: Weekly class schedule with time periods
- Grades: Academic performance tracking with assignment details
- Attendance: Class attendance records and statistics
- StudyMaterials: Educational resources library
- LeaveRequest: Absence submission workflow
- TeacherFeedback: Communication interface for students
- News: School announcements and updates
- Summary: Consolidated academic overview
- Payment: Fee payment management and history

**Technical Implementation:**
- Consistent component naming: `Student{Feature}Screen`
- Export pattern via index file for clean imports
- TypeScript interfaces for type safety
- Mock data placeholders for Supabase integration

#### Component Architecture
```
App.tsx
├── AuthNavigator.tsx
│   ├── LoginScreen.tsx
│   └── CustomLoginScreen.tsx
├── ParentTabs.tsx
│   ├── Dashboard.tsx
│   ├── Grades.tsx
│   ├── Attendance.tsx
│   ├── Messages.tsx
│   ├── Notifications.tsx
│   ├── News.tsx
│   ├── TeacherDirectory.tsx
│   ├── LeaveRequest.tsx
│   ├── Schedule.tsx
│   ├── Summary.tsx
│   ├── PaymentOverview.tsx
│   ├── PaymentMethod.tsx
│   └── PaymentDetail.tsx
└── StudentTabs.tsx
    ├── Home Stack (Header Hidden)
    │   ├── StudentDashboard.tsx → DashboardScreen
    │   ├── StudentSchedule.tsx → ScheduleScreen
    │   ├── StudentGrades.tsx → GradesScreen
    │   ├── StudentAttendance.tsx → AttendanceScreen
    │   ├── StudentStudyMaterials.tsx → StudyMaterialsScreen
    │   ├── StudentLeaveRequest.tsx → LeaveRequestScreen
    │   ├── StudentTeacherFeedback.tsx → TeacherFeedbackScreen
    │   ├── StudentNews.tsx → NewsScreen
    │   ├── StudentSummary.tsx → SummaryScreen
    │   └── StudentPayment.tsx → PaymentScreen
    └── Profile Stack
        ├── ProfileScreen.tsx
        ├── UpdateProfileScreen.tsx
        ├── ChangePasswordScreen.tsx
        ├── BiometricAuthScreen.tsx
        ├── FAQScreen.tsx
        └── SupportScreen.tsx
```

#### State Management Pattern
```typescript
// Centralized store using Zustand
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  // Actions
}));

// Screen-level state
const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });
};
```

### Web App (Next.js 15)

#### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Runtime**: Node.js 18+
- **State Management**: React Query + Zustand
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: NextAuth.js + Supabase
- **Database**: PostgreSQL with Supabase
- **Forms**: React Hook Form with Zod validation

#### Component Architecture
```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Home page
├── (auth)/
│   ├── login/
│   │   └── page.tsx             # Login page
│   └── register/
│       └── page.tsx             # Register page
├── (admin)/
│   ├── dashboard/
│   │   └── page.tsx             # Admin dashboard
│   ├── users/
│   │   └── page.tsx             # User management
│   └── classes/
│       └── page.tsx             # Class management
├── (teacher)/
│   ├── dashboard/
│   │   └── page.tsx             # Teacher dashboard
│   ├── attendance/
│   │   └── page.tsx             # Attendance marking
│   └── grades/
│       └── page.tsx             # Grade management
└── api/                         # API routes
    ├── auth/
    ├── users/
    ├── classes/
    ├── payments/
    └── notifications/            # Notification management API
        ├── route.ts            # CRUD operations
        └── my/                 # User-specific notifications
            └── route.ts        # Inbox management
```

## Notification System Architecture

### Overview
The notification system is a multi-channel real-time communication platform that delivers notifications through various channels with tracking and analytics capabilities.

### Architecture Components
```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Notification System                             │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │   Admin Portal      │  │   Web Inbox        │  │   Mobile App        │  │
│  │                     │  │                     │  │                     │  │
│  │ • Create/Manage     │  │ • Real-time View    │  │ • Vietnamese UI     │  │
│  │ • Delivery Tracking │  │ • Mark as Read     │  │ • Pull-to-Refresh   │  │
│  │ • Analytics         │  │ • Batch Actions     │  │ • Floating Actions  │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────┤
│                         Backend Services                                │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │   Supabase Realtime │  │   Notification     │  │   Delivery Logs     │  │
│  │   Subscriptions     │  │   Queue            │  │   Tracking          │  │
│  │                     │  │                     │  │                     │  │
│  │ • WebSocket Events   │  │ • Priority Routing  │  │ • Channel Status    │  │
│  │ • Real-time Updates  │  │ • Scheduling       │  │ • Retry Logic       │  │
│  │ • Memory Management  │  │ • Batch Processing  │  │ • Analytics         │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Real-time Architecture
#### Web App Real-time Flow
```typescript
// Subscribe to notifications
const channel = subscribeToNotifications(userId, (notification) => {
  setNotifications(prev => {
    // Prevent duplicates
    if (prev.some(n => n.id === notification.id)) return prev;
    return [notification, ...prev];
  });
});

// Subscribe to delivery status (admin only)
const deliveryChannel = subscribeToDeliveryStatus(notificationId, (status) => {
  setDeliveryStatuses(prev => ({
    ...prev,
    [notificationId]: updateStatus(prev[notificationId], status)
  }));
});
```

#### Mobile App Real-time Flow
```typescript
// Direct Supabase channel subscription
const channel = supabase
  .channel(`user_notifications_${user.id}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `recipient_id=eq.${user.id}`
  }, (payload) => {
    // Update local state in real-time
    setNotifications(prev => [payload.new, ...prev]);
  })
  .subscribe();
```

### Database Schema Enhancements
#### Notification Tables
```sql
-- Enhanced notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  category TEXT NOT NULL DEFAULT 'announcement',
  priority TEXT NOT NULL DEFAULT 'normal',
  scheduled_for TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification recipients with many-to-many relationship
CREATE TABLE notification_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id),
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery logs per channel
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications(id),
  recipient_id UUID REFERENCES profiles(id),
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  external_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Delivery System Architecture
#### Multi-channel Delivery
```typescript
interface DeliveryStrategy {
  channel: 'websocket' | 'email' | 'in_app' | 'push';
  priority: 'immediate' | 'scheduled' | 'batch';
  retryPolicy: {
    maxRetries: number;
    delayMs: number;
    exponential: boolean;
  };
}

// Priority-based routing
function getDeliveryChannels(priority: NotificationPriority): DeliveryStrategy[] {
  const baseChannels = ['in_app'];

  if (priority === 'emergency') {
    return [...baseChannels, 'websocket', 'email'];
  }

  if (priority === 'high') {
    return [...baseChannels, 'email'];
  }

  return baseChannels;
}
```

#### Memory Optimization
```typescript
// Limit concurrent subscriptions to prevent memory leaks
const MAX_CONCURRENT_SUBSCRIPTIONS = 20;

// Cleanup strategy
function cleanupSubscriptions(notifications: Notification[]) {
  const currentSubscriptions = new Set(
    Object.keys(deliveryStatuses)
  );

  // Remove stale subscriptions
  for (const notificationId of currentSubscriptions) {
    if (!notifications.find(n => n.id === notificationId)) {
      unsubscribeChannel(deliveryChannels[notificationId]);
      delete deliveryChannels[notificationId];
      delete deliveryStatuses[notificationId];
    }
  }
}
```

### API Architecture
#### RESTful Endpoints
```typescript
// Admin endpoints
POST   /api/notifications              # Create new notification
GET    /api/notifications              # List notifications (admin)
GET    /api/notifications/:id          # Get notification details
DELETE /api/notifications/:id          # Delete notification
PATCH  /api/notifications/:id/read     # Mark as read

// User endpoints
GET    /api/notifications/my          # User's notification inbox
PATCH  /api/notifications/my          # Mark as read (batch)
```

### Security Architecture
```typescript
// RLS policies on notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (recipient_id = auth.uid());

// Delivery status tracking
CREATE POLICY "Users can view delivery status"
  ON notification_logs FOR SELECT
  USING (recipient_id = auth.uid());
```

#### API Route Architecture
```typescript
// Dynamic API route
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  const users = await getUsers(parseInt(page) || 1);

  return Response.json(users);
}

// API route with middleware
export const POST = withAuth(async (req: Request) => {
  const userData = await req.json();

  // Validate input
  const validated = userSchema.parse(userData);

  // Create user
  const user = await createUser(validated);

  return Response.json(user, { status: 201 });
});
```

## Data Architecture

### Database Schema Overview
```mermaid
erDiagram
    profiles ||--o{ admins : ""
    profiles ||--o{ teachers : ""
    profiles ||--o{ parents : ""
    profiles ||--o{ students : ""
    notifications ||--o{ notification_recipients : ""
    notification_recipients ||--o{ notification_logs : ""
    profiles ||--o{ user_sessions : ""

    profiles {
        uuid id PK
        string email
        string full_name
        string phone
        string avatar_url
        timestamp created_at
        timestamp updated_at
    }

    admins {
        uuid profile_id FK
        string admin_code
    }

    teachers {
        uuid profile_id FK
        string employee_code
        string subject
        string department
    }

    parents {
        uuid profile_id FK
        string relationship
    }

    students {
        uuid profile_id FK
        string student_code
        uuid guardian_id FK
        date date_of_birth
        string gender
    }

    classes {
        uuid id PK
        string name
        string grade_level
        uuid teacher_id FK
    }

    enrollments {
        uuid id PK
        uuid student_id FK
        uuid class_id FK
        date enroll_date
        date withdraw_date
    }

    attendance {
        uuid id PK
        uuid student_id FK
        uuid class_id FK
        date date
        string status
        string notes
    }

    grades {
        uuid id PK
        uuid student_id FK
        uuid class_id FK
        uuid assignment_id FK
        score numeric
        string grade
        date submitted_date
    }

    notifications {
        uuid id PK
        string title
        string message
        string type
        boolean is_read
        uuid recipient_id FK
        timestamp created_at
        timestamp read_at
        priority TEXT
        scheduled_for TIMESTAMPTZ
        expires_at TIMESTAMPTZ
        category TEXT
    }

    notification_recipients {
        uuid id PK
        uuid notification_id FK
        uuid recipient_id FK
        role TEXT
        timestamp created_at
    }

    notification_logs {
        uuid id PK
        uuid notification_id FK
        uuid recipient_id FK
        channel TEXT
        status TEXT
        timestamp sent_at
        timestamp delivered_at
        timestamp failed_at
        text error_message
        int retry_count
        text external_id
        timestamp created_at
    }

    user_sessions {
        uuid id PK
        uuid user_id FK
        text session_token
        boolean is_active
        timestamp last_active
        text device_type
        text device_id
        text user_agent
        inet ip_address
        text city
        text country
        timestamp created_at
        timestamp terminated_at
        text termination_reason
    }
```

### Data Flow
1. **Authentication Flow**:
   ```
   User Login → Supabase Auth → JWT Token → Protected Routes
   ```

2. **Data Synchronization**:
   ```
   Client Request → API Gateway → Edge Functions → PostgreSQL
   ↑                            ↓
   Supabase Realtime ← Realtime Subscriptions
   ```

3. **File Storage**:
   ```
   File Upload → Supabase Storage → CDN Distribution
   ```

## Security Architecture

### Authentication & Authorization
```mermaid
graph TD
    A[User Login] --> B{Validate Credentials}
    B -->|Valid| C[Generate JWT]
    B -->|Invalid| D[Deny Access]
    C --> E[Store in Session]
    E --> F[Attach to Requests]
    F --> G{Check Permissions}
    G -->|Authorized| H[Access Resource]
    G -->|Unauthorized| I[Return 401]
```

### Security Measures
1. **Authentication**:
   - JWT-based authentication with refresh tokens
   - Role-based access control (RBAC)
   - Session management with expiration

   **Cookie Management** (Next.js App Router):
   - No cookie mutations allowed during GET requests (page rendering)
   - Cookie deletion only permitted in Server Actions (POST) or Route Handlers
   - Invalid sessions return null, redirect via `requireAuth()` helper
   - Recent fix: Removed `cookieStore.delete()` from `getUser()` to prevent App Router errors

2. **Notification Security**:
   - Multi-channel delivery tracking (WebSocket, email, in-app, push)
   - Priority-based routing and scheduling
   - Rate limiting to prevent notification spam
   - Per-user access control on notification logs

3. **Session Management**:
   - Single session per user enforcement
   - Device tracking with location information
   - Automatic termination on new login
   - Session timeout with configurable duration
   - `terminate_user_sessions()` function for secure session invalidation

4. **Data Protection**:
   - HTTPS encryption for all communications
   - Password hashing with bcrypt
   - Input validation and sanitization
   - SQL injection prevention

5. **API Security**:
   - Rate limiting (100 requests/minute)
   - CORS configuration
   - Request size limits
   - API key management for external services

## Performance Architecture

### Caching Strategy
```mermaid
graph LR
    A[Client] --> B{First Request}
    B --> C[Check Cache]
    C -->|Hit| D[Return Cached Data]
    C -->|Miss| E[Fetch from Database]
    E --> F[Update Cache]
    F --> D
    D --> G[Display to User]
```

### Optimization Techniques
1. **Web App**:
   - Next.js automatic code splitting
   - Static generation for static pages
   - ISR (Incremental Static Regeneration)
   - Image optimization with Next.js Image

2. **Mobile App**:
   - React Native FlatList for large data
   - Image caching and optimization
   - Lazy loading of components
   - Background data fetching

3. **API**:
   - Response caching with Redis (future)
   - Database query optimization
   - CDN for static assets
   - Compression (gzip/brotli)

## Monitoring & Observability

### Error Tracking
- **Sentry**: JavaScript error monitoring
- **Supabase Logs**: Database operation tracking
- **Custom Logging**: Application-specific events

### Performance Monitoring
- **Web Vitals**: Lighthouse CI integration
- **Bundle Analyzer**: Webpack size monitoring
- **React DevTools**: Component performance metrics

### Analytics
- **User Behavior**: Feature usage tracking
- **Performance**: API response time monitoring
- **Error Rates**: System health metrics

## Deployment Architecture

### CI/CD Pipeline
```mermaid
graph TD
    A[Git Push] --> B{GitHub Actions}
    B --> C[Lint & Type Check]
    C --> D[Run Tests]
    D --> E[Build Mobile App]
    D --> F[Build Web App]
    E --> G[EAS Deploy]
    F --> H[Vercel Deploy]
    G --> I[Mobile Store]
    H --> J[Production]
```

### Environment Strategy
1. **Development**: Local development with mock data
2. **Staging**: Replica of production for testing
3. **Production**: Live deployment with production database

## Future Architecture Considerations

### Scalability Plans
1. **Database**: Read replicas for scaling reads
2. **API**: Microservices architecture for scaling
3. **CDN**: Global distribution for faster access
4. **Caching**: Redis for session and data caching

### Technology Evolution
1. **Mobile**: New Architecture migration for better performance
2. **Web**: Server components for enhanced performance
3. **Code Quality**: Enhanced ESLint rules and automated compliance checking
4. **Backend**: GraphQL for more efficient data fetching
5. **Infrastructure**: Kubernetes for container orchestration

---

**Document Version**: 1.0.0
**Last Updated**: January 23, 2026
**Architecture Review Date**: Quarterly