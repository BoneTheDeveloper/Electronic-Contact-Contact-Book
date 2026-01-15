# @school-management/database

Database package with Prisma ORM for School Management System.

## Features

- **Prisma 5.x** with SQLite (default) or PostgreSQL support
- Complete schema for school entities: Users, Students, Teachers, Parents, Classes, Subjects, Grades, Attendance, Fees, Notifications
- Seed script with realistic Vietnamese data
- Type-safe database access

## Setup

### First Time Setup

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Push schema to database (SQLite by default)
npm run db:push

# Seed database with mock data
npm run prisma:seed
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run prisma:generate` | Generate Prisma Client from schema |
| `npm run db:push` | Push schema changes to database (dev) |
| `npm run prisma:migrate` | Create and run migration |
| `npm run prisma:seed` | Populate database with mock data |
| `npm run db:studio` | Open Prisma Studio (database UI) |

## Database Configuration

By default, uses SQLite (`file:./dev.db`). To switch to PostgreSQL:

1. Edit `prisma/.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/school_management"
   ```

2. Update `datasource` provider in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

## Schema Overview

### User Roles
- `ADMIN` - System administrators
- `TEACHER` - Teaching staff
- `STUDENT` - Students
- `PARENT` - Parents/guardians

### Models

| Model | Description |
|-------|-------------|
| `User` | Base user with authentication |
| `Student` | Student profiles linked to classes |
| `Parent` | Parent profiles linked to students |
| `Teacher` | Teacher profiles with subject assignments |
| `Class` | Classes (9A, 9B, 10A, 10B, etc.) |
| `Subject` | School subjects (Math, Literature, etc.) |
| `Grade` | Student grades by subject and term |
| `Attendance` | Daily attendance records |
| `Fee` | Student fee records |
| `Notification` | School announcements |

## Usage

### Import Prisma Client

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Query students
const students = await prisma.student.findMany({
  include: { user: true, class: true }
});

// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'Nguyễn Văn A',
    role: 'STUDENT',
    password: 'hashed_password'
  }
});
```

### Type Exports

All Prisma types are exported from `src/index.ts`:

```typescript
export type { User, Student, Teacher, Parent, Class, Subject } from '@prisma/client';
```

## Seed Data

Running `npm run prisma:seed` creates:
- 1 Admin user
- 8 Teachers
- 12 Parents
- 20 Students (5 per class)
- 4 Classes (9A, 9B, 10A, 10B)
- 8 Subjects
- 60 Grade records
- 120 Attendance records
- 5 Notifications

All data uses realistic Vietnamese names and addresses.

## Development

### Modify Schema

1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` to update database
3. Run `npm run prisma:generate` to update types

### Reset Database

```bash
# Delete all data and re-seed
npm run prisma:seed

# Or manually with Prisma Studio
npm run db:studio
```

## Notes

- SQLite is used for MVP development (no database server required)
- Switch to PostgreSQL for production deployment
- Mock passwords: `mock123` (for seed data only)
- Role field uses String for SQLite compatibility (no native enum support)
