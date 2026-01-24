/**
 * Student Dashboard Page
 * Main dashboard with student header and 9-function navigation grid
 */

import { createClient } from '@/lib/supabase/server';
import { StudentHeader } from '@/components/student/dashboard/student-header';
import { FunctionGrid } from '@/components/student/dashboard/function-grid';
import { EmptyState } from '@/components/student/shared';

export default async function StudentDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get student profile data
  let studentData = null;
  if (user?.id) {
    const { data } = await supabase
      .from('students')
      .select('*, enrollments(classes(grades(name)))')
      .eq('id' as const, user.id as any)
      .single();

    if (data && 'enrollments' in data && Array.isArray(data.enrollments) && data.enrollments.length > 0) {
      const enrollment = data.enrollments[0];
      studentData = {
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        className: 'classes' in enrollment && enrollment.classes ? (enrollment.classes as any).name || '' : '',
        grade: 'classes' in enrollment && enrollment.classes && 'grades' in enrollment.classes && (enrollment.classes as any).grades ? (enrollment.classes.grades as any).name || '' : '',
      };
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FASC]">
      {/* Student Header */}
      <StudentHeader
        student={studentData || undefined}
        notificationCount={3}
      />

      {/* Main Content */}
      <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-gray-800 font-extrabold text-lg md:text-xl">
              Chào mừng trở lại! 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Hôm nay bạn muốn làm gì?
            </p>
          </div>

          {/* Function Grid */}
          <FunctionGrid />
        </div>
      </div>

      {/* Bottom spacer for mobile navigation */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
