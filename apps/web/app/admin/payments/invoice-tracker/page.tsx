import { InvoiceTracker } from '@/components/admin/InvoiceTracker'
import { getInvoices } from '@/lib/supabase/queries'

export default async function InvoiceTrackerPage() {
  const invoices = await getInvoices()

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Theo dõi Học phí</h1>
        <p className="text-slate-500 text-sm">
          Chi tiết trạng thái thanh toán học phí của học sinh
        </p>
      </div>

      <InvoiceTracker invoices={invoices} />
    </div>
  )
}
