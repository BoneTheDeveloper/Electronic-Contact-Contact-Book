import { NextRequest, NextResponse } from 'next/server'
import { getInvoices } from '@/lib/supabase/queries'
import type { Invoice } from '@school-management/shared-types'

// Export format options
type ExportFormat = 'csv' | 'json' | 'pdf'

// POST /api/invoices/export - Export invoices report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      format = 'csv',
      startDate,
      endDate,
      status,
      include = ['id', 'studentName', 'amount', 'status', 'dueDate', 'paidDate']
    } = body as {
      format?: ExportFormat
      startDate?: string
      endDate?: string
      status?: string
      include?: string[]
    }

    // Validate format
    const validFormats: ExportFormat[] = ['csv', 'json', 'pdf']
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { success: false, error: 'Invalid format (must be csv, json, or pdf)' },
        { status: 400 }
      )
    }

    // Get invoices
    let invoices = await getInvoices()

    // Filter by date range (handle null/undefined dueDate)
    if (startDate) {
      invoices = invoices.filter((inv: Invoice) => inv.dueDate && inv.dueDate >= startDate)
    }
    if (endDate) {
      invoices = invoices.filter((inv: Invoice) => inv.dueDate && inv.dueDate <= endDate)
    }

    // Filter by status
    if (status && ['paid', 'pending', 'overdue'].includes(status)) {
      invoices = invoices.filter((inv: Invoice) => inv.status === status)
    }

    // Filter included fields
    const filteredInvoices = invoices.map((inv: Invoice) => {
      const result: Record<string, string | number> = {}
      include.forEach((field: string) => {
        if (field in inv) {
          result[field] = inv[field as keyof Invoice] as string | number
        }
      })
      return result
    })

    // TODO: Real API - Generate actual file
    // For PDF: Use a library like jsPDF or PDFKit
    // For CSV: Generate proper CSV with headers

    let content: string
    let contentType: string
    let filename: string

    const timestamp = new Date().toISOString().split('T')[0]

    switch (format) {
      case 'json':
        content = JSON.stringify({
          generatedAt: new Date().toISOString(),
          totalRecords: filteredInvoices.length,
          data: filteredInvoices
        }, null, 2)
        contentType = 'application/json'
        filename = `invoices-${timestamp}.json`
        break

      case 'csv': {
        // Generate CSV
        const headers = include.join(',')
        const rows = filteredInvoices.map((inv: Record<string, string | number>) =>
          include.map((field: string) => {
            const value = inv[field]
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value ?? '')
            if (stringValue.includes(',') || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`
            }
            return stringValue
          }).join(',')
        )
        content = [headers, ...rows].join('\n')
        contentType = 'text/csv'
        filename = `invoices-${timestamp}.csv`
        break
      }

      case 'pdf':
        // For PDF, we'd need a PDF library
        // TODO: Implement PDF generation with jsPDF or similar
        return NextResponse.json(
          {
            success: false,
            error: 'PDF export not yet implemented',
            data: filteredInvoices // Return data so client can generate PDF
          },
          { status: 501 }
        )

      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported format' },
          { status: 400 }
        )
    }

    // Return file download response
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': Buffer.byteLength(content).toString()
      }
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export invoices'
      },
      { status: 500 }
    )
  }
}
