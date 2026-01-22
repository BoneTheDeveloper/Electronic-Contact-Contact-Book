# Supabase Database Schema & RLS Policies

> Generated: 2026-01-22
> Schema: public
> RLS Status: **Enabled on all tables**

---

## Overview

This document provides a comprehensive overview of all tables in the Supabase database, their structure, and Row Level Security (RLS) policies.

### Tables Summary (26 tables)

| Table | RLS Enabled | Rows | Description |
|-------|-------------|------|-------------|
| `announcements` | Yes | 0 | School announcements and notifications |
| `assessments` | Yes | 0 | Student assessments and exams |
| `attendance` | Yes | 0 | Student attendance records |
| `class_teachers` | Yes | 0 | Teacher-class assignments |
| `classes` | Yes | 0 | School classes |
| `enrollments` | Yes | 0 | Student enrollments |
| `fee_assignments` | Yes | 0 | Fee assignment configurations |
| `fee_items` | Yes | 0 | Fee catalog items |
| `grade_entries` | Yes | 0 | Individual student grades |
| `grades` | Yes | 4 | Grade levels (6, 7, 8, 9) |
| `invoice_items` | Yes | 0 | Line items for invoices |
| `invoices` | Yes | 0 | Student fee invoices |
| `leave_requests` | Yes | 0 | Student leave applications |
| `message_participants` | Yes | 0 | Message thread participants |
| `messages` | Yes | 0 | User messages |
| `notifications` | Yes | 0 | System notifications |
| `parents` | Yes | 0 | Parent profiles |
| `payment_transactions` | Yes | 0 | Payment transaction records |
| `periods` | Yes | 10 | School periods/time slots |
| `profiles` | Yes | 0 | User profiles (auth.users extension) |
| `schedules` | Yes | 0 | Class schedules |
| `student_comments` | Yes | 0 | Teacher comments on students |
| `student_guardians` | Yes | 0 | Student-guardian relationships |
| `students` | Yes | 0 | Student profiles |
| `subjects` | Yes | 13 | School subjects |
| `teachers` | Yes | 0 | Teacher profiles |

---

## RLS Helper Functions

The following security functions are used in RLS policies:

- `is_admin()` - Checks if user has admin role
- `is_teacher()` - Checks if user has teacher role
- `is_parent()` - Checks if user has parent role
- `is_student()` - Checks if user has student role
- `get_parent_children()` - Returns array of student IDs for parent users

---

## Table Details

### 1. announcements

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| title | text | NO | - |
| content | text | NO | - |
| type | text | YES | - |
| target_role | text | YES | - |
| attachment_url | text | YES | - |
| published_at | timestamptz | YES | now() |
| expires_at | timestamptz | YES | - |
| is_pinned | boolean | YES | false |
| pin_until | timestamptz | YES | - |
| created_by | uuid | YES | - |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| All authenticated can view announcements | SELECT | true |
| Teachers and admins can manage announcements | ALL | is_teacher() OR is_admin() |

---

### 2. assessments

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| class_id | text | NO | - |
| subject_id | text | NO | - |
| teacher_id | uuid | NO | - |
| name | text | NO | - |
| assessment_type | text | YES | - |
| date | date | NO | - |
| max_score | numeric | NO | 10 |
| weight | numeric | YES | 1.0 |
| semester | text | YES | '1' |
| school_year | text | YES | '2024-2025' |
| notes | text | YES | - |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Admins can view all assessments | SELECT | is_admin() |
| Parents can view children assessments | SELECT | is_parent() AND class_id IN (SELECT class_id FROM enrollments WHERE student_id = ANY(get_parent_children()) AND status = 'active') |
| Students can view class assessments | SELECT | is_student() AND class_id IN (SELECT class_id FROM enrollments WHERE student_id = auth.uid() AND status = 'active') |
| Teachers can manage own assessments | ALL | is_teacher() AND teacher_id = auth.uid() |

---

### 3. attendance

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| student_id | uuid | NO | - |
| class_id | text | NO | - |
| date | date | NO | - |
| period_id | integer | YES | - |
| status | text | NO | - |
| notes | text | YES | - |
| recorded_by | uuid | YES | - |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Parents can view children attendance | SELECT | student_id = ANY(get_parent_children()) |
| Students can view own attendance | SELECT | student_id = auth.uid() |
| Teachers can manage class attendance | ALL | is_teacher() OR is_admin() |

---

### 4. classes

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | text | NO | - |
| name | text | NO | - |
| grade_id | text | NO | - |
| academic_year | text | YES | '2024-2025' |
| room | text | YES | - |
| capacity | integer | YES | 40 |
| current_students | integer | YES | 0 |
| status | text | YES | 'active' |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| All authenticated can view classes | SELECT | true |
| Teachers can manage classes | ALL | is_teacher() OR is_admin() |

---

### 5. enrollments

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| student_id | uuid | NO | - |
| class_id | text | NO | - |
| academic_year | text | YES | '2024-2025' |
| status | text | YES | 'active' |
| enrollment_date | date | YES | CURRENT_DATE |
| exit_date | date | YES | - |
| notes | text | YES | - |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Admins can manage enrollments | ALL | is_admin() |
| Parents can view children enrollment | SELECT | student_id = ANY(get_parent_children()) |
| Students can view own enrollment | SELECT | student_id = auth.uid() |
| Teachers can view class enrollment | SELECT | is_teacher() AND class_id IN (SELECT id FROM classes WHERE id IN (SELECT class_id FROM schedules WHERE teacher_id = auth.uid())) |

---

### 6. fee_items

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| name | text | NO | - |
| code | text | NO | - |
| description | text | YES | - |
| fee_type | text | NO | - |
| amount | numeric | NO | - |
| semester | text | YES | 'all' |
| academic_year | text | YES | '2024-2025' |
| status | text | YES | 'active' |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Parents can view fee items | SELECT | is_parent() OR is_student() |
| Teachers and admins can manage fee items | ALL | is_teacher() OR is_admin() |

---

### 7. grades

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | text | NO | - |
| name | text | NO | - |
| display_order | integer | NO | - |
| created_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| All authenticated can view grades | SELECT | true |

---

### 8. grade_entries

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| assessment_id | uuid | NO | - |
| student_id | uuid | NO | - |
| score | numeric | YES | - |
| status | text | YES | 'graded' |
| notes | text | YES | - |
| graded_by | uuid | YES | - |
| graded_at | timestamptz | YES | - |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Parents can view children grades | SELECT | student_id = ANY(get_parent_children()) |
| Students can view own grades | SELECT | student_id = auth.uid() |
| Teachers can manage class grades | ALL | is_teacher() OR is_admin() |

---

### 9. invoices

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | text | NO | - |
| invoice_number | text | YES | - |
| student_id | uuid | NO | - |
| fee_assignment_id | text | YES | - |
| name | text | NO | - |
| description | text | YES | - |
| amount | numeric | NO | - |
| discount_amount | numeric | YES | 0 |
| total_amount | numeric | YES | (amount - discount_amount) |
| issue_date | date | YES | CURRENT_DATE |
| due_date | date | NO | - |
| status | text | YES | 'pending' |
| paid_amount | numeric | YES | 0 |
| paid_date | date | YES | - |
| payment_method | text | YES | - |
| transaction_ref | text | YES | - |
| notes | text | YES | - |
| created_by | uuid | YES | - |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Parents can view children invoices | SELECT | student_id = ANY(get_parent_children()) |
| Students can view own invoices | SELECT | student_id = auth.uid() |
| Teachers and admins can manage invoices | ALL | is_teacher() OR is_admin() |

---

### 10. leave_requests

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| student_id | uuid | NO | - |
| class_id | text | YES | - |
| request_type | text | YES | - |
| start_date | date | NO | - |
| end_date | date | NO | - |
| reason | text | NO | - |
| status | text | YES | 'pending' |
| approved_by | uuid | YES | - |
| approved_at | timestamptz | YES | - |
| rejection_reason | text | YES | - |
| attachment_url | text | YES | - |
| requires_makeup | boolean | YES | false |
| makeup_notes | text | YES | - |
| created_by | uuid | YES | - |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Parents can create leave requests | INSERT | created_by = auth.uid() |
| Parents can view own leave requests | SELECT | created_by = auth.uid() |
| Teachers can manage class leave requests | ALL | is_teacher() OR is_admin() |

---

### 11. messages

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| thread_id | uuid | NO | - |
| sender_id | uuid | NO | - |
| recipient_id | uuid | NO | - |
| subject | text | YES | - |
| content | text | NO | - |
| related_type | text | YES | - |
| related_id | text | YES | - |
| is_read | boolean | YES | false |
| read_at | timestamptz | YES | - |
| reply_to_id | uuid | YES | - |
| is_forwarded | boolean | YES | false |
| created_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Users can send messages | INSERT | sender_id = auth.uid() |
| Users can update own sent messages | UPDATE | sender_id = auth.uid() |
| Users can view own messages | SELECT | sender_id = auth.uid() OR recipient_id = auth.uid() |

---

### 12. notifications

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| recipient_id | uuid | NO | - |
| sender_id | uuid | YES | - |
| title | text | NO | - |
| content | text | NO | - |
| type | text | YES | - |
| related_type | text | YES | - |
| related_id | text | YES | - |
| is_read | boolean | YES | false |
| read_at | timestamptz | YES | - |
| created_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Teachers and admins can create notifications | INSERT | is_teacher() OR is_admin() |
| Users can update own notifications | UPDATE | recipient_id = auth.uid() |
| Users can view own notifications | SELECT | recipient_id = auth.uid() |

---

### 13. parents

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | - |
| relationship | text | YES | 'parent' |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Parents can view all parents | SELECT | is_parent() OR is_teacher() OR is_admin() |
| Parents can view own profile | SELECT | id = auth.uid() |

---

### 14. payment_transactions

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| invoice_id | text | NO | - |
| amount | numeric | NO | - |
| payment_method | text | NO | - |
| transaction_ref | text | YES | - |
| receipt_number | text | YES | - |
| proof_url | text | YES | - |
| processed_by | uuid | YES | - |
| processed_at | timestamptz | YES | now() |
| notes | text | YES | - |
| created_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Parents can view children payments | SELECT | is_parent() AND invoice_id IN (SELECT id FROM invoices WHERE student_id = ANY(get_parent_children())) |
| Students can view own payments | SELECT | is_student() AND invoice_id IN (SELECT id FROM invoices WHERE student_id = auth.uid()) |
| Teachers and admins can manage payments | ALL | is_teacher() OR is_admin() |

---

### 15. periods

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | integer | NO | - |
| name | text | NO | - |
| start_time | time | NO | - |
| end_time | time | NO | - |
| is_break | boolean | YES | false |
| display_order | integer | NO | - |
| created_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| All authenticated can view periods | SELECT | true |

---

### 16. profiles

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | - |
| email | text | NO | - |
| role | text | NO | - |
| full_name | text | YES | - |
| phone | text | YES | - |
| avatar_url | text | YES | - |
| status | text | YES | 'active' |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Users can update own profile | UPDATE | auth.uid() = id |
| Users can view all profiles | SELECT | true |

---

### 17. schedules

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| class_id | text | NO | - |
| subject_id | text | NO | - |
| teacher_id | uuid | NO | - |
| period_id | integer | NO | - |
| day_of_week | integer | NO | - |
| room | text | YES | - |
| semester | text | YES | '1' |
| school_year | text | YES | '2024-2025' |
| notes | text | YES | - |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Admins can view all schedules | SELECT | is_admin() |
| Parents can view children schedule | SELECT | is_parent() AND class_id IN (SELECT class_id FROM enrollments WHERE student_id = ANY(get_parent_children()) AND status = 'active') |
| Students can view own schedule | SELECT | is_student() AND class_id IN (SELECT class_id FROM enrollments WHERE student_id = auth.uid() AND status = 'active') |
| Teachers can view their schedule | SELECT | is_teacher() AND teacher_id = auth.uid() |

---

### 18. students

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | - |
| student_code | text | NO | - |
| date_of_birth | date | YES | - |
| gender | text | YES | - |
| address | text | YES | - |
| enrollment_date | date | YES | CURRENT_DATE |
| guardian_id | uuid | YES | - |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Admins can manage all students | ALL | is_admin() |
| Parents can view children | SELECT | id = ANY(get_parent_children()) OR id IN (SELECT student_id FROM student_guardians WHERE guardian_id = auth.uid()) |
| Students can view own profile | SELECT | id = auth.uid() |
| Teachers can view all students | SELECT | is_teacher() OR is_admin() |

---

### 19. subjects

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | text | NO | - |
| name | text | NO | - |
| name_en | text | YES | - |
| code | text | NO | - |
| is_core | boolean | YES | false |
| display_order | integer | NO | - |
| description | text | YES | - |
| created_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| All authenticated can view subjects | SELECT | true |

---

### 20. teachers

**Columns:**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | - |
| employee_code | text | NO | - |
| subject | text | YES | - |
| join_date | date | YES | CURRENT_DATE |
| created_at | timestamptz | YES | now() |
| updated_at | timestamptz | YES | now() |

**RLS Policies:**
| Policy | Command | Expression |
|--------|---------|------------|
| Admins can manage teachers | ALL | is_admin() |
| Teachers can view all teachers | SELECT | is_teacher() OR is_admin() |
| Teachers can view own profile | SELECT | id = auth.uid() |

---

## Views Summary

The database includes several views for reporting:

| View | Purpose |
|------|---------|
| `active_announcements` | Filtered announcements (active only) |
| `invoice_summary` | Invoice details with student/class info |
| `message_thread_summary` | Message thread aggregation |
| `pending_leave_requests` | Leave requests pending approval |
| `recent_notifications` | Recent notifications with sender info |
| `student_attendance_summary` | Attendance stats per student |
| `student_fee_status` | Fee payment status per student |
| `student_grade_summary` | Grade summary per student |
| `unread_message_counts` | Unread message count per user |

---

## Security Notes

1. **All tables have RLS enabled** - No table is publicly accessible without authentication
2. **Role-based access** - Policies use `is_admin()`, `is_teacher()`, `is_parent()`, `is_student()` helper functions
3. **Parent-child relationships** - Parents use `get_parent_children()` to access their children's data
4. **Cross-role isolation** - Students can only see their own data, parents their children, teachers their assigned classes

---

## Foreign Key Relationships

### Core Tables
- `profiles.id` → `auth.users.id`
- `students.id` → `profiles.id`
- `teachers.id` → `profiles.id`
- `parents.id` → `profiles.id`

### Academic Tables
- `classes.grade_id` → `grades.id`
- `schedules.class_id` → `classes.id`
- `schedules.subject_id` → `subjects.id`
- `schedules.teacher_id` → `teachers.id`
- `schedules.period_id` → `periods.id`

### Student Tables
- `enrollments.student_id` → `students.id`
- `enrollments.class_id` → `classes.id`
- `attendance.student_id` → `students.id`
- `assessments.class_id` → `classes.id`
- `assessments.subject_id` → `subjects.id`
- `grade_entries.assessment_id` → `assessments.id`
- `grade_entries.student_id` → `students.id`

### Fee Tables
- `invoices.student_id` → `students.id`
- `invoices.fee_assignment_id` → `fee_assignments.id`
- `invoice_items.invoice_id` → `invoices.id`
- `invoice_items.fee_item_id` → `fee_items.id`
- `payment_transactions.invoice_id` → `invoices.id`

---

*This document is auto-generated from the current Supabase database schema.*
