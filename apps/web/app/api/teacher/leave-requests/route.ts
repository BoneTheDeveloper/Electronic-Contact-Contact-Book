import { NextResponse } from 'next/server'
import { getLeaveApprovalRequests } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('classId') || '10A1'
  const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | undefined

  const requests = await getLeaveApprovalRequests(classId, status)

  return NextResponse.json({
    success: true,
    data: requests,
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
