import { NextResponse } from 'next/server'
import { getLeaveRequests, getLeaveApprovalRequests } from '@/lib/supabase/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('classId') || '10A1'
  const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | undefined

  const requests = await getLeaveApprovalRequests()

  // Filter by status if provided
  const filtered = status ? requests.filter((r: any) => r.status === status) : requests

  return NextResponse.json({
    success: true,
    data: filtered,
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { requestId, action } = body // action: 'approve' | 'reject'

  // In real implementation, this would update the database
  // For now, just return success
  return NextResponse.json({
    success: true,
    message: action === 'approve' ? 'Đơn đã được phê duyệt' : 'Đơn đã bị từ chối',
    data: { requestId, action, status: action === 'approve' ? 'approved' : 'rejected' },
  })
}
