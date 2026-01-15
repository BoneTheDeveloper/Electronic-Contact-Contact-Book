'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  role: 'admin' | 'teacher'
}

interface NavItem {
  href: string
  label: string
  icon: string
  badge?: number
}

interface NavSection {
  label: string
  items: NavItem[]
}

const adminNavSections = [
  {
    label: 'Chính',
    items: [
      { href: '/admin/dashboard', label: 'Tổng quan', icon: 'grid' },
    ],
  },
  {
    label: 'Quản trị',
    items: [
      { href: '/admin/users', label: 'Người dùng', icon: 'users' },
      { href: '/admin/classes', label: 'Học thuật (Lớp/Môn)', icon: 'school' },
    ],
  },
  {
    label: 'Vận hành',
    items: [
      { href: '/admin/attendance', label: 'Chuyên cần', icon: 'calendar' },
      { href: '/admin/grades', label: 'Quản lý Điểm số', icon: 'check' },
      { href: '/admin/payments', label: 'Học phí & Tài chính', icon: 'card' },
      { href: '/admin/notifications', label: 'Thông báo', icon: 'bell' },
    ],
  },
]

const teacherNavSections = [
  {
    label: 'Cá nhân',
    items: [
      { href: '/teacher/dashboard', label: 'Tổng quan', icon: 'grid' },
    ],
  },
  {
    label: 'Giảng dạy',
    items: [
      { href: '/teacher/schedule', label: 'Lịch giảng dạy', icon: 'calendar' },
      { href: '/teacher/attendance', label: 'Điểm danh', icon: 'calendar' },
      { href: '/teacher/class-management', label: 'Quản lý lớp dạy', icon: 'users' },
      { href: '/teacher/grades', label: 'Nhập điểm số', icon: 'edit' },
      { href: '/teacher/regular-assessment', label: 'Đánh giá nhận xét', icon: 'star' },
      { href: '/teacher/dashboard#grade-reviews', label: 'Phúc khảo điểm', icon: 'clipboard', badge: 2 },
    ],
  },
  {
    label: 'Chủ nhiệm',
    items: [
      { href: '/teacher/conduct', label: 'Học tập & Hạnh kiểm', icon: 'star' },
      { href: '/teacher/homeroom', label: 'Quản lý lớp CN', icon: 'users' },
      { href: '/teacher/leave-approval', label: 'Phê duyệt nghỉ phép', icon: 'check', badge: 3 },
      { href: '/teacher/messages', label: 'Tin nhắn', icon: 'message' },
    ],
  },
]

const icons: Record<string, JSX.Element> = {
  grid: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  school: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  card: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  bell: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  edit: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  clipboard: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  message: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  star: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const navSections = role === 'admin' ? adminNavSections : teacherNavSections

  const handleLogout = () => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/auth/logout'
    document.body.appendChild(form)
    form.submit()
  }

  // Get user display info from cookie or localStorage (simplified for demo)
  const userName = role === 'admin' ? 'Admin123' : 'Giáo viên'
  const userEmail = role === 'admin' ? 'ad001@econtact.vn' : 'gv001@econtact.vn'

  return (
    <aside className="flex h-screen w-[280px] flex-shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-slate-100 p-6">
        <div className="rounded-xl bg-blue-50 p-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-800 leading-none">ECONTACT</h1>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {role === 'admin' ? 'Admin Portal' : 'Teacher Portal'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-3 py-6">
        {navSections.map((section, idx) => (
          <div key={section.label} className="w-full">
            <p className="mb-2 mt-6 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 first:mt-0">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'nav-item relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all whitespace-nowrap overflow-hidden min-w-0 w-full',
                      isActive
                        ? 'bg-[rgba(2,132,199,0.1)] text-[#0284C7]'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {/* Active indicator - positioned absolutely on the left, within bounds */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r-full bg-[#0284C7] z-10" />
                    )}
                    <span className="flex-shrink-0">{icons[item.icon]}</span>
                    <span className="truncate flex-1 min-w-0">{item.label}</span>
                    {'badge' in item && typeof item.badge === 'number' && (
                      <span className="flex-shrink-0 ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Sidebar Bottom */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-4">
        <div className="flex items-center gap-3 p-2">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-slate-200">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0284C7&color=fff`}
              alt="Avatar"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800">{userName}</p>
            <p className="truncate text-[10px] font-medium text-slate-400">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 transition-colors hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
