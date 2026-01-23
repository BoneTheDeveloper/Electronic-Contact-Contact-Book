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
        grade,
        section,
        class_id,
        profiles!inner(
          full_name,
          avatar_url
        )
      )
    `)
    .eq('guardian_id', parentId)
    .eq('students.profiles.status', 'active');

  if (error) {
    console.error('[QUERIES] Error fetching children:', error);
    throw new Error(`Failed to load children: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((item: any) => ({
    id: item.students.id,
    name: item.students.profiles.full_name,
    rollNumber: item.students.student_code,
    classId: item.students.class_id || '',
    section: item.students.section || '',
    grade: item.students.grade || 0,
    studentCode: item.students.student_code,
    isPrimary: item.is_primary,
    avatarUrl: item.students.profiles.avatar_url,
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
