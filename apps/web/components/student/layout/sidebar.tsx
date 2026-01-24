'use client';

/**
 * Student Sidebar (Desktop)
 * Left navigation for student portal
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  CheckCircle,
  UserCheck,
  Book,
  FilePlus,
  MessageSquare,
  Newspaper,
  PieChart,
  DollarSign,
} from 'lucide-react';

const navItems = [
  { href: '/student/dashboard', label: 'Trang chủ', icon: LayoutDashboard },
  { href: '/student/schedule', label: 'Thời khóa biểu', icon: Calendar },
  { href: '/student/grades', label: 'Bảng điểm', icon: CheckCircle },
  { href: '/student/attendance', label: 'Điểm danh', icon: UserCheck },
  { href: '/student/materials', label: 'Tài liệu', icon: Book },
  { href: '/student/leave', label: 'Xin nghỉ', icon: FilePlus },
  { href: '/student/feedback', label: 'Nhận xét', icon: MessageSquare },
  { href: '/student/news', label: 'Tin tức', icon: Newspaper },
  { href: '/student/summary', label: 'Tổng hợp', icon: PieChart },
  { href: '/student/payments', label: 'Học phí', icon: DollarSign },
] as const;

interface StudentSidebarProps {
  studentId?: string | null;
}

export function StudentSidebar({ studentId }: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/student/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0284C7]">
            <span className="text-white font-extrabold text-lg">E</span>
          </div>
          <span className="font-extrabold text-xl text-gray-900">EContact</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-3">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href) || pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'bg-[#0284C7] text-white'
                      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900',
                    'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200'
                  )}
                >
                  <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-white' : 'text-gray-400')} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section (Bottom) */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369A1] flex items-center justify-center">
            <span className="text-white text-sm font-extrabold">SV</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Học sinh</p>
            <p className="text-xs text-gray-500 truncate">Lớp học</p>
          </div>
        </div>
      </div>
    </div>
  );
}
