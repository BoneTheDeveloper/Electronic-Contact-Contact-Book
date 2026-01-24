/**
 * Student Summary Page
 * Overall academic summary with GPA and subject breakdown
 */

import { PageHeader } from '@/components/student/shared/page-header';
import { getSubjectInfo, getGradeClassification } from '@/components/student/shared/constants';
import { SubjectBadge } from '@/components/student/shared';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function StudentSummaryPage({
  searchParams,
}: {
  searchParams: Promise<{ semester?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const semester = params.semester || 'I';

  // TODO: Fetch real summary data from Supabase
  const mockSummary = {
    overallGPA: 8.2,
    rank: 5,
    totalStudents: 40,
    attendanceRate: 95,
    attendanceTotal: 44,
    attendancePresent: 42,
    conductScore: 90,
    conductClassification: 'Tốt',
    subjects: [
      { subjectName: 'Toán học', average: 8.3 },
      { subjectName: 'Ngữ văn', average: 7.9 },
      { subjectName: 'Tiếng Anh', average: 8.8 },
      { subjectName: 'Vật lý', average: 7.5 },
    ],
  };

  const classification = getGradeClassification(mockSummary.overallGPA);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PageHeader
        title="Kết quả tổng hợp"
        subtitle="Năm học 2025 - 2026"
      />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
        {/* Semester Selector */}
        <div className="flex gap-2 mb-6">
          <a
            href="/student/summary?semester=I"
            className={`flex-1 py-2.5 text-center rounded-xl font-black text-sm transition-colors ${
              semester === 'I'
                ? 'bg-[#0284C7] text-white'
                : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'
            }`}
          >
            Học kỳ I
          </a>
          <a
            href="/student/summary?semester=all"
            className={`flex-1 py-2.5 text-center rounded-xl font-black text-sm transition-colors ${
              semester === 'all'
                ? 'bg-[#0284C7] text-white'
                : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'
            }`}
          >
            Cả năm
          </a>
        </div>

        {/* Overall Score Card with Circular Progress */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 md:p-6 rounded-3xl shadow-lg shadow-indigo-900/20 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-indigo-100 text-[9px] font-black uppercase tracking-wider mb-1">
                Điểm tổng kết
              </p>
              <p className="text-white text-5xl font-extrabold mb-1">{mockSummary.overallGPA.toFixed(1)}</p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${classification.bg} ${classification.color}`}>
                  {classification.label}
                </span>
                <span className="text-indigo-100 text-[9px] font-medium">Xếp hạng {mockSummary.rank}/{mockSummary.totalStudents}</span>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="relative">
              <svg className="w-24 h-24 md:w-28 md:h-28" viewBox="0 0 100 100">
                <circle
                  className="text-indigo-400"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-white"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * mockSummary.overallGPA / 10)}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-white text-lg font-extrabold">{Math.round(mockSummary.overallGPA * 10)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-500 text-[9px] font-black uppercase">Đi học đúng giờ</p>
            </div>
            <p className="text-gray-800 text-2xl font-extrabold">{mockSummary.attendanceRate}%</p>
            <p className="text-gray-400 text-[9px] font-medium mt-0.5">{mockSummary.attendancePresent}/{mockSummary.attendanceTotal} buổi</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <p className="text-gray-500 text-[9px] font-black uppercase">Hạnh kiểm</p>
            </div>
            <p className="text-gray-800 text-2xl font-extrabold">{mockSummary.conductClassification}</p>
            <p className="text-gray-400 text-[9px] font-medium mt-0.5">{mockSummary.conductScore} điểm</p>
          </div>
        </div>

        {/* Subject Breakdown */}
        <h3 className="text-gray-800 font-extrabold text-sm mb-3">Chi tiết các môn</h3>

        <div className="space-y-3 pb-32 md:pb-8">
          {mockSummary.subjects.map((subject) => {
            const info = getSubjectInfo(subject.subjectName);
            const subjectClass = getGradeClassification(subject.average);

            return (
              <div key={subject.subjectName} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <SubjectBadge subjectName={subject.subjectName} size="md" />
                    <div>
                      <h4 className="text-gray-800 font-bold text-sm">{subject.subjectName}</h4>
                      <p className="text-gray-400 text-[9px] font-medium">{subject.average.toFixed(1)} điểm</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${subjectClass.bg} ${subjectClass.color}`}>
                    {subjectClass.label}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full bg-gradient-to-r ${subject.average >= 8 ? 'from-emerald-400 to-emerald-500' : subject.average >= 7 ? 'from-sky-400 to-sky-500' : 'from-orange-400 to-orange-500'}`}
                    style={{ width: `${subject.average * 10}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
