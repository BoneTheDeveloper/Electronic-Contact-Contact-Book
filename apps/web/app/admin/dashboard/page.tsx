import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Plus,
} from 'lucide-react'
import Link from 'next/link'
import { StatsGrid } from '@/components/admin/StatsGrid'
import { AttendanceBoxes } from '@/components/admin/AttendanceBoxes'
import { FeeCollectionChart } from '@/components/admin/FeeCollectionChart'
import { ActivityLogTable } from '@/components/admin/ActivityLogTable'
import { GradeDistribution } from '@/components/admin/GradeDistribution'
import { SupportRequests } from '@/components/admin/SupportRequests'
import {
  getDashboardStats,
  getAttendanceStats,
  getFeeStats,
  getActivities,
  getGradeDistribution,
} from '@/lib/mock-data'

export default async function AdminDashboard() {
  const [stats, attendance, fees, activities, gradeDist] = await Promise.all([
    getDashboardStats(),
    getAttendanceStats('week'),
    getFeeStats('1'),
    getActivities(),
    getGradeDistribution(),
  ])

  const statCards = [
    {
      label: 'Học sinh',
      value: stats.students.toLocaleString('vi-VN'),
      change: '+2.5%',
      icon: Users,
      color: 'bg-blue-50 text-sky-600',
    },
    {
      label: 'Phụ huynh',
      value: stats.parents.toLocaleString('vi-VN'),
      change: '+1.8%',
      icon: Users,
      color: 'bg-teal-50 text-teal-600',
    },
    {
      label: 'Giáo viên',
      value: stats.teachers.toString(),
      change: 'Ổn định',
      icon: GraduationCap,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Chuyên cần',
      value: stats.attendance,
      change: '-0.8%',
      icon: Calendar,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Thu học phí',
      value: stats.feesCollected,
      change: '+12%',
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
    },
  ]

  return (
    <div className="space-y-8 p-8">
      {/* Page Header with Actions */}
      <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
        <div></div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-bold text-sm text-slate-700 transition-colors hover:bg-slate-50">
            <Download width={16} height={16} />
            Xuất báo cáo
          </button>
          <Link
            href="/admin/notifications"
            className="flex items-center gap-2 rounded-xl bg-[#0284C7] px-5 py-2.5 font-bold text-sm text-white shadow-lg shadow-blue-100 transition-colors hover:bg-[#0369a1]"
          >
            <Plus width={16} height={16} strokeWidth={3} />
            Thông báo mới
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={statCards} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          {/* Two Charts Side by Side */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Attendance Boxes */}
            <AttendanceBoxes initialData={attendance} />

            {/* Fee Collection */}
            <FeeCollectionChart initialData={fees} />
          </div>

          {/* Activity Log Table */}
          <ActivityLogTable activities={activities} />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-8">
          {/* Grade Distribution */}
          <GradeDistribution data={gradeDist} />

          {/* Support Requests */}
          <SupportRequests />
        </div>
      </div>
    </div>
  )
}
