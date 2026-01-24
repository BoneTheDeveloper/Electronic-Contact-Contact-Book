/**
 * Student Grades Page
 * Displays grades by semester with subject cards and grade breakdown
 */

import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/student/shared/page-header';
import { SubjectBadge } from '@/components/student/shared/subject-badge';
import { getSubjectInfo, getGradeClassification } from '@/components/student/shared/constants';
import { LoadingSkeleton } from '@/components/student/shared/loading-skeleton';
import { useState } from 'react';

// This is a server component, but we need client interactivity for semester toggle
// For now, keeping it simple with semester as URL param

export default async function StudentGradesPage({
  searchParams,
}: {
  searchParams: Promise<{ semester?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const semester = params.semester || 'I';

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO: Fetch real grades from Supabase
  // For now, showing mock data matching the wireframe

  const mockGrades = [
    {
      subjectId: '1',
      subjectName: 'Toán học',
      grades: [
        { label: 'TX1', score: 8.5 },
        { label: 'TX2', score: 9.0 },
        { label: 'TX3', score: 8.0 },
        { label: 'GK', score: 8.5 },
        { label: 'CK', score: 9.0 },
      ],
      average: 8.6,
    },
    {
      subjectId: '2',
      subjectName: 'Ngữ văn',
      grades: [
        { label: 'TX1', score: 7.5 },
        { label: 'TX2', score: 8.0 },
        { label: 'TX3', score: 7.0 },
        { label: 'GK', score: 7.5 },
        { label: 'CK', score: 8.0 },
      ],
      average: 7.6,
    },
    {
      subjectId: '3',
      subjectName: 'Tiếng Anh',
      grades: [
        { label: 'TX1', score: 9.0 },
        { label: 'TX2', score: 9.5 },
        { label: 'TX3', score: 9.0 },
        { label: 'GK', score: 9.0 },
        { label: 'CK', score: 9.5 },
      ],
      average: 9.2,
    },
    {
      subjectId: '4',
      subjectName: 'Vật lý',
      grades: [
        { label: 'TX1', score: 7.0 },
        { label: 'TX2', score: 7.5 },
        { label: 'TX3', score: 7.0 },
        { label: 'GK', score: 7.5 },
        { label: 'CK', score: 8.0 },
      ],
      average: 7.4,
    },
  ];

  const overallAverage = mockGrades.reduce((sum, g) => sum + g.average, 0) / mockGrades.length;
  const classification = getGradeClassification(overallAverage);

  return (
    <div className="min-h-screen bg-[#F8FASC]">
      <PageHeader
        title="Bảng điểm môn học"
        subtitle="Năm học 2025 - 2026"
      />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
        {/* Semester Selector */}
        <div className="flex gap-2 mb-6">
          <a
            href="/student/grades?semester=I"
            className={`flex-1 py-3 text-center rounded-xl font-black text-sm transition-colors ${
              semester === 'I'
                ? 'bg-[#0284C7] text-white'
                : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'
            }`}
          >
            Học kỳ I
          </a>
          <a
            href="/student/grades?semester=II"
            className={`flex-1 py-3 text-center rounded-xl font-black text-sm transition-colors ${
              semester === 'II'
                ? 'bg-[#0284C7] text-white'
                : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'
            }`}
          >
            Học kỳ II
          </a>
        </div>

        {/* Overall Summary Card */}
        <div className="bg-gradient-to-r from-[#0284C7] to-[#0369A1] p-5 md:p-6 rounded-3xl shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-[9px] md:text-xs font-black uppercase tracking-wider mb-1">
                Điểm trung bình
              </p>
              <p className="text-white text-4xl md:text-5xl font-extrabold">
                {overallAverage.toFixed(1)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-[9px] md:text-xs font-black uppercase ${classification.bg} ${classification.color}`}>
                  {classification.label}
                </span>
                <span className="text-blue-100 text-xs font-medium">Xếp hạng 5/40</span>
              </div>
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Subject Grades List */}
        <h3 className="text-gray-800 font-extrabold text-sm mb-3">Chi tiết các môn</h3>

        <div className="space-y-3 pb-32 md:pb-8">
          {mockGrades.map((subject) => {
            const info = getSubjectInfo(subject.subjectName);

            return (
              <div
                key={subject.subjectId}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <SubjectBadge subjectName={subject.subjectName} size="md" />
                    <div>
                      <h4 className="text-gray-800 font-bold text-sm">{subject.subjectName}</h4>
                      <p className="text-gray-400 text-[9px] font-medium">{subject.average.toFixed(2)} điểm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[#0284C7] font-extrabold text-lg">{subject.average.toFixed(1)}</p>
                      <p className="text-gray-400 text-[9px] font-medium">ĐTB</p>
                    </div>
                    <button className="w-8 h-8 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center hover:bg-amber-100 transition-colors">
                      <span className="text-amber-600 text-sm">✏</span>
                    </button>
                  </div>
                </div>

                {/* Grade Grid */}
                <div className="flex gap-2">
                  {subject.grades.map((grade, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 py-2 rounded-lg text-center ${
                        idx < 3 ? 'bg-blue-50 text-blue-700' : // TX1-TX3
                        idx === 3 ? 'bg-purple-50 text-purple-700' : // GK
                        'bg-orange-50 text-orange-600' // CK
                      }`}
                    >
                      <p className="text-[8px] font-black uppercase">{grade.label}</p>
                      <p className="text-sm font-extrabold">{grade.score.toFixed(1)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
