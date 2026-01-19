# ECONTACT - Product Development Requirements (PDR)

**Version**: 1.0
**Last Updated**: 2026-01-19
**Project Status**: Mobile Entry Point Configuration Fixed

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Product Vision](#product-vision)
3. [Target Users](#target-users)
4. [Core Features](#core-features)
5. [Technical Requirements](#technical-requirements)
6. [Design System](#design-system)
7. [Implementation Status](#implementation-status)
8. [Success Metrics](#success-metrics)
9. [Future Roadmap](#future-roadmap)

---

## Project Overview

**ECONTACT** is an electronic contact book management system designed for educational institutions. The system provides a centralized platform for administrators and teachers to manage student information, academic records, and communications.

### Project Details

- **Project Name**: ECONTACT - Electronic Contact Book System
- **Institution**: Bach Khoa University, Hanoi
- **Development Team**: Project 2 - Academic Year 2025-2026
- **Platform**: Web Application (React Native)
- **Language**: Vietnamese UI throughout
- **Launch Date**: Q1 2026

---

## Product Vision

### Mission Statement

To provide an intuitive, efficient, and secure electronic contact book system that enhances administrative workflow and improves teacher-student communication in educational institutions.

### Core Values

- **Accessibility**: WCAG 2.1 AA compliant design
- **Efficiency**: Streamlined data management and retrieval
- **Security**: Protected access with role-based permissions
- **Usability**: Vietnamese-first interface design
- **Reliability**: Robust data handling and backup systems

---

## Target Users

### Primary Users

#### 1. Teachers (Giáo viên)
- **User Goals**:
  - Track student attendance and grades efficiently
  - Communicate with parents and administrators
  - Generate academic reports
- **Technical Proficiency**: Moderate to High
- **Access Pattern**: Daily usage during academic periods

#### 2. Administrators (Quản trị viên)
- **User Goals**:
  - Manage school-wide academic records
  - Oversee teacher activities and assignments
  - Generate institutional reports
- **Technical Proficiency**: High
- **Access Pattern**: Daily administrative tasks, periodic reporting

### Secondary Users

#### 3. School Management
- **User Goals**: Monitor academic performance trends
- **Access Pattern**: Weekly reviews, policy decisions

#### 4. Parents (Future)
- **User Goals**: Track student progress and communicate
- **Access Pattern**: Weekly check-ins, monthly reviews

---

## Core Features

### Current Implementation

#### 1. Authentication System ✅
- **Role-based Login**: Teacher/Admin selection
- **Secure Access**: Password with visibility toggle
- **Forgot Password**: Multi-step verification flow
- **Multi-factor OTP**: Enhanced security
- **Duration**: 2026-01-15

#### 2. User Interface Design ✅
- **Split-Screen Layout**: 50/50 branding and login panels
- **Vietnamese Language**: Full UI localization
- **Glassmorphism Effects**: Modern visual design
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Blue gradient (#0284C7 to #075985)

#### 3. Interactive Components ✅
- **Role Toggle**: Switch between Teacher/Admin views
- **Form Validation**: Input with dynamic feedback
- **Password Visibility**: Toggle between hidden/shown
- **Animation Effects**: Smooth transitions and micro-interactions
- **Duration**: 2026-01-15

### Planned Features

#### 1. Contact Management
- Student directory with search capabilities
- Contact information hierarchy (personal → academic → emergency)
- Bulk import/export functionality
- Advanced filtering and sorting options

#### 2. Academic Records
- Grade tracking and calculation
- Attendance monitoring with visual reports
- Progress analytics and trend analysis
- Report generation and export

#### 3. Communication System
- Built-in messaging (teacher-parent, teacher-admin)
- Notification system for important updates
- Announcement broadcasting
- Meeting scheduling integration

#### 4. Administrative Tools
- User management and permissions
- System configuration and customization
- Data backup and recovery
- Audit logging and compliance reporting

---

## Technical Requirements

### Architecture

#### Frontend Stack
- **Framework**: React Native (Web Target)
- **UI Library**: Custom components with Tailwind CSS
- **State Management**: React Context (future: Redux Toolkit)
- **Routing**: React Router for web navigation
- **Forms**: React Hook Form with validation

#### Backend Requirements (Future)
- **API**: RESTful architecture
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT tokens with refresh mechanism
- **Real-time**: WebSocket for live updates

### Performance Requirements

- **Load Time**: < 2 seconds initial render
- **Response Time**: < 200ms API responses
- **Bundle Size**: < 500KB gzipped
- **Offline Support**: Critical functionality cached

### Security Requirements

- **Data Encryption**: TLS 1.3 for all communications
- **Password Storage**: bcrypt hashing with salt
- **Session Management**: Secure, time-limited tokens
- **Input Sanitization**: XSS and SQL injection prevention
- **Audit Trails**: Complete activity logging

---

## Design System

### Color Palette (Updated)

#### Primary Colors
- **Primary Blue**: #0284C7 (Main brand color)
- **Primary Dark**: #075985 (Gradient end, hover states)
- **Secondary Light**: #E0F2FE (Background highlights)

#### Brand Colors
- **Success Green**: #10B981 (Grades, positive actions)
- **Warning Orange**: #F59E0B (Warnings, pending items)
- **Error Red**: #EF4444 (Errors, critical issues)

#### Neutral Colors
- **Text Primary**: #111827 (Headings, important text)
- **Text Secondary**: #6B7280 (Labels, descriptions)
- **Text Disabled**: #9CA3AF (Placeholders, inactive)
- **Background**: #FFFFFF (Main content areas)
- **Surface**: #F3F4F6 (Cards, panels)

### Typography

#### Font System
- **Primary Font**: Inter (Full Vietnamese character support)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Scale**: Material Design 3 inspired

#### Type Hierarchy
```markdown
- Display (32px/800): Page titles
- Headline (24px/600): Section headers
- Body (16px/400): Main content
- Label (14px/500): Form labels
- Caption (12px/400): Helper text
```

### Component Library

#### New Components (Login Redesign)
1. **AuthBrandingPanel**: Left-side branding display
2. **LoginForm**: Right-side authentication form
3. **RoleToggle**: Teacher/Admin switch buttons
4. **PasswordInput**: Toggleable password field
5. **GlassCard**: Glassmorphism effect container

#### Component Principles
- **Consistent**: Same patterns across all screens
- **Accessible**: ARIA labels, keyboard navigation
- **Responsive**: Adapts to all device sizes
- **Themeable**: Easy to modify global styles

---

## Implementation Status

### Completed ✅

#### Login Page Redesign
- **Status**: 100% Complete
- **Duration**: 2026-01-15
- **Files Modified**:
  - `apps/web/app/(auth)/layout.tsx` - Split-screen layout
  - `apps/web/app/(auth)/login/page.tsx` - Complete redesign
  - `apps/web/components/auth-branding-panel.tsx` - New branding component

#### Key Features Implemented
1. **Split-Screen Layout**
   - Branding panel (left) with animated effects
   - Login form (right) with glassmorphism
   - Responsive collapse on mobile

2. **Vietnamese UI**
   - Full Vietnamese language localization
   - Cultural appropriateness maintained
   - Vietnamese character support in Inter font

3. **Modern Design**
   - Blue gradient background (#0284C7 → #075985)
   - Glassmorphism effects throughout
   - Smooth animations and transitions
   - Floating elements with subtle motion

4. **Interactive Elements**
   - Role toggle buttons (Giáo viên/Quản trị viên)
   - Password visibility toggle
   - Form validation feedback
   - Hover and focus states

5. **Accessibility**
   - WCAG 2.1 AA compliant
   - High contrast ratios maintained
   - Keyboard navigation support
   - Screen reader friendly

#### Mobile App Entry Point Configuration
- **Status**: 100% Complete
- **Duration**: 2026-01-19
- **Files Modified**:
  - `apps/mobile/package.json` - Fixed main entry point
  - `apps/mobile/app.json` - Updated asset configuration
  - `apps/mobile/assets/` - Created minimal placeholder assets

#### Key Issues Fixed
1. **Entry Point Conflict**
   - Changed `"main"` from `"expo-router/entry"` to `"./App.tsx"`
   - Verified custom React Navigation implementation works
   - Eliminated ConfigError on Metro bundler startup

2. **Asset Configuration**
   - Removed non-existent asset references
   - Configured Expo default asset handling
   - Created minimal placeholder images (icon.png, splash.png)
   - Set assetBundlePatterns to `"**/*"` for flexibility

3. **Verification**
   - Metro bundler starts successfully
   - App launches in Expo Go/dev client
   - Navigation works correctly
   - No asset not found errors

### In Progress 🔄

1. Core database structure design
2. API endpoint specifications
3. User flow mapping

### Planned ⏳

1. Student management module
2. Grade tracking system
3. Communication features
4. Admin dashboard

---

## Success Metrics

### User Experience Metrics

#### Login Page
- **Task Success Rate**: > 95% (User can complete login)
- **Time to Login**: < 15 seconds (From page load to dashboard)
- **Error Rate**: < 2% (Failed login attempts)
- **User Satisfaction**: > 4.5/5 (Post-login survey)

#### General Application
- **Daily Active Users**: Target 100% teaching staff
- **Session Duration**: Average 45 minutes
- **Feature Adoption**: > 80% within first month
- **Support Tickets**: < 5% of user base

### Technical Metrics

#### Performance
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 200ms
- **Downtime**: < 0.1% monthly
- **Error Rate**: < 0.1%

#### Security
- **Security Incidents**: 0
- **Compliance**: 100% WCAG 2.1 AA
- **Backup Success Rate**: 100%
- **Uptime**: 99.9%

---

## Future Roadmap

### Phase 1: Core Features (Q1 2026)
- [ ] Student directory management
- [ ] Basic attendance tracking
- [ ] Simple grade entry system
- [ ] User authentication expansion

### Phase 2: Advanced Features (Q2 2026)
- [ ] Advanced analytics and reporting
- [ ] Parent portal access
- [ ] Bulk operations support
- [ ] Integration with external systems

### Phase 3: Enterprise Features (Q3 2026)
- [ ] Multi-school support
- [ ] Advanced permissions system
- [ ] Mobile app development
- [ ] API for third-party integrations

### Phase 4: Innovation (Q4 2026)
- [ ] AI-powered insights
- [ ] Predictive analytics
- [ ] Advanced automation
- [ ] VR/AR visualization features

---

## Unresolved Questions

1. Should parent portal include full student data or limited access?
2. What external systems need integration (LMS, payroll, etc.)?
3. Should offline capabilities be prioritized over cloud features?
4. Mobile app web or native development?

---

## Changelog

**v1.0 (2026-01-19)**
- Initial project overview PDR created
- Login page redesign milestone completed
- Vietnamese UI specifications documented
- WCAG 2.1 AA compliance requirements added
- Glassmorphism design system established
- Split-screen layout pattern defined
- Mobile app entry point configuration fixed (package.json, app.json)
- Custom React Navigation implementation verified working
- Expo asset configuration updated to use default resources
- System architecture documentation created
- Deployment guide updated with mobile build process

---