/**
 * Student Store
 * Manages student-specific data and operations
 */

import { create } from 'zustand';

interface StudentData {
  id: string;
  name: string;
  rollNumber: string;
  classId: string;
  section: string;
  grade: number;
}

interface Grade {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  examType: 'midterm' | 'final' | 'quiz' | 'assignment';
  date: string;
  remarks?: string;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

interface StudentState {
  // State
  studentData: StudentData | null;
  grades: Grade[];
  attendance: AttendanceRecord[];
  attendancePercentage: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadStudentData: (studentId: string) => Promise<void>;
  loadGrades: (studentId: string) => Promise<void>;
  loadAttendance: (studentId: string) => Promise<void>;
  clearError: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  // Initial state
  studentData: null,
  grades: [],
  attendance: [],
  attendancePercentage: 0,
  isLoading: false,
  error: null,

  // Load student data
  loadStudentData: async (studentId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API delay
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      // Mock data
      const mockStudent: StudentData = {
        id: studentId,
        name: 'Nguyen Van B',
        rollNumber: 'STU001',
        classId: 'CLASS10A',
        section: 'A',
        grade: 10,
      };

      set({ studentData: mockStudent, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load student data',
      });
    }
  },

  // Load grades
  loadGrades: async (studentId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API delay
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      // Mock grades data
      const mockGrades: Grade[] = [
        {
          id: '1',
          subject: 'Mathematics',
          score: 85,
          maxScore: 100,
          examType: 'midterm',
          date: '2026-01-10',
          remarks: 'Good performance',
        },
        {
          id: '2',
          subject: 'Physics',
          score: 78,
          maxScore: 100,
          examType: 'midterm',
          date: '2026-01-10',
        },
        {
          id: '3',
          subject: 'Chemistry',
          score: 92,
          maxScore: 100,
          examType: 'midterm',
          date: '2026-01-10',
          remarks: 'Excellent',
        },
        {
          id: '4',
          subject: 'English',
          score: 88,
          maxScore: 100,
          examType: 'midterm',
          date: '2026-01-10',
        },
      ];

      set({ grades: mockGrades, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load grades',
      });
    }
  },

  // Load attendance
  loadAttendance: async (studentId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API delay
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      // Mock attendance data
      const mockAttendance: AttendanceRecord[] = [
        { date: '2026-01-12', status: 'present' },
        { date: '2026-01-11', status: 'present' },
        { date: '2026-01-10', status: 'present' },
        { date: '2026-01-09', status: 'late', remarks: 'Traffic' },
        { date: '2026-01-08', status: 'present' },
        { date: '2026-01-07', status: 'present' },
        { date: '2026-01-06', status: 'absent', remarks: 'Sick leave' },
        { date: '2026-01-05', status: 'present' },
        { date: '2026-01-04', status: 'present' },
        { date: '2026-01-03', status: 'present' },
      ];

      // Calculate attendance percentage
      const presentDays = mockAttendance.filter(
        (record) => record.status === 'present' || record.status === 'late' || record.status === 'excused'
      ).length;
      const percentage = (presentDays / mockAttendance.length) * 100;

      set({ attendance: mockAttendance, attendancePercentage: percentage, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load attendance',
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
