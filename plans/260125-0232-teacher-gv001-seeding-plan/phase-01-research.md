# Phase 1: Database Schema Research

**Status:** Pending
**Priority:** High
**Date:** 2025-01-25

## Overview

Research existing database schema to understand relationships and create accurate seeding data.

## Context

- [Plan Overview](../plan.md)
- Teacher: GV001 (gv001@econtact.vn)
- Test Student: ST2024001 (to be enrolled in GV001's homeroom class)

## Key Tables to Research

1. **profiles** - User accounts
2. **teachers** - Teacher-specific data (employee_code)
3. **classes** - Class information
4. **class_teachers** - Homeroom teacher assignments
5. **schedules** - Subject teacher assignments (class, subject, teacher, period)
6. **subjects** - Subject information (Toán, Lý)
7. **students** - Student data
8. **enrollments** - Student-class enrollment
9. **periods** - Class periods for scheduling

## Requirements

- Map exact relationships between tables
- Identify required vs optional fields
- Understand foreign key constraints
- Document existing data (grades, subjects, periods)

## Implementation Steps

1. [ ] Query existing grades (10, 11, 12)
2. [ ] Query existing subjects (Toán, Lý)
3. [ ] Query existing periods
4. [ ] Document class_teachers structure
5. [ ] Document schedules structure
6. [ ] Document enrollments structure

## Success Criteria

- Complete understanding of table relationships
- Document of all foreign keys and constraints
- List of existing reference data (grades, subjects, periods)
