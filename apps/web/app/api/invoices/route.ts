import { NextRequest, NextResponse } from 'next/server'
import { getInvoices, getPaymentStats, type Invoice } from '@/lib/supabase/queries'

// GET /api/invoices - List invoices with filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const classId = searchParams.get('class')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    let invoices = await getInvoices()

    // Filter by status
    if (status && ['paid', 'pending', 'overdue'].includes(status)) {
      invoices = invoices.filter((inv: Invoice) => inv.status === status)
    }

    // Filter by class (student grade field)
    if (classId) {
      const students = await (await import('@/lib/supabase/queries')).getStudents()
      interface Student {
        id: string
        grade: string
      }
      const classStudentIds = students
        .filter((s: Student) => s.grade === classId)
        .map((s: Student) => s.id)
      invoices = invoices.filter((inv: Invoice) => classStudentIds.includes(inv.studentId))
    }

    // Search by student name or invoice ID
    if (search) {
      const searchLower = search.toLowerCase()
      invoices = invoices.filter((inv: Invoice) =>
        inv.studentName.toLowerCase().includes(searchLower) ||
        inv.id.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedInvoices = invoices.slice(startIndex, endIndex)

    // Get stats
    const stats = await getPaymentStats()

    return NextResponse.json({
      success: true,
      data: paginatedInvoices,
      stats,
      pagination: {
        page,
        limit,
        total: invoices.length,
        totalPages: Math.ceil(invoices.length / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch invoices'
      },
      { status: 500 }
    )
  }
}
