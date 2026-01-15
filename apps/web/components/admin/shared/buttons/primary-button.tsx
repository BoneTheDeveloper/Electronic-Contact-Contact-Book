'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const sizeClasses = {
  small: 'h-10 px-4 text-xs',
  medium: 'h-12 px-6 text-sm',
  large: 'h-14 px-8 text-base',
}

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'medium',
  className,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg',
        'bg-[#0284C7] font-bold uppercase tracking-wider text-white',
        'transition-all duration-200',
        'hover:bg-[#0369a1] hover:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        fullWidth && 'w-full',
        sizeClasses[size],
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang xử lý...
        </>
      ) : (
        children
      )}
    </button>
  )
}
