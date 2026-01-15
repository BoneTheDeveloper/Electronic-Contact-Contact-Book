'use client'

import { Badge } from '@/components/ui/badge'
import { GraduationCap, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

type AcademicRatingType = 'excellent-plus' | 'excellent' | 'good' | 'average' | 'needs-improvement'
type ConductRatingType = 'good' | 'fair' | 'average' | 'poor'
type RatingType = AcademicRatingType | ConductRatingType

interface DualRatingBadgeProps {
  type: 'academic' | 'conduct'
  rating: RatingType
  score?: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const ratingConfig: Record<
  RatingType,
  {
    label: string
    labelEn: string
    color: string
    bgClass: string
    textClass: string
    borderClass: string
  }
> = {
  'excellent-plus': {
    label: 'Giỏi xuất sắc',
    labelEn: 'Excellent Plus',
    color: 'green',
    bgClass: 'bg-green-50',
    textClass: 'text-green-700',
    borderClass: 'border-green-300',
  },
  excellent: {
    label: 'Giỏi',
    labelEn: 'Excellent',
    color: 'blue',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-300',
  },
  good: {
    label: 'Khá',
    labelEn: 'Good',
    color: 'sky',
    bgClass: 'bg-sky-50',
    textClass: 'text-sky-700',
    borderClass: 'border-sky-300',
  },
  fair: {
    label: 'Khá',
    labelEn: 'Fair',
    color: 'yellow',
    bgClass: 'bg-yellow-50',
    textClass: 'text-yellow-700',
    borderClass: 'border-yellow-300',
  },
  average: {
    label: 'Trung bình',
    labelEn: 'Average',
    color: 'orange',
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-700',
    borderClass: 'border-orange-300',
  },
  'needs-improvement': {
    label: 'Cần cố gắng',
    labelEn: 'Needs Improvement',
    color: 'red',
    bgClass: 'bg-red-50',
    textClass: 'text-red-700',
    borderClass: 'border-red-300',
  },
  poor: {
    label: 'Yếu',
    labelEn: 'Poor',
    color: 'red',
    bgClass: 'bg-red-50',
    textClass: 'text-red-700',
    borderClass: 'border-red-300',
  },
}

export function DualRatingBadge({
  type,
  rating,
  score,
  size = 'md',
  showIcon = true,
}: DualRatingBadgeProps) {
  const config = ratingConfig[rating]

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  }

  const Icon = type === 'academic' ? GraduationCap : Heart

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-bold border-2 inline-flex items-center gap-1.5',
        config.bgClass,
        config.textClass,
        config.borderClass,
        sizeClasses[size]
      )}
    >
      {showIcon && type === 'academic' && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="opacity-75">({score})</span>
      )}
    </Badge>
  )
}

// Helper function to get rating from score
export function getRatingFromScore(score: number): AcademicRatingType {
  if (score >= 9) return 'excellent-plus'
  if (score >= 8) return 'excellent'
  if (score >= 6.5) return 'good'
  if (score >= 5) return 'average'
  return 'needs-improvement'
}

// Helper function to get all rating options
export function getAllRatings(): { value: RatingType; label: string }[] {
  return Object.entries(ratingConfig).map(([key, config]) => ({
    value: key as RatingType,
    label: config.label,
  }))
}

