/**
 * Supabase Queries
 * Reusable database queries for the mobile app
 */

import { supabase } from './client';

export interface ChildData {
  id: string;
  name: string;
  rollNumber: string;
  classId: string;
  section: string;
  grade: number;
  studentCode: string;
  isPrimary?: boolean;
  avatarUrl?: string;
}

/**
 * Fetch all children for a given parent from student_guardians junction table
 * @param parentId - UUID from parents table
 * @returns Array of child data
 */
export const getParentChildren = async (
  parentId: string
): Promise<ChildData[]> => {
  const { data, error } = await supabase
    .from('student_guardians')
    .select(`
      student_id,
      is_primary,
      students!inner(
        id,
        student_code,
        profiles!students_id_fkey(
          full_name,
          avatar_url,
          status
        ),
        enrollments!inner(
          class_id,
          status,
          classes!inner(
            name,
            grade_id
          )
        )
      )
    `)
    .eq('guardian_id', parentId)
    .eq('students.profiles!students_id_fkey.status', 'active')
    .eq('students.enrollments.status', 'active');

  if (error) {
    console.error('[QUERIES] Error fetching children:', error);
    throw new Error(`Failed to load children: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Group by student (in case multiple enrollments exist, get the active one)
  const uniqueChildren = new Map<string, any>();

  for (const item of data as any[]) {
    const studentId = item.students.id;
    if (!uniqueChildren.has(studentId)) {
      uniqueChildren.set(studentId, item);
    }
  }

  return Array.from(uniqueChildren.values()).map((item: any) => ({
    id: item.students.id,
    name: item.students.full_name,
    rollNumber: item.students.student_code,
    classId: item.students.enrollments?.[0]?.class_id || '',
    section: '',
    grade: parseInt(item.students.enrollments?.[0]?.classes?.grade_id || '0', 10),
    studentCode: item.students.student_code,
    isPrimary: item.is_primary,
    avatarUrl: item.students.avatar_url,
  }));
};

/**
 * Get parent ID from profile phone number
 * @param phone - Parent phone number
 * @returns Parent UUID or null
 */
export const getParentIdByPhone = async (
  phone: string
): Promise<string | null> => {
  // First get profile ID from phone, then get parent record
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone', phone)
    .eq('role', 'parent')
    .single();

  if (profileError || !profile) {
    console.error('[QUERIES] Error finding parent profile:', profileError);
    return null;
  }

  // Profile ID is same as parent ID in our schema
  return profile.id;
};
