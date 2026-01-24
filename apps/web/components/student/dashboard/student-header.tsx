/**
 * Student Dashboard Header
 * Displays student info card with avatar, name, class, and notification bell
 */

import { Bell } from 'lucide-react';
import { getInitials } from '../shared/constants';

interface StudentHeaderProps {
  student?: {
    name?: string;
    className?: string;
    grade?: string;
    section?: string;
  };
  notificationCount?: number;
}

export function StudentHeader({ student, notificationCount = 0 }: StudentHeaderProps) {
  const initials = getInitials(student?.name);
  const classDisplay = student?.className || (student?.grade && student?.section
    ? `Lớp ${student.grade}${student.section}`
    : 'Lớp học'
  );

  return (
    <div className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] pt-16 pb-8 px-6 md:px-8 rounded-b-[30px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center bg-white/20 border-2 border-white/30">
            <span className="text-white text-xl md:text-2xl font-extrabold">
              {initials}
            </span>
          </div>

          {/* Student Info */}
          <div>
            <h2 className="text-white text-xl md:text-2xl font-extrabold">
              {student?.name || 'Học sinh'}
            </h2>
            <p className="text-blue-100 text-xs md:text-sm font-medium mt-1 uppercase tracking-wider">
              {classDisplay}
            </p>
          </div>
        </div>

        {/* Notification Bell */}
        <button className="relative w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
          <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-[9px] font-extrabold">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
