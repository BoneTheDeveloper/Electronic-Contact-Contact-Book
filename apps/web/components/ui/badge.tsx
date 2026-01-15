import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
        {
          'border-transparent bg-sky-600 text-white hover:bg-sky-700': variant === 'default',
          'border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'border-transparent bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
          'border-gray-300 text-gray-700': variant === 'outline',
          'border-transparent bg-green-600 text-white hover:bg-green-700': variant === 'success',
          'border-transparent bg-amber-600 text-white hover:bg-amber-700': variant === 'warning',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
