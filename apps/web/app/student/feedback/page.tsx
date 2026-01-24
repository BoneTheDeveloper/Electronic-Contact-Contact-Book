/**
 * Student Teacher Feedback Page
 * Teacher feedback with ratings and filter tabs
 */

import { PageHeader } from '@/components/student/shared/page-header';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';

export default async function StudentFeedbackPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const supabase = await createClient();
  const filter = searchParams.filter || 'all';

  // TODO: Fetch real feedback from Supabase
  const mockFeedback = [
    {
      id: '1',
      teacherName: 'Nguyễn Thị Lan',
      subject: 'Giáo viên Toán học',
      initials: 'NL',
      type: 'positive' as const,
      rating: 5,
      content: 'Em có tiến bộ rất tốt trong giải các bài toán khó. Cần luyện thêm về dạng bài hình học không gian.',
      date: '05/01/2026',
    },
    {
      id: '2',
      teacherName: 'Lê Thu Hương',
      subject: 'Giáo viên Tiếng Anh',
      initials: 'LH',
      type: 'positive' as const,
      rating: 4,
      content: 'Nói tiếng Anh rất tự nhiên. Phát âm tốt nhưng cần mở rộng từ vựng hơn nữa.',
      date: '03/01/2026',
    },
    {
      id: '3',
      teacherName: 'Phạm Quốc Khánh',
      subject: 'Giáo viên Vật lý',
      initials: 'PK',
      type: 'improvement' as const,
      rating: 3,
      content: 'Cần chú ý hơn khi làm bài tập về nhà. Vắng 2 buổi học thực hành cần bù lại.',
      date: '28/12/2025',
    },
  ];

  const filteredFeedback = filter === 'all'
    ? mockFeedback
    : mockFeedback.filter(f => f.type === filter);

  const positiveCount = mockFeedback.filter(f => f.type === 'positive').length;
  const improvementCount = mockFeedback.filter(f => f.type === 'improvement').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PageHeader
        title="Nhận xét giáo viên"
        subtitle="Nhận xét và đánh giá của giáo viên"
      />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'positive', label: 'Tích cực' },
            { value: 'improvement', label: 'Cần cải thiện' },
          ].map((tab) => (
            <a
              key={tab.value}
              href={`/student/feedback?filter=${tab.value}`}
              className={cn(
                'flex-1 py-2.5 text-center rounded-xl font-black text-xs transition-colors',
                filter === tab.value
                  ? 'bg-[#0284C7] text-white'
                  : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'
              )}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-purple-100 fill-white" />
              <p className="text-purple-100 text-[9px] font-black uppercase">Tích cực</p>
            </div>
            <p className="text-white text-3xl font-extrabold">{positiveCount}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-100 text-[9px] font-black uppercase">⚠</span>
              <p className="text-amber-100 text-[9px] font-black uppercase">Cần lưu ý</p>
            </div>
            <p className="text-white text-3xl font-extrabold">{improvementCount}</p>
          </div>
        </div>

        {/* Feedback List */}
        <h3 className="text-gray-800 font-extrabold text-sm mb-3">Nhận xét gần đây</h3>

        <div className="space-y-3 pb-32 md:pb-8">
          {filteredFeedback.map((feedback) => (
            <div
              key={feedback.id}
              className={cn(
                'bg-white p-4 rounded-2xl border shadow-sm',
                feedback.type === 'improvement' ? 'border-amber-200' : 'border-gray-100'
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-[8px] font-black px-2 py-0.5 rounded-full uppercase',
                    feedback.type === 'positive' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    {feedback.type === 'positive' ? 'Tích cực' : 'Cần lưu ý'}
                  </span>
                  <span className="text-gray-400 text-[9px] font-medium">{feedback.date}</span>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3.5 h-3.5',
                        i < feedback.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0',
                  feedback.type === 'positive' ? 'bg-blue-100 text-[#0284C7]' : 'bg-amber-100 text-amber-600'
                )}>
                  {feedback.initials}
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-800 font-bold text-sm mb-0.5">{feedback.teacherName}</h4>
                  <p className="text-gray-400 text-[9px] font-medium mb-2">{feedback.subject}</p>
                  <p className="text-gray-600 text-xs leading-snug">{feedback.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
