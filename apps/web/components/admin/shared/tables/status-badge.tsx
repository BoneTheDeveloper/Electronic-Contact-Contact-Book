'use client'

import { cn } from '@/lib/utils'

type Status = 'success' | 'warning' | 'error' | 'info'

export interface StatusBadgeProps {
  status: Status
  label: string
  className?: string
}

const statusStyles: Record<
  Status,
  { bg: string; text: string; dot: string }
> = {
  success: {
    bg: 'bg-green-50 border border-green-200',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  warning: {
    bg: 'bg-orange-50 border border-orange-200',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
  },
  error: {
    bg: 'bg-red-50 border border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
  info: {
    bg: 'bg-teal-50 border border-teal-200',
    text: 'text-teal-700',
    dot: 'bg-teal-500',
  },
}

const statusLabels: Record<Status, string> = {
  success: 'HOÀN THÀNH',
  warning: 'ĐANG XỬ LÝ',
  error: 'LỖI',
  info: 'THÔNG TIN',
}

export function StatusBadge({
  status,
  label,
  className,
}: StatusBadgeProps) {
  const styles = statusStyles[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        styles.bg,
        styles.text,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', styles.dot)} />
      {label || statusLabels[status]}
    </span>
  )
}
