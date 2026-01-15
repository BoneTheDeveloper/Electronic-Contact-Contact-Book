'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type AttendanceStatus = 'P' | 'A' | 'L' | 'E'

interface AttendanceStatusButtonProps {
  status: AttendanceStatus
  active: boolean
  onClick: () => void
  label?: string
  size?: 'sm' | 'md'
}

const statusConfig = {
  P: {
    label: 'P',
    fullLabel: 'Có mặt',
    description: 'Present',
    icon: CheckCircle,
    activeClass: 'bg-green-500 text-white border-green-600',
    inactiveClass: 'bg-white text-green-700 border-green-300 hover:bg-green-50',
    dotClass: 'bg-green-500',
  },
  A: {
    label: 'A',
    fullLabel: 'Vắng',
    description: 'Absent',
    icon: XCircle,
    activeClass: 'bg-red-500 text-white border-red-600',
    inactiveClass: 'bg-white text-red-700 border-red-300 hover:bg-red-50',
    dotClass: 'bg-red-500',
  },
  L: {
    label: 'L',
    fullLabel: 'Trễ',
    description: 'Late',
    icon: Clock,
    activeClass: 'bg-amber-500 text-white border-amber-600',
    inactiveClass: 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50',
    dotClass: 'bg-amber-500',
  },
  E: {
    label: 'E',
    fullLabel: 'Có phép',
    description: 'Excused',
    icon: AlertCircle,
    activeClass: 'bg-blue-500 text-white border-blue-600',
    inactiveClass: 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50',
    dotClass: 'bg-blue-500',
  },
}

export function AttendanceStatusButton({
  status,
  active,
  onClick,
  label,
  size = 'md',
}: AttendanceStatusButtonProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
  }

  if (size === 'sm') {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClick}
        className={cn(
          'h-8 w-8 p-0 font-bold transition-all',
          active ? config.activeClass : config.inactiveClass
        )}
        title={config.fullLabel}
      >
        {label || config.label}
      </Button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 font-bold text-sm transition-all',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        active
          ? `${config.activeClass} focus:ring-${status === 'P' ? 'green' : status === 'A' ? 'red' : status === 'L' ? 'amber' : 'blue'}-500`
          : config.inactiveClass
      )}
    >
      <Icon className={cn('h-4 w-4', !active && 'opacity-70')} />
      <span>{label || config.fullLabel}</span>
      {active && (
        <span
          className={cn(
            'ml-auto h-2 w-2 rounded-full',
            config.dotClass
          )}
        />
      )}
    </button>
  )
}

// Helper function to get status configuration
export function getStatusConfig(status: AttendanceStatus) {
  return statusConfig[status]
}

// Helper function to get all statuses
export function getAllStatuses(): AttendanceStatus[] {
  return ['P', 'A', 'L', 'E']
}
