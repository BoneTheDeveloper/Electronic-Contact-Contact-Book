---
title: "Phase 02C: Database Schema & Mock Data Generation"
description: "Prisma schema design and JSON mock data for MVP"
status: completed
priority: P1
effort: 3h
created: 2026-01-12
completed: 2026-01-12
---

# Phase 02C: Database Schema & Mock Data Generation

## Context Links
- Parent: [plan.md](./plan.md)
- Depends: [phase-01](./phase-01-project-setup.md)
- Research: [web-architecture](./research/researcher-web-architecture.md)

## Parallelization Info
- **Can run with**: Phase 02A (Mobile), Phase 02B (Web)
- **Must complete before**: Phase 04B/C/D (Features consume data)
- **Exclusive files**: `packages/database/*`, `apps/*/mock-data/*`

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | Pending |
| Description | Prisma schema with PostgreSQL, JSON mock data files |
| Review Status | Not Started |

## Key Insights
- Role-based User model (ADMIN, TEACHER, STUDENT, PARENT)
- **Prisma seed scripts** for mock data (reusable, type-safe)
- Can run `prisma db seed` to populate local database

## Requirements
- Prisma 5+
- PostgreSQL (schema definition only for MVP)
- 50+ mock records for realistic demo

## Architecture

### Prisma Schema
```
packages/database/
├── prisma/
│   └── schema.prisma
├── src/
│   └── index.ts          # Type exports
└── package.json
```

### Seed Script Structure
```
packages/database/prisma/
├── schema.prisma         # Database schema
├── seed.ts               # Prisma seed script (generates mock data)
└── lib/
    └── seed-data.ts      # Helper functions for realistic data
```

### Schema Relationships
```
User (1) ──< Student ──< Attendance
User (1) ──< Student ──< Grade
User (1) ──< Parent ──< Student (children)
User (1) ──< Teacher ──< Class (homeroom)
Class (1) ──< Student
Subject (1) ──< Grade
```

## File Ownership

### Files to Create (Exclusive to 02C)
| File | Owner |
|------|-------|
| `packages/database/prisma/schema.prisma` | Phase 02C |
| `packages/database/prisma/seed.ts` | Phase 02C |
| `packages/database/prisma/lib/seed-data.ts` | Phase 02C |
| `packages/database/src/index.ts` | Phase 02C |
| `packages/database/package.json` | Phase 02C |

## Implementation Steps

1. **Create Database Package**
   ```bash
   mkdir -p packages/database/prisma
   cd packages/database
   npm init -y
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Define Prisma Schema**
   ```prisma
   // schema.prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   enum UserRole {
     ADMIN
     TEACHER
     STUDENT
     PARENT
   }

   model User {
     id        String   @id @default(cuid())
     email     String   @unique
     name      String
     role      UserRole
     password  String
     student   Student?
     parent    Parent?
     teacher   Teacher?

     createdAt DateTime @default(now())
   }

   model Student {
     id        String   @id @default(cuid())
     userId    String   @unique
     user      User     @relation(fields: [userId], references: [id])
     classId   String
     class     Class    @relation(fields: [classId], references: [id])
     parentId  String?
     parent    Parent?  @relation(fields: [parentId], references: [id])

     grades      Grade[]
     attendance  Attendance[]
     fees        Fee[]

     createdAt DateTime @default(now())
   }

   model Parent {
     id        String    @id @default(cuid())
     userId    String    @unique
     user      User      @relation(fields: [userId], references: [id])
     phone     String
     address   String

     children  Student[]

     createdAt DateTime @default(now())
   }

   model Teacher {
     id        String   @id @default(cuid())
     userId    String   @unique
     user      User     @relation(fields: [userId], references: [id])
     subjectId String?

     homeroomClasses Class[] @relation("HomeroomTeacher")

     createdAt DateTime @default(now())
   }

   model Class {
     id          String   @id @default(cuid())
     name        String   // "9A", "10B"
     gradeLevel  Int      // 9, 10, 11, 12
     academicYear String  // "2025-2026"

     homeroomTeacherId String?
     homeroomTeacher   Teacher? @relation("HomeroomTeacher", fields: [homeroomTeacherId], references: [id])

     students    Student[]

     createdAt DateTime @default(now())
   }

   model Subject {
     id        String   @id @default(cuid())
     name      String   // "Toán", "Văn", "Anh"
     code      String   @unique

     grades    Grade[]

     createdAt DateTime @default(now())
   }

   model Grade {
     id        String   @id @default(cuid())
     studentId String
     student   Student  @relation(fields: [studentId], references: [id])
     subjectId String
     subject   Subject  @relation(fields: [subjectId], references: [id])
     term      String   // "I", "II"
     score     Float
     createdAt DateTime @default(now())
   }

   model Attendance {
     id        String   @id @default(cuid())
     studentId String
     student   Student  @relation(fields: [studentId], references: [id])
     date      DateTime
     status    String   // "present", "absent", "late", "excused"
     createdAt DateTime @default(now())
   }

   model Fee {
     id          String   @id @default(cuid())
     studentId   String
     student     Student  @relation(fields: [studentId], references: [id])
     amount      Float
     dueDate     DateTime
     status      String   // "paid", "pending", "overdue"
     createdAt   DateTime @default(now())
   }

   model Notification {
     id        String   @id @default(cuid())
     title     String
     message   String
     type      String   // "school", "class", "payment"
     createdAt DateTime @default(now())
   }
   ```

3. **Export Types**
   ```typescript
   // packages/database/src/index.ts
   export * from '@prisma/client'
   ```

4. **Create Prisma Seed Script**
   ```typescript
   // packages/database/prisma/seed.ts
   import { PrismaClient, UserRole } from '@prisma/client'
   import { generateVietnameseNames, generateClasses } from './lib/seed-data'

   const prisma = new PrismaClient()

   async function main() {
     // Create Users
     const admin = await prisma.user.create({
       data: {
         email: 'admin@econtact.vn',
         name: 'Admin User',
         role: UserRole.ADMIN,
         password: 'mock123',
       },
     })

     // Create teachers
     const teachers = await Promise.all([
       prisma.user.create({
         data: {
           email: 'teacher.nguyen@econtact.vn',
           name: 'Nguyễn Thị Thanh',
           role: UserRole.TEACHER,
           password: 'mock123',
           teacher: { create: { subjectId: 'math' } },
         },
       }),
       // ... more teachers
     ])

     // Create classes
     const classes = await Promise.all([
       prisma.class.create({
         data: { name: '9A', gradeLevel: 9, academicYear: '2025-2026' },
       }),
       // ... more classes
     ])

     // Create students with parents
     const students = await Promise.all([
       prisma.user.create({
         data: {
           email: 'student.hoang@econtact.vn',
           name: 'Nguyễn Hoàng B',
           role: UserRole.STUDENT,
           password: 'mock123',
           student: {
             create: {
               classId: classes[0].id,
               grades: {
                 create: { subjectId: 'math', term: 'I', score: 8.5 }
               }
             }
           }
         },
       }),
       // ... 20+ students
     ])

     // Create parents linked to students
     await prisma.user.create({
       data: {
         email: 'parent.nguyenvan@econtact.vn',
         name: 'Nguyễn Văn A',
         role: UserRole.PARENT,
         password: 'mock123',
         parent: {
           create: {
             phone: '0901234567',
             address: 'Hà Nội',
             children: { connect: [{ id: students[0].student!.id }] }
           }
         }
       }
     })

     // Generate attendance records (100+)
     const today = new Date()
     for (let i = 0; i < 100; i++) {
       const date = new Date(today)
       date.setDate(date.getDate() - i)

       await prisma.attendance.create({
         data: {
           studentId: students[Math.floor(Math.random() * students.length)].student!.id,
           date,
           status: ['present', 'absent', 'late', 'excused'][Math.floor(Math.random() * 4)],
         },
       })
     }

     // Create fees (20 records)
     // ... fee generation
   }

   main()
     .then(async () => { await prisma.$disconnect() })
     .catch(async (e) => {
       console.error(e)
       await prisma.$disconnect()
       process.exit(1)
     })
   ```

5. **Configure package.json for Seed**
   ```json
   {
     "prisma": {
       "seed": "ts-node prisma/seed.ts"
     }
   }
   ```

6. **Run Seed to Populate Database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

## Todo List
- [x] Create database package
- [x] Write Prisma schema
- [x] Generate Prisma types
- [x] Write Prisma seed script
- [x] Generate 20+ users across all roles
- [x] Generate 4 classes
- [x] Generate 8 subjects
- [x] Generate 100+ attendance records
- [x] Generate 50+ grade records
- [x] Generate 20 fee records
- [x] Generate notifications
- [x] Run `npx prisma db seed` successfully

## Success Criteria
- `npx prisma generate` produces types
- `npx prisma db seed` populates database
- At least 20 users across all roles
- Realistic Vietnamese names and data
- Relationships work (students link to parents, classes)

## Conflict Prevention
- Exclusive ownership of `packages/database/*`
- Seed scripts only touch database
- No overlap with app-specific code

## Risk Assessment
| Risk | Mitigation |
|------|-----------|
| Seed script failures | Use try-catch with rollback |
| Database connection issues | Document DATABASE_URL setup |
| Duplicate data on re-seed | Clean existing data before seeding |

## Security Considerations
- Mock passwords are simple (document this)
- No real sensitive data in seed data
- Use realistic-looking but fake Vietnamese names

## Next Steps
- Phase 04B (Admin Features) - consumes user/class data
- Phase 04C (Teacher Features) - consumes attendance/grade data
- Phase 04D (Auth) - consumes user credentials
