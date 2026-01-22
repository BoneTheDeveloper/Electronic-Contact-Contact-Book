export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'teacher' | 'parent' | 'student'
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'admin' | 'teacher' | 'parent' | 'student'
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'teacher' | 'parent' | 'student'
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          student_code: string
          date_of_birth: string | null
          gender: 'male' | 'female' | null
          address: string | null
          enrollment_date: string | null
          guardian_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          student_code: string
          date_of_birth?: string | null
          gender?: 'male' | 'female' | null
          address?: string | null
          enrollment_date?: string | null
          guardian_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_code?: string
          date_of_birth?: string | null
          gender?: 'male' | 'female' | null
          address?: string | null
          enrollment_date?: string | null
          guardian_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          employee_code: string
          subject: string | null
          join_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          employee_code: string
          subject?: string | null
          join_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_code?: string
          subject?: string | null
          join_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      parents: {
        Row: {
          id: string
          relationship: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          relationship?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          relationship?: string
          created_at?: string
          updated_at?: string
        }
      }
      grades: {
        Row: {
          id: string
          name: string
          display_order: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_order?: number
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          name_en: string | null
          code: string
          is_core: boolean
          display_order: number
          description: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          name_en?: string | null
          code: string
          is_core?: boolean
          display_order: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_en?: string | null
          code?: string
          is_core?: boolean
          display_order?: number
          description?: string | null
          created_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          grade_id: string
          academic_year: string
          room: string | null
          capacity: number
          current_students: number
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          grade_id: string
          academic_year?: string
          room?: string | null
          capacity?: number
          current_students?: number
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          grade_id?: string
          academic_year?: string
          room?: string | null
          capacity?: number
          current_students?: number
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      periods: {
        Row: {
          id: number
          name: string
          start_time: string
          end_time: string
          is_break: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id: number
          name: string
          start_time: string
          end_time: string
          is_break?: boolean
          display_order: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          start_time?: string
          end_time?: string
          is_break?: boolean
          display_order?: number
          created_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          class_id: string
          subject_id: string
          teacher_id: string
          period_id: number
          day_of_week: number
          room: string | null
          semester: '1' | '2' | 'all'
          school_year: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          subject_id: string
          teacher_id: string
          period_id: number
          day_of_week: number
          room?: string | null
          semester?: '1' | '2' | 'all'
          school_year?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          subject_id?: string
          teacher_id?: string
          period_id?: number
          day_of_week?: number
          room?: string | null
          semester?: '1' | '2' | 'all'
          school_year?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          class_id: string
          academic_year: string
          status: 'active' | 'transferred' | 'graduated' | 'withdrawn'
          enrollment_date: string
          exit_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          class_id: string
          academic_year?: string
          status?: 'active' | 'transferred' | 'graduated' | 'withdrawn'
          enrollment_date?: string
          exit_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          class_id?: string
          academic_year?: string
          status?: 'active' | 'transferred' | 'graduated' | 'withdrawn'
          enrollment_date?: string
          exit_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          class_id: string
          date: string
          period_id: number | null
          status: 'present' | 'absent' | 'late' | 'excused'
          notes: string | null
          recorded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          class_id: string
          date: string
          period_id?: number | null
          status: 'present' | 'absent' | 'late' | 'excused'
          notes?: string | null
          recorded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          class_id?: string
          date?: string
          period_id?: number | null
          status?: 'present' | 'absent' | 'late' | 'excused'
          notes?: string | null
          recorded_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          class_id: string
          subject_id: string
          teacher_id: string
          name: string
          assessment_type: 'quiz' | 'midterm' | 'final' | 'assignment' | 'project'
          date: string
          max_score: number
          weight: number
          semester: '1' | '2' | 'all'
          school_year: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          subject_id: string
          teacher_id: string
          name: string
          assessment_type: 'quiz' | 'midterm' | 'final' | 'assignment' | 'project'
          date: string
          max_score?: number
          weight?: number
          semester?: '1' | '2' | 'all'
          school_year?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          subject_id?: string
          teacher_id?: string
          name?: string
          assessment_type?: 'quiz' | 'midterm' | 'final' | 'assignment' | 'project'
          date?: string
          max_score?: number
          weight?: number
          semester?: '1' | '2' | 'all'
          school_year?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      grade_entries: {
        Row: {
          id: string
          assessment_id: string
          student_id: string
          score: number | null
          status: 'pending' | 'graded' | 'excused' | 'absent'
          notes: string | null
          graded_by: string | null
          graded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          student_id: string
          score?: number | null
          status?: 'pending' | 'graded' | 'excused' | 'absent'
          notes?: string | null
          graded_by?: string | null
          graded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          student_id?: string
          score?: number | null
          status?: 'pending' | 'graded' | 'excused' | 'absent'
          notes?: string | null
          graded_by?: string | null
          graded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fee_items: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          fee_type: 'mandatory' | 'voluntary'
          amount: number
          semester: '1' | '2' | 'all'
          academic_year: string
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          fee_type: 'mandatory' | 'voluntary'
          amount: number
          semester?: '1' | '2' | 'all'
          academic_year?: string
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string | null
          fee_type?: 'mandatory' | 'voluntary'
          amount?: number
          semester?: '1' | '2' | 'all'
          academic_year?: string
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      fee_assignments: {
        Row: {
          id: string
          name: string
          target_grades: string[]
          target_classes: string[]
          fee_items: string[]
          start_date: string
          due_date: string
          semester: '1' | '2' | 'all'
          academic_year: string
          reminder_days: number
          reminder_frequency: 'once' | 'daily' | 'weekly'
          total_students: number
          total_amount: number
          collected_amount: number
          status: 'draft' | 'published' | 'closed'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          target_grades: string[]
          target_classes?: string[]
          fee_items: string[]
          start_date: string
          due_date: string
          semester?: '1' | '2' | 'all'
          academic_year?: string
          reminder_days?: number
          reminder_frequency?: 'once' | 'daily' | 'weekly'
          total_students?: number
          total_amount?: number
          collected_amount?: number
          status?: 'draft' | 'published' | 'closed'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          target_grades?: string[]
          target_classes?: string[]
          fee_items?: string[]
          start_date?: string
          due_date?: string
          semester?: '1' | '2' | 'all'
          academic_year?: string
          reminder_days?: number
          reminder_frequency?: 'once' | 'daily' | 'weekly'
          total_students?: number
          total_amount?: number
          collected_amount?: number
          status?: 'draft' | 'published' | 'closed'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string | null
          student_id: string
          fee_assignment_id: string | null
          name: string
          description: string | null
          amount: number
          discount_amount: number
          total_amount: number
          issue_date: string
          due_date: string
          status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
          paid_amount: number
          paid_date: string | null
          payment_method: string | null
          transaction_ref: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          invoice_number?: string | null
          student_id: string
          fee_assignment_id?: string | null
          name: string
          description?: string | null
          amount: number
          discount_amount?: number
          issue_date?: string
          due_date: string
          status?: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
          paid_amount?: number
          paid_date?: string | null
          payment_method?: string | null
          transaction_ref?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string | null
          student_id?: string
          fee_assignment_id?: string | null
          name?: string
          description?: string | null
          amount?: number
          discount_amount?: number
          issue_date?: string
          due_date?: string
          status?: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
          paid_amount?: number
          paid_date?: string | null
          payment_method?: string | null
          transaction_ref?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          invoice_id: string
          amount: number
          payment_method: 'cash' | 'bank_transfer' | 'qr_code' | 'card' | 'other'
          transaction_ref: string | null
          receipt_number: string | null
          proof_url: string | null
          processed_by: string | null
          processed_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          amount: number
          payment_method: 'cash' | 'bank_transfer' | 'qr_code' | 'card' | 'other'
          transaction_ref?: string | null
          receipt_number?: string | null
          proof_url?: string | null
          processed_by?: string | null
          processed_at?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          amount?: number
          payment_method?: 'cash' | 'bank_transfer' | 'qr_code' | 'card' | 'other'
          transaction_ref?: string | null
          receipt_number?: string | null
          proof_url?: string | null
          processed_by?: string | null
          processed_at?: string
          notes?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          recipient_id: string
          sender_id: string | null
          title: string
          content: string
          type: 'payment' | 'attendance' | 'grade' | 'announcement' | 'reminder' | 'alert'
          related_type: string | null
          related_id: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          sender_id?: string | null
          title: string
          content: string
          type: 'payment' | 'attendance' | 'grade' | 'announcement' | 'reminder' | 'alert'
          related_type?: string | null
          related_id?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          recipient_id?: string
          sender_id?: string | null
          title?: string
          content?: string
          type?: 'payment' | 'attendance' | 'grade' | 'announcement' | 'reminder' | 'alert'
          related_type?: string | null
          related_id?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          thread_id: string
          sender_id: string
          recipient_id: string
          subject: string | null
          content: string
          related_type: string | null
          related_id: string | null
          is_read: boolean
          read_at: string | null
          reply_to_id: string | null
          is_forwarded: boolean
          created_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          sender_id: string
          recipient_id: string
          subject?: string | null
          content: string
          related_type?: string | null
          related_id?: string | null
          is_read?: boolean
          read_at?: string | null
          reply_to_id?: string | null
          is_forwarded?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          sender_id?: string
          recipient_id?: string
          subject?: string | null
          content?: string
          related_type?: string | null
          related_id?: string | null
          is_read?: boolean
          read_at?: string | null
          reply_to_id?: string | null
          is_forwarded?: boolean
          created_at?: string
        }
      }
      leave_requests: {
        Row: {
          id: string
          student_id: string
          class_id: string | null
          request_type: 'sick' | 'personal' | 'family' | 'other'
          start_date: string
          end_date: string
          reason: string
          status: 'pending' | 'approved' | 'rejected' | 'cancelled'
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          attachment_url: string | null
          requires_makeup: boolean
          makeup_notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          class_id?: string | null
          request_type: 'sick' | 'personal' | 'family' | 'other'
          start_date: string
          end_date: string
          reason: string
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          attachment_url?: string | null
          requires_makeup?: boolean
          makeup_notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          class_id?: string | null
          request_type?: 'sick' | 'personal' | 'family' | 'other'
          start_date?: string
          end_date?: string
          reason?: string
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          attachment_url?: string | null
          requires_makeup?: boolean
          makeup_notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          type: 'general' | 'urgent' | 'event' | 'holiday' | 'exam'
          target_role: 'all' | 'admin' | 'teacher' | 'parent' | 'student'
          attachment_url: string | null
          published_at: string
          expires_at: string | null
          is_pinned: boolean
          pin_until: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type: 'general' | 'urgent' | 'event' | 'holiday' | 'exam'
          target_role: 'all' | 'admin' | 'teacher' | 'parent' | 'student'
          attachment_url?: string | null
          published_at?: string
          expires_at?: string | null
          is_pinned?: boolean
          pin_until?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: 'general' | 'urgent' | 'event' | 'holiday' | 'exam'
          target_role?: 'all' | 'admin' | 'teacher' | 'parent' | 'student'
          attachment_url?: string | null
          published_at?: string
          expires_at?: string | null
          is_pinned?: boolean
          pin_until?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      invoice_summary: {
        Row: {
          id: string
          invoice_number: string | null
          student_id: string
          student_code: string
          student_name: string
          class_id: string
          class_name: string
          fee_assignment_id: string | null
          assignment_name: string | null
          total_amount: number
          paid_amount: number
          remaining_amount: number
          status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled'
          due_date: string
          paid_date: string | null
          is_overdue: boolean
        }
      }
      student_fee_status: {
        Row: {
          student_id: string
          student_code: string
          student_name: string
          class_id: string
          class_name: string
          pending_fees: number | null
          overdue_fees: number | null
          paid_fees: number | null
          total_fees: number | null
          total_paid: number | null
          total_remaining: number | null
        }
      }
    }
    Functions: {
      generate_invoices_from_assignment: {
        Args: { assignment_id: string }
        Returns: number
      }
      get_payment_stats: {
        Args: {
          academic_year?: string
          semester?: string
        }
        Returns: {
          total_invoices: number
          total_amount: number
          paid_invoices: number
          paid_amount: number
          pending_invoices: number
          overdue_invoices: number
          collection_rate: number
        }
      }
    }
  }
}
