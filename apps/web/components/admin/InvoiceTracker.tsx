import type { Invoice } from '@/lib/types'

interface InvoiceTrackerProps {
  invoices: Invoice[]
}

export function InvoiceTracker({ invoices }: InvoiceTrackerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'overdue':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán'
      case 'pending':
        return 'Chờ thanh toán'
      case 'overdue':
        return 'Quá hạn'
      default:
        return status
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50">
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Mã hóa đơn
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Học sinh
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Số tiền
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Ngày đến hạn
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <span className="text-sm font-bold text-slate-800">{invoice.id}</span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-700">
                {invoice.studentName}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-slate-800">
                {formatCurrency(invoice.amount)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDate(invoice.dueDate)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(
                    invoice.status
                  )}`}
                >
                  {getStatusText(invoice.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
