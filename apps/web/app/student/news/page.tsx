/**
 * Student News & Events Page
 * School news with featured card and list items
 */

import { PageHeader } from '@/components/student/shared/page-header';
import { createClient } from '@/lib/supabase/server';
import { Newspaper, Eye } from 'lucide-react';

export default async function StudentNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const category = params.category || 'all';

  // TODO: Fetch real news from Supabase
  const mockNews = [
    {
      id: '1',
      title: 'Thông báo nghỉ Tết Nguyên Đán 2026',
      summary: 'Trường sẽ nghỉ từ 20/01 đến 02/02/2026. Học sinh quay lại trường vào ngày 03/02/2026.',
      category: 'school' as const,
      isFeatured: true,
      publishDate: 'Hôm nay',
      viewCount: 425,
    },
    {
      id: '2',
      title: 'Lịch họp phụ huynh cuối kỳ I',
      summary: 'Thời gian: 15/01/2026 lúc 18:00. Địa điểm: Phòng học 9A1.',
      category: 'class' as const,
      isFeatured: false,
      publishDate: '2 giờ trước',
      viewCount: 189,
    },
    {
      id: '3',
      title: 'Hội thao thể thao học sinh 2026',
      summary: 'Đăng ký tham gia các môn: Bóng đá, Cầu lông, Điền kinh.',
      category: 'activity' as const,
      isFeatured: false,
      publishDate: 'Hôm qua',
      viewCount: 312,
    },
    {
      id: '4',
      title: 'Kết thúc kỳ thi giữa kỳ I',
      summary: 'Kết quả sẽ được công bố vào ngày 15/01/2026.',
      category: 'school' as const,
      isFeatured: false,
      publishDate: '2 ngày trước',
      viewCount: 523,
    },
  ];

  const categoryColors = {
    school: 'bg-blue-100 text-[#0284C7]',
    class: 'bg-purple-100 text-purple-700',
    activity: 'bg-emerald-100 text-emerald-700',
  };

  const categoryLabels = {
    school: 'Nhà trường',
    class: 'Lớp học',
    activity: 'Hoạt động',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PageHeader
        title="Tin tức & sự kiện"
        subtitle="Cập nhật từ trường và lớp học"
      />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'school', label: 'Nhà trường' },
            { value: 'class', label: 'Lớp học' },
            { value: 'activity', label: 'Hoạt động' },
          ].map((tab) => (
            <a
              key={tab.value}
              href={`/student/news?category=${tab.value}`}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-black text-xs transition-colors ${
                category === tab.value
                  ? 'bg-[#0284C7] text-white'
                  : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Featured News */}
        {mockNews.filter(n => n.isFeatured).map((news) => (
          <div
            key={news.id}
            className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] p-5 rounded-3xl shadow-lg mb-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase backdrop-blur-sm">
                  Nổi bật
                </span>
                <span className="text-blue-100 text-[9px] font-medium">{news.publishDate}</span>
              </div>
              <h3 className="text-white font-extrabold text-base leading-snug mb-2">{news.title}</h3>
              <p className="text-blue-100 text-xs leading-snug mb-3">{news.summary}</p>
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-blue-100" />
                <span className="text-blue-100 text-[9px] font-medium">{news.publishDate}</span>
              </div>
            </div>
          </div>
        ))}

        {/* News List */}
        <h3 className="text-gray-800 font-extrabold text-sm mb-3">Tin mới nhất</h3>

        <div className="space-y-3 pb-32 md:pb-8">
          {mockNews.filter(n => !n.isFeatured).map((news) => (
            <div
              key={news.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${categoryColors[news.category]}`}>
                  {categoryLabels[news.category]}
                </span>
                <span className="text-gray-400 text-[9px] font-medium">{news.publishDate}</span>
              </div>
              <h4 className="text-gray-800 font-bold text-sm leading-snug mb-2">{news.title}</h4>
              <p className="text-gray-500 text-xs leading-snug mb-2">{news.summary}</p>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 text-[9px] font-medium">{news.viewCount} lượt xem</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
