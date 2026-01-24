/**
 * Student Payments Overview Page
 * Invoice list with status badges and filters
 */

import { PageHeader } from '@/components/student/shared/page-header';
import { StatusBadge } from '@/components/student/shared/status-badge';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function StudentPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const filter = params.filter || 'all';

  // TODO: Fetch real payments from Supabase
  const mockInvoices = [
    {
      id: '1',
      title: 'Học phí tháng 1/2026',
      invoiceNumber: 'HP00126',
      totalAmount: 1500000,
      paidAmount: 0,
      status: 'unpaid' as const,
      dueDate: '15/01/2026',
    },
    {
      id: '2',
      title: 'Học phí tháng 12/2025',
      invoiceNumber: 'HP00125',
      totalAmount: 1500000,
      paidAmount: 1500000,
      status: 'paid' as const,
      dueDate: '15/12/2025',
    },
    {
      id: '3',
      title: 'Học phí tháng 11/2025',
      invoiceNumber: 'HP00124',
      totalAmount: 1500000,
      paidAmount: 1000000,
      status: 'partial' as const,
      dueDate: '15/11/2025',
    },
  ];

  const filteredInvoices = filter === 'all'
    ? mockInvoices
    : mockInvoices.filter(inv => inv.status === filter);

  const totalDebt = mockInvoices.reduce((sum, inv) => {
    const remaining = inv.totalAmount - inv.paidAmount;
    return sum + (remaining > 0 ? remaining : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PageHeader
        title="Học phí"
        subtitle="Quản lý học phí và thanh toán"
      />

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
        {/* Student Info Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-3xl shadow-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-[9px] font-black uppercase tracking-wider mb-1">Học sinh</p>
              <p className="text-white font-extrabold text-lg">Nguyễn Văn A</p>
              <p className="text-gray-400 text-xs font-medium">Mã HS: 2025001</p>
            </div>
          </div>
        </div>

        {/* Total Debt Card */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-3xl shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-100 text-[9px] font-black uppercase tracking-wider mb-1">Tổng nợ</p>
              <p className="text-white text-3xl font-extrabold">
                {new Intl.NumberFormat('vi-VN').format(totalDebt)}đ
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'unpaid', label: 'Chưa đóng' },
            { value: 'partial', label: 'Một phần' },
            { value: 'paid', label: 'Đã đóng' },
          ].map((tab) => (
            <Link
              key={tab.value}
              href={`/student/payments?filter=${tab.value}`}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-black text-xs transition-colors ${
                filter === tab.value
                  ? 'bg-[#0284C7] text-white'
                  : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Invoice List */}
        <div className="space-y-3 pb-32 md:pb-8">
          {filteredInvoices.map((invoice) => {
            const remaining = invoice.totalAmount - invoice.paidAmount;

            return (
              <Link
                key={invoice.id}
                href={`/student/payments/${invoice.id}`}
                className="block bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-gray-800 font-bold text-sm mb-1">{invoice.title}</h4>
                    <p className="text-gray-400 text-[9px] font-medium">{invoice.invoiceNumber}</p>
                  </div>
                  <StatusBadge status={invoice.status} size="sm" />
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-gray-500 text-[9px] font-black uppercase">Hạn đóng</p>
                    <p className="text-gray-800 text-xs font-medium">{invoice.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-[9px] font-black uppercase">
                      {invoice.status === 'paid' ? 'Đã thanh toán' : 'Cần thanh toán'}
                    </p>
                    <p className="text-gray-800 text-sm font-bold">
                      {new Intl.NumberFormat('vi-VN').format(remaining)}đ
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
