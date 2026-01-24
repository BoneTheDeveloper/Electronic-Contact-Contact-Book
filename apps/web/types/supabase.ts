export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          admin_code: string
          created_at: string | null
          department: string | null
          id: string
          join_date: string | null
          updated_at: string | null
        }
        Insert: {
          admin_code: string
          created_at?: string | null
          department?: string | null
          id: string
          join_date?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_code?: string
          created_at?: string | null
          department?: string | null
          id?: string
          join_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admins_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          attachment_url: string | null
          content: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_pinned: boolean | null
          pin_until: string | null
          published_at: string | null
          target_role: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          attachment_url?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_pinned?: boolean | null
          pin_until?: string | null
          published_at?: string | null
          target_role?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          attachment_url?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_pinned?: boolean | null
          pin_until?: string | null
          published_at?: string | null
          target_role?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          assessment_type: string | null
          class_id: string
          created_at: string | null
          date: string
          id: string
          max_score: number
          name: string
          notes: string | null
          school_year: string | null
          semester: string | null
          subject_id: string
          teacher_id: string
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          assessment_type?: string | null
          class_id: string
          created_at?: string | null
          date: string
          id?: string
          max_score?: number
          name: string
          notes?: string | null
          school_year?: string | null
          semester?: string | null
          subject_id: string
          teacher_id: string
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          assessment_type?: string | null
          class_id?: string
          created_at?: string | null
          date?: string
          id?: string
          max_score?: number
          name?: string
          notes?: string | null
          school_year?: string | null
          semester?: string | null
          subject_id?: string
          teacher_id?: string
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          class_id: string
          created_at: string | null
          date: string
          id: string
          notes: string | null
          period_id: number | null
          recorded_by: string | null
          status: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          period_id?: number | null
          recorded_by?: string | null
          status: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          period_id?: number | null
          recorded_by?: string | null
          status?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_fee_status"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_grade_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      class_teachers: {
        Row: {
          academic_year: string | null
          appointed_date: string | null
          class_id: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          notes: string | null
          semester: string | null
          teacher_id: string
        }
        Insert: {
          academic_year?: string | null
          appointed_date?: string | null
          class_id: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          semester?: string | null
          teacher_id: string
        }
        Update: {
          academic_year?: string | null
          appointed_date?: string | null
          class_id?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          semester?: string | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_teachers_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year: string | null
          capacity: number | null
          created_at: string | null
          current_students: number | null
          grade_id: string
          id: string
          name: string
          room: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          capacity?: number | null
          created_at?: string | null
          current_students?: number | null
          grade_id: string
          id: string
          name: string
          room?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          capacity?: number | null
          created_at?: string | null
          current_students?: number | null
          grade_id?: string
          id?: string
          name?: string
          room?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          academic_year: string | null
          class_id: string
          created_at: string | null
          enrollment_date: string | null
          exit_date: string | null
          id: string
          notes: string | null
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          class_id: string
          created_at?: string | null
          enrollment_date?: string | null
          exit_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          class_id?: string
          created_at?: string | null
          enrollment_date?: string | null
          exit_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_fee_status"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_grade_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_assignments: {
        Row: {
          academic_year: string | null
          collected_amount: number | null
          created_at: string | null
          created_by: string | null
          due_date: string
          fee_items: string[]
          id: string
          name: string
          reminder_days: number | null
          reminder_frequency: string | null
          semester: string | null
          start_date: string
          status: string | null
          target_classes: string[] | null
          target_grades: string[] | null
          total_amount: number | null
          total_students: number | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          collected_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          due_date: string
          fee_items: string[]
          id: string
          name: string
          reminder_days?: number | null
          reminder_frequency?: string | null
          semester?: string | null
          start_date: string
          status?: string | null
          target_classes?: string[] | null
          target_grades?: string[] | null
          total_amount?: number | null
          total_students?: number | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          collected_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          due_date?: string
          fee_items?: string[]
          id?: string
          name?: string
          reminder_days?: number | null
          reminder_frequency?: string | null
          semester?: string | null
          start_date?: string
          status?: string | null
          target_classes?: string[] | null
          target_grades?: string[] | null
          total_amount?: number | null
          total_students?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_assignments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_items: {
        Row: {
          academic_year: string | null
          amount: number
          code: string
          created_at: string | null
          description: string | null
          fee_type: string
          id: string
          name: string
          semester: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          amount: number
          code: string
          created_at?: string | null
          description?: string | null
          fee_type: string
          id?: string
          name: string
          semester?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          amount?: number
          code?: string
          created_at?: string | null
          description?: string | null
          fee_type?: string
          id?: string
          name?: string
          semester?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      grade_entries: {
        Row: {
          assessment_id: string
          created_at: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          notes: string | null
          score: number | null
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          assessment_id: string
          created_at?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          notes?: string | null
          score?: number | null
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          assessment_id?: string
          created_at?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          notes?: string | null
          score?: number | null
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grade_entries_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_entries_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_entries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "grade_entries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_fee_status"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "grade_entries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_grade_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "grade_entries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number | null
          created_at: string | null
          fee_item_id: string | null
          id: string
          invoice_id: string
          item_name: string
          quantity: number | null
          unit_price: number
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          fee_item_id?: string | null
          id?: string
          invoice_id: string
          item_name: string
          quantity?: number | null
          unit_price: number
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          fee_item_id?: string | null
          id?: string
          invoice_id?: string
          item_name?: string
          quantity?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_fee_item_id_fkey"
            columns: ["fee_item_id"]
            isOneToOne: false
            referencedRelation: "fee_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          description: string | null
          discount_amount: number | null
          due_date: string
          fee_assignment_id: string | null
          id: string
          invoice_number: string | null
          issue_date: string | null
          name: string
          notes: string | null
          paid_amount: number | null
          paid_date: string | null
          payment_method: string | null
          status: string | null
          student_id: string
          total_amount: number | null
          transaction_ref: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_amount?: number | null
          due_date: string
          fee_assignment_id?: string | null
          id: string
          invoice_number?: string | null
          issue_date?: string | null
          name: string
          notes?: string | null
          paid_amount?: number | null
          paid_date?: string | null
          payment_method?: string | null
          status?: string | null
          student_id: string
          total_amount?: number | null
          transaction_ref?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_amount?: number | null
          due_date?: string
          fee_assignment_id?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          name?: string
          notes?: string | null
          paid_amount?: number | null
          paid_date?: string | null
          payment_method?: string | null
          status?: string | null
          student_id?: string
          total_amount?: number | null
          transaction_ref?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_fee_assignment_id_fkey"
            columns: ["fee_assignment_id"]
            isOneToOne: false
            referencedRelation: "fee_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_fee_status"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_grade_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attachment_url: string | null
          class_id: string | null
          created_at: string | null
          created_by: string | null
          end_date: string
          id: string
          makeup_notes: string | null
          reason: string
          rejection_reason: string | null
          request_type: string | null
          requires_makeup: boolean | null
          start_date: string
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          class_id?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date: string
          id?: string
          makeup_notes?: string | null
          reason: string
          rejection_reason?: string | null
          request_type?: string | null
          requires_makeup?: boolean | null
          start_date: string
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          class_id?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string
          id?: string
          makeup_notes?: string | null
          reason?: string
          rejection_reason?: string | null
          request_type?: string | null
          requires_makeup?: boolean | null
          start_date?: string
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "leave_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_fee_status"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "leave_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_grade_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "leave_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      message_participants: {
        Row: {
          is_admin: boolean | null
          joined_at: string | null
          last_read_at: string | null
          thread_id: string
          user_id: string
        }
        Insert: {
          is_admin?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          thread_id: string
          user_id: string
        }
        Update: {
          is_admin?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_forwarded: boolean | null
          is_read: boolean | null
          read_at: string | null
          recipient_id: string
          related_id: string | null
          related_type: string | null
          reply_to_id: string | null
          sender_id: string
          subject: string | null
          thread_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_forwarded?: boolean | null
          is_read?: boolean | null
          read_at?: string | null
          recipient_id: string
          related_id?: string | null
          related_type?: string | null
          reply_to_id?: string | null
          sender_id: string
          subject?: string | null
          thread_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_forwarded?: boolean | null
          is_read?: boolean | null
          read_at?: string | null
          recipient_id?: string
          related_id?: string | null
          related_type?: string | null
          reply_to_id?: string | null
          sender_id?: string
          subject?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          channel: string
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          external_id: string | null
          failed_at: string | null
          id: string
          notification_id: string
          recipient_id: string
          retry_count: number | null
          sent_at: string | null
          status: string
        }
        Insert: {
          channel: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          external_id?: string | null
          failed_at?: string | null
          id?: string
          notification_id: string
          recipient_id: string
          retry_count?: number | null
          sent_at?: string | null
          status: string
        }
        Update: {
          channel?: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          external_id?: string | null
          failed_at?: string | null
          id?: string
          notification_id?: string
          recipient_id?: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "recent_notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_recipients: {
        Row: {
          created_at: string | null
          id: string
          notification_id: string
          recipient_id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notification_id: string
          recipient_id: string
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_id?: string
          recipient_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_recipients_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_recipients_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "recent_notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          priority: string | null
          read_at: string | null
          recipient_id: string
          related_id: string | null
          related_type: string | null
          scheduled_for: string | null
          sender_id: string | null
          title: string
          type: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          priority?: string | null
          read_at?: string | null
          recipient_id: string
          related_id?: string | null
          related_type?: string | null
          scheduled_for?: string | null
          sender_id?: string | null
          title: string
          type?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          priority?: string | null
          read_at?: string | null
          recipient_id?: string
          related_id?: string | null
          related_type?: string | null
          scheduled_for?: string | null
          sender_id?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          created_at: string | null
          id: string
          relationship: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          relationship?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          relationship?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parents_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string
          notes: string | null
          payment_method: string
          processed_at: string | null
          processed_by: string | null
          proof_url: string | null
          receipt_number: string | null
          transaction_ref: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id: string
          notes?: string | null
          payment_method: string
          processed_at?: string | null
          processed_by?: string | null
          proof_url?: string | null
          receipt_number?: string | null
          transaction_ref?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_method?: string
          processed_at?: string | null
          processed_by?: string | null
          proof_url?: string | null
          receipt_number?: string | null
          transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      periods: {
        Row: {
          created_at: string | null
          display_order: number
          end_time: string
          id: number
          is_break: boolean | null
          name: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          display_order: number
          end_time: string
          id: number
          is_break?: boolean | null
          name: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          end_time?: string
          id?: number
          is_break?: boolean | null
          name?: string
          start_time?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          class_id: string
          created_at: string | null
          day_of_week: number
          id: string
          notes: string | null
          period_id: number
          room: string | null
          school_year: string | null
          semester: string | null
          subject_id: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          day_of_week: number
          id?: string
          notes?: string | null
          period_id: number
          room?: string | null
          school_year?: string | null
          semester?: string | null
          subject_id: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          day_of_week?: number
          id?: string
          notes?: string | null
          period_id?: number
          room?: string | null
          school_year?: string | null
          semester?: string | null
          subject_id?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      student_comments: {
        Row: {
          comment_type: string | null
          content: string
          created_at: string | null
          id: string
          is_private: boolean | null
          school_year: string | null
          semester: string | null
          student_id: string
          subject_id: string | null
          teacher_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          comment_type?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          school_year?: string | null
          semester?: string | null
          student_id: string
          subject_id?: string | null
          teacher_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          comment_type?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          school_year?: string | null
          semester?: string | null
          student_id?: string
          subject_id?: string | null
          teacher_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_comments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_comments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_fee_status"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_comments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_grade_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_comments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_comments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_comments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      student_guardians: {
        Row: {
          created_at: string | null
          guardian_id: string
          is_primary: boolean | null
          student_id: string
        }
        Insert: {
          created_at?: string | null
          guardian_id: string
          is_primary?: boolean | null
          student_id: string
        }
        Update: {
          created_at?: string | null
          guardian_id?: string
          is_primary?: boolean | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_guardians_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_guardians_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_guardians_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_fee_status"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_guardians_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_grade_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_guardians_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          created_at: string | null
          date_of_birth: string | null
          enrollment_date: string | null
          gender: string | null
          guardian_id: string | null
          id: string
          student_code: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          enrollment_date?: string | null
          gender?: string | null
          guardian_id?: string | null
          id: string
          student_code: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          enrollment_date?: string | null
          gender?: string | null
          guardian_id?: string | null
          id?: string
          student_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          display_order: number
          id: string
          is_core: boolean | null
          name: string
          name_en: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          display_order: number
          id: string
          is_core?: boolean | null
          name: string
          name_en?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_core?: boolean | null
          name?: string
          name_en?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          created_at: string | null
          employee_code: string
          id: string
          join_date: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_code: string
          id: string
          join_date?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_code?: string
          id?: string
          join_date?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          device_id: string | null
          device_type: string | null
          id: string
          ip_address: unknown
          is_active: boolean | null
          last_active: string | null
          session_token: string
          terminated_at: string | null
          termination_reason: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_id?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_active?: string | null
          session_token: string
          terminated_at?: string | null
          termination_reason?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_id?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_active?: string | null
          session_token?: string
          terminated_at?: string | null
          termination_reason?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_announcements: {
        Row: {
          attachment_url: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string | null
          is_pinned: boolean | null
          pin_until: string | null
          published_at: string | null
          target_role: string | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          attachment_url?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string | null
          is_pinned?: boolean | null
          pin_until?: string | null
          published_at?: string | null
          target_role?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          attachment_url?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string | null
          is_pinned?: boolean | null
          pin_until?: string | null
          published_at?: string | null
          target_role?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_summary: {
        Row: {
          assignment_name: string | null
          class_id: string | null
          class_name: string | null
          due_date: string | null
          fee_assignment_id: string | null
          id: string | null
          invoice_number: string | null
          is_overdue: boolean | null
          paid_amount: number | null
          paid_date: string | null
          remaining_amount: number | null
          status: string | null
          student_code: string | null
          student_id: string | null
          student_name: string | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_fee_assignment_id_fkey"
            columns: ["fee_assignment_id"]
            isOneToOne: false
            referencedRelation: "fee_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_fee_status"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_grade_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      message_thread_summary: {
        Row: {
          last_message: string | null
          last_message_at: string | null
          recipient_id: string | null
          sender_id: string | null
          subject: string | null
          thread_id: string | null
          unread_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attachment_url: string | null
          class_id: string | null
          class_name: string | null
          created_at: string | null
          created_by: string | null
          end_date: string | null
          id: string | null
          makeup_notes: string | null
          reason: string | null
          rejection_reason: string | null
          request_type: string | null
          requires_makeup: boolean | null
          start_date: string | null
          status: string | null
          student_code: string | null
          student_id: string | null
          student_name: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "leave_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_fee_status"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "leave_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_grade_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "leave_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      recent_notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          is_read: boolean | null
          read_at: string | null
          recipient_id: string | null
          related_id: string | null
          related_type: string | null
          sender_id: string | null
          sender_name: string | null
          title: string | null
          type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_attendance_summary: {
        Row: {
          class_id: string | null
          class_name: string | null
          days_absent: number | null
          days_excused: number | null
          days_late: number | null
          days_present: number | null
          student_code: string | null
          student_id: string | null
          student_name: string | null
          total_days: number | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_fee_status: {
        Row: {
          class_id: string | null
          class_name: string | null
          overdue_fees: number | null
          paid_fees: number | null
          pending_fees: number | null
          student_code: string | null
          student_id: string | null
          student_name: string | null
          total_fees: number | null
          total_paid: number | null
          total_remaining: number | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_grade_summary: {
        Row: {
          average_score: number | null
          class_id: string | null
          class_name: string | null
          excellent_count: number | null
          fair_count: number | null
          good_count: number | null
          poor_count: number | null
          student_code: string | null
          student_id: string | null
          student_name: string | null
          subject_name: string | null
          total_assessments: number | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      unread_message_counts: {
        Row: {
          unread_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_invoices_from_assignment: {
        Args: { assignment_id: string }
        Returns: number
      }
      get_notification_recipients: {
        Args: {
          p_specific_user_ids?: string[]
          p_target_class_ids?: string[]
          p_target_grade_ids?: string[]
          p_target_role: string
        }
        Returns: {
          role: string
          user_id: string
        }[]
      }
      get_parent_children: { Args: never; Returns: string[] }
      get_payment_stats: {
        Args: { academic_year?: string; semester?: string }
        Returns: {
          collection_rate: number
          overdue_invoices: number
          paid_amount: number
          paid_invoices: number
          pending_invoices: number
          total_amount: number
          total_invoices: number
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_parent: { Args: never; Returns: boolean }
      is_student: { Args: never; Returns: boolean }
      is_teacher: { Args: never; Returns: boolean }
      terminate_user_sessions: {
        Args: { p_reason?: string; p_user_id: string }
        Returns: undefined
      }
      user_has_role: { Args: { user_role: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
