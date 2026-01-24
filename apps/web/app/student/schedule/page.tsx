/**
 * Student Schedule Page
 * Weekly class schedule with day selector and period cards
 */

import { PageHeader } from '@/components/student/shared/page-header';
import { getSubjectInfo, DAY_NAMES, getDayNumber } from '@/components/student/shared/constants';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function StudentSchedulePage({
  searchParams,
}: {
  searchParams: { day?: string };
}) {
  const supabase = await createClient();
  const selectedDay = parseInt(searchParams.day || '1');

  // TODO: Fetch real schedule from Supabase
  // For now, showing mock data matching the wireframe

  const mockSchedule = {
    1: [ // Monday
      { period: 1, time: '07:00 - 07:45', subject: 'Toán học', room: 'Phòng 301', session: 'morning' },
      { period: 2, time: '07:50 - 08:35', subject: 'Ngữ văn', room: 'Phòng 302', session: 'morning' },
      { period: 3, time: '08:40 - 09:25', subject: 'Tiếng Anh', room: 'Phòng 303', session: 'morning' },
      { period: 4, time: '09:35 - 10:20', subject: 'Vật lý', room: 'Phòng Lab 1', session: 'morning' },
      { period: 5, time: '10:25 - 11:10', subject: 'Hóa học', room: 'Phòng Lab 2', session: 'morning' },
      { period: 6, time: '13:30 - 14:15', subject: 'Lịch sử', room: 'Phòng 304', session: 'afternoon' },
      { period: 7, time: '14:20 - 15:05', subject: 'Địa lý', room: 'Phòng 305', session: 'afternoon' },
    ],
    2: [], // Tuesday - empty for demo
    3: [ // Wednesday
      { period: 1, time: '07:00 - 07:45', subject: 'Toán học', room: 'Phòng 301', session: 'morning' },
      { period: 2, time: '07:50 - 08:35', subject: 'Vật lý', room: 'Phòng Lab 1', session: 'morning' },
      { period: 3, time: '08:40 - 09:25', subject: 'Hóa học', room: 'Phòng Lab 2', session: 'morning' },
    ],
  };

  const daySchedule = mockSchedule[selectedDay as keyof typeof mockSchedule] || [];
  const morningPeriods = daySchedule.filter((p) => p.session === 'morning');
  const afternoonPeriods = daySchedule.filter((p) => p.session === 'afternoon');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PageHeader
        title="Thời khóa biểu"
        subtitle="Lớp 9A"
      />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
        {/* Day Selector */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {DAY_NAMES.map((day) => (
              <Link
                key={day.value}
                href={`/student/schedule?day=${day.value}`}
                className={`flex-1 min-w-[56px] py-3 px-2 rounded-xl flex flex-col items-center transition-colors ${
                  selectedDay === day.value
                    ? 'bg-[#0284C7] text-white'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <span className="text-[9px] md:text-xs font-black uppercase">{day.label}</span>
                <span className="text-sm md:text-base font-bold">{getDayNumber(day.value)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Morning Periods */}
        {morningPeriods.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-3 mt-6">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <h3 className="text-gray-800 font-extrabold text-sm">BUỔI SÁNG</h3>
            </div>
            {morningPeriods.map((period) => {
              const info = getSubjectInfo(period.subject);
              return (
                <div
                  key={period.period}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-orange-100 text-orange-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                          Tiết {period.period}
                        </span>
                        <span className="text-gray-400 text-[9px] font-medium">{period.time}</span>
                      </div>
                      <h4 className="text-gray-800 font-bold text-base mb-0.5">{period.subject}</h4>
                      <p className="text-gray-500 text-xs font-medium">{period.room}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${info.bg}`}>
                      <span className={`text-sm font-black ${info.text}`}>{info.short}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Afternoon Periods */}
        {afternoonPeriods.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-3 mt-6">
              <div className="w-2 h-2 bg-sky-500 rounded-full" />
              <h3 className="text-gray-800 font-extrabold text-sm">BUỔI CHIỀU</h3>
            </div>
            {afternoonPeriods.map((period) => {
              const info = getSubjectInfo(period.subject);
              return (
                <div
                  key={period.period}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-sky-100 text-sky-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                          Tiết {period.period}
                        </span>
                        <span className="text-gray-400 text-[9px] font-medium">{period.time}</span>
                      </div>
                      <h4 className="text-gray-800 font-bold text-base mb-0.5">{period.subject}</h4>
                      <p className="text-gray-500 text-xs font-medium">{period.room}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${info.bg}`}>
                      <span className={`text-sm font-black ${info.text}`}>{info.short}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Empty State */}
        {daySchedule.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-400 text-2xl">📅</span>
            </div>
            <p className="text-gray-400 text-sm">Không có lịch học</p>
          </div>
        )}

        {/* Bottom spacer for mobile navigation */}
        <div className="h-20 lg:hidden" />
      </div>
    </div>
  );
}
