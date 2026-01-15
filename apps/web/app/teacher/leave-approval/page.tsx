'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getLeaveApprovalRequests } from '@/lib/mock-data'
import { Calendar, Clock, CheckCircle, XCircle, User, FileText, Phone } from 'lucide-react'

interface LeaveRequestApproval {
  id: string
  studentId: string
  studentName: string
  classId: string
  className: string
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  submittedDate: string
  parentContact?: string
}

export default function LeaveApprovalPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending')

  // Mock data - in real app, load server-side
  const mockRequests: LeaveRequestApproval[] = [
    {
      id: 'LR001',
      studentId: '1',
      studentName: 'Nguyễn Văn An',
      classId: '10A1',
      className: '10A1',
      startDate: '2026-01-20',
      endDate: '2026-01-22',
      reason: 'Đi cùng gia đình công tác',
      status: 'pending',
      submittedDate: '2026-01-15',
      parentContact: '0901234567',
    },
    {
      id: 'LR002',
      studentId: '2',
      studentName: 'Trần Thị Bình',
      classId: '10A1',
      className: '10A1',
      startDate: '2026-01-18',
      endDate: '2026-01-18',
      reason: 'Đi khám bệnh định kỳ',
      status: 'pending',
      submittedDate: '2026-01-17',
      parentContact: '0901234568',
    },
    {
      id: 'LR003',
      studentId: '3',
      studentName: 'Lê Văn Cường',
      classId: '10A1',
      className: '10A1',
      startDate: '2026-01-16',
      endDate: '2026-01-17',
      reason: 'Ốm, sốt',
      status: 'pending',
      submittedDate: '2026-01-15',
      parentContact: '0901234569',
    },
    {
      id: 'LR004',
      studentId: '4',
      studentName: 'Phạm Thị Dung',
      classId: '10A1',
      className: '10A1',
      startDate: '2026-01-10',
      endDate: '2026-01-12',
      reason: 'Việc gia đình',
      status: 'approved',
      submittedDate: '2026-01-09',
      parentContact: '0901234570',
    },
    {
      id: 'LR005',
      studentId: '5',
      studentName: 'Hoàng Văn Em',
      classId: '10A1',
      className: '10A1',
      startDate: '2026-01-08',
      endDate: '2026-01-08',
      reason: 'Lý do không hợp lý',
      status: 'rejected',
      submittedDate: '2026-01-07',
      parentContact: '0901234571',
    },
  ]

  const pendingRequests = mockRequests.filter((r) => r.status === 'pending')
  const historyRequests = mockRequests.filter((r) => r.status !== 'pending')

  const handleApprove = (requestId: string) => {
    console.log('Approve request:', requestId)
    // TODO: Implement approve logic
  }

  const handleReject = (requestId: string) => {
    console.log('Reject request:', requestId)
    // TODO: Implement reject logic
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const renderRequestCard = (request: LeaveRequestApproval) => (
    <Card
      key={request.id}
      className={`transition-all hover:shadow-md ${
        request.status === 'pending'
          ? 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50'
          : request.status === 'approved'
          ? 'border-green-200 bg-green-50'
          : 'border-red-200 bg-red-50'
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-3">
            {/* Student Info */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-bold text-lg text-gray-900">
                  {request.studentName}
                </div>
                <div className="text-sm text-gray-600">{request.className}</div>
              </div>
              <Badge
                variant="outline"
                className={
                  request.status === 'pending'
                    ? 'bg-amber-100 text-amber-700 border-amber-300'
                    : request.status === 'approved'
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-red-100 text-red-700 border-red-300'
                }
              >
                {request.status === 'pending'
                  ? 'Chờ duyệt'
                  : request.status === 'approved'
                  ? 'Đã duyệt'
                  : 'Đã từ chối'}
              </Badge>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">Thời gian:</span>
              <span className="text-gray-900">
                {formatDate(request.startDate)} - {formatDate(request.endDate)}
              </span>
            </div>

            {/* Reason */}
            <div className="flex items-start gap-2 text-sm">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-700">Lý do:</span>
                <span className="text-gray-900 ml-1">{request.reason}</span>
              </div>
            </div>

            {/* Parent Contact */}
            {request.parentContact && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Liên hệ:</span>
                <span className="text-sky-600 font-medium">{request.parentContact}</span>
              </div>
            )}

            {/* Submitted Date */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Nộp đơn ngày {formatDate(request.submittedDate)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {request.status === 'pending' && (
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
                onClick={() => handleReject(request.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Từ chối
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleApprove(request.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Phê duyệt
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Phê duyệt nghỉ phép</h1>
        <p className="text-gray-500">Xét duyệt đơn xin nghỉ của học sinh</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'pending' ? 'default' : 'outline'}
          onClick={() => setActiveTab('pending')}
          className={activeTab === 'pending' ? 'bg-sky-600 hover:bg-sky-700' : ''}
        >
          Chờ phê duyệt
          {pendingRequests.length > 0 && (
            <Badge
              className="ml-2 bg-amber-500 hover:bg-amber-600"
              variant="secondary"
            >
              {pendingRequests.length}
            </Badge>
          )}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          className={activeTab === 'history' ? 'bg-sky-600 hover:bg-sky-700' : ''}
        >
          Lịch sử
        </Button>
      </div>

      {/* Leave Request Cards */}
      <div className="space-y-4">
        {activeTab === 'pending' ? (
          pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <div className="text-gray-500 font-medium">Không có đơn chờ phê duyệt</div>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map(renderRequestCard)
          )
        ) : historyRequests.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <div className="text-gray-500 font-medium">Chưa có lịch sử phê duyệt</div>
            </CardContent>
          </Card>
        ) : (
          historyRequests.map(renderRequestCard)
        )}
      </div>
    </div>
  )
}
