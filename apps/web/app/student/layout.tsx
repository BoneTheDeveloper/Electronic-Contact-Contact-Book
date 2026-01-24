/**
 * Student Portal Layout
 * Shared layout wrapper for all student pages
 * Handles authentication, navigation, and student data
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StudentSidebar } from '@/components/student/layout/sidebar';
import { StudentNav } from '@/components/student/layout/nav';
import { StudentHeader } from '@/components/student/layout/header';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Get user role from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id' as const, user.id as any)
    .single();

  if (!profile || !('role' in profile) || profile.role !== 'student') {
    // Redirect to appropriate portal or home
    if (profile && 'role' in profile && profile.role === 'admin') {
      redirect('/admin');
    } else if (profile && 'role' in profile && profile.role === 'teacher') {
      redirect('/teacher');
    } else {
      redirect('/');
    }
  }

  const studentId = user.id;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <StudentSidebar studentId={studentId} />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100">
          <StudentHeader studentId={studentId} />
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block sticky top-0 z-40 bg-white border-b border-gray-100">
          <StudentHeader studentId={studentId} />
        </div>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <StudentNav />
      </div>
    </div>
  );
}
