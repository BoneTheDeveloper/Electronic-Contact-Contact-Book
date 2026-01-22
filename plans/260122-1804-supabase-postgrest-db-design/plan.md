# Supabase PostgREST Database Design

> **Status**: Ready for Review | **Created**: 2026-01-22 | **Priority**: High

## Overview

Design unified PostgreSQL database with Supabase Auth + RLS for School Management System.

## Phases

| Phase | Status | Link |
|-------|--------|------|
| 01 - Core Schema | done | [phase-01-core-schema.md](phase-01-core-schema.md) |
| 02 - Academic Data | done | [phase-02-academic-data.md](phase-02-academic-data.md) |
| 03 - Academics Data | done | [phase-03-academics-data.md](phase-03-academics-data.md) |
| 04 - Finance Data | done | [phase-04-finance-data.md](phase-04-finance-data.md) |
| 05 - Communications | done | [phase-05-communications.md](phase-05-communications.md) |
| 06 - RLS Policies | done | [phase-06-rls-policies.md](phase-06-rls-policies.md) |
| 07 - Migration Scripts | done | [phase-07-migration-scripts.md](phase-07-migration-scripts.md) |

## Architecture

```
auth.users (Supabase managed)
    ↓
profiles (extends auth.users)
    ├── users (all user types)
    ├── students
    ├── parents
    └── teachers
    ↓
academic
    ├── grades (6,7,8,9)
    ├── classes (6A, 6B, etc.)
    ├── subjects
    ├── schedules
    └── enrollments
    ↓
academics
    ├── attendance
    ├── grade_entries (oral, quiz, midterm, final)
    ├── assessments
    └── conduct_ratings
    ↓
finance
    ├── fee_items
    ├── fee_assignments
    ├── invoices
    └── payments
    ↓
communications
    ├── notifications
    ├── conversations
    └── messages
    ↓
requests
    └── leave_requests
```

## Tech Stack

- **Database**: PostgreSQL 15+ (Supabase)
- **Auth**: Supabase Auth (JWT)
- **API**: PostgREST (auto-generated from schema)
- **Security**: Row Level Security (RLS)
- **Client**: @supabase/supabase-js (TS)

## Success Criteria

- [x] All mock data entities mapped to tables
- [x] RLS policies for all 4 roles (admin, teacher, parent, student)
- [x] PostgREST API endpoints match current data access patterns
- [x] Migration scripts runnable via Supabase CLI
- [x] Type definitions exported for TypeScript apps

## Next Steps

1. Review all phase documents
2. Create Supabase project & run migrations
3. Update apps to use Supabase client instead of mock data
4. Test RLS policies with different user roles
