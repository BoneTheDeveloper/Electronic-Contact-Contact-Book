/**
 * Student Study Materials Page
 * Downloadable learning materials by subject
 */

import { PageHeader } from '@/components/student/shared/page-header';
import { getSubjectInfo } from '@/components/student/shared/constants';
import { createClient } from '@/lib/supabase/server';
import { Download, FileText, FileImage, FileVideo, FileArchive } from 'lucide-react';

export default async function StudentMaterialsPage() {
  const supabase = await createClient();

  // TODO: Fetch real materials from Supabase
  const mockMaterials = [
    {
      id: '1',
      title: 'Giáo trình Toán học - Chương 1',
      subjectName: 'Toán học',
      fileType: 'pdf' as const,
      fileSize: '2.5 MB',
      uploadDate: '10/01/2026',
    },
    {
      id: '2',
      title: 'Bài tập Ngữ văn - Tuần 1',
      subjectName: 'Ngữ văn',
      fileType: 'doc' as const,
      fileSize: '1.2 MB',
      uploadDate: '08/01/2026',
    },
    {
      id: '3',
      title: 'Video bài giảng Vật lý - Động lực',
      subjectName: 'Vật lý',
      fileType: 'video' as const,
      fileSize: '125 MB',
      uploadDate: '05/01/2026',
    },
    {
      id: '4',
      title: 'Ảnh thí nghiệm Hóa học',
      subjectName: 'Hóa học',
      fileType: 'image' as const,
      fileSize: '3.8 MB',
      uploadDate: '03/01/2026',
    },
  ];

  const fileIcons = {
    pdf: FileText,
    doc: FileText,
    video: FileVideo,
    image: FileImage,
    archive: FileArchive,
  };

  const fileColors = {
    pdf: 'text-red-600 bg-red-100',
    doc: 'text-blue-600 bg-blue-100',
    video: 'text-purple-600 bg-purple-100',
    image: 'text-emerald-600 bg-emerald-100',
    archive: 'text-gray-600 bg-gray-100',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PageHeader
        title="Tài liệu học tập"
        subtitle="Tài liệu và bài học từ giáo viên"
      />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
        {/* Materials List */}
        <div className="space-y-3 pb-32 md:pb-8">
          {mockMaterials.map((material) => {
            const Icon = fileIcons[material.fileType];
            const subjectInfo = getSubjectInfo(material.subjectName);

            return (
              <div
                key={material.id}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {/* File Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${fileColors[material.fileType].split(' ')[1]}`}>
                    <Icon className={`w-6 h-6 ${fileColors[material.fileType].split(' ')[0]}`} />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${subjectInfo.bg} ${subjectInfo.text}`}>
                        {subjectInfo.short}
                      </span>
                    </div>
                    <h4 className="text-gray-800 font-bold text-sm truncate">{material.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-400 text-[9px] font-medium">{material.fileSize}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400 text-[9px] font-medium">{material.uploadDate}</span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button className="w-10 h-10 bg-[#0284C7] rounded-xl flex items-center justify-center hover:bg-[#0369A1] transition-colors flex-shrink-0">
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
