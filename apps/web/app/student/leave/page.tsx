/**
 * Student Leave Request Page
 * Form for creating leave requests and viewing history
 */

import { PageHeader } from '@/components/student/shared/page-header';
import { StatusBadge } from '@/components/student/shared/status-badge';
import { createClient } from '@/lib/supabase/server';

export default async function StudentLeaveRequestPage() {
  const supabase = await createClient();

  // TODO: Fetch real leave requests from Supabase
  const mockRequests = [
    {
      id: '1',
      leaveType: 'sick' as const,
      reason: 'Ốm sốt cao',
      startDate: '10/01/2026',
      endDate: '11/01/2026',
      status: 'approved' as const,
      createdAt: '08/01/2026',
    },
    {
      id: '2',
      leaveType: 'family' as const,
      reason: 'Đi công tác cùng gia đình',
      startDate: '20/12/2025',
      endDate: '22/12/2025',
      status: 'pending' as const,
      createdAt: '18/12/2025',
    },
  ];

  const leaveTypes = [
    { value: 'family', label: 'Đi gia đình' },
    { value: 'sick', label: 'Ốm đau' },
    { value: 'holiday', label: 'Lễ tết' },
    { value: 'personal', label: 'Việc cá nhân' },
    { value: 'other', label: 'Khác' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PageHeader
        title="Đơn xin nghỉ phép"
        subtitle="Yêu cầu xin nghỉ học"
      />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button className="flex-1 py-3 text-center rounded-xl bg-[#0284C7] text-white font-black text-sm">
            Tạo đơn mới
          </button>
          <button className="flex-1 py-3 text-center rounded-xl bg-white border border-gray-200 text-gray-400 font-black text-sm hover:bg-gray-50">
            Lịch sử
          </button>
        </div>

        {/* Leave Request Form */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-gray-800 font-extrabold text-base mb-4">Thông tin xin nghỉ</h3>

          <form className="space-y-4">
            {/* Leave Type */}
            <div>
              <label className="block text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">
                Lý do xin nghỉ
              </label>
              <select className="w-full bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]">
                {leaveTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">
                Chi tiết lý do
              </label>
              <textarea
                placeholder="Nhập chi tiết lý do xin nghỉ..."
                rows={3}
                className="w-full bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7] resize-none"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">
                  Từ ngày
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">
                  Đến ngày
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0284C7] to-[#0369A1] py-4 rounded-xl shadow-lg text-white font-extrabold text-sm hover:from-[#0369A1] hover:to-[#0284C7] transition-all"
            >
              Gửi đơn xin nghỉ
            </button>
          </form>
        </div>

        {/* Recent Requests Preview */}
        <h3 className="text-gray-800 font-extrabold text-sm mb-3">Đơn gần đây</h3>

        <div className="space-y-3 pb-32 md:pb-8">
          {mockRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-[9px] font-black uppercase">
                    {request.startDate} - {request.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={request.status} size="sm" />
                  {request.status === 'approved' && (
                    <button className="text-amber-600 text-xs font-medium hover:underline">
                      Phúc khảo
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-800 font-bold text-sm mb-1">{request.reason}</p>
              <p className="text-gray-400 text-[9px] font-medium">
                Ngày tạo: {request.createdAt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
