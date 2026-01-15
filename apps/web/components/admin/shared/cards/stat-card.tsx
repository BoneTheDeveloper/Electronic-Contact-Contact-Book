'use client'

import { cn } from '@/lib/utils'

export interface StatCardProps {
  title: string
  value: string | number
  trend?: number
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
  className?: string
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    trendUp: 'text-green-600',
    trendDown: 'text-red-600',
  },
}

export function StatCard({
  title,
  value,
  trend,
  icon,
  color = 'blue',
  className,
}: StatCardProps) {
  const styles = colorStyles[color]

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
        'transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="text-3xl font-black text-slate-800">{value}</p>
          {trend !== undefined && (
            <p
              className={cn(
                'mt-2 flex items-center text-xs font-semibold',
                trend >= 0 ? styles.trendUp : styles.trendDown
              )}
            >
              {trend >= 0 ? (
                <svg
                  className="mr-1 h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              ) : (
                <svg
                  className="mr-1 h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              )}
              {Math.abs(trend)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('rounded-xl p-3', styles.iconBg)}>
            <div className={styles.iconColor}>{icon}</div>
          </div>
        )}
      </div>
    </div>
  )
}
