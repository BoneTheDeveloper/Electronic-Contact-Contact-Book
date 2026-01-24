import { NextResponse } from 'next/server'
import { getInvoices } from '@/lib/supabase/queries'
import type { Invoice } from '@/lib/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  let invoices = await getInvoices()

  // Filter by status
  if (status) {
    invoices = invoices.filter((i: Invoice) => i.status === status)
  }

  // Filter by search (student name or invoice ID)
  if (search) {
    invoices = invoices.filter((i: Invoice) =>
      i.studentName.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Calculate statistics
  const totalAmount = invoices.reduce((sum: number, i: Invoice) => sum + i.totalAmount, 0)
  const collectedAmount = invoices
    .filter((i: Invoice) => i.status === 'paid')
    .reduce((sum: number, i: Invoice) => sum + i.paidAmount, 0)
  const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0

  const stats = {
    totalAmount,
    collectedAmount,
    pendingCount: invoices.filter((i: Invoice) => i.status === 'pending').length,
    overdueCount: invoices.filter((i: Invoice) => i.status === 'overdue').length,
    collectionRate,
  }

  return NextResponse.json({
    success: true,
    data: invoices,
    stats,
    total: invoices.length,
  })
}
