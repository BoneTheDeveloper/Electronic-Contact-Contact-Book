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
      classId: 'class-1',
      parentId: 'parent-1'
    }
    expect(student.id).toBeDefined()
    expect(student.name).toBeDefined()
  })

  it('should have correct Invoice type with optional dueDate', () => {
    const invoice: Invoice = {
      id: 'inv-1',
      studentId: 'student-1',
      amount: 1000,
      status: 'pending',
      dueDate: null // Test optional/null handling
    }
    expect(invoice.dueDate).toBeNull()
  })
})
