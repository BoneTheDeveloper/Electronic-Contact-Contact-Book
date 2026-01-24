/**
 * Student Header
 * Top header with notification bell
 */

import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentHeaderProps {
  studentId?: string | null;
}

export function StudentHeader({ studentId }: StudentHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center">
          <span className="text-white text-sm font-extrabold">SV</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-bold text-gray-900">Học sinh</p>
          <p className="text-xs text-gray-500">Lớp học</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </div>
  );
}
