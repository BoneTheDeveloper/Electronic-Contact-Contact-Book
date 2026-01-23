# School Management System - Project Overview & PDR

## Project Overview

The School Management System is a comprehensive educational platform designed to streamline communication and management between administrators, teachers, parents, and students. The system consists of two main applications: a mobile app for parent and student portals, and a web app for administrator and teacher portals.

### Mission
To create an intuitive, efficient, and modern school management system that enhances communication, reduces administrative workload, and provides real-time access to academic information for all stakeholders.

### Vision
To be the leading digital platform for educational institutions, combining cutting-edge technology with user-centered design to create seamless experiences for students, parents, teachers, and administrators.

## Product Development Requirements (PDR)

### Functional Requirements

#### User Management
- **Multi-role Authentication**: Support for 4 distinct user roles (Admin, Teacher, Parent, Student)
- **Role-based Access Control**: Each role has specific permissions and accessible features
- **User Profile Management**: Comprehensive profile system with role-specific attributes
- **Session Management**: Secure authentication with proper token handling

#### Mobile Application (Parent/Student Portal)

**Phase 1 Implementation: Student Screens**
- **Schedule**: Weekly class schedule with time periods, subjects, and room assignments
- **Grades**: Academic performance tracking with assignment scores and GPA calculation
- **Attendance**: Class attendance records with status tracking and statistics
- **Study Materials**: Educational resources library with document categorization
- **Leave Requests**: Absence submission workflow with approval tracking
- **Teacher Feedback**: Communication interface for submitting feedback to teachers
- **News & Announcements**: School news feed with categorized updates
- **Summary**: Consolidated academic overview with key metrics and trends
- **Payment**: Fee payment status, history, and payment method management
- **Dashboard**: Student overview with quick stats and navigation to all features

**Navigation Architecture:**
- **Two-Tab System**: "Trang chủ" (Home) and "Cá nhân" (Profile)
- **Stack Navigation**: Home tab contains headerless stack of all academic screens
- **Profile Management**: Account settings, password change, and support features

#### Web Application - Admin Portal
- **Dashboard**: Comprehensive system statistics and metrics
- **User Management**: CRUD operations for students, parents, teachers
- **Class Management**: Create, update, and manage classes and schedules
- **Payment Tracking**: Monitor all payments and financial transactions
- **Attendance Analytics**: School-wide attendance reporting and analytics
- **Notification Management**: Send notifications to all user groups
- **Grade Distribution**: Visual charts and analytics for academic performance

#### Web Application - Teacher Portal
- **Class Dashboard**: Overview of assigned classes and student lists
- **Attendance Marking**: Daily attendance recording with batch operations
- **Grade Entry**: Input and manage student grades with assignment tracking
- **Parent Communication**: Send messages to parents of specific students
- **Schedule View**: Personal teaching schedule and classroom assignments
- **Student Performance**: Individual and class performance tracking

### Non-Functional Requirements

#### Performance
- **Response Time**: All critical operations must complete within 2 seconds
- **Concurrent Users**: Support 100+ concurrent users with minimal performance degradation
- **Mobile Performance**: App launch time under 5 seconds, smooth 60fps animations
- **Database Optimization**: Sub-100ms query response time for common operations

#### Security
- **Authentication**: JWT-based secure authentication with refresh tokens
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Input Validation**: Comprehensive validation for all user inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **Audit Logging**: Complete audit trail for all administrative actions
- **Password Security**: bcrypt hashing with salt, minimum 12-character requirements

#### Scalability
- **Database**: Support for 10,000+ students and 500+ concurrent users
- **Architecture**: Microservices-ready design for future scaling
- **Storage**: Cloud-based storage with CDN for media files
- **Load Balancing**: Horizontal scaling capability for web servers

#### Usability
- **Mobile First**: Optimized for mobile devices with responsive design
- **Intuitive Navigation**: Consistent and predictable user interface
- **Accessibility**: WCAG 2.1 AA compliant for all user interfaces
- **Offline Support**: Critical features available without internet connection
- **Multi-language**: Support for English and Vietnamese languages

## Development Standards & Practices

### Code Quality Framework
- **TypeScript**: Strict mode enabled across all projects
- **ESLint**: Custom rules for React Native boolean props compliance
- **Testing**: Jest + React Testing Library for unit and component tests
- **Git Conventional Commits**: Semantic versioning with clear scope definitions

### Component Architecture Principles
- **YAGNI**: Implement only currently needed features
- **KISS**: Prefer simple solutions over complex ones
- **DRY**: Extract common functionality into reusable components
- **Single Responsibility**: Each component should do one thing well

### Student Screen Implementation Standards
- **Naming**: `Student{Feature}Screen` internal, `{Feature}Screen` exported
- **Navigation**: Stack-based with header hidden, tab navigation for main access
- **Data Display**: Clean, card-based layouts with clear information hierarchy
- **State Management**: Zustand for global state, React Query for data fetching
- **Mock Data**: Temporary implementation with Supabase integration ready

### Performance Optimization
- **React Native**: FlatList for large datasets, optimized images
- **Next.js**: Automatic code splitting, static generation, ISR
- **Caching**: React Query for efficient data caching and refetching
- **Bundle Analysis**: Regular monitoring to keep bundle sizes optimal

## Technical Architecture

## Implementation Status

### Phase 1: Core Infrastructure ✅
- **Status**: Completed (January 23, 2026)
- **React Native Boolean Type Compliance**: All 32 TSX files audited, 0 violations
- **ESLint Integration**: Custom boolean props rules with automated validation
- **Authentication**: Supabase Auth integration with JWT tokens
- **Navigation**: React Navigation 7.x with type-safe parameters
- **Notification System**: Multi-channel notification delivery tracking with WebSocket, email, in-app, and push support
- **Session Management**: Single session per user with device tracking and automatic termination
- **Database Schema**: Enhanced notifications table with priority, scheduling, and categorization support

### Phase 2: Student Screen Implementation ✅
- **Status**: Completed (January 23, 2026)
- **Screen Decomposition**: Replaced monolithic StudentScreens.tsx with 10 dedicated screens
- **Navigation Structure**: Two-tab system with stack navigation for academic features
- **Component Architecture**: Consistent naming and export patterns
- **Type Safety**: Full TypeScript implementation with proper interfaces

### Phase 3: Notification UI Implementation ✅
- **Status**: Completed (January 23, 2026)
- **Admin Notification Management**: Complete notification creation and management system
  - Multi-channel delivery tracking with WebSocket, email, and in-app support
  - Real-time delivery status with progress indicators
  - Memory optimization with subscription limits (max 20 concurrent)
  - Category and priority filtering system
- **Web Notification Inbox**: Full-featured notification display
  - Real-time updates via Supabase subscriptions
  - Mark as read/unread functionality with batch operations
  - Filter by read/unread status with visual indicators
  - Duplicate prevention mechanism
- **Mobile Notifications**: Complete Vietnamese implementation
  - Real-time sync with Supabase client
  - Vietnamese UI with appropriate icons and colors
  - Pull-to-refresh functionality
  - Mark all as read with floating action button
- **Type Safety**: Enhanced notification definitions
  - RealtimeChannel export for mobile compatibility
  - Delivery status tracking types
  - Comprehensive notification interfaces

### Phase 4: Advanced Features ⏳
- **Status**: Planning
- **Push Notifications**: Implement mobile push notifications
- **Multi-language Support**: English and Vietnamese localization
- **Advanced Analytics**: Grade trends and performance insights
- **Parent Portal**: Complete parent-facing feature implementation

### Phase 5: Production Deployment ⏳
- **Status**: Future
- **CI/CD Pipeline**: GitHub Actions for automated deployment
- **Performance Monitoring**: Error tracking and analytics
- **Security Hardening**: Production security measures
- **Load Testing**: Performance validation with user load

## Technical Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Load Balancer                          │
└───────────────────────┬───────────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────┐
│                   API Gateway                             │
└───────────────────────┬───────────────────────────────────┘
                        │
    ┌─────────────────┬─────────────────┬─────────────────┐
    │                 │                 │                 │
┌───▼───┐         ┌───▼───┐         ┌───▼───┐         ┌───▼───┐
│ Web   │         │ Mobile │         │ Admin │         │ Teacher│
│ App   │         │ App    │         │ Portal│         │ Portal │
│ (Next.js)│       │ (RN)   │         │ (Next.js)│      │ (Next.js)│
└───────┘         └───────┘         └───────┘         └───────┘
    │                 │                 │                 │
    └─────────────────┼─────────────────┼─────────────────┘
                        │
                ┌───────▼───────┐
                │   Database    │
                │ (PostgreSQL)  │
                └───────────────┘
```

### Technology Stack

#### Frontend
- **Mobile**: React Native 0.76.9, Expo SDK 54, React Navigation 7.x, React Native Paper 5.x
- **Web**: Next.js 15 (App Router), React 18, TypeScript 5, Tailwind CSS, shadcn/ui
- **State Management**: Zustand for mobile, React Query for web
- **Authentication**: Supabase Auth

#### Backend
- **API**: Next.js API Routes with Edge Functions
- **Database**: PostgreSQL with Supabase
- **Real-time**: Supabase Realtime for live updates
- **File Storage**: Supabase Storage

#### Shared Infrastructure
- **Monorepo**: Turborepo with pnpm workspaces
- **TypeScript**: Shared types package across all applications
- **Testing**: Jest, React Testing Library
- **Build System**: TSC, webpack, Metro bundler

## Development Standards

### Code Quality
- **TypeScript**: Strict typing enabled across all projects
- **ESLint**: Consistent linting rules for all codebases
- **Prettier**: Automatic code formatting
- **Husky**: Git hooks for pre-commit checks
- **Conventional Commits**: Semantic versioning and changelog generation

### Testing Strategy
- **Unit Tests**: 80% coverage requirement for all business logic
- **Integration Tests**: API endpoint testing with mock databases
- **E2E Tests**: Cypress for critical user flows
- **Mobile Testing**: Detox for automated mobile testing
- **Accessibility**: axe-core for automated accessibility testing

### Performance Monitoring
- **Web Vitals**: Lighthouse integration for web performance
- **Bundle Analysis**: Webpack Bundle Analyzer
- **Mobile Performance**: React Native Performance Monitor
- **APM**: Sentry for error tracking and performance monitoring

## Project Phases

### Phase 01: React Native Boolean Type Compliance ✅
**Status**: Completed
**Date**: January 23, 2026
**Description**: Comprehensive audit of React Native boolean type usage across all mobile components to ensure proper JavaScript expressions instead of string literals.

### Phase 02: ESLint Boolean Props Compliance ✅
**Status**: Completed
**Date**: January 23, 2026
**Description**: Implementation of custom ESLint rule and standalone verification script for React Native boolean props compliance with automated checks.

### Phase 03: Cookie Modification Fix ✅
**Status**: Completed
**Date**: January 23, 2026
**Description**: Fixed Next.js App Router cookie modification error by removing `cookieStore.delete()` from `getUser()` function and implementing proper session management.

### Phase 03: New Architecture Compatibility
**Status**: Pending
**Estimated**: Q1 2026
**Description**: Upgrade React Native to support New Architecture while maintaining Expo Go compatibility.

### Phase 03: Component Library Migration
**Status**: Pending
**Estimated**: Q2 2026
**Description**: Migration from React Native Paper to modern component library with improved performance.

### Phase 04: API Integration
**Status**: Pending
**Estimated**: Q3 2026
**Description**: Replace mock data with real Supabase integration and implement proper data synchronization.

### Phase 05: Real Authentication
**Status**: Pending
**Estimated**: Q4 2026
**Description**: Implement JWT-based authentication with role-based access control.

### Phase 06: Production Deployment
**Status**: Pending
**Estimated**: Q1 2027
**Description**: Deploy to production app stores and web hosting with proper CI/CD pipeline.

## Success Metrics

### User Adoption
- 90% of target schools using the system within first year
- 80% parent/user activation rate
- 95% feature utilization rate

### Performance
- 99.9% uptime guarantee
- <100ms average response time
- 4.8+ star app store rating

### Technical Debt
- <5% technical debt ratio
- Automated testing coverage >80%
- 0 critical security vulnerabilities

## Risk Assessment

### Technical Risks
- **React Native Upgrade**: Potential breaking changes with major version updates
- **Performance**: Database optimization challenges with large datasets
- **Compatibility**: Cross-platform consistency across iOS/Android

### Business Risks
- **User Adoption**: Resistance from traditional school administrations
- **Competition**: Established players in education technology market
- **Regulatory**: Changes in educational data privacy regulations

### Mitigation Strategies
- Incremental feature rollouts with beta testing
- Comprehensive documentation and training materials
- Regular security audits and compliance updates

---

**Document Version**: 1.0.0
**Last Updated**: January 23, 2026
**Project Lead**: Development Team