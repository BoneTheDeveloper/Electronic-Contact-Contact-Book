/**
 * Student Attendance Page
 * Visual calendar attendance with statistics and absence details
 */

import { PageHeader } from '@/components/student/shared/page-header';
import { STATUS_COLORS, StatusBadge } from '@/components/student/shared';
import { createClient } from '@/lib/supabase/server';

export default async function StudentAttendancePage({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  const supabase = await createClient();
  const now = new Date();
  const currentMonth = searchParams.month || now.toISOString().slice(0, 7);

  // TODO: Fetch real attendance from Supabase
  // For now, showing mock data

  const mockAttendance = {
    total: 44,
    present: 42,
    absent: 1,
    late: 1,
    excused: 0,
    percentage: 95,
  };

  const mockRecords = [
    { date: '05/01', status: 'present' as const },
    { date: '06/01', status: 'present' as const },
    { date: '07/01', status: 'absent' as const, reason: 'Ốm đau' },
    { date: '08/01', status: 'present' as const },
    { date: '09/01', status: 'late' as const },
    { date: '10/01', status: 'present' as const },
  ];

  // Generate calendar days for current month
  const year = parseInt(currentMonth.slice(0, 4));
  const month = parseInt(currentMonth.slice(5, 7));
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay() || 7;

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dayOfWeek = ((firstDayOfWeek - 1 + i) % 7) + 1;
    return {
      day: dayNum,
      dayOfWeek,
      dateStr: `${String(dayNum).padStart(2, '0')}/${String(month).padStart(2, '0')}`,
      status: (mockRecords.find(r => r.date === `${String(dayNum).padStart(2, '0')}/${String(month).padStart(2, '0')}`)?.status || 'none') as 'present' | 'absent' | 'late' | 'excused' | 'none',
    };
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PageHeader
        title="Điểm danh"
        subtitle={`Tháng ${month}/${year}`}
      />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-500 text-[9px] font-black uppercase">Đi học đúng giờ</p>
            </div>
            <p className="text-gray-800 text-2xl font-extrabold">{mockAttendance.percentage}%</p>
            <p className="text-gray-400 text-[9px] font-medium mt-0.5">{mockAttendance.present}/{mockAttendance.total} buổi</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="text-gray-500 text-[9px] font-black uppercase">Đánh giá</p>
            </div>
            <p className="text-gray-800 text-2xl font-extrabold">Tốt</p>
            <p className="text-gray-400 text-[9px] font-medium mt-0.5">Giỏi</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-gray-500 text-[9px] font-black uppercase">Vắng mặt</p>
            </div>
            <p className="text-gray-800 text-2xl font-extrabold">{mockAttendance.absent}</p>
            <p className="text-gray-400 text-[9px] font-medium mt-0.5">buổi</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-[9px] font-black uppercase">Đi muộn</p>
            </div>
            <p className="text-gray-800 text-2xl font-extrabold">{mockAttendance.late}</p>
            <p className="text-gray-400 text-[9px] font-medium mt-0.5">buổi</p>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
              <div key={day} className="text-center py-2">
                <span className="text-[9px] font-black text-gray-400 uppercase">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfWeek - 1 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of month */}
            {calendarDays.map((day) => {
              let bgClass = 'bg-gray-50';
              let textClass = 'text-gray-600';

              if (day.status === 'present') {
                bgClass = 'bg-emerald-100';
                textClass = 'text-emerald-700';
              } else if (day.status === 'absent') {
                bgClass = 'bg-red-100';
                textClass = 'text-red-600';
              } else if (day.status === 'late') {
                bgClass = 'bg-amber-100';
                textClass = 'text-amber-600';
              } else if (day.status === 'excused') {
                bgClass = 'bg-blue-100';
                textClass = 'text-blue-700';
              }

              return (
                <div
                  key={day.day}
                  className={`aspect-square ${bgClass} rounded-lg flex items-center justify-center`}
                >
                  <span className={`text-sm font-bold ${textClass}`}>{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Absence Details */}
        <h3 className="text-gray-800 font-extrabold text-sm mb-3">Chi tiết vắng/muộn</h3>
        <div className="space-y-2 pb-32 md:pb-8">
          {mockRecords.filter(r => r.status !== 'present').map((record, idx) => (
            <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
              <div className={`w-2 h-8 rounded-full ${STATUS_COLORS[record.status]?.bg || 'bg-gray-200'}`} />
              <div className="flex-1">
                <p className="text-gray-800 font-bold text-sm">{record.date}</p>
                {record.reason && (
                  <p className="text-gray-500 text-xs">{record.reason}</p>
                )}
              </div>
              <StatusBadge status={record.status} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
