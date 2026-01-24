/**
 * Shared Types Tests - Verify type consistency across apps
 */

import { describe, it, expect } from 'vitest'
import type { Student, Parent, Teacher, Invoice } from '@school-management/shared-types'

describe('Shared Types - Shape Validation', () => {
  it('should have correct Student type shape', () => {
    const student: Student = {
      id: '1',
      name: 'Test Student',
      email: 'test@example.com',
      role: 'student',
      avatar: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      rollNumber: 'ST001',
      classId: 'class-1',
      section: 'A',
      dateOfBirth: new Date(),
      parentIds: ['parent-1']
    }
    expect(student.id).toBeDefined()
    expect(student.name).toBeDefined()
  })

  it('should have correct Invoice type with optional dueDate', () => {
    const invoice: Invoice = {
      id: 'inv-1',
      studentId: 'student-1',
      studentName: 'Test Student',
      amount: 1000,
      status: 'pending'
      // dueDate is optional - test undefined handling
    }
    expect(invoice.dueDate).toBeUndefined()
  })
})
