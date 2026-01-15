'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MessageSquare, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RegularAssessment {
  studentId: string
  studentName: string
  classId: string
  className: string
  subject: string
  status: 'evaluated' | 'pending' | 'needs-attention'
  comment?: {
    category: string
    content: string
  }
  rating?: number // 1-5 stars
  createdAt: string
}

interface StudentAssessmentCardProps {
  assessment: RegularAssessment
  onEvaluate?: (studentId: string) => void
  onEdit?: (studentId: string) => void
  onContactParent?: (studentId: string) => void
}

export function StudentAssessmentCard({
  assessment,
  onEvaluate,
  onEdit,
  onContactParent,
}: StudentAssessmentCardProps) {
  const getStatusConfig = (status: RegularAssessment['status']) => {
    switch (status) {
      case 'evaluated':
        return {
          label: 'Đã đánh giá',
          className: 'border-green-200 bg-green-50',
          badgeColor: 'bg-green-100 text-green-700 border-green-300',
        }
      case 'pending':
        return {
          label: 'Chưa đánh giá',
          className: 'border-amber-200 bg-amber-50 border-dashed border-2',
          badgeColor: 'bg-amber-100 text-amber-700 border-amber-300',
        }
      case 'needs-attention':
        return {
          label: 'Cần chú ý',
          className: 'border-red-200 bg-red-50',
          badgeColor: 'bg-red-100 text-red-700 border-red-300',
        }
    }
  }

  const statusConfig = getStatusConfig(assessment.status)

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        statusConfig.className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-sm text-slate-800">
                {assessment.studentName}
              </h3>
              <Badge variant="outline" className={statusConfig.badgeColor}>
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              {assessment.className} • {assessment.subject}
            </p>
          </div>
          {assessment.rating && (
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3.5 w-3.5',
                    i < assessment.rating!
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      {assessment.comment && (
        <CardContent className="pt-0 pb-3">
          <div className="rounded-lg bg-slate-50 p-2.5">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">
              {assessment.comment.category}
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              {assessment.comment.content}
            </p>
          </div>
        </CardContent>
      )}

      <CardContent className="pt-0">
        <div className="flex gap-2">
          {assessment.status === 'pending' && onEvaluate && (
            <Button
              size="sm"
              variant="default"
              className="flex-1 h-8 text-xs"
              onClick={() => onEvaluate(assessment.studentId)}
            >
              Đánh giá ngay
            </Button>
          )}
          {assessment.status === 'evaluated' && onEdit && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={() => onEdit(assessment.studentId)}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Sửa nhận xét
            </Button>
          )}
          {assessment.status === 'needs-attention' && onContactParent && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs border-red-300 text-red-700 hover:bg-red-50"
              onClick={() => onContactParent(assessment.studentId)}
            >
              <Phone className="h-3 w-3 mr-1" />
              Liên hệ PH
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
