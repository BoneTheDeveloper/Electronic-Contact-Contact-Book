/**
 * Attendance Notification Service
 * Sends notifications to parents when students are marked absent or late
 */

import { createClient } from '@/lib/supabase/server'

export interface AbsentStudentInfo {
  student_id: string
  student_name: string
  status: 'absent' | 'late'
}

/**
 * Send attendance notifications to parents for absent/late students
 */
export async function sendAttendanceNotifications(
  classId: string,
  date: string,
  absentStudents: AbsentStudentInfo[],
  periodId?: number
): Promise<{ success: boolean; sent: number; failed: number }> {
  const supabase = await createClient()

  if (absentStudents.length === 0) {
    return { success: true, sent: 0, failed: 0 }
  }

  let sent = 0
  let failed = 0

  // Process each absent student
  for (const student of absentStudents) {
    try {
      // Get all guardians for this student
      const { data: guardians, error: guardiansError } = await supabase
        .from('student_guardians')
        .select(`
          is_primary,
          profiles!student_guardians_guardian_id_fkey(
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq('student_id' as const, student.student_id as any)

      if (guardiansError) {
        console.error(`Error fetching guardians for student ${student.student_id}:`, guardiansError)
        failed++
        continue
      }

      const guardianProfiles = (guardians || []).map((g: any) => g.profiles).filter(Boolean)

      if (guardianProfiles.length === 0) {
        console.warn(`No guardians found for student ${student.student_id}`)
        failed++
        continue
      }

      // Get student name
      const { data: studentData } = await supabase
        .from('students')
        .select('profiles!inner(full_name)')
        .eq('id' as const, student.student_id as any)
        .single()

      const studentName = (studentData as any)?.profiles?.full_name || 'Học sinh'

      // Get class name
      const { data: classData } = await supabase
        .from('classes')
        .select('name')
        .eq('id' as const, classId as any)
        .single()

      const className = classData?.name || classId

      // Create notification for each guardian
      for (const guardian of guardianProfiles) {
        const { title, content, category, priority } = generateNotificationContent(
          studentName,
          student.status,
          className,
          date,
          periodId
        )

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: guardian.id,
            title,
            content,
            type: 'attendance',
            category,
            priority,
            related_type: 'attendance',
            is_read: false
          } as any)

        if (notificationError) {
          console.error(`Error creating notification for guardian ${guardian.id}:`, notificationError)
          failed++
        } else {
          sent++
        }
      }
    } catch (error) {
      console.error(`Error processing notifications for student ${student.student_id}:`, error)
      failed++
    }
  }

  return { success: failed === 0, sent, failed }
}

/**
 * Generate notification content based on attendance status
 */
function generateNotificationContent(
  studentName: string,
  status: 'absent' | 'late',
  className: string,
  date: string,
  periodId?: number
): { title: string; content: string; category: string; priority: string } {
  const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  if (status === 'absent') {
    return {
      title: `Thông báo vắng mặt: ${studentName}`,
      content: `Con ${studentName} - Lớp ${className} vắng mặt học ngày ${formattedDate}. Phụ huynh vui lòng liên hệ với giáo viên nếu có lý do đã biết.`,
      category: 'emergency',
      priority: 'high'
    }
  } else {
    return {
      title: `Thông báo đi muộn: ${studentName}`,
      content: `Con ${studentName} - Lớp ${className} đi muộn học ngày ${formattedDate}. Phụ huynh vui lòng nhắc con đi học đúng giờ.`,
      category: 'reminder',
      priority: 'normal'
    }
  }
}

/**
 * Check if notification was already sent for this attendance record
 * Prevents duplicate notifications when attendance is modified
 */
export async function wasNotificationSent(
  studentId: string,
  date: string,
  periodId?: number
): Promise<boolean> {
  const supabase = await createClient()

  // Check for existing notification about this attendance
  // This is a simplified check - in production, you'd have a more robust system
  const todayStart = new Date(date).toISOString().split('T')[0]
  const todayEnd = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('notifications')
    .select('id')
    .eq('recipient_id' as const, studentId as any)
    .eq('type' as const, 'attendance' as any)
    .gte('created_at' as const, todayStart as any)
    .lt('created_at' as const, todayEnd as any)
    .limit(1)

  return !error && (data?.length || 0) > 0
}
